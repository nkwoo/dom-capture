// content/content.js

let pickerActive = false;
let overlay = null;
let label = null;
let currentTarget = null;

function createOverlay() {
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
  if (!pickerActive || !currentTarget) return;
  e.preventDefault();
  e.stopPropagation();

  const rect = currentTarget.getBoundingClientRect();
  const result = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  };

  deactivatePicker();
  chrome.runtime.sendMessage({ action: 'ELEMENT_SELECTED', rect: result });
}

function onKeyDown(e) {
  if (e.key === 'Escape' && pickerActive) {
    deactivatePicker();
  }
}

function activatePicker() {
  pickerActive = true;
  createOverlay();
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onMouseClick, true);
  document.addEventListener('keydown', onKeyDown, true);
  document.body.style.cursor = 'crosshair';
}

function deactivatePicker() {
  pickerActive = false;
  removeOverlay();
  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('click', onMouseClick, true);
  document.removeEventListener('keydown', onKeyDown, true);
  document.body.style.cursor = '';
  currentTarget = null;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'ACTIVATE_PICKER') {
    activatePicker();
    sendResponse({ ok: true });
  } else if (msg.action === 'DEACTIVATE_PICKER') {
    deactivatePicker();
    sendResponse({ ok: true });
  }
  return true;
});
