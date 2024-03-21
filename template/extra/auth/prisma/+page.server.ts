import { db } from "$lib/database/database";
import { createSession } from "$lib/utils/authUtils";
import { error, type Actions, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

export const actions: Actions = {
  signup: async ({ request, cookies }) => {
    const fd = await request.formData();
    const username = fd.get("username").toString();
    const email = fd.get("email").toString();
    const password = fd.get("password").toString();

    if (!verifyEmail(email)) return "You should enter a valid email.";
    if (!verifyPassword(password))
      return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)";

    try {
      const userId = generateId(12);
      const hashedPassword = await new Argon2id().hash(password);
      await db.user.create({
        data: {
          id: userId,
          username,
          email,
          hashedPassword,
        },
      });
      await createSession(cookies, { httpOnly: true, path: "/" }, userId);
    } catch (err) {
      if (err.code === "P2002")
        return "It seems that this account already exist";
      error(500, "Service unavailable");
    }
    redirect(302, "/");
  },

  signin: async ({ cookies, request }) => {
    const fd = await request.formData();
    const email = fd.get("email").toString();
    const password = fd.get("password").toString();

    if (!verifyEmail(email)) return "You should enter a valid email.";
    if (!verifyPassword(password))
      return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)";

    try {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      // here the user may have an account but it was created through github auth
      if (!existingUser || !existingUser.hashedPassword)
        return "It seems the user does not exist.";

      const isValid = await new Argon2id().verify(
        existingUser.hashedPassword,
        password
      );

      if (!isValid) return "Your password is not correct";

      await createSession(
        cookies,
        { httpOnly: true, path: "/" },
        existingUser.id
      );
    } catch (err) {
      error(500, "Service unavailable");
    }
    redirect(302, "/");
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
