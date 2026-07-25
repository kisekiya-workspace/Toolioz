export type OutputPresetId =
  | 'auto'
  | 'square'
  | 'portrait-2-3'
  | 'portrait-4-5'
  | 'portrait-9-16'
  | 'landscape-16-9'
  | 'landscape-3-2';

export type OutputPreset = {
  id: OutputPresetId;
  label: string;
  width: number;
  height: number;
};

export const OUTPUT_PRESETS: OutputPreset[] = [
  { id: 'auto', label: 'Auto (keep aspect ratio, recommended)', width: 0, height: 0 },
  { id: 'square', label: 'Square 1:1 — 2432×2432', width: 2432, height: 2432 },
  { id: 'portrait-2-3', label: 'Portrait 2:3 — 1664×2432', width: 1664, height: 2432 },
  { id: 'portrait-4-5', label: 'Portrait 4:5 — 1946×2432', width: 1946, height: 2432 },
  { id: 'portrait-9-16', label: 'Portrait 9:16 — 1368×2432', width: 1368, height: 2432 },
  { id: 'landscape-16-9', label: 'Landscape 16:9 — 2432×1368', width: 2432, height: 1368 },
  { id: 'landscape-3-2', label: 'Landscape 3:2 — 2432×1621', width: 2432, height: 1621 },
];

/** 1 = checker hidden on feed; 0 = visible on feed before open */
export const TIMELINE_HIDDEN = 1 as const;
export const TIMELINE_VISIBLE = 0 as const;

export type FeedLineStyle =
  | { kind: 'darken'; factor: number }
  | { kind: 'solid'; r: number; g: number; b: number };

export type RevealEncodeOptions = {
  timelineMask: Uint8Array;
  feedLineMask: Uint8Array | null;
  openBrightness: number;
  openBoostEnabled: boolean;
  feedLineStyle: FeedLineStyle;
};

export const DEFAULT_FEED_LINE_STYLE: FeedLineStyle = { kind: 'darken', factor: 0.35 };

const EDGE_ANALYSIS_MAX_PX = 1024;

export function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

export function fitCanvasSize(
  sourceW: number,
  sourceH: number,
  preset: OutputPresetId,
): { width: number; height: number } {
  if (preset === 'auto') {
    const maxLong = 2432;
    const long = Math.max(sourceW, sourceH);
    const scale = long <= maxLong ? 1 : maxLong / long;
    return {
      width: Math.max(1, Math.round(sourceW * scale)),
      height: Math.max(1, Math.round(sourceH * scale)),
    };
  }
  const p = OUTPUT_PRESETS.find((x) => x.id === preset)!;
  return { width: p.width, height: p.height };
}

function computeCoverRect(sw: number, sh: number, dw: number, dh: number) {
  const destAspect = dw / dh;
  if (sw / sh > destAspect) {
    const w = sh * destAspect;
    return { sx: (sw - w) / 2, sy: 0, sWidth: w, sHeight: sh };
  }
  const h = sw / destAspect;
  return { sx: 0, sy: (sh - h) / 2, sWidth: sw, sHeight: h };
}

export function rasterizeCoverFit(
  img: HTMLImageElement,
  width: number,
  height: number,
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas unavailable');
  const rect = computeCoverRect(img.naturalWidth, img.naturalHeight, width, height);
  ctx.drawImage(img, rect.sx, rect.sy, rect.sWidth, rect.sHeight, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export function createHiddenTimelineMask(width: number, height: number): Uint8Array {
  const mask = new Uint8Array(width * height);
  mask.fill(TIMELINE_HIDDEN);
  return mask;
}

export function lineStrengthToThreshold(lineStrengthPercent: number): number {
  const t = Math.min(100, Math.max(0, lineStrengthPercent)) / 100;
  return Math.round(8 + 212 * (1 - t));
}

function clampByte(n: number) {
  return Math.min(255, Math.max(0, Math.round(n)));
}

function buildLuminanceGrid(data: Uint8ClampedArray, width: number, height: number): Float32Array {
  const grid = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    grid[i] = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
  }
  return grid;
}

function sobelEdges(luma: Float32Array, width: number, height: number, threshold: number): Uint8Array {
  const raw = new Uint8Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const gx =
        -luma[i - width - 1] -
        2 * luma[i - 1] -
        luma[i + width - 1] +
        luma[i - width + 1] +
        2 * luma[i + 1] +
        luma[i + width + 1];
      const gy =
        -luma[i - width - 1] -
        2 * luma[i - width] -
        luma[i + width - 1] +
        luma[i - width + 1] +
        2 * luma[i + width] +
        luma[i + width + 1];
      raw[i] = Math.hypot(gx, gy) >= threshold ? 1 : 0;
    }
  }
  return raw;
}

function dilateMask(raw: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  const r = Math.max(0, Math.floor(radius));
  if (r === 0) return raw;
  const out = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let hit = 0;
      for (let dy = -r; dy <= r && !hit; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= width) continue;
          if (raw[yy * width + xx] === 1) {
            hit = 1;
            break;
          }
        }
      }
      out[y * width + x] = hit;
    }
  }
  return out;
}

function upscaleBinaryMask(
  small: Uint8Array,
  smallW: number,
  smallH: number,
  fullW: number,
  fullH: number,
): Uint8Array {
  const out = new Uint8Array(fullW * fullH);
  for (let y = 0; y < fullH; y++) {
    const sy = Math.min(smallH - 1, Math.floor((y / fullH) * smallH));
    for (let x = 0; x < fullW; x++) {
      const sx = Math.min(smallW - 1, Math.floor((x / fullW) * smallW));
      out[y * fullW + x] = small[sy * smallW + sx];
    }
  }
  return out;
}

/** Fast feed line-art mask (downscaled Sobel, then upscaled). */
export function detectFeedLineArtMask(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
): Uint8Array {
  const long = Math.max(width, height);
  const scale = long > EDGE_ANALYSIS_MAX_PX ? EDGE_ANALYSIS_MAX_PX / long : 1;
  const sw = Math.max(1, Math.round(width * scale));
  const sh = Math.max(1, Math.round(height * scale));

  if (scale >= 1) {
    const luma = buildLuminanceGrid(pixels, width, height);
    return dilateMask(sobelEdges(luma, width, height, threshold), width, height, 1);
  }

  const small = new Uint8ClampedArray(sw * sh * 4);
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const fx = Math.min(width - 1, Math.floor((x / sw) * width));
      const fy = Math.min(height - 1, Math.floor((y / sh) * height));
      const si = (y * sw + x) * 4;
      const fi = (fy * width + fx) * 4;
      small[si] = pixels[fi];
      small[si + 1] = pixels[fi + 1];
      small[si + 2] = pixels[fi + 2];
      small[si + 3] = pixels[fi + 3];
    }
  }
  const luma = buildLuminanceGrid(small, sw, sh);
  const edges = dilateMask(sobelEdges(luma, sw, sh, threshold), sw, sh, 1);
  return upscaleBinaryMask(edges, sw, sh, width, height);
}

function applyOpenViewBoost(
  pixels: Uint8ClampedArray,
  checkerActive: Uint8Array,
  boost: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(pixels.length);
  const count = checkerActive.length;
  for (let s = 0; s < count; s++) {
    const n = s * 4;
    const factor = checkerActive[s] === 1 ? boost : 1;
    out[n] = pixels[n] * factor;
    out[n + 1] = pixels[n + 1] * factor;
    out[n + 2] = pixels[n + 2] * factor;
    out[n + 3] = pixels[n + 3];
  }
  return out;
}

function applyAlternatingAlphaMesh(
  pixels: Uint8ClampedArray,
  checkerActive: Uint8Array,
  width: number,
  height: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(pixels.length);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const n = row * width + col;
      const s = n * 4;
      out[s] = pixels[s];
      out[s + 1] = pixels[s + 1];
      out[s + 2] = pixels[s + 2];
      const checker = (col + row) & 1;
      const hidden = checkerActive[n] === 1;
      out[s + 3] = hidden && checker ? 0 : 255;
    }
  }
  return out;
}

export function encodeTimelineRevealRgba(
  raster: ImageData,
  options: RevealEncodeOptions,
): Uint8ClampedArray {
  const { width, height, data: sourcePixels } = raster;
  const pixelCount = width * height;
  if (options.timelineMask.length !== pixelCount) {
    throw new Error('timelineMask size mismatch');
  }

  const checkerActive = new Uint8Array(pixelCount);
  for (let n = 0; n < pixelCount; n++) {
    const onLine = options.feedLineMask != null && options.feedLineMask[n] === 1;
    checkerActive[n] = options.timelineMask[n] !== TIMELINE_HIDDEN || onLine ? 0 : 1;
  }

  const boost = options.openBoostEnabled ? options.openBrightness : 1;
  const boosted =
    boost > 1 ? applyOpenViewBoost(sourcePixels, checkerActive, boost) : sourcePixels;

  const result = applyAlternatingAlphaMesh(boosted, checkerActive, width, height);

  if (options.feedLineMask) {
    for (let n = 0; n < pixelCount; n++) {
      if (options.feedLineMask[n] !== 1) continue;
      const t = n * 4;
      const style = options.feedLineStyle;
      if (style.kind === 'darken') {
        result[t] = sourcePixels[t] * style.factor;
        result[t + 1] = sourcePixels[t + 1] * style.factor;
        result[t + 2] = sourcePixels[t + 2] * style.factor;
      } else {
        result[t] = style.r;
        result[t + 1] = style.g;
        result[t + 2] = style.b;
      }
      result[t + 3] = 255;
    }
  }

  return result;
}

export function simulateFeedThumbnail(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  blockSize = 2,
  alphaThreshold = 0.55,
): ImageData {
  const cols = Math.max(1, Math.ceil(width / blockSize));
  const rows = Math.max(1, Math.ceil(height / blockSize));
  const out = new Uint8ClampedArray(cols * rows * 4);
  const alphaCut = 255 * alphaThreshold;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let alphaSum = 0;
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let dy = 0; dy < blockSize; dy++) {
        const sy = row * blockSize + dy;
        if (sy >= height) continue;
        for (let dx = 0; dx < blockSize; dx++) {
          const sx = col * blockSize + dx;
          if (sx >= width) continue;
          const i = (sy * width + sx) * 4;
          const a = rgba[i + 3];
          const af = a / 255;
          alphaSum += a;
          rSum += rgba[i] * af;
          gSum += rgba[i + 1] * af;
          bSum += rgba[i + 2] * af;
        }
      }

      const o = (row * cols + col) * 4;
      const avgAlpha = alphaSum / (blockSize * blockSize);
      const premul = alphaSum / 255;
      if (premul > 0) {
        out[o] = rSum / premul;
        out[o + 1] = gSum / premul;
        out[o + 2] = bSum / premul;
      }
      out[o + 3] = avgAlpha >= alphaCut ? 255 : 0;
    }
  }

  return new ImageData(out, cols, rows);
}

export function buildOpenViewPreview(
  raster: ImageData,
  openBoostEnabled: boolean,
  openBrightness: number,
): ImageData {
  const out = new ImageData(raster.width, raster.height);
  const boost = openBoostEnabled ? openBrightness : 1;
  for (let i = 0; i < raster.data.length; i += 4) {
    out.data[i] = clampByte(raster.data[i] * boost);
    out.data[i + 1] = clampByte(raster.data[i + 1] * boost);
    out.data[i + 2] = clampByte(raster.data[i + 2] * boost);
    out.data[i + 3] = 255;
  }
  return out;
}

export function putRgbaOnCanvas(
  canvas: HTMLCanvasElement,
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height), 0, 0);
}

export function drawPreviewOnBackground(
  canvas: HTMLCanvasElement,
  source: HTMLCanvasElement,
  bg: string,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = source.width;
  canvas.height = source.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0);
}

export function syncCanvasBitmap(canvas: HTMLCanvasElement, width: number, height: number) {
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export function clientToCanvasPixel(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const rect = canvas.getBoundingClientRect();
  const cw = canvas.width;
  const ch = canvas.height;
  if (cw <= 0 || ch <= 0 || rect.width <= 0 || rect.height <= 0) return null;

  const scale = Math.min(rect.width / cw, rect.height / ch);
  const drawW = cw * scale;
  const drawH = ch * scale;
  const offsetX = rect.left + (rect.width - drawW) / 2;
  const offsetY = rect.top + (rect.height - drawH) / 2;

  const x = (clientX - offsetX) / scale;
  const y = (clientY - offsetY) / scale;
  if (x < 0 || y < 0 || x >= cw || y >= ch) return null;
  return { x, y };
}

export function buildTimelineVisibleOverlay(
  timelineMask: Uint8Array,
  width: number,
  height: number,
  opacity: number,
  rgb: { r: number; g: number; b: number } = { r: 59, g: 130, b: 246 },
): ImageData {
  const alpha = Math.round(Math.min(1, Math.max(0, opacity)) * 255);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < timelineMask.length; i++) {
    if (timelineMask[i] !== TIMELINE_VISIBLE) continue;
    const o = i * 4;
    data[o] = rgb.r;
    data[o + 1] = rgb.g;
    data[o + 2] = rgb.b;
    data[o + 3] = alpha;
  }
  return new ImageData(data, width, height);
}

export function paintMaskDisk(
  mask: Uint8Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  value: 0 | 1,
) {
  const r2 = radius * radius;
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(height - 1, Math.ceil(cy + radius));
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(width - 1, Math.ceil(cx + radius));
  for (let y = y0; y <= y1; y++) {
    const dy = y + 0.5 - cy;
    for (let x = x0; x <= x1; x++) {
      const dx = x + 0.5 - cx;
      if (dx * dx + dy * dy <= r2) {
        mask[y * width + x] = value;
      }
    }
  }
}

export function paintMaskStroke(
  mask: Uint8Array,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  radius: number,
  value: 0 | 1,
) {
  const dist = Math.hypot(x1 - x0, y1 - y0);
  const step = Math.max(1, radius * 0.35);
  const steps = Math.max(1, Math.ceil(dist / step));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    paintMaskDisk(
      mask,
      width,
      height,
      x0 + (x1 - x0) * t,
      y0 + (y1 - y0) * t,
      radius,
      value,
    );
  }
}

export async function encodePngBlob(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  format: 'png8' | 'rgba',
): Promise<Blob> {
  const UPNG = (await import('upng-js')).default;
  const copy = Uint8Array.from(rgba);
  const buffer = UPNG.encode([copy.buffer], width, height, format === 'png8' ? 256 : 0);
  return new Blob([buffer], { type: 'image/png' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function feedLineStyleFromPreset(preset: 'darken' | 'black' | 'white'): FeedLineStyle {
  switch (preset) {
    case 'black':
      return { kind: 'solid', r: 0, g: 0, b: 0 };
    case 'white':
      return { kind: 'solid', r: 255, g: 255, b: 255 };
    default:
      return DEFAULT_FEED_LINE_STYLE;
  }
}