import { useCallback, useEffect, useRef, useState } from "react";
import { Dots, Progress, SLIDES, TabBar, TopNav } from "./Nav";
import { AboutSlide, FindSlide, HomeSlide } from "./Slides";
import { MenuSlide } from "./MenuSlide";
import { UIIcon } from "./Icon";
import { openStatus } from "./lib";

const idxFromHash = () => {
  const h = window.location.hash.replace("#", "");
  const i = SLIDES.findIndex((s) => s.id === h);
  return i < 0 ? 0 : i;
};

export default function App() {
  const [index, setIndex] = useState(idxFromHash);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [wipe, setWipe] = useState({ key: 0, dir: 1 });
  const [status, setStatus] = useState(() => openStatus());
  const indexRef = useRef(index);
  indexRef.current = index;

  /* live open / closed */
  useEffect(() => {
    const t = setInterval(() => setStatus(openStatus()), 30_000);
    return () => clearInterval(t);
  }, []);

  const go = useCallback((to: number) => {
    const i = Math.max(0, Math.min(SLIDES.length - 1, to));
    const cur = indexRef.current;
    if (i === cur) return;
    setIndex(i);
    setWipe((w) => ({ key: w.key + 1, dir: i > cur ? 1 : -1 }));
    try {
      window.history.pushState(null, "", `#${SLIDES[i].id}`);
    } catch {
      /* sandboxed iframe — ignore */
    }
  }, []);

  /* back / forward + manual hash edits */
  useEffect(() => {
    const onNav = () => {
      const i = idxFromHash();
      const cur = indexRef.current;
      if (i !== cur) {
        setIndex(i);
        setWipe((w) => ({ key: w.key + 1, dir: i > cur ? 1 : -1 }));
      }
    };
    window.addEventListener("popstate", onNav);
    window.addEventListener("hashchange", onNav);
    return () => {
      window.removeEventListener("popstate", onNav);
      window.removeEventListener("hashchange", onNav);
    };
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        go(1);
        setTimeout(() => document.getElementById("menu-search")?.focus({ preventScroll: true }), 480);
        return;
      }
      if (typing) return;
      if (e.key === "ArrowRight") go(indexRef.current + 1);
      else if (e.key === "ArrowLeft") go(indexRef.current - 1);
      else if (/^[1-4]$/.test(e.key)) go(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  /* horizontal wheel / trackpad */
  const wheelLock = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2 && Math.abs(e.deltaX) > 24;
    if (!horizontal) return;
    const now = Date.now();
    if (now < wheelLock.current) return;
    wheelLock.current = now + 700;
    go(indexRef.current + (e.deltaX > 0 ? 1 : -1));
  };

  /* touch swipe (ignores areas marked data-noswipe, e.g. the category pills) */
  const t0 = useRef<{ x: number; y: number; t: number; axis: "x" | "y" | null; skip: boolean } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const skip = !!(e.target as HTMLElement).closest?.("[data-noswipe], .sheet-wrap");
    t0.current = { x: t.clientX, y: t.clientY, t: Date.now(), axis: null, skip };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const s = t0.current;
    if (!s || s.skip) return;
    const t = e.touches[0];
    const mx = t.clientX - s.x;
    const my = t.clientY - s.y;
    if (!s.axis && (Math.abs(mx) > 10 || Math.abs(my) > 10)) s.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
    if (s.axis === "x") {
      const atEdge = (index === 0 && mx > 0) || (index === SLIDES.length - 1 && mx < 0);
      setDragging(true);
      setDx(atEdge ? mx * 0.25 : mx);
    }
  };
  const onTouchEnd = () => {
    const s = t0.current;
    t0.current = null;
    if (!s || s.axis !== "x") {
      setDragging(false);
      setDx(0);
      return;
    }
    const dt = Math.max(1, Date.now() - s.t);
    const v = dx / dt;
    setDragging(false);
    setDx(0);
    if (Math.abs(dx) > 70 || Math.abs(v) > 0.45) go(index + (dx < 0 ? 1 : -1));
  };

  const slideKey = SLIDES[index].id;

  return (
    <div className="app" data-slide={slideKey}>
      <TopNav index={index} go={go} />

      <main
        className="viewport"
        onWheel={onWheel}
        onScroll={(e) => {
          (e.currentTarget as HTMLElement).scrollLeft = 0;
        }}
      >
        <div
          className={`track ${dragging ? "dragging" : ""}`}
          style={{ transform: `translate3d(calc(${-index * 100}% + ${dx}px),0,0)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <Slide on={index === 0}>
            <HomeSlide go={go} status={status} />
          </Slide>
          <Slide on={index === 1}>
            <MenuSlide active={index === 1} />
          </Slide>
          <Slide on={index === 2}>
            <AboutSlide go={go} />
          </Slide>
          <Slide on={index === 3}>
            <FindSlide status={status} />
          </Slide>
        </div>

        {wipe.key > 0 && (
          <div key={wipe.key} className={`wipe ${wipe.dir < 0 ? "rev" : ""}`} aria-hidden="true" />
        )}

        {index > 0 && (
          <button className="arrow arrow-l" onClick={() => go(index - 1)} aria-label="Previous slide">
            <UIIcon name="left" size={24} />
          </button>
        )}
        {index < SLIDES.length - 1 && (
          <button className="arrow arrow-r" onClick={() => go(index + 1)} aria-label="Next slide">
            <UIIcon name="right" size={24} />
          </button>
        )}

        <Dots index={index} go={go} />
      </main>

      <TabBar index={index} go={go} />
      <Progress index={index} />
    </div>
  );
}

function Slide({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div className={`slide-cell ${on ? "on" : ""}`} aria-hidden={!on} {...(!on ? { inert: true } : {})}>
      {children}
    </div>
  );
}
