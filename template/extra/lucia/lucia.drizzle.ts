import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { dev } from "$app/environment";
import { Lucia } from "lucia";
import { db } from "../database/database.ts";
import { sessionTable, userTable } from "../database/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      ...attributes,
    };
  },
  sessionCookie: {
    secure: !dev,
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: {};
  }
}
