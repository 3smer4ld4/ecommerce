<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class ProductController extends Controller
{
    #[OA\Get(
        path: "/products",
        summary: "Listar productos",
        description: "Obtiene los productos activos de TechStore.",
        tags: ["Productos"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de productos obtenida correctamente."
            )
        ]
    )]
    public function index(): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->latest()
            ->paginate(12);

        return response()->json($products);
    }

    #[OA\Get(
        path: "/products/{id}",
        summary: "Consultar un producto",
        description: "Obtiene los detalles de un producto activo.",
        tags: ["Productos"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Producto encontrado."
            ),
            new OA\Response(
                response: 404,
                description: "Producto no encontrado."
            )
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $product = Product::where('is_active', true)
            ->findOrFail($id);

        return response()->json($product);
    }
}
