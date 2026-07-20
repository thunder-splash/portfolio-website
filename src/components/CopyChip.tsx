"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";

type CopyChipProps = {
  value: string;
  label?: string;
  icon?: ReactNode;
  accent?: "cyan" | "emerald";
};

export function CopyChip({
  value,
  label,
  icon,
  accent = "cyan",
}: CopyChipProps) {
  const [copied, setCopied] = useState(false);

  const accents = {
    cyan: {
      border: "border-cyan-400/25 hover:border-cyan-400/50",
      bg: "bg-cyan-400/5 hover:bg-cyan-400/10",
      text: "text-cyan-200",
      iconBg: "bg-cyan-400/15 text-cyan-300",
      success: "text-emerald-300",
    },
    emerald: {
      border: "border-emerald-400/25 hover:border-emerald-400/50",
      bg: "bg-emerald-400/5 hover:bg-emerald-400/10",
      text: "text-emerald-200",
      iconBg: "bg-emerald-400/15 text-emerald-300",
      success: "text-emerald-300",
    },
  } as const;

  const styles = accents[accent];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${label ?? value}`}
      className={`group inline-flex max-w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${styles.border} ${styles.bg}`}
    >
      {icon ? (
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${styles.iconBg}`}
        >
          {icon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        {label ? (
          <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {label}
          </span>
        ) : null}
        <span
          className={`block truncate font-mono text-sm tracking-wide ${styles.text}`}
        >
          {value}
        </span>
      </span>

      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 transition group-hover:border-white/20 group-hover:text-white">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={styles.success}
            >
              <Check size={15} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Copy size={14} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
