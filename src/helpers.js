// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
import { STRINGS } from "./i18n/strings.js";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: Home Assistant's full locale (keeps its region) when its base matches the card language, else
// that language; a bare "pt" (European Portuguese for Home Assistant) becomes "pt-PT".
export const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

export const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);
export const num = (v) => {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
export const parseTime = (v) => {
  if (v === null || v === undefined || v === "" || v === "unknown" || v === "unavailable") return null;
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? ms : null;
};

// The time zone of the displayed times: Home Assistant's own when the user profile asks for the server's, else the
// browser's (as everywhere in Home Assistant).
export const timeZone = (hass) => (hass?.locale?.time_zone === "server" ? hass?.config?.time_zone || undefined : undefined);

export const FMT = {};
export const fmtCache = (key, make) => (FMT[key] ??= make());
export const hour12 = (hass) => {
  const f = hass?.locale?.time_format;
  return f === "12" ? true : f === "24" ? false : undefined;
};
export const fmtTime = (ms, L, tz, h12) =>
  ms === null || ms === undefined
    ? "—"
    : fmtCache(`t|${L}|${tz}|${h12}`, () => new Intl.DateTimeFormat(L, { hour: "2-digit", minute: "2-digit", hour12: h12, timeZone: tz })).format(ms);
export const fmtDay = (ms, L, tz) =>
  fmtCache(`d|${L}|${tz}`, () => new Intl.DateTimeFormat(L, { weekday: "short", month: "short", day: "numeric", timeZone: tz })).format(ms);
export const fmtUnit = (v, unit, L) => fmtCache(`u|${L}|${unit}`, () => new Intl.NumberFormat(L, { style: "unit", unit, unitDisplay: "short" })).format(v);
export const fmtRelDays = (n, L) => fmtCache(`r|${L}`, () => new Intl.RelativeTimeFormat(L, { numeric: "auto" })).format(n, "day");
// Integer percentages, in the way of the language ("78%", "78 %").
export const fmtPct = (v, L) => fmtCache(`p|${L}`, () => new Intl.NumberFormat(L, { style: "percent", maximumFractionDigits: 0 })).format(Math.round(v) / 100);
export const fmtDeg = (v, L) => `${Math.round(v).toLocaleString(L)}°`;

// A length of daylight: "9 h 17 min".
export const fmtHours = (ms, L) => {
  const min = Math.round(ms / 60000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return fmtUnit(m, "minute", L);
  return m ? `${fmtUnit(h, "hour", L)} ${fmtUnit(m, "minute", L)}` : fmtUnit(h, "hour", L);
};
// A change of the daylight: "+2 min 41 s", "−38 s".
export const fmtDelta = (ms, L) => {
  const s = Math.round(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  const u = (v, unit) => fmtCache(`n|${L}|${unit}`, () => new Intl.NumberFormat(L, { style: "unit", unit, unitDisplay: "narrow" })).format(v);
  const body = m ? (r ? `${u(m, "minute")} ${u(r, "second")}` : u(m, "minute")) : u(r, "second");
  return `${ms < 0 ? "−" : "+"}${body}`;
};

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
