"use client";

import { motion } from "framer-motion";
import { GraduationCap, Languages } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { educationMeta } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";

export function Education() {
  const { t } = useI18n();

  return (
    <section id="education" className="relative scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.education.eyebrow}
          title={t.education.title}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <GraduationCap size={18} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {t.education.educationLabel}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              {t.education.degree}
            </h3>
            <p className="mt-2 text-cyan-300/90">{educationMeta.school}</p>
            <p className="mt-1 font-mono text-sm text-slate-400">
              {t.education.graduation}
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
              <Languages size={18} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {t.education.languagesLabel}
            </p>
            <ul className="mt-4 space-y-3">
              {t.education.langs.map((lang) => (
                <li
                  key={lang.name}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="font-display text-lg font-semibold text-white">
                    {lang.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">
                    {lang.level}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
