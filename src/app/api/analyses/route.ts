import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPrisma, hasDatabase } from "@/lib/prisma";

// History persistence endpoint. When no database is configured it returns 204
// so the client knows to fall back to localStorage.

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    // No DB: the client keeps its history in localStorage.
    return new NextResponse(null, { status: 204 });
  }

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ analyses });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return new NextResponse(null, { status: 204 });
  }

  let body: {
    title?: string;
    inputText?: string;
    score?: number;
    findings?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const { title, inputText, score, findings } = body;
  if (typeof inputText !== "string" || typeof score !== "number") {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const prisma = getPrisma()!;

  // The seed user has no row in the DB; ensure it exists before linking.
  await prisma.user.upsert({
    where: { id: session.user.id },
    update: {},
    create: {
      id: session.user.id,
      email: session.user.email ?? `${session.user.id}@local`,
      name: session.user.name ?? null,
      passwordHash: "seed",
    },
  });

  const analysis = await prisma.analysis.create({
    data: {
      userId: session.user.id,
      title: title?.trim() || "Análisis sin título",
      inputText,
      score,
      findings: findings as object,
    },
  });

  return NextResponse.json({ analysis }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return new NextResponse(null, { status: 204 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta el id." }, { status: 400 });
  }

  await prisma.analysis.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
