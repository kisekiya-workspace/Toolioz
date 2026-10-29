const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const FLAT_TO_SHARP: Record<string, string> = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };

const CHORD_RE = /\b([A-G](?:#|b)?)([^A-Za-z/\s]*)(?:\/([A-G](?:#|b)?))?/g;

function normRoot(root: string): string {
  if (root.endsWith('b')) return FLAT_TO_SHARP[root] ?? root;
  return root;
}

function transposeRoot(root: string, semitones: number): string {
  const i = ROOTS.indexOf(normRoot(root) as (typeof ROOTS)[number]);
  if (i < 0) return root;
  const n = ((i + semitones) % 12 + 12) % 12;
  return ROOTS[n];
}

export function transposeChart(text: string, semitones: number): string {
  const steps = Math.round(semitones);
  return text
    .split('\n')
    .map((line) =>
      line.replace(CHORD_RE, (full, root: string, rest: string, bass: string | undefined, offset: number, src: string) => {
        const before = src[offset - 1];
        if (before && /[A-Za-z]/.test(before)) return full;
        const next = `${transposeRoot(root, steps)}${rest}`;
        return bass ? `${next}/${transposeRoot(bass, steps)}` : next;
      }),
    )
    .join('\n');
}

export function capoAsIf(text: string, capoFrets: number): string {
  return transposeChart(text, -Math.round(capoFrets));
}
