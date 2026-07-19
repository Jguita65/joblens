// Prisma client singleton.
//
// The database is OPTIONAL. `getPrisma()` returns null when DATABASE_URL is not
// defined, which lets every caller degrade gracefully to localStorage instead
// of crashing the app or the deploy.

import { PrismaClient } from "@prisma/client";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Returns a shared PrismaClient, or null when no database is configured. */
export function getPrisma(): PrismaClient | null {
  if (!hasDatabase()) return null;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
