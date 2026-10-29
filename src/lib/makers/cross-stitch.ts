import { clampNumber, roundTo } from '@/lib/makers/format';

export type FabricKind = 'aida' | 'evenweave' | 'linen';

export function fabricStitchesPerInch(count: number, over: 1 | 2): number {
  return clampNumber(count, 6, 40) / over;
}

export function calculateCrossStitchFabric(options: {
  stitchesX: number;
  stitchesY: number;
  count: number;
  over: 1 | 2;
  marginIn: number;
}) {
  const stitchesX = clampNumber(options.stitchesX, 1, 2000);
  const stitchesY = clampNumber(options.stitchesY, 1, 2000);
  const spi = fabricStitchesPerInch(options.count, options.over);
  const designWidthIn = stitchesX / spi;
  const designHeightIn = stitchesY / spi;
  const marginIn = clampNumber(options.marginIn, 0, 12);
  const cutWidthIn = designWidthIn + marginIn * 2;
  const cutHeightIn = designHeightIn + marginIn * 2;
  return {
    spi: roundTo(spi, 3),
    designWidthIn: roundTo(designWidthIn, 2),
    designHeightIn: roundTo(designHeightIn, 2),
    designWidthCm: roundTo(designWidthIn * 2.54, 1),
    designHeightCm: roundTo(designHeightIn * 2.54, 1),
    cutWidthIn: roundTo(cutWidthIn, 2),
    cutHeightIn: roundTo(cutHeightIn, 2),
    cutWidthCm: roundTo(cutWidthIn * 2.54, 1),
    cutHeightCm: roundTo(cutHeightIn * 2.54, 1),
  };
}
