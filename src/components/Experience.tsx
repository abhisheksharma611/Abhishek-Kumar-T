"use client";

import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const experiences = [
  {
    title: "Deloitte Australia - Technology Job Simulation",
    url: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_S9FwvsZx3rAbmNK5b_1753420748272_completion_certificate.pdf",
    institution: "Forage",
    period: "July 2025",
    description: "Completed a virtual job simulation creating a Python algorithm to unify two different data models, learning how to help clients reconcile disparate data sources.",
    tags: ["Python", "Coding", "Data Models", "Problem Solving"],
  },
  {
    title: "Deloitte Data Analytics Virtual Experience",
    url: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_S9FwvsZx3rAbmNK5b_1753291252709_completion_certificate.pdf",
    institution: "Forage",
    period: "July 2025",
    description: "Completed a virtual job simulation building a dashboard in Tableau to explore and analyze client telemetry data, creating data visualizations for business insights.",
    tags: ["Data Analytics", "Tableau", "Data Visualization", "Excel"],
  },
  {
    title: "Deloitte Australia - Cyber Job Simulation",
    url: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/E9pA6qsdbeyEkp3ti_9PBTqmSxAf6zZTseP_S9FwvsZx3rAbmNK5b_1753288458063_completion_certificate.pdf",
    institution: "Forage",
    period: "July 2025",
    description: "Completed a virtual job simulation identifying a security breach by analyzing web activity logs to determine the source of a private company information leak.",
    tags: ["Cyber Security", "Security Analysis", "Log Analysis", "Risk Assessment"],
  },
];

const commitHashes = ["a1b2c3d", "e4f5g6h", "i7j8k9l"];

export default function Experience() {
  const { ref, visible } = useSectionVisibility();

  return (
    <section id="experience" ref={ref} className="flex items-center py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>$ git log --stat --oneline</h2>

        <div className={`space-y-5 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {experiences.map((exp, idx) => (
            <a
              key={idx}
              href={exp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl p-4 sm:p-5 flex flex-col transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_25px rgba(255,107,53,0.06)] hover:-translate-y-0.5 cursor-pointer"
              style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#1e1e1e", transitionDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform duration-300" style={{
                    background: "linear-gradient(135deg, #22c55e, #06b6d4)",
                    boxShadow: "0 0 8px rgba(34,197,94,0.4)",
                  }} />
                  {idx < experiences.length - 1 && <div className="w-px h-full bg-gradient-to-b from-gray-700 to-transparent" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                    <span className="text-accent">commit</span>
                    <span className="text-gray-500">{commitHashes[idx]}</span>
                    <span className="text-green-500">HEAD → experience</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1 group-hover:text-accent transition-colors duration-300" style={{ fontFamily: "var(--font-mono)" }}>
                    {exp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    <span className="text-gray-400" style={{ fontFamily: "var(--font-mono)" }}>{exp.institution}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>{exp.period}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-2">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_8px rgba(255,107,53,0.3)]"
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
