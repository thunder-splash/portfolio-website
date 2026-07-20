"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { profile } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";
import { scrollToId } from "@/lib/utils";

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "#stack", label: t.nav.stack },
    { href: "#metrics", label: t.nav.impact },
    { href: "#work", label: t.nav.work },
    { href: "#education", label: t.nav.education },
    { href: "#contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#05070d]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => scrollToId("hero")}
          className="group flex shrink-0 items-center gap-2 font-display text-sm font-semibold tracking-wide text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs text-cyan-300 transition group-hover:border-cyan-300/60 group-hover:bg-cyan-400/15">
            AS
          </span>
          <span className="hidden lg:inline">{profile.name}</span>
        </button>

        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleNav(link.href)}
                className="rounded-md px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 transition hover:bg-white/5 hover:text-cyan-300 lg:px-3"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href={profile.socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-400/15 sm:inline-flex"
          >
            {t.nav.hire}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-200 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-b border-white/5 bg-[#05070d]/95 px-5 py-6 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="w-full rounded-md px-3 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] text-slate-300 hover:bg-white/5 hover:text-cyan-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
