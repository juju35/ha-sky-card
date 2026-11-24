// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
import { pickerDefine } from "./card-picker.js";
import { VERSION } from "./core.js";
import { SkyCard, SkyMiniCard } from "./cards.js";
import { SkyCardEditor, SkyMiniCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("sky-card", SkyCard);
define("sky-mini-card", SkyMiniCard);
define("sky-card-editor", SkyCardEditor);
define("sky-mini-card-editor", SkyMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "sky-card",
    name: "Sky Card",
    description: "Sky band following the sun's elevation with its arc from sunrise to sunset, daylight and its change since yesterday, moon phase and illumination, dawn and dusk, the season, golden and blue hours.",
  },
  { type: "sky-mini-card", name: "Sky Mini Card", description: "A sky strip between sunrise and sunset and the moon phase at a glance, with a detail button showing the full card." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-sky-card" });
}

console.info(`%c SKY-CARD %c v${VERSION} `, "color: white; background: #ffa000; font-weight: 700;", "color: #ffa000; background: white; font-weight: 700;");
