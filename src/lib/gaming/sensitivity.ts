export interface SensGame {
  id: string;
  name: string;
  shortName: string;
  /** Degrees of yaw per mouse count at sensitivity 1.0. */
  yaw: number;
  engine: string;
  adsNote: string;
}

export const SENS_GAMES: SensGame[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    shortName: 'CS2',
    yaw: 0.022,
    engine: 'Source 2 m_yaw',
    adsNote: 'Scoped zoom uses zoom_sensitivity_ratio_mouse and is not part of this hipfire conversion.',
  },
  {
    id: 'csgo',
    name: 'Counter-Strike: Global Offensive',
    shortName: 'CS:GO',
    yaw: 0.022,
    engine: 'Source m_yaw',
    adsNote: 'CS:GO and CS2 share m_yaw 0.022, so hipfire sensitivity matches 1:1 between those two titles.',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'Valorant',
    yaw: 0.07,
    engine: 'Unreal yaw',
    adsNote: 'ADS and scoped rifles use a separate multiplier in settings. This page converts hipfire only.',
  },
  {
    id: 'overwatch',
    name: 'Overwatch 2',
    shortName: 'Overwatch 2',
    yaw: 0.0066,
    engine: 'Relative hipfire yaw',
    adsNote: 'Hero relative aim and zoom sensitivity are extra multipliers on top of this hipfire yaw.',
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    shortName: 'Apex',
    yaw: 0.022,
    engine: 'Source m_yaw',
    adsNote: 'Apex hipfire matches CS2. Each optic has its own ADS multiplier that this conversion does not change.',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    shortName: 'Fortnite',
    yaw: 0.005555555555555556,
    engine: 'Unreal hipfire yaw',
    adsNote: 'Build and edit mode can use a different multiplier. Hipfire yaw is the figure converted here.',
  },
  {
    id: 'r6',
    name: 'Rainbow Six Siege',
    shortName: 'Siege',
    yaw: 0.005729577951308232,
    engine: 'Siege increment yaw',
    adsNote: 'ADS uses a 1x through 12x sight table. Convert hipfire first, then copy the ADS table if needed.',
  },
  {
    id: 'cod',
    name: 'Call of Duty (MW / Warzone)',
    shortName: 'COD',
    yaw: 0.0066,
    engine: 'Relative hipfire yaw',
    adsNote: 'Modern Warfare and Warzone add ADS and relative aim sliders. This conversion is hipfire only.',
  },
  {
    id: 'finals',
    name: 'The Finals',
    shortName: 'The Finals',
    yaw: 0.022,
    engine: 'Source-style yaw',
    adsNote: 'Hipfire matches CS2. Zoomed optics are a separate in-game multiplier.',
  },
];

export const SENS_GAME_MAP = Object.fromEntries(SENS_GAMES.map((game) => [game.id, game])) as Record<
  string,
  SensGame
>;

export interface SensConversion {
  from: SensGame;
  to: SensGame;
  fromSens: number;
  fromDpi: number;
  toDpi: number;
  factor: number;
  toSens: number;
  fromEdpi: number;
  toEdpi: number;
  cm360: number;
  in360: number;
}

export function conversionFactor(from: SensGame, to: SensGame): number {
  return from.yaw / to.yaw;
}

export function convertSensitivity(input: {
  fromId: string;
  toId: string;
  fromSens: number;
  fromDpi: number;
  toDpi?: number;
}): SensConversion | null {
  const from = SENS_GAME_MAP[input.fromId];
  const to = SENS_GAME_MAP[input.toId];
  if (!from || !to) return null;

  const fromSens = clampPositive(input.fromSens, 0.001, 100);
  const fromDpi = clampPositive(input.fromDpi, 50, 32000);
  const toDpi = clampPositive(input.toDpi ?? input.fromDpi, 50, 32000);
  const factor = conversionFactor(from, to);
  const toSens = fromSens * factor * (fromDpi / toDpi);
  const fromEdpi = fromSens * fromDpi;
  const toEdpi = toSens * toDpi;
  const in360 = 360 / (from.yaw * fromSens * fromDpi);
  const cm360 = in360 * 2.54;

  return {
    from,
    to,
    fromSens,
    fromDpi,
    toDpi,
    factor,
    toSens,
    fromEdpi,
    toEdpi,
    cm360,
    in360,
  };
}

export function formatSens(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value >= 10) return value.toFixed(3);
  if (value >= 1) return value.toFixed(4);
  return value.toFixed(5);
}

export function formatFactor(value: number): string {
  return value.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}

function clampPositive(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
