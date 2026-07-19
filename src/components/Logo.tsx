import type { CSSProperties } from "react";

/**
 * JobLens brand mark: a rounded gradient badge with a lens that contains a
 * checkmark — "analiza y valida". Scalable and crisp at any size.
 */
export function LogoMark({
  size = 32,
  style,
}: {
  size?: number;
  style?: CSSProperties;
}) {
  const gid = "jl-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${gid})`} />
      {/* Lens ring */}
      <circle cx="21" cy="21" r="11" stroke="#fff" strokeWidth="3.4" fill="none" />
      {/* Checkmark inside the lens */}
      <path
        d="M16 21.5l3.6 3.6L27 17.5"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Handle */}
      <path
        d="M29.5 29.5L37 37"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size} />
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        JobLens
      </span>
    </span>
  );
}
