"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { CopyChip } from "@/components/CopyChip";
import { GithubIcon, TelegramIcon } from "@/components/icons";
import { profile } from "@/data/portfolio";
import { useI18n } from "@/i18n/LanguageProvider";

export function Footer() {
  const { t } = useI18n();

  const socials = [
    { label: "GitHub", href: profile.socials.github, icon: GithubIcon },
    { label: "Telegram", href: profile.socials.telegram, icon: TelegramIcon },
    { label: "Email", href: profile.socials.email, icon: Mail },
  ] as const;

  return (
    <footer id="contact" className="relative scroll-mt-24 border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_100%,rgba(34,211,238,0.08),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400/90">
            {t.contact.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {t.contact.title}
          </h2>

          <div className="mx-auto mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-2">
            <CopyChip
              label={t.contact.email}
              value={profile.email}
              accent="cyan"
              icon={<Mail size={16} />}
            />
            <CopyChip
              label={t.contact.telegram}
              value={profile.telegram}
              accent="emerald"
              icon={<TelegramIcon size={16} />}
            />
          </div>

          <p className="mt-5 font-mono text-sm text-slate-500">{profile.phone}</p>
        </motion.div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="inline-flex items-center gap-2 rounded-md border border-white/8 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <Icon size={14} className="h-3.5 w-3.5" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
