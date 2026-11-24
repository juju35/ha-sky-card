# Changelog

## 1.2.4 - 2026-11-24

### Maintenance
- The card source is split into ES modules: `src/` (entry `src/index.js`), cut at its sections, with the translations in one file per language (`i18n/<lang>.js`). `scripts/bundle.mjs` concatenates them back, in their original order, into the same single file and per-language files as before; the tests evaluate that bundle.

## 1.2.3 - 2026-11-22

### Performance
- Card picker: the previews are back (`preview: true`), and light. Each card's preview is drawn only once it scrolls into view of Home Assistant's card picker, which otherwise builds the preview of every card at once: until then it holds Home Assistant's state (no render, no history request, no animation). On a dashboard or in the card editor the card is drawn as before.

## 1.2.2 - 2026-11-22

### Performance
- Card picker: the cards no longer ask Home Assistant for a live preview (`preview: false` in `window.customCards`). The picker drew every card at once (history requests, animations), which made the list slow to open; it now shows each card's description instead.

## 1.2.1 - 2026-11-20

### Performance
- The day's sun events (today, yesterday and tomorrow) and moonrise and moonset are computed once per day and place, then reused: a render takes about 2 ms instead of about 27 ms (every minute, and on each click on the card).

### Fixes
- `illustration_theme: auto` follows the ha-* charter: the night picture only with Home Assistant's dark theme; with a light theme the night sky stays a light picture (a pale night tint, the moon on the night arc, the stars). `illustration_theme: day|night` still forces it.
- A width change pending when the card leaves the page no longer measures the header pill of a detached card.

### Maintenance
- The unit tests report the card's own coverage.

## 1.2.0 - 2026-11-17

### Features
- Illustrated header on the Sky Card and the Sky Mini Card (90 px): the title on a sky tinted by the light of the moment, a scene at the right with the arc of the day (or of the night), the sun or the moon drawn with its phase sliding to where it is and setting behind the hills, and the band's animations (clouds and birds by day, the golden glow, the evening star of the blue hour, twinkling stars, a shooting star and a veil of cloud at night), over a 10 px lawn strip, day and night.
- The header badge is coloured by the light of the moment (day, golden hour, blue hour, night), on the illustrated and the classic header.
- New options `illustration` (`false` keeps the classic header with its pill) and `illustration_theme` (`auto`, `day`, `night`; auto: night when the sun is down or the theme is dark, even while the sun is up), in both visual editors and in every language.
- The phase of the day is a status pill in the badge's colour (on a frosted tint on the banner), on the title row right after the title only when the whole title and its whole label fit there, measured in every language; otherwise on its own line under the subtitle (then kept to one line), and its dot alone when even that does not fit in the banner above the ground strip or on a card 200 px wide or less. The same rule on the classic header. The mini card's detail button is a 24 px frosted round button 5 px from the banner's top right corner.

## 1.1.0 - 2026-11-14

### Features
- More animations, all following `animations: false` and `prefers-reduced-motion`:
  - by day, a flock of birds crossing the sky now and then;
  - in the golden hour, clouds tinted by the low sun and its reflection rippling on the ground under it;
  - in the blue hour, the evening (or morning) star shining over the horizon on the sun's side;
  - at night, a thin veil of cloud slowly passing;
  - the header badge's sun turning (its moon rocking by night), the daylight tile's sun turning, the half sun rising and setting on the dawn · dusk tile, a glow around the moon as bright as it is lit;
  - on the mini card, the sun (or moon) on the strip glowing.
- `animations: false` now keeps the header badge and the tiles' icons still too.

## 1.0.0 - 2026-11-14

### Features
- **Sky Card** (`custom:sky-card`): header with a sun or moon badge, the next event as subtitle (golden hour, sunset, sunrise) and the light of the moment as a pill (day, golden hour, blue hour, night); a sky band whose colors follow the sun's elevation, with the sun's arc of the day inside it (dashed from sunrise to sunset, solid up to now, the sun where it is; by night the moon with its phase crossing the night from sunset to sunrise) and the sunrise and sunset times in its corners; tiles for the daylight and its change since yesterday, the moon (phase drawn as it looks, illumination, next full or new moon), dawn and dusk with the solar noon, and the season with the days until the next one; a collapsible details section (golden and blue hours, solar noon, elevation, azimuth, moonrise and moonset, moon age, next full and new moons, next solstice or equinox).
- **Sky Mini Card** (`custom:sky-mini-card`): a sky strip between the sunrise and the sunset (sunset and sunrise by night) with the sun or moon on it, and the moon's phase, with a detail button that switches to the full card and back.
- Animations: the sun or moon sliding along its arc to where it is, turning rays and glow, drifting clouds, the shimmering golden-hour horizon, twinkling stars and a shooting star, colors fading from one light to the next; `animations: false` and `prefers-reduced-motion` keep the sky still.
- Sources: the **Sun**, **Moon** and **Season** integrations and, when installed, **Lunar Phase**, found through the entity registry; the `entities` option replaces any of them. Whatever is missing is computed by the card from the home location (NOAA solar equations, Meeus' lunar, phase and seasonal series): moon illumination, next full and new moons, moonrise and moonset, phase, season.
- Header: the status pill never shrinks and stays on the title line; the title and subtitle shrink with an ellipsis, and under 280 px the pill keeps its dot only, its label in its tooltip.
- Visual editor for both cards, Sections view sizes, light and dark themes, 22 languages (English in the bundle, the others loaded on demand).
