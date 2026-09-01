"use client";

import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Metrics } from "@/components/Metrics";
import { SectionFrame } from "@/components/SectionFrame";
import { SectionHorizon } from "@/components/SectionHorizon";
import { TechStack } from "@/components/TechStack";
import { useI18n } from "@/i18n/LanguageProvider";

export function ContentDeck() {
  const { t } = useI18n();

  return (
    <div className="relative">
      <SectionFrame variant="default">
        <SectionHorizon
          left={t.stack.horizonLeft}
          right={t.stack.horizonRight}
          className="-mt-6 mb-2 sm:-mt-8"
        />
        <TechStack />
      </SectionFrame>

      <SectionFrame variant="band">
        <SectionHorizon
          left={t.stack.horizonToMetrics}
          right={t.metrics.horizonTag}
          tone="emerald"
        />
        <Metrics />
      </SectionFrame>

      <SectionFrame variant="spotlight">
        <SectionHorizon
          left={t.metrics.horizonToWork}
          right={t.work.horizonTag}
          className="pt-4"
          tone="cyan"
        />
        <Experience />
      </SectionFrame>

      <SectionFrame variant="calm">
        <SectionHorizon
          left={t.work.horizonToEdu}
          right={t.education.horizonTag}
          tone="violet"
        />
        <Education />
      </SectionFrame>
    </div>
  );
}
