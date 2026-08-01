"use client";

import dynamic from "next/dynamic";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function Skills() {
  const { ref, visible } = useSectionVisibility();

  return (
    <section id="skills" ref={ref} className="min-h-screen flex items-center py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}># Skills.json</h2>

        <div className={`flex flex-col lg:flex-row items-center gap-12 transition-[opacity,transform] duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="flex-1 w-full min-h-[400px] flex items-center justify-center">
            <div className="w-full max-w-[480px] mx-auto" style={{ minWidth: 0 }}>  
              <Globe />
              <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 select-none whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.02em",
                    border: "1px solid rgba(230, 83, 32, 0.25)",
                    background: "rgba(230, 83, 32, 0.06)",
                  }}
                >
                  <span style={{ color: "#fe6e00" }}>&gt;</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fe6e00" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <ellipse cx="12" cy="12" rx="4" ry="9" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                  <span style={{ color: "#e6edf3" }}>Drag to explore skills universe</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div
              className="rounded-xl p-5 transition-all duration-300"
              style={{
                border: "1px solid transparent",
                background: "linear-gradient(#1e1e1e, #1e1e1e) padding-box, linear-gradient(135deg, rgba(230,83,32,0.6), rgba(230,83,32,0.1), rgba(230,83,32,0.5)) border-box",
              }}
            >
              <div className="flex items-center gap-2 mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                <span className="text-gray-500">skill_tree.json</span>
                <span className="text-gray-400">—</span>
                <span className="text-green-500">$</span>
                <span className="text-orange-400">cat languages.json</span>
              </div>

              <div className="space-y-3">
                {[
                  { category: "Programming Languages", items: ["Python", "Java", "SQL"] },
                  { category: "Web Technologies", items: ["HTML5", "CSS3", "JavaScript"] },
                  { category: "Frameworks", items: ["Flask", "React", "Node.js", "scikit-learn", "PyTorch"] },
                  { category: "Databases", items: ["MySQL", "SQLite"] },
                  { category: "Version Control", items: ["Git", "GitHub"] },
                  { category: "Core Concepts", items: ["DSA", "OOP", "REST APIs"] },
                  { category: "Tools", items: ["VS Code", "OpenCode"] },
                ].map((group, gi) => (
                  <div key={group.category} className="transition-all duration-300 hover:translate-x-1" style={{ transitionDelay: `${gi * 50}ms` }}>
                    <div className="text-[10px] text-gray-500 tracking-wider mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                      &quot;{group.category}&quot;
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="relative px-2 py-1 rounded text-xs select-none transition-all duration-300 hover:scale-110 hover:z-10"
                          style={{
                            background: "rgba(230, 83, 32, 0.05)",
                            border: "1px solid rgba(230, 83, 32, 0.2)",
                            color: "#fe6e00",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {skill}
                          <span className="absolute inset-0 rounded bg-orange-500/0 hover:bg-orange-500/5 transition-colors duration-300 pointer-events-none" />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
