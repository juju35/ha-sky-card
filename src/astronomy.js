// ---------------------------------------------------------------------------
// Astronomy
// ---------------------------------------------------------------------------

export const RAD = Math.PI / 180;
export const DAY_MS = 86400e3;
export const SYNODIC = 29.530588853;
// Terrestrial time runs about 69 s ahead of universal time in the 2020s.
export const TT_UT_DAYS = 69 / 86400;
export const sinD = (d) => Math.sin(d * RAD);
export const cosD = (d) => Math.cos(d * RAD);
export const norm360 = (d) => ((d % 360) + 360) % 360;
export const julian = (ms) => ms / DAY_MS + 2440587.5;
export const fromJulian = (jd) => (jd - 2440587.5) * DAY_MS;

// Sun: declination and equation of time (minutes), NOAA's solar equations (Meeus, chapters 25 and 28).
export function sunCoords(ms) {
  const T = (julian(ms) - 2451545) / 36525;
  const L0 = norm360(280.46646 + T * (36000.76983 + T * 0.0003032));
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = sinD(M) * (1.914602 - T * (0.004817 + 0.000014 * T)) + sinD(2 * M) * (0.019993 - 0.000101 * T) + sinD(3 * M) * 0.000289;
  const omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * sinD(omega);
  const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * cosD(omega);
  const y = Math.tan((eps / 2) * RAD) ** 2;
  return {
    longitude: norm360(lambda),
    decl: Math.asin(sinD(eps) * sinD(lambda)) / RAD,
    eot: (4 / RAD) * (y * sinD(2 * L0) - 2 * e * sinD(M) + 4 * e * y * sinD(M) * cosD(2 * L0) - 0.5 * y * y * sinD(4 * L0) - 1.25 * e * e * sinD(2 * M)),
  };
}

// Elevation and azimuth of the sun, in degrees, seen from (lat, lon) at `ms` (no refraction).
export function sunPosition(ms, lat, lon) {
  const { decl, eot } = sunCoords(ms);
  const minutes = (((ms % DAY_MS) + DAY_MS) % DAY_MS) / 60000;
  const ha = (minutes + eot + 4 * lon) / 4 - 180;
  const cz = Math.max(-1, Math.min(1, sinD(lat) * sinD(decl) + cosD(lat) * cosD(decl) * cosD(ha)));
  const elevation = 90 - Math.acos(cz) / RAD;
  const azimuth = norm360(Math.atan2(sinD(ha), cosD(ha) * sinD(lat) - Math.tan(decl * RAD) * cosD(lat)) / RAD + 180);
  return { elevation, azimuth };
}

// Moon: ecliptic longitude, latitude (degrees) and distance (km) with the main terms of Meeus' chapter 47.
export function moonEcliptic(ms) {
  const T = (julian(ms) - 2451545) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const lon =
    Lp +
    6.288774 * sinD(Mp) +
    1.274027 * sinD(2 * D - Mp) +
    0.658314 * sinD(2 * D) +
    0.213618 * sinD(2 * Mp) -
    0.185116 * sinD(M) -
    0.114332 * sinD(2 * F) +
    0.058793 * sinD(2 * D - 2 * Mp) +
    0.057066 * sinD(2 * D - M - Mp) +
    0.053322 * sinD(2 * D + Mp) +
    0.045758 * sinD(2 * D - M) -
    0.040923 * sinD(M - Mp) -
    0.03472 * sinD(D) -
    0.030383 * sinD(M + Mp);
  const lat =
    5.128122 * sinD(F) + 0.280602 * sinD(Mp + F) + 0.277693 * sinD(Mp - F) + 0.173237 * sinD(2 * D - F) + 0.055413 * sinD(2 * D - Mp + F) + 0.046271 * sinD(2 * D - Mp - F);
  const dist = 385000.56 - 20905.355 * cosD(Mp) - 3699.111 * cosD(2 * D - Mp) - 2955.968 * cosD(2 * D) - 569.925 * cosD(2 * Mp);
  return { lon: norm360(lon), lat, dist, T };
}

// Illuminated fraction of the moon's disc (0–1), from the sun–moon elongation (Meeus, chapter 48).
export function moonIllumination(ms) {
  const m = moonEcliptic(ms);
  const psi = Math.acos(cosD(m.lat) * cosD(m.lon - sunCoords(ms).longitude));
  const au = 149597870.7;
  const i = Math.atan2(au * Math.sin(psi), m.dist - au * Math.cos(psi));
  return (1 + Math.cos(i)) / 2;
}

// Geocentric altitude of the moon, in degrees; it rises and sets when it crosses +0.125° (parallax, refraction and
// half-diameter together).
export function moonAltitude(ms, lat, lon) {
  const m = moonEcliptic(ms);
  const eps = 23.439291 - 0.0130042 * m.T;
  const ra = Math.atan2(sinD(m.lon) * cosD(eps) - Math.tan(m.lat * RAD) * sinD(eps), cosD(m.lon)) / RAD;
  const dec = Math.asin(sinD(m.lat) * cosD(eps) + cosD(m.lat) * sinD(eps) * sinD(m.lon)) / RAD;
  const gmst = 280.46061837 + 360.98564736629 * (julian(ms) - 2451545) + 0.000387933 * m.T * m.T;
  return Math.asin(sinD(lat) * sinD(dec) + cosD(lat) * cosD(dec) * cosD(gmst + lon - ra)) / RAD;
}

// Time of the new moon (k integer) or full moon (k + 0.5) number k counted from January 2000 (Meeus, chapter 49).
// [new moon coefficient, full moon coefficient, argument, power of E]
export const PHASE_TERMS = [
  [-0.4072, -0.40614, "Mp", 0],
  [0.17241, 0.17302, "M", 1],
  [0.01608, 0.01614, "2Mp", 0],
  [0.01039, 0.01043, "2F", 0],
  [0.00739, 0.00734, "Mp-M", 1],
  [-0.00514, -0.00515, "Mp+M", 1],
  [0.00208, 0.00209, "2M", 2],
  [-0.00111, -0.00111, "Mp-2F", 0],
  [-0.00057, -0.00057, "Mp+2F", 0],
  [0.00056, 0.00056, "2Mp+M", 1],
  [-0.00042, -0.00042, "3Mp", 0],
  [0.00042, 0.00042, "M+2F", 1],
  [0.00038, 0.00038, "M-2F", 1],
  [-0.00024, -0.00024, "2Mp-M", 1],
  [-0.00017, -0.00017, "O", 0],
];
export function moonPhaseTime(k) {
  const full = k % 1 !== 0;
  const T = k / 1236.85;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T * T;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T * T;
  const O = 124.7746 - 1.56375588 * k + 0.0020672 * T * T;
  const arg = {
    Mp,
    M,
    "2Mp": 2 * Mp,
    "2F": 2 * F,
    "Mp-M": Mp - M,
    "Mp+M": Mp + M,
    "2M": 2 * M,
    "Mp-2F": Mp - 2 * F,
    "Mp+2F": Mp + 2 * F,
    "2Mp+M": 2 * Mp + M,
    "3Mp": 3 * Mp,
    "M+2F": M + 2 * F,
    "M-2F": M - 2 * F,
    "2Mp-M": 2 * Mp - M,
    O,
  };
  for (const [a, b, name, e] of PHASE_TERMS) jde += (full ? b : a) * E ** e * sinD(arg[name]);
  return fromJulian(jde - TT_UT_DAYS);
}
export const lunation = (ms) => Math.floor((julian(ms) - 2451550.09766) / 29.530588861);
// The next new (full = false) or full moon after `ms`, and the last new moon before it.
export function nextMoonPhase(ms, full) {
  for (let k = lunation(ms) - 1 + (full ? 0.5 : 0); ; k++) {
    const t = moonPhaseTime(k);
    if (t > ms) return t;
  }
}
export function lastNewMoon(ms) {
  for (let k = lunation(ms) + 1; ; k--) {
    const t = moonPhaseTime(k);
    if (t <= ms) return t;
  }
}

// Equinoxes and solstices (Meeus, chapter 27): event i of `year`, 0 March equinox, 1 June solstice, 2 September
// equinox, 3 December solstice. [A, B, C] periodic terms, then the mean values for the years 2000 to 3000.
export const SEASON_TERMS = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];
export const SEASON_MEAN = [
  [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
];
export function solsticeEquinox(year, i) {
  const Y = (year - 2000) / 1000;
  const [a, b, c, d, e] = SEASON_MEAN[i];
  const jde0 = a + b * Y + c * Y * Y + d * Y ** 3 + e * Y ** 4;
  const T = (jde0 - 2451545) / 36525;
  const W = 35999.373 * T - 2.47;
  const dl = 1 + 0.0334 * cosD(W) + 0.0007 * cosD(2 * W);
  const S = SEASON_TERMS.reduce((s, [A, B, C]) => s + A * cosD(B + C * T), 0);
  return fromJulian(jde0 + (0.00001 * S) / dl - TT_UT_DAYS);
}

// The times `fn` (degrees over time) crosses `h0` between `start` and `end`: sampled every 10 minutes, each crossing
// then narrowed down to the second. { up: [ms], down: [ms] }
export function crossings(fn, start, end, h0) {
  const step = 10 * 60e3;
  const up = [];
  const down = [];
  let t0 = start;
  let a0 = fn(t0) - h0;
  for (let t1 = start + step; t0 < end; t1 = Math.min(end, t1 + step)) {
    const a1 = fn(t1) - h0;
    if (a0 < 0 !== a1 < 0) {
      let lo = t0;
      let hi = t1;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (fn(mid) - h0 < 0 === a0 < 0) lo = mid;
        else hi = mid;
      }
      (a1 > a0 ? up : down).push(Math.round((lo + hi) / 2));
    }
    t0 = t1;
    a0 = a1;
  }
  return { up, down };
}

// Thresholds of the sun's elevation: sunrise and sunset (upper limb with refraction), civil twilight, the edge
// between the blue and golden hours, the top of the golden hour.
export const H_HORIZON = -0.833;
export const H_CIVIL = -6;
export const H_BLUE = -4;
export const H_GOLDEN = 6;

// The sun's day between `start` and `end` (a local day): events, golden and blue hours, the elevation curve.
export function sunDay(start, end, lat, lon) {
  const elev = (t) => sunPosition(t, lat, lon).elevation;
  const at = (h) => crossings(elev, start, end, h);
  const rise = at(H_HORIZON);
  const civil = at(H_CIVIL);
  const golden = at(H_GOLDEN);
  const blue = at(H_BLUE);
  const curve = [];
  for (let i = 0; i <= 96; i++) {
    const t = start + ((end - start) * i) / 96;
    curve.push([t, elev(t)]);
  }
  // Solar noon: the highest sample, narrowed down by ternary search.
  let [noon] = curve.reduce((a, b) => (b[1] > a[1] ? b : a));
  let lo = noon - 20 * 60e3;
  let hi = noon + 20 * 60e3;
  for (let i = 0; i < 30; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (elev(m1) < elev(m2)) lo = m1;
    else hi = m2;
  }
  noon = Math.round((lo + hi) / 2);
  const sunrise = rise.up[0] ?? null;
  const sunset = rise.down.find((t) => !sunrise || t > sunrise) ?? rise.down[0] ?? null;
  const noonElevation = elev(noon);
  const polar = sunrise || sunset ? null : noonElevation > H_HORIZON ? "day" : "night";
  return {
    dawn: civil.up[0] ?? null,
    sunrise,
    noon,
    sunset,
    dusk: civil.down.find((t) => !sunset || t > sunset) ?? civil.down[0] ?? null,
    goldenAM: [blue.up[0] ?? null, golden.up[0] ?? null],
    goldenPM: [golden.down[0] ?? null, blue.down.find((t) => !sunset || t > sunset) ?? blue.down[0] ?? null],
    blueAM: [civil.up[0] ?? null, blue.up[0] ?? null],
    bluePM: [blue.down.find((t) => !sunset || t > sunset) ?? null, civil.down.find((t) => !sunset || t > sunset) ?? null],
    noonElevation,
    polar,
    daylight: sunrise && sunset ? sunset - sunrise : polar === "day" ? end - start : polar === "night" ? 0 : null,
    curve,
  };
}

// Moonrise and moonset of a local day (either may be missing: the moon rises about 50 minutes later each day).
export function moonDay(start, end, lat, lon) {
  const c = crossings((t) => moonAltitude(t, lat, lon), start, end, 0.125);
  return { rise: c.up[0] ?? null, set: c.down[0] ?? null };
}

// A day's sun and moon events only change with the day and the place: computed once (some 20 ms for the three days a
// render reads) and kept for the next renders. The results are shared: never changed by their readers.
export const DAY_MEMO = new Map();
export const dayMemo = (kind, fn, start, end, lat, lon) => {
  const key = `${kind}|${start}|${end}|${lat}|${lon}`;
  let v = DAY_MEMO.get(key);
  if (!v) {
    v = fn(start, end, lat, lon);
    if (DAY_MEMO.size >= 16) DAY_MEMO.delete(DAY_MEMO.keys().next().value);
    DAY_MEMO.set(key, v);
  }
  return v;
};
export const sunDayOf = (start, end, lat, lon) => dayMemo("sun", sunDay, start, end, lat, lon);

// The phase name of the Moon integration for a moon `age` days old, on its 0–28 scale: new, quarters and full last
// about a day each.
export const MOON_PHASES = ["new_moon", "waxing_crescent", "first_quarter", "waxing_gibbous", "full_moon", "waning_gibbous", "last_quarter", "waning_crescent"];
export const MOON_BOUNDS = [0.5, 6.5, 7.5, 13.5, 14.5, 20.5, 21.5, 27.5];
export const phaseOfAge = (age) => {
  const d = (age / SYNODIC) * 28;
  const i = MOON_BOUNDS.findIndex((b) => d < b);
  return i < 0 ? "new_moon" : MOON_PHASES[i];
};
