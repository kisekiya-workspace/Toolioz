import { clampNumber, roundTo } from '@/lib/makers/format';

export type SliceStyle = 'party' | 'wedding';

export function roundCakeArea(diameterIn: number): number {
  const d = clampNumber(diameterIn, 3, 24);
  return Math.PI * (d / 2) ** 2;
}

export function rectCakeArea(widthIn: number, lengthIn: number): number {
  return clampNumber(widthIn, 3, 30) * clampNumber(lengthIn, 3, 30);
}

export function cakeServings(areaSqIn: number, style: SliceStyle): number {
  const slice = style === 'wedding' ? 2 : 4;
  return Math.max(1, Math.round(areaSqIn / slice));
}

export function tierServings(
  tiers: Array<{ kind: 'round' | 'rect'; a: number; b: number }>,
  style: SliceStyle,
) {
  const rows = tiers.map((tier) => {
    const area = tier.kind === 'round' ? roundCakeArea(tier.a) : rectCakeArea(tier.a, tier.b);
    return { area: roundTo(area, 1), servings: cakeServings(area, style) };
  });
  return {
    rows,
    total: rows.reduce((sum, row) => sum + row.servings, 0),
  };
}
