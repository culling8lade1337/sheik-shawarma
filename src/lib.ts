import { hours } from "./menu";

/* ---------- accent-insensitive search ---------- */

const fold1 = (c: string): string => {
  if (c === "ø" || c === "Ø") return "o";
  if (c === "æ" || c === "Æ") return "ae";
  if (c === "ß") return "ss";
  return c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
};

export function fold(s: string) {
  let out = "";
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const f = fold1(s[i]);
    for (let k = 0; k < f.length; k++) {
      out += f[k];
      map.push(i);
    }
  }
  return { out, map };
}

export const terms = (q: string): string[] =>
  fold(q)
    .out.split(/\s+/)
    .filter(Boolean);

export function matches(haystack: string, ts: string[]): boolean {
  if (!ts.length) return true;
  const h = fold(haystack).out;
  return ts.every((t) => h.includes(t));
}

/** Returns [text, isMatch] segments for highlighting. */
export function segments(text: string, ts: string[]): [string, boolean][] {
  if (!ts.length) return [[text, false]];
  const { out, map } = fold(text);
  const marks = new Array(text.length).fill(false);
  for (const t of ts) {
    let from = 0;
    while (true) {
      const at = out.indexOf(t, from);
      if (at < 0) break;
      const start = map[at];
      const end = map[at + t.length - 1] + 1;
      for (let i = start; i < end; i++) marks[i] = true;
      from = at + Math.max(1, t.length);
    }
  }
  const res: [string, boolean][] = [];
  let cur = "";
  let curMark = marks[0] ?? false;
  for (let i = 0; i < text.length; i++) {
    if (marks[i] !== curMark) {
      res.push([cur, curMark]);
      cur = "";
      curMark = marks[i];
    }
    cur += text[i];
  }
  if (cur) res.push([cur, curMark]);
  return res;
}

/* ---------- open / closed in Europe/Copenhagen ---------- */

const DAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

export function copenhagenNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Copenhagen",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = DAY_INDEX[get("weekday")] ?? 0;
  const h = parseInt(get("hour"), 10) % 24;
  const m = parseInt(get("minute"), 10);
  return { day, minutes: h * 60 + m };
}

export const fmtHour = (v: number) => {
  const total = Math.round(v * 60) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export function openStatus(date = new Date()) {
  const { day, minutes } = copenhagenNow(date);
  const t = day * 1440 + minutes;
  const WEEK = 7 * 1440;
  let open = false;
  let until = "";
  for (let d = 0; d < 7; d++) {
    const o = d * 1440 + hours[d].open * 60;
    const c = d * 1440 + hours[d].close * 60;
    for (const shift of [0, WEEK]) {
      if (t + shift >= o && t + shift < c) {
        open = true;
        until = fmtHour(hours[d].close);
      }
    }
  }
  let next = "";
  if (!open) {
    // find the next opening today or tomorrow
    const today = hours[day];
    if (minutes < today.open * 60) next = `today ${fmtHour(today.open)}`;
    else next = `tomorrow ${fmtHour(hours[(day + 1) % 7].open)}`;
  }
  return { open, until, next, today: day };
}

export const price = (n: number) => `${n} kr`;
