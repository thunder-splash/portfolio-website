"use client";

import { useI18n } from "@/i18n/LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, locales } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-md border border-white/10 bg-white/[0.03] p-0.5 ${
        compact ? "" : ""
      }`}
      role="group"
      aria-label="Language"
    >
      {locales.map((item) => {
        const active = item.code === locale;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code)}
            className={`min-w-9 rounded px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
              active
                ? "bg-cyan-400/15 text-cyan-300"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
