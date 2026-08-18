/**
 * Geometry calculations & SVG path generators
 * Based on drawesome by Benji Taylor (MIT License)
 */
import { getStroke } from "./freehand";
import { PEN_BY_ID } from "./pens";
import type { PenId, Point, StrokeShape } from "./types";

export function getSvgPathFromStroke(rings: number[][][]): string {
  let d = "";
  for (const ring of rings) {
    if (ring.length < 3) continue;
    d += `M${r(ring[0][0])},${r(ring[0][1])}`;
    for (let i = 1; i < ring.length; i++)
      d += `L${r(ring[i][0])},${r(ring[i][1])}`;
    d += "Z";
  }
  return d;
}

function r(n: number) {
  return Math.round(n * 10) / 10;
}

export function streamline(points: Point[], amount: number): Point[] {
  if (points.length < 3 || amount <= 0) return points;
  const t = 0.15 + (1 - amount) * 0.85;
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = out[i - 1];
    const p = points[i];
    out.push([
      prev[0] + (p[0] - prev[0]) * t,
      prev[1] + (p[1] - prev[1]) * t,
      p[2],
    ]);
  }
  return out;
}

export function strokePath(
  pen: PenId,
  size: number,
  points: Point[],
  isComplete = true,
  shape?: StrokeShape
): string {
  const preset = PEN_BY_ID[pen];
  const opts = preset.options(size);

  const outline = getStroke(points, {
    ...opts,
    ...(shape?.simulatePressure === undefined
      ? null
      : { simulatePressure: shape.simulatePressure }),
    ...(shape?.taper === undefined
      ? null
      : { taperStart: shape.taper, taperEnd: shape.taper }),
    ...(shape?.nibAngle === undefined ? null : { nibAngle: shape.nibAngle }),
    last: isComplete,
  });
  return getSvgPathFromStroke(outline);
}

export function dotRadius(size: number): number {
  return Math.max(0.75, size / 2);
}

let counter = 0;
export const nextId = () => ++counter;

export function polylinePath(points: Point[]): string {
  if (points.length === 0) return "";
  const rRound = (n: number) => Math.round(n * 100) / 100;
  if (points.length === 1) {
    return `M${rRound(points[0][0])} ${rRound(points[0][1])} l0.01 0.01`;
  }
  let d = `M${rRound(points[0][0])} ${rRound(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i][0] + points[i + 1][0]) / 2;
    const my = (points[i][1] + points[i + 1][1]) / 2;
    d += ` Q${rRound(points[i][0])} ${rRound(points[i][1])} ${rRound(mx)} ${rRound(my)}`;
  }
  const last = points[points.length - 1];
  d += ` L${rRound(last[0])} ${rRound(last[1])}`;
  return d;
}

export type WatercolorBloom = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

export function watercolorBlooms(
  points: Point[],
  size: number
): WatercolorBloom[] {
  if (points.length < 2) return [];

  const blooms: WatercolorBloom[] = [];
  const spacing = Math.max(14, size * 1.15);
  let distanceToNext = spacing * 0.7;
  let bloomIndex = 0;

  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const segmentLength = Math.hypot(dx, dy);
    if (!segmentLength) continue;

    let traveled = 0;
    while (traveled + distanceToNext <= segmentLength) {
      traveled += distanceToNext;
      const t = traveled / segmentLength;
      const x = from[0] + dx * t;
      const y = from[1] + dy * t;
      const hash = Math.abs(
        Math.sin(x * 12.9898 + y * 78.233 + bloomIndex * 37.719)
      );

      blooms.push({
        x,
        y,
        radius: size * (0.28 + hash * 0.24),
        opacity: 0.05 + hash * 0.07,
      });

      bloomIndex++;
      distanceToNext = spacing * (0.72 + hash * 0.7);
    }
    distanceToNext -= segmentLength - traveled;
  }

  return blooms;
}

export function eraseLayers(
  strokes: { erase?: boolean }[]
): { ink: number[]; erasers: number[] }[] {
  const eraserIndices = strokes
    .map((s, i) => (s.erase ? i : -1))
    .filter((i) => i >= 0);

  const layers: { ink: number[]; erasers: number[] }[] = [];
  let ink: number[] = [];

  strokes.forEach((s, i) => {
    if (s.erase) {
      if (ink.length) {
        layers.push({ ink, erasers: eraserIndices.filter((e) => e > i - 1) });
        ink = [];
      }
      return;
    }
    ink.push(i);
  });
  if (ink.length) layers.push({ ink, erasers: [] });
  return layers;
}
