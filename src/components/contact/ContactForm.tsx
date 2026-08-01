"use client";

import type { ContactField } from "@/lib/domain/contact";

interface ContactFormProps {
  values: Record<string, string>;
  errors: Partial<Record<ContactField, string>>;
  touched: Record<ContactField, boolean>;
  serverMessage: string;
  status: "idle" | "submitting" | "success" | "error";
  isFormValid: boolean;
  isSubmitting: boolean;
  cooldown: boolean;
  timeLeft: number;
  isPenalty: boolean;
  onChange: (field: ContactField, value: string) => void;
  onBlur: (field: ContactField) => void;
  onSubmit: (e: React.FormEvent) => void;
  nameRef: React.RefObject<HTMLInputElement | null>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="text-[10px] text-red-400 mt-1 px-1" role="alert" style={{ fontFamily: "var(--font-mono)" }}>
      {message}
    </p>
  );
}

export default function ContactForm({
  values, errors, touched, serverMessage, status,
  isFormValid, isSubmitting, cooldown, timeLeft, isPenalty,
  onChange, onBlur, onSubmit, nameRef,
}: ContactFormProps) {
  const inputClass = (field: ContactField) => {
    const hasError = touched[field] && errors[field];
    return `w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-300 ${
      hasError
        ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
        : "focus:border-accent focus:shadow-[0_0_12px_rgba(255,107,53,0.1)]"
    }`;
  };

  const inputStyle = (field: ContactField): React.CSSProperties => {
    const hasError = touched[field] && errors[field];
    return {
      background: "#1e1e1e",
      border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(42, 42, 62, 0.5)"}`,
      color: "#e5e5e5",
      fontFamily: "var(--font-mono)",
    };
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="flex items-center gap-2 mb-4 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
        <span className="text-gray-500">to:</span>
        <span className="text-green-400">Abhishek Kumar T</span>
        {timeLeft > 0 && (
          <span className="text-gray-500 ml-auto">
            cooldown: <span className={isPenalty ? "text-accent" : "text-yellow-400"}>{formatTime(timeLeft)}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="contact-name" className="sr-only">Name</label>
          <input
            id="contact-name"
            ref={nameRef}
            type="text"
            placeholder="NAME"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            onBlur={() => onBlur("name")}
            disabled={isSubmitting}
            aria-invalid={touched.name && !!errors.name}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={inputClass("name")}
            style={inputStyle("name")}
          />
          {touched.name && errors.name && (
            <FieldError id="error-name" message={errors.name} />
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="sr-only">Email</label>
          <input
            id="contact-email"
            type="email"
            placeholder="EMAIL"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            disabled={isSubmitting}
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
            className={inputClass("email")}
            style={inputStyle("email")}
          />
          {touched.email && errors.email && (
            <FieldError id="error-email" message={errors.email} />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="sr-only">Subject</label>
        <input
          id="contact-subject"
          type="text"
          placeholder="SUBJECT"
          value={values.subject}
          onChange={(e) => onChange("subject", e.target.value)}
          onBlur={() => onBlur("subject")}
          disabled={isSubmitting}
          aria-invalid={touched.subject && !!errors.subject}
          aria-describedby={errors.subject ? "error-subject" : undefined}
          className={inputClass("subject")}
          style={inputStyle("subject")}
        />
        {touched.subject && errors.subject && (
          <FieldError id="error-subject" message={errors.subject} />
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">Message</label>
        <textarea
          id="contact-message"
          placeholder="MESSAGE"
          rows={6}
          value={values.message}
          onChange={(e) => onChange("message", e.target.value)}
          onBlur={() => onBlur("message")}
          disabled={isSubmitting}
          aria-invalid={touched.message && !!errors.message}
          aria-describedby={errors.message ? "error-message" : undefined}
          className={`${inputClass("message")} resize-none`}
          style={inputStyle("message")}
        />
        {touched.message && errors.message && (
          <FieldError id="error-message" message={errors.message} />
        )}
      </div>

      <input
        type="text"
        name="website"
        value={values.website}
        onChange={(e) => onChange("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="opacity-0 absolute -z-10"
        style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
      />

      <p className="text-[10px] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>
        {'// Protected by spam filters and rate limits'}
      </p>

      {serverMessage && status === "error" && (
        <div
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs animate-fade-in"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.25)",
            fontFamily: "var(--font-mono)",
            color: "#f87171",
          }}
          role="alert"
        >
          <span>✗</span>
          <span>{serverMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting || cooldown}
        className="group relative w-full px-4 py-3 rounded-lg text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent to-red-500 group-hover:scale-105 transition-transform duration-300 disabled:opacity-60" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
        </div>
        <span className="relative z-10 text-white flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span>SENDING...</span>
            </>
          ) : (
            "SEND MESSAGE"
          )}
        </span>
      </button>
    </form>
  );
}
