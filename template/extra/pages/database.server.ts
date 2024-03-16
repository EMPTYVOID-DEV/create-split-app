import Database from "better-sqlite3";

export const sqliteClient = new Database("localDB/sqlite.db");
