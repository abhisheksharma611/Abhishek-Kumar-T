"use client";

import Image from "next/image";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const stats = [
  { label: "STUDENT", value: "CSE" },
  { label: "PROJECTS", value: "3+" },
  { label: "CAFFEINE", value: "∞ mL" },
];

const strengths = [
  "Strong problem-solving mindset",
  "Quick learner & self-driven",
  "Good backend logic understanding",
  "Consistent project-oriented learning",
];

export default function About() {
  const { ref, visible } = useSectionVisibility();

  return (
    <section id="about" ref={ref} className="min-h-screen flex items-center py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <h2 className="section-title animate-fade-in" style={{ fontFamily: "var(--font-mono)" }}># About.system</h2>

        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="lg:col-span-2">
            <div
              className="rounded-xl p-8 text-center transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(255,107,53,0.08)] relative overflow-hidden"
              style={{ border: "1px solid transparent", background: "linear-gradient(#1e1e1e, #1e1e1e) padding-box, linear-gradient(135deg, #3b82f6, #ef4444, #ff6b35) border-box", boxShadow: "0 0 30px rgba(59,130,246,0.12), 0 0 60px rgba(255,107,53,0.1)" }}
            >

              <div className="relative w-44 h-44 mx-auto mb-6 group">
                <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="absolute inset-0 rounded-full border-0 border-l-4 border-r-4 border-blue-500/50" />
                <div className="absolute inset-2 rounded-full border-0 border-t-4 border-b-4 border-accent/50" />
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-accent/50 group-hover:border-accent transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(255,107,53,0.3)]">
                  <Image src="/Avatar.webp" alt="Abhishek Kumar T portrait" width={176} height={176} className="w-full h-full object-cover" unoptimized loading="lazy" />
                </div>
                <span className="absolute bottom-[6px] right-[12px] w-4 h-4 rounded-full bg-green-500 border-2 border-[#1e1e1e] animate-pulse" />
              </div>
              <div className="text-left space-y-3 text-base" style={{ fontFamily: "var(--font-mono)" }}>
                <div className="flex justify-between">
                  <span className="text-gray-500">OPERATOR:</span>
                  <span className="text-gray-200 font-medium">ABHISHEK KUMAR T</span>
                </div>
                <div className="border-b border-gray-700/50" />
                <div className="flex justify-between">
                  <span className="text-gray-500">ROLE:</span>
                  <span className="text-accent">STUDENT_DEVELOPER</span>
                </div>
                <div className="border-b border-gray-700/50" />
                <div className="flex justify-between">
                  <span className="text-gray-500">LOCATION:</span>
                  <span className="text-gray-200">Mandya, Karnataka</span>
                </div>
                <div className="border-b border-gray-700/50" />
                <div className="flex justify-between">
                  <span className="text-gray-500">STATUS:</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500">OPEN</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-5">
            {[
              {
                cmd: "whoami",
                content: "Motivated Computer Science student aspiring Full Stack Developer with strong foundations in Python, web development, and SQL. Actively building end-to-end projects using Flask, HTML, CSS, JavaScript, and databases. Passionate about writing clean code, learning backend systems, and growing into a software engineering role."
              },
              {
                cmd: "cat mission.txt",
                content: "Building robust, scalable web applications that solve real-world problems. Currently focused on deepening expertise in backend development, full stack applications, and system design."
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4 sm:p-5 transition-all duration-500 hover:border-accent/30 hover:translate-x-1"
                style={{
                  border: "1px solid rgba(68, 68, 68, 0.6)",
                  background: "#1e1e1e",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className="flex items-center gap-2 mb-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="text-gray-500">user_profile.log</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-green-500">$</span>
                  <span className="text-accent">{item.cmd}</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">{item.content}</p>
              </div>
            ))}

            <div
              className="rounded-xl p-4 sm:p-5 transition-all duration-500 hover:border-accent/30"
              style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#1e1e1e" }}
            >
              <div className="flex items-center gap-2 mb-3 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="text-gray-500">user_profile.log</span>
                <span className="text-gray-400">—</span>
                <span className="text-green-500">$</span>
                <span className="text-accent">cat strengths.txt</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 group cursor-default">
                    <span className="text-green-500 group-hover:scale-125 transition-transform">✓</span>
                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-xl p-4 sm:p-5 transition-all duration-500 hover:border-accent/30"
              style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#1e1e1e" }}
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.map((s, i) => (
                  <div key={s.label} className="group cursor-default" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">{s.value}</div>
                    <div className="text-[10px] text-gray-500 tracking-wider mt-1" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</div>
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
