import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { dev } from "$app/environment";
import { Lucia, type UserSchema } from "lucia";
import { db } from "../database/database.server.ts";
import { sessionTable, userTable } from "../database/schema.ts";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const auth = Lucia(adapter, {
  getUserAttributes: (data: UserSchema) => {
    return {
      ...data,
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
