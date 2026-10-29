import { clampNumber, roundTo } from '@/lib/makers/format';

export function printSize(options: { widthPx: number; heightPx: number; dpi: number }) {
  const w = clampNumber(options.widthPx, 1, 100000);
  const h = clampNumber(options.heightPx, 1, 100000);
  const dpi = clampNumber(options.dpi, 36, 1200);
  const widthIn = w / dpi;
  const heightIn = h / dpi;
  return {
    widthIn: roundTo(widthIn, 2),
    heightIn: roundTo(heightIn, 2),
    widthCm: roundTo(widthIn * 2.54, 2),
    heightCm: roundTo(heightIn * 2.54, 2),
    megapixels: roundTo((w * h) / 1_000_000, 2),
  };
}

export function pixelsNeeded(widthIn: number, heightIn: number, dpi: number) {
  const d = clampNumber(dpi, 36, 1200);
  return {
    widthPx: Math.round(clampNumber(widthIn, 0.1, 80) * d),
    heightPx: Math.round(clampNumber(heightIn, 0.1, 80) * d),
  };
}

export const PRINT_PRESETS = [
  { label: '4×6 in', w: 4, h: 6 },
  { label: '5×7 in', w: 5, h: 7 },
  { label: '8×10 in', w: 8, h: 10 },
  { label: 'A4', w: 8.27, h: 11.69 },
  { label: '11×14 in', w: 11, h: 14 },
  { label: 'A3', w: 11.69, h: 16.54 },
];
