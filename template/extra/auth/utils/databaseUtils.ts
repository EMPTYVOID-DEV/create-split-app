import { db } from "$server/database/database";
import { keyTable, userTable } from "$server/database/schema";
import type { key, user } from "$server/types.server";

export async function insertUser(newUser: user, key: key) {
  return db.transaction(async (tx) => {
    await tx.insert(userTable).values(newUser);
    await tx.insert(keyTable).values(key);
  });
}
