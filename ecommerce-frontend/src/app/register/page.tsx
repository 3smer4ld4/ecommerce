
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [message, formAction, isPending] = useActionState(
    registerAction,
    ""
  );

const inputStyle =
  "w-full rounded-lg border border-white/10 bg-[#0b1020] px-4 py-3 !text-white placeholder:!text-white caret-white";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1020] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151e33] p-8">
        <h1 className="text-3xl font-extrabold text-white">
          Crear cuenta
        </h1>

        <p className="mt-2 text-gray-400">
          Regístrate para comprar en TechStore.
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              required
              className={inputStyle}
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              className={inputStyle}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className={inputStyle}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="password_confirmation"
              required
              minLength={8}
              className={inputStyle}
              placeholder="Repite tu contraseña"
            />
          </div>

          {message && (
            <p className="text-sm text-red-400" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isPending ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Inicia sesión
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-400 hover:text-white"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
