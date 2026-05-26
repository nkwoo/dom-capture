// test/test-i18n.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const EXPECTED_KEYS = [
  'ext_name', 'ext_description',
  'tab_element', 'tab_page', 'tab_region',
  'btn_picker', 'divider_or', 'selector_placeholder',
  'btn_find', 'btn_viewport', 'btn_fullpage', 'btn_region', 'btn_region_confirm',
  'btn_download', 'btn_clipboard', 'preview_alt',
  'status_enter_selector', 'status_finding',
  'status_capture_done', 'status_capture_failed',
  'status_capturing', 'status_fullpage_capturing',
  'status_capture_first', 'status_downloading',
  'status_download_done', 'status_download_failed',
  'status_clipboard_done', 'status_clipboard_fallback',
  'status_element_captured',
  'error_element_not_found', 'error_unsupported_page',
];

const localesDir = path.join(__dirname, '..', '_locales');
const LOCALES = fs.readdirSync(localesDir).filter(entry =>
  fs.statSync(path.join(localesDir, entry)).isDirectory()
);

for (const locale of LOCALES) {
  const filePath = path.join(__dirname, '..', '_locales', locale, 'messages.json');
  assert.ok(fs.existsSync(filePath), `Missing file: _locales/${locale}/messages.json`);

  const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const key of EXPECTED_KEYS) {
    assert.ok(key in messages, `[${locale}] Missing key: "${key}"`);
    assert.ok(
      typeof messages[key].message === 'string' && messages[key].message.trim().length > 0,
      `[${locale}] Empty message for key: "${key}"`
    );
    if (key === 'ext_name') {
      assert.strictEqual(messages[key].message, 'DOM Capture', `[${locale}] ext_name must be "DOM Capture"`);
    }
  }
  const extraKeys = Object.keys(messages).filter(k => !EXPECTED_KEYS.includes(k));
  assert.strictEqual(extraKeys.length, 0, `[${locale}] Unexpected extra keys: ${extraKeys.join(', ')}`);
  console.log(`✓  ${locale}: all ${EXPECTED_KEYS.length} keys present and non-empty`);
}

console.log('\nAll locale files valid.');
