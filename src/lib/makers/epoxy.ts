import { clampNumber, roundTo } from '@/lib/makers/format';

export type EpoxyShape = 'rectangle' | 'cylinder' | 'oval' | 'river';

export function epoxyVolumeMl(options: {
  shape: EpoxyShape;
  length: number;
  width: number;
  depth: number;
  unit: 'cm' | 'in';
  fillPercent: number;
}) {
  const toCm = options.unit === 'in' ? 2.54 : 1;
  const L = clampNumber(options.length, 0.1, 500) * toCm;
  const W = clampNumber(options.width, 0.1, 500) * toCm;
  const D = clampNumber(options.depth, 0.05, 50) * toCm;
  const fill = clampNumber(options.fillPercent, 1, 100) / 100;
  let cm3 = 0;
  if (options.shape === 'rectangle') cm3 = L * W * D;
  else if (options.shape === 'cylinder') cm3 = Math.PI * (L / 2) ** 2 * D;
  else if (options.shape === 'oval') cm3 = Math.PI * (L / 2) * (W / 2) * D;
  else cm3 = L * W * D * 0.35;
  return roundTo(cm3 * fill, 1);
}

export function mixEpoxy(volumeMl: number, ratioA: number, ratioB: number, densityGml: number) {
  const vol = clampNumber(volumeMl, 0, 1_000_000);
  const a = clampNumber(ratioA, 0.1, 20);
  const b = clampNumber(ratioB, 0.1, 20);
  const density = clampNumber(densityGml, 0.8, 1.6);
  const parts = a + b;
  const volA = vol * (a / parts);
  const volB = vol * (b / parts);
  return {
    volumeMl: roundTo(vol, 1),
    volumeL: roundTo(vol / 1000, 3),
    volumeOz: roundTo(vol / 29.5735, 2),
    gramsA: roundTo(volA * density, 1),
    gramsB: roundTo(volB * density, 1),
    mlA: roundTo(volA, 1),
    mlB: roundTo(volB, 1),
    totalGrams: roundTo(vol * density, 1),
  };
}
