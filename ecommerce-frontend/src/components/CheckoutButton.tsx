
"use client";

import { useState } from "react";
import { createCheckoutAction } from "@/app/actions/orders";

export default function CheckoutButton({
  orderId,
  isPaid,
}: {
  orderId: number;
  isPaid: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setIsLoading(true);
    setError("");

    try {
      const result = await createCheckoutAction(orderId);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch {
      setError("No fue posible iniciar el pago. Inténtalo nuevamente.");
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handlePayment}
        disabled={isPaid || isLoading}
        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPaid
          ? "Pedido pagado"
          : isLoading
            ? "Conectando con Stripe..."
            : "Pagar con Stripe"}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
