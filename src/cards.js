// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
import { TWILIGHT_ANIM, svgIcon } from "./icons.js";
import { DAY_MS } from "./astronomy.js";
import { dayStart } from "./time-zones.js";
import { esc, fmtDay, fmtDeg, fmtDelta, fmtHours, fmtPct, fmtRelDays, fmtTime, fmtUnit, hour12, intlLocale, t } from "./helpers.js";
import { resolve } from "./sources.js";
import { skyModel } from "./model.js";
import { bandSvg, moonSvg, stripHtml } from "./pictures.js";
import { headerScene, seasonSvg } from "./illustrated-header.js";
import { BAND_STYLE, BANNER_STYLE, BASE_STYLE, FULL_STYLE, MINI_STYLE, PILL_GAP_PX, PILL_GROUND_PX, SEASON_STYLE } from "./styles.js";
import { DETAILS, holdUnderPress, morph, sameDeps, watchOutside } from "./dom-patching.js";

// Numbers the cards, so that the ids in each header's scene stay apart.
export let skUid = 0;

export class SkyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._uid = ++skUid;
    holdUnderPress(this, () => this._update());
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // Enter / Space on an element with the button role acts as a click.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
  }

  static getConfigElement() {
    return document.createElement("sky-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  // Home Assistant pushes a new hass on every state change: the card is only redrawn when something it shows changed.
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const ids = Object.values(resolve(h, this._config));
    return [h.entities, h.language, h.locale, h.config, h.themes?.darkMode, this._minute, ...ids.map((id) => h.states?.[id])];
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  connectedCallback() {
    this._outside ??= watchOutside(this, () => {
      if (this._open === undefined) return;
      this._open = undefined;
      this._update();
    });
    this._outside.on();
    this._watchPill();
    if (this._hass && this._config) this._update();
    // The sun moves: redrawn every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / 60000);
      if (this._hass) this.hass = this._hass;
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._outside?.off();
    this._unwatchPill();
    this._dropPress();
    // Left (another view, a conditional card hidden): back to the default folding.
    this._open = undefined;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entities !== undefined && (typeof config.entities !== "object" || config.entities === null || Array.isArray(config.entities))) {
      throw new Error("entities must be a map of keys to entity ids");
    }
    if (config.details !== undefined && !DETAILS.includes(config.details)) throw new Error(`details must be one of ${DETAILS.join(", ")}`);
    if (config.illustration_theme !== undefined && !["auto", "day", "night"].includes(config.illustration_theme)) throw new Error("illustration_theme must be one of auto, day, night");
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _time(ms) {
    return fmtTime(ms, this._locale(), this._m.tz, hour12(this._hass));
  }

  _update() {
    if (!this._hass || !this._config) return;
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      morph(this.shadowRoot, html);
    }
    this._fitPill();
  }

  // The status pill goes on the title row, right after the title, only when the whole title and the pill's whole
  // label fit there; otherwise it takes its own line under the subtitle (the subtitle then on one line). In the
  // banner, when title, subtitle and pill still do not fit above the ground strip (or the pill's label runs past the
  // text, over the picture), the pill keeps its dot only.
  // Measured after each render and on every new width (or once the web font is loaded), never by a fixed width.
  _fitPill() {
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector?.(".trow");
      const name = row?.querySelector(".name");
      const chips = row ? [...row.children].filter((n) => n.classList.contains("chip")) : [];
      if (!name?.getBoundingClientRect || !chips.length) continue;
      t.classList.remove("pill-below", "pill-dot");
      // The title's whole width (scrollWidth is rounded: 1 px more, so that a title that fits is never cut).
      const need = chips.reduce((w, c) => w + PILL_GAP_PX + c.getBoundingClientRect().width, name.scrollWidth + 1);
      if (need <= row.getBoundingClientRect().width + 0.5) continue;
      t.classList.add("pill-below");
      const banner = t.closest(".banner");
      if (!banner) continue;
      const box = banner.getBoundingClientRect();
      const ground = box.bottom - PILL_GROUND_PX;
      const right = t.getBoundingClientRect().right;
      const out = [name, ...t.querySelectorAll(".sub"), ...chips].some((n) => {
        const r = n.getBoundingClientRect();
        return r.height > 0 && (r.top < box.top - 0.5 || r.bottom > ground + 0.5 || r.right > right + 0.5);
      });
      if (out) t.classList.add("pill-dot");
    }
  }

  _watchPill() {
    if (typeof ResizeObserver !== "function") return;
    this._pillResize ??= new ResizeObserver((entries) => {
      const w = Math.round(entries.at(-1).contentRect.width);
      if (w === this._pillWidth) return;
      this._pillWidth = w;
      cancelAnimationFrame(this._pillFrame);
      this._pillFrame = requestAnimationFrame(() => this._fitPill());
    });
    this._pillResize.observe(this);
    document.fonts?.ready?.then(() => this._fitPill());
  }

  _unwatchPill() {
    this._pillResize?.disconnect();
    if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(this._pillFrame);
    this._pillWidth = null;
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    const { action, entity } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (action === "toggle_details") {
      this._open = !this._detailsOpen();
      return this._update();
    }
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  _detailsOpen() {
    return this._open ?? this._config.details === "expanded";
  }

  _still() {
    return this._config.animations === false;
  }

  // `animations: false` keeps the whole card still: the header badge and the tiles' icons as well as the band.
  _stillAttr() {
    return this._still() ? ' class="still"' : "";
  }

  // Attributes of an element opening the more-info dialog of `id` (none without an entity).
  _more(id, label) {
    return id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"${label ? ` aria-label="${esc(label)}"` : ""}` : '"';
  }

  // ---- Parts -------------------------------------------------------------

  _illustrated() {
    return this._config.illustration !== false;
  }

  // Night picture: forced by illustration_theme, else Home Assistant's dark mode only (the ha-* charter). The sky's
  // phase (the sun under the horizon) still tints the light picture and puts the moon on the night arc.
  _night() {
    const theme = this._config.illustration_theme;
    if (theme === "night") return true;
    if (theme === "day") return false;
    return !!this._hass?.themes?.darkMode;
  }

  // The round icon, coloured by the phase (day, golden hour, blue hour, night): the sun turning while it is up, the
  // moon rocking once it is down. A click opens the sun's more-info dialog.
  _typeIcon() {
    const m = this._m;
    const elev = m.sun.elevation !== null ? ` · ${fmtDeg(m.sun.elevation, this._locale())}` : "";
    const label = this._t(`phase_${m.phase}`) + elev;
    return `<span class="type-icon ph-${m.phase}${this._more(m.sun.entity, label)} title="${esc(label)}">${svgIcon(m.sun.up ? "sun" : "moon", m.sun.up ? "a-sun" : "a-moon")}</span>`;
  }

  // The illustrated header: the title on the sky, the scene of the sun (or the moon) on its arc, the lawn strip.
  _banner() {
    const m = this._m;
    const sub = this._config.show_subtitle === false ? "" : this._subtitle();
    return `<div class="banner p-${m.phase}${this._night() ? " night" : ""}">${headerScene(m, this._uid, this._still())}<div class="lawn"></div>
        <div class="htext">${this._typeIcon()}
          <div class="titles">
            <div class="trow"><div class="name">${esc(this._config.title || this._t("title"))}</div>${this._phasePill()}</div>
            ${sub ? `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>` : ""}
          </div>
        </div>
        ${this._zoomButton()}
      </div>`;
  }

  // The status pill: the phase of the day (its colour is the round icon's), the sun's elevation in its tooltip.
  _phasePill() {
    const m = this._m;
    const text = this._t(`phase_${m.phase}`);
    const elev = m.sun.elevation !== null ? ` · ${fmtDeg(m.sun.elevation, this._locale())}` : "";
    return `<span class="chip ph-${m.phase}${this._more(m.sun.entity)} title="${esc(text + elev)}" aria-label="${esc(text + elev)}"><span class="dot"></span><span class="chip-text">${esc(text)}</span></span>`;
  }

  _header() {
    if (this._illustrated()) return this._banner();
    const m = this._m;
    const chip = this._phasePill();
    const sub = this._config.show_subtitle === false ? "" : this._subtitle();
    return `<div class="header">
        <span class="type-icon ph-${m.phase}">${svgIcon(m.sun.up ? "sun" : "moon", m.sun.up ? "a-sun" : "a-moon")}</span>
        <div class="titles">
          <div class="trow"><div class="name">${esc(this._config.title || this._t("title"))}</div>${chip}</div>
          ${sub ? `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>` : ""}
        </div>
        ${this._zoomButton()}
      </div>`;
  }

  // The next event ("Sunset at 17:21"), or the polar day or night.
  _subtitle() {
    const { sun } = this._m;
    if (sun.next) return this._t(sun.next[1], { time: this._time(sun.next[0]) });
    if (sun.polar) return this._t(sun.polar === "day" ? "polar_day_short" : "polar_night_short");
    return "";
  }

  _zoomButton() {
    return "";
  }

  _errorCard(key) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(this._t(key))}</div></ha-card>`;
  }

  // The sky band with the sunrise and sunset (sunset and sunrise by night) in its bottom corners.
  _band() {
    const m = this._m;
    const { sun } = m;
    const night = sun.arc ? sun.arc.mode === "night" : !sun.up;
    const corner = (side, icon, at, key) =>
      at === null || at === undefined ? "" : `<span class="corner ${side}" title="${esc(this._t(key))}">${svgIcon(icon)}${esc(this._time(at))}</span>`;
    const corners = sun.arc
      ? night
        ? corner("left", "sunset", sun.arc.from, "sunset") + corner("right", "sunrise", sun.arc.to, "sunrise")
        : corner("left", "sunrise", sun.arc.from, "sunrise") + corner("right", "sunset", sun.arc.to, "sunset")
      : "";
    return `<div class="band${this._more(sun.entity, this._t(`phase_${m.phase}`))}>${bandSvg(m, this._still())}${corners}</div>`;
  }

  _tile(cls, pic, label, value, sub, id, subCls = "") {
    return `<div class="tile ${cls}${this._more(id, label)}><span class="pic">${pic}</span><div class="txt"><div class="k">${esc(label)}</div><div class="v">${esc(value)}</div>${sub ? `<div class="s ${subCls}">${esc(sub)}</div>` : ""}</div></div>`;
  }

  _moonName() {
    return this._t(`moon_${this._m.moon.phase}`);
  }

  // When an event comes, in days: "in 4 days", "tomorrow".
  _inDays(at) {
    const { tz, now } = this._m;
    return fmtRelDays(Math.round((dayStart(at, tz) - dayStart(now, tz)) / DAY_MS), this._locale());
  }

  // Daylight, the moon, dawn and dusk, the season.
  _tiles() {
    const { sun, moon, season } = this._m;
    const L = this._locale();
    let length = "—";
    let sub = "";
    let subCls = "";
    if (sun.polar) length = this._t(sun.polar === "day" ? "polar_day_short" : "polar_night_short");
    else if (sun.daylight !== null && sun.daylight !== undefined) length = fmtHours(sun.daylight, L);
    if (sun.delta !== undefined) {
      const same = Math.abs(sun.delta) < 1000;
      sub = same ? this._t("same_as_yesterday") : this._t("vs_yesterday", { delta: fmtDelta(sun.delta, L) });
      subCls = same ? "" : sun.delta > 0 ? "longer" : "shorter";
    }
    const daylight = this._tile("t-day", svgIcon("sun", "a-sun"), this._t("daylight_tile"), length, sub, sun.entity, subCls);
    const [nextAt, nextKey] = moon.nextFull < moon.nextNew ? [moon.nextFull, "next_full"] : [moon.nextNew, "next_new"];
    const moonTile = this._tile(
      "t-moon",
      moonSvg(moon),
      this._moonName(),
      this._t("moon_lit", { pct: fmtPct(moon.illumination * 100, L) }),
      `${this._t(nextKey)} ${this._inDays(nextAt)}`,
      moon.entity,
    );
    const dawn = this._tile(
      "t-dawn",
      TWILIGHT_ANIM,
      this._t("dawn_dusk"),
      `${this._time(sun.dawn)} · ${this._time(sun.dusk)}`,
      sun.noon !== null ? `${this._t("solar_noon")} ${this._time(sun.noon)}` : "",
      sun.entity,
    );
    const next = season.next;
    const seasonTile = this._tile(
      `season-${season.key}`,
      seasonSvg(season.key, this._still()),
      this._t("section_season"),
      this._t(`season_${season.key}`),
      `${this._t(`season_${next.season}`)} ${this._inDays(next.at)}`,
      season.entity,
    );
    return `<div class="grid">${daylight}${moonTile}${dawn}${seasonTile}</div>`;
  }

  _detail(label, value, id) {
    return `<div class="detail${this._more(id, label)}><div class="k">${esc(label)}</div><div class="v">${value}</div></div>`;
  }

  _range([a, b]) {
    if (a === null && b === null) return "—";
    return `${esc(this._time(a))} – ${esc(this._time(b))}`;
  }

  // Everything else, in a collapsible section: golden and blue hours, solar noon, the sun's position, the moon's
  // times, age and next phases, the next season's date.
  _details() {
    const { sun, moon, season, tz, loc } = this._m;
    const L = this._locale();
    const open = this._detailsOpen();
    const title = `<div class="section-title toggle" role="button" tabindex="0" data-action="toggle_details" aria-expanded="${open}">${svgIcon("calendar")}<span>${esc(this._t("details"))}</span>${svgIcon("chevron_down", "chevron")}</div>`;
    if (!open) return `<div class="section">${title}</div>`;
    const id = sun.entity;
    const day = (at) => `${esc(fmtDay(at, L, tz))} <small>${esc(this._time(at))}</small>`;
    const list = [];
    if (loc) {
      list.push(
        this._detail(this._t("phase_golden"), `${this._range(sun.goldenAM)}<br>${this._range(sun.goldenPM)}`),
        this._detail(this._t("phase_blue"), `${this._range(sun.blueAM)}<br>${this._range(sun.bluePM)}`),
      );
    }
    list.push(this._detail(this._t("solar_noon"), `${esc(this._time(sun.noon))}${sun.noonElevation !== undefined ? ` <small>${esc(fmtDeg(sun.noonElevation, L))}</small>` : ""}`, id));
    if (sun.elevation !== null) list.push(this._detail(this._t("elevation"), esc(fmtDeg(sun.elevation, L)), id));
    if (sun.azimuth !== null) list.push(this._detail(this._t("azimuth"), esc(fmtDeg(sun.azimuth, L)), id));
    list.push(
      this._detail(this._t("moonrise"), esc(this._time(moon.rise)), moon.entity),
      this._detail(this._t("moonset"), esc(this._time(moon.set)), moon.entity),
      this._detail(this._t("moon_age_label"), esc(fmtUnit(Math.round(moon.age * 10) / 10, "day", L)), moon.entity),
      this._detail(this._t("next_full"), day(moon.nextFull), moon.entity),
      this._detail(this._t("next_new"), day(moon.nextNew), moon.entity),
    );
    const next = season.next;
    const event = season.type === "meteorological" ? this._t(`season_${next.season}`) : this._t(`event_${next.season}`);
    list.push(this._detail(event, esc(fmtDay(next.at, L, tz)), season.entity));
    const computed = moon.computed.length || season.computed ? ` title="${esc(this._t("computed"))}"` : "";
    return `<div class="section">${title}<div class="details"${computed}>${list.join("")}</div></div>`;
  }

  _style(extra = "") {
    return `<style>${BASE_STYLE}${BAND_STYLE}${SEASON_STYLE}${FULL_STYLE}${this._illustrated() ? BANNER_STYLE : ""}${extra}</style>`;
  }

  _model() {
    const m = skyModel(this._hass, this._config);
    this._m = m;
    return m;
  }

  _body() {
    const c = this._config;
    const parts = [];
    if (c.show_sky !== false) parts.push(this._band());
    if (c.show_tiles !== false) parts.push(this._tiles());
    if (c.details !== "hidden") parts.push(this._details());
    return `<div class="content">${parts.join("")}</div>`;
  }

  _render() {
    const m = this._model();
    if (m.error) return this._errorCard(m.error);
    return `${this._style()}<ha-card${this._stillAttr()}>${this._header()}${this._body()}</ha-card>`;
  }
}

// The mini card: the sky strip between the sunrise and the sunset, and the moon; its detail button (top right,
// `zoom: false` removes it) shows the full card's content, and a click anywhere else brings the compact view back.
export class SkyMiniCard extends SkyCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("sky-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${!!z}">${svgIcon(z ? "collapse" : "expand")}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector?.(".zoom")?.focus({ preventScroll: true });
  }

  _render() {
    if (this._zoomed) return super._render();
    const m = this._model();
    if (m.error) return this._errorCard(m.error);
    const { sun, moon } = m;
    const L = this._locale();
    const time = (icon, at, key) => `<span class="t" title="${esc(this._t(key))}">${svgIcon(icon)}${esc(this._time(at))}</span>`;
    const moonLabel = `${this._moonName()} · ${this._t("moon_lit", { pct: fmtPct(moon.illumination * 100, L) })}`;
    // By night the strip runs from the sunset to the next sunrise, as the full card's band.
    const ends = sun.arc?.mode === "night" ? [time("sunset", sun.arc.from, "sunset"), time("sunrise", sun.arc.to, "sunrise")] : [time("sunrise", sun.sunrise, "sunrise"), time("sunset", sun.sunset, "sunset")];
    return `${this._style(MINI_STYLE)}<ha-card${this._stillAttr()}>${this._header()}
        <div class="content"><div class="mini">
          <span class="sunrow${this._more(sun.entity, this._t(`phase_${m.phase}`))}>${ends[0]}${stripHtml(m, this._still())}${ends[1]}</span>
          <span class="mm${this._more(moon.entity, moonLabel)} title="${esc(moonLabel)}">${moonSvg(moon)}</span>
        </div></div></ha-card>`;
  }
}
