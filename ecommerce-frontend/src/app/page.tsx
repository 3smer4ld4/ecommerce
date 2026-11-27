
import { getProducts } from "@/lib/api";
import Cart from "@/components/Cart";
import { cookies } from "next/headers";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();

  const cookieStore = await cookies();
  const token = cookieStore.get("techstore_token")?.value;
  const isAuthenticated = Boolean(token);

  return (
    <main className="min-h-screen bg-[#0b1020]">
      {/* Encabezado */}
      <header className="border-b border-white/10 bg-[#11182b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-extrabold tracking-wide">
            Tech<span className="text-indigo-400">Store.</span>
          </h1>

          <nav className="flex items-center gap-6 text-sm text-gray-300">
            <a href="#inicio" className="hover:text-indigo-400">
              Inicio
            </a>

            <a href="#productos" className="hover:text-indigo-400">
              Productos
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  href="/orders"
                  className="hover:text-indigo-400"
                >
                  Mis pedidos
                </Link>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-red-400 hover:text-red-300"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-indigo-400"
                >
                  Iniciar sesión
                </Link>

                <Link
                  href="/register"
                  className="hover:text-indigo-400"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Presentación */}
      <section
        id="inicio"
        className="mx-auto max-w-7xl px-6 py-20"
      >
        <div className="max-w-2xl">
          <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
            Tecnología para todos
          </span>

          <h2 className="mt-7 text-5xl font-extrabold leading-tight text-white md:text-6xl">
            Equipa tu mundo con la mejor
            <span className="text-indigo-400">
              {" "}tecnología.
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            Descubre accesorios y dispositivos tecnológicos
            para mejorar tu experiencia digital.
          </p>

          <a
            href="#productos"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-7 py-3 font-semibold transition hover:bg-indigo-500"
          >
            Explorar productos →
          </a>
        </div>
      </section>

      {/* Catálogo y carrito */}
      <Cart products={products} />

      {/* Pie de página */}
      <footer className="border-t border-white/10 bg-[#11182b] px-6 py-8 text-center text-sm text-gray-500">
        © 2026 TechStore. Todos los derechos reservados a mi Gato :3.
      </footer>
    </main>
  );
}
