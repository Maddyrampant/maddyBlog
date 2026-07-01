import nodemailer from "nodemailer";

const enabled = process.env.SMTP_HOST && process.env.SMTP_PORT;

const transporter = enabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    })
  : null;

const from = process.env.SMTP_FROM || "noreply@maddyblog.com";

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  if (!transporter) {
    console.log(`[email] DEV MODE — would send email to ${options.to}`);
    console.log(`[email] Subject: ${options.subject}`);
    console.log(`[email] Body: ${options.text}`);
    return;
  }

  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}
