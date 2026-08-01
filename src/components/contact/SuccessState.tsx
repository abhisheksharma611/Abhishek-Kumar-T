"use client";

interface SuccessStateProps {
  onReset: () => void;
}

export default function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative mb-6">
        <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
          <circle
            cx="40" cy="40" r="36"
            stroke="rgba(34,197,94,0.2)"
            strokeWidth="3"
          />
          <circle
            cx="40" cy="40" r="36"
            stroke="url(#sg)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="226"
            strokeDashoffset="226"
            style={{ animation: "drawCheck 0.6s ease-out 0.2s forwards" }}
          />
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" style={{ animation: "drawCheck 0.4s ease-out 0.4s both" }} />
          </svg>
        </div>
      </div>
      <h3
        className="text-green-400 text-lg font-bold mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Message Sent
      </h3>
      <p
        className="text-gray-400 text-sm mb-6 text-center max-w-xs"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Thanks for reaching out! I&apos;ll get back to you within 24 hours.
      </p>
      <button
        onClick={onReset}
        type="button"
        className="text-xs text-accent hover:text-accent/80 transition-colors underline underline-offset-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Send another message
      </button>
      <style>{`
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
