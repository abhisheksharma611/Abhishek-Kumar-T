import nodemailer from "nodemailer";
import { getConfig } from "@/lib/config";
import { escapeHtml } from "@/lib/domain/contact";
import { logger } from "@/lib/logger";

const EMAIL_TIMEOUT_MS = 15_000;

interface SendEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const config = getConfig();
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: config.email.user, pass: config.email.pass },
    });
  }
  return transporter;
}

function buildHtml(data: SendEmailParams): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #1e1e1e; color: #e5e5e5; border-radius: 8px;">
      <h2 style="color: #ff6b35;">New Contact Form Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <hr style="border-color: #333;" />
      <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
    </div>
  `;
}

async function sendWithTimeout(mailOptions: nodemailer.SendMailOptions): Promise<void> {
  const transport = getTransporter();

  await Promise.race([
    transport.sendMail(mailOptions),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Email timeout")), EMAIL_TIMEOUT_MS)
    ),
  ]);
}

export async function sendContactEmail(data: SendEmailParams): Promise<void> {
  const config = getConfig();

  logger.info("Sending contact email", {
    to: config.email.user,
    from: data.email,
  });

  await sendWithTimeout({
    from: config.email.user,
    to: config.email.user,
    replyTo: data.email,
    subject: `Portfolio Contact: ${data.subject}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
    html: buildHtml(data),
  });

  logger.info("Contact email sent successfully");
}
