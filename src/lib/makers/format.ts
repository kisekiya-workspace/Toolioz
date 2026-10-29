export function roundTo(value: number, digits = 2): number {
  if (!Number.isFinite(value)) return 0;
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

export function fmtNum(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '—';
  return roundTo(value, digits).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function inToCm(inches: number): number {
  return inches * 2.54;
}

export function cmToIn(cm: number): number {
  return cm / 2.54;
}

export function litresToGallonsUS(litres: number): number {
  return litres / 3.785411784;
}

export function gallonsUSToLitres(gallons: number): number {
  return gallons * 3.785411784;
}
