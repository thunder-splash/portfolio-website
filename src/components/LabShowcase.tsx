"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectPlayground } from "@/components/ProjectPlayground";
import { getProjectDemo } from "@/data/demos";
import { labProjects, type LabAccent, type LabProject } from "@/data/labProjects";
import { useI18n } from "@/i18n/LanguageProvider";

const accentClasses: Record<
  LabAccent,
  { chip: string; ring: string; glow: string; text: string; bar: string }
> = {
  cyan: {
    chip: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    ring: "group-hover:border-cyan-400/35",
    glow: "group-hover:shadow-[0_24px_60px_-28px_rgba(34,211,238,0.5)]",
    text: "text-cyan-300",
    bar: "from-cyan-400/60",
  },
  emerald: {
    chip: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    ring: "group-hover:border-emerald-400/35",
    glow: "group-hover:shadow-[0_24px_60px_-28px_rgba(52,211,153,0.5)]",
    text: "text-emerald-300",
    bar: "from-emerald-400/60",
  },
  violet: {
    chip: "border-violet-400/25 bg-violet-400/10 text-violet-300",
    ring: "group-hover:border-violet-400/35",
    glow: "group-hover:shadow-[0_24px_60px_-28px_rgba(167,139,250,0.5)]",
    text: "text-violet-300",
    bar: "from-violet-400/60",
  },
  amber: {
    chip: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    ring: "group-hover:border-amber-400/35",
    glow: "group-hover:shadow-[0_24px_60px_-28px_rgba(251,191,36,0.45)]",
    text: "text-amber-300",
    bar: "from-amber-400/60",
  },
  blue: {
    chip: "border-blue-400/25 bg-blue-400/10 text-blue-300",
    ring: "group-hover:border-blue-400/35",
    glow: "group-hover:shadow-[0_24px_60px_-28px_rgba(96,165,250,0.5)]",
    text: "text-blue-300",
    bar: "from-blue-400/60",
  },
};

export function LabShowcase() {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const [demoId, setDemoId] = useState<string | null>(null);

  const openIndex = labProjects.findIndex((p) => p.id === openId);
  const active = openIndex >= 0 ? labProjects[openIndex] : null;
  const demoProject = labProjects.find((p) => p.id === demoId) ?? null;
  const demoLink = demoProject ? getProjectDemo(demoProject.id) : null;

  const step = useCallback(
    (dir: -1 | 1) => {
      if (openIndex < 0) return;
      const next =
        (openIndex + dir + labProjects.length) % labProjects.length;
      setOpenId(labProjects[next].id);
    },
    [openIndex],
  );

  return (
    <section
      id="lab"
      className="relative scroll-mt-24 py-20 md:py-28"
      style={{ overflowAnchor: "none" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.lab.eyebrow}
          title={t.lab.title}
          description={t.lab.description}
          accent="amber"
        />

        <p className="mb-8 max-w-2xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-slate-500">
          {t.lab.note}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {labProjects.map((project, i) => (
            <LabCard
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setOpenId(project.id)}
              onDemo={() => setDemoId(project.id)}
            />
          ))}
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600">
          {t.lab.gridHint}
        </p>
      </div>

      <LabDialog
        project={active}
        onClose={() => setOpenId(null)}
        onStep={step}
        onDemo={() => {
          if (active) setDemoId(active.id);
        }}
      />

      {demoProject && demoLink ? (
        <ProjectPlayground
          open
          onClose={() => setDemoId(null)}
          demo={demoLink.demo}
          initialScene={demoLink.scene}
          previewImage={demoProject.shots[0].src}
          title={t.lab.projects[demoProject.id].title}
          labels={t.work.playground}
        />
      ) : null}
    </section>
  );
}

function LabCard({
  project,
  index,
  onOpen,
  onDemo,
}: {
  project: LabProject;
  index: number;
  onOpen: () => void;
  onDemo: () => void;
}) {
  const { t } = useI18n();
  const copy = t.lab.projects[project.id];
  const accent = accentClasses[project.accent];
  const cover = project.shots[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.045] ${accent.ring} ${accent.glow}`}
    >
      <button
        type="button"
        onClick={onDemo}
        aria-label={`${copy.title} — ${t.lab.openDemo}`}
        className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-[#070b12] focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:outline-none"
      >
        <Image
          src={cover.src}
          alt={copy.title}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className={`object-top transition duration-500 group-hover:scale-[1.04] ${
            cover.kind === "phone" ? "object-contain p-3" : "object-cover"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/10 to-transparent" />

        <span
          className={`pointer-events-none absolute top-3 left-3 rounded-md border bg-[#05080f]/80 px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase backdrop-blur-sm ${accent.chip}`}
        >
          {copy.kind}
        </span>
        <span className="pointer-events-none absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md border border-emerald-400/45 bg-[#05080f]/80 px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-emerald-300 uppercase backdrop-blur-sm">
          <Play size={9} fill="currentColor" />
          {t.lab.demoBadge}
        </span>

        <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/65 px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] text-white uppercase backdrop-blur-md">
            <Play size={12} fill="currentColor" />
            {t.lab.openDemo}
          </span>
        </span>
      </button>

      <div className="relative -mt-px flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-[15px] leading-snug font-semibold text-white sm:text-base">
            {copy.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
            {copy.pitch}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          {project.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-slate-400"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 3 ? (
            <span className="font-mono text-[10px] text-slate-600">
              +{project.stack.length - 3}
            </span>
          ) : null}

          <button
            type="button"
            onClick={onOpen}
            className={`ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition hover:bg-white/5 ${accent.text}`}
          >
            {t.lab.open}
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LabDialog({
  project,
  onClose,
  onStep,
  onDemo,
}: {
  project: LabProject | null;
  onClose: () => void;
  onStep: (dir: -1 | 1) => void;
  onDemo: () => void;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [shot, setShot] = useState(0);

  useEffect(() => setMounted(true), []);
  useEffect(() => setShot(0), [project?.id]);

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, onStep]);

  if (!mounted) return null;

  const copy = project ? t.lab.projects[project.id] : null;
  const accent = project ? accentClasses[project.accent] : null;
  const current = project?.shots[Math.min(shot, project.shots.length - 1)];

  return createPortal(
    <AnimatePresence>
      {project && copy && accent && current ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-5 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label={t.lab.close}
            onClick={onClose}
            className="absolute inset-0 bg-[#03050a]/80 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            className="relative z-10 flex max-h-[94dvh] w-full max-w-[1180px] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#070b14] shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:rounded-2xl"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-display text-sm font-semibold text-white sm:text-base">
                    {copy.title}
                  </h3>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] ${accent.chip}`}
                  >
                    {copy.kind}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-slate-500 uppercase">
                  {project.name} · {project.year}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  aria-label={t.lab.prev}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  aria-label={t.lab.next}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.lab.close}
                  className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
                <div className="relative border-b border-white/8 bg-[#05080f] p-3 sm:p-4 lg:border-r lg:border-b-0">
                  <div
                    className={`relative w-full overflow-hidden rounded-xl border border-white/8 bg-[#070b12] ${
                      current.kind === "phone"
                        ? "aspect-[4/3] sm:aspect-[16/10]"
                        : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      key={current.src}
                      src={current.src}
                      alt={`${copy.title} — ${t.lab.shotOf} ${shot + 1}`}
                      fill
                      sizes="(max-width: 1024px) 94vw, 680px"
                      className={
                        current.kind === "phone"
                          ? "object-contain p-2"
                          : "object-cover object-top"
                      }
                      priority
                    />
                  </div>

                  <button
                    type="button"
                    onClick={onDemo}
                    className="group/d absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/15 px-4 py-3 font-display text-sm font-semibold text-emerald-100 backdrop-blur-md transition hover:border-emerald-300/50 hover:bg-emerald-400/25 sm:inset-x-4 sm:bottom-4"
                    style={{
                      bottom: project.shots.length > 1 ? "5.1rem" : undefined,
                    }}
                  >
                    <Play size={13} fill="currentColor" />
                    {t.lab.openDemo}
                  </button>

                  {project.shots.length > 1 ? (
                    <div className="mt-3 flex gap-2">
                      {project.shots.map((s, i) => (
                        <button
                          key={s.src}
                          type="button"
                          onClick={() => setShot(i)}
                          aria-label={`${t.lab.shotOf} ${i + 1}`}
                          aria-current={i === shot}
                          className={`relative h-12 w-20 overflow-hidden rounded-lg border transition ${
                            i === shot
                              ? "border-white/35 opacity-100"
                              : "border-white/10 opacity-60 hover:opacity-90"
                          }`}
                        >
                          <Image
                            src={s.src}
                            alt=""
                            fill
                            sizes="80px"
                            className={
                              s.kind === "phone"
                                ? "object-contain p-0.5"
                                : "object-cover object-top"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-5 p-4 sm:p-5">
                  <p className="text-[13.5px] leading-relaxed text-slate-300">
                    {copy.summary}
                  </p>

                  <div>
                    <p className="mb-2.5 font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                      {t.lab.highlightsLabel}
                    </p>
                    <ul className="space-y-2.5">
                      {copy.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2.5 text-[13px] leading-relaxed text-slate-400"
                        >
                          <span
                            className={`mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current ${accent.text}`}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2.5 font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                      {t.lab.figuresLabel}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {project.figures.map((fig) => (
                        <div
                          key={fig.id}
                          className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2"
                        >
                          <p className="font-display text-sm font-semibold text-white">
                            {fig.value}
                          </p>
                          <p className="mt-0.5 font-mono text-[9.5px] tracking-[0.1em] text-slate-500 uppercase">
                            {t.lab.figures[fig.id] ?? fig.id}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                      {t.lab.stackLabel}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-1 font-mono text-[10.5px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-auto border-t border-white/8 pt-3 font-mono text-[10px] leading-relaxed text-slate-600">
                    {t.lab.note}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
