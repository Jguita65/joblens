import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// The middleware uses only the edge-safe config (no bcrypt / Prisma), so it can
// run on the edge runtime while still protecting /dashboard and /history.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*", "/compare/:path*"],
};
