import { hexToRgb, rgbToHex } from '@/lib/makers/oklch';

type Matrix = [number, number, number, number, number, number, number, number, number];

const MATRICES: Record<string, Matrix> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
};

function apply(rgb: [number, number, number], m: Matrix): [number, number, number] {
  return [
    rgb[0] * m[0] + rgb[1] * m[1] + rgb[2] * m[2],
    rgb[0] * m[3] + rgb[1] * m[4] + rgb[2] * m[5],
    rgb[0] * m[6] + rgb[1] * m[7] + rgb[2] * m[8],
  ];
}

export function simulateHex(hex: string, kind: keyof typeof MATRICES): string {
  const rgb = apply(hexToRgb(hex), MATRICES[kind]);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

export { MATRICES };
