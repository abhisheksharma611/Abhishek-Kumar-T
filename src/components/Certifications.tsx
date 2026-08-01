"use client";

import { useState } from "react";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const certifications = [
  {
    title: "5-Day AI Agents: Intensive Vibe Coding Course",
    url: "https://www.kaggle.com/certification/badges/abhizhekkumart/108",
    institution: "Kaggle",
    period: "Jul 2026",
    description: "Completed an intensive 5-day program on building AI agents using vibe coding, covering agent workflows, tool usage, and rapid prototyping with large language models.",
    tags: ["AI Agents", "LLM", "Vibe Coding", "Kaggle"],
  },
  {
    title: "AI Fundamentals: Foundations for Understanding AI",
    url: "https://www.credly.com/badges/936c9227-4275-46e4-8074-8ffdc5019aa1/public_url",
    institution: "IBM SkillsBuild",
    period: "Jul 2026",
    description: "Foundational knowledge of artificial intelligence and its core technologies. Covers AI concepts, machine learning types, neural networks, deep learning, and responsible AI use.",
    tags: ["AI", "Machine Learning", "Deep Learning", "IBM"],
  },
  {
    title: "Lifelong Professional Skills",
    url: "https://www.credly.com/badges/4d78fea2-28d4-4dbb-bc9d-0e6e6c2d653d/public_url",
    institution: "IBM SkillsBuild",
    period: "Jul 2026",
    description: "Essential professional skills for a dynamic workplace: communication, collaboration, design thinking, creative thinking, and agile project management.",
    tags: ["Communication", "Design Thinking", "Agile", "IBM"],
  },
  {
    title: "Introduction to AI concepts",
    url: "https://learn.microsoft.com/api/achievements/share/en-gb/AbhishekKumarT-9430/U7XVYKK3?sharingId=17C640421BA7EEDA",
    institution: "Microsoft Learn",
    period: "Jul 2026",
    description: "Learned core AI concepts including machine learning types, computer vision, natural language processing, and responsible AI principles through Microsoft Learn.",
    tags: ["AI", "Machine Learning", "NLP", "Microsoft"],
  },
  {
    title: "Introduction to Large Language Models",
    url: "https://www.skills.google/public_profiles/c0229a9a-58d3-4c2e-9b7e-32b30f2c4390/badges/24880522",
    institution: "Google Skills",
    period: "Jun 2026",
    description: "Explored what large language models (LLMs) are, their use cases, prompt tuning for enhanced performance, and Google tools for building Gen AI applications.",
    tags: ["AI", "LLM", "Generative AI", "Prompt Engineering"],
  },
  {
    title: "Python (Basic)",
    url: "https://www.hackerrank.com/certificates/b59a27c5b078",
    institution: "HackerRank",
    period: "Feb 2026",
    description: "Covers Scalar Types, Operators and Control Flow, Strings, Collections and Iteration, Modularity, Objects and Types, and Classes.",
    tags: ["Python", "Programming Fundamentals", "OOP"],
  },
  {
    title: "Intro to SQL",
    url: "https://www.kaggle.com/learn/certification/abhizhekkumart/intro-to-sql",
    institution: "Kaggle",
    period: "Jul 2025",
    description: "Completed the Intro to SQL course covering querying relational databases, filtering, grouping, and joining tables.",
    tags: ["SQL", "Databases", "Data Querying"],
  },
];

export default function Certifications() {
  const { ref, visible } = useSectionVisibility();
  const [showAll, setShowAll] = useState(false);
  const displayCerts = showAll ? certifications : certifications.slice(0, 3);

  return (
    <section id="certifications" ref={ref} className="flex items-center py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>$ ls -la ~/certifications</h2>
        <div className="text-xs text-gray-500 mb-6 animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}>
          total {certifications.length}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {displayCerts.map((cert, idx) => (
            <a
              key={idx}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl p-4 sm:p-5 flex flex-col transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_25px rgba(255,107,53,0.06)] hover:-translate-y-1 cursor-pointer"
               style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#1e1e1e", transitionDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all duration-300 group-hover:bg-accent/20 group-hover:border-accent/40" style={{
                  background: "rgba(255, 107, 53, 0.1)",
                  border: "1px solid rgba(255, 107, 53, 0.2)",
                  fontFamily: "var(--font-mono)",
                }}>
                  <span className="text-accent font-bold">C</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-100 group-hover:text-accent transition-colors duration-300" style={{ fontFamily: "var(--font-mono)" }}>
                    {cert.title}
                  </h3>
                  <div className="text-[10px] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>
                    {cert.institution} • {cert.period}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-accent transition-colors duration-300 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-3">{cert.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {cert.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[10px] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_8px rgba(255,107,53,0.3)]"
                    style={{
                      background: "rgba(6, 182, 212, 0.08)",
                      border: "1px solid rgba(6, 182, 212, 0.2)",
                      color: "#06b6d4",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {certifications.length > 3 && (
          <div className="mt-8 animate-fade-in text-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="group relative inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                border: "1px solid rgba(255, 107, 53, 0.3)",
                color: "#ff6b35",
                fontFamily: "var(--font-mono)",
                background: "rgba(255, 107, 53, 0.05)",
              }}
            >
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{showAll ? "↑ Show less" : "View all certifications →"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
