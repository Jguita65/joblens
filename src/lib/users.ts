// User lookup and creation with graceful DB degradation.
//
// A built-in seed user (test@test.com / test1234) always works, even without a
// database, so the login demo never fails. Its password is stored as a bcrypt
// hash — never as plaintext — and can be overridden via env.

import bcrypt from "bcryptjs";
import { getPrisma, hasDatabase } from "./prisma";

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
}

/** Default bcrypt hash of "test1234" (cost 10). Overridable via env. */
const DEFAULT_TEST_HASH =
  "$2b$10$/JiXUJOYkTbSlThiVb3x6OLLYABgX6iIBK4SvK4h3FAVtOjEwjngm";

export const SEED_EMAIL = "test@test.com";

function seedUser(): AppUser {
  return {
    id: "seed-user",
    email: SEED_EMAIL,
    name: "Usuario de prueba",
    passwordHash: process.env.AUTH_TEST_PASSWORD_HASH || DEFAULT_TEST_HASH,
  };
}

export async function getUserByEmail(email: string): Promise<AppUser | null> {
  const normalized = email.trim().toLowerCase();

  if (normalized === SEED_EMAIL) {
    return seedUser();
  }

  const prisma = getPrisma();
  if (!prisma) return null;

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  return user ?? null;
}

export async function verifyPassword(
  plain: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(plain, passwordHash);
}

export interface CreateUserResult {
  ok: boolean;
  /** Machine-readable reason on failure. */
  reason?: "no-database" | "email-taken" | "invalid";
  user?: AppUser;
}

/**
 * Register a new user. Requires a database: without DATABASE_URL there is
 * nowhere to persist accounts, so the caller must surface `no-database`.
 */
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<CreateUserResult> {
  const normalized = email.trim().toLowerCase();

  if (!normalized || !password || password.length < 6) {
    return { ok: false, reason: "invalid" };
  }
  if (normalized === SEED_EMAIL) {
    return { ok: false, reason: "email-taken" };
  }
  if (!hasDatabase()) {
    return { ok: false, reason: "no-database" };
  }

  const prisma = getPrisma()!;
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return { ok: false, reason: "email-taken" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: normalized, name: name?.trim() || null, passwordHash },
  });

  return { ok: true, user };
}
