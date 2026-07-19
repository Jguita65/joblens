// Optional DB seed: creates the test user (test@test.com / test1234) when a
// database is configured. Safe to run repeatedly (idempotent upsert).
// No-op when DATABASE_URL is not set.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL no definida — se omite el seed (modo sin base de datos).");
    return;
  }

  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash("test1234", 10);

  await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Usuario de prueba",
      passwordHash,
    },
  });

  console.log("Usuario de prueba creado/asegurado: test@test.com");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
