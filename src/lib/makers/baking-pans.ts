import { clampNumber, roundTo } from '@/lib/makers/format';

export type PanKind = 'round' | 'square' | 'rect' | 'loaf' | 'bundt';

export interface Pan {
  kind: PanKind;
  a: number;
  b: number;
  depth: number;
}

export function panVolumeIn3(pan: Pan): number {
  const a = clampNumber(pan.a, 1, 30);
  const b = clampNumber(pan.b, 1, 30);
  const d = clampNumber(pan.depth, 0.5, 8);
  if (pan.kind === 'round') return Math.PI * (a / 2) ** 2 * d;
  if (pan.kind === 'square') return a * a * d;
  if (pan.kind === 'rect' || pan.kind === 'loaf') return a * b * d;
  const outer = Math.PI * (a / 2) ** 2 * d;
  const tube = Math.PI * (Math.max(0.5, a * 0.35) / 2) ** 2 * d;
  return Math.max(outer - tube, outer * 0.55);
}

export function panScale(from: Pan, to: Pan) {
  const vFrom = panVolumeIn3(from);
  const vTo = panVolumeIn3(to);
  const volumeFactor = vTo / vFrom;
  const linearFactor = Math.cbrt(volumeFactor);
  return {
    fromVol: roundTo(vFrom, 1),
    toVol: roundTo(vTo, 1),
    volumeFactor: roundTo(volumeFactor, 3),
    linearFactor: roundTo(linearFactor, 3),
    fromCups: roundTo(vFrom / 14.4375, 2),
    toCups: roundTo(vTo / 14.4375, 2),
  };
}

export const COMMON_PANS: Array<{ label: string; pan: Pan }> = [
  { label: '8 in round × 2 in', pan: { kind: 'round', a: 8, b: 8, depth: 2 } },
  { label: '9 in round × 2 in', pan: { kind: 'round', a: 9, b: 9, depth: 2 } },
  { label: '9×13 in sheet × 2 in', pan: { kind: 'rect', a: 13, b: 9, depth: 2 } },
  { label: '8 in square × 2 in', pan: { kind: 'square', a: 8, b: 8, depth: 2 } },
  { label: '9 in square × 2 in', pan: { kind: 'square', a: 9, b: 9, depth: 2 } },
  { label: '10 in bundt × 3.5 in', pan: { kind: 'bundt', a: 10, b: 10, depth: 3.5 } },
  { label: '9×5 in loaf × 2.75 in', pan: { kind: 'loaf', a: 9, b: 5, depth: 2.75 } },
];
