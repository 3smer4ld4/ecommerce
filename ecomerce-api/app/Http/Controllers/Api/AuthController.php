<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
    path: "/register",
    summary: "Registrar usuario",
    tags: ["Autenticación"],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["name", "email", "password", "password_confirmation"],
            properties: [
                new OA\Property(property: "name", type: "string", example: "Usuario TechStore"),
                new OA\Property(property: "email", type: "string", format: "email", example: "usuario@example.com"),
                new OA\Property(property: "password", type: "string", format: "password", example: "TechStore123!"),
                new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "TechStore123!")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: "Usuario registrado correctamente."),
        new OA\Response(response: 422, description: "Datos de registro inválidos.")
    ]
    )]
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('techstore-token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado correctamente.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    #[OA\Post(
    path: "/login",
    summary: "Iniciar sesión",
    tags: ["Autenticación"],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["email", "password"],
            properties: [
                new OA\Property(property: "email", type: "string", format: "email", example: "usuario@example.com"),
                new OA\Property(property: "password", type: "string", format: "password", example: "TechStore123!")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Inicio de sesión exitoso."),
        new OA\Response(response: 422, description: "Credenciales incorrectas.")
    ]
    )]
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('techstore-token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    #[OA\Post(
    path: "/logout",
    summary: "Cerrar sesión",
    tags: ["Autenticación"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Sesión cerrada correctamente."),
        new OA\Response(response: 401, description: "No autorizado.")
    ]
    )]

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    #[OA\Get(
    path: "/user",
    summary: "Consultar usuario autenticado",
    tags: ["Autenticación"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Datos del usuario."),
        new OA\Response(response: 401, description: "No autorizado.")
    ]
    )]
    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
