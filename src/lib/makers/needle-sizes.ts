export interface NeedleSize {
  mm: number;
  us: string;
  uk: string;
  jp: string;
  crochetUS: string;
  crochetUK: string;
}

/** Craft Yarn Council metric sizes with US/UK/Japan knitting labels and crochet letters. */
export const NEEDLE_SIZES: NeedleSize[] = [
  { mm: 2.0, us: '0', uk: '14', jp: '0', crochetUS: '—', crochetUK: '14' },
  { mm: 2.25, us: '1', uk: '13', jp: '1', crochetUS: 'B-1', crochetUK: '13' },
  { mm: 2.5, us: '1.5', uk: '12', jp: '2', crochetUS: '—', crochetUK: '12' },
  { mm: 2.75, us: '2', uk: '12', jp: '3', crochetUS: 'C-2', crochetUK: '12' },
  { mm: 3.0, us: '2.5', uk: '11', jp: '4', crochetUS: '—', crochetUK: '11' },
  { mm: 3.25, us: '3', uk: '10', jp: '5', crochetUS: 'D-3', crochetUK: '10' },
  { mm: 3.5, us: '4', uk: '—', jp: '6', crochetUS: 'E-4', crochetUK: '9' },
  { mm: 3.75, us: '5', uk: '9', jp: '7', crochetUS: 'F-5', crochetUK: '9' },
  { mm: 4.0, us: '6', uk: '8', jp: '8', crochetUS: 'G-6', crochetUK: '8' },
  { mm: 4.5, us: '7', uk: '7', jp: '9', crochetUS: '7', crochetUK: '7' },
  { mm: 5.0, us: '8', uk: '6', jp: '10', crochetUS: 'H-8', crochetUK: '6' },
  { mm: 5.5, us: '9', uk: '5', jp: '11', crochetUS: 'I-9', crochetUK: '5' },
  { mm: 6.0, us: '10', uk: '4', jp: '12', crochetUS: 'J-10', crochetUK: '4' },
  { mm: 6.5, us: '10.5', uk: '3', jp: '13', crochetUS: 'K-10.5', crochetUK: '3' },
  { mm: 7.0, us: '—', uk: '2', jp: '14', crochetUS: '—', crochetUK: '2' },
  { mm: 8.0, us: '11', uk: '0', jp: '15', crochetUS: 'L-11', crochetUK: '0' },
  { mm: 9.0, us: '13', uk: '00', jp: '—', crochetUS: 'M/N-13', crochetUK: '00' },
  { mm: 10.0, us: '15', uk: '000', jp: '—', crochetUS: 'N/P-15', crochetUK: '000' },
  { mm: 12.0, us: '17', uk: '—', jp: '—', crochetUS: 'P/Q', crochetUK: '—' },
  { mm: 15.0, us: '19', uk: '—', jp: '—', crochetUS: 'Q', crochetUK: '—' },
  { mm: 19.0, us: '35', uk: '—', jp: '—', crochetUS: 'S', crochetUK: '—' },
  { mm: 25.0, us: '50', uk: '—', jp: '—', crochetUS: '—', crochetUK: '—' },
];

export function nearestNeedle(mm: number): NeedleSize {
  return NEEDLE_SIZES.reduce((best, row) =>
    Math.abs(row.mm - mm) < Math.abs(best.mm - mm) ? row : best,
  );
}
