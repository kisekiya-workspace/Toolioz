import { clampNumber, roundTo } from '@/lib/makers/format';

export function lumberBoardFeet(thicknessIn: number, widthIn: number, lengthFt: number, pieces = 1) {
  const t = clampNumber(thicknessIn, 0.25, 24);
  const w = clampNumber(widthIn, 0.5, 48);
  const L = clampNumber(lengthFt, 0.5, 40);
  const n = Math.round(clampNumber(pieces, 1, 500));
  return roundTo(((t * w * L) / 12) * n, 2);
}

export function doyle(diameterIn: number, lengthFt: number) {
  const D = clampNumber(diameterIn, 4, 80);
  const L = clampNumber(lengthFt, 1, 40);
  return roundTo((((D - 4) ** 2) * L) / 16, 2);
}

export function scribner(diameterIn: number, lengthFt: number) {
  const D = clampNumber(diameterIn, 4, 80);
  const L = clampNumber(lengthFt, 1, 40);
  return roundTo(((0.79 * D * D - 2 * D - 4) * L) / 16, 2);
}

export function internationalQuarter(diameterIn: number, lengthFt: number) {
  const D = clampNumber(diameterIn, 4, 80);
  const L = clampNumber(lengthFt, 1, 40);
  let total = 0;
  const fullSections = Math.floor(L / 4);
  for (let i = 0; i < fullSections; i += 1) {
    const d = Math.max(0, D - i * 0.5);
    total += 0.22 * d * d - 0.71 * d;
  }
  const rem = L % 4;
  if (rem > 0) {
    const d = Math.max(0, D - fullSections * 0.5);
    total += (0.22 * d * d - 0.71 * d) * (rem / 4);
  }
  return roundTo(Math.max(0, total), 2);
}
