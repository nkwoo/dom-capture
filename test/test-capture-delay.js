// test/test-capture-delay.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'content', 'content.js'),
  'utf8'
);

// Find deactivatePicker(true) inside onMouseClick
const fnStart = source.indexOf('function onMouseClick(e)');
assert.ok(fnStart !== -1, 'onMouseClick not found');

const deactivatePos = source.indexOf('deactivatePicker(true)', fnStart);
assert.ok(deactivatePos !== -1, 'deactivatePicker(true) not found in onMouseClick');

// After deactivatePicker(true), requestAnimationFrame must appear before sendMessage
const rafPos   = source.indexOf('requestAnimationFrame', deactivatePos);
const sendPos  = source.indexOf('chrome.runtime.sendMessage', deactivatePos);

assert.ok(rafPos  !== -1, 'requestAnimationFrame not found after deactivatePicker(true)');
assert.ok(sendPos !== -1, 'chrome.runtime.sendMessage not found after deactivatePicker(true)');
assert.ok(
  rafPos < sendPos,
  `requestAnimationFrame (pos ${rafPos}) must appear before sendMessage (pos ${sendPos})`
);

// Verify double-rAF: a second requestAnimationFrame must appear between the first and sendMessage
const raf2Pos = source.indexOf('requestAnimationFrame', rafPos + 1);
assert.ok(
  raf2Pos !== -1 && raf2Pos < sendPos,
  'A second (nested) requestAnimationFrame must wrap sendMessage'
);

console.log('✓ ELEMENT_SELECTED is deferred via double requestAnimationFrame after overlay removal');
