importScripts('../lib/jspdf.min.js');
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureViewport() {
  return captureTab();
}

async function captureFullPage(tabId) {
  const origin = await sendToTab(tabId, { action: 'GET_SCROLL_POSITION' });
  const dims = await sendToTab(tabId, { action: 'GET_PAGE_DIMENSIONS' });
  const { totalHeight, viewportHeight, viewportWidth } = dims;
  const dpr = await getDevicePixelRatio(tabId);

  await sendToTab(tabId, { action: 'HIDE_FIXED' });
  await sendToTab(tabId, { action: 'HIDE_SCROLLBAR' });

  const canvas = new OffscreenCanvas(
    Math.round(viewportWidth * dpr),
    Math.round(totalHeight * dpr)
  );
  const ctx = canvas.getContext('2d');

  // Chrome limits captureVisibleTab to 2 calls/sec. Enforce ≥ 600ms between calls.
  const CAPTURE_INTERVAL = 600;
  let lastCaptureTime = 0;

  let y = 0;
  while (y < totalHeight) {
    await sendToTab(tabId, { action: 'SCROLL_TO', y });

    const elapsed = Date.now() - lastCaptureTime;
    if (elapsed < CAPTURE_INTERVAL) {
      await sleep(CAPTURE_INTERVAL - elapsed);
    }

    const dataUrl = await captureTab();
    lastCaptureTime = Date.now();
    const imgBlob = await (await fetch(dataUrl)).blob();
    const img = await createImageBitmap(imgBlob);

    const remaining = totalHeight - y;
    const sliceHeight = Math.min(viewportHeight, remaining);
    // 마지막 조각은 뷰포트 하단부터 잘라야 하므로 srcY 조정
    const srcY = (y > 0 && remaining < viewportHeight)
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

  await sendToTab(tabId, { action: 'RESTORE_SCROLLBAR' });
  await sendToTab(tabId, { action: 'RESTORE_FIXED' });
  await sendToTab(tabId, { action: 'SCROLL_TO', y: origin.y });

  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return blobToDataUrl(blob);
}

async function reopenUI(tabId) {
  // 방법 1: chrome.action.openPopup() — Chrome 127+
  if (typeof chrome.action.openPopup === 'function') {
    try {
      await chrome.action.openPopup();
      return;
    } catch (_) {
      // 미지원 또는 실패, 다음 방법 시도
    }
  }

  // 방법 3: chrome.sidePanel.open() — Chrome 114+
  if (chrome.sidePanel && typeof chrome.sidePanel.open === 'function') {
    try {
      await chrome.sidePanel.open({ tabId });
      return;
    } catch (_) {
      // 미지원 또는 실패, 다음 방법 시도
    }
  }

  // 방법 2: 배지 표시 — 모든 버전
  await chrome.action.setBadgeText({ text: '✓' });
  await chrome.action.setBadgeBackgroundColor({ color: '#16a34a' });
}

function downloadDataUrl(dataUrl, filename) {
  return new Promise((resolve, reject) => {
    chrome.downloads.download({ url: dataUrl, filename, saveAs: false }, (downloadId) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(downloadId);
      }
    });
  });
}

async function dataUrlToPdfDataUrl(dataUrl) {
  const imgBlob = await (await fetch(dataUrl)).blob();
  const img = await createImageBitmap(imgBlob);
  const { width, height } = img;
  const orientation = width > height ? 'l' : 'p';
  const { jsPDF } = jspdf;
  const pdf = new jsPDF({ orientation, unit: 'px', format: [width, height] });
  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  return pdf.output('datauristring');
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      const CAPTURE_ACTIONS = ['ACTIVATE_PICKER', 'CAPTURE_ELEMENT', 'CAPTURE_VIEWPORT', 'CAPTURE_FULL_PAGE'];

      if (CAPTURE_ACTIONS.includes(msg.action)) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (isUnsupportedTab(tab)) {
          sendResponse({ error: '이 페이지는 캡처할 수 없습니다.' });
          return;
        }
      }

      if (msg.action === 'ELEMENT_SELECTED') {
        // content script → background (피커 클릭 후)
        const croppedUrl = await captureElement(sender.tab.id, msg.rect);
        await chrome.storage.session.set({
          captureResult: { dataUrl: croppedUrl, timestamp: Date.now() }
        });
        await reopenUI(sender.tab.id);
        sendResponse({ ok: true });

      } else if (msg.action === 'ACTIVATE_PICKER') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await sendToTab(tab.id, { action: 'ACTIVATE_PICKER' });
        sendResponse({ ok: true });

      } else if (msg.action === 'DEACTIVATE_PICKER') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await sendToTab(tab.id, { action: 'DEACTIVATE_PICKER' });
        sendResponse({ ok: true });

      } else if (msg.action === 'CAPTURE_ELEMENT') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const res = await sendToTab(tab.id, {
          action: 'FIND_ELEMENT',
          selector: msg.selector,
          selectorType: msg.selectorType,
        });
        if (res && res.error) {
          sendResponse({ error: res.error });
          return;
        }
        const croppedUrl = await captureElement(tab.id, res.rect);
        sendResponse({ dataUrl: croppedUrl });

      } else if (msg.action === 'CAPTURE_VIEWPORT') {
        const dataUrl = await captureViewport();
        sendResponse({ dataUrl });

      } else if (msg.action === 'CAPTURE_FULL_PAGE') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const dataUrl = await captureFullPage(tab.id);
        sendResponse({ dataUrl });

      } else if (msg.action === 'DOWNLOAD') {
        const ext = msg.format === 'pdf' ? 'pdf' : 'png';
        const filename = `dom-capture-${Date.now()}.${ext}`;
        let dataUrl = msg.dataUrl;
        if (msg.format === 'pdf') {
          dataUrl = await dataUrlToPdfDataUrl(msg.dataUrl);
        }
        await downloadDataUrl(dataUrl, filename);
        sendResponse({ ok: true });

      } else if (msg.action === 'GET_RESULT') {
        const data = await chrome.storage.session.get('captureResult');
        await chrome.storage.session.remove('captureResult');
        sendResponse(data.captureResult || null);
      }

    } catch (err) {
      sendResponse({ error: err.message });
    }
  })();
  return true;
});
