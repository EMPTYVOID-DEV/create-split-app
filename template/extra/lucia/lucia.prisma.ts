import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { Lucia } from "lucia";
import { db } from "../database/database.server.ts";

const adapter = new PrismaAdapter(db.session, db.user);

export const auth = Lucia(adapter, {
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
