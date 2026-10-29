import { clampNumber, roundTo } from '@/lib/makers/format';

export function ledResistor(options: {
  supplyV: number;
  forwardV: number;
  currentMa: number;
  seriesCount: number;
  strings: number;
}) {
  const vs = clampNumber(options.supplyV, 0.5, 60);
  const vf = clampNumber(options.forwardV, 0.5, 24);
  const i = clampNumber(options.currentMa, 0.1, 1000) / 1000;
  const n = Math.round(clampNumber(options.seriesCount, 1, 20));
  const strings = Math.round(clampNumber(options.strings, 1, 50));
  const drop = vs - vf * n;
  const r = drop > 0 ? drop / i : 0;
  const p = i * i * r;
  return {
    ohms: roundTo(r, 1),
    watts: roundTo(p, 3),
    drop: roundTo(drop, 3),
    totalCurrentMa: roundTo(i * strings * 1000, 1),
    ok: drop > 0.05,
  };
}

export function voltageDivider(vin: number, r1: number, r2: number) {
  const v = clampNumber(vin, 0, 1000);
  const a = clampNumber(r1, 0.1, 1e8);
  const b = clampNumber(r2, 0.1, 1e8);
  const vout = v * (b / (a + b));
  return { vout: roundTo(vout, 3), ratio: roundTo(b / (a + b), 4) };
}

export function dividerR2(vin: number, vout: number, r1: number) {
  const v = clampNumber(vin, 0.01, 1000);
  const o = clampNumber(vout, 0, v);
  const a = clampNumber(r1, 0.1, 1e8);
  if (v === o) return a;
  return roundTo((o * a) / (v - o), 1);
}
