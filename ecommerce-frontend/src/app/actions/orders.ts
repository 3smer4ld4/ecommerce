
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type CreateOrderResult = {
  error?: string;
  orderId?: number;
};

export async function createOrderAction(
  items: { product_id: number; quantity: number }[]
): Promise<CreateOrderResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("techstore_token")?.value;

  if (!token) {
    redirect("/login");
  }

  if (!items.length) {
    return { error: "El carrito está vacío." };
  }

  let response: Response;

  try {
    response = await fetch(`${process.env.API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
      cache: "no-store",
    });
  } catch {
    return {
      error: "No fue posible conectar con el servidor.",
    };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.message || "No se pudo crear el pedido.",
    };
  }

  revalidatePath("/orders");

  return {
    orderId: data.order.id,
  };
}

export async function createCheckoutAction(orderId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("techstore_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let response: Response;

  try {
    response = await fetch(
      `${process.env.API_URL}/orders/${orderId}/checkout`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  } catch {
    return { error: "No fue posible conectar con el servidor." };
  }

  if (response.status === 401) {
    redirect("/login");
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      error: data.message || "No se pudo iniciar el pago.",
    };
  }

  if (!data.checkout_url) {
    return { error: "Stripe no devolvió el enlace de pago." };
  }

  redirect(data.checkout_url);
}
