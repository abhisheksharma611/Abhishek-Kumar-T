"use client";

import { useState } from "react";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const projects = [
  {
    name: "NexaAI Landing Page",
    url: "https://github.com/abhisheksharma611/AbhishekKumarT_JrWebDev_SuPrazo",
    demo: "",
    desc: "Built a fully responsive brand landing page with dark mode toggle, testimonials carousel, scroll-triggered animations, mobile hamburger menu, and back-to-top navigation using pure HTML, CSS, and JavaScript.",
    tags: ["HTML", "CSS", "JavaScript"],
    lang: "HTML",
    langColor: "#E34F26",
  },
  {
    name: "Polygon Area Calculator",
    url: "https://github.com/abhisheksharma611/Polygon-area-calculator-Python",
    demo: "",
    desc: "Developed an OOP-based geometry tool with Rectangle and Square classes demonstrating inheritance, polymorphism, and encapsulation. Computes area, perimeter, diagonal, and visualizes shapes with ASCII output.",
    tags: ["Python", "OOP"],
    lang: "Python",
    langColor: "#3776AB",
  },
  {
    name: "Expense Tracker CLI",
    url: "https://github.com/abhisheksharma611/Expense-Tracker",
    demo: "",
    desc: "Built a Python budget management application with multi-category spending, transaction tracking, inter-category transfers, and percentage-based spending visualization using OOP design patterns.",
    tags: ["Python", "OOP", "CLI"],
    lang: "Python",
    langColor: "#3776AB",
  },
];

export default function Projects() {
  const { ref, visible } = useSectionVisibility();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="projects" ref={ref} className="flex items-center py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>$ ls -la ~/projects</h2>
        <div className="text-xs text-gray-500 mb-6 animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>
          total {projects.length}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl p-4 sm:p-5 flex flex-col transition-all duration-500 cursor-pointer"
              style={{
                border: `1px solid ${activeIndex === idx ? "rgba(255,107,53,0.4)" : "rgba(68, 68, 68, 0.6)"}`,
                background: activeIndex === idx ? "#1e1e1e" : "#1e1e1e",
                boxShadow: activeIndex === idx ? "0 0 30px rgba(255,107,53,0.08)" : "none",
                transform: activeIndex === idx ? "translateY(-4px) scale(1.01)" : "translateY(0)",
                transitionDelay: `${idx * 40}ms`,
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full group-hover:scale-125 transition-transform" style={{ background: "linear-gradient(135deg, #ff6b35, #e74c3c)" }} />
                <h3 className="font-semibold text-gray-100 text-sm group-hover:text-accent transition-colors duration-300 flex-1" style={{ fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                  {project.name}
                </h3>
                <span className="ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded" style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  color: "#22c55e",
                  fontFamily: "var(--font-mono)",
                }}>
                  Public
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: project.langColor }} />
                <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-mono)" }}>{project.lang}</span>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-3">{project.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[10px] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_8px_rgba(255,107,53,0.3)]"
                    style={{
                      background: "rgba(255, 107, 53, 0.08)",
                      border: "1px solid rgba(255, 107, 53, 0.2)",
                      color: "#ff6b35",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-2 border-t transition-colors duration-300 group-hover:border-accent/20" style={{ borderColor: "rgba(42, 42, 62, 0.5)", fontFamily: "var(--font-mono)" }}>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Live Demo
                  </a>
                )}
              </div>
              </a>
            ))}
        </div>

        <div className="text-center mt-8 animate-fade-in">
          <a
            href="https://github.com/abhisheksharma611"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              border: "1px solid rgba(255, 107, 53, 0.3)",
              color: "#ff6b35",
              fontFamily: "var(--font-mono)",
              background: "rgba(255, 107, 53, 0.05)",
            }}
          >
            <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">View all repositories on GitHub →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
