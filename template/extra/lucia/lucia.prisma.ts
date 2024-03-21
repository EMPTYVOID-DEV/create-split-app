import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { Lucia } from "lucia";
import { db } from "$lib/database/database";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes: DatabaseUserAttributes) => {
    return {
      githubId: attributes.github_id,
      username: attributes.username,
      email: attributes.email,
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
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseSessionAttributes {}

interface DatabaseUserAttributes {
  github_id: number;
  username: string;
  email: string;
}
