/**
 * Freehand variable-width stroke outline engine
 * Based on drawesome by Benji Taylor (MIT License)
 */
import type { FreehandOptions, Point } from "./types";

type Vec = [number, number];

const FAST = 26;
const RESPONSE_DISTANCE = 14;
const MIN_RADIUS = 0.4;
const TAPER_FLOOR = 0.2;
const TAPER_TIP = 0.1;
const OVERLAP = 0.35;

const dist = (a: Point | Vec, b: Point | Vec) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

function noise(from: Point) {
  let h =
    (Math.round(from[0] * 16) * 374761393 +
      Math.round(from[1] * 16) * 668265263) |
    0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function add(ring: Vec[], into: Vec[][]) {
  let twice = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    twice += a[0] * b[1] - b[0] * a[1];
  }
  into.push(twice < 0 ? ring.reverse() : ring);
}

function disc(cx: number, cy: number, r: number, into: Vec[][]) {
  const steps = Math.max(
    10,
    Math.min(40, Math.ceil(Math.PI / Math.acos(Math.max(-1, 1 - 0.12 / r))))
  );
  const rr = r / Math.cos(Math.PI / steps);
  const ring: Vec[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    ring.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  add(ring, into);
}

function walk(points: Point[], streamline: number, step: number) {
  const t = 0.15 + (1 - streamline) * 0.85;
  const smooth: Point[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const p = smooth[smooth.length - 1];
    smooth.push([
      p[0] + (points[i][0] - p[0]) * t,
      p[1] + (points[i][1] - p[1]) * t,
      points[i][2],
    ]);
  }

  const speed: number[] = [0];
  for (let i = 1; i < smooth.length; i++)
    speed.push(dist(smooth[i], smooth[i - 1]));

  const out: { p: Vec; pressure: number; speed: number; along: number }[] = [];
  let along = 0;
  out.push({
    p: [smooth[0][0], smooth[0][1]],
    pressure: smooth[0][2] >= 0 ? smooth[0][2] : 0.5,
    speed: speed[0],
    along: 0,
  });

  let carry = 0;
  for (let i = 1; i < smooth.length; i++) {
    const a = smooth[i - 1];
    const b = smooth[i];
    const seg = dist(a, b);
    if (seg === 0) continue;
    let d = step - carry;
    while (d <= seg) {
      const f = d / seg;
      along += step;
      out.push({
        p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f],
        pressure: b[2] >= 0 ? b[2] : 0.5,
        speed: speed[i],
        along,
      });
      d += step;
    }
    carry = seg - (d - step);
  }

  const last = smooth[smooth.length - 1];
  const tail = out[out.length - 1];
  if (dist(tail.p, last) > 0.01) {
    out.push({
      p: [last[0], last[1]],
      pressure: last[2] >= 0 ? last[2] : 0.5,
      speed: speed[speed.length - 1],
      along: tail.along + dist(tail.p, last),
    });
  }
  return out;
}

export function getStroke(
  raw: Point[],
  options: FreehandOptions = {}
): Vec[][] {
  const {
    size = 16,
    thinning = 0.5,
    streamline = 0.5,
    easing = (t) => t,
    simulatePressure = true,
    taperStart = 0,
    taperEnd = 0,
    variance = 0,
    nibAngle = 0,
    nibContrast = 0,
    openAt = 1,
    flatEnds = false,
  } = options;

  if (size <= 0 || raw.length === 0) return [];

  const nib = size / 2;
  const rings: Vec[][] = [];
  const step = Math.max(0.6, Math.min(3, nib / 3));
  const pts = walk(raw, streamline, step);

  if (pts.length === 1) {
    const open = simulatePressure
      ? 1 - thinning + thinning * easing(Math.max(0, Math.min(1, openAt)))
      : 1;
    const r = taperStart > 0 ? nib * TAPER_FLOOR : nib * open;
    disc(pts[0].p[0], pts[0].p[1], Math.max(MIN_RADIUS, r), rings);
    return rings;
  }

  const total = pts[pts.length - 1].along;
  let scale = 1;
  let fadeIn = taperStart;
  let fadeOut = taperEnd;
  let bite = thinning;
  let pulse = (_along: number) => 1;

  if (variance > 0) {
    const rng = noise(raw[0]);
    scale = 0.92 + rng() * 0.16 * variance;
    const vTaper = variance * Math.min(total / 3, size * 1.5);
    fadeIn = Math.max(0, taperStart + (rng() - 0.5) * vTaper);
    fadeOut = Math.max(0, taperEnd + (rng() - 0.5) * vTaper);
    bite = Math.max(0, Math.min(0.9, thinning + (rng() - 0.5) * 0.2 * variance));
    const frequency = 0.008 + rng() * 0.012;
    const depth = variance * 0.06;
    const p1 = rng() * Math.PI * 2;
    const p2 = rng() * Math.PI * 2;
    pulse = (along) =>
      1 + (Math.sin(along * frequency + p1) + Math.cos(along * frequency * 1.7 + p2)) * depth;
  }

  const baseWidth = nib * scale;
  const radii: number[] = [];
  let currentR = baseWidth;

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i];
    let w = 1;

    if (simulatePressure) {
      const v = Math.min(FAST, pt.speed) / FAST;
      w = 1 - bite + bite * easing(1 - v);
    } else {
      const p = Math.max(0, Math.min(1, pt.pressure));
      w = 1 - bite + bite * easing(p);
    }

    let target = baseWidth * w * pulse(pt.along);

    if (fadeIn > 0 && pt.along < fadeIn) {
      const f = Math.max(0, pt.along / fadeIn);
      const taperR = baseWidth * (TAPER_TIP + f * (1 - TAPER_TIP));
      target = Math.min(target, taperR);
    }

    if (fadeOut > 0 && total - pt.along < fadeOut) {
      const f = Math.max(0, (total - pt.along) / fadeOut);
      const taperR = baseWidth * (TAPER_TIP + f * (1 - TAPER_TIP));
      target = Math.min(target, taperR);
    }

    target = Math.max(MIN_RADIUS, target);
    const alpha = Math.min(1, step / RESPONSE_DISTANCE);
    currentR += (target - currentR) * alpha;
    radii.push(currentR);
  }

  if (nibContrast > 0) {
    const angleRad = (nibAngle * Math.PI) / 180;
    const nx = Math.cos(angleRad);
    const ny = Math.sin(angleRad);

    for (let i = 0; i < pts.length; i++) {
      const prev = pts[Math.max(0, i - 1)];
      const next = pts[Math.min(pts.length - 1, i + 1)];
      const dx = next.p[0] - prev.p[0];
      const dy = next.p[1] - prev.p[1];
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const dot = Math.abs((dx / len) * nx + (dy / len) * ny);
        const factor = 1 - nibContrast * dot;
        radii[i] = Math.max(MIN_RADIUS, radii[i] * factor);
      }
    }
  }

  if (flatEnds) {
    const firstP = pts[0].p, lastP = pts[pts.length - 1].p;
    disc(firstP[0], firstP[1], radii[0], rings);
    disc(lastP[0], lastP[1], radii[radii.length - 1], rings);
  }

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i].p;
    const b = pts[i + 1].p;
    const ra = radii[i];
    const rb = radii[i + 1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.hypot(dx, dy);
    if (d === 0) continue;

    const ux = dx / d;
    const uy = dy / d;
    const px = -uy;
    const py = ux;

    const reachA = Math.min(d * OVERLAP, ra);
    const reachB = Math.min(d * OVERLAP, rb);

    const aBackX = a[0] - ux * reachA, aBackY = a[1] - uy * reachA;
    const bFwdX = b[0] + ux * reachB, bFwdY = b[1] + uy * reachB;

    add(
      [
        [aBackX + px * ra, aBackY + py * ra],
        [bFwdX + px * rb, bFwdY + py * rb],
        [bFwdX - px * rb, bFwdY - py * rb],
        [aBackX - px * ra, aBackY - py * ra],
      ],
      rings
    );
  }

  return rings;
}
