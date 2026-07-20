"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Mail } from "lucide-react";
import { GridBackground } from "@/components/GridBackground";
import { TelegramIcon } from "@/components/icons";
import { profile } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";
import { scrollToId } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden pt-20 pb-16"
    >
      <GridBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div variants={item} className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t.hero.available}
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {profile.location} · {t.hero.availability}
            </span>
          </motion.div>

          <motion.p
            variants={item}
            className="mb-3 font-display text-xl font-medium tracking-tight text-slate-300 sm:text-2xl"
          >
            {profile.name}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {t.hero.headlineBefore}{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              {t.hero.headlineAccent}
            </span>
            {t.hero.headlineAfter}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-3 font-mono text-sm text-slate-400"
          >
            {t.hero.role} · {profile.stackLine}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={() => scrollToId("work")}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-cyan-400 px-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#041016] transition hover:bg-cyan-300"
            >
              {t.hero.viewWork}
              <ArrowDownRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </button>

            <div className="flex gap-3">
              <a
                href={profile.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.03] px-5 font-mono text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200 sm:flex-none"
              >
                <TelegramIcon size={14} />
                {t.hero.contact}
              </a>
              <a
                href={profile.socials.email}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.03] px-4 font-mono text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
                aria-label="Email"
              >
                <Mail size={14} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
          {t.hero.scroll}
        </span>
        <span className="h-10 w-px overflow-hidden bg-white/10">
          <span className="block h-full w-full origin-top animate-[scrollPulse_1.6s_ease-in-out_infinite] bg-gradient-to-b from-cyan-400 to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
