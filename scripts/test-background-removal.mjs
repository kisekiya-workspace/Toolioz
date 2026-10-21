// Test-only transpilation uses the project's existing TypeScript dependency.
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';
const enginePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/lib/background-removal/engine.ts');
const mod = new Module(enginePath);
mod.filename = enginePath;
mod._compile(ts.transpileModule(fs.readFileSync(enginePath, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, enginePath);
const { segmentBackground, renderCutout } = mod.exports;
let passed = 0;
function test(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }
function scene(w, h, pixel) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data.set(pixel(x, y), (y * w + x) * 4);
  return { width: w, height: h, data };
}
const inside = (x, y, w = 100, h = 80) => x > w * .25 && x < w * .75 && y > h * .2 && y < h * .8;
const simple = scene(100, 80, (x, y) => inside(x, y) ? [15, 60, 35, 255] : [240, 240, 240, 255]);
const simpleMask = segmentBackground(simple).mask;
test('solid backdrop, foreground and background alpha', () => {
  assert.equal(simpleMask[0], 0); assert.equal(simpleMask[40 * 100 + 50], 1);
});
test('deterministic output', () => assert.deepEqual(segmentBackground(simple).mask, simpleMask));
test('gradient backdrop and enclosed pale subject details', () => {
  const image = scene(100, 80, (x, y) => inside(x, y) ? (x > 40 && x < 60 && y > 30 && y < 50 ? [235, 235, 235, 255] : [10, 35, 25, 255]) : [200 + Math.round(x * .4), 200 + Math.round(x * .4), 200 + Math.round(x * .4), 255]);
  const { mask } = segmentBackground(image);
  let intersection = 0, union = 0;
  for (let y = 0; y < 80; y++) for (let x = 0; x < 100; x++) {
    const expected = inside(x, y), actual = mask[y * 100 + x] > .5;
    if (expected && actual) intersection++; if (expected || actual) union++;
  }
  assert.equal(mask[40 * 100 + 50], 1); assert.ok(intersection / union > .99);
  console.log(`  Synthetic rectangle IoU ${(intersection / union).toFixed(4)}`);
});
test('multiple backdrop colors', () => {
  const image = scene(100, 80, (x, y) => inside(x, y) ? [170, 30, 50, 255] : x < 50 ? [220, 230, 240, 255] : [160, 190, 220, 255]);
  const result = segmentBackground(image);
  assert.equal(result.mask[40 * 100 + 5], 0); assert.equal(result.mask[40 * 100 + 95], 0); assert.equal(result.mask[40 * 100 + 50], 1);
});
test('uniform image warns, does not hallucinate a subject', () => {
  const result = segmentBackground(scene(20, 20, () => [80, 80, 80, 255]));
  assert.ok(result.warning); assert.equal(result.retained, 0);
});
test('transparent border preserves existing alpha', () => {
  const image = scene(20, 20, (x, y) => x > 4 && x < 16 && y > 4 && y < 16 ? [40, 90, 80, 128] : [0, 0, 0, 0]);
  const result = segmentBackground(image);
  assert.deepEqual(renderCutout(image, image, result.mask, [], 1), image.data);
});
test('remove and keep brushes are continuous; last stroke wins', () => {
  const stroke = { mode: 'remove', radius: .04, points: [[.3, .5], [.7, .5]] };
  const removed = renderCutout(simple, simple, simpleMask, [stroke], 0);
  for (let x = 30; x < 70; x++) assert.equal(removed[(40 * 100 + x) * 4 + 3], 0);
  const restored = renderCutout(simple, simple, simpleMask, [stroke, { mode: 'keep', radius: .08, points: [[.5, .5]] }], 0);
  assert.equal(restored[(40 * 100 + 50) * 4 + 3], 255);
  assert.equal(restored[(40 * 100 + 30) * 4 + 3], 0);
});
test('brush restores edge-touching subject', () => {
  const image = scene(30, 30, (x, y) => x < 12 && y > 10 && y < 20 ? [20, 50, 30, 255] : [240, 240, 240, 255]);
  const result = segmentBackground(image);
  const data = renderCutout(image, image, result.mask, [{ mode: 'keep', radius: .1, points: [[0, .5], [.3, .5]] }], 0);
  assert.equal(data[(15 * 30 + 1) * 4 + 3], 255);
});
test('full-size reconstruction keeps dimensions, RGB and bounded alpha', () => {
  const large = scene(400, 320, (x, y) => inside(x, y, 400, 320) ? [15, 60, 35, 255] : [240, 240, 240, 255]);
  for (const softness of [0, .5, 1, 2, 4]) {
    const data = renderCutout(large, simple, simpleMask, [], softness);
    assert.equal(data.length, large.data.length);
    for (let i = 0; i < data.length; i += 4) { assert.equal(data[i], large.data[i]); assert.equal(data[i + 1], large.data[i + 1]); assert.equal(data[i + 2], large.data[i + 2]); }
    assert.equal(data[(160 * 400 + 200) * 4 + 3], 255); assert.equal(data[3], 0);
  }
});
test('keep never makes source-transparent pixels opaque', () => {
  const image = scene(10, 10, () => [50, 60, 70, 0]);
  const output = renderCutout(image, image, segmentBackground(image).mask, [{ mode: 'keep', radius: .5, points: [[.5, .5]] }], 0);
  for (let i = 3; i < output.length; i += 4) assert.equal(output[i], 0);
});
test('validation rejects malformed dimensions, parameters, and strokes', () => {
  assert.throws(() => segmentBackground({ width: -1, height: 1, data: new Uint8ClampedArray(0) }));
  assert.throws(() => segmentBackground(simple, NaN));
  assert.throws(() => renderCutout(simple, simple, new Float32Array(1), [], 1));
  assert.throws(() => renderCutout(simple, simple, simpleMask, [{ mode: 'keep', radius: .1, points: [[NaN, .5]] }], 1));
});
test('720px workload produces a finite mask', () => {
  const image = scene(720, 540, (x, y) => inside(x, y, 720, 540) ? [25, 65, 45, 255] : [225 + Math.round(x / 72), 220 + Math.round(x / 72), 210 + Math.round(x / 72), 255]);
  const start = performance.now(), result = segmentBackground(image);
  assert.ok(result.mask.every(v => Number.isFinite(v) && v >= 0 && v <= 1));
  console.log(`  720×540 analysis ${(performance.now() - start).toFixed(0)}ms (machine-specific)`);
});
console.log(`${passed} engine tests passed. Synthetic results are not a real-photo quality benchmark.`);
