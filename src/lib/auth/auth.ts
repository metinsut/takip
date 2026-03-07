import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";

const betterAuthURL = process.env.VITE_BETTER_AUTH_URL || Bun.env.BETTER_AUTH_URL;
const betterAuthSecret = process.env.VITE_BETTER_AUTH_SECRET || Bun.env.BETTER_AUTH_SECRET;

const googleClientId =
  process.env.GOOGLE_CLIENT_ID || Bun.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ||
  Bun.env.GOOGLE_CLIENT_SECRET ||
  process.env.VITE_GOOGLE_CLIENT_SECRET;

function createAuth() {
  if (!betterAuthURL) {
    throw new Error("BETTER_AUTH_URL is missing at runtime");
  }

  if (!betterAuthSecret) {
    throw new Error("BETTER_AUTH_SECRET is missing at runtime");
  }

  if (!googleClientId) {
    throw new Error("GOOGLE_CLIENT_ID is missing at runtime");
  }

  if (!googleClientSecret) {
    throw new Error("GOOGLE_CLIENT_SECRET is missing at runtime");
  }

  const socialProviders = {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  };

  return betterAuth({
    baseURL: betterAuthURL,
    secret: betterAuthSecret,
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders,
    plugins: [tanstackStartCookies(), admin(), organization()],
  });
}

export const auth = createAuth();
