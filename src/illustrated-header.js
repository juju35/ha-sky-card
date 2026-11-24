// ---------------------------------------------------------------------------
// The illustrated header
// ---------------------------------------------------------------------------
import { clamp } from "./helpers.js";
import { bandDefs, f1, moonBody, starLight, starsSvg, sunBody } from "./pictures.js";

// A 200 × 80 scene at the right of the 90 px header, standing on its 10 px lawn strip: the arc of the day (or of the
// night), the sun (or the moon in its phase) where it is on it, setting behind the hills; and the band's own touches
// by phase: clouds and birds by day, tinted clouds and the horizon's glow in the golden hour, the evening star in the
// blue hour, stars, a shooting star and a veil of cloud at night. `uid` keeps each card's gradient ids apart.
export const HS_ARC = [
  [20, 74],
  [100, -6],
  [180, 74],
];
export const HS_STARS = [
  [12, 8, 0.45],
  [44, 18, 0.35],
  [96, 6, 0.45],
  [132, 24, 0.3],
  [168, 10, 0.45],
  [190, 30, 0.35],
  [70, 30, 0.3],
  [150, 42, 0.3],
];
export const qPoint = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
export function headerScene(m, uid, still) {
  const { sun, moon, phase } = m;
  const arc = sun.arc;
  const night = arc ? arc.mode === "night" : !sun.up;
  const sfx = `-h${uid}`;
  const [[x0, y0], [cx, cy], [x2, y2]] = HS_ARC;
  const t = arc ? clamp(arc.progress, 0, 1) : 0.5;
  // The arc up to now: the curve cut at `t` (de Casteljau), the path the body travels as in the band.
  const x = qPoint(t, x0, cx, x2);
  const y = qPoint(t, y0, cy, y2);
  const done = `M${x0} ${y0}Q${f1(x0 + (cx - x0) * t)} ${f1(y0 + (cy - y0) * t)} ${f1(x)} ${f1(y)}`;
  const inner = `<g transform="scale(${night ? 0.85 : 0.72})">${night ? moonBody(moon, sfx) : sunBody(phase, sfx)}</g>`;
  const body = arc
    ? `<g class="body ${night ? "moon" : "sun"}" style="offset-path:path('${done}')">${inner}</g>`
    : `<g class="body still-body" transform="translate(100 30)">${inner}</g>`;
  const stars = starsSvg(HS_STARS, sun.up ? 0 : Math.max(0.45, starLight(sun.elevation)));
  const cloud = (cx1, cy1, s, late) =>
    `<g transform="translate(${cx1} ${cy1}) scale(${s})"><g class="cloud${late ? " late" : ""}"><ellipse cx="0" cy="4" rx="14" ry="4"/><ellipse cx="6" cy="0" rx="8" ry="4.8"/></g></g>`;
  const clouds = phase === "day" ? `<g class="clouds">${cloud(56, 18, 0.9)}${cloud(150, 30, 0.7, 1)}</g>` : phase === "golden" ? `<g class="clouds golden">${cloud(64, 22, 0.9)}${cloud(146, 34, 0.7, 1)}</g>` : "";
  const bird = (bx, by, late) => `<g transform="translate(${bx} ${by})"><path class="bird${late ? " late" : ""}" d="M-3 0Q-1.5 -2 0 0Q1.5 -2 3 0"/></g>`;
  const birds = phase === "day" ? `<g class="birds">${bird(0, 0)}${bird(-9, 4, 1)}${bird(-7, -5, 1)}</g>` : "";
  const glow = phase === "golden" || phase === "blue" ? `<ellipse class="horizon-glow" cx="${f1(clamp(night ? (t < 0.5 ? x0 : x2) : x, 64, 136))}" cy="74" rx="64" ry="26" fill="url(#sk-horizon${sfx})"/>` : "";
  const vx = x < 100 ? x + 44 : x - 44;
  const star = phase === "blue" ? `<g class="evening-star" transform="translate(${f1(vx)} 52)"><circle class="v-glow" r="4"/><circle r="1.3"/></g>` : "";
  const nightSky = phase === "night" ? '<path class="shooting" d="M176 6L148 22"/><g class="veil"><ellipse cx="80" cy="40" rx="34" ry="1.8"/><ellipse cx="100" cy="44" rx="22" ry="1.3"/></g>' : "";
  return (
    `<svg class="hs-svg p-${phase}${still ? " still" : ""}" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">` +
    `<defs>${bandDefs(sfx)}</defs>${stars}${nightSky}${star}${clouds}${birds}${glow}` +
    `<path class="hs-arc" d="M${x0} ${y0}Q${cx} ${cy} ${x2} ${y2}"/>${arc && t > 0.002 ? `<path class="hs-arc done" d="${done}"/>` : ""}${body}` +
    '<path class="hs-hill far" d="M0,80 C30,70 60,64 100,66 C140,68 170,60 200,62 L200,80Z"/>' +
    '<g class="hs-peaks"><path d="M120 74l8 -12l8 12z"/><path d="M134 74l10 -16l10 16z"/></g>' +
    '<path class="hs-hill" d="M0,80 C40,74 90,75 200,72 L200,80Z"/></svg>'
  );
}

// The season's own picture: a flower swaying in spring, the summer sun's turning rays, leaves falling in autumn, a
// turning snowflake and falling snow in winter.
export const SEASON_ART = {
  spring:
    '<path class="stem" d="M24 44V24"/><path class="leaf-s" d="M24 36c-6 0-9-3-10-7 5 0 9 2 10 7z"/>' +
    `<g class="flower">${[0, 72, 144, 216, 288].map((r) => `<ellipse class="petal" cx="24" cy="11.5" rx="4.2" ry="6.5" transform="rotate(${r} 24 18)"/>`).join("")}<circle class="heart" cx="24" cy="18" r="3.6"/></g>`,
  summer: `<circle class="s-glow" cx="24" cy="24" r="20"/><g class="s-rays">${Array.from({ length: 8 }, (_, i) => `<path d="M24 4.5V10" transform="rotate(${i * 45} 24 24)"/>`).join("")}</g><circle class="s-disc" cx="24" cy="24" r="10"/>`,
  autumn:
    '<g class="big-leaf"><path class="leaf-a" d="M24 6c9 7 13 15 8 23-2 3-5 5-8 5s-6-2-8-5c-5-8-1-16 8-23z"/><path class="vein" d="M24 12v28"/></g>' +
    '<path class="leaf-a fall" d="M10 6c3 2 4 5 2 8-1 1-2 1-3 1s-2-1-2-2c-1-3 0-5 3-7z"/><path class="leaf-a fall late" d="M38 10c3 2 4 5 2 8-1 1-2 1-3 1s-2-1-2-2c-1-3 0-5 3-7z"/>',
  winter: `<g class="flake">${Array.from({ length: 6 }, (_, i) => `<path d="M24 8V40M24 13l-4-4M24 13l4-4M24 35l-4 4M24 35l4 4" transform="rotate(${i * 30} 24 24)"/>`).join("")}</g>${[8, 18, 32, 41]
    .map((x, i) => `<circle class="snow${i % 2 ? " late" : ""}" cx="${x}" cy="${4 + (i % 3) * 3}" r="1.6"/>`)
    .join("")}`,
};
export const seasonSvg = (key, still) => `<svg class="season-pic s-${key}${still ? " still" : ""}" viewBox="0 0 48 48" aria-hidden="true">${SEASON_ART[key] || SEASON_ART.spring}</svg>`;
