import type { ReactNode } from "react";

type P = { size?: number; className?: string };

const base = (size: number, className: string | undefined, children: ReactNode, vb = 64) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${vb} ${vb}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={vb === 64 ? 3 : 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* ---------- food glyphs (64 grid) ---------- */

export const FoodIcon = ({
  name,
  size = 48,
  className,
}: P & { name: "durum" | "pita" | "plate" | "bowl" | "cup" | "fries" | "dip" | "nuggets" }) => {
  switch (name) {
    case "durum":
      return base(
        size,
        className,
        <>
          <g transform="rotate(-28 32 32)">
            <rect x="8" y="22" width="48" height="22" rx="11" />
            <path d="M36 22v22M44 22v22" />
            <path d="M14 30c5-3 9-3 13 0M14 37c5-3 9-3 13 0" />
          </g>
          <path d="M10 52h20" />
        </>,
      );
    case "pita":
      return base(
        size,
        className,
        <>
          <path d="M8 42a24 24 0 0 1 48 0Z" />
          <path d="M16 42a16 16 0 0 1 32 0" />
          <path d="M20 34c3-4 6-4 9 0s6 4 9 0" />
          <path d="M10 50h44" />
        </>,
      );
    case "plate":
      return base(
        size,
        className,
        <>
          <ellipse cx="32" cy="38" rx="26" ry="12" />
          <ellipse cx="32" cy="36" rx="16" ry="6" />
          <path d="M22 28c2-8 6-12 10-12s8 4 10 12" />
        </>,
      );
    case "bowl":
      return base(
        size,
        className,
        <>
          <path d="M8 30h48c0 14-10 24-24 24S8 44 8 30Z" />
          <path d="M22 22c-2-3 2-5 0-8M32 22c-2-3 2-5 0-8M42 22c-2-3 2-5 0-8" />
        </>,
      );
    case "cup":
      return base(
        size,
        className,
        <>
          <path d="M18 18h28l-4 38H22Z" />
          <path d="M16 18h32" />
          <path d="M34 18l8-12h8" />
          <path d="M22 32h20" />
        </>,
      );
    case "fries":
      return base(
        size,
        className,
        <>
          <path d="M16 28h32l-4 28H20Z" />
          <path d="M22 28V10M30 28V6M38 28V10M45 28V14" />
        </>,
      );
    case "dip":
      return base(
        size,
        className,
        <>
          <path d="M14 26h36l-4 24H18Z" />
          <path d="M12 26h40" />
          <path d="M24 26c2-8 14-8 16 0" />
        </>,
      );
    case "nuggets":
      return base(
        size,
        className,
        <>
          <circle cx="22" cy="24" r="12" />
          <circle cx="44" cy="30" r="11" />
          <circle cx="28" cy="46" r="10" />
        </>,
      );
  }
};

/* ---------- UI glyphs (24 grid) ---------- */

export const UIIcon = ({
  name,
  size = 20,
  className,
}: P & {
  name:
    | "search"
    | "close"
    | "caret"
    | "left"
    | "right"
    | "home"
    | "menu"
    | "about"
    | "pin"
    | "phone"
    | "clock"
    | "star";
}) => {
  switch (name) {
    case "search":
      return base(size, className, <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, 24);
    case "close":
      return base(size, className, <path d="M6 6l12 12M18 6 6 18" />, 24);
    case "caret":
      return base(size, className, <path d="M9 6l6 6-6 6" />, 24);
    case "left":
      return base(size, className, <path d="M15 5l-7 7 7 7" />, 24);
    case "right":
      return base(size, className, <path d="M9 5l7 7-7 7" />, 24);
    case "home":
      return base(size, className, <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /></>, 24);
    case "menu":
      return base(size, className, <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></>, 24);
    case "about":
      return base(size, className, <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>, 24);
    case "pin":
      return base(size, className, <><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>, 24);
    case "phone":
      return base(size, className, <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />, 24);
    case "clock":
      return base(size, className, <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, 24);
    case "star":
      return base(size, className, <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z" />, 24);
  }
};
