// Renders the cards with mock Sun, Moon, Season and Lunar Phase data and saves the README screenshots.
// Usage: npm run build && npm run screenshots   (CHROMIUM_PATH=/path/to/chrome to use an installed browser)
// The page clock is frozen at each capture's moment and the browser runs in the Europe/Paris time zone, so that the
// captures never change from one run to the next.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { HOME, mockAt, TZ } from "./mock-states.mjs";
import { unchanged } from "./pixels.mjs";
import { gifs, shots } from "./screenshot-list.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
mkdirSync(`${root}screenshots`, { recursive: true });

// Every capture is rendered to a temporary file and copied over screenshots/<file> only when its decoded pixels
// differ (scripts/pixels.mjs): a run that draws the same pictures changes no file, so the workflow commits nothing.
const work = mkdtempSync(join(tmpdir(), "sk-shots-"));
const keep = (fresh, name) => {
  const target = `${root}screenshots/${name}`;
  if (unchanged(fresh, target)) return console.log(`screenshots/${name} (unchanged)`);
  copyFileSync(fresh, target);
  console.log(`screenshots/${name}`);
};
const cardJs = readFileSync(`${root}dist/sky-card.js`, "utf8");

// Every uncaught page error is collected here; the script exits non-zero when any occurred.
const pageErrors = [];

const THEMES = {
  light: {
    "--primary-background-color": "#e8eaed",
    "--secondary-background-color": "#f1f2f4",
    "--card-background-color": "#ffffff",
    "--primary-text-color": "#212121",
    "--secondary-text-color": "#727272",
    "--divider-color": "rgba(0,0,0,.12)",
  },
  dark: {
    "--primary-background-color": "#111111",
    "--secondary-background-color": "#282828",
    "--card-background-color": "#1c1c1c",
    "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b",
    "--divider-color": "rgba(225,225,225,.12)",
  },
};

// Minimal stand-in for Home Assistant's <ha-card>.
const HA_CARD = `customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML =
      "<style>:host{display:block;background:var(--card-background-color);border-radius:12px;" +
      "border:1px solid var(--divider-color);color:var(--primary-text-color);overflow:hidden}</style><slot></slot>";
  }
});`;

const pageHtml = (theme, width) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>
  :root { ${Object.entries(THEMES[theme])
    .map(([k, v]) => `${k}:${v};`)
    .join("")} }
  body { margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: ${width}px; }
</style></head><body><div id="root"></div></body></html>`;

// Opens a card on a fresh page, its clock frozen at the shot's moment, and mounts it with the mock hass.
async function openCard(browser, { file, type, config, theme, width, now, lunar = true }) {
  const context = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1000, height: 2000 }, timezoneId: TZ, locale: "en-US" });
  const page = await context.newPage();
  await page.clock.setFixedTime(now);
  page.on("pageerror", (err) => {
    console.error(`pageerror (${file}): ${err.message}`);
    pageErrors.push(`${file}: ${err.message}`);
  });
  await page.setContent(pageHtml(theme, width));
  await page.addScriptTag({ content: HA_CARD });
  await page.addScriptTag({ content: cardJs });
  const { states, entities } = mockAt(now, { lunar });
  await page.evaluate(
    ({ type, config, states, entities, theme, home }) => {
      const el = document.createElement(type);
      el.setConfig({ type: `custom:${type}`, ...config });
      el.hass = {
        states,
        entities,
        config: { ...home, unit_system: { length: "km" } },
        language: "en",
        locale: { language: "en", time_format: "24", time_zone: "server" },
        themes: { darkMode: theme === "dark" },
        callService: () => {},
      };
      document.getElementById("root").appendChild(el);
    },
    { type, config, states, entities, theme, home: HOME },
  );
  return { page, context };
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

const animations = () => {
  const card = document.querySelector("#root").firstElementChild.shadowRoot;
  return [document, card].flatMap((r) => r.getAnimations());
};

for (const s of shots) {
  const { page, context } = await openCard(browser, s);
  for (const sel of s.clicks || []) {
    // A mouse click (detail 1), not .click(): a keyboard-like click would move the focus and show its ring.
    await page.evaluate(
      (sel) =>
        document
          .querySelector("#root")
          .firstElementChild.shadowRoot.querySelector(sel)
          .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 })),
      sel,
    );
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(600);
  // Every looping animation at its start and the one-off ones (the sun or moon sliding to its place, the arc
  // drawn) at their end, then paused: the still capture is the same on every run and shows where things are.
  await page.evaluate(
    `(${animations.toString()})().forEach((a) => { a.pause(); const t = a.effect.getComputedTiming(); a.currentTime = t.iterations === Infinity ? 0 : t.endTime; })`,
  );
  const box = await page.locator("#root").boundingBox();
  await page.screenshot({ path: join(work, `${s.file}.png`), clip: { x: 0, y: 0, width: s.width + 32, height: Math.ceil(box.height) + 32 } });
  keep(join(work, `${s.file}.png`), `${s.file}.png`);
  await context.close();
}

// Records one animated state as a looping GIF (screenshots/<gif.file>.gif) — needs ffmpeg on PATH.
// Every animation is paused and stepped frame by frame, so the GIF is identical whatever the machine's speed.
async function makeGif(gif, { fps = 20, seconds = 3 } = {}) {
  const { page, context } = await openCard(browser, gif);
  await page.waitForTimeout(600);
  const box = await page.locator("#root").boundingBox();
  const clip = { x: 0, y: 0, width: gif.width + 32, height: Math.ceil(box.height) + 32 };
  const dir = mkdtempSync(join(tmpdir(), "sk-frames-"));
  const frames = Math.round(fps * seconds);
  for (let i = 0; i < frames; i++) {
    const n = await page.evaluate(
      // Two animation frames after the seek, so that the screenshot never catches the frame before it is painted.
      `(async () => { const all = (${animations.toString()})(); for (const a of all) { a.pause(); a.currentTime = ${(i * 1000) / fps}; }
        for (let k = 0; k < 2; k++) await new Promise((r) => requestAnimationFrame(() => r()));
        return all.length; })()`,
    );
    if (!n) throw new Error(`${gif.file}: no animation found to step`);
    await page.screenshot({ path: join(dir, `f${String(i).padStart(3, "0")}.png`), clip });
  }
  await context.close();
  const out = join(work, `${gif.file}.gif`);
  // Halve the retina capture and build a per-clip palette with ordered (Bayer) dithering: deterministic and small.
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-framerate",
    String(fps),
    "-i",
    join(dir, "f%03d.png"),
    "-vf",
    `scale=${clip.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop",
    "0",
    out,
  ]);
  rmSync(dir, { recursive: true });
  keep(out, `${gif.file}.gif`);
}

// SKIP_GIFS=1 renders the PNG captures only (quicker while working on the layout).
if (process.env.SKIP_GIFS !== "1") for (const g of gifs) await makeGif(g, g.seconds ? { seconds: g.seconds } : {});
await browser.close();
rmSync(work, { recursive: true });

if (pageErrors.length) {
  console.error(`\n${pageErrors.length} page error(s) while rendering:`);
  for (const e of pageErrors) console.error(`  ${e}`);
  process.exitCode = 1;
}
