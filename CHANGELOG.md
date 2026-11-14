# Changelog

## 1.0.0 - 2026-11-14

### Features
- **Sky Card** (`custom:sky-card`): header with a sun or moon badge, the next event as subtitle (golden hour, sunset, sunrise) and the light of the moment as a pill (day, golden hour, blue hour, night); a sky band whose colors follow the sun's elevation, with the sun's arc of the day inside it (dashed from sunrise to sunset, solid up to now, the sun where it is; by night the moon with its phase crossing the night from sunset to sunrise) and the sunrise and sunset times in its corners; tiles for the daylight and its change since yesterday, the moon (phase drawn as it looks, illumination, next full or new moon), dawn and dusk with the solar noon, and the season with the days until the next one; a collapsible details section (golden and blue hours, solar noon, elevation, azimuth, moonrise and moonset, moon age, next full and new moons, next solstice or equinox).
- **Sky Mini Card** (`custom:sky-mini-card`): a sky strip between the sunrise and the sunset (sunset and sunrise by night) with the sun or moon on it, and the moon's phase, with a detail button that switches to the full card and back.
- Animations: the sun or moon sliding along its arc to where it is, turning rays and glow, drifting clouds, the shimmering golden-hour horizon, twinkling stars and a shooting star, colors fading from one light to the next; `animations: false` and `prefers-reduced-motion` keep the sky still.
- Sources: the **Sun**, **Moon** and **Season** integrations and, when installed, **Lunar Phase**, found through the entity registry; the `entities` option replaces any of them. Whatever is missing is computed by the card from the home location (NOAA solar equations, Meeus' lunar, phase and seasonal series): moon illumination, next full and new moons, moonrise and moonset, phase, season.
- Header: the status pill never shrinks and stays on the title line; the title and subtitle shrink with an ellipsis, and under 280 px the pill keeps its dot only, its label in its tooltip.
- Visual editor for both cards, Sections view sizes, light and dark themes, 22 languages (English in the bundle, the others loaded on demand).
