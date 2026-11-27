
"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

const initialState = "";

export default function LoginPage() {
  const [message, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151e33] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-extrabold">
            Tech<span className="text-indigo-400">Store.</span>
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Bienvenido de nuevo
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Inicia sesión para continuar comprando.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Tu contraseña"
              className="w-full rounded-lg border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          {message && (
            <p role="alert" className="text-sm text-red-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {pending ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Regístrate
          </Link>
        </p>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-gray-500 hover:text-white"
        >
          ← Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
