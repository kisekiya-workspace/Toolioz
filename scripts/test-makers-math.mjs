import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';

const root = process.cwd();
const cache = new Map();

function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const mod = new Module(file);
  cache.set(file, mod);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  const nativeRequire = createRequire(file);
  mod.require = (id) => {
    if (!id.startsWith('@/') && !id.startsWith('.')) return nativeRequire(id);
    const base = id.startsWith('@/') ? path.resolve(root, 'src', id.slice(2)) : path.resolve(path.dirname(file), id);
    const target = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')].find(
      (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
    );
    return target && /\.tsx?$/.test(target) ? load(target) : nativeRequire(id);
  };
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    file,
  );
  return mod.exports;
}

const { calculateGauge } = load(path.join(root, 'src/lib/makers/craft-gauge.ts'));
const { filamentLengthMeters } = load(path.join(root, 'src/lib/makers/filament.ts'));
const { bpmToMs } = load(path.join(root, 'src/lib/makers/bpm.ts'));
const { aquariumLitres } = load(path.join(root, 'src/lib/makers/aquarium.ts'));
const { panScale } = load(path.join(root, 'src/lib/makers/baking-pans.ts'));
const { fluidClamp } = load(path.join(root, 'src/lib/makers/css-clamp.ts'));
const { toRoman, dateToRoman } = load(path.join(root, 'src/lib/makers/roman.ts'));
const { lumberBoardFeet, doyle, scribner, internationalQuarter } = load(path.join(root, 'src/lib/makers/board-feet.ts'));
const { calculateQuilt } = load(path.join(root, 'src/lib/makers/quilt.ts'));
const { wallpaperRolls } = load(path.join(root, 'src/lib/makers/wallpaper.ts'));
const { calculateSourdough } = load(path.join(root, 'src/lib/makers/sourdough.ts'));
const { transposeChart } = load(path.join(root, 'src/lib/makers/chords.ts'));
const { parseGcodeUsage } = load(path.join(root, 'src/lib/makers/print-cost.ts'));
const { plateStack, KG_PLATES } = load(path.join(root, 'src/lib/makers/barbell.ts'));
const { ledResistor } = load(path.join(root, 'src/lib/makers/led.ts'));
const { convertIngredient, ingredientBySlug } = load(path.join(root, 'src/lib/makers/ingredients.ts'));

function assertClose(name, actual, expected, tol = 0.05) {
  if (Math.abs(actual - expected) > tol) {
    throw new Error(`${name}: expected ${expected}, got ${actual}`);
  }
}

const gauge = calculateGauge({
  swatchStitches: 22,
  swatchRows: 30,
  swatchWidth: 4,
  swatchHeight: 4,
  targetWidth: 20,
  targetHeight: 24,
  patternStitches: 20,
  patternRows: 28,
  patternWidth: 4,
  patternHeight: 4,
});
assertClose('cast-on', gauge.targetStitches, 110, 0.5);

const pla = filamentLengthMeters(1000, 1.24, 1.75);
assertClose('pla 1kg metres', pla, 335, 8);

assertClose('120 bpm quarter', bpmToMs(120, 1, 'straight'), 500, 0.01);

const rect = aquariumLitres({ shape: 'rectangular', length: 90, width: 45, height: 45, unit: 'cm' });
assertClose('90x45x45 litres', rect.litres, 182.25, 0.2);

const scale = panScale(
  { kind: 'round', a: 9, b: 9, depth: 2 },
  { kind: 'rect', a: 13, b: 9, depth: 2 },
);
assertClose('9in to 9x13 factor', scale.volumeFactor, 1.84, 0.05);

assertClose('roman 1994', toRoman(1994) === 'MCMXCIV' ? 1 : 0, 1, 0);
assertClose('date sep', dateToRoman(1994, 7, 29, '·') === 'XXIX·VII·MCMXCIV' ? 1 : 0, 1, 0);

assertClose('2x8x10 bf', lumberBoardFeet(2, 8, 10, 1), 13.33, 0.02);
assertClose('doyle 16x10', doyle(16, 10), 90, 0.1);
assertClose('scribner 16x10', scribner(16, 10), 103.9, 0.2);
assertClose('intl 1/4 16x10', internationalQuarter(16, 10), 106.24, 0.3);

const quilt = calculateQuilt({
  blocksX: 8,
  blocksY: 9,
  blockIn: 6,
  sashingIn: 1,
  borderIn: 4,
  dropIn: 12,
  mattressW: 60,
  mattressL: 80,
});
assertClose('quilt body width', quilt.bodyW, 55, 0.01);
assertClose('quilt finished width', quilt.quiltW, 63, 0.01);
assertClose('quilt finished length', quilt.quiltL, 70, 0.01);
assertClose('quilt queen target width', quilt.targetW, 84, 0.01);
assertClose('quilt queen target length', quilt.targetL, 92, 0.01);

const paper = wallpaperRolls({
  wallWidthM: 5,
  wallHeightM: 2.4,
  rollLengthM: 10.05,
  rollWidthM: 0.53,
  repeatCm: 32,
  pattern: 'straight',
  wastePercent: 10,
});
assertClose('wallpaper rolls', paper.rolls, 5, 0);

const dough = calculateSourdough({
  flourG: 500,
  hydrationPercent: 72,
  starterPercent: 20,
  starterHydration: 100,
  saltPercent: 2,
});
assertClose('sourdough bowl water', dough.water, 310, 0.1);
assertClose('sourdough true hydration', dough.trueHydration, 65.5, 0.1);

if (transposeChart('C/E Am7', 2) !== 'D/F# Bm7') {
  throw new Error(`slash transpose: ${transposeChart('C/E Am7', 2)}`);
}

const gcode = parseGcodeUsage('; filament used [g] = 48\n; TIME:3600\n', 1.24, 1.75);
assertClose('gcode grams', gcode.grams, 48, 0.01);
assertClose('gcode hours from TIME', gcode.hours, 1, 0.01);

const plates = plateStack(100, 20, KG_PLATES);
assertClose('100kg loaded', plates.loaded, 100, 0.01);

const led = ledResistor({ supplyV: 5, forwardV: 2.1, currentMa: 20, seriesCount: 1, strings: 1 });
assertClose('led ohms', led.ohms, 145, 1);

const flour = convertIngredient({ ingredient: ingredientBySlug('flour'), cups: 1, cup: 'us' });
assertClose('flour cup grams', flour.grams, 120, 0.1);

const clamp = fluidClamp({ minPx: 16, maxPx: 32, minVw: 360, maxVw: 1240, rootPx: 16 });
if (!clamp.cssPx.includes('clamp(')) throw new Error('clamp css missing');

console.log('makers math checks passed');
