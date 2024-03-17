import type { Config } from "drizzle-kit";
import { env } from "$env/static/private";

export default {
  schema: "src/lib/database/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DB_URL,
  },
} satisfies Config;
