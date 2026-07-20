"use client";

type SectionHorizonProps = {
  left: string;
  right: string;
  className?: string;
};

/** Visual bridge between content zones */
export function SectionHorizon({
  left,
  right,
  className = "",
}: SectionHorizonProps) {
  return (
    <div
      aria-hidden
      className={`relative z-10 px-5 py-2 sm:px-8 ${className}`}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent">
          <span className="absolute top-1/2 left-[12%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/70" />
          <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 bg-[#05070d]" />
          <span className="absolute top-1/2 left-[88%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/60" />
        </div>

        <div className="mx-auto h-3 max-w-3xl bg-gradient-to-b from-cyan-400/10 to-transparent [clip-path:polygon(4%_0,96%_0,100%_100%,0_100%)]" />

        <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">
          <span>{left}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          <span>{right}</span>
        </div>
      </div>
    </div>
  );
}
