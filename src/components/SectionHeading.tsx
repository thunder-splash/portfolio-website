"use client";

import { motion } from "framer-motion";

export type SectionAccent = "cyan" | "emerald" | "violet" | "amber";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  accent?: SectionAccent;
};

const accentStyles: Record<
  SectionAccent,
  { eyebrow: string; glow: string; watermark: string }
> = {
  cyan: {
    eyebrow: "text-cyan-400/90",
    glow: "from-cyan-400/20 via-cyan-300/5 to-transparent",
    watermark: "text-cyan-400/[0.07]",
  },
  emerald: {
    eyebrow: "text-emerald-400/90",
    glow: "from-emerald-400/20 via-emerald-300/5 to-transparent",
    watermark: "text-emerald-400/[0.07]",
  },
  violet: {
    eyebrow: "text-violet-400/90",
    glow: "from-violet-400/20 via-violet-300/5 to-transparent",
    watermark: "text-violet-400/[0.07]",
  },
  amber: {
    eyebrow: "text-amber-400/90",
    glow: "from-amber-400/20 via-amber-300/5 to-transparent",
    watermark: "text-amber-400/[0.07]",
  },
};

function extractWatermark(eyebrow: string) {
  const match = eyebrow.match(/^(\d+)/);
  return match?.[1] ?? null;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  accent = "cyan",
}: SectionHeadingProps) {
  const styles = accentStyles[accent];
  const watermark = extractWatermark(eyebrow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mb-10 md:mb-14 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}
    >
      {watermark ? (
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-6 left-0 font-display text-[5.5rem] font-bold leading-none tracking-tighter select-none sm:text-[7rem] ${styles.watermark} ${align === "center" ? "left-1/2 -translate-x-1/2" : ""}`}
        >
          {watermark}
        </span>
      ) : null}

      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-x-4 -inset-y-6 bg-gradient-to-br ${styles.glow} blur-2xl`}
      />

      <div className="relative">
        <p
          className={`mb-3 font-mono text-xs uppercase tracking-[0.28em] ${styles.eyebrow}`}
        >
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
