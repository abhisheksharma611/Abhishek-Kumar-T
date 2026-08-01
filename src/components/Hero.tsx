"use client";

import { useEffect, useState, useRef } from "react";

const modules = ["REACT", "NEXT.JS", "NODE.JS", "TYPESCRIPT", "JAVA", "SPRING"];

interface CodeLine {
  num: number;
  content: React.ReactNode;
  plain: string;
}

const codeLines: CodeLine[] = [
  { num: 1, content: <span className="text-gray-400 italic">{'// Welcome to my workspace'}</span>, plain: "// Welcome to my workspace" },
   { num: 2, content: <><span className="text-purple-400">import</span><span className="text-gray-300">{'{ '}</span><span className="text-yellow-400">Developer</span><span className="text-gray-300">{' }'}</span><span className="text-purple-400">from</span><span className="text-green-400 ml-2">&apos;./universe&apos;</span><span className="text-gray-500">;</span></>, plain: "import { Developer } from './universe';" },
  { num: 3, content: '', plain: '' },
  { num: 4, content: <><span className="text-blue-400">const</span><span className="text-yellow-400 ml-2">Portfolio</span><span className="text-gray-500 ml-2">= () =&gt; {'{'}</span></>, plain: "const Portfolio = () => {" },
  { num: 5, content: <><span className="text-purple-400 ml-4">return</span><span className="text-gray-500 ml-2">(</span></>, plain: "  return (" },
  { num: 6, content: <><span className="text-gray-300 ml-8">{'<'}</span><span className="text-yellow-400">Developer</span></>, plain: "    <Developer" },
   { num: 7, content: <><span className="text-cyan-400 ml-12">name</span><span className="text-gray-500">=</span><span className="text-green-400">&quot;Abhishek Kumar T&quot;</span></>, plain: '      name="Abhishek Kumar T"' },
  { num: 8, content: <><span className="text-cyan-400 ml-12">role</span><span className="text-gray-500">=</span><span className="text-green-400">&quot;Full Stack Developer&quot;</span></>, plain: '      role="Full Stack Developer"' },
  { num: 9, content: <><span className="text-cyan-400 ml-12">passion</span><span className="text-gray-500">=</span><span className="text-green-400">&quot;Engineering Beyond Boundaries&quot;</span></>, plain: '      passion="Engineering Beyond Boundaries"' },
  { num: 10, content: <span className="text-gray-300 ml-8">/&gt;</span>, plain: "    />" },
  { num: 11, content: <span className="text-gray-500 ml-4">);</span>, plain: "  );" },
  { num: 12, content: <span className="text-gray-300">{'};'}</span>, plain: "};" },
];

const lineStarts = codeLines.reduce<number[]>((acc, line, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + codeLines[i - 1].plain.length + 1);
  return acc;
}, []);

const totalCodeChars = codeLines.reduce((sum, line) => sum + line.plain.length + 1, 0);

function highlightCode(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < text.length) {
    const remaining = text.slice(i);

    const commentMatch = remaining.match(/^\/\/(.*)/);
    if (commentMatch) {
      result.push(<span key={key++} className="text-gray-400 italic">{'//'}{commentMatch[1]}</span>);
      i += commentMatch[0].length;
      continue;
    }

    if (remaining[0] === "'") {
      const endQuote = remaining.indexOf("'", 1);
      const end = endQuote === -1 ? remaining.length : endQuote + 1;
      result.push(<span key={key++} className="text-green-400">{remaining.slice(0, end)}</span>);
      i += end;
      continue;
    }

    if (remaining[0] === '{' || remaining[0] === '}') {
      result.push(<span key={key++} className="text-yellow-400">{remaining[0]}</span>);
      i++;
      continue;
    }

    const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      let color = 'text-gray-300';

      if (word === 'import') color = 'text-purple-400';
      else if (['const', 'while'].includes(word)) color = 'text-blue-400';
      else if (word === 'from') color = 'text-purple-400';
      else if (['name', 'role', 'passion'].includes(word)) color = 'text-cyan-400';
      else if (['Developer', 'Portfolio'].includes(word)) color = 'text-yellow-400';
      else if (['return'].includes(word)) color = 'text-purple-400';

      result.push(<span key={key++} className={color}>{word}</span>);
      i += word.length;
      continue;
    }

    const numMatch = remaining.match(/^\d+/);
    if (numMatch) {
      result.push(<span key={key++} className="text-yellow-400">{numMatch[0]}</span>);
      i += numMatch[0].length;
      continue;
    }

    const char = remaining[0];
    let color = 'text-gray-300';
    if ('()'.includes(char)) color = 'text-gray-500';
    else if ('=,.:'.includes(char)) color = 'text-gray-500';
    else if (char === '>') color = 'text-gray-300';
    else if (char === '/') color = 'text-gray-300';

    result.push(<span key={key++} className={color}>{char}</span>);
    i++;
  }

  return result;
}

export default function Hero() {
  const [typewriterPos, setTypewriterPos] = useState(0);
  const [showResumeOptions, setShowResumeOptions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const resumeMenuRef = useRef<HTMLDivElement>(null);
  const mouseRafRef = useRef<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  }, []);

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const isMobile = window.innerWidth < 768;
    const charsPerMs = totalCodeChars / (isMobile ? 2000 : 1500);
    const DELAY = 500; // defer typewriter so LCP fires first

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime - DELAY;
      if (elapsed < 0) { rafId = requestAnimationFrame(animate); return; }
      const newPos = Math.min(Math.floor(elapsed * charsPerMs), totalCodeChars);
      setTypewriterPos(newPos);
      if (newPos < totalCodeChars) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (isTouchDevice) return;
      // throttle to one update per animation frame and mutate the DOM node
      // directly — no React state, so moving the mouse costs zero re-renders
      if (mouseRafRef.current) return;
      mouseRafRef.current = requestAnimationFrame(() => {
        mouseRafRef.current = 0;
        const el = codeRef.current;
        if (!el) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        el.style.transform = `perspective(1000px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
      });
    };
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouse);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(mouseRafRef.current);
      mouseRafRef.current = 0;
    };
  }, [isTouchDevice]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resumeMenuRef.current && !resumeMenuRef.current.contains(event.target as Node)) {
        setShowResumeOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-16">
      <div className="absolute top-1/4 -left-32 max-sm:-left-20 w-96 max-sm:w-64 h-96 max-sm:h-64 bg-accent/5 rounded-full blur-[120px] max-sm:blur-2xl" />
      <div className="absolute bottom-1/4 -right-32 max-sm:-right-20 w-96 max-sm:w-64 h-96 max-sm:h-64 bg-red-500/5 rounded-full blur-[120px] max-sm:blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-24">
          <div className="flex-1 space-y-4 sm:space-y-5">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-xs animate-fade-in"
              style={{ fontFamily: "var(--font-mono)", border: "1px solid rgba(255, 107, 53, 0.3)", background: "rgba(255, 107, 53, 0.08)", color: "#ff6b35" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM.KERNEL :: v2.5.0 ONLINE
            </div>

            <h1
              aria-label="Hello I'm Abhishek Kumar T"
              className="text-[30px] min-[291px]:text-[34px] sm:text-[46px] md:text-[50px] lg:text-[52px] xl:text-[64px] font-bold leading-tight tracking-tight"
            >
              <span aria-hidden="true" className="block">Hello I&apos;m</span>{" "}
              <span aria-hidden="true" className="block whitespace-nowrap" style={{
                backgroundImage: "linear-gradient(to right, lab(70.0429 42.5156 75.8207) 0%, lab(54.1736 13.3369 -74.6839) 100%)",
                color: "#0000",
                display: "block",
                fontSize: "inherit",
                fontWeight: 700,
                letterSpacing: "-1.8px",
                lineHeight: "1.1",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                width: "max-content",
              }}>Abhishek Kumar T</span>
            </h1>

            <h2 className="text-fluid-sm sm:text-fluid-base lg:text-lg min-h-0 flex-wrap" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="text-accent">{"<"}</span>
              <span className="text-accent">FullStackDeveloper</span>
              <span className="text-accent">{" />"}</span>
              <span className="text-gray-300 ml-2">{'// Engineering Beyond Boundaries'}</span>
            </h2>

            <p className="text-gray-300 max-w-lg leading-relaxed text-[10px] sm:text-xs animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both", fontFamily: "var(--font-mono)" }}>
              Full Stack Developer crafting scalable web apps with Python,
              React, and modern backend technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full max-w-xl mx-auto lg:mx-0">
              <div ref={resumeMenuRef} className="relative group cursor-pointer flex-1 min-w-0">
                <div
                  className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-blue-600 opacity-30 group-hover:opacity-70 transition duration-500"
                  style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowResumeOptions(!showResumeOptions)}
                  className="relative bg-[#1a1a1a] border border-orange-500/30 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-[#202020] transition-colors shadow-2xl h-full group-hover:border-orange-500/50 w-full text-left"
                  style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                >
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-orange-500/10 rounded-sm border border-orange-500/20 group-hover:border-orange-500/50 group-hover:scale-105 transition-all">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">Download Resume</span>
                      <svg className={`w-3 h-3 text-gray-500 group-hover:text-orange-400 transition-colors ml-2 shrink-0 transition-transform ${showResumeOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </div>
                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden mb-1">
                      <div className={`h-full bg-orange-500 transition-all duration-700 ease-out relative ${showResumeOptions ? 'w-full' : 'w-3/5 group-hover:w-[90%]'} rounded-full`}>
                        <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-gray-500">
                      <span className="truncate mr-2">&gt; wget resume.pdf</span>
                      <span className="text-orange-500 group-hover:animate-pulse whitespace-nowrap">PDF</span>
                    </div>
                  </div>
                </button>

                {showResumeOptions && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-orange-500/30 rounded-sm shadow-2xl z-50 overflow-hidden"
                    style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                  >
                    <a
                      href="/Resume.pdf"
                      download
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#202020] transition-colors border-b border-orange-500/10"
                    >
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">Download Resume</div>
                        <div className="text-[10px] text-gray-500 font-mono">Save PDF to device</div>
                      </div>
                    </a>
                    <a
                      href="/Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#202020] transition-colors"
                    >
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">View Resume</div>
                        <div className="text-[10px] text-gray-500 font-mono">Open in new tab</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <a
                href="https://github.com/abhisheksharma611"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer sm:w-auto shrink-0"
              >
                <div
                  className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-orange-400 opacity-20 group-hover:opacity-50 transition duration-500"
                  style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                />
                <div
                  className="relative bg-[#1a1a1a] border border-orange-500/30 group-hover:border-orange-500/50 p-3 sm:p-4 flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#202020] transition-colors shadow-xl h-full min-w-0"
                  style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 font-mono leading-none mb-0.5">Check out</div>
                    <div className="font-bold text-white group-hover:text-orange-400 transition-colors leading-none">GitHub</div>
                  </div>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 animate-fade-in">
              <span className="text-[9px] sm:text-[10px] text-gray-500 mr-1 self-center">LOADED_MODULES:</span>
              {modules.map((m, i) => (
                <span
                  key={m}
                  className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-medium transition-all hover:scale-110 hover:shadow-[0_0_8px_rgba(255,107,53,0.3)]"
                  style={{
                    background: "rgba(255, 107, 53, 0.1)",
                    color: "#ff6b35",
                    border: "1px solid rgba(255, 107, 53, 0.2)",
                    animation: `fadeIn 0.3s ease-out ${i * 0.1}s both`,
                  }}
                >
                  {m}
                </span>
              ))}
            </div>

            <p className="text-gray-500 italic text-[10px] sm:text-xs pt-1" style={{ fontFamily: "var(--font-mono)" }}>
              while(alive) {'{'} code() {'}'}
            </p>
          </div>

          <div className="flex-1 w-full max-w-xl flex flex-col gap-4">
            <div
              ref={codeRef}
              aria-hidden="true"
              style={
                !isTouchDevice
                  ? {
                      // transform is intentionally NOT in JSX style: it is
                      // mutated directly via codeRef by the mousemove handler,
                      // so React never reconciles/overwrites it during the
                      // typewriter re-renders. Only the transition lives here.
                      transition: "transform 0.15s ease-out",
                    }
                  : {}
              }
            >
              <div
                className="rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,107,53,0.15)]"
                style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#121212fa", boxShadow: "0 0 30px rgba(59,130,246,0.15), 0 0 60px rgba(255,107,53,0.1), 0 0 90px rgba(34,197,94,0.08)" }}
              >
                <div
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs"
                  style={{ background: "rgba(26, 26, 46, 0.8)", borderBottom: "1px solid rgba(42, 42, 62, 0.5)", fontFamily: "var(--font-mono)" }}
                >
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500" />
                  <span className="flex-1 text-center text-gray-500 truncate">portfolio.tsx</span>
                </div>
                <div className="p-3 sm:p-4 lg:p-5 text-[11px] sm:text-sm leading-relaxed overflow-x-auto" style={{ fontFamily: "var(--font-mono)" }}>
                  {codeLines.map((line, i) => {
                    const lineStart = lineStarts[i];
                    const lineEnd = lineStart + line.plain.length;
                    const isFullyRevealed = typewriterPos > lineEnd;
                    const isPartiallyRevealed = typewriterPos > lineStart && !isFullyRevealed;
                    const isVisible = typewriterPos > lineStart;
                    const charsInLine = isPartiallyRevealed ? typewriterPos - lineStart : 0;

                    return (
                      <div key={i} className="flex" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 150ms ease-out" }}>
                        <span className="text-accent select-none w-4 sm:w-5 lg:w-6 text-right mr-2 sm:mr-3 lg:mr-4 shrink-0">{line.num}</span>
                        {isFullyRevealed ? (
                          <span>{line.content || <>&nbsp;</>}</span>
                        ) : isPartiallyRevealed ? (
                          <span className="whitespace-pre">{highlightCode(line.plain.substring(0, charsInLine))}<span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-accent ml-0.5 animate-blink align-text-bottom" style={{ boxShadow: "0 0 6px rgba(255,107,53,0.6), 0 0 12px rgba(255,107,53,0.3)" }} /></span>
                        ) : null}
                      </div>
                    );
                  })}
                  {/* 13th "terminal ready" line — always rendered so the container
                      height is fixed from first paint; only fades in once typing completes */}
                  <div
                    className="flex mt-1"
                    style={{
                      opacity: typewriterPos >= totalCodeChars ? 1 : 0,
                      transition: "opacity 300ms ease-out",
                    }}
                  >
                    <span className="text-accent select-none w-4 sm:w-5 lg:w-6 text-right mr-2 sm:mr-3 lg:mr-4 shrink-0">{codeLines.length + 1}</span>
                    <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-accent/80 animate-blink" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-1 w-full max-w-xl mx-auto lg:mx-0">
              <a
                href="#about"
                className="relative group cursor-pointer flex-1"
              >
                <div
                  className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-red-500 opacity-30 group-hover:opacity-70 transition duration-500"
                  style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                />
                <div
                  className="relative bg-[#1a1a1a] border border-orange-500/30 group-hover:border-orange-500/50 px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#202020] transition-colors shadow-xl h-full text-sm font-medium"
                  style={{ fontFamily: "var(--font-mono)", clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                >
                  <svg className="w-4 h-4 text-white group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-white group-hover:text-orange-400 transition-colors whitespace-nowrap">Run Profile</span>
                </div>
              </a>
              <a
                href="#projects"
                className="relative group cursor-pointer flex-1"
              >
                <div
                  className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-orange-400 opacity-20 group-hover:opacity-50 transition duration-500"
                  style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                />
                <div
                  className="relative bg-[#1a1a1a] border border-orange-500/30 group-hover:border-orange-500/50 px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#202020] transition-colors shadow-xl h-full text-sm font-medium"
                  style={{ fontFamily: "var(--font-mono)", clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                >
                  <svg className="w-4 h-4 text-white group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  <span className="text-white group-hover:text-orange-400 transition-colors whitespace-nowrap">View Projects</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
