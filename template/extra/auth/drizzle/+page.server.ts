import { db } from "$server/database/database";
import { keyTable } from "$server/database/schema";
import { createSession } from "$server/utils/authUtils";
import { insertUser } from "$server/utils/databaseUtils";
import type { key, user } from "$server/types.server";
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
    if (username.lenght < 4)
      return fail(403, {
        message: "Username should contain at least 4 characters",
      });
    if (verifyEmail(email)) return fail(403, { message: "Invalid email" });
    if (verifyPassword(password))
      return fail(403, { message: "Invalid password" });
    const id = generateId(8);
    const hashedPassword = await new Argon2id().hash(password);
    const newUser: user = {
      id,
      username,
    };
    const key: key = {
      provider_name: "email",
      provider_id: email,
      userId: id,
      secret: hashedPassword,
      verified: false,
    };
    try {
      await insertUser(newUser, key);
    } catch (error) {
      if (error.code === "23505")
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
    if (verifyEmail(email)) return fail(403, { message: "Invalid email" });
    if (verifyPassword(password))
      return fail(403, { message: "Invalid password" });
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
    // in case the user has verified his account create a session and redirect him to dashboard
    if (userKey.verified) {
      await createSession(cookies, userKey.userId).catch(() =>
        error(500, "Service unavailable")
      );
      redirect(302, "/account/dashboard");
    }
    redirect(302, `/auth/email-verification/${email}`);
  },
};

function verifyEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function verifyPassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}
