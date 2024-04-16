import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const keyTable = sqliteTable(
  "key",
  {
    userId: text("userId", { length: 8 })
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    provider_name: text("provider_name").notNull(),
    provider_id: text("provider_id").notNull(),
    secret: text("secret"),
    verified: integer("verified").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.provider_id, table.provider_name] }),
    };
  }
);
