// content/content.js

let pickerActive = false;
let overlay = null;
let label = null;
let currentTarget = null;
let hoverBlocked = false;

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

  } else {
    sendResponse({ error: `Unknown action: ${msg.action}` });
  }
});
