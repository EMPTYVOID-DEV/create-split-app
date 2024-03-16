import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqliteClient = new Database("localDB/sqlite.db");

export const db = drizzle(sqliteClient);
