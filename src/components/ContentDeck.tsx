"use client";

import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Metrics } from "@/components/Metrics";
import { SectionHorizon } from "@/components/SectionHorizon";
import { TechStack } from "@/components/TechStack";
import { useI18n } from "@/i18n/LanguageProvider";

export function ContentDeck() {
  const { t } = useI18n();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#070b14]/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_0%,rgba(34,211,238,0.06),transparent_55%)]"
      />

      <div className="relative">
        <SectionHorizon
          left={t.stack.horizonLeft}
          right={t.stack.horizonRight}
          className="-mt-6 mb-2 sm:-mt-8"
        />

        <TechStack />

        <SectionHorizon
          left={t.stack.horizonToMetrics}
          right={t.metrics.horizonTag}
        />
        <Metrics />

        <SectionHorizon
          left={t.metrics.horizonToWork}
          right={t.work.horizonTag}
          className="pt-4"
        />

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#0a101c]/55"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
          />
          <div className="relative">
            <Experience />
          </div>
        </div>

        <SectionHorizon
          left={t.work.horizonToEdu}
          right={t.education.horizonTag}
        />
        <Education />
      </div>
    </div>
  );
}
