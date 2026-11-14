// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one)
// that shows exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
import { BLUE_HOUR, DAY, NIGHT, SUNSET } from "./mock-states.mjs";

const pair = (file, type, width, config = {}, extra = {}, first = "light") => {
  const second = first === "light" ? "dark" : "light";
  return [
    { file, type, theme: first, width, config, ...extra },
    { file: `${file}-${second}`, type, theme: second, width, config, ...extra },
  ];
};

export const shots = [
  ...pair("card", "sky-card", 430, {}, { now: DAY }),
  ...pair("card-golden-hour", "sky-card", 430, {}, { now: SUNSET }),
  ...pair("card-night", "sky-card", 430, {}, { now: NIGHT }, "dark"),
  ...pair("card-details", "sky-card", 430, {}, { now: DAY, clicks: [".section-title"] }),
  // Only the core integrations (Sun, Moon, Season): the moon's illumination and next phases computed by the card.
  ...pair("card-core", "sky-card", 430, { details: "hidden" }, { now: NIGHT, lunar: false }, "dark"),
  ...pair("mini-card", "sky-mini-card", 380, {}, { now: DAY }),
  ...pair("mini-card-night", "sky-mini-card", 380, {}, { now: NIGHT }, "dark"),
  ...pair("mini-card-zoom", "sky-mini-card", 430, {}, { now: SUNSET, clicks: [".zoom"] }),
  // Narrow cards: the full card at 6 of 12 columns of a phone's Sections view, the mini card at 3.
  ...pair("card-narrow", "sky-card", 238, {}, { now: DAY }),
  ...pair("mini-card-narrow", "sky-mini-card", 170, {}, { now: DAY }),
];

// One looping GIF per distinct animated state (each one its own keyframes):
//   day          — the sun sliding along its arc to where it is, its rays turning and glow breathing, clouds drifting,
//                  a flock of birds crossing the sky (6 s, the time of one crossing)
//   golden-hour  — the low orange sun sliding to its place near the sunset, the warm glow of the horizon shimmering,
//                  clouds tinted by the low sun, its reflection rippling on the ground
//   blue-hour    — the deep blue sky after the sunset, the first stars, the evening star shining over the horizon
//   night        — the moon with its phase crossing the night arc, the stars twinkling, a shooting star, a veil of cloud
//   tiles        — the tiles' icons: the daylight sun turning, the moon's glow, the half sun rising and setting at
//                  dawn and dusk, the season's picture
//   mini-strip   — the header badge's turning sun, the sun on the mini card's strip glowing, the moon's glow
// The band GIFs only show the header and the band (tiles and details hidden) to keep the files small.
const BAND = { show_tiles: false, details: "hidden" };
const TILES = { show_sky: false, details: "hidden" };
export const gifs = [
  ...pair("day", "sky-card", 430, BAND, { now: DAY, seconds: 6 }),
  ...pair("golden-hour", "sky-card", 430, BAND, { now: SUNSET }),
  ...pair("blue-hour", "sky-card", 430, BAND, { now: BLUE_HOUR }, "dark"),
  ...pair("night", "sky-card", 430, BAND, { now: NIGHT }, "dark"),
  ...pair("tiles", "sky-card", 430, TILES, { now: DAY, seconds: 6 }),
  ...pair("mini-strip", "sky-mini-card", 380, {}, { now: DAY }),
];
