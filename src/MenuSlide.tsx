import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { categories, categoryById, items, info, type Item, type Tag } from "./menu";
import { matches, price, segments, terms } from "./lib";
import { FoodIcon, UIIcon } from "./Icon";
import { Btn } from "./ui";

type Sort = "rec" | "asc" | "desc";
type Filter = Tag | "cheap";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "spicy", label: "Spicy" },
  { id: "cheap", label: "Under 100 kr" },
];

const readStore = (k: string, d: string) => {
  try {
    return sessionStorage.getItem(k) ?? d;
  } catch {
    return d;
  }
};
const writeStore = (k: string, v: string) => {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* storage unavailable — fine */
  }
};

function Hl({ text, ts }: { text: string; ts: string[] }) {
  if (!ts.length) return <>{text}</>;
  return (
    <>
      {segments(text, ts).map(([s, m], i) =>
        m ? (
          <mark key={i}>{s}</mark>
        ) : (
          <span key={i}>{s}</span>
        ),
      )}
    </>
  );
}

export function MenuSlide({ active }: { active: boolean }) {
  const [q, setQ] = useState(() => readStore("ss-q", ""));
  const [dq, setDq] = useState(q);
  const [cat, setCat] = useState(() => readStore("ss-cat", "all"));
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sort, setSort] = useState<Sort>("rec");
  const [open, setOpen] = useState<Item | null>(null);

  const pillsRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hl, setHl] = useState({ left: 0, width: 0 });

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 120);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => writeStore("ss-q", q), [q]);
  useEffect(() => writeStore("ss-cat", cat), [cat]);

  /* shared sliding highlight + keep active pill centered (no ancestor scrolling) */
  useLayoutEffect(() => {
    const measure = () => {
      const el = pillRefs.current[cat];
      const scroller = pillsRef.current;
      if (!el) return;
      setHl({ left: el.offsetLeft, width: el.offsetWidth });
      if (scroller) {
        const target = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
        scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    (document as any).fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [cat]);

  /* Esc closes the detail sheet */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ts = useMemo(() => terms(dq), [dq]);

  const list = useMemo(() => {
    let r = items.filter((it) => {
      if (cat !== "all" && it.category !== cat) return false;
      if (filters.includes("vegetarian") && !it.tags.includes("vegetarian")) return false;
      if (filters.includes("spicy") && !it.tags.includes("spicy")) return false;
      if (filters.includes("cheap") && it.price >= 100) return false;
      const hay = `${it.name} ${it.description} ${it.tags.join(" ")} ${categoryById[it.category].label}`;
      return matches(hay, ts);
    });
    if (sort === "asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [cat, filters, ts, sort]);

  const grouped = sort === "rec" && cat === "all";
  const toggleFilter = (f: Filter) =>
    setFilters((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  const clearAll = () => {
    setQ("");
    setDq("");
    setFilters([]);
    setCat("all");
    setSort("rec");
  };

  const renderCard = (it: Item) => (
    <button key={it.id} className="card" onClick={() => setOpen(it)} aria-label={`${it.name}, ${price(it.price)}`}>
      <span className="card-stripe" aria-hidden="true" />
      <span className="card-visual">
        {it.image ? (
          <img src={it.image} alt="" loading="lazy" />
        ) : (
          <FoodIcon name={categoryById[it.category].icon} size={56} />
        )}
      </span>
      <span className="card-body">
        <span className="card-name">
          <Hl text={it.name} ts={ts} />
        </span>
        <span className="card-desc">
          <Hl text={it.description} ts={ts} />
        </span>
        <span className="card-foot">
          <span className="chips">
            {it.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </span>
          <span className="card-price">{price(it.price)}</span>
        </span>
      </span>
    </button>
  );

  return (
    <section className="slide slide-menu" id="slide-menu" role="tabpanel" aria-label="Menu">
      <div className="menu-controls" data-noswipe>
        <div className="menu-controls-inner">
          <label className="search">
            <UIIcon name="search" size={22} className="search-ico" />
            <input
              id="menu-search"
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Search menu… (shawarma, falafel, vegan)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") (e.target as HTMLInputElement).blur();
              }}
              tabIndex={active ? 0 : -1}
              aria-label="Search menu"
            />
            {q ? (
              <button className="search-clear" onClick={() => setQ("")} aria-label="Clear search">
                <UIIcon name="close" size={18} />
              </button>
            ) : (
              <kbd className="search-kbd" aria-hidden="true">
                /
              </kbd>
            )}
          </label>

          <div className="pills" ref={pillsRef} role="tablist" aria-label="Categories">
            <div className="pills-track">
              <i className="pill-hl" style={{ left: hl.left, width: hl.width }} />
              {[{ id: "all", label: "All" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  ref={(el) => {
                    pillRefs.current[c.id] = el;
                  }}
                  role="tab"
                  aria-selected={cat === c.id}
                  className="pill"
                  onClick={() => setCat(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar">
            <div className="chips-row" role="group" aria-label="Filters">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`fchip ${filters.includes(f.id) ? "on" : ""}`}
                  aria-pressed={filters.includes(f.id)}
                  onClick={() => toggleFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="sort" role="group" aria-label="Sort">
              {(
                [
                  ["rec", "Recommended"],
                  ["asc", "Price ↑"],
                  ["desc", "Price ↓"],
                ] as [Sort, string][]
              ).map(([id, label]) => (
                <button key={id} className={sort === id ? "on" : ""} aria-pressed={sort === id} onClick={() => setSort(id)}>
                  {label}
                </button>
              ))}
            </div>
            <span className="count" aria-live="polite">
              {list.length} {list.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      <div className="wrap menu-body">
        {list.length === 0 ? (
          <div className="empty">
            <p className="display-lg">Nothing here</p>
            <Btn variant="primary" onClick={clearAll}>
              Clear search
            </Btn>
          </div>
        ) : grouped ? (
          categories.map((c) => {
            const group = list.filter((it) => it.category === c.id);
            if (!group.length) return null;
            return (
              <div className="group" key={c.id}>
                <h2 className="group-title">
                  {c.label} <span className="group-n">({group.length})</span>
                </h2>
                <div className="stripe-rule" aria-hidden="true" />
                <div className="grid">{group.map(renderCard)}</div>
              </div>
            );
          })
        ) : (
          <div className="grid">{list.map(renderCard)}</div>
        )}
      </div>

      {open &&
        createPortal(
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={open.name}>
          <div className="sheet-backdrop" onClick={() => setOpen(null)} />
          <div className="sheet">
            <span className="sheet-stripe" aria-hidden="true" />
            <div className="sheet-visual">
              {open.image ? (
                <img src={open.image} alt="" />
              ) : (
                <FoodIcon name={categoryById[open.category].icon} size={96} />
              )}
            </div>
            <p className="sheet-cat">{categoryById[open.category].label}</p>
            <h3 className="sheet-name">{open.name}</h3>
            <p className="sheet-price">{price(open.price)}</p>
            <p className="sheet-desc">{open.description}</p>
            {open.tags.length > 0 && (
              <div className="chips sheet-chips">
                {open.tags.map((t) => (
                  <span className="chip dark" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <p className="fine dark">Ingredients and allergens: please ask at the counter.</p>
            <div className="cta-row">
              <Btn variant="red" tone="light" href={info.links.wolt} external>
                Order on Wolt
              </Btn>
              <Btn variant="ghost" tone="light" onClick={() => setOpen(null)} caret={false}>
                Close
              </Btn>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </section>
  );
}
