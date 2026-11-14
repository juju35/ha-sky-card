// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one)
// that shows exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
import { DAY, NIGHT, SUNSET } from "./mock-states.mjs";

const pair = (file, type, width, config = {}, extra = {}, first = "light") => {
  const second = first === "light" ? "dark" : "light";
  return [
    { file, type, theme: first, width, config, ...extra },
    { file: `${file}-${second}`, type, theme: second, width, config, ...extra },
  ];
};

export const shots = [
  ...pair("card", "sky-card", 440, {}, { now: DAY }),
  ...pair("card-golden-hour", "sky-card", 440, {}, { now: SUNSET }),
  ...pair("card-night", "sky-card", 440, {}, { now: NIGHT }, "dark"),
  ...pair("card-details", "sky-card", 440, {}, { now: DAY, clicks: [".section-title"] }),
  // Only the core integrations (Sun, Moon, Season): the moon's illumination and next phases computed by the card.
  ...pair("card-core", "sky-card", 440, { details: "hidden" }, { now: NIGHT, lunar: false }, "dark"),
  ...pair("mini-card", "sky-mini-card", 380, {}, { now: DAY }),
  ...pair("mini-card-night", "sky-mini-card", 380, {}, { now: NIGHT }, "dark"),
  ...pair("mini-card-zoom", "sky-mini-card", 440, {}, { now: SUNSET, clicks: [".zoom"] }),
  // Narrow cards: the full card at 6 of 12 columns of a phone's Sections view, the mini card at 3.
  ...pair("card-narrow", "sky-card", 238, {}, { now: DAY }),
  ...pair("mini-card-narrow", "sky-mini-card", 170, {}, { now: DAY }),
];

// One looping GIF per distinct animated state of the sky band (each one its own keyframes):
//   day          — the sun sliding along its arc to where it is, its rays turning and glow breathing, clouds drifting
//   golden-hour  — the low orange sun sliding to its place near the sunset, the warm glow of the horizon shimmering
//   night        — the moon with its phase crossing the night arc, the stars twinkling, a shooting star
// Only the header and the band are shown (tiles and details hidden) to keep the files small.
const BAND = { show_tiles: false, details: "hidden" };
export const gifs = [
  ...pair("day", "sky-card", 440, BAND, { now: DAY }),
  ...pair("golden-hour", "sky-card", 440, BAND, { now: SUNSET }),
  ...pair("night", "sky-card", 440, BAND, { now: NIGHT }, "dark"),
];
