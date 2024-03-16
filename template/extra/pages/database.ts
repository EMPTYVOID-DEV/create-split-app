import Database from "better-sqlite3";
import { env } from "$env/static/private";

export const db = new Database(env.DB_URL);
