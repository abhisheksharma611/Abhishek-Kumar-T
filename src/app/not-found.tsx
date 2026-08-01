import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px] max-sm:blur-2xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] max-sm:blur-2xl" />

      <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
        <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: "var(--font-mono)" }}>
          $ ls ~/404
        </p>

        <h1
          className="text-[64px] sm:text-[96px] font-bold leading-none tracking-tight mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-accent">404</span>
          <span className="text-gray-300">:</span>
          <span className="text-gray-500"> not_found</span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mb-8" style={{ fontFamily: "var(--font-mono)" }}>
          {'// The page you requested does not exist in this repository.'}
        </p>
        <p className="text-gray-500 text-xs mb-10" style={{ fontFamily: "var(--font-mono)" }}>
          error: no such file or directory
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-[1.02]"
          style={{
            fontFamily: "var(--font-mono)",
            border: "1px solid rgba(255, 107, 53, 0.3)",
            color: "#ff6b35",
            background: "rgba(255, 107, 53, 0.05)",
          }}
        >
          <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10">&gt; cd ~ &amp;&amp; ./home</span>
        </Link>
      </div>
    </main>
  );
}
