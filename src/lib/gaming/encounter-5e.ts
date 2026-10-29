/** 2014 Dungeon Master's Guide encounter-building tables. These values do not change. */

export const XP_THRESHOLDS: Record<number, { easy: number; medium: number; hard: number; deadly: number }> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
};

export const CR_XP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

export const CR_OPTIONS = Object.keys(CR_XP);

const MULTIPLIER_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

export function monsterCountMultiplier(monsterCount: number): number {
  if (monsterCount <= 0) return 1;
  if (monsterCount === 1) return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount <= 6) return 2;
  if (monsterCount <= 10) return 2.5;
  if (monsterCount <= 14) return 3;
  return 4;
}

function shiftMultiplier(base: number, steps: number): number {
  const index = MULTIPLIER_STEPS.indexOf(base);
  const next = Math.min(MULTIPLIER_STEPS.length - 1, Math.max(0, index + steps));
  return MULTIPLIER_STEPS[next];
}

export type EncounterBand = 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Deadly' | 'Beyond deadly';

export interface EncounterMonster {
  id: string;
  cr: string;
  count: number;
}

export interface EncounterResult {
  partySize: number;
  levels: number[];
  thresholds: { easy: number; medium: number; hard: number; deadly: number };
  monsterCount: number;
  rawXp: number;
  multiplier: number;
  adjustedXp: number;
  xpEach: number;
  band: EncounterBand;
}

export function evaluateEncounter(partyLevels: number[], monsters: EncounterMonster[]): EncounterResult {
  const levels = partyLevels.map((level) => Math.min(20, Math.max(1, Math.round(level))));
  const partySize = Math.max(1, levels.length);
  const thresholds = levels.reduce(
    (acc, level) => {
      const row = XP_THRESHOLDS[level];
      acc.easy += row.easy;
      acc.medium += row.medium;
      acc.hard += row.hard;
      acc.deadly += row.deadly;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0, deadly: 0 },
  );

  const monsterCount = monsters.reduce((acc, monster) => acc + Math.max(0, Math.floor(monster.count)), 0);
  const rawXp = monsters.reduce((acc, monster) => {
    const xp = CR_XP[monster.cr] ?? 0;
    return acc + xp * Math.max(0, Math.floor(monster.count));
  }, 0);

  let multiplier = monsterCountMultiplier(monsterCount);
  if (partySize <= 2) multiplier = shiftMultiplier(multiplier, 1);
  if (partySize >= 6) multiplier = shiftMultiplier(multiplier, -1);

  const adjustedXp = Math.round(rawXp * multiplier);
  const xpEach = partySize > 0 ? Math.floor(rawXp / partySize) : 0;

  let band: EncounterBand = 'Trivial';
  if (adjustedXp >= thresholds.deadly * 1.5 && adjustedXp > 0) band = 'Beyond deadly';
  else if (adjustedXp >= thresholds.deadly) band = 'Deadly';
  else if (adjustedXp >= thresholds.hard) band = 'Hard';
  else if (adjustedXp >= thresholds.medium) band = 'Medium';
  else if (adjustedXp >= thresholds.easy) band = 'Easy';

  return {
    partySize,
    levels,
    thresholds,
    monsterCount,
    rawXp,
    multiplier,
    adjustedXp,
    xpEach,
    band,
  };
}
