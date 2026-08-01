import { describe, it, expect } from "vitest";
import {
  contactSchema,
  RATE_LIMIT,
  CLICK_LIMITS,
  checkForSpam,
  isDisposableEmail,
  checkHoneypot,
  escapeHtml,
  sanitizeField,
  formatZodErrors,
} from "@/lib/domain/contact";

const validInput = {
  name: "Abhishek Kumar",
  email: "abhishek@example.com",
  subject: "Project inquiry",
  message: "Hello, I would like to discuss a project with you.",
};

describe("RATE_LIMIT config", () => {
  it("allows 3 requests per 60s window", () => {
    expect(RATE_LIMIT.MAX_REQUESTS).toBe(3);
    expect(RATE_LIMIT.WINDOW_MS).toBe(60_000);
  });

  it("keeps client click limit separate and lower than API limit", () => {
    expect(CLICK_LIMITS.CLICK_LIMIT).toBe(4);
    expect(CLICK_LIMITS.CLICK_LIMIT).toBeGreaterThanOrEqual(RATE_LIMIT.MAX_REQUESTS);
  });
});

describe("contactSchema", () => {
  it("accepts valid input", () => {
    const result = contactSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("trims whitespace from fields", () => {
    const result = contactSchema.safeParse({
      ...validInput,
      name: "  Abhishek Kumar  ",
      subject: "  Project inquiry  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Abhishek Kumar");
      expect(result.data.subject).toBe("Project inquiry");
    }
  });

  it("rejects a name that is too short", () => {
    const result = contactSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects a name without letters", () => {
    const result = contactSchema.safeParse({ ...validInput, name: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...validInput, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an email with malformed domain (double dot)", () => {
    const result = contactSchema.safeParse({ ...validInput, email: "a@exa..mple.com" });
    expect(result.success).toBe(false);
  });

  it("rejects a subject that is too short", () => {
    const result = contactSchema.safeParse({ ...validInput, subject: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    const result = contactSchema.safeParse({ ...validInput, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a message over the max length", () => {
    const result = contactSchema.safeParse({ ...validInput, message: "x".repeat(5001) });
    expect(result.success).toBe(false);
  });
});

describe("formatZodErrors", () => {
  it("returns one error per field with code and message", () => {
    const result = contactSchema.safeParse({
      name: "A",
      email: "bad",
      subject: "ab",
      message: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      expect(Object.keys(errors)).toEqual(["name", "email", "subject", "message"]);
      expect(errors.name).toEqual({
        code: "validation.name.too_small",
        message: "Please enter your name (at least 2 characters)",
      });
    }
  });
});

describe("checkForSpam", () => {
  it("returns null for normal text", () => {
    expect(checkForSpam("Hello, I would like to discuss a project.")).toBeNull();
  });

  it("detects keyboard smash", () => {
    expect(checkForSpam("asdfghjklqwertyuiop")).toEqual(
      expect.objectContaining({ code: "spam.keyboard_smash" })
    );
  });

  it("detects repetitive text", () => {
    // Alternating pattern: no triple chars (avoids keyboard-smash), low unique ratio.
    expect(checkForSpam("abacabacabacabacabacabac")).toEqual(
      expect.objectContaining({ code: "spam.repetitive" })
    );
  });

  it("detects low vowel ratio (consonant mash)", () => {
    expect(checkForSpam("bcdfghjklmnpqrstvwxyz")).toEqual(
      expect.objectContaining({ code: "spam.low_vowel_ratio" })
    );
  });

  it("detects blocked keywords", () => {
    expect(checkForSpam("Buy now, free money casino crypto")).toEqual(
      expect.objectContaining({ code: "spam.keyword" })
    );
  });
});

describe("isDisposableEmail", () => {
  it("detects known disposable domains", () => {
    expect(isDisposableEmail("mailinator.com")).toBe(true);
    expect(isDisposableEmail("GUERRILLAMAIL.COM")).toBe(true);
  });

  it("allows regular domains", () => {
    expect(isDisposableEmail("gmail.com")).toBe(false);
    expect(isDisposableEmail("example.com")).toBe(false);
  });
});

describe("checkHoneypot", () => {
  it("flags a filled honeypot field", () => {
    expect(checkHoneypot({ website: "http://spam.example" })).toBe(true);
  });

  it("passes an empty or missing honeypot", () => {
    expect(checkHoneypot({ website: "" })).toBe(false);
    expect(checkHoneypot({})).toBe(false);
    expect(checkHoneypot(null)).toBe(false);
  });
});

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<script>"alert('x')"</script>`)).toBe(
      "&lt;script&gt;&quot;alert(&#039;x&#039;)&quot;&lt;/script&gt;"
    );
  });
});

describe("sanitizeField", () => {
  it("collapses newlines and truncates to max length", () => {
    const value = "line1\nline2\r\nline3";
    expect(sanitizeField(value, 11)).toBe("line1 line2");
    expect(sanitizeField("  padded  ", 100)).toBe("padded");
  });
});
