"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Boxes,
  Code2,
  Palette,
  Server,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { techCategories } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";

const accentMap = {
  cyan: {
    border: "hover:border-cyan-400/40",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)]",
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    title: "text-cyan-300",
    icon: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    line: "from-cyan-400/40 via-cyan-300/20 to-transparent",
    node: "border-cyan-400/40 bg-cyan-400/15 text-cyan-200",
  },
  emerald: {
    border: "hover:border-emerald-400/40",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.3)]",
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    title: "text-emerald-300",
    icon: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    line: "from-emerald-400/40 via-emerald-300/20 to-transparent",
    node: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
  },
  blue: {
    border: "hover:border-blue-400/40",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(96,165,250,0.3)]",
    badge: "border-blue-400/20 bg-blue-400/10 text-blue-200",
    title: "text-blue-300",
    icon: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    line: "from-blue-400/40 via-blue-300/20 to-transparent",
    node: "border-blue-400/40 bg-blue-400/15 text-blue-200",
  },
  violet: {
    border: "hover:border-violet-400/40",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.3)]",
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    title: "text-violet-300",
    icon: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    line: "from-violet-400/40 via-violet-300/20 to-transparent",
    node: "border-violet-400/40 bg-violet-400/15 text-violet-200",
  },
  slate: {
    border: "hover:border-slate-400/40",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(148,163,184,0.25)]",
    badge: "border-slate-400/20 bg-slate-400/10 text-slate-200",
    title: "text-slate-300",
    icon: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    line: "from-slate-400/40 via-slate-300/20 to-transparent",
    node: "border-slate-400/40 bg-slate-400/15 text-slate-200",
  },
} as const;

const iconMap: Record<string, LucideIcon> = {
  ai: Bot,
  frontend: Code2,
  backend: Server,
  uiux: Palette,
  devops: Boxes,
};

const flowLabels: Record<string, string[]> = {
  ai: ["Prompt", "Agent", "Ship"],
  frontend: ["Design", "Build", "Polish"],
  backend: ["Hono", "Data", "Scale"],
  uiux: ["Token", "Motion", "Ship"],
  devops: ["Build", "Test", "Deploy"],
};

export function TechStack() {
  const { t } = useI18n();

  return (
    <section id="stack" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.stack.eyebrow} title={t.stack.title} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(180px,auto)]">
          {techCategories.map((category, index) => {
            const accent = accentMap[category.accent];
            const Icon = iconMap[category.id] ?? Code2;
            const copy = t.stack.categories[category.id];
            const flow = flowLabels[category.id] ?? [];
            const featured = category.span.includes("row-span-2");

            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-colors duration-300 ${accent.border} ${accent.glow} ${category.span}`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent.line}`}
                />
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/[0.03] blur-2xl transition group-hover:bg-white/[0.06]" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)
                    `,
                    backgroundSize: "28px 28px",
                    maskImage:
                      "radial-gradient(ellipse 80% 70% at 100% 0%, black, transparent)",
                  }}
                />

                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${accent.icon}`}
                      >
                        <Icon size={18} />
                      </span>
                      <div>
                        <h3
                          className={`font-display text-lg font-semibold tracking-tight sm:text-xl ${accent.title}`}
                        >
                          {copy.title}
                        </h3>
                        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">
                          {copy.blurb}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {featured || category.id === "backend" ? (
                    <div className="my-1 flex items-center gap-2">
                      {flow.map((step, stepIndex) => (
                        <div key={step} className="flex items-center gap-2">
                          <span
                            className={`rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${accent.node}`}
                          >
                            {step}
                          </span>
                          {stepIndex < flow.length - 1 ? (
                            <span className="h-px w-4 bg-gradient-to-r from-white/25 to-transparent sm:w-6" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        {t.stack.toolsLabel.replace(
                          "{n}",
                          String(category.skills.length),
                        )}
                      </span>
                      {!featured && category.id !== "backend" && flow.length > 0 ? (
                        <span className="truncate font-mono text-[10px] tracking-[0.12em] text-slate-600">
                          {flow.join(" → ")}
                        </span>
                      ) : null}
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <li key={skill}>
                          <span
                            className={`inline-flex rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-wide transition ${accent.badge}`}
                          >
                            {skill}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
