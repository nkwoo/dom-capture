// test/test-region-capture.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'content', 'content.js'),
  'utf8'
);

// confirmRegionCapture must exist
const fnStart = source.indexOf('function confirmRegionCapture(');
assert.ok(fnStart !== -1, 'confirmRegionCapture not found');

// deactivateRegion() must be called inside confirmRegionCapture before the message
const deactivatePos = source.indexOf('deactivateRegion()', fnStart);
assert.ok(deactivatePos !== -1, 'deactivateRegion() not found in confirmRegionCapture');

// Double rAF must wrap REGION_SELECTED
const rafPos  = source.indexOf('requestAnimationFrame', deactivatePos);
const sendPos = source.indexOf("action: 'REGION_SELECTED'", deactivatePos);
assert.ok(rafPos  !== -1, 'requestAnimationFrame not found after deactivateRegion()');
assert.ok(sendPos !== -1, "REGION_SELECTED not found in confirmRegionCapture");
assert.ok(rafPos < sendPos, 'requestAnimationFrame must appear before REGION_SELECTED');

const raf2Pos = source.indexOf('requestAnimationFrame', rafPos + 1);
assert.ok(
  raf2Pos !== -1 && raf2Pos < sendPos,
  'A second nested requestAnimationFrame must wrap REGION_SELECTED'
);

console.log('✓ REGION_SELECTED is deferred via double requestAnimationFrame after overlay removal');
