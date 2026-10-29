import { clampNumber, roundTo } from '@/lib/makers/format';

/** Soy and paraffin occupy less mass than the same volume of water. */
export const WAX_FILL = {
  soy: { label: 'Soy', waterOzToWaxOz: 0.86 },
  paraffin: { label: 'Paraffin', waterOzToWaxOz: 0.9 },
  beeswax: { label: 'Beeswax', waterOzToWaxOz: 0.93 },
  coconut: { label: 'Coconut / soy blend', waterOzToWaxOz: 0.86 },
} as const;

export type WaxId = keyof typeof WAX_FILL;

export function calculateCandle(options: {
  containerOz: number;
  containers: number;
  wax: WaxId;
  fragrancePercent: number;
}) {
  const containerOz = clampNumber(options.containerOz, 0.5, 80);
  const containers = Math.round(clampNumber(options.containers, 1, 200));
  const fragrancePercent = clampNumber(options.fragrancePercent, 0, 15);
  const waxOz = containerOz * WAX_FILL[options.wax].waterOzToWaxOz * containers;
  const fragranceOz = waxOz * (fragrancePercent / 100);
  const waxWithHeadroom = waxOz * 1.1;
  return {
    waxOz: roundTo(waxOz, 2),
    waxG: roundTo(waxOz * 28.3495, 1),
    fragranceOz: roundTo(fragranceOz, 2),
    fragranceG: roundTo(fragranceOz * 28.3495, 1),
    waxWithHeadroomOz: roundTo(waxWithHeadroom, 2),
    waxWithHeadroomG: roundTo(waxWithHeadroom * 28.3495, 1),
  };
}
