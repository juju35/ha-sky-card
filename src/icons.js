// ---------------------------------------------------------------------------
// Icons (24 × 24): inner SVG markup
// ---------------------------------------------------------------------------

export const ICONS = {
  sunrise: '<path d="M2 18h20v2H2zm5-1a5 5 0 0 1 10 0h-2a3 3 0 0 0-6 0zm5-15 4 4h-3v4h-2V6H8z"/>',
  sunset: '<path d="M2 18h20v2H2zm5-1a5 5 0 0 1 10 0h-2a3 3 0 0 0-6 0zm5-6-4-4h3V3h2v4h3z"/>',
  twilight: '<path d="M2 18h20v2H2zm4-1a6 6 0 0 1 12 0zM3.5 10.9l1.4-1.4 1.8 1.8-1.4 1.4zm17 0-1.4-1.4-1.8 1.8 1.4 1.4zM11 5h2v3.2h-2z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M11 1.5h2v3h-2zm0 18h2v3h-2zM1.5 11h3v2h-3zm18 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zm12.1-12.1 2.1-2.1 1.4 1.4-2.1 2.1z"/>',
  moon: '<path d="M12.3 2.5a9.5 9.5 0 1 0 9.2 11.8A7.5 7.5 0 0 1 12.3 2.5z"/>',
  calendar: '<path fill-rule="evenodd" d="M6 2h2v2h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1zM5 9v11h14V9z"/>',
  chevron_down: '<path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/>',
  expand: '<path d="M10 21v-2H6.41l4.5-4.5-1.41-1.41-4.5 4.5V14H3v7zm4.5-10.09 4.5-4.5V10h2V3h-7v2h3.59l-4.5 4.5z"/>',
  collapse: '<path d="M19.5 3.09 15 7.59V4h-2v7h7V9h-3.59l4.5-4.5zM4 13v2h3.59l-4.5 4.5 1.41 1.41L9 16.41V20h2v-7z"/>',
};

// The dawn · dusk tile's icon: the half sun rising and setting on the horizon, its rays coming and going.
export const TWILIGHT_ANIM =
  '<svg class="icon tw" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 18h20v2H2z"/><path class="tw-sun" d="M6 17a6 6 0 0 1 12 0z"/>' +
  '<path class="tw-rays" d="M3.5 10.9l1.4-1.4 1.8 1.8-1.4 1.4zm17 0-1.4-1.4-1.8 1.8 1.4 1.4zM11 5h2v3.2h-2z"/></svg>';
export const svgIcon = (name, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
