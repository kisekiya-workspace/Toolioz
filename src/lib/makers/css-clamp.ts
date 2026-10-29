import { clampNumber, roundTo } from '@/lib/makers/format';

export function fluidClamp(options: {
  minPx: number;
  maxPx: number;
  minVw: number;
  maxVw: number;
  rootPx: number;
}) {
  const minPx = clampNumber(options.minPx, 1, 400);
  const maxPx = clampNumber(options.maxPx, 1, 400);
  const minVw = clampNumber(options.minVw, 200, 2000);
  const maxVw = clampNumber(options.maxVw, 200, 2000);
  const root = clampNumber(options.rootPx, 10, 24);
  const span = Math.max(1, maxVw - minVw);
  const slope = (maxPx - minPx) / span;
  const intercept = minPx - slope * minVw;
  const preferred = `${roundTo(intercept, 4)}px + ${roundTo(slope * 100, 4)}vw`;
  const cssPx = `clamp(${roundTo(minPx, 3)}px, ${preferred}, ${roundTo(maxPx, 3)}px)`;
  const cssRem = `clamp(${roundTo(minPx / root, 4)}rem, ${roundTo(intercept / root, 4)}rem + ${roundTo(slope * 100, 4)}vw, ${roundTo(maxPx / root, 4)}rem)`;
  return { slope: roundTo(slope, 6), intercept: roundTo(intercept, 4), preferred, cssPx, cssRem };
}

export const TYPE_RATIOS = [
  { id: 'minor-second', label: 'Minor second 1.067', ratio: 1.067 },
  { id: 'major-second', label: 'Major second 1.125', ratio: 1.125 },
  { id: 'minor-third', label: 'Minor third 1.2', ratio: 1.2 },
  { id: 'major-third', label: 'Major third 1.25', ratio: 1.25 },
  { id: 'perfect-fourth', label: 'Perfect fourth 1.333', ratio: 4 / 3 },
  { id: 'augmented-fourth', label: 'Augmented fourth 1.414', ratio: Math.SQRT2 },
  { id: 'perfect-fifth', label: 'Perfect fifth 1.5', ratio: 1.5 },
  { id: 'golden', label: 'Golden ratio 1.618', ratio: 1.618 },
] as const;

export function typeScale(basePx: number, ratio: number, steps = 8) {
  const base = clampNumber(basePx, 10, 32);
  const r = clampNumber(ratio, 1.05, 2);
  return Array.from({ length: steps }, (_, i) => {
    const px = base * r ** (i - 1);
    return { step: i - 1, px: roundTo(px, 2), rem: roundTo(px / 16, 4) };
  });
}
