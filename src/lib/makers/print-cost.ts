import { clampNumber, roundTo } from '@/lib/makers/format';
import { filamentGramsFromLength, filamentLengthMeters } from '@/lib/makers/filament';

export interface PrintCostInput {
  grams: number;
  hours: number;
  pricePerKg: number;
  watts: number;
  kwhRate: number;
  extra: number;
}

export function calculatePrintCost(raw: PrintCostInput) {
  const grams = clampNumber(raw.grams, 0, 20000);
  const hours = clampNumber(raw.hours, 0, 500);
  const pricePerKg = clampNumber(raw.pricePerKg, 0, 200);
  const watts = clampNumber(raw.watts, 0, 2000);
  const kwhRate = clampNumber(raw.kwhRate, 0, 5);
  const extra = clampNumber(raw.extra, 0, 1000);
  const filament = (grams / 1000) * pricePerKg;
  const kwh = (watts / 1000) * hours;
  const electricity = kwh * kwhRate;
  const total = filament + electricity + extra;
  return {
    filament: roundTo(filament, 2),
    electricity: roundTo(electricity, 2),
    kwh: roundTo(kwh, 3),
    extra: roundTo(extra, 2),
    total: roundTo(total, 2),
    grams: roundTo(grams, 1),
  };
}

export function parseGcodeUsage(text: string, density: number, diameterMm: number): { grams: number; hours: number; note: string } | null {
  const gramsMatch =
    text.match(/filament used\s*\[g\]\s*=\s*([\d.]+)/i) ||
    text.match(/total filament used\s*\[g\]\s*=\s*([\d.]+)/i) ||
    text.match(/;\s*filament used \(g\)\s*[:=]\s*([\d.]+)/i);
  const mmMatch =
    text.match(/filament used\s*\[mm\]\s*=\s*([\d.]+)/i) ||
    text.match(/filament used\s*=\s*([\d.]+)\s*mm/i);
  const mMatch = text.match(/filament used\s*=\s*([\d.]+)\s*m\b/i);
  const timeSeconds = text.match(/;\s*TIME:(\d+)/i);
  const timeHuman = text.match(/estimated printing time.*=\s*(?:(\d+)\s*h\s*)?(?:(\d+)\s*m\s*)?(?:(\d+)\s*s)?/i);

  let grams = 0;
  let note = '';
  if (gramsMatch) {
    grams = Number(gramsMatch[1]);
    note = 'Filament grams were read from a slicer comment.';
  } else if (mmMatch) {
    grams = filamentGramsFromLength(Number(mmMatch[1]) / 1000, density, diameterMm);
    note = 'Filament millimetres were converted with the chosen density and diameter.';
  } else if (mMatch) {
    grams = filamentGramsFromLength(Number(mMatch[1]), density, diameterMm);
    note = 'Filament metres were converted with the chosen density and diameter.';
  } else {
    return null;
  }

  let hours = 0;
  if (timeSeconds) {
    hours = Number(timeSeconds[1]) / 3600;
  } else if (timeHuman) {
    const h = Number(timeHuman[1] || 0);
    const m = Number(timeHuman[2] || 0);
    const s = Number(timeHuman[3] || 0);
    hours = h + m / 60 + s / 3600;
  }

  return { grams: roundTo(grams, 2), hours: roundTo(hours, 2), note };
}

export function lengthFromGrams(grams: number, density: number, diameterMm: number) {
  return roundTo(filamentLengthMeters(grams, density, diameterMm), 2);
}
