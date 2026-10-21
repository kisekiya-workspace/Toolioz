const HTML_ESCAPES: Array<[RegExp, string]> = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&#39;'],
];

export function encodeHtmlEntities(input: string) {
  return HTML_ESCAPES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), input);
}

export function decodeHtmlEntities(input: string) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, '&');
}

export function slugify(input: string) {
  const slug = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('Enter text that contains letters or numbers.');
  return slug;
}

export type PermissionTriplet = { r: boolean; w: boolean; x: boolean };
export type PermissionBits = { owner: PermissionTriplet; group: PermissionTriplet; other: PermissionTriplet };

function tripletValue(triplet: PermissionTriplet) {
  return (triplet.r ? 4 : 0) + (triplet.w ? 2 : 0) + (triplet.x ? 1 : 0);
}

function tripletFromValue(value: number): PermissionTriplet {
  return { r: (value & 4) !== 0, w: (value & 2) !== 0, x: (value & 1) !== 0 };
}

function tripletSymbol(triplet: PermissionTriplet) {
  return `${triplet.r ? 'r' : '-'}${triplet.w ? 'w' : '-'}${triplet.x ? 'x' : '-'}`;
}

export function chmodFromBits(bits: PermissionBits) {
  const owner = tripletValue(bits.owner);
  const group = tripletValue(bits.group);
  const other = tripletValue(bits.other);
  const octal = `${owner}${group}${other}`;
  return {
    octal,
    numeric: owner * 64 + group * 8 + other,
    symbolic: tripletSymbol(bits.owner) + tripletSymbol(bits.group) + tripletSymbol(bits.other),
    command: `chmod ${octal}`,
  };
}

export function bitsFromOctal(input: string): PermissionBits {
  const digits = input.replace(/\s/g, '').replace(/^0/, '');
  if (!/^[0-7]{3}$/.test(digits)) throw new Error('Enter a 3-digit octal mode such as 755 or 644.');
  return {
    owner: tripletFromValue(Number(digits[0])),
    group: tripletFromValue(Number(digits[1])),
    other: tripletFromValue(Number(digits[2])),
  };
}

export const DEFAULT_CHMOD_BITS: PermissionBits = {
  owner: { r: true, w: true, x: true },
  group: { r: true, w: false, x: true },
  other: { r: true, w: false, x: true },
};

function srgbToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function parseHexColor(input: string): [number, number, number] {
  const hex = input.trim().replace(/^#/, '');
  const normalized = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) throw new Error('Enter a 3- or 6-digit hex color such as #111111.');
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function relativeLuminance(rgb: [number, number, number]) {
  return 0.2126 * srgbToLinear(rgb[0]) + 0.7152 * srgbToLinear(rgb[1]) + 0.0722 * srgbToLinear(rgb[2]);
}

export function contrastRatio(foreground: string, background: string) {
  const left = relativeLuminance(parseHexColor(foreground));
  const right = relativeLuminance(parseHexColor(background));
  const lighter = Math.max(left, right);
  const darker = Math.min(left, right);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (quoted) throw new Error('CSV has an unclosed quote.');
  cells.push(current);
  return cells;
}

export function csvToJson(input: string) {
  const lines = input.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length < 2) throw new Error('CSV needs a header row and at least one data row.');
  const headers = splitCsvLine(lines[0]).map((header, index) => header.trim() || `column_${index + 1}`);
  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
  return JSON.stringify(rows, null, 2);
}

export function jsonToCsv(input: string) {
  const parsed = JSON.parse(input) as unknown;
  if (!Array.isArray(parsed) || parsed.some((row) => !row || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('JSON must be an array of objects.');
  }
  const headers = [...new Set(parsed.flatMap((row) => Object.keys(row as object)))];
  if (!headers.length) throw new Error('The JSON objects do not contain any keys.');
  const escape = (value: unknown) => {
    const text = value == null ? '' : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(','), ...parsed.map((row) => headers.map((header) => escape((row as Record<string, unknown>)[header])).join(','))].join('\n');
}
