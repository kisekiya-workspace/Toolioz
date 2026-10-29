export type DiceKeep = { kind: 'kh' | 'kl' | 'dh' | 'dl'; count: number };

export interface DiceTerm {
  count: number;
  sides: number;
  keep?: DiceKeep;
}

export interface LiteralTerm {
  value: number;
}

export type ParsedTerm =
  | { kind: 'dice'; dice: DiceTerm; sign: 1 | -1 }
  | { kind: 'literal'; literal: LiteralTerm; sign: 1 | -1 };

export interface ParsedExpression {
  raw: string;
  terms: ParsedTerm[];
}

export interface DieFace {
  sides: number;
  value: number;
  kept: boolean;
}

export interface TermResult {
  term: ParsedTerm;
  faces: DieFace[];
  subtotal: number;
}

export interface RollResult {
  expression: ParsedExpression;
  terms: TermResult[];
  total: number;
}

const DICE_TOKEN = /^(\d*)d(\d+|%)(kh\d+|kl\d+|dh\d+|dl\d+)?/i;
const NUMBER_TOKEN = /^\d+/;

export function parseDice(raw: string): ParsedExpression {
  const source = raw.replace(/\s+/g, '').toLowerCase();
  if (!source) throw new Error('Enter a dice expression such as 4d6kh3 or 1d20+5.');

  const terms: ParsedTerm[] = [];
  let i = 0;
  let sign: 1 | -1 = 1;
  let expectTerm = true;

  while (i < source.length) {
    const ch = source[i];
    if (ch === '+' || ch === '-') {
      if (expectTerm && terms.length === 0 && ch === '-') {
        sign = -1;
        i += 1;
        continue;
      }
      sign = ch === '-' ? -1 : 1;
      expectTerm = true;
      i += 1;
      continue;
    }

    const slice = source.slice(i);
    const dice = slice.match(DICE_TOKEN);
    if (dice) {
      const count = dice[1] === '' ? 1 : Number(dice[1]);
      const sides = dice[2] === '%' ? 100 : Number(dice[2]);
      if (count < 1 || count > 100) throw new Error('Dice count must be between 1 and 100.');
      if (![4, 6, 8, 10, 12, 20, 100].includes(sides) && sides !== 3 && sides !== 2) {
        if (sides < 2 || sides > 1000) throw new Error('Die size must be between 2 and 1000.');
      }
      const keepRaw = dice[3];
      let keep: DiceKeep | undefined;
      if (keepRaw) {
        keep = { kind: keepRaw.slice(0, 2) as DiceKeep['kind'], count: Number(keepRaw.slice(2)) };
        if (keep.count < 1 || keep.count > count) {
          throw new Error('Keep or drop count must be between 1 and the number of dice.');
        }
      }
      terms.push({ kind: 'dice', dice: { count, sides, keep }, sign });
      i += dice[0].length;
      expectTerm = false;
      continue;
    }

    const num = slice.match(NUMBER_TOKEN);
    if (num) {
      terms.push({ kind: 'literal', literal: { value: Number(num[0]) }, sign });
      i += num[0].length;
      expectTerm = false;
      continue;
    }

    throw new Error(`Could not parse "${raw}" at "${slice}". Use forms such as 2d20kh1+5.`);
  }

  if (terms.length === 0 || expectTerm) throw new Error('Incomplete dice expression.');
  return { raw, terms };
}

function randomFace(sides: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return 1 + (buf[0] % sides);
  }
  return 1 + Math.floor(Math.random() * sides);
}

function applyKeep(values: number[], keep?: DiceKeep): boolean[] {
  const flags = values.map(() => true);
  if (!keep) return flags;
  const indexed = values.map((value, index) => ({ value, index }));
  indexed.sort((a, b) => a.value - b.value);
  const drop = new Set<number>();
  if (keep.kind === 'kh') {
    indexed.slice(0, Math.max(0, values.length - keep.count)).forEach((item) => drop.add(item.index));
  } else if (keep.kind === 'kl') {
    indexed.slice(keep.count).forEach((item) => drop.add(item.index));
  } else if (keep.kind === 'dh') {
    indexed.slice(Math.max(0, values.length - keep.count)).forEach((item) => drop.add(item.index));
  } else if (keep.kind === 'dl') {
    indexed.slice(0, keep.count).forEach((item) => drop.add(item.index));
  }
  return flags.map((_, index) => !drop.has(index));
}

export function rollDice(raw: string): RollResult {
  const expression = parseDice(raw);
  const terms: TermResult[] = expression.terms.map((term) => {
    if (term.kind === 'literal') {
      return { term, faces: [], subtotal: term.sign * term.literal.value };
    }
    const values = Array.from({ length: term.dice.count }, () => randomFace(term.dice.sides));
    const kept = applyKeep(values, term.dice.keep);
    const faces: DieFace[] = values.map((value, index) => ({
      sides: term.dice.sides,
      value,
      kept: kept[index],
    }));
    const sum = faces.reduce((acc, face) => acc + (face.kept ? face.value : 0), 0);
    return { term, faces, subtotal: term.sign * sum };
  });
  const total = terms.reduce((acc, term) => acc + term.subtotal, 0);
  return { expression, terms, total };
}

export const QUICK_ROLLS = [
  { label: 'd20', expr: '1d20' },
  { label: 'Advantage', expr: '2d20kh1' },
  { label: 'Disadvantage', expr: '2d20kl1' },
  { label: '4d6 drop low', expr: '4d6kh3' },
  { label: '2d6', expr: '2d6' },
  { label: '8d6', expr: '8d6' },
  { label: 'd100', expr: '1d100' },
] as const;
