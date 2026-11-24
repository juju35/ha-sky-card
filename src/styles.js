// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
import { H, W } from "./pictures.js";

export const BASE_STYLE = `
  :host { --sk-accent: #ffa000; --sk-day: #f5a623; --sk-golden: #ff7a1a; --sk-blue: #3d6fe0; --sk-night: #5c6bc0;
          --sk-idle: var(--disabled-text-color, #9e9e9e); }
  ha-card { overflow: hidden; container-type: inline-size; }
  :host { display: block; min-width: 0; --sk-natural-width: 400px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--sk-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--sk-accent)); outline-offset: 2px; border-radius: 6px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ph-day { --c: var(--sk-day); } .ph-golden { --c: var(--sk-golden); } .ph-blue { --c: var(--sk-blue); } .ph-night { --c: var(--sk-night); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c) 15%, transparent); color: color-mix(in srgb, var(--c) 50%, var(--primary-text-color));
          flex: none; box-sizing: border-box; transition: background-color .6s ease, color .6s ease; }
  .chip-text { white-space: nowrap; }
  .header { display: flex; align-items: flex-start; gap: 10px; padding: 12px 12px 0; min-width: 0; }
  .header > .zoom { margin-top: 8px; }
  .header:has(.sub) > .zoom { margin-top: 1px; }
  .titles { flex: 1 1 0; min-width: 0; min-height: 40px; display: flex; flex-direction: column; justify-content: center; }
  :host([hide-title]) .titles .name { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; line-height: 15px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .type-icon { position: relative; display: flex; flex: none; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               background: color-mix(in srgb, var(--c, var(--sk-accent)) 16%, transparent); transition: background-color .6s ease; }
  .type-icon .icon { width: 24px; height: 24px; fill: color-mix(in srgb, var(--c, var(--sk-accent)) 75%, var(--primary-text-color)); }
  .icon.a-sun { animation: sk-spin 6s linear infinite; }
  .icon.a-moon { animation: sk-rock 6s ease-in-out infinite; }
  @keyframes sk-rock { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  .warning { padding: 16px; color: color-mix(in srgb, var(--sk-golden) 50%, var(--primary-text-color)); }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin-right: -4px; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--sk-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--sk-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--sk-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--sk-accent)); outline-offset: 1px; }
  .moon-pic { width: 100%; height: 100%; overflow: visible; }
  .moon-disc .dark { fill: #3a3e52; }
  .moon-disc .lit { fill: #fdf3c8; }
  .moon-disc .crater { fill: #1b1e2c; opacity: .14; }
  .moon-pic .m-glow { fill: #fdf3c8; opacity: calc(var(--mg, 1) * .1); animation: sk-moonglow 3s ease-in-out infinite; }
  @keyframes sk-moonglow { 0%, 100% { opacity: calc(var(--mg, 1) * .1); } 50% { opacity: calc(var(--mg, 1) * .4); } }
  .stars .star { fill: #fffde7; transform-box: fill-box; transform-origin: center; animation: sk-twinkle 3s ease-in-out infinite; }
  .stars g:nth-child(3n) .star { animation-delay: -1s; }
  .stars g:nth-child(3n+1) .star { animation-delay: -2s; }
  .stars { transition: opacity 2s ease; }
  @keyframes sk-twinkle { 0%, 100% { opacity: .35; transform: scale(.7); } 50% { opacity: 1; transform: scale(1.1); } }
  .still *, .still { animation: none !important; }
  /* The status pill (classic header and banner): on the title row, 8 px after the title, only when the whole title
     and the pill's whole label fit there; otherwise on its own line under the subtitle, which then keeps one line.
     Measured after each render (see _fitPill), never by a fixed width. Its dot alone at 200 px or less, or when the
     banner has no room left for its label (pill-dot); the label stays its tooltip and accessible name. */
  .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .trow .name { flex: 0 1 auto; min-width: 0; }
  .trow .chip { flex: none; }
  .titles.pill-below .trow { display: contents; }
  .titles.pill-below .sub { order: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .titles.pill-below .chip { order: 2; align-self: flex-start; margin-top: 2px; }
  .titles.pill-dot .chip { padding: 4px; }
  .titles.pill-dot .chip-text { display: none; }
  @container (max-width: 200px) {
    .header { gap: 6px; }
    .chip { padding: 4px; }
    .chip .chip-text { display: none; }
  }
`;

export const BAND_STYLE = `
  .band { position: relative; border-radius: 16px; overflow: hidden; line-height: 0; background: #0b1230; }
  .band-svg { display: block; width: 100%; height: auto; aspect-ratio: ${W} / ${H}; }
  .band-svg stop { transition: stop-color 2s ease; }
  .band .corner { position: absolute; bottom: 6px; display: inline-flex; align-items: center; gap: 3px; line-height: 1.2;
                  font-size: 12px; font-weight: 500; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.45); white-space: nowrap; }
  .band .corner .icon { width: 15px; height: 15px; color: #ffd27a; filter: drop-shadow(0 1px 1px rgba(0,0,0,.35)); }
  .band .corner.left { left: 10px; } .band .corner.right { right: 10px; }
  .band-svg .ground { fill: #000; opacity: .18; }
  .band-svg .horizon { stroke: rgba(255,255,255,.35); stroke-width: 1; }
  .band-svg .arc { fill: none; stroke: rgba(255,255,255,.55); stroke-width: 1.4; stroke-dasharray: 3 4; stroke-linecap: round; }
  .band-svg .arc.done { stroke: #fff3c4; stroke-width: 2.4; stroke-dasharray: 1; stroke-dashoffset: 0; opacity: .95;
                        animation: sk-draw 1.6s cubic-bezier(.3, .1, .3, 1) both; }
  .band-svg.p-night .arc.done, .band-svg.p-blue .arc.done { stroke: #c9d6ff; }
  .band-svg .end { fill: rgba(255,255,255,.7); }
  :is(.band-svg, .hs-svg) .body { offset-distance: 100%; offset-rotate: 0deg; animation: sk-travel 1.6s cubic-bezier(.3, .1, .3, 1) both; }
  :is(.band-svg, .hs-svg) .body.still-body { animation: none; }
  :is(.band-svg, .hs-svg) .glow { transform-box: fill-box; transform-origin: center; animation: sk-breathe 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .rays path { stroke: #ffd54f; stroke-width: 2.2; stroke-linecap: round; }
  :is(.band-svg, .hs-svg) .rays { animation: sk-spin 6s linear infinite; }
  :is(.band-svg, .hs-svg) .halo { animation: sk-halo 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .cloud { fill: #fff; opacity: .75; animation: sk-drift 6s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .cloud.late { animation-delay: -3s; }
  :is(.band-svg, .hs-svg) .golden .cloud { fill: #ffc9a3; opacity: .7; }
  :is(.band-svg, .hs-svg) .birds { transform: translate(-40px, 52px); animation: sk-fly 12s linear infinite; }
  :is(.band-svg, .hs-svg) .bird { fill: none; stroke: #2a3a5a; stroke-width: 1; stroke-linecap: round; opacity: .6;
                    transform-box: fill-box; transform-origin: center bottom; animation: sk-flap .5s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .bird.late { animation-delay: -.25s; }
  :is(.band-svg, .hs-svg) .reflect ellipse { fill: #ffcc80; opacity: .6; transform-box: fill-box; transform-origin: center; animation: sk-ripple 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .reflect .late { animation-delay: -1.5s; }
  :is(.band-svg, .hs-svg) .evening-star circle { fill: #fffde7; }
  :is(.band-svg, .hs-svg) .evening-star .v-glow { opacity: .25; transform-box: fill-box; transform-origin: center; animation: sk-breathe 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .veil ellipse { fill: #c9d6ff; opacity: .16; animation: sk-veil 6s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .horizon-glow { animation: sk-shimmer 3s ease-in-out infinite; }
  :is(.band-svg, .hs-svg) .shooting { fill: none; stroke: #fffde7; stroke-width: 1.4; stroke-linecap: round; stroke-dasharray: 10 60; stroke-dashoffset: 70;
                        animation: sk-shoot 6s linear infinite; }
  @keyframes sk-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes sk-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
  @keyframes sk-breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.82); opacity: .7; } }
  @keyframes sk-spin { to { transform: rotate(45deg); } }
  @keyframes sk-halo { 0%, 100% { opacity: .7; } 50% { opacity: 1; } }
  @keyframes sk-drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
  @keyframes sk-fly { 0% { transform: translate(-20px, 52px); } 50% { transform: translate(340px, 36px); } 100% { transform: translate(340px, 36px); } }
  @keyframes sk-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(-.4); } }
  @keyframes sk-ripple { 0%, 100% { transform: scaleX(.75); opacity: .35; } 50% { transform: scaleX(1.15); opacity: .7; } }
  @keyframes sk-veil { 0%, 100% { transform: translateX(-24px); } 50% { transform: translateX(24px); } }
  @keyframes sk-shimmer { 0%, 100% { opacity: .7; } 50% { opacity: 1; } }
  @keyframes sk-shoot { 0%, 70% { stroke-dashoffset: 70; opacity: 0; } 72% { opacity: 1; } 86% { stroke-dashoffset: -10; opacity: 0; } 100% { stroke-dashoffset: -10; opacity: 0; } }
`;

export const SEASON_STYLE = `
  .season-pic { width: 100%; height: 100%; overflow: visible; }
  .s-spring .stem { stroke: #66bb6a; stroke-width: 2.4; stroke-linecap: round; fill: none; }
  .s-spring .leaf-s { fill: #81c784; }
  .s-spring .petal { fill: #f48fb1; }
  .s-spring .heart { fill: #ffd54f; }
  .s-spring .flower { transform-origin: 24px 44px; animation: sk-sway 3s ease-in-out infinite; }
  .s-summer .s-glow { fill: #ffd54f; opacity: .22; transform-origin: 24px 24px; animation: sk-breathe 3s ease-in-out infinite; }
  .s-summer .s-rays path { stroke: #ffb300; stroke-width: 2.6; stroke-linecap: round; }
  .s-summer .s-rays { transform-origin: 24px 24px; animation: sk-spin 6s linear infinite; }
  .s-summer .s-disc { fill: #ffc107; }
  .s-autumn .leaf-a { fill: #ef6c00; }
  .s-autumn .vein { stroke: #ffcc80; stroke-width: 1.4; stroke-linecap: round; }
  .s-autumn .big-leaf { transform-origin: 24px 40px; animation: sk-sway 3s ease-in-out infinite; }
  .s-autumn .fall { fill: #f9a825; transform-box: fill-box; transform-origin: center; animation: sk-fall 3s ease-in infinite; }
  .s-autumn .fall.late { fill: #d84315; animation-delay: -1.5s; }
  .s-winter .flake path { stroke: #64b5f6; stroke-width: 2; stroke-linecap: round; fill: none; }
  .s-winter .flake { transform-origin: 24px 24px; animation: sk-spin60 6s linear infinite; }
  .s-winter .snow { fill: #90caf9; animation: sk-snow 3s linear infinite; }
  .s-winter .snow.late { animation-delay: -1.5s; }
  @keyframes sk-sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  @keyframes sk-fall { 0% { transform: translate(0, -4px) rotate(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(4px, 30px) rotate(160deg); opacity: 0; } }
  @keyframes sk-snow { 0% { transform: translateY(-4px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(40px); opacity: 0; } }
  @keyframes sk-spin60 { to { transform: rotate(60deg); } }
`;

export const FULL_STYLE = `
  .content { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .tile { display: grid; grid-template-columns: 34px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px; border-radius: 12px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .tile .pic { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%;
               background: color-mix(in srgb, var(--c, var(--sk-accent)) 14%, transparent); }
  .tile .pic .icon { width: 20px; height: 20px; fill: color-mix(in srgb, var(--c, var(--sk-accent)) 75%, var(--primary-text-color)); }
  .tile .pic .moon-pic, .tile .pic .season-pic { width: 26px; height: 26px; }
  .tile .k { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .v { font-size: 15px; font-weight: 500; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .s { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tile .s.longer { color: color-mix(in srgb, var(--sk-day) 60%, var(--primary-text-color)); }
  .tile .s.shorter { color: color-mix(in srgb, var(--sk-blue) 60%, var(--primary-text-color)); }
  .t-moon { --c: #9fa8da; } .t-dawn { --c: var(--sk-golden); }
  .tile .tw .tw-sun { animation: sk-rise 6s ease-in-out infinite; }
  .tile .tw .tw-rays { animation: sk-rays 6s ease-in-out infinite; }
  @keyframes sk-rise { 0%, 100% { transform: translateY(2.5px); } 50% { transform: translateY(0); } }
  @keyframes sk-rays { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }
  .season-spring { --c: #66bb6a; } .season-summer { --c: #ffb300; } .season-autumn { --c: #ef6c00; } .season-winter { --c: #42a5f5; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); padding: 2px 0; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .details { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; margin-top: 8px; }
  .detail { display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: 10px; min-width: 0;
            background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .detail .k { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .detail .v { font-size: 13px; font-weight: 500; line-height: 1.35; overflow-wrap: anywhere; }
  .detail .v small { font-size: 11px; font-weight: 400; color: var(--secondary-text-color); }
  @container (max-width: 300px) {
    .tile { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 8px; }
    .tile .pic { width: 28px; height: 28px; }
    .tile .pic .moon-pic, .tile .pic .season-pic { width: 22px; height: 22px; }
    .tile .v { font-size: 14px; }
    .tile .s { white-space: normal; }
    .band .corner { font-size: 11px; bottom: 4px; }
    .band .corner .icon { width: 13px; height: 13px; }
  }
`;

export const MINI_STYLE = `
  :host { --sk-natural-width: 320px; }
  .content { padding: 10px 12px 12px; }
  .mini { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; }
  .mini .t { display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
  .mini .t .icon { width: 16px; height: 16px; color: var(--sk-golden); }
  .strip { position: relative; flex: 1 1 auto; min-width: 40px; height: 24px; border-radius: 12px; overflow: hidden; }
  .strip-stars { position: absolute; inset: 0; width: 100%; height: 100%; }
  .strip .track { position: absolute; left: 10px; right: 10px; top: 11.5px; height: 1px; background: rgba(255,255,255,.45); }
  .strip .track.done { right: auto; height: 2px; top: 11px; background: #fff3c4; }
  .strip.p-night .track.done, .strip.p-blue .track.done { background: #c9d6ff; }
  .strip .dot-body { position: absolute; top: 5px; width: 14px; height: 14px; margin-left: -7px; overflow: visible; transition: left 1s ease; }
  .strip .dot-body.sun { animation: sk-sunpulse 3s ease-in-out infinite; }
  .strip .dot-body.moon { animation: sk-moonpulse 3s ease-in-out infinite; }
  @keyframes sk-sunpulse { 0%, 100% { filter: drop-shadow(0 0 1px #ffd54f); } 50% { filter: drop-shadow(0 0 4px #ffd54f); } }
  @keyframes sk-moonpulse { 0%, 100% { filter: drop-shadow(0 0 1px #fff9c4); } 50% { filter: drop-shadow(0 0 3px #fff9c4); } }
  .mini .sunrow { display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; border-radius: 12px; }
  .mini .mm { flex: none; width: 24px; height: 24px; }
  @container (max-width: 230px) {
    .mini .t .icon { display: none; }
    .mini { gap: 6px; font-size: 12px; }
  }
`;

// The banner's ground strip (the lawn), that the title block keeps clear of, and the gap between the title and the
// status pill on its row (.trow).
export const PILL_GROUND_PX = 10;
export const PILL_GAP_PX = 8;

// The illustrated header: 90 px high, the title on the sky at its left, the scene at its right standing on a 10 px
// lawn strip drawn edge to edge, day and night. Its sky is tinted by the phase (golden, blue hour).
export const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; color: #0d2a45; --sk-sub: #3b5b78; --sk-scene-w: min(200px, 62%);
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.p-golden { background: linear-gradient(90deg, #f4f8ff 0%, #e6f0fb 34%, #f5ddc4 72%, #f7c89a 100%); }
  .banner.p-blue { background: linear-gradient(90deg, #eff1fc 0%, #dfe4f8 34%, #c5c8ee 72%, #b2b3e2 100%); }
  .banner.p-night { background: linear-gradient(90deg, #eceffa 0%, #d9def3 34%, #b4bde3 72%, #9aa5d4 100%); }
  .banner.night { color: #fff; --sk-sub: rgba(255,255,255,.78);
                  background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .banner.night.p-blue { background: linear-gradient(90deg, #22355e 0%, #1f2f58 36%, #262d5e 72%, #33326a 100%); }
  .banner.night.p-golden { background: linear-gradient(90deg, #1f3054 0%, #1d2b4c 36%, #3a2f4a 72%, #5a3a46 100%); }
  .hs-svg { position: absolute; right: 0; bottom: 10px; width: var(--sk-scene-w); height: calc(100% - 10px); overflow: hidden; }
  .hs-svg .hs-arc { fill: none; stroke: #fff; stroke-width: 1; stroke-dasharray: 2 3; opacity: .9; }
  .hs-svg .hs-arc.done { stroke: #fff3c4; stroke-width: 1.6; stroke-dasharray: none; }
  .night .hs-svg .hs-arc { stroke: #4a5a7a; opacity: 1; }
  .night .hs-svg .hs-arc.done { stroke: #8fa2cc; }
  .hs-svg .hs-hill.far { fill: #a7d39f; } .hs-svg .hs-hill { fill: #86c27f; } .hs-svg .hs-peaks { fill: #9cc3a0; }
  .night .hs-svg .hs-hill.far { fill: #1d3a4a; } .night .hs-svg .hs-hill { fill: #17303d; } .night .hs-svg .hs-peaks { fill: #22324d; }
  .night .hs-svg .cloud { opacity: .14; }
  .lawn { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: repeating-linear-gradient(90deg, #5aa83d 0 22px, #6cbb4c 22px 44px); }
  .night .lawn { background: repeating-linear-gradient(90deg, #1f4a2a 0 22px, #245433 22px 44px); }
  /* The text may run over the scene's open left edge (x < 30 of 200: sky and the foot of the arc). */
  .htext { position: absolute; z-index: 1; left: 12px; top: 0; bottom: 10px; right: calc(var(--sk-scene-w) * .85);
           display: flex; align-items: center; gap: 10px; min-width: 0; }
  .banner .titles { min-height: 0; gap: 1px; }
  .banner .name { font-size: 16px; font-weight: 500; }
  .banner .chip { line-height: 16px;
                  background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
  .banner .chip .dot { width: 7px; height: 7px; }
  .banner .titles.pill-dot .chip { padding: 5px; }
  @container (max-width: 200px) { .banner .chip { padding: 5px; } }
  .banner .sub { font-size: 13px; line-height: 17px; color: var(--sk-sub); }
  .banner .type-icon { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(47,128,237,.18); }
  .banner.night .type-icon { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .banner .type-icon .icon { fill: color-mix(in srgb, var(--c) 82%, #0d2a45); }
  .banner.night .type-icon .icon { fill: color-mix(in srgb, var(--c) 70%, #fff); }
  /* The mini card's detail button: round, frosted, in the top right corner of the banner. */
  .banner .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; margin: 0; border: none; color: #33506b; background: rgba(255,255,255,.55);
                  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); backdrop-filter: blur(4px); }
  .banner .zoom .icon { width: 16px; height: 16px; }
  .banner .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }
  .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner.night .zoom:hover { background: rgba(255,255,255,.22); color: #fff; }
  /* Narrow card: the scene shrinks so that the title keeps its room, then only the sky and the lawn stay. */
  @container (max-width: 400px) { .banner { --sk-scene-w: 46%; } }
  @container (max-width: 300px) { .hs-svg { display: none; } .htext { right: 12px; } .banner:has(.zoom) .htext { right: 34px; } .banner .sub { font-size: 12px; } }
`;
