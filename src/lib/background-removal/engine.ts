/** Independently authored classical cutout engine. No model, SDK, or network calls. */
export type Raster = { width: number; height: number; data: Uint8ClampedArray };
export type BrushStroke = { mode: 'keep' | 'remove'; radius: number; points: Array<[number, number]> };
export type Cutout = { mask: Float32Array; retained: number; warning: string | null };

function validate(image: Raster) {
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width < 1 || image.height < 1 || image.width * image.height > 16_000_000 || image.data.length !== image.width * image.height * 4) throw new Error('Invalid image dimensions or pixel buffer (maximum 16 megapixels).');
}

class Frontier {
  private nodes: number[] = [];
  private costs: number[] = [];
  get length() { return this.nodes.length; }
  push(node: number, cost: number) {
    let i = this.nodes.length;
    this.nodes.push(node); this.costs.push(cost);
    while (i > 0) {
      const p = (i - 1) >>> 1;
      if (this.costs[p] <= cost) break;
      this.nodes[i] = this.nodes[p]; this.costs[i] = this.costs[p]; i = p;
    }
    this.nodes[i] = node; this.costs[i] = cost;
  }
  pop(): [number, number] {
    const result: [number, number] = [this.nodes[0], this.costs[0]];
    const node = this.nodes.pop()!, cost = this.costs.pop()!;
    if (this.nodes.length) {
      let i = 0;
      while (i * 2 + 1 < this.nodes.length) {
        let c = i * 2 + 1;
        if (c + 1 < this.nodes.length && this.costs[c + 1] < this.costs[c]) c++;
        if (this.costs[c] >= cost) break;
        this.nodes[i] = this.nodes[c]; this.costs[i] = this.costs[c]; i = c;
      }
      this.nodes[i] = node; this.costs[i] = cost;
    }
    return result;
  }
}

const colorDistance = (a: number[], b: number[]) => Math.sqrt(0.28 * (a[0] - b[0]) ** 2 + 0.52 * (a[1] - b[1]) ** 2 + 0.20 * (a[2] - b[2]) ** 2) / 255;

/** Border palette + minimum-bottleneck connectivity. Enclosed pale details survive. */
export function segmentBackground(image: Raster, strength = 35): Cutout {
  validate(image);
  if (image.width * image.height > 800_000) throw new Error('Analyze a downscaled image, at most 800,000 pixels.');
  if (!Number.isFinite(strength) || strength < 0 || strength > 100) throw new Error('Invalid separation strength.');
  const { width: w, height: h, data } = image, count = w * h;
  const boundary: number[] = [];
  for (let x = 0; x < w; x++) { boundary.push(x); if (h > 1) boundary.push((h - 1) * w + x); }
  for (let y = 1; y < h - 1; y++) { boundary.push(y * w); if (w > 1) boundary.push(y * w + w - 1); }
  const samples = boundary.filter(i => data[i * 4 + 3] > 32).map(i => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  const mask = new Float32Array(count);
  if (!samples.length) {
    mask.fill(1);
    return { mask, retained: 1, warning: 'The image already has transparent borders. Use Remove to clean up any remaining background.' };
  }
  // Farthest-color initialization, then six centroid updates on border samples only.
  const centers = [samples[0].slice()];
  for (let k = 1; k < 8; k++) {
    let farthest = samples[0], distance = 0;
    for (const sample of samples) {
      const d = Math.min(...centers.map(c => colorDistance(sample, c)));
      if (d > distance) { distance = d; farthest = sample; }
    }
    if (distance < 0.035) break;
    centers.push(farthest.slice());
  }
  for (let iteration = 0; iteration < 6; iteration++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const sample of samples) {
      let best = 0, distance = Infinity;
      centers.forEach((c, k) => { const d = colorDistance(sample, c); if (d < distance) { distance = d; best = k; } });
      for (let c = 0; c < 3; c++) sums[best][c] += sample[c];
      sums[best][3]++;
    }
    centers.forEach((c, k) => { if (sums[k][3]) for (let j = 0; j < 3; j++) c[j] = sums[k][j] / sums[k][3]; });
  }
  const appearance = new Float32Array(count), reach = new Float32Array(count);
  reach.fill(Infinity);
  const frontier = new Frontier();
  for (let i = 0; i < count; i++) {
    const p = i * 4;
    appearance[i] = data[p + 3] < 16 ? 0 : Math.min(...centers.map(c => colorDistance([data[p], data[p + 1], data[p + 2]], c)));
    if (data[p + 3] === 0) { reach[i] = 0; frontier.push(i, 0); }
  }
  for (const i of boundary) if (reach[i] !== 0) { reach[i] = 0; frontier.push(i, 0); }
  while (frontier.length) {
    const [i, cost] = frontier.pop();
    if (cost > reach[i]) continue;
    const x = i % w, y = Math.floor(i / w);
    const visit = (j: number) => {
      const next = Math.max(cost, appearance[j]);
      if (next < reach[j]) { reach[j] = next; frontier.push(j, next); }
    };
    if (x > 0) visit(i - 1); if (x + 1 < w) visit(i + 1);
    if (y > 0) visit(i - w); if (y + 1 < h) visit(i + w);
  }
  const threshold = 0.025 + strength * 0.003, band = 0.025;
  let retained = 0;
  for (let i = 0; i < count; i++) {
    const t = Math.max(0, Math.min(1, (reach[i] - threshold + band) / (2 * band)));
    mask[i] = t * t * (3 - 2 * t); retained += mask[i];
  }
  retained /= count;
  return { mask, retained, warning: retained < 0.01 ? 'No distinct subject was found. Lower separation or use Keep to restore the subject.' : retained > 0.96 ? 'Very little background was identified. Increase separation or use Remove for manual cleanup.' : null };
}

/** Joint color/spatial reconstruction at source size, preserving source transparency. */
export function renderCutout(source: Raster, analysis: Raster, mask: Float32Array, strokes: BrushStroke[], softness = 1): Uint8ClampedArray {
  validate(source); validate(analysis);
  if (mask.length !== analysis.width * analysis.height || !Number.isFinite(softness) || softness < 0 || softness > 4) throw new Error('Invalid matte.');
  for (const stroke of strokes) {
    if (!['keep', 'remove'].includes(stroke.mode) || !Number.isFinite(stroke.radius) || stroke.radius <= 0 || stroke.radius > 1 || stroke.points.some(p => p.length !== 2 || p.some(v => !Number.isFinite(v) || v < 0 || v > 1))) throw new Error('Invalid brush stroke.');
  }
  const { width: w, height: h } = source, aw = analysis.width, ah = analysis.height;
  const output = new Uint8ClampedArray(source.data), alpha = new Float32Array(w * h);
  const radius = softness > 1 ? 2 : 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, p = i * 4;
    const ax = (x + 0.5) * aw / w - 0.5, ay = (y + 0.5) * ah / h - 0.5;
    let total = 0, weighted = 0;
    const nearest = Math.max(0, Math.min(ah - 1, Math.round(ay))) * aw + Math.max(0, Math.min(aw - 1, Math.round(ax)));
    if (softness === 0) { alpha[i] = mask[nearest]; continue; }
    for (let dy = -radius + 1; dy <= radius; dy++) for (let dx = -radius + 1; dx <= radius; dx++) {
      const nx = Math.max(0, Math.min(aw - 1, Math.floor(ax) + dx)), ny = Math.max(0, Math.min(ah - 1, Math.floor(ay) + dy));
      const j = ny * aw + nx, q = j * 4;
      const color = ((source.data[p] - analysis.data[q]) ** 2 + (source.data[p + 1] - analysis.data[q + 1]) ** 2 + (source.data[p + 2] - analysis.data[q + 2]) ** 2) / (3 * 255 ** 2);
      const spatial = (nx - ax) ** 2 + (ny - ay) ** 2;
      const weight = Math.exp(-spatial / (0.5 + softness) - color / 0.008);
      total += weight; weighted += mask[j] * weight;
    }
    alpha[i] = total > 1e-20 ? weighted / total : mask[nearest];
  }
  // Joined capsules make continuous strokes even when pointer events are sparse.
  for (const stroke of strokes) {
    const r = stroke.radius * Math.min(w, h);
    for (let k = 0; k < stroke.points.length; k++) {
      const a = stroke.points[Math.max(0, k - 1)], b = stroke.points[k];
      const x1 = a[0] * w, y1 = a[1] * h, x2 = b[0] * w, y2 = b[1] * h, length = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      for (let y = Math.max(0, Math.floor(Math.min(y1, y2) - r - 1)); y < Math.min(h, Math.ceil(Math.max(y1, y2) + r + 1)); y++) {
        for (let x = Math.max(0, Math.floor(Math.min(x1, x2) - r - 1)); x < Math.min(w, Math.ceil(Math.max(x1, x2) + r + 1)); x++) {
          const t = length ? Math.max(0, Math.min(1, ((x + 0.5 - x1) * (x2 - x1) + (y + 0.5 - y1) * (y2 - y1)) / length)) : 0;
          const d = Math.hypot(x + 0.5 - x1 - t * (x2 - x1), y + 0.5 - y1 - t * (y2 - y1));
          const coverage = Math.max(0, Math.min(1, r + 0.5 - d)), i = y * w + x;
          alpha[i] = alpha[i] * (1 - coverage) + (stroke.mode === 'keep' ? coverage : 0);
        }
      }
    }
  }
  for (let i = 0; i < alpha.length; i++) output[i * 4 + 3] = Math.round(source.data[i * 4 + 3] * alpha[i]);
  return output;
}
