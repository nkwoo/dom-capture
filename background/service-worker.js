// background/service-worker.js

function captureTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(dataUrl);
      }
    });
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function cropDataUrl(dataUrl, rect, dpr) {
  const blob = await (await fetch(dataUrl)).blob();
  const img = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(
    Math.round(rect.width * dpr),
    Math.round(rect.height * dpr)
  );
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    img,
    Math.round(rect.left * dpr),
    Math.round(rect.top * dpr),
    Math.round(rect.width * dpr),
    Math.round(rect.height * dpr),
    0, 0,
    Math.round(rect.width * dpr),
    Math.round(rect.height * dpr)
  );
  const outBlob = await canvas.convertToBlob({ type: 'image/png' });
  return blobToDataUrl(outBlob);
}

async function getDevicePixelRatio(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => window.devicePixelRatio,
  });
  return results[0].result || 1;
}

async function captureElement(tabId, rect) {
  const dpr = await getDevicePixelRatio(tabId);
  const dataUrl = await captureTab();
  return cropDataUrl(dataUrl, rect, dpr);
}

function sendToTab(tabId, msg) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, msg, resolve);
  });
}

function isUnsupportedTab(tab) {
  if (!tab) return true;
  const url = tab.url || '';
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('devtools://') ||
    url.startsWith('about:') ||
    url === ''
  );
}
