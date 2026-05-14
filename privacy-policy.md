# Privacy Policy / 개인정보 처리 방침

---

## English

### DOM Capture — Privacy Policy

**Last updated:** 2026-05-14

#### Overview

DOM Capture is a browser extension that captures DOM elements or full pages as PNG or PDF images. This policy describes what data the extension accesses and how it is handled.

#### Data We Do NOT Collect

DOM Capture does **not** collect, store, or transmit:

- Personal information of any kind
- Browsing history or visited URLs
- Tab titles or page content
- User input (selectors, text fields)
- Any analytics or telemetry data

#### Data Processed Locally

The following data is processed exclusively on your device and is never sent to any external server:

| Data | Purpose | Retention |
|------|---------|-----------|
| Captured screenshots (image data) | Saved to your device or copied to clipboard at your explicit request | Not stored by the extension |
| CSS selector of the picked element | Displayed in the popup input field for re-use | Held in session storage only; cleared when the browser session ends |
| Device Pixel Ratio (`window.devicePixelRatio`) | Used to compute accurate pixel dimensions for Retina/HiDPI displays | Not stored |

#### Permissions and Their Purpose

- **`activeTab`** — Captures the visible area of the tab you are currently viewing, only when you explicitly trigger a capture.
- **`tabs`** — Identifies the active tab to send capture commands; does not read URLs or history.
- **`downloads`** — Saves the captured image to your device when you click Download.
- **`clipboardWrite`** — Writes the captured image to your clipboard when you click Copy.
- **`scripting`** — Reads `window.devicePixelRatio` from the current tab to support high-resolution displays.
- **`storage`** — Temporarily stores the capture result in session storage so it can be displayed when the popup reopens after picker selection. Cleared automatically when the browser session ends.
- **`sidePanel`** — Reopens the extension UI after picker selection on browsers that do not support `chrome.action.openPopup()`.

#### Third-Party Services

DOM Capture does not communicate with any third-party servers. No data is shared with, sold to, or processed by any third party.

#### Changes to This Policy

If this policy is updated, the updated version will be published in the extension's source repository. Continued use of the extension after an update constitutes acceptance of the revised policy.

#### Contact

For questions or concerns, please open an issue at:
[https://github.com/nkwoo/dom-capture/issues](https://github.com/nkwoo/dom-capture/issues)

---

## 한국어

### DOM Capture — 개인정보 처리 방침

**최종 업데이트:** 2026-05-14

#### 개요

DOM Capture는 웹 페이지의 DOM 요소 또는 전체 페이지를 PNG/PDF 이미지로 캡처하는 브라우저 확장 프로그램입니다. 본 방침은 확장 프로그램이 어떤 데이터에 접근하고 어떻게 처리하는지 설명합니다.

#### 수집하지 않는 데이터

DOM Capture는 다음 데이터를 **수집, 저장, 전송하지 않습니다.**

- 모든 종류의 개인정보
- 방문 기록 또는 탭 URL
- 탭 제목 또는 페이지 내용
- 사용자 입력값(셀렉터, 텍스트 필드 등)
- 분석(analytics) 또는 원격 측정(telemetry) 데이터

#### 로컬에서만 처리되는 데이터

다음 데이터는 오직 사용자의 기기 내에서만 처리되며 외부 서버로 전송되지 않습니다.

| 데이터 | 목적 | 보관 기간 |
|--------|------|-----------|
| 캡처된 스크린샷 (이미지 데이터) | 사용자의 명시적 요청에 따라 기기에 저장하거나 클립보드에 복사 | 확장 프로그램이 저장하지 않음 |
| 선택한 요소의 CSS 셀렉터 | 팝업 입력 필드에 표시하여 재사용 편의 제공 | 세션 스토리지에만 보관, 브라우저 세션 종료 시 자동 삭제 |
| 기기 픽셀 비율 (`window.devicePixelRatio`) | Retina/HiDPI 디스플레이에서 정확한 픽셀 크기 계산 | 저장하지 않음 |

#### 권한 및 사용 목적

- **`activeTab`** — 사용자가 캡처를 명시적으로 요청할 때, 현재 보고 있는 탭의 화면을 캡처합니다.
- **`tabs`** — 캡처 명령을 전달하기 위한 활성 탭 식별에 사용합니다. URL 또는 방문 기록을 읽지 않습니다.
- **`downloads`** — 다운로드 버튼 클릭 시 캡처된 이미지를 기기에 저장합니다.
- **`clipboardWrite`** — 복사 버튼 클릭 시 캡처된 이미지를 클립보드에 씁니다.
- **`scripting`** — 고해상도 디스플레이를 지원하기 위해 현재 탭의 `window.devicePixelRatio`를 조회합니다.
- **`storage`** — 피커 선택 후 팝업이 다시 열릴 때 캡처 결과를 표시하기 위해 세션 스토리지에 일시 보관합니다. 브라우저 세션 종료 시 자동 삭제됩니다.
- **`sidePanel`** — `chrome.action.openPopup()`을 지원하지 않는 브라우저 버전에서 피커 선택 후 확장 UI를 자동으로 다시 엽니다.

#### 제3자 서비스

DOM Capture는 어떠한 외부 서버와도 통신하지 않습니다. 사용자 데이터는 제3자와 공유, 판매, 처리되지 않습니다.

#### 방침 변경

본 방침이 업데이트될 경우, 변경된 내용은 확장 프로그램의 소스 저장소에 게시됩니다. 업데이트 이후 확장 프로그램을 계속 사용하면 변경된 방침에 동의한 것으로 간주됩니다.

#### 문의

문의 사항은 아래 이슈 페이지를 이용해 주세요:
[https://github.com/nkwoo/dom-capture/issues](https://github.com/nkwoo/dom-capture/issues)
