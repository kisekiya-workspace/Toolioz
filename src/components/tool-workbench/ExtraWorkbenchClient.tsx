'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, Download, WandSparkles, XCircle } from 'lucide-react';
import type { NewToolDefinition } from '@/lib/new-tool-catalog';
import {
  DEFAULT_CHMOD_BITS,
  bitsFromOctal,
  chmodFromBits,
  contrastRatio,
  csvToJson,
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
    <div className="overflow-hidden rounded-2xl border border-[var(--tool-border)]">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--tool-accent)] px-4 py-3 text-white">
        <strong>Result ready</strong>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-white/15 px-3 py-2 text-sm font-bold hover:bg-white/25" onClick={() => copyText(value)}>
            <Copy className="mr-1 inline" size={16} />Copy
          </button>
          <button
            className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[var(--tool-accent-dark)] hover:bg-[var(--tool-soft)]"
            onClick={() => downloadBlob(value, filename, 'text/plain;charset=utf-8')}
          >
            <Download className="mr-1 inline" size={16} />Download
          </button>
        </div>
      </div>
      <textarea readOnly className={`${areaClass} min-h-40 !rounded-none !border-0 !bg-[var(--tool-soft)]`} value={value} />
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
    <fieldset className="rounded-2xl border border-[var(--tool-border)] bg-[var(--tool-soft)] p-4">
      <legend className="px-1 text-sm font-bold">{label}</legend>
      {(['r', 'w', 'x'] as const).map((key) => (
        <label key={key} className="mt-2 flex items-center gap-2 text-sm font-semibold capitalize">
          <input
            type="checkbox"
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
  const [input, setInput] = useState(
    mode === 'html-entities'
      ? 'Tom & Jerry <script>'
      : mode === 'slug'
        ? 'Café Menu 2026'
        : mode === 'csv-json'
          ? 'name,active\nToolioz,true'
          : '',
  );
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [htmlDirection, setHtmlDirection] = useState<'encode' | 'decode'>('encode');
  const [csvDirection, setCsvDirection] = useState<'csv-json' | 'json-csv'>('csv-json');
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

  function run() {
    setError('');
    try {
      if (mode === 'html-entities') {
        setOutput(htmlDirection === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
      } else if (mode === 'slug') {
        setOutput(slugify(input));
      } else if (mode === 'csv-json') {
        setOutput(csvDirection === 'csv-json' ? csvToJson(input) : jsonToCsv(input));
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
          <label className="block max-w-xs text-sm font-bold">
            Octal mode
            <span className="mt-2 flex gap-2">
              <input className={fieldClass} value={octalDraft} onChange={(event) => setOctalDraft(event.target.value)} inputMode="numeric" />
              <button className={secondaryButtonClass} onClick={applyOctal} type="button">Apply</button>
            </span>
          </label>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Octal', chmod.octal],
              ['Symbolic', chmod.symbolic],
              ['Command', chmod.command],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[var(--tool-border)] bg-[var(--tool-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--tool-accent-dark)]">{label}</p>
                <p className="mt-2 font-mono text-xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <button className={primaryButtonClass} type="button" onClick={() => copyText(chmod.command)}>
            <Copy size={16} />Copy chmod command
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
            <label className="text-sm font-bold">
              Foreground
              <span className="mt-2 flex gap-2">
                <input className="h-11 w-14 cursor-pointer rounded-xl border border-[var(--tool-border)]" type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} />
                <input className={fieldClass} value={foreground} onChange={(event) => setForeground(event.target.value)} />
              </span>
            </label>
            <label className="text-sm font-bold">
              Background
              <span className="mt-2 flex gap-2">
                <input className="h-11 w-14 cursor-pointer rounded-xl border border-[var(--tool-border)]" type="color" value={background} onChange={(event) => setBackground(event.target.value)} />
                <input className={fieldClass} value={background} onChange={(event) => setBackground(event.target.value)} />
              </span>
            </label>
          </div>
          <div className="rounded-2xl border border-[var(--tool-border)] p-6 text-center" style={{ background, color: foreground }}>
            <p className="text-3xl font-black">The quick brown fox</p>
            <p className="mt-2 text-sm">Large text sample at 18.5px / 24px equivalent.</p>
          </div>
          {contrast.error ? (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{contrast.error}</p>
          ) : (
            <>
              <p className="text-4xl font-black tabular-nums">{contrast.ratio.toFixed(2)}:1</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {checks.map(([label, pass]) => (
                  <p key={label} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${pass ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                    {pass ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
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
        <label className="block text-sm font-bold">
          Input
          <textarea className={`${areaClass} mt-2`} value={input} onChange={(event) => setInput(event.target.value)} />
        </label>
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
        <button className={primaryButtonClass} type="button" onClick={run}>
          <WandSparkles size={18} />Generate result
        </button>
        <ResultBox value={output} filename={`${tool.slug}.txt`} />
      </div>
    </ToolWorkbench>
  );
}
