export type DitherAlgorithm =
  | 'floyd-steinberg'
  | 'bayer-4x4'
  | 'bayer-8x8'
  | 'atkinson'
  | 'sierra-lite'
  | 'halftone'
  | 'ascii-blocks'
  | 'ascii-text'
  | 'threshold';

export type PaletteId =
  | 'monochrome'
  | 'gameboy'
  | 'cga'
  | 'cyberpunk'
  | 'c64'
  | 'amber-monitor'
  | 'custom';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface AlgorithmCategory {
  categoryName: string;
  items: Array<{ id: DitherAlgorithm; label: string; desc: string }>;
}

export const ALGORITHM_CATEGORIES: AlgorithmCategory[] = [
  {
    categoryName: 'Error Diffusion',
    items: [
      { id: 'floyd-steinberg', label: 'Floyd-Steinberg', desc: 'Classic 75% error diffusion for smooth gradients' },
      { id: 'atkinson', label: 'Atkinson', desc: 'Macintosh 1984 high-contrast 1-bit style' },
      { id: 'sierra-lite', label: 'Sierra Lite', desc: 'Fast crisp-edge error diffusion' },
    ],
  },
  {
    categoryName: 'Ordered & Pattern',
    items: [
      { id: 'bayer-4x4', label: 'Bayer 4x4', desc: 'Iconic retro cross-hatching matrix' },
      { id: 'bayer-8x8', label: 'Bayer 8x8', desc: 'Dense retro ordered dithering grid' },
      { id: 'threshold', label: 'Threshold', desc: 'Direct nearest-color quantization' },
    ],
  },
  {
    categoryName: 'Artistic & Halftone',
    items: [
      { id: 'halftone', label: 'Halftone Screen', desc: 'CMYK print-style dot screen matrix' },
      { id: 'ascii-blocks', label: 'ASCII Blocks', desc: 'Shaded block symbols (░▒▓█)' },
      { id: 'ascii-text', label: 'ASCII Character Matrix', desc: 'Classic terminal text matrix (.:-=+*#%@)' },
    ],
  },
];

export const PALETTES: Record<PaletteId, { name: string; colors: RGB[] }> = {
  monochrome: {
    name: '1-Bit Monochrome',
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  gameboy: {
    name: 'Game Boy Classic',
    colors: [
      { r: 15, g: 56, b: 15 },
      { r: 48, g: 98, b: 48 },
      { r: 139, g: 172, b: 15 },
      { r: 155, g: 188, b: 15 },
    ],
  },
  cga: {
    name: 'CGA Retro',
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 85, g: 255, b: 255 },
      { r: 255, g: 85, b: 255 },
      { r: 255, g: 255, b: 255 },
    ],
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    colors: [
      { r: 5, g: 5, b: 13 },
      { r: 0, g: 255, b: 204 },
      { r: 255, g: 0, b: 85 },
      { r: 255, g: 238, b: 0 },
    ],
  },
  c64: {
    name: 'Commodore 64',
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 136, g: 0, b: 0 },
      { r: 170, g: 238, b: 171 },
      { r: 204, g: 68, b: 204 },
      { r: 5, g: 204, b: 85 },
      { r: 0, g: 0, b: 170 },
      { r: 238, g: 238, b: 119 },
      { r: 221, g: 136, b: 85 },
      { r: 102, g: 68, b: 0 },
      { r: 255, g: 119, b: 119 },
      { r: 51, g: 51, b: 51 },
      { r: 119, g: 119, b: 119 },
      { r: 170, g: 255, b: 102 },
      { r: 0, g: 136, b: 255 },
      { r: 187, g: 187, b: 187 },
    ],
  },
  'amber-monitor': {
    name: 'Amber CRT Screen',
    colors: [
      { r: 10, g: 5, b: 0 },
      { r: 180, g: 90, b: 0 },
      { r: 255, g: 176, b: 0 },
    ],
  },
  custom: {
    name: 'Custom Palette',
    colors: [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ],
  },
};

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export function findClosestColor(color: RGB, palette: RGB[]): RGB {
  let minDistance = Infinity;
  let closest = palette[0];

  for (let i = 0; i < palette.length; i++) {
    const p = palette[i];
    const dr = color.r - p.r;
    const dg = color.g - p.g;
    const db = color.b - p.b;
    const dist = dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114;

    if (dist < minDistance) {
      minDistance = dist;
      closest = p;
    }
  }

  return closest;
}

export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RGB): string {
  return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

export interface DitherOptions {
  algorithm: DitherAlgorithm;
  palette: RGB[];
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  errorDiffusionAmount?: number; // 0 to 1
}

export function processDitherImageData(
  imageData: ImageData,
  options: DitherOptions
): ImageData {
  const { width, height, data } = imageData;
  const {
    algorithm,
    palette,
    brightness = 0,
    contrast = 0,
    errorDiffusionAmount = 1,
  } = options;

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const brightnessOffset = (brightness / 100) * 255;

  const bufferR = new Float32Array(width * height);
  const bufferG = new Float32Array(width * height);
  const bufferB = new Float32Array(width * height);
  const bufferA = new Uint8ClampedArray(width * height);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    let r = data[idx];
    let g = data[idx + 1];
    let b = data[idx + 2];

    r = contrastFactor * (r - 128) + 128 + brightnessOffset;
    g = contrastFactor * (g - 128) + 128 + brightnessOffset;
    b = contrastFactor * (b - 128) + 128 + brightnessOffset;

    bufferR[i] = Math.max(0, Math.min(255, r));
    bufferG[i] = Math.max(0, Math.min(255, g));
    bufferB[i] = Math.max(0, Math.min(255, b));
    bufferA[i] = data[idx + 3];
  }

  const output = new ImageData(width, height);
  const outData = output.data;

  // 1. Halftone Screen Dithering
  if (algorithm === 'halftone') {
    const cellSize = 6;
    const darkColor = palette[0] || { r: 0, g: 0, b: 0 };
    const lightColor = palette[palette.length - 1] || { r: 255, g: 255, b: 255 };

    // Fill background with light color
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      outData[idx] = lightColor.r;
      outData[idx + 1] = lightColor.g;
      outData[idx + 2] = lightColor.b;
      outData[idx + 3] = bufferA[i];
    }

    const halfCell = cellSize / 2;
    for (let cy = halfCell; cy < height; cy += cellSize) {
      for (let cx = halfCell; cx < width; cx += cellSize) {
        let totalLum = 0;
        let count = 0;
        for (let dy = -halfCell; dy < halfCell; dy++) {
          for (let dx = -halfCell; dx < halfCell; dx++) {
            const px = Math.floor(cx + dx);
            const py = Math.floor(cy + dy);
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const pi = py * width + px;
              totalLum += bufferR[pi] * 0.299 + bufferG[pi] * 0.587 + bufferB[pi] * 0.114;
              count++;
            }
          }
        }

        const avgLum = count > 0 ? totalLum / count : 128;
        const maxRadius = halfCell * 1.2;
        const radius = (1 - avgLum / 255) * maxRadius;

        for (let dy = -halfCell; dy < halfCell; dy++) {
          for (let dx = -halfCell; dx < halfCell; dx++) {
            const px = Math.floor(cx + dx);
            const py = Math.floor(cy + dy);
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist <= radius) {
                const pi = py * width + px;
                const outIdx = pi * 4;
                outData[outIdx] = darkColor.r;
                outData[outIdx + 1] = darkColor.g;
                outData[outIdx + 2] = darkColor.b;
              }
            }
          }
        }
      }
    }
    return output;
  }

  // 2. ASCII Blocks (░▒▓█) and ASCII Character Text Matrix
  if (algorithm === 'ascii-blocks' || algorithm === 'ascii-text') {
    const darkColor = palette[0] || { r: 0, g: 0, b: 0 };
    const lightColor = palette[palette.length - 1] || { r: 255, g: 255, b: 255 };

    const chars =
      algorithm === 'ascii-blocks'
        ? [' ', '░', '▒', '▓', '█']
        : [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const lum = bufferR[i] * 0.299 + bufferG[i] * 0.587 + bufferB[i] * 0.114;
        const charIdx = Math.floor((lum / 255) * (chars.length - 1));
        const outIdx = i * 4;

        // Render intensity pattern directly based on char index threshold
        if (charIdx === 0) {
          outData[outIdx] = darkColor.r;
          outData[outIdx + 1] = darkColor.g;
          outData[outIdx + 2] = darkColor.b;
        } else if (charIdx === chars.length - 1) {
          outData[outIdx] = lightColor.r;
          outData[outIdx + 1] = lightColor.g;
          outData[outIdx + 2] = lightColor.b;
        } else {
          // Checkerboard pattern for intermediate ASCII levels
          const pattern = (x + y) % (chars.length - charIdx) === 0;
          const chosen = pattern ? lightColor : darkColor;
          outData[outIdx] = chosen.r;
          outData[outIdx + 1] = chosen.g;
          outData[outIdx + 2] = chosen.b;
        }
        outData[outIdx + 3] = bufferA[i];
      }
    }
    return output;
  }

  // 3. Thresholding
  if (algorithm === 'threshold') {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const current: RGB = {
          r: bufferR[i],
          g: bufferG[i],
          b: bufferB[i],
        };
        const closest = findClosestColor(current, palette);
        const outIdx = i * 4;
        outData[outIdx] = closest.r;
        outData[outIdx + 1] = closest.g;
        outData[outIdx + 2] = closest.b;
        outData[outIdx + 3] = bufferA[i];
      }
    }
    return output;
  }

  // 4. Bayer Ordered Dithering (4x4 & 8x8)
  if (algorithm === 'bayer-4x4' || algorithm === 'bayer-8x8') {
    const matrix = algorithm === 'bayer-4x4' ? BAYER_4X4 : BAYER_8X8;
    const matrixSize = algorithm === 'bayer-4x4' ? 4 : 8;
    const maxVal = matrixSize * matrixSize;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const threshold = (matrix[y % matrixSize][x % matrixSize] / maxVal - 0.5) * 64;

        const current: RGB = {
          r: Math.max(0, Math.min(255, bufferR[i] + threshold)),
          g: Math.max(0, Math.min(255, bufferG[i] + threshold)),
          b: Math.max(0, Math.min(255, bufferB[i] + threshold)),
        };

        const closest = findClosestColor(current, palette);
        const outIdx = i * 4;
        outData[outIdx] = closest.r;
        outData[outIdx + 1] = closest.g;
        outData[outIdx + 2] = closest.b;
        outData[outIdx + 3] = bufferA[i];
      }
    }
    return output;
  }

  // 5. Error diffusion routines (Floyd-Steinberg, Atkinson, Sierra-Lite)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const current: RGB = {
        r: Math.max(0, Math.min(255, bufferR[i])),
        g: Math.max(0, Math.min(255, bufferG[i])),
        b: Math.max(0, Math.min(255, bufferB[i])),
      };

      const closest = findClosestColor(current, palette);
      const outIdx = i * 4;
      outData[outIdx] = closest.r;
      outData[outIdx + 1] = closest.g;
      outData[outIdx + 2] = closest.b;
      outData[outIdx + 3] = bufferA[i];

      const errR = (current.r - closest.r) * errorDiffusionAmount;
      const errG = (current.g - closest.g) * errorDiffusionAmount;
      const errB = (current.b - closest.b) * errorDiffusionAmount;

      const distribute = (dx: number, dy: number, factor: number) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const ni = ny * width + nx;
          bufferR[ni] += errR * factor;
          bufferG[ni] += errG * factor;
          bufferB[ni] += errB * factor;
        }
      };

      if (algorithm === 'floyd-steinberg') {
        distribute(1, 0, 7 / 16);
        distribute(-1, 1, 3 / 16);
        distribute(0, 1, 5 / 16);
        distribute(1, 1, 1 / 16);
      } else if (algorithm === 'atkinson') {
        distribute(1, 0, 1 / 8);
        distribute(2, 0, 1 / 8);
        distribute(-1, 1, 1 / 8);
        distribute(0, 1, 1 / 8);
        distribute(1, 1, 1 / 8);
        distribute(0, 2, 1 / 8);
      } else if (algorithm === 'sierra-lite') {
        distribute(1, 0, 2 / 4);
        distribute(-1, 1, 1 / 4);
        distribute(0, 1, 1 / 4);
      }
    }
  }

  return output;
}
