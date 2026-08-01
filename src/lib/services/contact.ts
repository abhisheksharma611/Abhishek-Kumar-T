import { contactSchema, formatZodErrors, sanitizeField, checkForSpam, isDisposableEmail, checkHoneypot, CONTACT_LIMITS } from "@/lib/domain/contact";
import type { ContactInput, ContactResult } from "@/lib/domain/contact";
import { checkRateLimit } from "@/lib/infrastructure/rate-limit";
import { sendContactEmail } from "@/lib/infrastructure/email";
import { hasConfig } from "@/lib/config";
import { logger } from "@/lib/logger";

interface ServiceParams {
  body: unknown;
  ip: string;
}

interface ServiceResult extends ContactResult {
  status: number;
}

export async function handleContactRequest({ body, ip }: ServiceParams): Promise<ServiceResult> {
  if (checkHoneypot(body)) {
    logger.info("Honeypot triggered", { ip });
    return { success: false, message: "Please try again later.", status: 400 };
  }

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    logger.warn("Rate limit hit", { ip, retryAfter: rateCheck.retryAfter });
    return {
      success: false,
      message: `Too many requests. Please try again in ${rateCheck.retryAfter} seconds.`,
      status: 429,
    };
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const errors = formatZodErrors(parsed.error);
    logger.info("Contact validation failed", { ip, errors });
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
      status: 400,
    };
  }

  const data = parsed.data;

  const sanitized: ContactInput = {
    name: sanitizeField(data.name, CONTACT_LIMITS.NAME_MAX),
    email: data.email.trim().slice(0, CONTACT_LIMITS.EMAIL_MAX),
    subject: sanitizeField(data.subject, CONTACT_LIMITS.SUBJECT_MAX),
    message: data.message.trim().slice(0, CONTACT_LIMITS.MESSAGE_MAX),
    website: "",
  };

  const nameSpam = checkForSpam(sanitized.name);
  if (nameSpam) {
    logger.info("Spam detected", { field: "name", ip });
    return { success: false, message: "Please fix the highlighted fields.", errors: { name: nameSpam }, status: 400 };
  }

  const subjectSpam = checkForSpam(sanitized.subject);
  if (subjectSpam) {
    logger.info("Spam detected", { field: "subject", ip });
    return { success: false, message: "Please fix the highlighted fields.", errors: { subject: subjectSpam }, status: 400 };
  }

  const messageSpam = checkForSpam(sanitized.message);
  if (messageSpam) {
    logger.info("Spam detected", { field: "message", ip });
    return { success: false, message: "Please fix the highlighted fields.", errors: { message: messageSpam }, status: 400 };
  }

  const domain = sanitized.email.split("@")[1];
  if (domain && isDisposableEmail(domain)) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors: { email: { code: "spam.disposable_email", message: "Disposable email addresses are not allowed" } },
      status: 400,
    };
  }

  if (!hasConfig()) {
    logger.error("Email not configured");
    return {
      success: false,
      message: "Message could not be delivered. Please try again later.",
      status: 500,
    };
  }

  try {
    await sendContactEmail({
      name: sanitized.name,
      email: sanitized.email,
      subject: sanitized.subject,
      message: sanitized.message,
    });
  } catch (err) {
    logger.error("Email delivery failed", { error: String(err) });
    return {
      success: false,
      message: "Message could not be delivered. Please try again later.",
      status: 500,
    };
  }

  return { success: true, message: "Message sent successfully!", status: 200 };
}
