export type ColorBand = {
  name: string;
  digit: number | null;
  multiplier: number;
  hex: string;
  tolerance?: number;
  tempco?: number;
};

export const COLOR_BANDS: ColorBand[] = [
  { name: 'black', digit: 0, multiplier: 1, hex: '#1a1a1a', tempco: 250 },
  { name: 'brown', digit: 1, multiplier: 10, hex: '#7a3f12', tolerance: 1, tempco: 100 },
  { name: 'red', digit: 2, multiplier: 100, hex: '#c43c2c', tolerance: 2, tempco: 50 },
  { name: 'orange', digit: 3, multiplier: 1000, hex: '#e67a1f', tempco: 15 },
  { name: 'yellow', digit: 4, multiplier: 10000, hex: '#e6c229', tempco: 25 },
  { name: 'green', digit: 5, multiplier: 100000, hex: '#2f8f4e', tolerance: 0.5, tempco: 20 },
  { name: 'blue', digit: 6, multiplier: 1e6, hex: '#2a5bd7', tolerance: 0.25, tempco: 10 },
  { name: 'violet', digit: 7, multiplier: 1e7, hex: '#6b3fd7', tolerance: 0.1, tempco: 5 },
  { name: 'grey', digit: 8, multiplier: 1e8, hex: '#8a8f98', tolerance: 0.05 },
  { name: 'white', digit: 9, multiplier: 1e9, hex: '#f4f4f5' },
  { name: 'gold', digit: null, multiplier: 0.1, hex: '#c9a227', tolerance: 5 },
  { name: 'silver', digit: null, multiplier: 0.01, hex: '#c0c4cc', tolerance: 10 },
];

export function resistorFromBands(digits: number[], multiplier: number, tolerance?: number) {
  const base = Number(digits.join(''));
  return { ohms: base * multiplier, tolerance };
}

export function formatOhms(ohms: number): string {
  if (ohms >= 1e6) return `${+(ohms / 1e6).toPrecision(4)} MΩ`;
  if (ohms >= 1e3) return `${+(ohms / 1e3).toPrecision(4)} kΩ`;
  return `${+ohms.toPrecision(4)} Ω`;
}

export function valueToBands(ohms: number, bands: 4 | 5) {
  if (ohms <= 0) return { digits: bands === 4 ? [1, 0] : [1, 0, 0], multiplier: 1 };
  const sig = bands === 4 ? 2 : 3;
  const exp = Math.floor(Math.log10(ohms)) - (sig - 1);
  const scaled = Math.round(ohms / 10 ** exp);
  const str = String(scaled).padStart(sig, '0').slice(0, sig);
  const digits = str.split('').map((d) => Number(d));
  return { digits, multiplier: 10 ** exp };
}
