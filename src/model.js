// ---------------------------------------------------------------------------
// The model: everything a render shows, computed once per minute
// ---------------------------------------------------------------------------
import { DAY_MS, H_BLUE, H_CIVIL, H_GOLDEN, H_HORIZON, MOON_PHASES, dayMemo, lastNewMoon, moonAltitude, moonDay, moonIllumination, nextMoonPhase, phaseOfAge, solsticeEquinox, sunDayOf, sunPosition } from "./astronomy.js";
import { dayStart, nextDay, sameDay, tzParts } from "./time-zones.js";
import { clamp, num, parseTime, timeZone, valid } from "./helpers.js";
import { homeLocation, resolve } from "./sources.js";

// The light of the moment, from the sun's elevation: day above the golden hour, golden hour from +6° to −4°, blue
// hour from −4° to −6° (civil twilight's end), night below.
export const phaseOf = (elevation) =>
  elevation === null ? "day" : elevation >= H_GOLDEN ? "day" : elevation >= H_BLUE ? "golden" : elevation >= H_CIVIL ? "blue" : "night";

export const SEASONS = ["spring", "summer", "autumn", "winter"];
// Season starting at each event (March equinox, June solstice, September equinox, December solstice).
export const SEASON_AT = { north: ["spring", "summer", "autumn", "winter"], south: ["autumn", "winter", "spring", "summer"] };

// The season boundaries around `now`: astronomical (solstices and equinoxes) or meteorological (1st of March,
// June, September and December, local midnight). { prev, next } of { at, season, index }.
export function seasonBounds(now, tz, type, south) {
  const year = tzParts(now, tz).year;
  const list = [];
  for (let y = year - 1; y <= year + 1; y++) {
    for (let i = 0; i < 4; i++) {
      const at = type === "meteorological" ? dayStart(Date.UTC(y, 2 + 3 * i, 1, 12), tz) : solsticeEquinox(y, i);
      list.push({ at, index: i, season: SEASON_AT[south ? "south" : "north"][i] });
    }
  }
  list.sort((a, b) => a.at - b.at);
  const n = list.findIndex((e) => e.at > now);
  return { prev: list[n - 1], next: list[n] };
}

export function skyModel(hass, config, now = Date.now()) {
  const ids = resolve(hass, config);
  const st = (id) => (id ? hass.states?.[id] : undefined);
  const loc = homeLocation(hass);
  const sunState = st(ids.sun);
  if (!loc && !sunState) return { error: "no_location" };
  const tz = timeZone(hass);
  const start = dayStart(now, tz);
  const end = nextDay(start, tz);
  const a = sunState?.attributes || {};

  // ── Sun ──
  const computed = loc ? sunDayOf(start, end, loc.lat, loc.lon) : null;
  const sun = { ...(computed || { goldenAM: [null, null], goldenPM: [null, null], blueAM: [null, null], bluePM: [null, null], curve: null }) };
  // Sun's own times win for today: they are Home Assistant's.
  for (const [key, attr] of [
    ["dawn", "next_dawn"],
    ["sunrise", "next_rising"],
    ["noon", "next_noon"],
    ["sunset", "next_setting"],
    ["dusk", "next_dusk"],
  ]) {
    const v = parseTime(a[attr]);
    if (v !== null && sameDay(v, now, tz)) sun[key] = v;
    else sun[key] ??= null;
  }
  if (!computed && sun.sunrise && sun.sunset) sun.daylight = sun.sunset - sun.sunrise;
  if (computed) {
    const yStart = dayStart(start - 12 * 3600e3, tz);
    const yesterday = sunDayOf(yStart, start, loc.lat, loc.lon);
    if (computed.daylight !== null && yesterday.daylight !== null && !computed.polar && !yesterday.polar) sun.delta = computed.daylight - yesterday.daylight;
    sun.yesterdaySunset = yesterday.sunset;
  }
  // Yesterday's sunset and tomorrow's sunrise frame the night; without a home location, sun.sun's next times a day
  // apart stand in for them.
  const tomorrow = loc ? sunDayOf(end, nextDay(end, tz), loc.lat, loc.lon) : null;
  const nextRising = parseTime(a.next_rising);
  const nextSetting = parseTime(a.next_setting);
  sun.tomorrowSunrise = tomorrow?.sunrise ?? (nextRising !== null && !sameDay(nextRising, now, tz) ? nextRising : sun.sunrise !== null ? sun.sunrise + DAY_MS : null);
  sun.yesterdaySunset = sun.yesterdaySunset ?? (sun.sunset !== null ? sun.sunset - DAY_MS : nextSetting !== null ? nextSetting - DAY_MS : null);
  const pos = loc ? sunPosition(now, loc.lat, loc.lon) : null;
  sun.elevation = num(a.elevation) ?? pos?.elevation ?? null;
  sun.azimuth = num(a.azimuth) ?? pos?.azimuth ?? null;
  // Drawn on the computed curve, so that the sun sits on its path.
  sun.drawnElevation = pos ? pos.elevation : sun.elevation;
  sun.start = start;
  sun.end = end;
  sun.entity = ids.sun;
  const phase = phaseOf(sun.elevation);
  sun.up = sun.elevation !== null ? sun.elevation > H_HORIZON : sunState ? sunState.state === "above_horizon" : true;
  // The arc of the sky band: today's path of the sun from sunrise to sunset by day, the night from sunset to
  // sunrise otherwise (the moon crossing it); none on a polar day or night.
  if (sun.sunrise !== null && sun.sunset !== null && now >= sun.sunrise && now <= sun.sunset) sun.arc = { mode: "day", from: sun.sunrise, to: sun.sunset };
  else if (sun.polar) sun.arc = null;
  else {
    const from = sun.sunset !== null && now > sun.sunset ? sun.sunset : sun.yesterdaySunset;
    const to = sun.sunrise !== null && now < sun.sunrise ? sun.sunrise : sun.tomorrowSunrise;
    sun.arc = from !== null && to !== null && to > from ? { mode: "night", from, to } : null;
  }
  if (sun.arc) sun.arc.progress = clamp((now - sun.arc.from) / (sun.arc.to - sun.arc.from), 0, 1);
  // The next event, for the subtitle: the first to come of the evening golden hour, the sunset and the next sunrise.
  sun.next =
    [
      [sun.goldenPM[0], "next_golden"],
      [sun.sunset, "next_sunset"],
      [sun.sunrise, "next_sunrise"],
      [sun.tomorrowSunrise, "next_sunrise"],
    ]
      .filter(([at]) => at !== null && at !== undefined && at > now)
      .sort((x, y) => x[0] - y[0])[0] || null;

  // ── Moon ──
  const lunar = st(ids.lunar_phase);
  const la = valid(lunar) ? lunar.attributes || {} : {};
  const sensor = (key) => (valid(st(ids[key])) ? st(ids[key]).state : undefined);
  const moonState = st(ids.moon_phase);
  const lastNew = lastNewMoon(now);
  const moon = { computed: [] };
  const illum = num(sensor("illumination") ?? la.illumination_fraction);
  moon.illumination = illum !== null ? clamp(illum / 100, 0, 1) : moonIllumination(now);
  if (illum === null) moon.computed.push("illumination");
  const age = num(sensor("moon_age") ?? la.moon_age);
  moon.age = age ?? (now - lastNew) / DAY_MS;
  if (age === null) moon.computed.push("age");
  const future = (v) => {
    const ms = parseTime(v);
    return ms !== null && ms > now - 60e3 ? ms : null;
  };
  moon.nextFull = future(sensor("next_full_moon") ?? la.next_full_moon);
  moon.nextNew = future(sensor("next_new_moon") ?? la.next_new_moon);
  if (moon.nextFull === null || moon.nextNew === null) moon.computed.push("next");
  moon.nextFull ??= nextMoonPhase(now, true);
  moon.nextNew ??= nextMoonPhase(now, false);
  const rise = parseTime(sensor("moonrise") ?? la.moonrise);
  const set = parseTime(sensor("moonset") ?? la.moonset);
  if (ids.moonrise || ids.moonset || "moonrise" in la || "moonset" in la) {
    moon.rise = rise;
    moon.set = set;
  } else if (loc) {
    Object.assign(moon, dayMemo("moon", moonDay, start, end, loc.lat, loc.lon));
    moon.computed.push("times");
  } else {
    moon.rise = moon.set = null;
  }
  const named = [moonState, lunar].find((s) => valid(s) && MOON_PHASES.includes(s.state));
  moon.phase = named ? named.state : phaseOfAge(moon.age);
  if (!named) moon.computed.push("phase");
  // Waxing until the full moon: the full moon comes before the new one.
  moon.waxing = ["waxing_crescent", "first_quarter", "waxing_gibbous"].includes(moon.phase)
    ? true
    : ["waning_gibbous", "last_quarter", "waning_crescent"].includes(moon.phase)
      ? false
      : moon.nextFull < moon.nextNew;
  moon.entity = valid(lunar) ? ids.lunar_phase : valid(moonState) ? ids.moon_phase : undefined;
  moon.altitude = loc ? moonAltitude(now, loc.lat, loc.lon) : null;
  moon.up = moon.altitude !== null ? moon.altitude > 0.125 : moon.rise !== null && moon.set !== null && (moon.rise < moon.set ? now > moon.rise && now < moon.set : now > moon.rise || now < moon.set);
  // Seen from the southern hemisphere, the moon is lit on the other side.
  moon.flip = !!loc && loc.lat < 0;

  // ── Season ──
  const seasonState = st(ids.season);
  const type = config?.season_type === "meteorological" ? "meteorological" : "astronomical";
  const { prev, next } = seasonBounds(now, tz, type, !!loc && loc.lat < 0);
  const season = {
    key: valid(seasonState) && SEASONS.includes(seasonState.state) ? seasonState.state : prev.season,
    computed: !(valid(seasonState) && SEASONS.includes(seasonState.state)),
    entity: ids.season,
    type,
    next,
    days: Math.round((dayStart(next.at, tz) - start) / DAY_MS),
    day: Math.floor((now - prev.at) / DAY_MS) + 1,
    total: Math.round((next.at - prev.at) / DAY_MS),
    progress: clamp((now - prev.at) / (next.at - prev.at), 0, 1),
  };
  return { ids, loc, tz, now, sun, phase, moon, season };
}
