import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";

const sqliteClient = new Database(env.DB_URL);

export const db = drizzle(sqliteClient);
