// Mock Home Assistant states and registry shaped like the Sun, Moon, Season and Lunar Phase integrations, for a home
// in Paris (a neutral place) in the Europe/Paris time zone. Every value is computed for the moment given with the
// card's own astronomy (scripts/astro-sandbox.mjs), so that the sun.sun times and the Lunar Phase sensors agree with
// the sky drawn. The screenshot script freezes the page clock at that moment: the captures never change.
import { sandbox } from "./astro-sandbox.mjs";

export const TZ = "Europe/Paris";
export const HOME = { latitude: 48.8566, longitude: 2.3522, time_zone: TZ };
// The moments of the captures: a waxing gibbous moon a few days before the full moon of 24 November 2026.
const paris = (iso) => Date.parse(`${iso}+01:00`);
export const DAY = paris("2026-11-20T11:40:00");
export const SUNSET = paris("2026-11-20T16:52:00");
export const NIGHT = paris("2026-11-20T21:30:00");
// One moment per season, for their animations.
export const SEASON_TIMES = {
  spring: Date.parse("2026-04-18T10:00:00+02:00"),
  summer: Date.parse("2026-07-14T10:00:00+02:00"),
  autumn: DAY,
  winter: paris("2027-01-21T10:00:00"),
};

const A = sandbox(["sunDay", "sunPosition", "moonIllumination", "moonDay", "nextMoonPhase", "lastNewMoon", "phaseOfAge", "dayStart", "nextDay", "seasonBounds"]);
const iso = (ms) => (ms === null || ms === undefined ? "unknown" : new Date(ms).toISOString());
const DAY_MS = 86400e3;

// The first event after `now` among today's and tomorrow's.
const next = (now, key) => {
  const start = A.dayStart(now, TZ);
  const tomorrow = A.nextDay(start, TZ);
  for (const s of [start, tomorrow]) {
    const d = A.sunDay(s, A.nextDay(s, TZ), HOME.latitude, HOME.longitude);
    if (d[key] && d[key] > now) return d[key];
  }
  return null;
};

/**
 * { states, entities } at `now`. Options: lunar (default true) adds the Lunar Phase sensors, moon / season / sun
 * (default true) the Moon, Season and Sun integrations.
 */
export function mockAt(now, { lunar = true, moon = true, season = true, sun = true } = {}) {
  const states = {};
  const entities = {};
  const add = (entity_id, platform, state, attributes = {}, translation_key = null) => {
    entities[entity_id] = { entity_id, platform, device_id: platform, translation_key };
    states[entity_id] = { entity_id, state: String(state), attributes, last_changed: iso(now - 3600e3), last_updated: iso(now - 60e3) };
  };
  if (sun) {
    const pos = A.sunPosition(now, HOME.latitude, HOME.longitude);
    add("sun.sun", "sun", pos.elevation > -0.833 ? "above_horizon" : "below_horizon", {
      next_dawn: iso(next(now, "dawn")),
      next_dusk: iso(next(now, "dusk")),
      next_midnight: iso(A.nextDay(A.dayStart(now, TZ), TZ)),
      next_noon: iso(next(now, "noon")),
      next_rising: iso(next(now, "sunrise")),
      next_setting: iso(next(now, "sunset")),
      elevation: Math.round(pos.elevation * 100) / 100,
      azimuth: Math.round(pos.azimuth * 100) / 100,
      rising: pos.azimuth < 180,
      friendly_name: "Sun",
    });
  }
  const age = (now - A.lastNewMoon(now)) / DAY_MS;
  if (moon) add("sensor.moon_phase", "moon", A.phaseOfAge(age), { device_class: "enum", friendly_name: "Moon Phase" });
  if (season) {
    const { prev } = A.seasonBounds(now, TZ, "astronomical", false);
    add("sensor.season", "season", prev.season, { device_class: "enum", friendly_name: "Season" });
  }
  if (lunar) {
    // Lunar Phase: one sensor per value, named after the location ("Home"), and the phase sensor carrying them all.
    const start = A.dayStart(now, TZ);
    const times = A.moonDay(start, A.nextDay(start, TZ), HOME.latitude, HOME.longitude);
    const illumination = Math.round(A.moonIllumination(now) * 10000) / 100;
    const full = A.nextMoonPhase(now, true);
    const newMoon = A.nextMoonPhase(now, false);
    add("sensor.home_moon_phase", "lunar_phase", A.phaseOfAge(age), {
      moon_age: age,
      illumination_fraction: illumination,
      next_full_moon: iso(full),
      next_new_moon: iso(newMoon),
      moonrise: iso(times.rise),
      moonset: iso(times.set),
      location: { name: "Home", timezone: TZ },
      device_class: "enum",
      friendly_name: "Home Moon Phase",
    }, "moon_phase");
    add("sensor.home_moon_age", "lunar_phase", age.toFixed(2), { unit_of_measurement: "d" });
    add("sensor.home_moon_illumination_fraction", "lunar_phase", illumination, { unit_of_measurement: "%" });
    add("sensor.home_moon_rise", "lunar_phase", iso(times.rise), { device_class: "timestamp" });
    add("sensor.home_moon_set", "lunar_phase", iso(times.set), { device_class: "timestamp" });
    add("sensor.home_next_full_moon", "lunar_phase", iso(full), { device_class: "timestamp" });
    add("sensor.home_next_new_moon", "lunar_phase", iso(newMoon), { device_class: "timestamp" });
  }
  return { states, entities };
}
