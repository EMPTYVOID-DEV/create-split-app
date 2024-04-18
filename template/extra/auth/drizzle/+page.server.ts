import { db } from "$lib/server/database/database";
import { userTable, keyTable } from "$lib/server/database/schema";
import {
  createSession,
  verifyEmail,
  verifyPassword,
} from "$lib/server/utils/authUtils";
import { error, type Actions, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
  "sign up": async ({ request }) => {
    const fd = await request.formData();
    const username = fd.get("username").toString();
    const email = fd.get("email").toString();
    const password = fd.get("password").toString();
    if (username.length < 4)
      return fail(403, {
        message: "Username should contain at least 4 characters",
      });
    if (!verifyEmail(email)) return fail(403, { message: "Invalid email" });
    if (!verifyPassword(password))
      return fail(403, {
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
      });
    const id = generateId(8);
    const hashedPassword = await new Argon2id().hash(password);
    const newUser = {
      id,
      username,
    };
    const key = {
      provider_name: "email",
      provider_id: email,
      userId: id,
      secret: hashedPassword,
      verified: 0,
    };
    try {
      await db.transaction(async (tx) => {
        await tx.insert(userTable).values(newUser);
        await tx.insert(keyTable).values(key);
      });
    } catch (err) {
      if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY")
        return fail(409, {
          message: "It seems that this account already exist.",
        });
      error(500, "Service unavailable");
    }
    redirect(302, `/auth/email-verification/${email}`);
  },
  "sign in": async ({ cookies, request }) => {
    const fd = await request.formData();
    const email = fd.get("email").toString();
    const password = fd.get("password").toString();
    if (!verifyEmail(email)) return fail(403, { message: "Invalid email" });
    if (!verifyPassword(password))
      return fail(403, {
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
      });
    const userKey = await db.query.keyTable
      .findFirst({
        where: and(
          eq(keyTable.provider_name, "email"),
          eq(keyTable.provider_id, email)
        ),
      })
      .catch(() => error(500, "Service unavailable"));
    if (!userKey)
      return fail(404, { message: "It seems the user does not exist." });
    const isValid = await new Argon2id().verify(userKey.secret, password);
    if (!isValid) return fail(403, { message: "The password is not correct." });
    // in case the user has verified his account create a session and redirect him to account page
    if (userKey.verified == 1) {
      await createSession(cookies, userKey.userId).catch(() =>
        error(500, "Service unavailable")
      );
      redirect(302, "/");
    }
    redirect(302, `/auth/email-verification/${email}`);
  },
};
