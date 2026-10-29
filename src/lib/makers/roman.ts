const MAP: Array<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRoman(n: number): string {
  let v = Math.floor(n);
  if (v <= 0 || v >= 4000) return '';
  let out = '';
  for (const [value, glyph] of MAP) {
    while (v >= value) {
      out += glyph;
      v -= value;
    }
  }
  return out;
}

export function fromRoman(input: string): number | null {
  const s = input.toUpperCase().replace(/[^MDCLXVI]/g, '');
  if (!s) return null;
  const lookup: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let total = 0;
  for (let i = 0; i < s.length; i += 1) {
    const cur = lookup[s[i]] ?? 0;
    const next = lookup[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}

export function dateToRoman(year: number, month: number, day: number, sep = '·') {
  const y = toRoman(year);
  const m = toRoman(month);
  const d = toRoman(day);
  return [d, m, y].filter(Boolean).join(sep);
}
