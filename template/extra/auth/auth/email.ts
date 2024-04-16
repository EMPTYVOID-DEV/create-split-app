import { MAIL_KEY, API_EMAIL } from "$env/static/private";
import type { mailOptions } from "$server/types.server";
import { createTransport } from "nodemailer";

export async function sendVerificationEmail(email: string, code: string) {
  const transport = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: API_EMAIL,
      pass: MAIL_KEY,
    },
  });

  const mailOptions: mailOptions = {
    from: API_EMAIL,
    subject: "Email verification",
    to: email,
    text: code,
  };
  return transport.sendMail(mailOptions);
}
2;
