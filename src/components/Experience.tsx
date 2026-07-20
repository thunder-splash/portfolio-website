"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Layers } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { experience } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";

type JobId = (typeof experience)[number]["id"];

export function Experience() {
  const { t } = useI18n();
  const [active, setActive] = useState<JobId>(experience[0].id);
  const current = experience.find((job) => job.id === active) ?? experience[0];
  const jobCopy = t.work.jobs[current.id];
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    current.projects[0]?.id ?? "",
  );

  useEffect(() => {
    setSelectedProjectId(current.projects[0]?.id ?? "");
  }, [current.id, current.projects]);

  const selectedProject =
    current.projects.find((p) => p.id === selectedProjectId) ??
    current.projects[0];
  const selectedCopy = selectedProject
    ? jobCopy.projects[selectedProject.id]
    : null;

  return (
    <section id="work" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.work.eyebrow} title={t.work.title} />

        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
          <div className="relative">
            <div
              aria-hidden
              className="absolute top-3 bottom-3 left-[11px] hidden w-px bg-gradient-to-b from-cyan-400/50 via-white/10 to-transparent sm:block"
            />
            <ul className="flex gap-2 overflow-x-auto pb-2 sm:flex-col sm:overflow-visible sm:pb-0">
              {experience.map((job) => {
                const isActive = job.id === active;
                return (
                  <li key={job.id} className="min-w-[180px] sm:min-w-0">
                    <button
                      type="button"
                      onClick={() => setActive(job.id)}
                      className={`relative w-full rounded-xl border px-4 py-3 text-left transition sm:pl-10 ${
                        isActive
                          ? "border-cyan-400/30 bg-cyan-400/10"
                          : "border-white/8 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04] sm:border-transparent sm:bg-transparent"
                      }`}
                    >
                      <span
                        className={`absolute top-1/2 left-2.5 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 transition sm:block ${
                          isActive
                            ? "border-cyan-300 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                            : "border-slate-600 bg-[#05070d]"
                        }`}
                      />
                      <p
                        className={`font-display text-sm font-semibold ${
                          isActive ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {job.company}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        {t.work.jobs[job.id].period}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <article className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
                  {jobCopy.period}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {jobCopy.role}
                </h3>
                <p className="mt-1 text-base text-cyan-300/90">{current.company}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  {jobCopy.blurb}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {current.stack.map((tech) => (
                    <li key={tech}>
                      <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-300">
                        {tech}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    {t.work.projectsLabel}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {current.projects.map((project) => {
                    const copy = jobCopy.projects[project.id];
                    const isSelected = project.id === selectedProject?.id;
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setSelectedProjectId(project.id)}
                        className={`group rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-cyan-400/40 bg-cyan-400/10"
                            : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                              {copy.type}
                            </span>
                            <h4 className="mt-1 font-display text-base font-semibold text-white">
                              {copy.title}
                            </h4>
                          </div>
                          <span
                            className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] ${
                              isSelected
                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                : "border-white/10 text-slate-400"
                            }`}
                          >
                            {project.impact}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">{copy.summary}</p>
                        <span
                          className={`mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                            isSelected ? "text-cyan-300" : "text-slate-600"
                          }`}
                        >
                          {isSelected ? t.work.viewing : t.work.openDetails}
                          <ChevronRight size={12} />
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {selectedProject && selectedCopy ? (
                    <motion.div
                      key={selectedProject.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.28 }}
                      className="mt-4 rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-400/[0.07] to-white/[0.02] p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-lg font-semibold text-white">
                          {selectedCopy.title}
                        </h4>
                        <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                          {selectedProject.impact}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {selectedCopy.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2.5 text-sm text-slate-300"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                          <li key={tag}>
                            <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-slate-300">
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
