import { dev } from "$app/environment";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { db } from "../database/database.server.ts";

const adapter = BetterSqlite3Adapter(db, {
  user: "user",
  session: "session",
});

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
