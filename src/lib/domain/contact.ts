import { z } from "zod";

export const CONTACT_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 254,
  SUBJECT_MIN: 3,
  SUBJECT_MAX: 200,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 60_000,
  MAX_REQUESTS: 3,
} as const;

export const CLICK_LIMITS = {
  CLICK_LIMIT: 4,
  CLICK_WINDOW_MS: 60_000,
  PENALTIES: [60, 120, 300, 500] as readonly number[],
} as const;

export const MAX_PAYLOAD_SIZE = 100_000;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.NAME_MIN, `Please enter your name (at least ${CONTACT_LIMITS.NAME_MIN} characters)`)
    .max(CONTACT_LIMITS.NAME_MAX, `Name is too long (max ${CONTACT_LIMITS.NAME_MAX} characters)`)
    .regex(/[a-zA-Z]{2,}/, "Name must contain at least 2 letters"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address")
    .max(CONTACT_LIMITS.EMAIL_MAX, "Email address is too long")
    .email("Please enter a valid email address (e.g. name@domain.com)")
    .refine(
      (val) => {
        const domain = val.split("@")[1]?.toLowerCase();
        if (!domain) return false;
        return !domain.includes("..") && !domain.startsWith(".") && !domain.endsWith(".");
      },
      { message: "Email domain contains invalid characters" }
    ),
  subject: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.SUBJECT_MIN, `Please enter a subject (at least ${CONTACT_LIMITS.SUBJECT_MIN} characters)`)
    .max(CONTACT_LIMITS.SUBJECT_MAX, `Subject is too long (max ${CONTACT_LIMITS.SUBJECT_MAX} characters)`),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.MESSAGE_MIN, `Please enter a message (at least ${CONTACT_LIMITS.MESSAGE_MIN} characters)`)
    .max(CONTACT_LIMITS.MESSAGE_MAX, `Message is too long (max ${CONTACT_LIMITS.MESSAGE_MAX} characters)`),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export interface FieldError {
  code: string;
  message: string;
}

export interface ContactResult {
  success: boolean;
  message: string;
  errors?: Partial<Record<ContactField, FieldError>>;
}

export function formatZodErrors(error: z.ZodError): Partial<Record<ContactField, FieldError>> {
  const errors: Partial<Record<ContactField, FieldError>> = {};
  for (const issue of error.issues) {
    const path = issue.path[0] as ContactField;
    if (!errors[path]) {
      errors[path] = { code: `validation.${path}.${issue.code}`, message: issue.message };
    }
  }
  return errors;
}

function vowelRatio(str: string): number {
  const letters = str.replace(/[^a-zA-Z]/g, "");
  if (letters.length === 0) return 1;
  const vowels = letters.match(/[aeiou]/gi);
  return vowels ? vowels.length / letters.length : 0;
}

function isKeyboardSmash(str: string): boolean {
  const s = str.toLowerCase();
  const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  let maxStreak = 0;
  let currentStreak = 1;
  for (let i = 1; i < s.length; i++) {
    const prev = s[i - 1];
    const curr = s[i];

    if (!/[a-z]/.test(curr) || !/[a-z]/.test(prev)) {
      currentStreak = 1;
      continue;
    }

    const sameRow = keyboardRows.some(
      (row) => row.includes(curr) && row.includes(prev)
    );
    if (sameRow) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  if (maxStreak >= 8) return true;

  let sameCharStreak = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      sameCharStreak++;
      if (sameCharStreak >= 3) return true;
    } else {
      sameCharStreak = 1;
    }
  }

  return false;
}

function isHighlyRepetitive(str: string): boolean {
  if (str.length < 10) return false;
  const unique = new Set(str.toLowerCase().replace(/[^a-z]/g, ""));
  if (unique.size === 0) return false;
  return unique.size / str.length < 0.15;
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "throwaway.email", "yopmail.com", "sharklasers.com", "trashmail.com",
  "maildrop.cc", "getnada.com", "temp-mail.org", "fakeinbox.com",
]);

const SPAM_KEYWORDS = [
  "buy now", "click here", "free money", "casino", "crypto", "seo service",
  "earn money", "work from home", "click below", "limited offer", "act now",
  "congratulations you won", "cheap", "discount", "viagra", " lottery ",
  "investment", "bitcoin", "etherium", "referral", "sign up bonus",
];

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeField(value: string, maxLength: number): string {
  return value.replace(/[\r\n]/g, " ").trim().slice(0, maxLength);
}

export function checkForSpam(text: string): FieldError | null {
  const lower = text.toLowerCase();

  if (isKeyboardSmash(text)) {
    return { code: "spam.keyboard_smash", message: "Text appears to be keyboard spam" };
  }

  if (isHighlyRepetitive(text)) {
    return { code: "spam.repetitive", message: "Text appears to be spam" };
  }

  if (vowelRatio(text) < 0.15 && text.length >= 4) {
    return { code: "spam.low_vowel_ratio", message: "Text appears to be invalid" };
  }

  for (const keyword of SPAM_KEYWORDS) {
    if (lower.includes(keyword)) {
      return { code: "spam.keyword", message: "Text contains blocked content" };
    }
  }

  return null;
}

export function isDisposableEmail(domain: string): boolean {
  return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
}

export function checkHoneypot(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const website = (body as Record<string, unknown>).website;
  return typeof website === "string" && website.length > 0;
}
