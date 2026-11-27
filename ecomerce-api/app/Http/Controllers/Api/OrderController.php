<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class OrderController extends Controller
{
    #[OA\Post(
    path: "/orders",
    summary: "Crear un pedido",
    description: "Crea un pedido para el usuario autenticado y descuenta las existencias.",
    tags: ["Pedidos"],
    security: [["bearerAuth" => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["items"],
            properties: [
                new OA\Property(
                    property: "items",
                    type: "array",
                    items: new OA\Items(
                        type: "object",
                        required: ["product_id", "quantity"],
                        properties: [
                            new OA\Property(property: "product_id", type: "integer", example: 1),
                            new OA\Property(property: "quantity", type: "integer", example: 1)
                        ]
                    )
                )
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: "Pedido creado correctamente."),
        new OA\Response(response: 401, description: "No autorizado."),
        new OA\Response(response: 422, description: "Datos inválidos o stock insuficiente.")
    ]
    )]
    // Crear un pedido
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $order = DB::transaction(function () use ($validated, $request) {
            $total = 0;
            $products = [];

            foreach ($validated['items'] as $item) {
                $product = Product::where('is_active', true)
                    ->lockForUpdate()
                    ->find($item['product_id']);

                if (!$product) {
                    throw ValidationException::withMessages([
                        'items' => ['Uno de los productos no está disponible.'],
                    ]);
                }

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["No hay suficiente stock de {$product->name}."],
                    ]);
                }

                $total += $product->price * $item['quantity'];
                $products[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($products as $item) {
                $product = $item['product'];
                $quantity = $item['quantity'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);

                $product->decrement('stock', $quantity);
            }

            return $order;
        });

        return response()->json([
            'message' => 'Pedido creado correctamente.',
            'order' => $order->load('items.product'),
        ], 201);
    }

    #[OA\Get(
    path: "/orders",
    summary: "Consultar historial de pedidos",
    description: "Obtiene los pedidos del usuario autenticado.",
    tags: ["Pedidos"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Historial de pedidos obtenido correctamente."),
        new OA\Response(response: 401, description: "No autorizado.")
    ]
)]
    // Consultar historial de pedidos del usuario
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }
}
