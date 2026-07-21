"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  MousePointerClick,
  Play,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectPlayground } from "@/components/ProjectPlayground";
import { getProjectDemo } from "@/data/demos";
import { experience } from "@/data/portfolio";
import { projectArcs } from "@/data/projectArcs";
import { useI18n } from "@/i18n/LanguageProvider";

type JobId = (typeof experience)[number]["id"];

export function Experience() {
  const { t, locale } = useI18n();
  const [active, setActive] = useState<JobId>(experience[0].id);
  const current = experience.find((job) => job.id === active) ?? experience[0];
  const jobCopy = t.work.jobs[current.id];
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    current.projects[0]?.id ?? "",
  );
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedProjectId(current.projects[0]?.id ?? "");
    setPlaygroundOpen(false);
  }, [current.id, current.projects]);

  const selectedProject =
    current.projects.find((p) => p.id === selectedProjectId) ??
    current.projects[0];
  const selectedCopy = selectedProject
    ? jobCopy.projects[selectedProject.id]
    : null;
  const selectedDemo = selectedProject
    ? getProjectDemo(selectedProject.id)
    : null;
  const selectedIndex = current.projects.findIndex(
    (p) => p.id === selectedProject?.id,
  );
  const arc = selectedProject
    ? projectArcs[selectedProject.id]?.[locale]
    : null;

  const openDemo = () => {
    if (selectedDemo) setPlaygroundOpen(true);
  };

  const selectProject = (id: string) => {
    setSelectedProjectId(id);
  };

  const selectAdjacent = (dir: -1 | 1) => {
    if (!current.projects.length) return;
    const next =
      (selectedIndex + dir + current.projects.length) %
      current.projects.length;
    selectProject(current.projects[next].id);
  };

  // Horizontal-only nudge inside the filmstrip — never scrolls the page
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>(
      `[data-project-id="${selectedProjectId}"]`,
    );
    if (!strip || !el) return;
    const target =
      el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [selectedProjectId, active]);

  useEffect(() => {
    if (playgroundOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const len = current.projects.length;
      if (!len) return;
      const idx = current.projects.findIndex((p) => p.id === selectedProjectId);
      const dir = e.key === "ArrowLeft" ? -1 : 1;
      const next = (Math.max(0, idx) + dir + len) % len;
      selectProject(current.projects[next].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playgroundOpen, current.projects, selectedProjectId]);

  return (
    <section
      id="work"
      className="relative scroll-mt-24 overflow-anchor-none py-20 md:py-28"
      style={{ overflowAnchor: "none" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.work.eyebrow}
          title={t.work.title}
          description={t.work.invite}
        />

        <p className="mb-8 max-w-2xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-slate-500">
          {t.work.demoDisclaimer}
        </p>

        {/* Company switcher */}
        <div
          role="tablist"
          aria-label={t.work.companiesLabel}
          className="relative mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {experience.map((job, index) => {
            const isActive = job.id === active;
            return (
              <button
                key={job.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(job.id)}
                className={`group relative shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-cyan-400/40 bg-gradient-to-b from-cyan-400/15 to-cyan-400/[0.04] shadow-[0_0_32px_-12px_rgba(34,211,238,0.55)]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.05]"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p
                  className={`mt-1 font-display text-sm font-semibold sm:text-base ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {job.company}
                </p>
                <p className="mt-0.5 max-w-[11rem] truncate font-mono text-[10px] text-slate-500">
                  {t.work.jobs[job.id].period.split("·")[0]?.trim()}
                </p>
                {isActive ? (
                  <motion.span
                    layoutId="work-company-glow"
                    className="pointer-events-none absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          {/* Role strip — key keeps identity without remounting whole tree */}
          <AnimatePresence mode="sync">
            <motion.div
              key={current.id + "-role"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5"
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-300/90">
                  {jobCopy.role}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
                  {jobCopy.blurb}
                </p>
              </div>
              <ul className="flex flex-wrap gap-1.5 sm:max-w-md sm:justify-end">
                {current.stack.slice(0, 6).map((tech) => (
                  <li key={tech}>
                    <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {tech}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Filmstrip FIRST — pick case without page jump */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-cyan-400" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  {t.work.pickProject}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-600">
                <Sparkles size={11} />
                {t.work.projectsCount.replace(
                  "{n}",
                  String(current.projects.length),
                )}
              </span>
            </div>

            <div
              ref={stripRef}
              className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {current.projects.map((project, index) => {
                const copy = jobCopy.projects[project.id];
                const isSelected = project.id === selectedProject?.id;
                const hasDemo = Boolean(getProjectDemo(project.id));
                return (
                  <button
                    key={project.id}
                    type="button"
                    data-project-id={project.id}
                    onClick={() => selectProject(project.id)}
                    onDoubleClick={() => {
                      if (hasDemo) {
                        selectProject(project.id);
                        setPlaygroundOpen(true);
                      }
                    }}
                    className={`group relative w-[min(70vw,220px)] shrink-0 overflow-hidden rounded-2xl border text-left transition ${
                      isSelected
                        ? "border-cyan-400/50 shadow-[0_0_28px_-10px_rgba(34,211,238,0.55)]"
                        : "border-white/8 hover:border-white/18"
                    }`}
                  >
                    <div className="relative aspect-[16/10] bg-[#070b14]">
                      <Image
                        src={project.image}
                        alt={copy.title}
                        fill
                        sizes="220px"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/90 via-[#05070d]/20 to-transparent" />
                      <span className="absolute top-2 left-2 rounded-md border border-white/10 bg-[#05070d]/65 px-1.5 py-0.5 font-mono text-[9px] text-slate-300 backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {hasDemo ? (
                        <span className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/20 text-cyan-100 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-cyan-400/35">
                          <Play size={11} fill="currentColor" />
                        </span>
                      ) : null}
                      <div className="absolute right-2 bottom-2 left-2">
                        <p className="truncate font-display text-sm font-semibold text-white">
                          {copy.title}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
                          {project.impact}
                        </p>
                      </div>
                      {isSelected ? (
                        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-cyan-400/60 ring-inset" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage — stable height, soft crossfade only */}
          {selectedProject && selectedCopy ? (
            <div
              ref={stageRef}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#070b14] shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)]"
            >
              <div className="relative aspect-[16/11] sm:aspect-[2/1] lg:aspect-[21/9]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={selectedProject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={selectedProject.image}
                      alt={selectedCopy.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1100px"
                      className="object-cover object-top"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/60 to-[#05070d]/2" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070d]/85 via-[#05070d]/25 to-transparent" />

                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-200 backdrop-blur-sm">
                          {selectedCopy.type}
                        </span>
                        <span className="rounded-md border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] text-emerald-200 backdrop-blur-sm">
                          {selectedProject.impact}
                        </span>
                        {selectedDemo ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-cyan-400/35 bg-cyan-400/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 backdrop-blur-sm">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            </span>
                            {t.work.demoReady}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                        {selectedCopy.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                        {selectedCopy.summary}
                      </p>
                    </div>

                    <div className="pointer-events-auto flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
                      {selectedDemo ? (
                        <>
                          <motion.button
                            type="button"
                            onClick={openDemo}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-cyan-300/45 bg-cyan-400 px-5 py-3.5 font-display text-base font-semibold text-[#041016] shadow-[0_0_48px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
                          >
                            <Play size={16} fill="currentColor" />
                            {t.work.tryInteractive}
                          </motion.button>
                          <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                            <MousePointerClick size={11} />
                            {t.work.tapToPlay}
                          </p>
                        </>
                      ) : (
                        <p className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center font-mono text-[11px] text-slate-400 backdrop-blur-sm">
                          {t.work.mockupNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedDemo ? (
                  <button
                    type="button"
                    aria-label={t.work.tryInteractive}
                    onClick={openDemo}
                    className="absolute inset-0 z-[1] cursor-pointer bg-transparent"
                  />
                ) : null}

                {current.projects.length > 1 ? (
                  <div className="pointer-events-none absolute top-1/2 right-3 left-3 z-20 flex -translate-y-1/2 justify-between sm:right-4 sm:left-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAdjacent(-1);
                      }}
                      className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#05070d]/55 text-white backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-[#05070d]/80"
                      aria-label={t.work.prevProject}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAdjacent(1);
                      }}
                      className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#05070d]/55 text-white backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-[#05070d]/80"
                      aria-label={t.work.nextProject}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Path: started → shipped */}
              {arc ? (
                <div className="border-t border-white/8 bg-gradient-to-b from-cyan-400/[0.06] to-transparent px-4 py-4 sm:px-6">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">
                    {t.work.pathLabel}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        {t.work.pathFrom}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {arc.from}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                    <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] p-3.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/80">
                        {t.work.pathTo}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-emerald-50/95">
                        {arc.to}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Highlights + tags */}
              <div className="border-t border-white/8 px-4 py-4 sm:px-6">
                <ul className="grid gap-2 sm:grid-cols-2">
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
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-300">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {selectedIndex + 1} / {current.projects.length} ·{" "}
                    {t.work.projectsLabel}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {selectedDemo && selectedProject && selectedCopy ? (
        <ProjectPlayground
          open={playgroundOpen}
          onClose={() => setPlaygroundOpen(false)}
          demo={selectedDemo.demo}
          initialScene={selectedDemo.scene}
          previewImage={selectedProject.image}
          title={selectedCopy.title}
          labels={{
            liveDemo: t.work.playground.liveDemo,
            synthetic: t.work.playground.synthetic,
            disclaimer: t.work.playground.disclaimer,
            loading: t.work.playground.loading,
            close: t.work.playground.close,
            openTab: t.work.playground.openTab,
          }}
        />
      ) : null}
    </section>
  );
}
