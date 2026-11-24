// The card's names for the tests, from the bundled card source (test/source.mjs) run in a sandbox (scripts/astro-sandbox.mjs) with a shadow
// root stand-in that keeps the HTML it is given. `now` freezes the clock.
import { sandbox } from "../scripts/astro-sandbox.mjs";

const fakeRoot = () => ({
  innerHTML: "",
  listeners: {},
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  },
  querySelector() {
    return null;
  },
});

export const load = (now) => {
  class HTMLElement {
    attachShadow() {
      this.shadowRoot = fakeRoot();
      return this.shadowRoot;
    }
    dispatchEvent(ev) {
      (this.events ||= []).push(ev);
    }
    appendChild() {}
  }
  class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }
  const registry = new Map();
  const listeners = {};
  const extra = {
    HTMLElement,
    CustomEvent,
    customElements: { get: (t) => registry.get(t), define: (t, c) => registry.set(t, c) },
    document: {
      createElement: (t) => (registry.has(t) ? new (registry.get(t))() : { tagName: t, addEventListener() {}, children: [] }),
      addEventListener: (type, fn) => (listeners[type] ||= new Set()).add(fn),
      removeEventListener: (type, fn) => listeners[type]?.delete(fn),
    },
  };
  const names = [
    "STRINGS",
    "MOON_PHASES",
    "lang",
    "intlLocale",
    "sunDay",
    "sunDayOf",
    "sunPosition",
    "moonIllumination",
    "moonDay",
    "moonPhaseTime",
    "nextMoonPhase",
    "lastNewMoon",
    "solsticeEquinox",
    "phaseOfAge",
    "phaseOf",
    "dayStart",
    "seasonBounds",
    "resolve",
    "skyModel",
    "moonLitPath",
    "fmtDelta",
    "fmtHours",
    "cleanConfig",
    "skyColors",
    "fmtPct",
    'SkyCard: customElements.get("sky-card")',
    'SkyMiniCard: customElements.get("sky-mini-card")',
    'SkyCardEditor: customElements.get("sky-card-editor")',
    'SkyMiniCardEditor: customElements.get("sky-mini-card-editor")',
    "window",
  ];
  return sandbox(names, { now, extra });
};
