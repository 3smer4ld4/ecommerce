<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;
use OpenApi\Attributes as OA;


class StripeWebhookController extends Controller
{

#[OA\Post(
    path: "/stripe/webhook",
    summary: "Recibir notificaciones de Stripe",
    description: "Procesa los eventos de Stripe y actualiza el estado del pedido cuando el pago se completa.",
    tags: ["Pagos"],
    responses: [
        new OA\Response(
            response: 200,
            description: "Webhook recibido correctamente."
        ),
        new OA\Response(
            response: 400,
            description: "Firma o contenido inválido."
        )
    ]
)]

    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');
        if (!$signature || !$webhookSecret) {
        return response('Firma o secreto faltante.', 400);
}
        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                $webhookSecret
            );
        } catch (UnexpectedValueException | SignatureVerificationException $e) {
            return response('Firma o contenido inválido.', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;

            $order = Order::where('id', $session->metadata->order_id ?? null)
                ->where('stripe_session_id', $session->id)
                ->first();

            if ($order && $session->payment_status === 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                ]);
            }
        }

        return response('Webhook recibido correctamente.', 200);
    }
    
}
