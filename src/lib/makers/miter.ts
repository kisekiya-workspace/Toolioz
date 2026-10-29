import { clampNumber, roundTo } from '@/lib/makers/format';

export function polygonMiter(sides: number) {
  const n = Math.round(clampNumber(sides, 3, 24));
  const interior = (180 * (n - 2)) / n;
  const miterFromSquare = 180 / n;
  return {
    sides: n,
    interior: roundTo(interior, 2),
    miter: roundTo(miterFromSquare, 2),
    bevel: roundTo(90 - miterFromSquare, 2),
  };
}

export function frameMiter(cornerAngle = 90) {
  const angle = clampNumber(cornerAngle, 10, 170);
  return { miter: roundTo(angle / 2, 2) };
}

export function compoundMiter(options: { wallAngle: number; springAngle: number }) {
  const wall = (clampNumber(options.wallAngle, 10, 170) * Math.PI) / 180;
  const spring = (clampNumber(options.springAngle, 1, 80) * Math.PI) / 180;
  const corner = wall / 2;
  const miter = Math.atan(Math.sin(spring) * Math.tan(corner));
  const bevel = Math.asin(Math.cos(spring) * Math.sin(corner));
  return {
    miter: roundTo((miter * 180) / Math.PI, 2),
    bevel: roundTo((bevel * 180) / Math.PI, 2),
  };
}
