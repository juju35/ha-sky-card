// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------
import { lang, t } from "./helpers.js";
import { DETAILS } from "./dom-patching.js";

export const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

// Keeps the YAML minimal: drops empty values and options left at their default.
export const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (const [k, v] of Object.entries(config)) {
    const empty = v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length);
    if (empty || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
  }
  return config;
};

export class SkyCardEditor extends HTMLElement {
  // [name, default]
  static get toggles() {
    return [
      ["illustration", true],
      ["show_title", true],
      ["show_subtitle", true],
      ["show_sky", true],
      ["show_tiles", true],
      ["animations", true],
    ];
  }

  static get defaults() {
    return { details: "collapsed", season_type: "astronomical", illustration_theme: "auto" };
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      { name: "illustration_theme", selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((value) => ({ value, label: tr(`theme_${value}`) })) } } },
      { name: "details", selector: { select: { mode: "dropdown", options: DETAILS.map((value) => ({ value, label: tr(`details_${value}`) })) } } },
      {
        name: "season_type",
        selector: { select: { mode: "dropdown", options: ["astronomical", "meteorological"].map((value) => ({ value, label: tr(`season_${value}`) })) } },
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _label(name) {
    return t(this._hass, this._config, name === "title" ? "title_option" : name === "details" ? "details_option" : name);
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    const defaults = { ...Object.fromEntries(toggles), ...this.constructor.defaults };
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => this._label(s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, defaults);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    if (this._dataFor !== this._config) {
      this._dataFor = this._config;
      this._form.data = { ...defaults, ...this._config };
    }
    const l = lang(this._hass, this._config);
    if (this._schemaLang !== l) {
      this._schemaLang = l;
      this._form.schema = this._schema();
    }
  }
}

// The mini card's editor: the full card's options (its detailed view) and the detail button.
export class SkyMiniCardEditor extends SkyCardEditor {
  static get toggles() {
    return [...SkyCardEditor.toggles, ["zoom", true]];
  }
}
