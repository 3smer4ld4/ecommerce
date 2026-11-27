<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use OpenApi\Attributes as OA;

class PaymentController extends Controller
{

#[OA\Post(
    path: "/orders/{orderId}/checkout",
    summary: "Crear sesión de pago con Stripe",
    description: "Genera una sesión de Stripe Checkout para pagar un pedido pendiente.",
    tags: ["Pagos"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(
            name: "orderId",
            in: "path",
            required: true,
            schema: new OA\Schema(type: "integer"),
            example: 1
        )
    ],
    responses: [
        new OA\Response(
            response: 200,
            description: "Sesión de pago creada correctamente."
        ),
        new OA\Response(
            response: 401,
            description: "No autorizado."
        ),
        new OA\Response(
            response: 404,
            description: "Pedido no encontrado."
        ),
        new OA\Response(
            response: 422,
            description: "El pedido ya está pagado."
        )
    ]
)]

    public function checkout(Request $request, int $orderId): JsonResponse
    {
        // Buscar el pedido del usuario autenticado
        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($orderId);

        // Evitar pagar pedidos ya pagados
        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Este pedido ya está pagado.',
            ], 422);
        }

        // Conectar con Stripe
        $stripe = new StripeClient(config('services.stripe.secret'));

        // Crear sesión de pago
        $session = $stripe->checkout->sessions->create([
            'mode' => 'payment',

            'success_url' => 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:3000/checkout/cancel',

            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Pedido TechStore #' . $order->id,
                        ],
                        'unit_amount' => (int) round($order->total * 100),
                    ],
                    'quantity' => 1,
                ],
            ],

            'metadata' => [
                'order_id' => (string) $order->id,
            ],
        ]);

        // Guardar el identificador de la sesión
        $order->update([
            'stripe_session_id' => $session->id,
        ]);

        return response()->json([
            'message' => 'Sesión de pago creada correctamente.',
            'checkout_url' => $session->url,
        ]);
    }
}
