import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { hasDatabase } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const { email, password, name } = body;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña son obligatorios." },
      { status: 400 }
    );
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        error:
          "El registro requiere base de datos (DATABASE_URL no está configurada). Usa la cuenta de prueba: test@test.com / test1234.",
      },
      { status: 503 }
    );
  }

  const result = await createUser(email, password, name);

  if (!result.ok) {
    if (result.reason === "email-taken") {
      return NextResponse.json(
        { error: "Ese email ya está registrado." },
        { status: 409 }
      );
    }
    if (result.reason === "invalid") {
      return NextResponse.json(
        { error: "Datos inválidos: la contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "No se pudo crear la cuenta." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, email: result.user!.email }, { status: 201 });
}
