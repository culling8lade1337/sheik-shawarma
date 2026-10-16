import type { ReactNode, MouseEventHandler } from "react";
import { UIIcon } from "./Icon";

type BtnProps = {
  variant?: "primary" | "red" | "ghost";
  tone?: "dark" | "light"; // surface the button sits on (dark = red/ember, light = white)
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
  caret?: boolean;
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function Btn({
  variant = "primary",
  tone = "dark",
  href,
  onClick,
  children,
  caret = true,
  className = "",
  external,
  type = "button",
  ariaLabel,
}: BtnProps) {
  const cls = `btn btn-${variant} ${tone === "light" ? "on-light" : ""} ${className}`;
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {caret && <UIIcon name="caret" size={16} className="btn-caret" />}
    </>
  );
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

export function Marquee({ words }: { words: string[] }) {
  const row = (key: string) => (
    <span className="marquee-row" key={key} aria-hidden={key === "b"}>
      {words.map((w, i) => (
        <span className={`marquee-word ${i % 2 ? "inv" : ""}`} key={w + i}>
          {w}
          <span className="marquee-star">★</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-label={words.join(", ")} role="marquee">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
        {row("c")}
        {row("d")}
      </div>
    </div>
  );
}

export function StatusBadge({ open, until, next }: { open: boolean; until: string; next: string }) {
  return (
    <span className={`badge ${open ? "badge-open" : "badge-closed"}`} role="status">
      <i className="badge-dot" />
      {open ? `Open now · until ${until}` : `Closed · opens ${next}`}
    </span>
  );
}
