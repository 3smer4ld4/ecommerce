
import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] px-6 text-white">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
        <div className="mb-4 text-6xl">⚠️</div>

        <h1 className="text-3xl font-bold">
          Pago cancelado
        </h1>

        <p className="mt-4 text-slate-400">
          No se realizó ningún cobro. Tu pedido permanece
          registrado y puedes intentar pagar nuevamente.
        </p>

        <Link
          href="/orders"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
        >
          Ver mis pedidos
        </Link>

        <div>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-indigo-400 hover:text-indigo-300"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
