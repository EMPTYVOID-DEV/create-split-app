import { dev } from "$app/environment";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { db } from "../database/database";

const adapter = new BetterSqlite3Adapter(db, {
  user: "user",
  session: "session",
});

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes: DatabaseSessionAttributes) => {
    return {
      ...attributes,
    };
  },
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
});
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

interface DatabaseSessionAttributes {}
