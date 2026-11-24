// ---------------------------------------------------------------------------
// Sources: the entities the card reads
// ---------------------------------------------------------------------------
import { MOON_PHASES } from "./astronomy.js";
import { num } from "./helpers.js";

// Entity keys that can be given by hand (`entities` option), each one replacing what the card finds itself.
export const ENTITY_KEYS = ["sun", "moon_phase", "lunar_phase", "moonrise", "moonset", "illumination", "moon_age", "next_full_moon", "next_new_moon", "season"];

// Lunar Phase sensors: translation key, else the end of the entity id (`sensor.<location>_moon_rise`…).
export const LUNAR_KEYS = {
  moonrise: [["moonrise", "moon_rise"], /_moon_?rise$/],
  moonset: [["moonset", "moon_set"], /_moon_?set$/],
  illumination: [["illumination_fraction", "illumination"], /_illumination(_fraction)?$/],
  moon_age: [["moon_age"], /_moon_age$/],
  next_full_moon: [["next_full_moon"], /_next_full_moon$/],
  next_new_moon: [["next_new_moon"], /_next_new_moon$/],
};

export const _registry = new WeakMap();
// What the registries tell, once per registry object: the Sun, Moon and Season entities and the Lunar Phase sensors.
export const scanRegistry = (hass) => {
  const reg = hass.entities;
  if (!reg || typeof reg !== "object") return { lunar: [] };
  if (_registry.has(reg)) return _registry.get(reg);
  const found = { lunar: [] };
  for (const e of Object.values(reg)) {
    const id = e?.entity_id;
    if (!id) continue;
    if (e.platform === "sun" && id.startsWith("sun.")) found.sun ??= id;
    else if (e.platform === "moon" && id.startsWith("sensor.")) found.moon_phase ??= id;
    else if (e.platform === "season" && id.startsWith("sensor.")) found.season ??= id;
    else if (e.platform === "lunar_phase" && id.startsWith("sensor.")) found.lunar.push(e);
  }
  _registry.set(reg, found);
  return found;
};

// The entity ids the card reads: { sun, moon_phase, lunar_phase, moonrise, … } (missing keys: not found).
export const resolve = (hass, config) => {
  const st = hass.states || {};
  const reg = scanRegistry(hass);
  const out = {};
  const exists = (id) => !!id && !!st[id];
  out.sun = reg.sun || (exists("sun.sun") ? "sun.sun" : undefined);
  out.moon_phase = reg.moon_phase || ["sensor.moon_phase", "sensor.moon"].find((id) => MOON_PHASES.includes(st[id]?.state));
  out.season = reg.season || (exists("sensor.season") ? "sensor.season" : undefined);
  // Lunar Phase: its phase sensor carries everything as attributes; the separate sensors come next.
  for (const e of reg.lunar) {
    const s = st[e.entity_id];
    if (!out.lunar_phase && s?.attributes && "illumination_fraction" in s.attributes) out.lunar_phase = e.entity_id;
    for (const [key, [tks, re]] of Object.entries(LUNAR_KEYS)) {
      if (!out[key] && (tks.includes(e.translation_key) || re.test(e.entity_id))) out[key] = e.entity_id;
    }
  }
  const given = config?.entities || {};
  for (const key of ENTITY_KEYS) if (given[key]) out[key] = given[key];
  return out;
};

export const homeLocation = (hass) => {
  const lat = num(hass?.config?.latitude);
  const lon = num(hass?.config?.longitude);
  return lat === null || lon === null ? null : { lat, lon };
};
