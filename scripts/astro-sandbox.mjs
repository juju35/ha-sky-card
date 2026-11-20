// Runs src/sky-card.js (a classic script) in a sandbox with minimal DOM stand-ins and returns the names asked for:
// the tests use it, and so do the mock states, whose sun and moon values come from the card's own astronomy.
// `now` freezes the sandbox clock (Date.now() and new Date()).
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../src/sky-card.js", import.meta.url), "utf8");

export function sandbox(names, { now, extra = {} } = {}) {
  const registry = new Map();
  const RealDate = Date;
  const FixedDate =
    now === undefined
      ? RealDate
      : class extends RealDate {
          constructor(...args) {
            super(...(args.length ? args : [now]));
          }
          static now() {
            return now;
          }
        };
  const ctx = {
    Date: FixedDate,
    Intl,
    Math,
    console: { info() {}, warn() {} },
    HTMLElement: class {},
    CustomEvent: class {},
    customElements: { get: (t) => registry.get(t), define: (t, c) => registry.set(t, c) },
    document: { createElement: () => ({}), addEventListener() {}, removeEventListener() {} },
    setTimeout,
    clearTimeout,
    setInterval: () => 0,
    clearInterval() {},
    ...extra,
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  // The file name lets `node --test --experimental-test-coverage` report the card's own coverage.
  return vm.runInContext(`${source}\n({ ${names.join(", ")} })`, ctx, { filename: new URL("../src/sky-card.js", import.meta.url).href });
}
