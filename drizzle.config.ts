import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL ?? process.env.VITE_DATABASE_URL;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL ?? "",
  },
}) satisfies Config;
