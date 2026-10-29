import { clampNumber, roundTo } from '@/lib/makers/format';

export const ROLL_PRESETS = [
  { id: 'eu', label: 'Euro roll 10.05 m × 53 cm', lengthM: 10.05, widthM: 0.53 },
  { id: 'us', label: 'US roll 27 ft × 27 in', lengthM: 8.23, widthM: 0.686 },
  { id: 'uk', label: 'UK roll 10 m × 52 cm', lengthM: 10, widthM: 0.52 },
] as const;

export function wallpaperRolls(options: {
  wallWidthM: number;
  wallHeightM: number;
  rollLengthM: number;
  rollWidthM: number;
  repeatCm: number;
  pattern: 'straight' | 'half-drop' | 'none';
  wastePercent: number;
}) {
  const wallW = clampNumber(options.wallWidthM, 0.3, 80);
  const wallH = clampNumber(options.wallHeightM, 0.5, 8);
  const rollL = clampNumber(options.rollLengthM, 1, 30);
  const rollW = clampNumber(options.rollWidthM, 0.3, 1.5);
  const repeatM = clampNumber(options.repeatCm, 0, 200) / 100;
  const waste = clampNumber(options.wastePercent, 0, 30) / 100;
  const extra =
    options.pattern === 'none' || repeatM === 0 ? 0 : options.pattern === 'half-drop' ? repeatM / 2 : repeatM;
  const dropHeight = wallH + extra;
  const dropsPerRoll = Math.max(1, Math.floor(rollL / dropHeight));
  const dropsNeeded = Math.ceil(wallW / rollW);
  const baseRolls = Math.ceil(dropsNeeded / dropsPerRoll);
  const rolls = Math.max(baseRolls, Math.ceil(baseRolls * (1 + waste)));
  return {
    dropHeight: roundTo(dropHeight, 3),
    dropsPerRoll,
    dropsNeeded,
    rolls,
    areaM2: roundTo(wallW * wallH, 2),
  };
}
