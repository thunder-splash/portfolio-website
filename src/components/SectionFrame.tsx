"use client";

import type { ReactNode } from "react";

export type SectionFrameVariant = "default" | "band" | "spotlight" | "calm";

type SectionFrameProps = {
  variant?: SectionFrameVariant;
  children: ReactNode;
  className?: string;
};

const variantBg: Record<SectionFrameVariant, ReactNode> = {
  default: (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_0%_0%,rgba(34,211,238,0.05),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </>
  ),
  band: (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#070c14]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(16,185,129,0.11)_0%,transparent_42%,rgba(34,211,238,0.08)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(148,163,184,0.06) 0, rgba(148,163,184,0.06) 1px, transparent 1px, transparent 72px)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
    </>
  ),
  spotlight: (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[#050910]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_15%_0%,rgba(34,211,238,0.14),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_95%_75%,rgba(52,211,153,0.09),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-400/20 via-emerald-400/35 to-transparent" />
    </>
  ),
  calm: (
    <>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.045] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(167,139,250,0.07),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/25 to-transparent" />
    </>
  ),
};

export function SectionFrame({
  variant = "default",
  children,
  className = "",
}: SectionFrameProps) {
  return (
    <div className={`relative ${variant === "band" ? "border-y border-white/[0.06]" : ""} ${className}`}>
      {variantBg[variant]}
      <div className="relative">{children}</div>
    </div>
  );
}
