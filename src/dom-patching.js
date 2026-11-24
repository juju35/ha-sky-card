// ---------------------------------------------------------------------------
// DOM patching, folding back, presses
// ---------------------------------------------------------------------------

// Patches `root` to the markup `html` in place: elements that stay keep their identity, so that their CSS
// animations go on instead of restarting (and the focus stays where it is).
export const morphNode = (from, to) => {
  if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) {
    from.replaceWith(to);
    return;
  }
  if (from.nodeType !== 1) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
    return;
  }
  for (const a of [...from.attributes]) if (!to.hasAttribute(a.name)) from.removeAttribute(a.name);
  for (const a of [...to.attributes]) if (from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value);
  morphChildren(from, to);
};
export const morphChildren = (from, to) => {
  const a = [...from.childNodes];
  const b = [...to.childNodes];
  b.forEach((node, i) => {
    if (a[i]) morphNode(a[i], node);
    else from.appendChild(node);
  });
  for (let i = b.length; i < a.length; i++) a[i].remove();
};
export const morph = (root, html) => {
  if (!root.childNodes?.length || typeof document.createElement("template").content === "undefined") {
    root.innerHTML = html;
    return;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  morphChildren(root, tpl.content);
};

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
export const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
export const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere", caught on the pointer: on iOS a tap on something that is not clickable sends no click to the
// page. It counts when both the press and the release are outside the card; keyboard clicks come as click events.
export const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

// No rewrite between a press and its click: a render arriving meanwhile is left pending (`_dirty`) and drawn at the
// click, or right after the release when no click follows (a drag, a scroll).
export const holdUnderPress = (card, render) => {
  const root = card.shadowRoot;
  const release = () => {
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
  };
  card._onPressEnd = () => {
    release();
    setTimeout(() => {
      card._pressing = false;
      if (!card._dirty) return;
      card._dirty = false;
      render();
    }, 0);
  };
  card._dropPress = () => {
    card._pressing = false;
    card._dirty = false;
    release();
  };
  root.addEventListener?.("pointerdown", () => {
    card._pressing = true;
    window.addEventListener?.("pointerup", card._onPressEnd, true);
    window.addEventListener?.("pointercancel", card._onPressEnd, true);
  });
  card._pressClick = () => {
    card._pressing = false;
  };
  root.addEventListener?.("click", card._pressClick, true);
};

export const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);
export const DETAILS = ["collapsed", "expanded", "hidden"];
