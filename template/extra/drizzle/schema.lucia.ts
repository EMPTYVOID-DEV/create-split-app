import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// if you have more than provider you may want to replace github_id with provider and provider_id
export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull(),
  github_id: integer("github_id").unique(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashedPassword"),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});
