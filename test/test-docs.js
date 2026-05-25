// test/test-docs.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');

const NON_ENGLISH_LOCALES = ['ko', 'ja', 'zh_CN', 'zh_TW', 'de', 'fr', 'es', 'pt_BR', 'ru'];

// README.md must link to all non-English READMEs
const readmeMd = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
for (const locale of NON_ENGLISH_LOCALES) {
  assert.ok(
    readmeMd.includes(`docs/README.${locale}.md`),
    `README.md is missing link to docs/README.${locale}.md`
  );
}
console.log('✓  README.md links to all non-English READMEs');

// Root README.ko.md must NOT exist
assert.ok(
  !fs.existsSync(path.join(ROOT, 'README.ko.md')),
  'README.ko.md must not exist at root (should be at docs/README.ko.md)'
);
console.log('✓  README.ko.md is not at root');

// Each docs/README.{locale}.md must exist and have correct relative paths
for (const locale of NON_ENGLISH_LOCALES) {
  const filePath = path.join(ROOT, 'docs', `README.${locale}.md`);
  assert.ok(fs.existsSync(filePath), `Missing: docs/README.${locale}.md`);

  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('../logo.png'), `[${locale}] Missing ../logo.png path`);
  assert.ok(content.includes('https://github.com/nkwoo/dom-capture/blob/main/LICENSE'), `[${locale}] Missing absolute LICENSE link`);
  assert.ok(content.includes('https://github.com/nkwoo/dom-capture/issues/new'), `[${locale}] Missing absolute issues/new link`);
  assert.ok(content.includes('../README.md'), `[${locale}] Missing link back to ../README.md`);
  console.log(`✓  docs/README.${locale}.md: exists, paths correct`);
}

console.log('\nAll README docs valid.');
