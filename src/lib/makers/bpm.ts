import { clampNumber, roundTo } from '@/lib/makers/format';

export const NOTE_VALUES = [
  { id: '1', label: '1/1', beats: 4 },
  { id: '1/2', label: '1/2', beats: 2 },
  { id: '1/4', label: '1/4', beats: 1 },
  { id: '1/8', label: '1/8', beats: 0.5 },
  { id: '1/16', label: '1/16', beats: 0.25 },
  { id: '1/32', label: '1/32', beats: 0.125 },
] as const;

export function bpmToMs(bpm: number, beats: number, kind: 'straight' | 'dotted' | 'triplet') {
  const b = clampNumber(bpm, 20, 400);
  const quarter = 60000 / b;
  let ms = quarter * beats;
  if (kind === 'dotted') ms *= 1.5;
  if (kind === 'triplet') ms *= 2 / 3;
  return roundTo(ms, 2);
}

export function hzFromBpm(bpm: number) {
  return roundTo(clampNumber(bpm, 20, 400) / 60, 4);
}

export function tapBpm(intervalsMs: number[]): number {
  if (intervalsMs.length === 0) return 0;
  const recent = intervalsMs.slice(-8);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  if (avg <= 0) return 0;
  return roundTo(clampNumber(60000 / avg, 20, 400), 1);
}
