import { useLayoutEffect, useRef, useState } from "react";
import { UIIcon } from "./Icon";
import { Btn } from "./ui";
import { info } from "./menu";

export const SLIDES = [
  { id: "home", label: "Home", icon: "home" },
  { id: "menu", label: "Menu", icon: "menu" },
  { id: "about", label: "About", icon: "about" },
  { id: "find-us", label: "Find us", icon: "pin" },
] as const;

export function TopNav({ index, go }: { index: number; go: (i: number) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hl, setHl] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[index];
      if (el) setHl({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    (document as any).fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  return (
    <>
      <header className="nav">
        <button className="wordmark" onClick={() => go(0)} aria-label="Sheik Shawarma — home">
          <span className="wm-red">SHEIK</span> SHAWARMA
        </button>

        <nav className="tabs" role="tablist" aria-label="Sections">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              aria-selected={i === index}
              aria-controls={`slide-${s.id}`}
              className="tab"
              onClick={() => go(i)}
            >
              {s.label}
            </button>
          ))}
          <i className="tab-hl" style={{ left: hl.left, width: hl.width }} />
        </nav>

        <Btn variant="red" href={info.links.wolt} external className="nav-cta">
          Order
        </Btn>
      </header>
      <div className="stripe-band" aria-hidden="true" />
    </>
  );
}

export function TabBar({ index, go }: { index: number; go: (i: number) => void }) {
  return (
    <nav className="tabbar" role="tablist" aria-label="Sections">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          role="tab"
          aria-selected={i === index}
          className="tabbar-item"
          onClick={() => go(i)}
        >
          <UIIcon name={s.icon} size={22} />
          <span>{s.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function Progress({ index }: { index: number }) {
  const p = ((index + 1) / SLIDES.length) * 100;
  return (
    <div className="progress" aria-hidden="true">
      <i style={{ width: `${p}%` }} />
    </div>
  );
}

export function Dots({ index, go }: { index: number; go: (i: number) => void }) {
  return (
    <div className="dots" role="group" aria-label="Choose slide">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          className={`dot ${i === index ? "on" : ""}`}
          aria-label={`Go to ${s.label}`}
          aria-current={i === index}
          onClick={() => go(i)}
        />
      ))}
    </div>
  );
}
