import { dev } from "$app/environment";
import { sendVerificationEmail } from "$lib/server/auth/email";
import { db } from "$lib/server/database/database";
import { verifyEmail, verifyPassword } from "$lib/server/utils/authUtils";
import { fail, type Actions, error, redirect } from "@sveltejs/kit";
import otpGen from "otp-generator";
import { Argon2id } from "oslo/password";

export const actions: Actions = {
  send: async ({ request, cookies }) => {
    const fd = await request.formData();
    const email = fd.get("email").toString();
    if (!verifyEmail(email)) return fail(403, { message: "Invalid email" });
    const user = await db.key
      .findUnique({
        where: {
          provider_id_provider_name: {
            provider_id: email,
            provider_name: "email",
          },
        },
      })
      .catch(() => error(500, "Service unavailable"));
    if (!user)
      return fail(403, {
        message: "This email is not attached to an account.",
      });

    const otp = otpGen.generate(6, {
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    try {
      await sendVerificationEmail(email, otp);
      cookies.set("otp", otp, {
        path: "/auth/password-reset",
        httpOnly: true,
        maxAge: 60 * 10,
        secure: !dev,
      });
    } catch (error) {
      return fail(400, { message: "Failed to send you an email" });
    }
  },
  verify: async ({ cookies, request }) => {
    const fd = await request.formData();
    const enteredOtp = fd.get("otp");
    const validOtp = cookies.get("otp");
    if (!validOtp)
      return fail(400, { message: "The code has expired, try resend." });
    // you can clear the cookie here
    if (enteredOtp != validOtp)
      return fail(403, { message: "The entered code is not valid." });
  },
  reset: async ({ request }) => {
    const fd = await request.formData();
    const password = fd.get("password").toString();
    const email = fd.get("email").toString();
    if (!verifyPassword(password))
      return fail(403, {
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)",
      });
    const hashedPassword = await new Argon2id().hash(password);
    // here we change the password as well as set the verify column to true since we sent the user an email.
    await db.key
      .update({
        where: {
          provider_id_provider_name: {
            provider_id: email,
            provider_name: "email",
          },
        },
        data: {
          verified: 1,
          secret: hashedPassword,
        },
      })
      .catch(() => error(500, "Service unavailable"));
    redirect(302, "/auth");
  },
};
