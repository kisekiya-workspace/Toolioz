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

export function splitCsvLine(line: string, customDelimiter?: string) {
  const delimiter = customDelimiter || (line.includes(';') && !line.includes(',') ? ';' : ',');
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
    } else if (char === delimiter && !quoted) {
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

import JsonToTS from 'json-to-ts';

export function jsonToTypeScript(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Enter JSON data.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (cause) {
    throw new Error(`Invalid JSON: ${cause instanceof Error ? cause.message : 'Syntax error'}`);
  }
  const converter = typeof JsonToTS === 'function' ? JsonToTS : (JsonToTS as unknown as { default: typeof JsonToTS }).default || JsonToTS;
  const interfaces = converter(parsed);
  return interfaces.join('\n\n');
}

export function ndjsonToCsv(input: string) {
  const lines = input.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) throw new Error('Enter at least one NDJSON line.');
  const records: Record<string, unknown>[] = [];
  const headersSet = new Set<string>();

  lines.forEach((line, idx) => {
    try {
      const obj = JSON.parse(line);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        records.push(obj);
        Object.keys(obj).forEach((k) => headersSet.add(k));
      }
    } catch {
      throw new Error(`Line ${idx + 1} is not valid JSON.`);
    }
  });

  const headers = Array.from(headersSet);
  if (!headers.length) throw new Error('No keys found in JSON lines.');
  const escape = (val: unknown) => {
    const text = val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : String(val);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [
    headers.join(','),
    ...records.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n');
}

export function csvToMarkdownTable(input: string) {
  const lines = input.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 1) throw new Error('Enter CSV or tabular data.');
  const parsedRows = lines.map((line) => {
    if (line.includes('\t') && !line.includes(',')) {
      return line.split('\t').map((c) => c.trim());
    }
    return splitCsvLine(line).map((c) => c.trim());
  });

  const colCount = Math.max(...parsedRows.map((r) => r.length));
  if (colCount === 0) throw new Error('No data columns found.');

  const normalized = parsedRows.map((r) => {
    const copy = [...r];
    while (copy.length < colCount) copy.push('');
    return copy;
  });

  const headers = normalized[0];
  const separator = Array(colCount).fill('---');
  const dataRows = normalized.length > 1 ? normalized.slice(1) : [];
  const formatRow = (row: string[]) => `| ${row.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`;

  return [
    formatRow(headers),
    formatRow(separator),
    ...dataRows.map(formatRow),
  ].join('\n');
}

export function xmlToCsv(input: string): string {
  const trimmed = input.replace(/^\uFEFF/, '').trim();
  if (!trimmed) throw new Error('Enter XML data.');

  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(trimmed, 'application/xml');
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) throw new Error('Invalid XML document: ' + (parserError.textContent?.slice(0, 100) || ''));

    const root = xmlDoc.documentElement;
    let candidateNodes: Element[] = [];
    const tagCounts: Record<string, Element[]> = {};
    for (let i = 0; i < root.children.length; i++) {
      const el = root.children[i];
      if (!tagCounts[el.tagName]) tagCounts[el.tagName] = [];
      tagCounts[el.tagName].push(el);
    }

    let maxTag = '';
    let maxCount = 0;
    for (const [tag, elements] of Object.entries(tagCounts)) {
      if (elements.length > maxCount) {
        maxCount = elements.length;
        maxTag = tag;
      }
    }

    if (maxCount > 1) {
      candidateNodes = tagCounts[maxTag];
    } else if (root.children.length === 1 && root.children[0].children.length > 0) {
      const subRoot = root.children[0];
      const subCounts: Record<string, Element[]> = {};
      for (let i = 0; i < subRoot.children.length; i++) {
        const el = subRoot.children[i];
        if (!subCounts[el.tagName]) subCounts[el.tagName] = [];
        subCounts[el.tagName].push(el);
      }
      for (const [tag, elements] of Object.entries(subCounts)) {
        if (elements.length > maxCount) {
          maxCount = elements.length;
          maxTag = tag;
        }
      }
      if (maxTag && subCounts[maxTag]?.length) candidateNodes = subCounts[maxTag];
    }

    // Fallback for single-row XML documents or direct child structures
    if (candidateNodes.length === 0 && root.children.length > 0) {
      candidateNodes = Array.from(root.children);
    }

    if (candidateNodes.length === 0) {
      throw new Error('Could not find record elements in XML.');
    }

    const headersSet = new Set<string>();
    const rows: Record<string, string>[] = [];
    for (const node of candidateNodes) {
      const row: Record<string, string> = {};
      for (let a = 0; a < node.attributes.length; a++) {
        const attr = node.attributes[a];
        headersSet.add(attr.name);
        row[attr.name] = attr.value;
      }
      for (let c = 0; c < node.children.length; c++) {
        const child = node.children[c];
        headersSet.add(child.tagName);
        row[child.tagName] = child.textContent?.trim() || '';
      }
      if (node.children.length === 0 && node.textContent?.trim()) {
        headersSet.add('value');
        row['value'] = node.textContent.trim();
      }
      rows.push(row);
    }

    const headers = Array.from(headersSet);
    const escape = (val: string) => (/[",\n\r]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val);
    return [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => escape(row[h] || '')).join(',')),
    ].join('\n');
  }

  // Fallback parser for environments without DOMParser (Workers / Node / SSR)
  let inner = trimmed.replace(/^<\?xml[^>]*\?>/i, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  const rootWrap = inner.match(/^<([^\s>/]+)[^>]*>([\s\S]*)<\/\1>$/);
  if (rootWrap) {
    inner = rootWrap[2].trim();
  }

  const recordMatches = inner.match(/<([^\s>/]+)[^>]*>[\s\S]*?<\/\1>/g);
  if (!recordMatches || !recordMatches.length) {
    throw new Error('Could not find record elements in XML.');
  }

  const headersSet = new Set<string>();
  const rows: Record<string, string>[] = [];

  for (const block of recordMatches) {
    const row: Record<string, string> = {};
    const fieldRegex = /<([^\s>/]+)[^>]*>([^<]*)<\/\1>/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(block)) !== null) {
      const fName = fieldMatch[1];
      const fVal = fieldMatch[2].trim();
      headersSet.add(fName);
      row[fName] = fVal;
    }
    // Also parse attributes of the record tag
    const openTagMatch = block.match(/^<[^\s>]+([^>]*)>/);
    if (openTagMatch && openTagMatch[1]) {
      const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(openTagMatch[1])) !== null) {
        headersSet.add(attrMatch[1]);
        row[attrMatch[1]] = attrMatch[2];
      }
    }
    rows.push(row);
  }

  const headers = Array.from(headersSet);
  if (!headers.length) throw new Error('No field tags found within XML records.');
  const escape = (val: string) => (/[",\n\r]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val);
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h] || '')).join(',')),
  ].join('\n');
}

export function srtToVtt(input: string): string {
  const cleaned = input.replace(/^\uFEFF/, '').trim();
  const converted = cleaned.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  return `WEBVTT\n\n${converted}`;
}

export function vttToSrt(input: string): string {
  const lines = input.replace(/^\uFEFF/, '').replace(/^WEBVTT[^\n]*\n+/i, '').trim().split(/\r?\n/);
  const result: string[] = [];
  let cueIndex = 1;
  let inCue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      inCue = true;
      result.push(String(cueIndex++));
      // Clean off any WebVTT cue settings (e.g. position:10%,line:90% align:left)
      const cleanTiming = line.replace(/(\d{2}:\d{2}(?::\d{2})?[,.]\d{3})\s*-->\s*(\d{2}:\d{2}(?::\d{2})?[,.]\d{3}).*$/, '$1 --> $2');
      const formattedTimestamp = cleanTiming
        .replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, '$1,$2')
        .replace(/(\d{2}:\d{2})\.(\d{3})/g, '00:$1,$2');
      result.push(formattedTimestamp);
    } else if (inCue) {
      if (line === '') {
        inCue = false;
        result.push('');
      } else {
        result.push(line.replace(/<[^>]+>/g, ''));
      }
    }
  }
  return result.join('\n');
}

export function subtitleToPlainText(input: string): string {
  const lines = input.replace(/^\uFEFF/, '').replace(/^WEBVTT[^\n]*\n+/i, '').split(/\r?\n/);
  const textLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\d+$/.test(trimmed)) continue;
    if (trimmed.includes('-->')) continue;
    if (/^\[\d{2}:\d{2}/.test(trimmed)) continue;
    const clean = trimmed.replace(/<[^>]+>/g, '').trim();
    if (clean) textLines.push(clean);
  }
  return textLines.join('\n');
}

export function shiftSubtitleTime(input: string, offsetMs: number, targetFps?: number, sourceFps?: number): string {
  const parseTime = (h: string | undefined, m: string, s: string, ms: string) => {
    const hours = h ? Number(h) : 0;
    return hours * 3600000 + Number(m) * 60000 + Number(s) * 1000 + Number(ms);
  };
  const formatTime = (totalMs: number, sep = ',') => {
    const clamped = Math.max(0, totalMs);
    const h = String(Math.floor(clamped / 3600000)).padStart(2, '0');
    const m = String(Math.floor((clamped % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((clamped % 60000) / 1000)).padStart(2, '0');
    const ms = String(Math.floor(clamped % 1000)).padStart(3, '0');
    return `${h}:${m}:${s}${sep}${ms}`;
  };

  const fpsRatio = targetFps && sourceFps && sourceFps > 0 ? targetFps / sourceFps : 1;

  return input.replace(
    /(?:(\d{2}):)?(\d{2}):(\d{2})([,.])(\d{3})\s*-->\s*(?:(\d{2}):)?(\d{2}):(\d{2})([,.])(\d{3})/g,
    (_, h1, m1, s1, sep1, ms1, h2, m2, s2, sep2, ms2) => {
      const t1 = parseTime(h1, m1, s1, ms1) * fpsRatio + offsetMs;
      const t2 = parseTime(h2, m2, s2, ms2) * fpsRatio + offsetMs;
      return `${formatTime(t1, sep1)} --> ${formatTime(t2, sep2)}`;
    }
  );
}

export function gpxToKml(gpxStr: string): string {
  // Support lat and lon in either order
  const ptRegex = /<(?:trkpt|wpt|rtept)\b([^>]+)>/gi;
  const coords: string[] = [];
  let match;
  while ((match = ptRegex.exec(gpxStr)) !== null) {
    const attrs = match[1];
    const lat = attrs.match(/\blat=["']([^"']+)["']/i)?.[1];
    const lon = attrs.match(/\blon=["']([^"']+)["']/i)?.[1];
    if (lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
      coords.push(`${lon},${lat},0`);
    }
  }
  if (!coords.length) throw new Error('No trackpoints or waypoints found in GPX.');
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Exported Track</name>
    <Placemark>
      <name>Track</name>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
${coords.join('\n')}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;
}

export function kmlToGpx(kmlStr: string): string {
  const coordMatches = [...kmlStr.matchAll(/<coordinates>([\s\S]*?)<\/coordinates>/gi)];
  if (!coordMatches.length) throw new Error('No <coordinates> block found in KML.');
  const trackpoints: string[] = [];
  for (const match of coordMatches) {
    const rawCoords = match[1].trim().split(/\s+/);
    for (const c of rawCoords) {
      const parts = c.split(',');
      if (parts.length >= 2) {
        const lon = parts[0].trim();
        const lat = parts[1].trim();
        const ele = parts[2] ? `<ele>${parts[2].trim()}</ele>` : '';
        if (lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
          trackpoints.push(`      <trkpt lat="${lat}" lon="${lon}">${ele}</trkpt>`);
        }
      }
    }
  }
  if (!trackpoints.length) throw new Error('No coordinates found in KML.');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Toolioz" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Converted KML Track</name>
    <trkseg>
${trackpoints.join('\n')}
    </trkseg>
  </trk>
</gpx>`;
}

export function geoJsonToKml(geoJsonStr: string): string {
  const data = JSON.parse(geoJsonStr);
  const placemarks: string[] = [];

  const parseGeometry = (geom: any, name = 'Feature') => {
    if (!geom || !geom.type) return '';
    if (geom.type === 'Point') {
      const [lon, lat, ele = 0] = geom.coordinates;
      return `<Placemark><name>${name}</name><Point><coordinates>${lon},${lat},${ele}</coordinates></Point></Placemark>`;
    }
    if (geom.type === 'MultiPoint') {
      return geom.coordinates.map((pt: any, i: number) =>
        `<Placemark><name>${name} ${i + 1}</name><Point><coordinates>${pt[0]},${pt[1]},${pt[2] || 0}</coordinates></Point></Placemark>`
      ).join('\n');
    }
    if (geom.type === 'LineString') {
      const coords = geom.coordinates.map((c: any) => `${c[0]},${c[1]},${c[2] || 0}`).join(' ');
      return `<Placemark><name>${name}</name><LineString><coordinates>${coords}</coordinates></LineString></Placemark>`;
    }
    if (geom.type === 'MultiLineString') {
      return geom.coordinates.map((line: any, i: number) => {
        const coords = line.map((c: any) => `${c[0]},${c[1]},${c[2] || 0}`).join(' ');
        return `<Placemark><name>${name} Line ${i + 1}</name><LineString><coordinates>${coords}</coordinates></LineString></Placemark>`;
      }).join('\n');
    }
    if (geom.type === 'Polygon') {
      const rings = geom.coordinates.map((ring: any) =>
        `<LinearRing><coordinates>${ring.map((c: any) => `${c[0]},${c[1]},${c[2] || 0}`).join(' ')}</coordinates></LinearRing>`
      ).join('');
      return `<Placemark><name>${name}</name><Polygon><outerBoundaryIs>${rings}</outerBoundaryIs></Polygon></Placemark>`;
    }
    if (geom.type === 'MultiPolygon') {
      return geom.coordinates.map((poly: any, i: number) => {
        const rings = poly.map((ring: any) =>
          `<LinearRing><coordinates>${ring.map((c: any) => `${c[0]},${c[1]},${c[2] || 0}`).join(' ')}</coordinates></LinearRing>`
        ).join('');
        return `<Placemark><name>${name} Polygon ${i + 1}</name><Polygon><outerBoundaryIs>${rings}</outerBoundaryIs></Polygon></Placemark>`;
      }).join('\n');
    }
    return '';
  };

  if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    data.features.forEach((f: any, i: number) => {
      if (f.geometry) placemarks.push(parseGeometry(f.geometry, f.properties?.name || `Feature ${i + 1}`));
    });
  } else if (data.type === 'Feature' && data.geometry) {
    placemarks.push(parseGeometry(data.geometry, data.properties?.name || 'Feature'));
  } else if (data.coordinates) {
    placemarks.push(parseGeometry(data, 'Geometry'));
  }

  if (!placemarks.length) throw new Error('No supported GeoJSON geometry found (Point, LineString, Polygon).');
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Converted GeoJSON</name>
${placemarks.join('\n')}
  </Document>
</kml>`;
}

export function csvToKml(csvStr: string): string {
  const lines = csvStr.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const latIdx = headers.findIndex((h) => ['lat', 'latitude', 'lat_deg', 'y', 'coord_lat'].includes(h));
  const lonIdx = headers.findIndex((h) => ['lon', 'lng', 'longitude', 'long', 'x', 'coord_lon'].includes(h));
  const nameIdx = headers.findIndex((h) => ['name', 'title', 'label', 'city', 'place', 'description'].includes(h));

  if (latIdx === -1 || lonIdx === -1) {
    throw new Error('CSV must contain latitude (lat, latitude) and longitude (lon, lng, longitude) header columns.');
  }

  const placemarks: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const lat = cells[latIdx]?.trim();
    const lon = cells[lonIdx]?.trim();
    const name = nameIdx !== -1 && cells[nameIdx] ? cells[nameIdx].trim() : `Point ${i}`;
    if (lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
      placemarks.push(`    <Placemark>
      <name>${name.replace(/[<>&]/g, '')}</name>
      <Point>
        <coordinates>${lon},${lat},0</coordinates>
      </Point>
    </Placemark>`);
    }
  }

  if (!placemarks.length) throw new Error('No valid coordinate rows found in CSV.');
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>CSV Waypoints</name>
${placemarks.join('\n')}
  </Document>
</kml>`;
}
