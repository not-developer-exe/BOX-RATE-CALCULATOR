const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const startTag = html.lastIndexOf('<script>');
const endTag = html.indexOf('</script>', startTag);
if (startTag < 0 || endTag < 0) throw new Error('Inline script not found');
const script = html.slice(startTag + '<script>'.length, endTag);

// Parse the complete browser script before running focused formula checks.
new Function(script);

assert.ok(!script.includes(String.fromCharCode(92) + 'nfunction getCalc'), 'Unexpected literal backslash-n before getCalc');
assert.ok(script.includes('const rollRaw=W+H+allow'), 'Roll-width formula changed');
assert.ok(script.includes('L+W+flap:2*L+2*W+flap'), 'Cut-length formulas changed');
assert.ok(script.includes("const sheets=read('cutMode')==='jointed'?2:1"), 'Sheet count rule changed');
assert.ok(script.includes('const weightG=area*x.gsm*x.factor/1550*sheets*(1+wastage)'), 'Layer weight formula changed');
assert.ok(script.includes('const fac=fluteFactor(suffix)'), 'Flute factor is not applied at the flute-layer level');
assert.ok(script.includes('function applyErpRates()'), 'ERP rate application action is missing');
assert.ok(script.includes('weightedAverageLandedRatePerKg'), 'Weighted-average ERP rate basis is missing');
assert.ok(html.includes('id="duplexTable"'), 'Duplex stock table is missing');
assert.ok(html.includes('id="duplexBatchSelect"'), 'Duplex batch selector is missing');

for (const id of ['flute1Custom', 'flute2Custom', 'flute3Custom']) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing independent custom take-up input: ' + id);
}

const helperStart = script.indexOf('function fluteFactor(suffix){');
const helperEnd = script.indexOf(String.fromCharCode(10) + '}', helperStart);
assert.ok(helperStart >= 0 && helperEnd >= 0, 'Flute factor helper not found');
const helper = script.slice(helperStart, helperEnd + 2);
const values = {
  flute1: 'narrow', flute1Custom: '50',
  flute2: 'broad', flute2Custom: '60',
  flute3: 'custom', flute3Custom: '0'
};
const readValue = (id) => values[id] ?? '';
const dollar = (id) => ({ value: values[id] ?? '' });
const fluteFactor = new Function('$', 'read', helper + '; return fluteFactor;')(dollar, readValue);
assert.equal(fluteFactor('1'), 1.5, 'Narrow flute must consume 50% extra paper');
assert.equal(fluteFactor('2'), 1.6, 'Broad flute must consume 60% extra paper');
assert.equal(fluteFactor('3'), 1, 'A custom 0% take-up must remain 1.00x');
values.flute1 = 'fine';
assert.equal(fluteFactor('1'), 1.35, 'Fine E-Flute must consume 35% extra paper');
values.flute1 = 'custom';
values.flute1Custom = '22.5';
assert.equal(fluteFactor('1'), 1.225, 'Custom take-up must be read independently per roll');
console.log('Calculator syntax and costing-rule checks passed');
