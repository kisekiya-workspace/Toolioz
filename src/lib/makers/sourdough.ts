import { clampNumber, roundTo } from '@/lib/makers/format';

export function calculateSourdough(options: {
  flourG: number;
  hydrationPercent: number;
  starterPercent: number;
  starterHydration: number;
  saltPercent: number;
}) {
  const flour = clampNumber(options.flourG, 50, 10000);
  const hydration = clampNumber(options.hydrationPercent, 50, 110) / 100;
  const starterPct = clampNumber(options.starterPercent, 1, 50) / 100;
  const starterHydration = clampNumber(options.starterHydration, 50, 150) / 100;
  const saltPct = clampNumber(options.saltPercent, 0.5, 4) / 100;

  const starter = flour * starterPct;
  const starterFlour = starter / (1 + starterHydration);
  const starterWater = starter - starterFlour;
  const doughWater = flour * hydration - starterWater;
  const salt = flour * saltPct;
  const totalFlour = flour + starterFlour;
  const totalWater = Math.max(0, doughWater) + starterWater;
  const dough = flour + Math.max(0, doughWater) + starter + salt;
  const trueHydration = (totalWater / totalFlour) * 100;

  return {
    flour: roundTo(flour, 1),
    water: roundTo(Math.max(0, doughWater), 1),
    starter: roundTo(starter, 1),
    starterFlour: roundTo(starterFlour, 1),
    starterWater: roundTo(starterWater, 1),
    salt: roundTo(salt, 1),
    dough: roundTo(dough, 1),
    trueHydration: roundTo(trueHydration, 1),
    bakerWaterPct: roundTo((Math.max(0, doughWater) / flour) * 100, 1),
    bakerStarterPct: roundTo(starterPct * 100, 1),
    bakerSaltPct: roundTo(saltPct * 100, 1),
  };
}
