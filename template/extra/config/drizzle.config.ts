import type { Config } from "drizzle-kit";

export default {
  schema: "src/lib/database/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
} satisfies Config;
