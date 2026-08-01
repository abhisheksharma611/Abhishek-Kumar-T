"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contactSchema, CLICK_LIMITS } from "@/lib/domain/contact";
import type { ContactInput, ContactField } from "@/lib/domain/contact";

type FormStatus = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<ContactField, string>>;
type FieldTouched = Record<ContactField, boolean>;

const INITIAL_VALUES: ContactInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const INITIAL_TOUCHED: FieldTouched = {
  name: false,
  email: false,
  subject: false,
  message: false,
  website: false,
};

function validateField(field: ContactField, value: string): string | undefined {
  const result = contactSchema.safeParse({ ...INITIAL_VALUES, [field]: value });
  if (result.success) return undefined;
  const issue = result.error.issues.find((i) => i.path[0] === field);
  return issue?.message;
}

function validateAll(values: ContactInput): FieldErrors {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0] as ContactField;
    if (!errors[path]) errors[path] = issue.message;
  }
  return errors;
}

export function useContactForm() {
  const [values, setValues] = useState<ContactInput>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<FieldTouched>(INITIAL_TOUCHED);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [isPenalty, setIsPenalty] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [penaltyLevel, setPenaltyLevel] = useState(0);

  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      let newTimeLeft = 0;
      let newPenaltyLevel = 0;

      const end = localStorage.getItem("contact_cooldown_end");
      if (end) {
        const remaining = Math.max(0, Math.ceil((parseInt(end, 10) - Date.now()) / 1000));
        if (remaining > 0) {
          newTimeLeft = remaining;
        } else {
          localStorage.removeItem("contact_cooldown_end");
        }
      }

      const saved = localStorage.getItem("contact_penalty_level");
      if (saved) {
        const endTime = localStorage.getItem("contact_cooldown_end");
        if (!endTime || parseInt(endTime) < Date.now()) {
          localStorage.removeItem("contact_penalty_level");
        } else {
          newPenaltyLevel = parseInt(saved, 10);
        }
      }

      if (newTimeLeft > 0 || newPenaltyLevel > 0) {
        const timer = setTimeout(() => {
          if (newTimeLeft > 0) setTimeLeft(newTimeLeft);
          if (newPenaltyLevel > 0) setPenaltyLevel(newPenaltyLevel);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem("contact_cooldown_end");
          const saved = localStorage.getItem("contact_penalty_level");
          if (saved && parseInt(saved) > 0) {
            localStorage.removeItem("contact_penalty_level");
            setPenaltyLevel(0);
          }
          setIsPenalty(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = useCallback(
    (field: ContactField, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => {
          const next = { ...prev };
          if (error) next[field] = error;
          else delete next[field];
          return next;
        });
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (field: ContactField) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const val = values[field] ?? "";
      const error = validateField(field, val);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[field] = error;
        else delete next[field];
        return next;
      });
    },
    [values]
  );

  const resetClickCount = useCallback(() => {
    setClickCount(0);
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
  }, []);

  const startCooldown = useCallback((seconds: number, penalty = false) => {
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem("contact_cooldown_end", endTime.toString());
    setIsPenalty(penalty);
    setTimeLeft(seconds);
  }, []);

  const resetForm = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched(INITIAL_TOUCHED);
    setStatus("idle");
    setServerMessage("");
    resetClickCount();
  }, [resetClickCount]);

  const fieldErrors = validateAll(values);
  const hasErrors = Object.keys(fieldErrors).length > 0;
  const isFormValid =
    !hasErrors &&
    values.name.length > 0 &&
    values.email.length > 0 &&
    values.subject.length > 0 &&
    values.message.length > 0;

  const handleSubmit = useCallback(async () => {
    if (timeLeft > 0 || status === "submitting" || status === "success") return;

    setTouched({ name: true, email: true, subject: true, message: true, website: false });

    const allErrors = validateAll(values);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(resetClickCount, CLICK_LIMITS.CLICK_WINDOW_MS);

    if (newCount >= CLICK_LIMITS.CLICK_LIMIT) {
      const currentLevel = Math.min(penaltyLevel, CLICK_LIMITS.PENALTIES.length - 1);
      const nextLevel = Math.min(penaltyLevel + 1, CLICK_LIMITS.PENALTIES.length - 1);
      setPenaltyLevel(nextLevel);
      localStorage.setItem("contact_penalty_level", nextLevel.toString());
      startCooldown(CLICK_LIMITS.PENALTIES[currentLevel], true);
      setServerMessage(`Too many attempts. Please wait ${CLICK_LIMITS.PENALTIES[currentLevel]}s.`);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const serverErrors: FieldErrors = {};
          for (const [key, msg] of Object.entries(data.errors)) {
            if (key in INITIAL_VALUES) {
              serverErrors[key as ContactField] = (msg as { message: string }).message;
            }
          }
          setErrors(serverErrors);
          setTouched({ name: true, email: true, subject: true, message: true, website: false });
        }
        setServerMessage(data.message || "Failed to send message");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(INITIAL_VALUES);
      resetClickCount();
      startCooldown(60);
    } catch {
      setServerMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }, [values, timeLeft, status, clickCount, penaltyLevel, resetClickCount, startCooldown]);

  return {
    values,
    errors,
    touched,
    status,
    serverMessage,
    timeLeft,
    isPenalty,
    isFormValid,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    cooldown: timeLeft > 0,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
