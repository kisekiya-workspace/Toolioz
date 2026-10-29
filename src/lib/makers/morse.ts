const ALPHA: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', ' ': '/',
};

const REV = Object.fromEntries(Object.entries(ALPHA).map(([k, v]) => [v, k]));

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((ch) => ALPHA[ch] ?? '')
    .filter(Boolean)
    .join(' ')
    .replace(/ \/ /g, ' / ');
}

export function morseToText(code: string): string {
  return code
    .trim()
    .split(/\s+/)
    .map((token) => (token === '/' ? ' ' : REV[token] ?? ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function morsePattern(code: string): Array<{ on: boolean; units: number }> {
  const out: Array<{ on: boolean; units: number }> = [];
  const tokens = code.trim().split(/\s+/);
  tokens.forEach((token, i) => {
    if (token === '/') {
      out.push({ on: false, units: 7 });
      return;
    }
    token.split('').forEach((ch, j) => {
      out.push({ on: true, units: ch === '-' ? 3 : 1 });
      if (j < token.length - 1) out.push({ on: false, units: 1 });
    });
    if (i < tokens.length - 1 && tokens[i + 1] !== '/') out.push({ on: false, units: 3 });
  });
  return out;
}
