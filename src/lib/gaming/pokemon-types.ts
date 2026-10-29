export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

/** Attacker → defender → multiplier. Unlisted pairs are 1×. Frozen since X/Y (2013) Fairy addition. */
const CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export function attackMultiplier(attacker: PokemonType, defender: PokemonType): number {
  return CHART[attacker][defender] ?? 1;
}

export function defensiveMultiplier(
  attacker: PokemonType,
  type1: PokemonType,
  type2?: PokemonType | null,
): number {
  const second = type2 && type2 !== type1 ? type2 : null;
  const a = attackMultiplier(attacker, type1);
  const b = second ? attackMultiplier(attacker, second) : 1;
  return a * b;
}

export interface WeaknessRow {
  attacker: PokemonType;
  multiplier: number;
}

export interface WeaknessReport {
  type1: PokemonType;
  type2: PokemonType | null;
  rows: WeaknessRow[];
  x4: PokemonType[];
  x2: PokemonType[];
  x1: PokemonType[];
  x05: PokemonType[];
  x025: PokemonType[];
  x0: PokemonType[];
}

export function dualTypeWeakness(type1: PokemonType, type2?: PokemonType | null): WeaknessReport {
  const second = type2 && type2 !== type1 ? type2 : null;
  const rows: WeaknessRow[] = POKEMON_TYPES.map((attacker) => ({
    attacker,
    multiplier: defensiveMultiplier(attacker, type1, second),
  }));

  const bucket = (value: number) => rows.filter((row) => row.multiplier === value).map((row) => row.attacker);

  return {
    type1,
    type2: second,
    rows,
    x4: bucket(4),
    x2: bucket(2),
    x1: bucket(1),
    x05: bucket(0.5),
    x025: bucket(0.25),
    x0: bucket(0),
  };
}

export function typeLabel(type: PokemonType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
