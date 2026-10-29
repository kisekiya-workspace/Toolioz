import { clampNumber, roundTo } from '@/lib/makers/format';

export const BED_PRESETS = [
  { id: 'crib', label: 'Crib', mattressW: 28, mattressL: 52, drop: 6 },
  { id: 'twin', label: 'Twin', mattressW: 39, mattressL: 75, drop: 12 },
  { id: 'full', label: 'Full / double', mattressW: 54, mattressL: 75, drop: 12 },
  { id: 'queen', label: 'Queen', mattressW: 60, mattressL: 80, drop: 12 },
  { id: 'king', label: 'King', mattressW: 76, mattressL: 80, drop: 12 },
  { id: 'cal-king', label: 'California king', mattressW: 72, mattressL: 84, drop: 12 },
] as const;

export function calculateQuilt(options: {
  blocksX: number;
  blocksY: number;
  blockIn: number;
  sashingIn: number;
  borderIn: number;
  dropIn: number;
  mattressW: number;
  mattressL: number;
}) {
  const blocksX = Math.round(clampNumber(options.blocksX, 1, 40));
  const blocksY = Math.round(clampNumber(options.blocksY, 1, 40));
  const blockIn = clampNumber(options.blockIn, 1, 40);
  const sashingIn = clampNumber(options.sashingIn, 0, 12);
  const borderIn = clampNumber(options.borderIn, 0, 24);
  const dropIn = clampNumber(options.dropIn, 0, 24);
  const bodyW = blocksX * blockIn + Math.max(0, blocksX - 1) * sashingIn;
  const bodyL = blocksY * blockIn + Math.max(0, blocksY - 1) * sashingIn;
  const quiltW = bodyW + borderIn * 2;
  const quiltL = bodyL + borderIn * 2;
  const finishedW = options.mattressW + dropIn * 2;
  const finishedL = options.mattressL + dropIn;
  return {
    bodyW: roundTo(bodyW, 2),
    bodyL: roundTo(bodyL, 2),
    quiltW: roundTo(quiltW, 2),
    quiltL: roundTo(quiltL, 2),
    quiltWcm: roundTo(quiltW * 2.54, 1),
    quiltLcm: roundTo(quiltL * 2.54, 1),
    targetW: roundTo(finishedW, 2),
    targetL: roundTo(finishedL, 2),
    widthDelta: roundTo(quiltW - finishedW, 2),
    lengthDelta: roundTo(quiltL - finishedL, 2),
  };
}
