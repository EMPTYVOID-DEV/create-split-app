import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const table = sqliteTable("table", {
  id: integer("id").primaryKey().notNull(),
});
