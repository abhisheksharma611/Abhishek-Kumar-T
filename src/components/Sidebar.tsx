"use client";

import { useScrollSpy, useNearBottom } from "@/hooks/useScrollSpy";

const sections = [
  { id: "hero", label: "Home", icon: "code-xml" },
  { id: "about", label: "About", icon: "terminal" },
  { id: "skills", label: "Skills", icon: "cpu" },
  { id: "education", label: "Education", icon: "book" },
  { id: "experience", label: "Experience", icon: "git-branch" },
  { id: "certifications", label: "Certifications", icon: "award" },
  { id: "projects", label: "Projects", icon: "folder-open" },
  { id: "contact", label: "Contact", icon: "mail" },
];

const icons: Record<string, React.ReactNode> = {
  "code-xml": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
  ),
  "terminal": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
  ),
  "cpu": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  ),
  "book": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
  ),
  "award": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  ),
  "git-branch": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
  ),
  "folder-open": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>
  ),
  "mail": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
};

const SIZE = {
  sm: { btn: "w-8 h-8", active: "w-6 h-6", inactive: "w-2.5 h-2.5", hoverW: "w-3.5", hoverH: "h-3.5", icon: "w-3 h-3", tooltipPx: "px-2", tooltipPy: "py-0.5", tooltipText: "text-[10px]", tooltipRounded: "rounded", tooltipTrans: "duration-200" },
  md: { btn: "w-12 h-12", active: "w-7 h-7", inactive: "w-2 h-2", hoverW: "w-3", hoverH: "h-3", icon: "w-3.5 h-3.5", tooltipPx: "px-2.5", tooltipPy: "py-1", tooltipText: "text-[11px]", tooltipRounded: "rounded-md", tooltipTrans: "duration-300" },
  lg: { btn: "w-8 h-8", active: "w-7 h-7", inactive: "w-2 h-2", hoverW: "w-3", hoverH: "h-3", icon: "w-4 h-4", tooltipPx: "px-2.5", tooltipPy: "py-1", tooltipText: "text-[11px]", tooltipRounded: "rounded-md", tooltipTrans: "duration-300" },
} as const;

function NavButton({ id, label, icon, active, tooltip, size }: {
  id: string; label: string; icon: string; active: boolean;
  tooltip: "left" | "top"; size: keyof typeof SIZE;
}) {
  const s = SIZE[size];
  const isLeft = tooltip === "left";

  return (
    <button
      type="button"
      onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
      aria-label={label}
      className={`group relative flex items-center justify-center ${s.btn} transition-all duration-300 outline-none shrink-0`}
    >
      <div className={`absolute ${isLeft ? "right-12 translate-x-2 group-hover:translate-x-0 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "bottom-full left-1/2 -translate-x-1/2 mb-2 translate-y-1 group-hover:translate-y-0"} ${s.tooltipPx} ${s.tooltipPy} ${s.tooltipRounded} bg-[#0d1117] border border-orange-500/20 ${s.tooltipText} font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all ${s.tooltipTrans} pointer-events-none flex items-center gap-1.5`}>
        <span className="text-orange-400">&gt;</span>
        <span className={active ? "text-orange-400 font-bold" : "text-gray-400"}>{label}</span>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`absolute inset-0.5 m-auto rounded-full border border-orange-500/50 transition-all duration-500 ease-out ${active ? "opacity-100 rotate-180" : "opacity-0 rotate-0"}`}
          style={{ borderStyle: "dashed" }} />

        <div className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center relative z-10 ${active
          ? `${s.active} bg-dark-200 border border-orange-400 text-orange-400 shadow-[0_0_20px_rgba(230,83,32,0.3)]`
          : `${s.inactive} bg-dark-300 border border-gray-600 group-hover:${s.hoverW} group-hover:${s.hoverH} group-hover:border-orange-400/50${size === "lg" ? " group-hover:bg-orange-500/20" : ""}`
        }`} style={active ? { background: "#0d1117" } : {}}>
          <span className={`transition-all duration-300 flex items-center justify-center ${active ? `opacity-100 scale-100 ${s.icon}` : "opacity-0 scale-0 w-0 h-0"}`}>
            {active && icons[icon]}
          </span>
        </div>
      </div>
    </button>
  );
}

function TopButton({ nearBottom, variant }: { nearBottom: boolean; variant: "desktop" | "tablet" }) {
  const isDesktop = variant === "desktop";
  return (
    <button
      type="button"
      onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
      aria-label={nearBottom ? "Back to top" : "Top"}
      className={`${isDesktop ? "w-8 h-8 mt-2" : "w-7 h-7 ml-2 shrink-0"} rounded-full overflow-hidden relative border-2 border-orange-500/40 hover:border-orange-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(230,83,32,0.4)] flex items-center justify-center ${nearBottom ? "bg-orange-500/15" : ""}`}
    >
      {nearBottom ? (
        <svg xmlns="http://www.w3.org/2000/svg" width={isDesktop ? 18 : 16} height={isDesktop ? 18 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/Avatar.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
    </button>
  );
}

function DesktopSidebar({ active, nearBottom }: { active: string; nearBottom: boolean }) {
  return (
    <nav aria-label="Section navigation" className="hidden lg:flex fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3">
      <div className="absolute top-0 bottom-0 w-[0.5px] bg-gradient-to-b from-transparent via-orange-500/20 to-transparent -z-10" />
      {sections.map((s) => (
        <NavButton key={s.id} {...s} active={active === s.id} tooltip="left" size="lg" />
      ))}
      <TopButton nearBottom={nearBottom} variant="desktop" />
    </nav>
  );
}

function TabletSidebar({ active, nearBottom }: { active: string; nearBottom: boolean }) {
  return (
    <nav aria-label="Section navigation" className="hidden md:flex lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-terminal/30 backdrop-blur-xl border-t border-border/50 items-center overflow-x-auto scrollbar-hide pb-safe">
      <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-terminal via-terminal/50 to-transparent z-10" />
      <div className="flex items-center gap-2 px-4 py-0.5 relative z-0 mx-auto">
        {sections.map((s) => (
          <NavButton key={s.id} {...s} active={active === s.id} tooltip="top" size="md" />
        ))}
        <TopButton nearBottom={nearBottom} variant="tablet" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-terminal via-terminal/50 to-transparent z-10" />
    </nav>
  );
}

function MobileSidebar({ active }: { active: string }) {
  return (
    <nav aria-label="Section navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-terminal/30 backdrop-blur-xl border-t border-border/50 flex items-center py-0.5 pb-safe pl-safe pr-safe">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[0.5px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none -z-10" />
      <div className="flex items-center justify-center -space-x-1 mx-auto">
        {sections.map((s) => (
          <NavButton key={s.id} {...s} active={active === s.id} tooltip="top" size="sm" />
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const active = useScrollSpy(sections.map((s) => s.id));
  const nearBottom = useNearBottom();
  return (
    <>
      <DesktopSidebar active={active} nearBottom={nearBottom} />
      <TabletSidebar active={active} nearBottom={nearBottom} />
      <MobileSidebar active={active} />
    </>
  );
}
