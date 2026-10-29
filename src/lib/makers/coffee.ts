import { clampNumber, roundTo } from '@/lib/makers/format';

export const COFFEE_METHODS = [
  { id: 'pour-over', label: 'Pour-over / V60', ratio: 16, note: '1:16 is a common starting brew.' },
  { id: 'french-press', label: 'French press', ratio: 15, note: 'Coarse grind, 4 minute steep.' },
  { id: 'cold-brew', label: 'Cold brew concentrate', ratio: 8, note: 'Concentrate, usually diluted 1:1 later.' },
  { id: 'espresso', label: 'Espresso', ratio: 2, note: 'Yield is 2× dose as a typical ristretto-to-normale midpoint.' },
  { id: 'custom', label: 'Custom ratio', ratio: 16, note: 'Enter any brew ratio.' },
] as const;

export function coffeeFromRatio(coffeeG: number, waterG: number, ratio: number, lock: 'coffee' | 'water') {
  const r = clampNumber(ratio, 1, 30);
  if (lock === 'coffee') {
    const c = clampNumber(coffeeG, 1, 1000);
    return { coffeeG: roundTo(c, 1), waterG: roundTo(c * r, 1), ratio: roundTo(r, 2) };
  }
  const w = clampNumber(waterG, 10, 5000);
  return { coffeeG: roundTo(w / r, 1), waterG: roundTo(w, 1), ratio: roundTo(r, 2) };
}
