export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <style>{`
        .boot-line { opacity: 0; animation: bootFade 0.15s ease-out forwards; }
        .boot-1 { animation-delay: 0.05s; }
        .boot-2 { animation-delay: 0.35s; }
        .boot-3 { animation-delay: 0.65s; }
        .boot-4 { animation-delay: 0.9s; }
        .boot-5 { animation-delay: 1.05s; }
        .boot-6 { animation-delay: 1.2s; }
        .boot-7 { animation-delay: 1.35s; }
        .boot-8 { animation-delay: 1.7s; }
        @keyframes bootFade { to { opacity: 1; } }
        @keyframes bootProgress { to { width: 100%; } }
        .boot-progress-fill {
          width: 0;
          animation: bootProgress 0.7s cubic-bezier(0.3, 0.6, 0.2, 1) 1.35s forwards;
        }
      `}</style>

      <div className="max-w-lg w-full mx-auto px-4 relative z-10">
        <div
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{
            border: "1px solid rgba(68, 68, 68, 0.6)",
            background: "#121212fa",
            boxShadow: "0 0 30px rgba(59,130,246,0.15), 0 0 60px rgba(255,107,53,0.1)",
          }}
        >
          <div
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs"
            style={{ background: "rgba(26, 26, 46, 0.8)", borderBottom: "1px solid rgba(42, 42, 62, 0.5)", fontFamily: "var(--font-mono)" }}
          >
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500" />
            <span className="flex-1 text-center text-gray-500 truncate">boot.sh — init</span>
          </div>

          <div className="p-4 sm:p-6 text-[11px] sm:text-sm leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
            <div className="boot-line boot-1">
              <span className="text-accent">$</span> <span className="text-gray-300">whoami</span>
            </div>
            <div className="boot-line boot-2 text-green-400">&gt; abhishek-kumar-t</div>

            <div className="boot-line boot-3 mt-2">
              <span className="text-accent">$</span> <span className="text-gray-300">system.check --all</span>
            </div>
            <div className="boot-line boot-4 text-gray-500">&gt; 8 sections ....... <span className="text-green-500">OK</span></div>
            <div className="boot-line boot-5 text-gray-500">&gt; 15 skills ........ <span className="text-green-500">OK</span></div>
            <div className="boot-line boot-6 text-gray-500">&gt; 7 certifications . <span className="text-green-500">OK</span></div>

            <div className="boot-line boot-7 mt-4">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>loading modules</span>
                <span className="text-accent">100%</span>
              </div>
              <div
                className="h-3 rounded-sm overflow-hidden"
                style={{ background: "#1e1e1e", border: "1px solid #333" }}
              >
                <div
                  className="h-full boot-progress-fill"
                  style={{ background: "repeating-linear-gradient(90deg, #e85f24 0 10px, #ff6b35 10px 20px)" }}
                />
              </div>
            </div>

            <div className="boot-line boot-8 mt-4">
              <span className="text-accent">$</span> <span className="text-gray-300">init.done</span>
              <span
                className="inline-block w-2 h-4 bg-accent ml-1 animate-blink align-text-bottom"
                style={{ boxShadow: "0 0 6px rgba(255,107,53,0.6), 0 0 12px rgba(255,107,53,0.3)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
