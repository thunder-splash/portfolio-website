"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page scrolling geometry with layered parallax.
 * Moves with the document (not window-fixed), depth via scroll offsets.
 */
export function GeometricBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const update = () => {
      const y = window.scrollY;
      root.style.setProperty("--sy", `${y}`);
    };

    const onScroll = () => {
      if (reduced) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [--sy:0]"
    >
      {/* Solid base — scrolls with page */}
      <div className="absolute inset-0 bg-[#05070d]" />

      {/* Far layer — lags behind (slow parallax) */}
      <div
        className="absolute inset-x-0 top-0 h-[160%] will-change-transform"
        style={{
          transform:
            "translate3d(0, calc(var(--sy) * 0.18px), 0)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_8%,rgba(34,211,238,0.11),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_88%_22%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_8%_55%,rgba(56,189,248,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_70%_78%,rgba(34,211,238,0.06),transparent_55%)]" />

        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Mid layer */}
      <div
        className="absolute inset-x-0 top-0 h-[150%] will-change-transform"
        style={{
          transform:
            "translate3d(0, calc(var(--sy) * 0.32px), 0)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(34,211,238,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34,211,238,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(ellipse 60% 40% at 70% 15%, black, transparent 70%), radial-gradient(ellipse 50% 35% at 20% 60%, black, transparent 70%)",
          }}
        />

        <div
          className="absolute top-[55%] inset-x-0 h-[50vh] opacity-[0.16]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            transform: "perspective(700px) rotateX(58deg)",
            transformOrigin: "center top",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="geo-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34,211,238,0)" />
              <stop offset="50%" stopColor="rgba(34,211,238,0.4)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
            <linearGradient
              id="geo-emerald"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(16,185,129,0)" />
              <stop offset="50%" stopColor="rgba(16,185,129,0.32)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </linearGradient>
          </defs>

          <g stroke="url(#geo-line)" strokeWidth="1" fill="none">
            <path d="M-40 180 L420 40" opacity="0.5" />
            <path d="M200 0 L980 520" opacity="0.3" />
            <path d="M60 900 L700 620" opacity="0.35" />
            <path d="M-20 1400 L560 1100" opacity="0.28" />
          </g>
          <g stroke="url(#geo-emerald)" strokeWidth="1" fill="none">
            <path d="M1100 -20 L720 380" opacity="0.35" />
            <path d="M1280 700 L760 1100" opacity="0.28" />
            <path d="M1200 1500 L680 1750" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* Near layer — moves faster, feels closer */}
      <div
        className="absolute inset-x-0 top-0 h-[140%] will-change-transform"
        style={{
          transform:
            "translate3d(0, calc(var(--sy) * 0.48px), 0)",
        }}
      >
        <svg
          className="absolute inset-0 h-full min-h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1280 2200"
          preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            <radialGradient id="geo-orb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </radialGradient>
          </defs>

          {/* Zone 1 — hero */}
          <g transform="translate(820 80)">
            <g
              className="geo-drift"
              fill="none"
              stroke="rgba(34,211,238,0.3)"
              strokeWidth="1"
            >
              <polygon points="60,0 90,17 90,52 60,70 30,52 30,17" />
              <polygon points="120,35 150,52 150,87 120,105 90,87 90,52" />
              <polygon points="60,70 90,87 90,122 60,140 30,122 30,87" />
              <polygon points="0,35 30,52 30,87 0,105 -30,87 -30,52" />
              <circle
                cx="60"
                cy="70"
                r="2.5"
                fill="rgba(34,211,238,0.55)"
                stroke="none"
              />
            </g>
          </g>

          <g transform="translate(60 240)">
            <g
              className="geo-drift-slow"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="1"
            >
              <polygon points="80,0 140,50 80,100 20,50" />
              <line x1="80" y1="0" x2="80" y2="100" />
              <line x1="20" y1="50" x2="140" y2="50" />
              <circle
                cx="80"
                cy="50"
                r="3"
                fill="rgba(34,211,238,0.35)"
                stroke="none"
              />
            </g>
          </g>

          <g transform="translate(1080 400)">
            <g className="geo-spin">
              <circle
                r="110"
                fill="none"
                stroke="rgba(34,211,238,0.12)"
                strokeWidth="1"
                strokeDasharray="4 10"
              />
              <circle
                r="74"
                fill="none"
                stroke="rgba(16,185,129,0.14)"
                strokeWidth="1"
                strokeDasharray="2 8"
              />
              <circle
                r="42"
                fill="none"
                stroke="rgba(34,211,238,0.18)"
                strokeWidth="1"
              />
              <circle r="4" fill="rgba(34,211,238,0.5)" />
              <circle cx="74" cy="0" r="3" fill="rgba(16,185,129,0.7)" />
            </g>
          </g>

          <circle cx="1000" cy="180" r="160" fill="url(#geo-orb)" opacity="0.5" />

          {/* Zone 2 — mid page */}
          <g transform="translate(120 820)">
            <g
              className="geo-drift"
              fill="none"
              stroke="rgba(16,185,129,0.28)"
              strokeWidth="1"
            >
              <polygon points="50,0 75,14 75,43 50,58 25,43 25,14" />
              <polygon points="100,29 125,43 125,72 100,87 75,72 75,43" />
              <circle
                cx="75"
                cy="43"
                r="2"
                fill="rgba(16,185,129,0.55)"
                stroke="none"
              />
            </g>
          </g>

          <g transform="translate(980 980)">
            <g
              className="geo-drift-slow"
              fill="none"
              stroke="rgba(34,211,238,0.25)"
              strokeWidth="1.2"
            >
              <rect
                x="-40"
                y="-40"
                width="80"
                height="80"
                rx="4"
                transform="rotate(18)"
              />
              <rect
                x="-24"
                y="-24"
                width="48"
                height="48"
                rx="2"
                transform="rotate(-10)"
                opacity="0.65"
              />
            </g>
          </g>

          <g transform="translate(200 1180)">
            <g className="geo-spin">
              <circle
                r="90"
                fill="none"
                stroke="rgba(148,163,184,0.14)"
                strokeWidth="1"
                strokeDasharray="3 9"
              />
              <circle
                r="52"
                fill="none"
                stroke="rgba(34,211,238,0.16)"
                strokeWidth="1"
              />
              <circle cx="52" cy="0" r="2.5" fill="rgba(34,211,238,0.55)" />
            </g>
          </g>

          {/* Zone 3 — lower page */}
          <g transform="translate(860 1550)">
            <g
              className="geo-drift"
              fill="none"
              stroke="rgba(34,211,238,0.26)"
              strokeWidth="1"
            >
              <path d="M0,-36 L32,-10 L32,26 L0,52 L-32,26 L-32,-10 Z" />
              <circle r="2.5" fill="rgba(34,211,238,0.45)" stroke="none" />
            </g>
          </g>

          <g transform="translate(160 1720)">
            <g
              className="geo-drift-slow"
              fill="none"
              stroke="rgba(16,185,129,0.22)"
              strokeWidth="1"
            >
              <polygon points="70,0 122,44 70,88 18,44" />
              <line x1="70" y1="0" x2="70" y2="88" />
              <line x1="18" y1="44" x2="122" y2="44" />
            </g>
          </g>

          <circle cx="240" cy="1480" r="140" fill="url(#geo-orb)" opacity="0.35" />
          <circle cx="1100" cy="1900" r="120" fill="url(#geo-orb)" opacity="0.28" />
        </svg>
      </div>

      {/* Edge brackets travel with page edges */}
      <div className="absolute top-24 left-4 h-10 w-10 border-t border-l border-cyan-400/25 sm:left-8" />
      <div className="absolute top-24 right-4 h-10 w-10 border-t border-r border-cyan-400/25 sm:right-8" />
      <div className="absolute bottom-10 left-4 h-10 w-10 border-b border-l border-emerald-400/20 sm:left-8" />
      <div className="absolute right-4 bottom-10 h-10 w-10 border-r border-b border-emerald-400/20 sm:right-8" />
    </div>
  );
}
