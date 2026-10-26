'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, Download, FileUp, RotateCcw, Sparkles, WandSparkles, XCircle } from 'lucide-react';
import type { NewToolDefinition } from '@/lib/new-tool-catalog';
import {
  DEFAULT_CHMOD_BITS,
  bitsFromOctal,
  chmodFromBits,
  contrastRatio,
  csvToJson,
  csvToKml,
  csvToMarkdownTable,
  geoJsonToKml,
  gpxToKml,
  jsonToTypeScript,
  kmlToGpx,
  ndjsonToCsv,
  shiftSubtitleTime,
  srtToVtt,
  subtitleToPlainText,
  vttToSrt,
  xmlToCsv,
  decodeHtmlEntities,
  encodeHtmlEntities,
  jsonToCsv,
  slugify,
  type PermissionBits,
  type PermissionTriplet,
} from '@/lib/workbench-engines';
import {
  ToolWorkbench,
  areaClass,
  downloadBlob,
  fieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './ToolWorkbench';

const SAMPLE_DATA: Record<string, string> = {
  'html-entities': 'Tom & Jerry <script>alert("hello");</script> & copyright © 2026',
  'slug': 'Café Menu & Pricing 2026: Fast & Simple!',
  'csv-json': 'id,name,role,active\n1,Alex,Developer,true\n2,Sam,Designer,false\n3,Jordan,Manager,true',
  'csv-markdown': 'Product,Category,Price,In Stock\nMechanical Keyboard,Accessories,$89.99,Yes\nUltraWide Monitor,Displays,$349.50,Yes\nWireless Mouse,Accessories,$29.99,No',
  'ndjson-csv': '{"id":101,"event":"page_view","user":"alex","timestamp":"2026-10-26T10:00:00Z"}\n{"id":102,"event":"click","user":"sam","timestamp":"2026-10-26T10:05:00Z"}\n{"id":103,"event":"purchase","user":"jordan","timestamp":"2026-10-26T10:15:00Z"}',
  'xml-csv': `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
  </book>
</catalog>`,
  'json-ts': `{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz",\n  "address": {\n    "street": "Kulas Light",\n    "suite": "Apt. 556",\n    "city": "Gwenborough",\n    "zipcode": "92998-3874"\n  },\n  "phone": "1-770-736-8031",\n  "website": "hildegard.org",\n  "active": true\n}`,
  'srt-vtt': `1\n00:00:01,000 --> 00:00:04,000\nWelcome to Toolioz client-side utilities.\n\n2\n00:00:04,500 --> 00:00:08,000\nAll processing stays 100% inside your browser.\n\n3\n00:00:08,500 --> 00:00:12,000\nZero server uploads for maximum privacy.`,
  'subtitle-text': `1\n00:00:01,000 --> 00:00:04,000\nWelcome to Toolioz client-side utilities.\n\n2\n00:00:04,500 --> 00:00:08,000\nAll processing stays 100% inside your browser.\n\n3\n00:00:08,500 --> 00:00:12,000\nZero server uploads for maximum privacy.`,
  'subtitle-shift': `1\n00:00:01,000 --> 00:00:04,000\nIntro scene with title screen.\n\n2\n00:00:05,000 --> 00:00:09,000\nDialogue starts here.`,
  'gpx-kml': `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Garmin Device">
  <trk>
    <name>Mountain Trail Walk</name>
    <trkseg>
      <trkpt lon="-122.084" lat="37.422"><ele>15.2</ele></trkpt>
      <trkpt lon="-122.083" lat="37.423"><ele>16.0</ele></trkpt>
      <trkpt lon="-122.081" lat="37.425"><ele>18.5</ele></trkpt>
      <trkpt lon="-122.079" lat="37.427"><ele>21.0</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`,
  'geojson-kml': `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Golden Gate Bridge" },\n      "geometry": {\n        "type": "LineString",\n        "coordinates": [\n          [-122.4786, 37.8199],\n          [-122.4783, 37.8280]\n        ]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": { "name": "Visitor Center" },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [-122.475, 37.808]\n      }\n    }\n  ]\n}`,
  'csv-kml': `name,latitude,longitude,description\nSan Francisco,37.7749,-122.4194,City by the Bay\nNew York,40.7128,-74.0060,The Big Apple\nLondon,51.5074,-0.1278,Capital of England\nTokyo,35.6762,139.6503,Capital of Japan`,
};

function copyText(value: string) {
  if (value) navigator.clipboard.writeText(value);
}

function ResultBox({
  value,
  filename,
}: {
  value: string;
  filename: string;
}) {
  if (!value) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-3">
        <strong className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Result Ready
        </strong>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition cursor-pointer"
            onClick={() => copyText(value)}
          >
            <Copy className="mr-1 inline" size={14} /> Copy
          </button>
          <button
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
            onClick={() => downloadBlob(value, filename, 'text/plain;charset=utf-8')}
          >
            <Download className="mr-1 inline" size={14} /> Download
          </button>
        </div>
      </div>
      <textarea
        readOnly
        className="min-h-48 w-full resize-y border-0 bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-900 dark:text-zinc-100 outline-none"
        value={value}
      />
    </div>
  );
}

function PermissionColumn({
  label,
  triplet,
  onChange,
}: {
  label: string;
  triplet: PermissionTriplet;
  onChange: (next: PermissionTriplet) => void;
}) {
  return (
    <fieldset className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <legend className="px-1 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{label}</legend>
      {(['r', 'w', 'x'] as const).map((key) => (
        <label key={key} className="mt-2 flex items-center gap-2 text-xs font-semibold capitalize text-zinc-800 dark:text-zinc-200 cursor-pointer">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={triplet[key]}
            onChange={(event) => onChange({ ...triplet, [key]: event.target.checked })}
          />
          {key === 'r' ? 'Read' : key === 'w' ? 'Write' : 'Execute'}
        </label>
      ))}
    </fieldset>
  );
}

export default function ExtraWorkbenchClient({ tool }: { tool: NewToolDefinition }) {
  const mode = tool.mode;
  const initialInput = SAMPLE_DATA[mode] || '';
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [htmlDirection, setHtmlDirection] = useState<'encode' | 'decode'>('encode');
  const [csvDirection, setCsvDirection] = useState<'csv-json' | 'json-csv'>('csv-json');
  const [subDirection, setSubDirection] = useState<'srt-vtt' | 'vtt-srt'>('srt-vtt');
  const [gpxDirection, setGpxDirection] = useState<'gpx-kml' | 'kml-gpx'>('gpx-kml');
  const [shiftMs, setShiftMs] = useState(1000);
  const [bits, setBits] = useState<PermissionBits>(DEFAULT_CHMOD_BITS);
  const [octalDraft, setOctalDraft] = useState('755');
  const [foreground, setForeground] = useState('#111111');
  const [background, setBackground] = useState('#ffffff');

  const chmod = useMemo(() => chmodFromBits(bits), [bits]);
  const contrast = useMemo(() => {
    try {
      return { ...contrastRatio(foreground, background), error: '' };
    } catch (cause) {
      return {
        ratio: 0,
        aaNormal: false,
        aaLarge: false,
        aaaNormal: false,
        aaaLarge: false,
        error: cause instanceof Error ? cause.message : 'Invalid color.',
      };
    }
  }, [foreground, background]);

  function setRole(role: keyof PermissionBits, triplet: PermissionTriplet) {
    const next = { ...bits, [role]: triplet };
    setBits(next);
    setOctalDraft(chmodFromBits(next).octal);
  }

  function applyOctal() {
    try {
      const next = bitsFromOctal(octalDraft);
      setBits(next);
      setOctalDraft(chmodFromBits(next).octal);
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Invalid mode.');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setInput(text);
      }
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsText(uploaded);
  }

  function loadSample() {
    if (SAMPLE_DATA[mode]) {
      setInput(SAMPLE_DATA[mode]);
      setOutput('');
      setError('');
    }
  }

  function clearAll() {
    setInput('');
    setOutput('');
    setError('');
  }

  function run() {
    setError('');
    if (!input.trim()) {
      setError('Please enter or upload data first.');
      return;
    }
    try {
      if (mode === 'html-entities') {
        setOutput(htmlDirection === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
      } else if (mode === 'slug') {
        setOutput(slugify(input));
      } else if (mode === 'csv-json') {
        setOutput(csvDirection === 'csv-json' ? csvToJson(input) : jsonToCsv(input));
      } else if (mode === 'csv-markdown') {
        setOutput(csvToMarkdownTable(input));
      } else if (mode === 'ndjson-csv') {
        setOutput(ndjsonToCsv(input));
      } else if (mode === 'xml-csv') {
        setOutput(xmlToCsv(input));
      } else if (mode === 'json-ts') {
        setOutput(jsonToTypeScript(input));
      } else if (mode === 'srt-vtt') {
        setOutput(subDirection === 'srt-vtt' ? srtToVtt(input) : vttToSrt(input));
      } else if (mode === 'subtitle-text') {
        setOutput(subtitleToPlainText(input));
      } else if (mode === 'subtitle-shift') {
        setOutput(shiftSubtitleTime(input, shiftMs));
      } else if (mode === 'gpx-kml') {
        setOutput(gpxDirection === 'gpx-kml' ? gpxToKml(input) : kmlToGpx(input));
      } else if (mode === 'geojson-kml') {
        setOutput(geoJsonToKml(input));
      } else if (mode === 'csv-kml') {
        setOutput(csvToKml(input));
      }
    } catch (cause) {
      setOutput('');
      setError(cause instanceof Error ? cause.message : 'The input is invalid.');
    }
  }

  if (mode === 'chmod') {
    return (
      <ToolWorkbench tool={tool}>
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <PermissionColumn label="Owner" triplet={bits.owner} onChange={(triplet) => setRole('owner', triplet)} />
            <PermissionColumn label="Group" triplet={bits.group} onChange={(triplet) => setRole('group', triplet)} />
            <PermissionColumn label="Others" triplet={bits.other} onChange={(triplet) => setRole('other', triplet)} />
          </div>
          <label className="block max-w-xs text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Octal mode
            <span className="mt-2 flex gap-2">
              <input className={fieldClass} value={octalDraft} onChange={(event) => setOctalDraft(event.target.value)} inputMode="numeric" />
              <button className={secondaryButtonClass} onClick={applyOctal} type="button">Apply</button>
            </span>
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Octal', chmod.octal],
              ['Symbolic', chmod.symbolic],
              ['Command', chmod.command],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
                <p className="mt-2 font-mono text-xl font-bold text-zinc-950 dark:text-zinc-50">{value}</p>
              </div>
            ))}
          </div>
          <button className={primaryButtonClass} type="button" onClick={() => copyText(chmod.command)}>
            <Copy size={16} /> Copy chmod command
          </button>
        </div>
      </ToolWorkbench>
    );
  }

  if (mode === 'contrast') {
    const checks = [
      ['AA normal text (4.5:1)', contrast.aaNormal],
      ['AA large text (3:1)', contrast.aaLarge],
      ['AAA normal text (7:1)', contrast.aaaNormal],
      ['AAA large text (4.5:1)', contrast.aaaLarge],
    ] as const;
    return (
      <ToolWorkbench tool={tool}>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Foreground
              <span className="mt-2 flex gap-2">
                <input className="h-10 w-14 cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700" type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} />
                <input className={fieldClass} value={foreground} onChange={(event) => setForeground(event.target.value)} />
              </span>
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Background
              <span className="mt-2 flex gap-2">
                <input className="h-10 w-14 cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700" type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
                <input className={fieldClass} value={background} onChange={(event) => setBackground(event.target.value)} />
              </span>
            </label>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 text-center dark:border-zinc-800" style={{ background, color: foreground }}>
            <p className="text-2xl font-bold">The quick brown fox jumps over the lazy dog</p>
            <p className="mt-2 text-xs">Sample text preview at standard reading scale.</p>
          </div>
          {contrast.error ? (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{contrast.error}</p>
          ) : (
            <>
              <p className="text-3xl font-black tabular-nums text-zinc-950 dark:text-zinc-50">{contrast.ratio.toFixed(2)}:1</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {checks.map(([label, pass]) => (
                  <p key={label} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${pass ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300'}`}>
                    {pass ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                    {label}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </ToolWorkbench>
    );
  }

  const fileAccept =
    mode.includes('csv') ? '.csv,.tsv,.txt' :
    mode.includes('srt') || mode.includes('vtt') || mode.includes('subtitle') ? '.srt,.vtt,.txt' :
    mode.includes('gpx') ? '.gpx,.kml,.xml,.txt' :
    mode.includes('geojson') ? '.geojson,.json,.txt' :
    mode.includes('xml') ? '.xml,.txt' :
    mode.includes('json') ? '.json,.ndjson,.jsonl,.txt' : '.txt';

  return (
    <ToolWorkbench tool={tool}>
      <div className="space-y-6">
        {mode === 'html-entities' && (
          <div className="flex flex-wrap gap-2">
            <button className={htmlDirection === 'encode' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setHtmlDirection('encode')}>Encode</button>
            <button className={htmlDirection === 'decode' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setHtmlDirection('decode')}>Decode</button>
          </div>
        )}
        {mode === 'csv-json' && (
          <div className="flex flex-wrap gap-2">
            <button className={csvDirection === 'csv-json' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setCsvDirection('csv-json')}>CSV → JSON</button>
            <button className={csvDirection === 'json-csv' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setCsvDirection('json-csv')}>JSON → CSV</button>
          </div>
        )}
        {mode === 'srt-vtt' && (
          <div className="flex flex-wrap gap-2">
            <button className={subDirection === 'srt-vtt' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setSubDirection('srt-vtt')}>SRT → WebVTT</button>
            <button className={subDirection === 'vtt-srt' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setSubDirection('vtt-srt')}>WebVTT → SRT</button>
          </div>
        )}
        {mode === 'gpx-kml' && (
          <div className="flex flex-wrap gap-2">
            <button className={gpxDirection === 'gpx-kml' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setGpxDirection('gpx-kml')}>GPX → KML</button>
            <button className={gpxDirection === 'kml-gpx' ? primaryButtonClass : secondaryButtonClass} type="button" onClick={() => setGpxDirection('kml-gpx')}>KML → GPX</button>
          </div>
        )}
        {mode === 'subtitle-shift' && (
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Timing Offset (Milliseconds) — positive delays (+1000ms), negative advances (-500ms)
            <input
              type="number"
              step="100"
              className={`${fieldClass} mt-1`}
              value={shiftMs}
              onChange={(e) => setShiftMs(Number(e.target.value) || 0)}
            />
          </label>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Input Data
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition">
              <FileUp size={13} /> Upload File
              <input type="file" accept={fileAccept} className="hidden" onChange={handleFileUpload} />
            </label>
            {SAMPLE_DATA[mode] && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                onClick={loadSample}
              >
                <Sparkles size={13} /> Load Sample
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              onClick={clearAll}
            >
              <RotateCcw size={13} /> Clear
            </button>
          </div>
        </div>

        <textarea
          className={`${areaClass} min-h-48 font-mono text-xs`}
          placeholder="Paste or upload your content here..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}

        <button className={primaryButtonClass} type="button" onClick={run}>
          <WandSparkles size={16} /> Generate result
        </button>

        <ResultBox
          value={output}
          filename={
            mode === 'json-ts'
              ? 'types.d.ts'
              : mode === 'csv-markdown'
              ? 'table.md'
              : mode === 'ndjson-csv' || mode === 'xml-csv'
              ? 'data.csv'
              : mode === 'srt-vtt'
              ? subDirection === 'srt-vtt'
                ? 'subtitles.vtt'
                : 'subtitles.srt'
              : mode === 'subtitle-text'
              ? 'transcript.txt'
              : mode === 'subtitle-shift'
              ? 'shifted-subtitles.srt'
              : mode === 'gpx-kml'
              ? gpxDirection === 'gpx-kml'
                ? 'track.kml'
                : 'track.gpx'
              : mode === 'geojson-kml' || mode === 'csv-kml'
              ? 'map.kml'
              : `${tool.slug}.txt`
          }
        />
      </div>
    </ToolWorkbench>
  );
}
