// ---------------------------------------------------------------------------
// Time zones
// ---------------------------------------------------------------------------

export const PARTS_FMT = {};
export const tzParts = (ms, tz) => {
  const f = (PARTS_FMT[tz || ""] ??= new Intl.DateTimeFormat("en-US", {
    timeZone: tz || undefined,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }));
  const o = {};
  for (const p of f.formatToParts(ms)) if (p.type !== "literal") o[p.type] = Number(p.value);
  return o;
};
// Offset of `tz` from UTC at `ms`, in milliseconds.
export const tzOffset = (ms, tz) => {
  const p = tzParts(ms, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
};
// Midnight of the local day of `ms` in `tz` (DST included).
export const dayStart = (ms, tz) => {
  const p = tzParts(ms, tz);
  const base = Date.UTC(p.year, p.month - 1, p.day);
  const first = base - tzOffset(base, tz);
  return base - tzOffset(first, tz);
};
export const nextDay = (start, tz) => dayStart(start + 36 * 3600e3, tz);
export const sameDay = (a, b, tz) => a !== null && b !== null && dayStart(a, tz) === dayStart(b, tz);
