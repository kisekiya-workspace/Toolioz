import { clampNumber, roundTo } from '@/lib/makers/format';

function srgbToLinear(c: number) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number) {
  const x = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(clampNumber(x, 0, 1) * 255);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  const n = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
  const v = Number.parseInt(n.slice(0, 6), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => clampNumber(Math.round(c), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

export function rgbToOklch(r: number, g: number, b: number) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.hypot(a, b2);
  let H = (Math.atan2(b2, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}

export function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

const LIGHTNESS = [0.97, 0.93, 0.88, 0.8, 0.71, 0.62, 0.53, 0.44, 0.37, 0.29, 0.21];
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function tailwindShades(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  const { c, h } = rgbToOklch(r, g, b);
  return STOPS.map((stop, i) => {
    const chroma = c * (stop <= 100 ? 0.35 + stop / 200 : stop >= 900 ? 0.7 : 1);
    const rgb = oklchToRgb(LIGHTNESS[i], chroma, h);
    const value = rgbToHex(...rgb);
    return {
      stop,
      hex: value,
      oklch: `oklch(${roundTo(LIGHTNESS[i], 3)} ${roundTo(chroma, 3)} ${roundTo(h, 2)})`,
    };
  });
}

export function tailwindThemeCss(name: string, hex: string) {
  const shades = tailwindShades(hex);
  const lines = shades.map((row) => `  --color-${name}-${row.stop}: ${row.oklch};`);
  return `@theme {\n${lines.join('\n')}\n}`;
}
