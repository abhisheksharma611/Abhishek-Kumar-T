"use client";

import { useRef, useEffect } from "react";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useContactForm } from "@/hooks/useContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import SuccessState from "@/components/contact/SuccessState";

export default function Contact() {
  const { ref, visible } = useSectionVisibility();
  const nameRef = useRef<HTMLInputElement>(null);
  const {
    values, errors, touched, status, serverMessage,
    isFormValid, isSubmitting, isSuccess, cooldown, timeLeft, isPenalty,
    handleChange, handleBlur, handleSubmit, resetForm,
  } = useContactForm();

  useEffect(() => {
    if (!isSuccess) return;
    const timeout = setTimeout(() => {
      document.getElementById("contact-success-msg")?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <section id="contact" ref={ref} className="min-h-screen flex items-center py-20 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px] max-sm:blur-2xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>$ ./contact.exe</h2>

        <div className={`grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-6 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <ContactInfo status={status} />

          <div
            className="group rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,107,53,0.12),0_0_30px_rgba(255,95,86,0.07)] relative"
            style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#1e1e1e" }}
          >
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                border: "1px solid transparent",
                background: "linear-gradient(transparent, transparent) padding-box, linear-gradient(135deg, rgba(255,107,53,0.6), rgba(255,95,86,0.1), rgba(255,95,86,0.5)) border-box",
              }}
            />
            <div className="relative z-10">
              <div
                className="flex items-center justify-between px-4 py-2.5 text-xs"
                style={{ background: "#1e1e1e", borderBottom: "1px solid rgba(42, 42, 62, 0.5)", fontFamily: "var(--font-mono)" }}
              >
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-gray-400">&lt;/&gt;</span>
                  <span className="text-gray-500">compose.tsx</span>
                </span>
              </div>

              <div className="p-4 sm:p-5" style={{ background: "#121212fa" }}>
                {isSuccess ? (
                  <SuccessState onReset={resetForm} />
                ) : (
                  <ContactForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    serverMessage={serverMessage}
                    status={status}
                    isFormValid={isFormValid}
                    isSubmitting={isSubmitting}
                    cooldown={cooldown}
                    timeLeft={timeLeft}
                    isPenalty={isPenalty}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onSubmit={onSubmit}
                    nameRef={nameRef}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6 transition-all duration-300 hover:text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>
          &copy; {new Date().getFullYear()}{' '}Abhishek Kumar T &bull; Built with Next.js &amp; Tailwind CSS
        </p>
      </div>

      <div id="contact-success-msg" tabIndex={-1} className="sr-only" role="status">
        Message sent successfully
      </div>
    </section>
  );
}
