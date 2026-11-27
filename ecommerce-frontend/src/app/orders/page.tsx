
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  created_at: string;
  items: OrderItem[];
};

export default async function OrdersPage() {
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
    throw new Error("No se pudieron cargar tus pedidos.");
  }

  const result = await response.json();
  const orders: Order[] = result.data;

  return (
    <main className="min-h-screen bg-[#0b1020] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Mis pedidos
            </h1>
            <p className="mt-2 text-gray-400">
              Consulta tus compras realizadas en TechStore.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Volver a la tienda
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#151e33] p-10 text-center">
            <p className="text-lg text-gray-300">
              Todavía no tienes pedidos.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block text-indigo-400 hover:underline"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-white/10 bg-[#151e33] p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Pedido #{order.id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("es-SV")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-indigo-400">
                      ${Number(order.total).toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {order.status} · Pago: {order.payment_status}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-gray-300">
                        {item.product?.name ?? "Producto"} × {item.quantity}
                      </span>
                      <span className="text-gray-400">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
