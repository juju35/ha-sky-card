import assert from "node:assert/strict";
import { test } from "node:test";
import { DAY, HOME, mockAt, NIGHT, SUNSET, TZ } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const paris = (iso) => Date.parse(`${iso}+01:00`);
const BEFORE_DAWN = paris("2026-11-20T05:30:00");

const makeHass = (now, opts = {}, extra = {}) => ({
  ...mockAt(now, opts),
  config: { ...HOME },
  language: "en",
  locale: { language: "en", time_format: "24", time_zone: "server" },
  ...extra,
});

const newCard = (sk, config = {}, hass, Card = sk.SkyCard) => {
  const card = new Card();
  card.setConfig(config);
  card.hass = hass;
  return card;
};
const html = (card) => card.shadowRoot.innerHTML;
const click = (card, dataset, extra = []) => card._onClick({ composedPath: () => [{ dataset }, ...extra], stopPropagation() {} });
const near = (a, b, minutes, label) => assert.ok(Math.abs(a - b) <= minutes * 60e3, `${label}: ${new Date(a).toISOString()} vs ${new Date(b).toISOString()}`);

const sk = load(DAY);

test("sun times match published ones (Paris, 20 November 2026)", () => {
  const start = sk.dayStart(DAY, TZ);
  const d = sk.sunDay(start, start + 86400e3, HOME.latitude, HOME.longitude);
  near(d.sunrise, Date.parse("2026-11-20T07:07:00Z"), 2, "sunrise");
  near(d.sunset, Date.parse("2026-11-20T16:04:00Z"), 2, "sunset");
  near(d.noon, Date.parse("2026-11-20T11:35:00Z"), 2, "solar noon");
  assert.ok(d.dawn < d.sunrise && d.dusk > d.sunset);
  assert.ok(d.goldenPM[0] < d.sunset && d.goldenPM[1] > d.sunset);
  assert.equal(d.polar, null);
});

test("moon phases, illumination and solstices follow Meeus' series", () => {
  near(sk.nextMoonPhase(DAY, true), Date.parse("2026-11-24T14:53:00Z"), 3, "full moon");
  near(sk.nextMoonPhase(DAY, false), Date.parse("2026-12-09T00:52:00Z"), 3, "new moon");
  near(sk.solsticeEquinox(2026, 3), Date.parse("2026-12-21T20:50:00Z"), 5, "December solstice");
  near(sk.solsticeEquinox(2027, 0), Date.parse("2027-03-20T20:24:00Z"), 5, "March equinox");
  // 14 November 2026, 02:14 UTC: Lunar Phase reported 20.9 %.
  assert.ok(Math.abs(sk.moonIllumination(Date.parse("2026-11-14T02:14:00Z")) - 0.209) < 0.015);
  assert.ok(sk.moonIllumination(sk.nextMoonPhase(DAY, true)) > 0.99);
  assert.ok(sk.moonIllumination(sk.nextMoonPhase(DAY, false)) < 0.01);
  assert.equal(sk.phaseOfAge(0.2), "new_moon");
  assert.equal(sk.phaseOfAge(7.4), "first_quarter");
  assert.equal(sk.phaseOfAge(15), "full_moon");
  assert.equal(sk.phaseOfAge(25), "waning_crescent");
});

test("the light of the moment follows the sun's elevation", () => {
  assert.equal(sk.phaseOf(30), "day");
  assert.equal(sk.phaseOf(6), "day");
  assert.equal(sk.phaseOf(2), "golden");
  assert.equal(sk.phaseOf(-4), "golden");
  assert.equal(sk.phaseOf(-5), "blue");
  assert.equal(sk.phaseOf(-7), "night");
  // The band's colors blend between their stops and stay put past the ends.
  assert.deepEqual(sk.skyColors(-40), sk.skyColors(-12));
  assert.deepEqual(sk.skyColors(60), sk.skyColors(25));
  assert.notDeepEqual(sk.skyColors(3), sk.skyColors(0));
});

test("the lit part of the moon is drawn on the right side", () => {
  assert.equal(sk.moonLitPath(20, 20, 17, 0, true, false), "");
  assert.match(sk.moonLitPath(20, 20, 17, 1, true, false), /<circle class="lit"/);
  // Waxing, northern hemisphere: the outer arc sweeps clockwise on the right (sweep flag 1); waning or south: 0.
  assert.match(sk.moonLitPath(20, 20, 17, 0.3, true, false), /A17 17 0 0 1 20 37/);
  assert.match(sk.moonLitPath(20, 20, 17, 0.3, false, false), /A17 17 0 0 0 20 37/);
  assert.match(sk.moonLitPath(20, 20, 17, 0.3, true, true), /A17 17 0 0 0 20 37/);
  // Half lit: a straight terminator.
  assert.match(sk.moonLitPath(20, 20, 17, 0.5, true, false), /A0\.00 17/);
});

test("the Sun, Moon, Season and Lunar Phase entities are found through the registry", () => {
  const ids = sk.resolve(makeHass(DAY), {});
  assert.equal(ids.sun, "sun.sun");
  assert.equal(ids.moon_phase, "sensor.moon_phase");
  assert.equal(ids.season, "sensor.season");
  assert.equal(ids.lunar_phase, "sensor.home_moon_phase");
  assert.equal(ids.moonrise, "sensor.home_moon_rise");
  assert.equal(ids.illumination, "sensor.home_moon_illumination_fraction");
  assert.equal(ids.next_full_moon, "sensor.home_next_full_moon");
  // An entity given by hand wins.
  assert.equal(sk.resolve(makeHass(DAY), { entities: { season: "sensor.my_season" } }).season, "sensor.my_season");
  // Without a registry, the usual entity ids.
  const bare = makeHass(DAY, { lunar: false });
  bare.entities = undefined;
  const ids2 = sk.resolve(bare, {});
  assert.equal(ids2.sun, "sun.sun");
  assert.equal(ids2.moon_phase, "sensor.moon_phase");
  assert.equal(ids2.season, "sensor.season");
});

test("the arc and the next event follow the time of day", () => {
  const at = (now) => load(now).skyModel(makeHass(now), {});
  const day = at(DAY);
  assert.equal(day.phase, "day");
  assert.equal(day.sun.arc.mode, "day");
  // 11:40, sunrise 08:07, sunset 17:04.
  assert.ok(Math.abs(day.sun.arc.progress - (213 / 537)) < 0.01, String(day.sun.arc.progress));
  assert.equal(day.sun.next[1], "next_golden");
  const golden = at(SUNSET);
  assert.equal(golden.phase, "golden");
  assert.equal(golden.sun.next[1], "next_sunset");
  const night = at(NIGHT);
  assert.equal(night.phase, "night");
  assert.equal(night.sun.arc.mode, "night");
  assert.equal(night.sun.arc.from, night.sun.sunset);
  assert.equal(night.sun.next[1], "next_sunrise");
  assert.ok(night.sun.next[0] > NIGHT + 6 * 3600e3, "tomorrow's sunrise");
  // Before dawn: the night started yesterday, today's sunrise comes first (not the evening golden hour).
  const early = at(BEFORE_DAWN);
  assert.equal(early.sun.arc.mode, "night");
  assert.equal(early.sun.arc.to, early.sun.sunrise);
  assert.ok(early.sun.arc.from < sk.dayStart(BEFORE_DAWN, TZ));
  assert.equal(early.sun.next[1], "next_sunrise");
  assert.equal(early.sun.next[0], early.sun.sunrise);
});

test("the daylight and its change since yesterday", () => {
  const m = sk.skyModel(makeHass(DAY), {});
  near(m.sun.daylight, (8 * 60 + 57) * 60e3, 3, "daylight");
  assert.ok(m.sun.delta < -100e3 && m.sun.delta > -200e3, String(m.sun.delta));
  assert.equal(sk.fmtDelta(-152000, "en"), "−2m 32s");
  assert.equal(sk.fmtDelta(45000, "en"), "+45s");
  assert.equal(sk.fmtHours((8 * 60 + 58) * 60e3, "en"), "8 hr 58 min");
  assert.equal(sk.fmtPct(78.4, "en"), "78%");
  assert.equal(sk.fmtPct(78.4, "fr").replace(/\s/g, " "), "78 %");
});

test("the moon: Lunar Phase values first, the card's own astronomy otherwise", () => {
  const lunar = sk.skyModel(makeHass(DAY), {}).moon;
  assert.equal(lunar.phase, "waxing_gibbous");
  assert.ok(lunar.waxing);
  assert.equal(lunar.computed.length, 0);
  assert.ok(lunar.rise !== null && lunar.set !== null);
  const core = sk.skyModel(makeHass(DAY, { lunar: false }), {}).moon;
  assert.equal(core.phase, "waxing_gibbous");
  assert.ok(core.computed.includes("illumination") && core.computed.includes("next") && core.computed.includes("times"));
  assert.ok(Math.abs(core.illumination - lunar.illumination) < 0.01);
  near(core.nextFull, lunar.nextFull, 1, "next full moon");
  // Nothing but a home location: still a phase.
  const bare = sk.skyModel(makeHass(DAY, { lunar: false, moon: false, season: false }), {});
  assert.ok(bare.moon.computed.includes("phase"));
  assert.equal(bare.season.key, "autumn");
  assert.ok(bare.season.computed);
});

test("seasons: astronomical and meteorological, and the southern hemisphere", () => {
  const astro = sk.seasonBounds(DAY, TZ, "astronomical", false);
  assert.equal(astro.prev.season, "autumn");
  assert.equal(astro.next.season, "winter");
  const meteo = sk.seasonBounds(DAY, TZ, "meteorological", false);
  assert.equal(meteo.next.at, sk.dayStart(Date.parse("2026-12-01T12:00:00Z"), TZ));
  assert.equal(sk.seasonBounds(DAY, TZ, "astronomical", true).prev.season, "spring");
});

test("no sun entity and no home location: a warning", () => {
  const hass = makeHass(DAY, { sun: false });
  hass.config = {};
  const card = newCard(sk, {}, hass);
  assert.match(html(card), /class="warning"/);
});

test("the full card: header, sky band, four tiles and the folded details", () => {
  const card = newCard(sk, {}, makeHass(DAY));
  const h = html(card);
  assert.match(h, /<div class="name">Sky<\/div>/);
  assert.match(h, /<div class="sub">Golden hour at 16:1\d<\/div>/);
  assert.match(h, /class="banner p-day">/);
  assert.match(h, /class="type-icon ph-day clickable"[^>]*data-entity="sun.sun"[^>]*title="Day · \d+°">.*circle cx="12"/s, "sun icon by day");
  assert.match(h, /class="band clickable"[^>]*data-entity="sun.sun"/);
  assert.match(h, /class="body sun"/);
  assert.match(h, /corner left[^>]*>.*08:07/s);
  assert.match(h, /corner right[^>]*>.*17:04/s);
  assert.equal((h.match(/class="tile /g) || []).length, 4);
  assert.match(h, />Daylight</);
  assert.match(h, />8 hr 5\d min</);
  assert.match(h, /vs yesterday/);
  assert.match(h, />Waxing gibbous</);
  assert.match(h, /\d\d% lit/);
  assert.match(h, /Full moon in 4 days/);
  assert.match(h, />Dawn · dusk</);
  assert.match(h, />Autumn</);
  assert.match(h, /Winter in 31 days/);
  assert.match(h, /data-action="toggle_details" aria-expanded="false"/);
  assert.doesNotMatch(h, /class="details"/);
});

test("by night: the moon icon, the moon on the night arc, sunset then sunrise in the corners", () => {
  const n = load(NIGHT);
  const card = newCard(n, {}, makeHass(NIGHT), n.SkyCard);
  const h = html(card);
  assert.match(h, /class="banner p-night night">/);
  assert.match(h, /type-icon ph-night[^>]*>.*M12\.3 2\.5/s, "moon icon by night");
  assert.match(h, /class="body moon"/);
  assert.match(h, /class="stars"/);
  assert.match(h, /corner left" title="Sunset"/);
  assert.match(h, /corner right" title="Sunrise"/);
  assert.match(h, /Sunrise at 08:0\d/);
});

test("the details unfold on a click, fold back on a click elsewhere and when the card leaves the page", () => {
  const card = newCard(sk, {}, makeHass(DAY));
  click(card, { action: "toggle_details" });
  let h = html(card);
  assert.match(h, /aria-expanded="true"/);
  assert.match(h, /class="details"/);
  for (const label of ["Golden hour", "Blue hour", "Solar noon", "Elevation", "Azimuth", "Moonrise", "Moonset", "Moon age", "Full moon", "New moon", "Winter solstice"]) {
    assert.ok(h.includes(`<div class="k">${label}</div>`), label);
  }
  card.connectedCallback();
  card._outside.tap({ composedPath: () => [] });
  assert.match(html(card), /aria-expanded="false"/);
  click(card, { action: "toggle_details" });
  card.disconnectedCallback();
  card.connectedCallback();
  assert.match(html(card), /aria-expanded="false"/);
  // `details: expanded` starts unfolded, `hidden` leaves the section out.
  assert.match(html(newCard(sk, { details: "expanded" }, makeHass(DAY))), /class="details"/);
  assert.doesNotMatch(html(newCard(sk, { details: "hidden" }, makeHass(DAY))), /toggle_details/);
  h = html(newCard(sk, { show_sky: false, show_tiles: false }, makeHass(DAY)));
  assert.doesNotMatch(h, /class="band/);
  assert.doesNotMatch(h, /class="tile /);
  assert.throws(() => newCard(sk, { details: "open" }, makeHass(DAY)), /details must be/);
  assert.throws(() => newCard(sk, { entities: ["sun.sun"] }, makeHass(DAY)), /entities must be/);
});

test("a click on the band or a tile opens the more-info dialog", () => {
  const card = newCard(sk, {}, makeHass(DAY));
  click(card, { entity: "sensor.home_moon_phase" });
  assert.equal(card.events.at(-1).type, "hass-more-info");
  assert.equal(card.events.at(-1).detail.entityId, "sensor.home_moon_phase");
});

test("animations: still when turned off, and the DOM is not rewritten when nothing changed", () => {
  assert.match(html(newCard(sk, { animations: false }, makeHass(DAY))), /class="band-svg p-day still"/);
  const card = newCard(sk, {}, makeHass(DAY));
  const before = card._html;
  card.hass = { ...makeHass(DAY), states: card.hass.states, entities: card.hass.entities, config: card.hass.config, locale: card.hass.locale };
  assert.equal(card._html, before);
});

test("the mini card: the sky strip, the moon, and the detail button", () => {
  const card = newCard(sk, {}, makeHass(DAY), sk.SkyMiniCard);
  let h = html(card);
  assert.match(h, /class="strip p-day"/);
  assert.match(h, /class="mm clickable"/);
  assert.match(h, /data-action="zoom"/);
  assert.doesNotMatch(h, /class="tile /);
  click(card, { action: "zoom" });
  h = html(card);
  assert.match(h, /class="band clickable"/);
  assert.equal((h.match(/class="tile /g) || []).length, 4);
  assert.equal(card.getCardSize(), 7);
  card.connectedCallback();
  card._unzoom.tap({ composedPath: () => [] });
  assert.match(html(card), /class="strip p-day"/);
  assert.doesNotMatch(html(newCard(sk, { zoom: false }, makeHass(DAY), sk.SkyMiniCard)), /data-action="zoom"/);
  // By night the strip runs from the sunset to the sunrise.
  const n = load(NIGHT);
  const night = html(newCard(n, {}, makeHass(NIGHT), n.SkyMiniCard));
  assert.ok(night.indexOf('title="Sunset"') < night.indexOf('title="Sunrise"'));
});

test("translations: every language has every key, with the same placeholders", () => {
  const en = sk.STRINGS.en;
  assert.equal(Object.keys(sk.STRINGS).length, 22);
  for (const [l, table] of Object.entries(sk.STRINGS)) {
    assert.deepEqual(Object.keys(table).sort(), Object.keys(en).sort(), l);
    for (const [k, v] of Object.entries(en)) assert.deepEqual((table[k].match(/\{\w+\}/g) || []).sort(), (v.match(/\{\w+\}/g) || []).sort(), `${l}.${k}`);
  }
  const fr = newCard(sk, { language: "fr" }, makeHass(DAY));
  assert.match(html(fr), /Heure dorée à/);
  assert.equal(sk.lang({ language: "pt-BR" }, {}), "pt");
  assert.equal(sk.intlLocale({ language: "pt" }, {}), "pt-PT");
});

test("visual editors: options at their default stay out of the YAML; the mini editor adds the detail button", () => {
  const plain = (o) => JSON.parse(JSON.stringify(o));
  assert.deepEqual(plain(sk.cleanConfig({ type: "custom:sky-card", show_sky: true, details: "collapsed", title: "" }, { show_sky: true, details: "collapsed" })), { type: "custom:sky-card" });
  assert.deepEqual(plain(sk.cleanConfig({ details: "hidden", animations: false }, { details: "collapsed", animations: true })), { details: "hidden", animations: false });
  const names = (E) => E.toggles.map(([n]) => n);
  assert.ok(!names(sk.SkyCardEditor).includes("zoom"));
  assert.ok(names(sk.SkyMiniCardEditor).includes("zoom"));
  for (const n of names(sk.SkyCardEditor)) assert.ok(names(sk.SkyMiniCardEditor).includes(n), n);
  const ed = new sk.SkyCardEditor();
  ed._hass = makeHass(DAY);
  ed._config = {};
  const schema = ed._schema().flatMap((s) => (s.schema ? s.schema : [s])).map((s) => s.name);
  for (const n of ["title", "show_sky", "show_tiles", "details", "season_type", "language", "animations", "illustration", "illustration_theme"]) assert.ok(schema.includes(n), n);
});

test("both cards are registered for the card picker", () => {
  assert.equal(sk.window.customCards.map((c) => c.type).join(), "sky-card,sky-mini-card");
});

test("the status pill never leaves the header: it does not shrink, the titles do, and narrow cards keep its dot", () => {
  const h = html(newCard(sk, { title: "A very long title that cannot fit on one line", illustration: false }, makeHass(SUNSET)));
  assert.match(h, /\.chip \{[^}]*flex: none;/);
  assert.doesNotMatch(h, /\.chip \{[^}]*max-width/);
  assert.match(h, /\.titles \{[^}]*flex: 1 1 0; min-width: 0;/);
  assert.match(h, /\.name \{[^}]*text-overflow: ellipsis/);
  assert.match(h, /\.sub \{[^}]*text-overflow: ellipsis/);
  assert.match(h, /@container \(max-width: 280px\) \{[^@]*\.chip-text \{ display: none; \}/);
  // The label stays in the tooltip.
  assert.match(h, /class="chip ph-golden[^>]*title="Golden hour · -?\d+°"/);
});

test("the illustrated header: the sun or the moon on its arc over the lawn, night by the sun, the dark theme or illustration_theme", () => {
  const day = newCard(sk, {}, makeHass(DAY));
  const h = html(day);
  assert.match(h, /<svg class="hs-svg p-day"/);
  assert.match(h, /<div class="lawn"><\/div>/);
  assert.match(h, /class="hs-arc done"/);
  assert.match(h, /\.banner \{[^}]*height: 90px;/);
  // The phase is the status pill right after the title, in the icon's colour.
  assert.match(h, /<div class="trow"><div class="name">[^<]*<\/div><span class="chip ph-day[^>]*title="[^"]*" aria-label="[^"]*"><span class="dot"><\/span><span class="chip-text">Day<\/span>/);
  // Each card's scene has its own gradient ids.
  const other = html(newCard(sk, {}, makeHass(DAY)));
  const id = (x) => x.match(/id="(sk-sun-h\d+)"/)[1];
  assert.notEqual(id(h), id(other));
  assert.match(h, new RegExp(`url\\(#${id(h).replace("sun", "glow")}\\)`));
  // Forced night by day, forced day by night.
  assert.match(html(newCard(sk, { illustration_theme: "night" }, makeHass(DAY))), /class="banner p-day night">/);
  const n = load(NIGHT);
  const night = html(newCard(n, { illustration_theme: "day" }, makeHass(NIGHT), n.SkyCard));
  assert.match(night, /class="banner p-night">/);
  assert.match(night, /<svg class="hs-svg p-night"[\s\S]*class="body moon"[\s\S]*class="hs-hill"/);
  // Home Assistant's dark theme: night by day too, unless forced to day.
  assert.match(html(newCard(sk, {}, makeHass(DAY, {}, { themes: { darkMode: true } }))), /class="banner p-day night">/);
  assert.match(html(newCard(sk, {}, makeHass(DAY, {}, { themes: { darkMode: false } }))), /class="banner p-day">/);
  assert.match(html(newCard(sk, { illustration_theme: "day" }, makeHass(DAY, {}, { themes: { darkMode: true } }))), /class="banner p-day">/);
  assert.throws(() => newCard(sk, { illustration_theme: "dusk" }, makeHass(DAY)));
  // illustration: false keeps the classic header with its status pill, the icon still coloured by the phase.
  const classic = html(newCard(sk, { illustration: false }, makeHass(SUNSET)));
  assert.doesNotMatch(classic, /class="banner/);
  assert.doesNotMatch(classic, /\.banner \{/);
  assert.match(classic, /class="type-icon ph-golden">/);
  assert.match(classic, /class="chip ph-golden/);
  // The mini card: the same banner with its detail button.
  const mini = html(newCard(sk, {}, makeHass(DAY), sk.SkyMiniCard));
  assert.match(mini, /class="banner p-day">[\s\S]*class="zoom"/);
});
