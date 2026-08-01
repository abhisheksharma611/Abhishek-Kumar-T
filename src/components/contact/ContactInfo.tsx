"use client";

interface ContactInfoProps {
  status: "idle" | "submitting" | "success" | "error";
}

export default function ContactInfo({ status }: ContactInfoProps) {
  const isConnected = status === "success";

  return (
    <div
      className="group rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(255,107,53,0.12),0_0_30px_rgba(255,95,86,0.07)] relative"
      style={{ border: "1px solid rgba(68, 68, 68, 0.6)", background: "#1e1e1e" }}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          border: "1px solid transparent",
          background: "linear-gradient(transparent, transparent) padding-box, linear-gradient(135deg, rgba(255,107,53,0.6), rgba(255,95,86,0.1), rgba(255,95,86,0.5)) border-box",
        }}
      />
      <div className="relative z-10">
        <div
          className="flex items-center justify-between px-4 py-2.5 text-xs"
          style={{ background: "#1e1e1e", borderBottom: "1px solid rgba(42, 42, 62, 0.5)", fontFamily: "var(--font-mono)" }}
        >
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
          </span>
          <span className="flex items-center gap-2">
            <span className="text-gray-400">&lt;/&gt;</span>
            <span className="text-gray-500">contact_info.json</span>
          </span>
        </div>
        <div className="p-4 sm:p-5 text-sm leading-relaxed" style={{ background: "#121212fa", fontFamily: "var(--font-mono)" }}>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">1</span><span className="text-gray-500">{`{`}</span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">2</span><span className="ml-4"><span className="text-blue-400">&quot;status&quot;</span><span className="text-gray-500">: </span><span className="text-green-400">&quot;open_to_work&quot;</span><span className="text-gray-500">,</span></span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">3</span><span className="ml-4"><span className="text-blue-400">&quot;socials&quot;</span><span className="text-gray-500">: </span><span className="text-yellow-400">{`{`}</span></span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">4</span><span className="ml-8"><span className="text-blue-400">&quot;github&quot;</span><span className="text-gray-500">: </span><a href="https://github.com/abhisheksharma611" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline hover:text-green-300">&quot;@abhisheksharma611&quot;</a><span className="text-gray-500">,</span></span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">5</span><span className="ml-8"><span className="text-blue-400">&quot;linkedin&quot;</span><span className="text-gray-500">: </span><a href="https://www.linkedin.com/in/abhisheksharma611/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline hover:text-green-300">&quot;@abhisheksharma611&quot;</a></span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">6</span><span className="ml-4 text-yellow-400">{`},`}</span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">7</span><span className="ml-4"><span className="text-blue-400">&quot;location&quot;</span><span className="text-gray-500">: </span><span className="text-green-400">&quot;Mandya, Karnataka&quot;</span></span></div>
          <div className="flex"><span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">8</span><span className="text-gray-500">{`}`}</span></div>
          <div className="flex mt-2">
            <span className="text-gray-600 select-none w-5 text-right mr-4 shrink-0">9</span>
            {isConnected ? (
              <span className="text-green-400">{'// Connection established. Message received.'}</span>
            ) : (
              <span className="text-gray-400 italic animate-blink">{'// Waiting for connection...'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
