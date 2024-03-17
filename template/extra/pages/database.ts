import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";

export const db = new Database(env.DB_URL);
