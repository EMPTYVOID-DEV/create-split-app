import { drizzle } from "drizzle-orm/better-sqlite3";
import database from "better-sqlite3";
import { DB_URL } from "$env/static/private";
import * as schema from "$lib/server/database/schema";

const sqliteclient = new database(DB_URL);

export const db = drizzle(sqliteclient, {
  schema,
});
