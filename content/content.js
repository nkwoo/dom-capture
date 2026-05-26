// content/content.js

let pickerActive = false;
let overlay = null;
let label = null;
let currentTarget = null;
let hoverBlocked = false;

// Region capture state
let regionActive = false;
let regionState = 'idle'; // 'idle' | 'drawing' | 'adjusting'
let regionRect = { x: 0, y: 0, w: 0, h: 0 };
let regionDragStart = null;
let regionDragHandle = null;
let regionMask = null;
let regionSel = null;
let regionConfirm = null;

function createOverlay() {
  if (overlay) removeOverlay();
  overlay = document.createElement('div');
  overlay.id = 'dom-capture-overlay';
  document.body.appendChild(overlay);

  label = document.createElement('div');
  label.id = 'dom-capture-label';
  document.body.appendChild(label);
}

function removeOverlay() {
  if (overlay) { overlay.remove(); overlay = null; }
  if (label) { label.remove(); label = null; }
}

function createRegionOverlay() {
  if (regionMask) removeRegionOverlay();

  regionMask = document.createElement('div');
  regionMask.id = 'dom-capture-region-mask';
  document.body.appendChild(regionMask);

  regionSel = document.createElement('div');
  regionSel.id = 'dom-capture-region-sel';
  regionSel.style.display = 'none';
  for (const dir of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) {
    const h = document.createElement('div');
    h.className = 'dom-capture-region-handle';
    h.dataset.dir = dir;
    regionSel.appendChild(h);
  }
  document.body.appendChild(regionSel);

  regionConfirm = document.createElement('button');
  regionConfirm.id = 'dom-capture-region-confirm';
  regionConfirm.textContent = chrome.i18n.getMessage('btn_region_confirm') || 'Capture';
  regionConfirm.style.display = 'none';
  document.body.appendChild(regionConfirm);
}

function removeRegionOverlay() {
  if (regionMask)    { regionMask.remove();    regionMask = null;    }
  if (regionSel)     { regionSel.remove();     regionSel = null;     }
  if (regionConfirm) { regionConfirm.remove(); regionConfirm = null; }
}

function applyRegionRect() {
  if (!regionSel) return;
  const { x, y, w, h } = regionRect;
  regionSel.style.left   = `${x}px`;
  regionSel.style.top    = `${y}px`;
  regionSel.style.width  = `${w}px`;
  regionSel.style.height = `${h}px`;
  regionSel.style.display = 'block';

  if (regionConfirm && regionConfirm.style.display !== 'none') {
    const gap  = 6;
    const btnH = 28;
    const spaceBelow = window.innerHeight - (y + h);
    regionConfirm.style.top  = spaceBelow >= btnH + gap
      ? `${y + h + gap}px`
      : `${y - btnH - gap}px`;
    regionConfirm.style.left = `${x + w / 2}px`;
  }
}

function regionClamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function onRegionMouseDown(e) {
  if (!regionActive) return;
  if (e.target === regionConfirm) return;
  e.preventDefault();
  e.stopPropagation();

  if (regionState === 'adjusting') {
    if (e.target.classList.contains('dom-capture-region-handle')) {
      regionDragHandle = e.target.dataset.dir;
      regionDragStart  = { x: e.clientX, y: e.clientY, rect: { ...regionRect } };
      return;
    }
    if (e.target === regionSel || regionSel.contains(e.target)) {
      regionDragHandle = 'move';
      regionDragStart  = { x: e.clientX, y: e.clientY, rect: { ...regionRect } };
      return;
    }
  }

  // Start (or restart) drawing
  regionState      = 'drawing';
  regionDragHandle = null;
  regionDragStart  = { x: e.clientX, y: e.clientY };
  regionRect       = { x: e.clientX, y: e.clientY, w: 0, h: 0 };
  if (regionSel)     regionSel.style.display     = 'none';
  if (regionConfirm) regionConfirm.style.display = 'none';
}

function onRegionMouseMove(e) {
  if (!regionActive || !regionDragStart) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (regionState === 'drawing') {
    const x2 = regionClamp(e.clientX, 0, vw);
    const y2 = regionClamp(e.clientY, 0, vh);
    regionRect = {
      x: Math.min(regionDragStart.x, x2),
      y: Math.min(regionDragStart.y, y2),
      w: Math.abs(x2 - regionDragStart.x),
      h: Math.abs(y2 - regionDragStart.y),
    };
    applyRegionRect();
    return;
  }

  if (regionState === 'adjusting') {
    const dx   = e.clientX - regionDragStart.x;
    const dy   = e.clientY - regionDragStart.y;
    const orig = regionDragStart.rect;
    let { x, y, w, h } = orig;

    if (regionDragHandle === 'move') {
      x = regionClamp(orig.x + dx, 0, vw - orig.w);
      y = regionClamp(orig.y + dy, 0, vh - orig.h);
    } else {
      const dir = regionDragHandle;
      if (dir.includes('e')) { w = regionClamp(orig.w + dx, 4, vw - orig.x); }
      if (dir.includes('s')) { h = regionClamp(orig.h + dy, 4, vh - orig.y); }
      if (dir.includes('w')) {
        const nx = regionClamp(orig.x + dx, 0, orig.x + orig.w - 4);
        w = orig.x + orig.w - nx;
        x = nx;
      }
      if (dir.includes('n')) {
        const ny = regionClamp(orig.y + dy, 0, orig.y + orig.h - 4);
        h = orig.y + orig.h - ny;
        y = ny;
      }
    }
    regionRect = { x, y, w, h };
    applyRegionRect();
  }
}

function onRegionMouseUp() {
  if (!regionActive) return;
  if (regionState === 'drawing' && regionRect.w >= 4 && regionRect.h >= 4) {
    regionState = 'adjusting';
    if (regionConfirm) {
      regionConfirm.style.display = 'block';
      applyRegionRect();
    }
  }
  regionDragStart  = null;
  regionDragHandle = null;
}

function onRegionKeyDown(e) {
  if (!regionActive) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    deactivateRegion();
  } else if (e.key === 'Enter' && regionState === 'adjusting') {
    e.stopPropagation();
    confirmRegionCapture();
  }
}

function confirmRegionCapture() {
  const rect = {
    left:   regionRect.x,
    top:    regionRect.y,
    width:  regionRect.w,
    height: regionRect.h,
  };
  deactivateRegion();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    chrome.runtime.sendMessage({ action: 'REGION_SELECTED', rect });
  }));
}

function activateRegion() {
  if (regionActive) deactivateRegion();
  regionActive     = true;
  regionState      = 'idle';
  regionRect       = { x: 0, y: 0, w: 0, h: 0 };
  regionDragStart  = null;
  regionDragHandle = null;
  createRegionOverlay();
  document.addEventListener('mousedown', onRegionMouseDown, true);
  document.addEventListener('mousemove', onRegionMouseMove, true);
  document.addEventListener('mouseup',   onRegionMouseUp,   true);
  document.addEventListener('keydown',   onRegionKeyDown,   true);
  regionConfirm.addEventListener('click', confirmRegionCapture);
}

function deactivateRegion() {
  regionActive     = false;
  regionState      = 'idle';
  regionDragStart  = null;
  regionDragHandle = null;
  document.removeEventListener('mousedown', onRegionMouseDown, true);
  document.removeEventListener('mousemove', onRegionMouseMove, true);
  document.removeEventListener('mouseup',   onRegionMouseUp,   true);
  document.removeEventListener('keydown',   onRegionKeyDown,   true);
  removeRegionOverlay();
}

function getElementLabel(el) {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const cls = el.classList.length
    ? `.${Array.from(el.classList).slice(0, 2).join('.')}`
    : '';
  return `${tag}${id}${cls}`;
}

function onMouseMove(e) {
  if (!pickerActive) return;
  const el = e.target;
  if (el === overlay || el === label) return;
  currentTarget = el;

  const rect = el.getBoundingClientRect();
  overlay.style.left = `${rect.left}px`;
  overlay.style.top = `${rect.top}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;

  label.textContent = getElementLabel(el);
  label.style.left = `${rect.left}px`;
  label.style.top = `${Math.max(0, rect.top - 20)}px`;
}

function onMouseClick(e) {
  if (!pickerActive || !currentTarget || !document.contains(currentTarget)) return;
  e.preventDefault();
  e.stopPropagation();

  const result = { ...getElementRect(currentTarget), selector: generateCSSSelector(currentTarget) };

  deactivatePicker(true);
  // Two rAFs ensure the overlay removal is painted before captureVisibleTab() fires
  requestAnimationFrame(() => requestAnimationFrame(() => {
    chrome.runtime.sendMessage({ action: 'ELEMENT_SELECTED', rect: result });
  }));
}

function onKeyDown(e) {
  if (e.key === 'Escape' && pickerActive) {
    e.stopPropagation();
    deactivatePicker();
  }
}

function onHoverEvent(e) {
  if (!pickerActive && !hoverBlocked) return;
  e.stopPropagation();
}

function unblockHover() {
  hoverBlocked = false;
  document.removeEventListener('mouseover', onHoverEvent, true);
  document.removeEventListener('mouseout', onHoverEvent, true);
}

function resolveByCSS(selector) {
  try {
    return document.querySelector(selector) || null;
  } catch (_) {
    return null;
  }
}

function resolveByXPath(xpath) {
  try {
    const result = document.evaluate(
      xpath, document, null,
      XPathResult.FIRST_ORDERED_NODE_TYPE, null
    );
    return result.singleNodeValue || null;
  } catch (_) {
    return null;
  }
}

function generateCSSSelector(el) {
  if (el.id) return '#' + CSS.escape(el.id);

  const parts = [];
  let current = el;
  while (current && current !== document.body && current !== document.documentElement) {
    if (current.id) {
      parts.push('#' + CSS.escape(current.id));
      break;
    }
    let part = current.tagName.toLowerCase();
    if (current.classList.length > 0) {
      part += '.' + Array.from(current.classList).slice(0, 2).map(c => CSS.escape(c)).join('.');
    }
    const parent = current.parentElement;
    if (parent) {
      let sameTagCount = 0, currentIdx = 0;
      for (const child of parent.children) {
        if (child.tagName === current.tagName) {
          sameTagCount++;
          if (child === current) currentIdx = sameTagCount;
        }
      }
      if (sameTagCount > 1) part += ':nth-of-type(' + currentIdx + ')';
    }
    parts.push(part);
    current = current.parentElement;
  }
  parts.reverse();
  const selector = parts.join(' > ');
  if (resolveByCSS(selector) !== el) return '';
  return selector;
}

function getElementRect(el) {
  const rect = el.getBoundingClientRect();
  return {
    absLeft: rect.left + window.scrollX,
    absTop: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
}

function getPageDimensions() {
  return {
    totalHeight: Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    ),
    totalWidth: Math.max(
      document.documentElement.scrollWidth,
      document.body ? document.body.scrollWidth : 0
    ),
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
  };
}

let scrollbarStyleEl = null;

function hideScrollbar() {
  if (scrollbarStyleEl) return;
  scrollbarStyleEl = document.createElement('style');
  scrollbarStyleEl.id = 'dom-capture-scrollbar-hide';
  // overflow 변경 없이 스크롤바만 숨김 — overflow:hidden은 scrollHeight를 망가뜨림
  scrollbarStyleEl.textContent =
    '::-webkit-scrollbar{display:none!important}' +
    '*{scrollbar-width:none!important}';
  document.head.appendChild(scrollbarStyleEl);
}

function restoreScrollbar() {
  if (scrollbarStyleEl) {
    scrollbarStyleEl.remove();
    scrollbarStyleEl = null;
  }
}

let hiddenFixedElements = [];

function hideFixedElements() {
  const alreadyHidden = new Set(hiddenFixedElements.map(item => item.el));
  document.querySelectorAll('*').forEach(el => {
    if (alreadyHidden.has(el)) return;
    const pos = window.getComputedStyle(el).position;
    if (pos === 'fixed' || pos === 'sticky') {
      hiddenFixedElements.push({ el, visibility: el.style.visibility });
      el.style.visibility = 'hidden';
    }
  });
}

function restoreFixedElements() {
  hiddenFixedElements.forEach(({ el, visibility }) => {
    if (document.contains(el)) {
      el.style.visibility = visibility;
    }
  });
  hiddenFixedElements = [];
}

function activatePicker() {
  if (pickerActive) deactivatePicker();
  pickerActive = true;
  hoverBlocked = false;
  createOverlay();
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onMouseClick, true);
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mouseover', onHoverEvent, true);
  document.addEventListener('mouseout', onHoverEvent, true);
  document.body.style.cursor = 'crosshair';
}

function deactivatePicker(keepHoverBlocked = false) {
  pickerActive = false;
  hoverBlocked = keepHoverBlocked;
  removeOverlay();
  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('click', onMouseClick, true);
  document.removeEventListener('keydown', onKeyDown, true);
  document.body.style.cursor = '';
  currentTarget = null;
  if (!keepHoverBlocked) {
    document.removeEventListener('mouseover', onHoverEvent, true);
    document.removeEventListener('mouseout', onHoverEvent, true);
  }
}

window.addEventListener('pagehide', unblockHover);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'ACTIVATE_PICKER') {
    activatePicker();
    sendResponse({ ok: true });

  } else if (msg.action === 'DEACTIVATE_PICKER') {
    deactivatePicker();
    sendResponse({ ok: true });

  } else if (msg.action === 'FIND_ELEMENT') {
    const el = msg.selectorType === 'xpath'
      ? resolveByXPath(msg.selector)
      : resolveByCSS(msg.selector);
    if (!el) {
      sendResponse({ error: chrome.i18n.getMessage('error_element_not_found') });
    } else {
      sendResponse({ rect: getElementRect(el) });
    }

  } else if (msg.action === 'GET_PAGE_DIMENSIONS') {
    sendResponse(getPageDimensions());

  } else if (msg.action === 'SCROLL_TO') {
    const top = msg.y !== undefined ? msg.y : window.scrollY;
    const left = msg.x !== undefined ? msg.x : window.scrollX;
    window.scrollTo({ top, left, behavior: 'instant' });
    setTimeout(() => sendResponse({ ok: true }), 200);
    return true;

  } else if (msg.action === 'GET_SCROLL_POSITION') {
    sendResponse({ x: window.scrollX, y: window.scrollY });

  } else if (msg.action === 'UNBLOCK_HOVER') {
    unblockHover();
    sendResponse({ ok: true });

  } else if (msg.action === 'HIDE_FIXED') {
    hideFixedElements();
    sendResponse({ ok: true });

  } else if (msg.action === 'RESTORE_FIXED') {
    restoreFixedElements();
    sendResponse({ ok: true });

  } else if (msg.action === 'HIDE_SCROLLBAR') {
    hideScrollbar();
    sendResponse({ ok: true });

  } else if (msg.action === 'RESTORE_SCROLLBAR') {
    restoreScrollbar();
    sendResponse({ ok: true });

  } else if (msg.action === 'ACTIVATE_REGION') {
    activateRegion();
    sendResponse({ ok: true });

  } else if (msg.action === 'DEACTIVATE_REGION') {
    deactivateRegion();
    sendResponse({ ok: true });

  } else {
    sendResponse({ error: `Unknown action: ${msg.action}` });
  }
});
