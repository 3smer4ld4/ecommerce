
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _previousState: string,
  formData: FormData
): Promise<string> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return "Completa todos los campos.";
  }

  try {
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return data.message || "Correo o contraseña incorrectos.";
    }

    const cookieStore = await cookies();

    cookieStore.set("techstore_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch {
    return "No fue posible conectar con el servidor.";
  }

  redirect("/");
}


export async function registerAction(
  _previousState: string,
  formData: FormData
): Promise<string> {
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const passwordConfirmation =
    formData.get("password_confirmation")?.toString() ?? "";

  if (!name || !email || !password || !passwordConfirmation) {
    return "Completa todos los campos.";
  }

  if (password !== passwordConfirmation) {
    return "Las contraseñas no coinciden.";
  }

  try {
    const response = await fetch(`${process.env.API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return data.message || "No fue posible crear la cuenta.";
    }

    const cookieStore = await cookies();

    cookieStore.set("techstore_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch {
    return "No fue posible conectar con el servidor.";
  }

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("techstore_token")?.value;

  if (token) {
    try {
      await fetch(`${process.env.API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
    } catch {
      // Aunque falle la API, eliminamos la sesión local.
    }
  }

  cookieStore.delete("techstore_token");
  redirect("/");
}
