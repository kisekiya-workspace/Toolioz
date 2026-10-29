import { clampNumber, roundTo } from '@/lib/makers/format';

export const FILAMENT_MATERIALS = [
  { id: 'pla', label: 'PLA', density: 1.24 },
  { id: 'petg', label: 'PETG', density: 1.27 },
  { id: 'abs', label: 'ABS', density: 1.04 },
  { id: 'asa', label: 'ASA', density: 1.07 },
  { id: 'tpu', label: 'TPU', density: 1.21 },
  { id: 'nylon', label: 'Nylon', density: 1.14 },
  { id: 'pc', label: 'Polycarbonate', density: 1.2 },
  { id: 'wood', label: 'Wood-fill PLA', density: 1.28 },
] as const;

export type FilamentId = (typeof FILAMENT_MATERIALS)[number]['id'];

export function filamentLengthMeters(grams: number, density: number, diameterMm: number): number {
  const mass = clampNumber(grams, 0, 20000);
  const rho = clampNumber(density, 0.5, 3);
  const diameter = clampNumber(diameterMm, 0.5, 4);
  const radiusCm = diameter / 20;
  const areaCm2 = Math.PI * radiusCm * radiusCm;
  const volumeCm3 = mass / rho;
  return volumeCm3 / areaCm2 / 100;
}

export function filamentGramsFromLength(meters: number, density: number, diameterMm: number): number {
  const lengthM = clampNumber(meters, 0, 5000);
  const rho = clampNumber(density, 0.5, 3);
  const diameter = clampNumber(diameterMm, 0.5, 4);
  const radiusCm = diameter / 20;
  const areaCm2 = Math.PI * radiusCm * radiusCm;
  const volumeCm3 = lengthM * 100 * areaCm2;
  return volumeCm3 * rho;
}

export function remainingOnSpool(options: {
  spoolGrams: number;
  remainingGrams: number;
  density: number;
  diameterMm: number;
}) {
  const fullM = filamentLengthMeters(options.spoolGrams, options.density, options.diameterMm);
  const leftM = filamentLengthMeters(options.remainingGrams, options.density, options.diameterMm);
  return {
    fullMeters: roundTo(fullM, 1),
    remainingMeters: roundTo(leftM, 1),
    remainingPercent: options.spoolGrams <= 0 ? 0 : roundTo((options.remainingGrams / options.spoolGrams) * 100, 1),
  };
}
