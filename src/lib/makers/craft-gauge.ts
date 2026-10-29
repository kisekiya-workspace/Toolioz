import { clampNumber, roundTo } from '@/lib/makers/format';

export type CraftKind = 'knitting' | 'crochet';

export interface GaugeInput {
  swatchStitches: number;
  swatchRows: number;
  swatchWidth: number;
  swatchHeight: number;
  targetWidth: number;
  targetHeight: number;
  patternStitches: number;
  patternRows: number;
  patternWidth: number;
  patternHeight: number;
}

export interface GaugeResult {
  stitchesPerUnit: number;
  rowsPerUnit: number;
  targetStitches: number;
  targetRows: number;
  stitchFactor: number;
  rowFactor: number;
  adjustedPatternStitches: number;
  adjustedPatternRows: number;
  sizeChangePercent: number;
}

export function calculateGauge(raw: GaugeInput): GaugeResult {
  const swatchStitches = clampNumber(raw.swatchStitches, 1, 400);
  const swatchRows = clampNumber(raw.swatchRows, 1, 400);
  const swatchWidth = clampNumber(raw.swatchWidth, 0.25, 100);
  const swatchHeight = clampNumber(raw.swatchHeight, 0.25, 100);
  const targetWidth = clampNumber(raw.targetWidth, 0.25, 400);
  const targetHeight = clampNumber(raw.targetHeight, 0.25, 400);
  const patternStitches = clampNumber(raw.patternStitches, 1, 2000);
  const patternRows = clampNumber(raw.patternRows, 1, 4000);
  const patternWidth = clampNumber(raw.patternWidth, 0.25, 100);
  const patternHeight = clampNumber(raw.patternHeight, 0.25, 100);

  const stitchesPerUnit = swatchStitches / swatchWidth;
  const rowsPerUnit = swatchRows / swatchHeight;
  const patternStitchesPerUnit = patternStitches / patternWidth;
  const patternRowsPerUnit = patternRows / patternHeight;

  const stitchFactor = stitchesPerUnit / patternStitchesPerUnit;
  const rowFactor = rowsPerUnit / patternRowsPerUnit;
  const sizeChangePercent = (patternStitchesPerUnit / stitchesPerUnit - 1) * 100;

  return {
    stitchesPerUnit: roundTo(stitchesPerUnit, 3),
    rowsPerUnit: roundTo(rowsPerUnit, 3),
    targetStitches: Math.round(stitchesPerUnit * targetWidth),
    targetRows: Math.round(rowsPerUnit * targetHeight),
    stitchFactor: roundTo(stitchFactor, 4),
    rowFactor: roundTo(rowFactor, 4),
    adjustedPatternStitches: Math.round(patternStitches * stitchFactor),
    adjustedPatternRows: Math.round(patternRows * rowFactor),
    sizeChangePercent: roundTo(sizeChangePercent, 1),
  };
}

export const GAUGE_DEFAULTS: GaugeInput = {
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
};
