// popup/popup.js

let capturedDataUrl = null;

const t = chrome.i18n.getMessage;

function applyI18n() {
  document.documentElement.lang = t('@@ui_locale');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const msg = t(el.dataset.i18n);
    if (msg) el.textContent = msg;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const msg = t(el.dataset.i18nPlaceholder);
    if (msg) el.placeholder = msg;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const msg = t(el.dataset.i18nAlt);
    if (msg) el.alt = msg;
  });
}

applyI18n();

const tabs = document.querySelectorAll('.tab');
const panels = {
  element: document.getElementById('panel-element'),
  page: document.getElementById('panel-page'),
};
const btnPicker = document.getElementById('btn-picker');
const selectorType = document.getElementById('selector-type');
const selectorInput = document.getElementById('selector-input');
const btnFind = document.getElementById('btn-find');
const btnViewport = document.getElementById('btn-viewport');
const btnFullpage = document.getElementById('btn-fullpage');
const btnDownload = document.getElementById('btn-download');
const btnClipboard = document.getElementById('btn-clipboard');
const previewImg = document.getElementById('preview-img');
const statusMsg = document.getElementById('status-msg');

function showStatus(text, type = 'info') {
  statusMsg.textContent = text;
  statusMsg.className = `status ${type}`;
}

function setPreview(dataUrl) {
  capturedDataUrl = dataUrl;
  previewImg.src = dataUrl;
  previewImg.style.display = 'block';
}

function clearPreview() {
  capturedDataUrl = null;
  previewImg.src = '';
  previewImg.style.display = 'none';
}

function getFormat() {
  return document.querySelector('input[name="format"]:checked').value;
}

function send(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(other => other.classList.remove('active'));
    tab.classList.add('active');
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    panels[tab.dataset.tab].classList.remove('hidden');
  });
});

document.querySelectorAll('input[name="format"]').forEach(r => {
  r.addEventListener('change', () => {
    btnClipboard.disabled = getFormat() === 'pdf';
  });
});

btnPicker.addEventListener('click', async () => {
  const result = await send({ action: 'ACTIVATE_PICKER' });
  if (result && result.error) {
    showStatus(result.error, 'error');
    return;
  }
  window.close();
});

btnFind.addEventListener('click', async () => {
  const selector = selectorInput.value.trim();
  if (!selector) { showStatus(t('status_enter_selector'), 'error'); return; }

  showStatus(t('status_finding'), 'info');
  clearPreview();
  btnFind.disabled = true;

  const result = await send({
    action: 'CAPTURE_ELEMENT',
    selector,
    selectorType: selectorType.value,
  });
  btnFind.disabled = false;

  if (result && result.error) {
    showStatus(result.error, 'error');
  } else if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    showStatus(t('status_capture_done'), 'success');
  } else {
    showStatus(t('status_capture_failed'), 'error');
  }
});

btnViewport.addEventListener('click', async () => {
  showStatus(t('status_capturing'), 'info');
  clearPreview();
  btnViewport.disabled = true;

  const result = await send({ action: 'CAPTURE_VIEWPORT' });
  btnViewport.disabled = false;

  if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    showStatus(t('status_capture_done'), 'success');
  } else {
    showStatus(result?.error || t('status_capture_failed'), 'error');
  }
});

btnFullpage.addEventListener('click', async () => {
  showStatus(t('status_fullpage_capturing'), 'info');
  clearPreview();
  btnFullpage.disabled = true;

  const result = await send({ action: 'CAPTURE_FULL_PAGE' });
  btnFullpage.disabled = false;

  if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    showStatus(t('status_capture_done'), 'success');
  } else {
    showStatus(result?.error || t('status_capture_failed'), 'error');
  }
});

btnDownload.addEventListener('click', async () => {
  if (!capturedDataUrl) { showStatus(t('status_capture_first'), 'error'); return; }
  showStatus(t('status_downloading'), 'info');

  const result = await send({
    action: 'DOWNLOAD',
    dataUrl: capturedDataUrl,
    format: getFormat(),
  });

  if (result && result.ok) {
    showStatus(t('status_download_done'), 'success');
  } else {
    showStatus(result?.error || t('status_download_failed'), 'error');
  }
});

btnClipboard.addEventListener('click', async () => {
  if (!capturedDataUrl) { showStatus(t('status_capture_first'), 'error'); return; }
  try {
    const blob = await (await fetch(capturedDataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showStatus(t('status_clipboard_done'), 'success');
  } catch (_) {
    await send({ action: 'DOWNLOAD', dataUrl: capturedDataUrl, format: 'png' });
    showStatus(t('status_clipboard_fallback'), 'info');
  }
});

(async () => {
  const result = await send({ action: 'GET_RESULT' });
  if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    if (result.selector) {
      selectorType.value = 'css';
      selectorInput.value = result.selector;
    }
    showStatus(t('status_element_captured'), 'success');
  }
  chrome.action.setBadgeText({ text: '' });
})();
