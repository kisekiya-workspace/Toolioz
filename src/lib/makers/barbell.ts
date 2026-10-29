import { clampNumber, roundTo } from '@/lib/makers/format';

export const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
export const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

export function plateStack(target: number, bar: number, plates: number[]) {
  let remaining = (clampNumber(target, bar, 1000) - bar) / 2;
  const perSide: Array<{ weight: number; count: number }> = [];
  for (const plate of plates) {
    const count = Math.floor((remaining + 1e-9) / plate);
    if (count > 0) {
      perSide.push({ weight: plate, count });
      remaining -= count * plate;
    }
  }
  const loaded = bar + perSide.reduce((sum, row) => sum + row.weight * row.count * 2, 0);
  return {
    perSide,
    loaded: roundTo(loaded, 2),
    leftover: roundTo(remaining * 2, 2),
  };
}
