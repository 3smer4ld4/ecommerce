import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

type OrderItem = {
  id: number;
  quantity: number;
  price: string | number;
  product: {
    name: string;
  };
};

type Order = {
  id: number;
  total: string | number;
  status: string;
  payment_status: string;
  items: OrderItem[];
};

export default async function CheckoutPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("techstore_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${process.env.API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("No se pudieron cargar los pedidos.");
  }

  const result = await response.json();
  const orders: Order[] = result.data;

  const order = orders.find((item) => item.id === Number(id));

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b1020] px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Volver a la tienda
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Resumen de tu pedido
        </h1>

        <p className="mt-2 text-slate-400">
          Pedido #{order.id}
        </p>

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Productos
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 border-b border-slate-700 pb-4"
              >
                <div>
                  <p className="font-medium">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    Cantidad: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Estado del pago: {order.payment_status}
          </p>
        </section>

<CheckoutButton
  orderId={order.id}
  isPaid={order.payment_status === "paid"}
/>
      </div>
    </main>
  );
}
