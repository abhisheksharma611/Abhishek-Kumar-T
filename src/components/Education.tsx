"use client";

import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const education = [
  {
    title: "Bachelor of Engineering in Computer Science",
    institution: "Cauvery Institute of Technology, Mandya",
    period: "2023 – 2027",
    description: "Pursuing a comprehensive curriculum focused on computer science fundamentals, data structures, algorithms, and software engineering principles.",
    tags: ["Python", "SQL", "DSA", "OOP", "Computer Networks", "DBMS"],
  },
  {
    title: "12th / PUC",
    institution: "Govt PU College, Chinakurali",
    period: "2023",
    description: "Completed Pre-University Course with focus on Science stream.",
    tags: ["Science", "PCMB"],
  },
  {
    title: "10th / SSLC",
    institution: "BGS Vidyalaya, Chinakurali",
    period: "2021",
    description: "Completed Secondary School Leaving Certificate with 85%.",
    tags: ["SSLC", "85%"],
  },
];

export default function Education() {
  const { ref, visible } = useSectionVisibility();

  return (
    <section id="education" ref={ref} className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>$ cat ~/education.md</h2>

        <div className={`relative transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {/* center vertical line — desktop */}
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[0.5px] -translate-x-1/2" style={{
            background: "rgba(230,83,32,0.4)",
          }} />

          {/* left vertical line — mobile */}
          <div className="sm:hidden absolute left-[19px] top-0 bottom-0 w-[1px]" style={{
            background: "rgba(230,83,32,0.4)",
          }} />

          {education.map((edu, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={`relative flex items-start mb-10 last:mb-0 ${
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* card */}
                <div
                  className={`w-full sm:w-[calc(50%-28px)] ${
                    isLeft ? "sm:pr-0 sm:text-right" : "sm:pl-0 sm:text-left"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div
                    className="group rounded-xl p-4 sm:p-5 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_25px_rgba(255,107,53,0.06)] hover:-translate-y-0.5"
                    style={{
                      border: "1px solid rgba(68, 68, 68, 0.6)",
                      background: "#1e1e1e",
                    }}
                  >
                    <div className={`flex items-center gap-2 mb-1 text-xs ${isLeft ? "sm:justify-end" : ""}`} style={{ fontFamily: "var(--font-mono)" }}>
                      <span className="text-accent">cat</span>
                      <span className="text-gray-500">education.md</span>
                      <span className="text-green-500">HEAD → education</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1 group-hover:text-accent transition-colors duration-300" style={{ fontFamily: "var(--font-mono)" }}>
                      {edu.title}
                    </h3>

                    <div className={`flex flex-wrap items-center gap-2 mb-2 text-xs ${isLeft ? "sm:justify-end" : ""}`}>
                      <span className="text-gray-400" style={{ fontFamily: "var(--font-mono)" }}>{edu.institution}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>{edu.period}</span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-2">{edu.description}</p>

                    <div className={`flex flex-wrap gap-1.5 ${isLeft ? "sm:justify-end" : ""}`}>
                      {edu.tags.map((tag, ti) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_8px_rgba(255,107,53,0.3)]"
                          style={{
                            background: "rgba(255, 107, 53, 0.08)",
                            border: "1px solid rgba(255, 107, 53, 0.2)",
                            color: "#ff6b35",
                            fontFamily: "var(--font-mono)",
                            animation: visible ? `fadeIn 0.3s ease-out ${(idx * 0.05 + ti * 0.03)}s both` : "none",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* connector line — desktop */}
                {isLeft && <div className="hidden sm:block absolute" style={{ left: "calc(50% - 28px)", width: "28px", top: "26px", height: "0.5px", background: "rgba(230,83,32,0.25)" }} />}
                {!isLeft && <div className="hidden sm:block absolute" style={{ left: "50%", width: "28px", top: "26px", height: "0.5px", background: "rgba(230,83,32,0.25)" }} />}

                {/* center dot — desktop */}
                <div className="hidden sm:block absolute left-1/2 -translate-x-1/2" style={{ top: "20px" }}>
                  <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform duration-300" style={{
                    background: "linear-gradient(135deg, #ff6b35, #e74c3c)",
                    boxShadow: "0 0 8px rgba(255,107,53,0.4)",
                  }} />
                </div>

                {/* dot — mobile (left-aligned) */}
                <div className="sm:hidden absolute left-[19px] -translate-x-1/2" style={{ top: "8px" }}>
                  <div className="w-2 h-2 rounded-full" style={{
                    background: "linear-gradient(135deg, #ff6b35, #e74c3c)",
                    boxShadow: "0 0 8px rgba(255,107,53,0.4)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
