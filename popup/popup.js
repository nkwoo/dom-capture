// popup/popup.js

let capturedDataUrl = null;

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

// 탭 전환
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    panels[tab.dataset.tab].classList.remove('hidden');
  });
});

// PDF 선택 시 클립보드 버튼 비활성화
document.querySelectorAll('input[name="format"]').forEach(r => {
  r.addEventListener('change', () => {
    btnClipboard.disabled = getFormat() === 'pdf';
  });
});

// 피커 버튼: 팝업을 닫고 페이지에서 요소 선택
btnPicker.addEventListener('click', async () => {
  const result = await send({ action: 'ACTIVATE_PICKER' });
  if (result && result.error) {
    showStatus(result.error, 'error');
    return;
  }
  window.close();
});

// 셀렉터로 요소 캡처
btnFind.addEventListener('click', async () => {
  const selector = selectorInput.value.trim();
  if (!selector) { showStatus('셀렉터를 입력해 주세요.', 'error'); return; }

  showStatus('요소를 찾는 중...', 'info');
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
    showStatus('캡처 완료!', 'success');
  } else {
    showStatus('캡처에 실패했습니다.', 'error');
  }
});

// 현재 화면 캡처
btnViewport.addEventListener('click', async () => {
  showStatus('캡처 중...', 'info');
  clearPreview();
  btnViewport.disabled = true;

  const result = await send({ action: 'CAPTURE_VIEWPORT' });
  btnViewport.disabled = false;

  if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    showStatus('캡처 완료!', 'success');
  } else {
    showStatus(result?.error || '캡처에 실패했습니다.', 'error');
  }
});

// 전체 페이지 캡처
btnFullpage.addEventListener('click', async () => {
  showStatus('전체 페이지 캡처 중... (잠시 기다려 주세요)', 'info');
  clearPreview();
  btnFullpage.disabled = true;

  const result = await send({ action: 'CAPTURE_FULL_PAGE' });
  btnFullpage.disabled = false;

  if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    showStatus('캡처 완료!', 'success');
  } else {
    showStatus(result?.error || '캡처에 실패했습니다.', 'error');
  }
});

// 다운로드
btnDownload.addEventListener('click', async () => {
  if (!capturedDataUrl) { showStatus('먼저 캡처를 진행해 주세요.', 'error'); return; }
  showStatus('다운로드 중...', 'info');

  const result = await send({
    action: 'DOWNLOAD',
    dataUrl: capturedDataUrl,
    format: getFormat(),
  });

  if (result && result.ok) {
    showStatus('다운로드 완료!', 'success');
  } else {
    showStatus(result?.error || '다운로드에 실패했습니다.', 'error');
  }
});

// 클립보드 복사 (PNG only, 팝업 컨텍스트에서 실행)
btnClipboard.addEventListener('click', async () => {
  if (!capturedDataUrl) { showStatus('먼저 캡처를 진행해 주세요.', 'error'); return; }
  try {
    const blob = await (await fetch(capturedDataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showStatus('클립보드에 복사되었습니다!', 'success');
  } catch (_) {
    // 복사 실패 시 다운로드로 폴백
    await send({ action: 'DOWNLOAD', dataUrl: capturedDataUrl, format: 'png' });
    showStatus('클립보드 복사 실패 → 다운로드로 저장했습니다.', 'info');
  }
});

// 팝업 열릴 때: 피커로 선택된 결과가 있으면 표시, 배지 초기화
(async () => {
  const result = await send({ action: 'GET_RESULT' });
  if (result && result.dataUrl) {
    setPreview(result.dataUrl);
    if (result.selector) {
      selectorType.value = 'css';
      selectorInput.value = result.selector;
    }
    showStatus('요소 캡처 완료! 다운로드 또는 복사하세요.', 'success');
  }
  chrome.action.setBadgeText({ text: '' });
})();
