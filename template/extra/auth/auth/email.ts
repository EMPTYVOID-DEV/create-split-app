import { API_EMAIL } from "$env/static/private";
import { createTransport } from "nodemailer";

type mailOptions = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendVerificationEmail(email: string, text: string) {
  const transport = createTransport({
    host: "0.0.0.0",
    port: 1025,
  });

  const mailOptions: mailOptions = {
    from: API_EMAIL,
    subject: "Email verification",
    to: email,
    text,
  };
  return transport.sendMail(mailOptions);
}
