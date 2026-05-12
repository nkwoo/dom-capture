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

async function captureViewport() {
  return captureTab();
}

async function captureFullPage(tabId) {
  const dims = await sendToTab(tabId, { action: 'GET_PAGE_DIMENSIONS' });
  const { totalHeight, viewportHeight, viewportWidth } = dims;
  const dpr = await getDevicePixelRatio(tabId);

  await sendToTab(tabId, { action: 'HIDE_FIXED' });

  const canvas = new OffscreenCanvas(
    Math.round(viewportWidth * dpr),
    Math.round(totalHeight * dpr)
  );
  const ctx = canvas.getContext('2d');

  let y = 0;
  while (y < totalHeight) {
    await sendToTab(tabId, { action: 'SCROLL_TO', y });

    const dataUrl = await captureTab();
    const imgBlob = await (await fetch(dataUrl)).blob();
    const img = await createImageBitmap(imgBlob);

    const remaining = totalHeight - y;
    const sliceHeight = Math.min(viewportHeight, remaining);
    // 마지막 조각은 뷰포트 하단부터 잘라야 하므로 srcY 조정
    const srcY = remaining < viewportHeight
      ? Math.round((viewportHeight - remaining) * dpr)
      : 0;

    ctx.drawImage(
      img,
      0, srcY,
      Math.round(viewportWidth * dpr),
      Math.round(sliceHeight * dpr),
      0, Math.round(y * dpr),
      Math.round(viewportWidth * dpr),
      Math.round(sliceHeight * dpr)
    );

    y += sliceHeight;
  }

  await sendToTab(tabId, { action: 'RESTORE_FIXED' });
  await sendToTab(tabId, { action: 'SCROLL_TO', y: 0 });

  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return blobToDataUrl(blob);
}
