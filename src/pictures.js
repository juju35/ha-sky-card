// ---------------------------------------------------------------------------
// Pictures
// ---------------------------------------------------------------------------
import { H_HORIZON, sunPosition } from "./astronomy.js";
import { clamp } from "./helpers.js";

// The lit part of the moon: a half disc on the lit side closed by the terminator, an ellipse whose half-width is
// |1 − 2k| r for an illuminated fraction k, bulging towards the lit side for a crescent and the dark side past the
// quarter. Waxing, the right side is lit seen from the northern hemisphere; `flip` mirrors it for the southern one.
export function moonLitPath(cx, cy, r, k, waxing, flip) {
  if (k <= 0.004) return "";
  if (k >= 0.996) return `<circle class="lit" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const right = waxing !== flip;
  const rx = (Math.abs(1 - 2 * k) * r).toFixed(2);
  const outer = right ? 1 : 0;
  const term = k < 0.5 === right ? 0 : 1;
  return `<path class="lit" d="M${cx} ${cy - r}A${r} ${r} 0 0 ${outer} ${cx} ${cy + r}A${rx} ${r} 0 0 ${term} ${cx} ${cy - r}Z"/>`;
}

export const CRATERS = [
  [-0.32, -0.3, 0.16],
  [0.28, -0.12, 0.12],
  [-0.05, 0.36, 0.2],
  [0.38, 0.38, 0.09],
  [-0.45, 0.12, 0.08],
];
// The moon as it looks today: a dark disc, its lit part and a few craters.
export const moonDisc = (cx, cy, r, moon) =>
  `<g class="moon-disc"><circle class="dark" cx="${cx}" cy="${cy}" r="${r}"/>${moonLitPath(cx, cy, r, moon.illumination, moon.waxing, moon.flip)}${CRATERS.map(
    ([x, y, s]) => `<circle class="crater" cx="${(cx + x * r).toFixed(2)}" cy="${(cy + y * r).toFixed(2)}" r="${(s * r).toFixed(2)}"/>`,
  ).join("")}</g>`;

export const moonSvg = (moon, cls = "") =>
  `<svg class="moon-pic ${cls}" viewBox="0 0 40 40" aria-hidden="true" style="--mg:${moon.illumination.toFixed(2)}"><circle class="m-glow" cx="20" cy="20" r="20"/>${moonDisc(20, 20, 17, moon)}</svg>`;

// Sky colors (top, middle, bottom) at a few elevations of the sun, blended in between: deep night, the blue hour,
// the golden hour around the horizon, then the day.
export const SKY_STOPS = [
  [-12, ["#03061a", "#0a1233", "#18204a"]],
  [-6, ["#0b1640", "#1d2f6e", "#3c4f96"]],
  [-4, ["#1f3577", "#4a5ea8", "#9a7fb0"]],
  [0, ["#3a4f9a", "#c47a8e", "#ffb067"]],
  [6, ["#4f7fc8", "#e8a571", "#ffd59a"]],
  [12, ["#3f84d6", "#79b4ea", "#cfe9fb"]],
  [25, ["#2b6fca", "#5ea3e6", "#b8def9"]],
];
export const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const rgbHex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
export const skyColors = (elevation) => {
  const e = elevation ?? 25;
  const i = SKY_STOPS.findIndex(([at]) => e < at);
  if (i === 0) return SKY_STOPS[0][1];
  if (i < 0) return SKY_STOPS.at(-1)[1];
  const [a, ca] = SKY_STOPS[i - 1];
  const [b, cb] = SKY_STOPS[i];
  const k = (e - a) / (b - a);
  return ca.map((c, j) => rgbHex(hexRgb(c).map((v, n) => v + (hexRgb(cb[j])[n] - v) * k)));
};
// How bright the stars are: none while the sun is up, all of them once it is 10° under the horizon.
export const starLight = (elevation) => (elevation === null ? 0 : clamp(-elevation / 10, 0, 1));

export const STARS = [
  [22, 16, 1],
  [46, 38, 0.7],
  [74, 12, 0.9],
  [102, 30, 0.6],
  [128, 10, 1.1],
  [154, 34, 0.7],
  [184, 18, 0.9],
  [212, 42, 0.6],
  [238, 12, 0.8],
  [268, 32, 1],
  [296, 14, 0.7],
  [62, 58, 0.5],
  [226, 62, 0.5],
  [146, 56, 0.6],
  [304, 52, 0.5],
  [12, 50, 0.6],
];
export const STAR = "M0 -3L.8 -.8L3 0L.8 .8L0 3L-.8 .8L-3 0L-.8 -.8Z";
export const starsSvg = (list, opacity) =>
  opacity > 0
    ? `<g class="stars" opacity="${opacity.toFixed(2)}">${list.map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="star" d="${STAR}"/></g>`).join("")}</g>`
    : "";
export const skyGradient = (id, elevation) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${skyColors(elevation)
    .map((c, i) => `<stop offset="${[0, 0.55, 1][i]}" style="stop-color:${c}"/>`)
    .join("")}</linearGradient>`;

// The band: 320 × 116, horizon at HY, the arc from X0 to X1 rising to ARC_TOP at its highest.
export const W = 320;
export const H = 116;
export const HY = 88;
export const X0 = 26;
export const X1 = 294;
export const ARC_TOP = 20;
export const f1 = (v) => v.toFixed(1);

// Points of the arc, `n` steps from its start to `upTo` (0–1) of its length in time. By day the height follows the
// sun's real elevation, scaled to its highest of the day; by night, and without a home location, a plain arch.
export function arcPoints(m, upTo = 1, n = 48) {
  const { arc } = m.sun;
  const span = arc.to - arc.from;
  const real = arc.mode === "day" && m.loc;
  const elev = (t) => sunPosition(t, m.loc.lat, m.loc.lon).elevation;
  const peak = real ? Math.max(1, elev(m.sun.noon ?? (arc.from + arc.to) / 2)) : 1;
  const pts = [];
  const steps = Math.max(1, Math.round(n * upTo));
  for (let i = 0; i <= steps; i++) {
    const k = (upTo * i) / steps;
    const h = real ? clamp((elev(arc.from + span * k) - H_HORIZON) / (peak - H_HORIZON), 0, 1) : Math.sin(Math.PI * k);
    pts.push([X0 + (X1 - X0) * k, HY - (HY - ARC_TOP) * h]);
  }
  return pts;
}
export const pathOf = (pts) => `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}`;

// The sun's disc (rays by day, low and orange in the golden hour) or the moon with its phase, drawn around 0 0.
// `sfx` ends the gradients' ids: the header's scene has its own, apart from the band's.
export const sunBody = (phase, sfx = "") =>
  `<circle class="glow" r="${phase === "day" ? 20 : 26}" fill="url(#sk-glow${sfx})"/>` +
  (phase === "day"
    ? `<g class="rays">${Array.from({ length: 8 }, (_, i) => {
        const an = (i * Math.PI) / 4;
        const p = (k) => `${(8 * k * Math.cos(an)).toFixed(2)} ${(8 * k * Math.sin(an)).toFixed(2)}`;
        return `<path d="M${p(1.4)}L${p(1.85)}"/>`;
      }).join("")}</g>`
    : "") +
  `<circle class="sun-disc" r="8" fill="url(#${phase === "day" ? "sk-sun" : "sk-sunlow"}${sfx})"/>`;
export const moonBody = (moon, sfx = "") => `<circle class="halo" r="20" fill="url(#sk-halo${sfx})"/>${moonDisc(0, 0, 9, moon)}`;

export const bandDefs = (sfx = "") =>
  `<radialGradient id="sk-sun${sfx}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffd54f"/><stop offset="1" stop-color="#ffa000"/></radialGradient>` +
  `<radialGradient id="sk-sunlow${sfx}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff1c1"/><stop offset=".5" stop-color="#ffb74d"/><stop offset="1" stop-color="#f4511e"/></radialGradient>` +
  `<radialGradient id="sk-glow${sfx}"><stop offset=".35" stop-color="#ffd54f" stop-opacity=".55"/><stop offset="1" stop-color="#ffd54f" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="sk-horizon${sfx}"><stop offset="0" stop-color="#ffcc80" stop-opacity=".8"/><stop offset="1" stop-color="#ff8a65" stop-opacity="0"/></radialGradient>` +
  `<radialGradient id="sk-halo${sfx}"><stop offset=".45" stop-color="#fff9c4" stop-opacity=".35"/><stop offset="1" stop-color="#fff9c4" stop-opacity="0"/></radialGradient>`;

// The sky band: its colors follow the sun's elevation, the arc of the day (or of the night) inside it, dashed from
// end to end and solid up to now, the sun (or the moon) where it is, stars by night, clouds drifting by day.
export function bandSvg(m, still) {
  const { sun, moon, phase } = m;
  const arc = sun.arc;
  const e = sun.elevation;
  const night = arc ? arc.mode === "night" : !sun.up;
  let curve = "";
  let body = "";
  if (arc) {
    const done = arcPoints(m, arc.progress);
    const [x, y] = done.at(-1);
    curve =
      `<path class="arc" d="${pathOf(arcPoints(m))}"/>` +
      (arc.progress > 0.002 ? `<path class="arc done" pathLength="1" d="${pathOf(done)}"/>` : "") +
      `<circle class="end" cx="${X0}" cy="${HY}" r="2.2"/><circle class="end" cx="${X1}" cy="${HY}" r="2.2"/>`;
    // The body travels the solid part of the arc (CSS offset-path): it slides to where it is when the card appears.
    body = `<g class="body ${night ? "moon" : "sun"}" data-x="${f1(x)}" data-y="${f1(y)}" style="offset-path:path('${pathOf(done)}')">${night ? moonBody(moon) : sunBody(phase)}</g>`;
  } else {
    // Polar day or night: the sun or the moon high in the middle of the band.
    body = `<g class="body still-body" transform="translate(${W / 2} ${ARC_TOP + 16})">${night ? moonBody(moon) : sunBody(phase)}</g>`;
  }
  const clouds =
    phase === "day"
      ? '<g class="clouds"><g class="cloud"><ellipse cx="78" cy="40" rx="20" ry="5.5"/><ellipse cx="88" cy="36" rx="11" ry="6.5"/></g>' +
        '<g class="cloud late"><ellipse cx="236" cy="56" rx="22" ry="5.5"/><ellipse cx="226" cy="52" rx="11" ry="6"/></g></g>'
      : "";
  const gx = arc ? (night ? (arc.progress < 0.5 ? X0 : X1) : X0 + (X1 - X0) * arc.progress) : W / 2;
  const glow = phase === "golden" || phase === "blue" ? `<ellipse class="horizon-glow" cx="${f1(gx)}" cy="${HY}" rx="110" ry="36" fill="url(#sk-horizon)"/>` : "";
  const shooting = phase === "night" ? '<path class="shooting" d="M250 10L214 32"/>' : "";
  // A flock of birds crossing the day sky now and then.
  const bird = (x, y, late) => `<g transform="translate(${x} ${y})"><path class="bird${late ? " late" : ""}" d="M-3 0Q-1.5 -2 0 0Q1.5 -2 3 0"/></g>`;
  const birds = phase === "day" ? `<g class="birds">${bird(0, 0)}${bird(-9, 4, 1)}${bird(-7, -5, 1)}</g>` : "";
  // In the golden hour: clouds tinted by the low sun and its reflection rippling on the ground under it.
  const goldenClouds =
    phase === "golden"
      ? '<g class="clouds golden"><g class="cloud"><ellipse cx="96" cy="34" rx="22" ry="4.5"/><ellipse cx="104" cy="30" rx="10" ry="5"/></g>' +
        '<g class="cloud late"><ellipse cx="214" cy="48" rx="18" ry="4"/></g></g>'
      : "";
  const reflect =
    phase === "golden" && !night
      ? `<g class="reflect"><ellipse cx="${f1(gx)}" cy="${HY + 6}" rx="16" ry="1.4"/><ellipse class="late" cx="${f1(gx)}" cy="${HY + 12}" rx="10" ry="1.1"/></g>`
      : "";
  // In the blue hour: the evening (or morning) star shining over the horizon on the sun's side.
  const vx = gx < W / 2 ? gx + 56 : gx - 56;
  const star = phase === "blue" ? `<g class="evening-star" transform="translate(${f1(vx)} ${HY - 12})"><circle class="v-glow" r="5"/><circle r="1.6"/></g>` : "";
  // At night: a thin veil of cloud slowly passing.
  const veil = phase === "night" ? '<g class="veil"><ellipse cx="120" cy="46" rx="46" ry="2.2"/><ellipse cx="146" cy="50" rx="30" ry="1.6"/></g>' : "";
  return (
    `<svg class="band-svg p-${phase}${still ? " still" : ""}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` +
    `<defs>${skyGradient("sk-sky", e)}${bandDefs()}<clipPath id="sk-above"><rect width="${W}" height="${HY}"/></clipPath></defs>` +
    `<rect class="sky-fill" width="${W}" height="${H}" fill="url(#sk-sky)"/>${starsSvg(STARS, starLight(e))}${shooting}${star}${veil}${clouds}${goldenClouds}${birds}${glow}` +
    `<rect class="ground" y="${HY}" width="${W}" height="${H - HY}"/><path class="horizon" d="M0 ${HY}H${W}"/>${reflect}` +
    `${curve}<g clip-path="url(#sk-above)">${body}</g></svg>`
  );
}

// The mini card's strip: the same sky in a thin band, the day (or night) as a line and the sun (or moon) on it,
// drawn in HTML so that the discs stay round whatever the card's width.
export function stripHtml(m, still) {
  const { sun, moon, phase } = m;
  const arc = sun.arc;
  const night = arc ? arc.mode === "night" : !sun.up;
  const p = arc ? arc.progress : 0.5;
  const [c0, c1, c2] = skyColors(sun.elevation);
  const at = `left:calc(10px + (100% - 20px) * ${p.toFixed(4)})`;
  const dot = night
    ? `<svg class="dot-body moon" viewBox="-8 -8 16 16" style="${at}">${moonDisc(0, 0, 7, moon)}</svg>`
    : `<svg class="dot-body sun" viewBox="-8 -8 16 16" style="${at}"><circle r="7" fill="url(#sk-strip-sun)"/><defs><radialGradient id="sk-strip-sun" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe6"/><stop offset=".55" stop-color="#ffd54f"/><stop offset="1" stop-color="${phase === "day" ? "#ffa000" : "#f4511e"}"/></radialGradient></defs></svg>`;
  const stars = starsSvg(
    [
      [30, 7, 0.6],
      [70, 16, 0.5],
      [110, 6, 0.7],
      [150, 15, 0.5],
      [182, 8, 0.6],
    ],
    starLight(sun.elevation),
  );
  return (
    `<div class="strip p-${phase}${still ? " still" : ""}" style="background:linear-gradient(180deg, ${c0}, ${c1} 55%, ${c2})">` +
    (stars ? `<svg class="strip-stars" viewBox="0 0 200 24" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${stars}</svg>` : "") +
    `<span class="track"></span>${arc ? `<span class="track done" style="width:calc((100% - 20px) * ${p.toFixed(4)})"></span>` : ""}${dot}</div>`
  );
}
