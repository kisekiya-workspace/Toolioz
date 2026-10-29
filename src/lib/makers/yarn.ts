import { clampNumber, roundTo } from '@/lib/makers/format';

export type YarnWeight =
  | 'lace'
  | 'fingering'
  | 'sport'
  | 'dk'
  | 'worsted'
  | 'bulky'
  | 'super-bulky';

/** Approximate grams of fabric per square inch of stockinette / sc, at typical gauge. */
export const YARN_WEIGHTS: Record<YarnWeight, { label: string; gramsPerSqIn: number; defaultYdsPer100g: number }> = {
  lace: { label: 'Lace', gramsPerSqIn: 0.04, defaultYdsPer100g: 800 },
  fingering: { label: 'Fingering / 4-ply', gramsPerSqIn: 0.08, defaultYdsPer100g: 400 },
  sport: { label: 'Sport', gramsPerSqIn: 0.1, defaultYdsPer100g: 300 },
  dk: { label: 'DK', gramsPerSqIn: 0.12, defaultYdsPer100g: 245 },
  worsted: { label: 'Worsted / aran', gramsPerSqIn: 0.15, defaultYdsPer100g: 200 },
  bulky: { label: 'Bulky', gramsPerSqIn: 0.22, defaultYdsPer100g: 120 },
  'super-bulky': { label: 'Super bulky', gramsPerSqIn: 0.35, defaultYdsPer100g: 75 },
};

export type YarnProject = 'blanket' | 'scarf' | 'hat' | 'custom';

export const PROJECT_PRESETS: Record<YarnProject, { label: string; widthIn: number; lengthIn: number }> = {
  blanket: { label: 'Throw blanket', widthIn: 50, lengthIn: 60 },
  scarf: { label: 'Scarf', widthIn: 8, lengthIn: 70 },
  hat: { label: 'Adult hat', widthIn: 20, lengthIn: 9 },
  custom: { label: 'Custom size', widthIn: 40, lengthIn: 50 },
};

export function estimateYarn(options: {
  widthIn: number;
  lengthIn: number;
  weight: YarnWeight;
  yardsPer100g: number;
  extraPercent: number;
}) {
  const widthIn = clampNumber(options.widthIn, 1, 200);
  const lengthIn = clampNumber(options.lengthIn, 1, 400);
  const extraPercent = clampNumber(options.extraPercent, 0, 50);
  const yardsPer100g = clampNumber(options.yardsPer100g, 20, 2000);
  const area = widthIn * lengthIn;
  const grams = area * YARN_WEIGHTS[options.weight].gramsPerSqIn * (1 + extraPercent / 100);
  const yards = (grams / 100) * yardsPer100g;
  const meters = yards * 0.9144;
  const skeins100g = grams / 100;
  return {
    areaSqIn: roundTo(area, 1),
    grams: roundTo(grams, 1),
    ounces: roundTo(grams / 28.3495, 2),
    yards: roundTo(yards, 1),
    meters: roundTo(meters, 1),
    skeins100g: roundTo(skeins100g, 2),
  };
}
