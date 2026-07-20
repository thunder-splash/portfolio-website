export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_40%_30%,rgba(34,211,238,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_85%_55%,rgba(16,185,129,0.08),transparent_55%)]" />

      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(34,211,238,0.12) 1px, transparent 1px),
            linear-gradient(150deg, rgba(34,211,238,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "56px 96px, 56px 96px, 28px 28px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 55% 40%, black 10%, transparent 70%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g transform="translate(72% 20%)">
          <g
            className="geo-drift"
            fill="none"
            stroke="rgba(34,211,238,0.35)"
            strokeWidth="1.2"
          >
            <rect
              x="-36"
              y="-36"
              width="72"
              height="72"
              rx="4"
              transform="rotate(12)"
            />
            <rect
              x="-22"
              y="-22"
              width="44"
              height="44"
              rx="2"
              transform="rotate(-8)"
              opacity="0.6"
            />
          </g>
        </g>
        <g transform="translate(16% 64%)">
          <g
            className="geo-drift-slow"
            fill="none"
            stroke="rgba(16,185,129,0.3)"
            strokeWidth="1"
          >
            <path d="M0,-40 L35,-12 L35,28 L0,56 L-35,28 L-35,-12 Z" />
            <circle r="3" fill="rgba(16,185,129,0.45)" stroke="none" />
          </g>
        </g>
        <g stroke="rgba(148,163,184,0.2)" strokeWidth="1" fill="none">
          <path d="M40 480 L180 280 L320 360" />
          <circle
            cx="180"
            cy="280"
            r="2.5"
            fill="rgba(34,211,238,0.4)"
            stroke="none"
          />
        </g>
      </svg>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      {/* Soft dissolve into the content deck — not a hard “new section” block */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#05070d]/40 to-[#070b14]/90" />
    </div>
  );
}
