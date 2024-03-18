import { dev } from "$app/environment";
import { Lucia } from "lucia";

// create your adapter
const adapter = new Adapter();

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
