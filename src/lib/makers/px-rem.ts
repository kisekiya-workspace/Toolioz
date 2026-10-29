import { clampNumber, roundTo } from '@/lib/makers/format';

export const COMMON_PX = [1, 2, 4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

export function pxToRem(px: number, root = 16) {
  const r = clampNumber(root, 8, 32);
  return roundTo(px / r, 4);
}

export function remToPx(rem: number, root = 16) {
  const r = clampNumber(root, 8, 32);
  return roundTo(rem * r, 3);
}

export function conversionTable(root = 16) {
  return COMMON_PX.map((px) => ({ px, rem: pxToRem(px, root), em: pxToRem(px, root) }));
}
