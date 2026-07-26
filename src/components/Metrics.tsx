"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { metrics } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";

function parseMetric(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { target: null as number | null, suffix: value };
  return { target: Number(match[1]), suffix: match[2] ?? "" };
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const { target, suffix } = parseMetric(value);

  useEffect(() => {
    if (!inView || target === null || !ref.current) return;

    const el = ref.current;
    const durationMs = 900;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      el.textContent = `${target}${suffix}`;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, suffix]);

  if (target === null) return <span>{value}</span>;

  // Always paint the real number — animation only overrides the DOM text.
  // Prevents permanent zeros if IntersectionObserver / RAF ever miss.
  return (
    <span ref={ref} className="tabular-nums">
      {`${target}${suffix}`}
    </span>
  );
}

export function Metrics() {
  const { t } = useI18n();

  return (
    <section id="metrics" className="relative scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.metrics.eyebrow} title={t.metrics.title} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => {
            const copy = t.metrics.items[metric.id];
            return (
              <motion.article
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60" />
                <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  <AnimatedValue value={metric.value} />
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">
                  {copy.label}
                </p>
                <p className="mt-2 text-sm text-slate-400">{copy.hint}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
