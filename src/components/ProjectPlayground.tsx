"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Loader2, X } from "lucide-react";
import {
  demoFrameUrl,
  type InteractiveDemo,
  type DemoScene,
} from "@/data/demos";

type Props = {
  open: boolean;
  onClose: () => void;
  demo: InteractiveDemo;
  initialScene: DemoScene;
  previewImage: string;
  title: string;
  labels: {
    liveDemo: string;
    synthetic: string;
    disclaimer: string;
    loading: string;
    close: string;
    openTab: string;
  };
};

export function ProjectPlayground({
  open,
  onClose,
  demo,
  initialScene,
  previewImage,
  title,
  labels,
}: Props) {
  const [frameReady, setFrameReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  const frameSrc = useMemo(
    () => demoFrameUrl(demo.baseUrl, initialScene.path),
    [demo.baseUrl, initialScene.path],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setFrameReady(false);
  }, [open, frameSrc]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-5 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <motion.button
            type="button"
            aria-label={labels.close}
            className="absolute inset-0 bg-[#03050a]/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-10 flex h-[100dvh] w-full max-w-[1400px] flex-col overflow-hidden border border-white/10 bg-[#070b14] shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:h-[min(920px,94dvh)] sm:w-[min(96vw,1400px)] sm:rounded-2xl"
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-white/8 bg-white/[0.03] px-3 py-2.5 sm:px-4">
              <div className="hidden items-center gap-1.5 sm:flex" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-sm font-semibold text-white">
                    {title}
                  </p>
                  <span className="hidden rounded-md border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300 sm:inline">
                    {labels.liveDemo}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {labels.synthetic}
                </p>
              </div>

              <a
                href={frameSrc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                <ExternalLink size={12} />
                <span className="hidden sm:inline">{labels.openTab}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                aria-label={labels.close}
              >
                <X size={16} />
              </button>
            </div>

            <div className="shrink-0 border-b border-amber-400/20 bg-amber-400/[0.08] px-3 py-2 sm:px-4">
              <p className="text-[11px] leading-snug text-amber-100/90 sm:text-xs">
                {labels.disclaimer}
              </p>
            </div>

            <div className="relative min-h-0 flex-1 bg-[#eef2f6]">
              <AnimatePresence>
                {!frameReady ? (
                  <motion.div
                    key="cover"
                    className="absolute inset-0 z-10"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={previewImage}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-[#070b14]/25 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#070b14]/70 px-4 py-2 backdrop-blur-md">
                        <Loader2
                          size={14}
                          className="animate-spin text-cyan-300"
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-200">
                          {labels.loading}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <iframe
                key={frameSrc}
                title={title}
                src={frameSrc}
                className="absolute inset-0 h-full w-full border-0 bg-white"
                onLoad={() => setFrameReady(true)}
                allow="clipboard-write"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
