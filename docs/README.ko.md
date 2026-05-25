<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  DOM 요소 또는 전체 페이지를 PNG / PDF로 캡처하는 Chrome 확장 프로그램
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## 기능

- **요소 피커** — 마우스를 올려 원하는 요소를 선택하고 클릭하여 캡처
- **CSS / XPath 셀렉터** — 셀렉터를 직접 입력해 특정 요소 캡처
- **뷰포트 캡처** — 현재 보이는 화면 영역 스크린샷
- **전체 페이지 캡처** — 스크롤하며 이어붙이는 전체 페이지 스크린샷
- **내보내기** — PNG 또는 PDF로 저장하거나 클립보드에 복사

## 설치 방법

### 방법 A — Chrome 웹 스토어

[Chrome 웹 스토어](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda)에서 **Chrome에 추가**를 클릭하세요.

### 방법 B — 직접 설치 (개발자 모드)

1. **저장소를 클론합니다**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **Chrome 확장 프로그램 페이지를 엽니다**
   주소창에 `chrome://extensions`를 입력하세요.

3. **개발자 모드를 활성화합니다**
   우측 상단의 **개발자 모드** 토글을 켭니다.

4. **확장 프로그램을 로드합니다**
   **압축 해제된 확장 프로그램 로드**를 클릭하고 클론한 폴더를 선택합니다.

5. **확장 프로그램을 고정합니다** (선택 사항)
   Chrome 툴바의 퍼즐 아이콘을 클릭하고 **DOM Capture**를 고정하면 편리하게 사용할 수 있습니다.

## 사용 방법

| 작업 | 방법 |
|------|------|
| 요소 캡처 | 확장 아이콘 클릭 → **요소 선택** → 페이지에서 원하는 요소 클릭 |
| 셀렉터로 캡처 | 확장 아이콘 클릭 → CSS 또는 XPath 셀렉터 입력 → **캡처** |
| 뷰포트 캡처 | 확장 아이콘 클릭 → **뷰포트** 탭 → **캡처** |
| 전체 페이지 캡처 | 확장 아이콘 클릭 → **전체 페이지** 탭 → **캡처** |
| 다운로드 | 캡처 후 **다운로드** 클릭 (PNG 또는 PDF) |
| 클립보드 복사 | 캡처 후 **복사** 클릭 (PNG 전용) |

## 기여 방법

기여는 언제나 환영합니다!

1. 저장소를 포크합니다.
2. 기능 브랜치를 만듭니다: `git checkout -b feat/기능명`
3. 변경 사항을 커밋합니다: `git commit -m "feat: 변경 내용 설명"`
4. 브랜치를 푸시합니다: `git push origin feat/기능명`
5. `main` 브랜치를 대상으로 Pull Request를 엽니다.

PR은 하나의 기능 또는 버그 수정에 집중해 주세요.

## 이슈 제기

버그를 발견하거나 기능을 제안하고 싶으신가요? [이슈를 열어주세요](https://github.com/nkwoo/dom-capture/issues/new). 아래 정보를 포함해 주시면 빠른 처리에 도움이 됩니다:

- Chrome 버전 (`chrome://version`)
- 확장 프로그램 버전 (`chrome://extensions`에서 확인)
- 재현 단계
- 기대 동작 vs 실제 동작
- 스크린샷 또는 화면 녹화 (해당되는 경우)

## 라이선스

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
