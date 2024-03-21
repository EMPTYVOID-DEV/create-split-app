import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { dev } from "$app/environment";
import { Lucia } from "lucia";
import { db } from "$lib/database/database";
import { sessionTable, userTable } from "$lib/database/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

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
