import { clampNumber, litresToGallonsUS, roundTo } from '@/lib/makers/format';

export const AQUARIUM_SHAPES = [
  { slug: 'rectangular', label: 'Rectangular', keyword: 'aquarium volume calculator' },
  { slug: 'bowfront', label: 'Bowfront', keyword: 'aquarium volume calculator bowfront' },
  { slug: 'cylinder', label: 'Cylinder', keyword: 'cylinder aquarium volume calculator' },
  { slug: 'hexagon', label: 'Hexagon', keyword: 'hexagon aquarium volume calculator' },
  { slug: 'corner', label: 'Corner', keyword: 'corner aquarium volume calculator' },
] as const;

export type AquariumSlug = (typeof AQUARIUM_SHAPES)[number]['slug'];

export function aquariumLitres(options: {
  shape: AquariumSlug;
  length: number;
  width: number;
  height: number;
  bulge?: number;
  unit: 'cm' | 'in';
}) {
  const toCm = options.unit === 'in' ? 2.54 : 1;
  const L = clampNumber(options.length, 1, 400) * toCm;
  const W = clampNumber(options.width, 1, 400) * toCm;
  const H = clampNumber(options.height, 1, 200) * toCm;
  const bulge = clampNumber(options.bulge ?? 0, 0, 80) * toCm;
  let cm3 = 0;
  if (options.shape === 'rectangular') cm3 = L * W * H;
  else if (options.shape === 'bowfront') cm3 = L * W * H + (Math.PI * L * bulge * H) / 4;
  else if (options.shape === 'cylinder') cm3 = Math.PI * (L / 2) ** 2 * H;
  else if (options.shape === 'hexagon') cm3 = ((3 * Math.sqrt(3)) / 2) * (L / 2) ** 2 * H;
  else cm3 = 0.5 * L * W * H;
  const litres = cm3 / 1000;
  return {
    litres: roundTo(litres, 1),
    gallonsUS: roundTo(litresToGallonsUS(litres), 1),
    gallonsUK: roundTo(litres / 4.54609, 1),
    kg: roundTo(litres, 1),
  };
}

export function substrateLitres(length: number, width: number, depth: number, unit: 'cm' | 'in', shape: AquariumSlug) {
  const toCm = unit === 'in' ? 2.54 : 1;
  const L = clampNumber(length, 1, 400) * toCm;
  const W = clampNumber(width, 1, 400) * toCm;
  const D = clampNumber(depth, 0.5, 40) * toCm;
  let base = L * W;
  if (shape === 'cylinder') base = Math.PI * (L / 2) ** 2;
  else if (shape === 'hexagon') base = ((3 * Math.sqrt(3)) / 2) * (L / 2) ** 2;
  else if (shape === 'corner') base = 0.5 * L * W;
  return roundTo((base * D) / 1000, 2);
}
