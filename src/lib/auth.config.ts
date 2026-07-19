import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js configuration (no Node-only dependencies). It is shared by
 * the middleware and by the full config in `auth.ts`, which adds the Credentials
 * provider. Session strategy is JWT so authentication works WITHOUT a database.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  providers: [],
  callbacks: {
    /** Protect the app routes; used by the middleware. */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const path = nextUrl.pathname;
      const isProtected =
        path.startsWith("/inicio") ||
        path.startsWith("/dashboard") ||
        path.startsWith("/history") ||
        path.startsWith("/compare") ||
        path.startsWith("/ats") ||
        path.startsWith("/generador") ||
        path.startsWith("/ranking") ||
        path.startsWith("/entrevista") ||
        path.startsWith("/plantillas");

      if (isProtected && !isLoggedIn) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.name = (token.name as string | null) ?? session.user.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
