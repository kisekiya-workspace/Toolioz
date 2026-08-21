'use client';

import React, { useMemo, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Copy, GitCompareArrows, RefreshCw } from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';


type DiffKind = 'added' | 'removed' | 'changed' | 'type-changed';

interface DiffItem {
  path: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

const KIND_CLASS: Record<DiffKind, string> = {
  added: 'bg-[rgba(16,185,129,0.14)] text-[#047857]',
  removed: 'bg-[rgba(239,68,68,0.13)] text-[#b91c1c]',
  changed: 'bg-[rgba(59,130,246,0.13)] text-[#1d4ed8]',
  'type-changed': 'bg-[rgba(245,158,11,0.16)] text-[#b45309]',
};

const SAMPLE_BEFORE = {
  id: 1420,
  role: 'viewer',
  profile: { name: 'Alex', team: 'ops' },
  features: ['reports'],
  active: true,
};

const SAMPLE_AFTER = {
  id: 1420,
  role: 'admin',
  profile: { name: 'Alex', team: 'platform', region: 'apac' },
  features: ['reports', 'exports'],
  active: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pushDiff(
  diffs: DiffItem[],
  path: string,
  kind: DiffKind,
  before?: unknown,
  after?: unknown,
): void {
  diffs.push({ path, kind, before, after });
}

function childPath(base: string, key: string | number): string {
  if (typeof key === 'number') return `${base}[${key}]`;
  return `${base}.${key}`;
}

function compareValues(before: unknown, after: unknown, path: string, diffs: DiffItem[]): void {
  if (Array.isArray(before) && Array.isArray(after)) {
    const maxLen = Math.max(before.length, after.length);
    for (let index = 0; index < maxLen; index += 1) {
      const nextPath = childPath(path, index);
      if (index >= before.length) {
        pushDiff(diffs, nextPath, 'added', undefined, after[index]);
        continue;
      }
      if (index >= after.length) {
        pushDiff(diffs, nextPath, 'removed', before[index], undefined);
        continue;
      }
      compareValues(before[index], after[index], nextPath, diffs);
    }
    return;
  }

  if (isRecord(before) && isRecord(after)) {
    const keySet = new Set([...Object.keys(before), ...Object.keys(after)]);
    const keys = Array.from(keySet).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
      const hasBefore = Object.prototype.hasOwnProperty.call(before, key);
      const hasAfter = Object.prototype.hasOwnProperty.call(after, key);
      const nextPath = childPath(path, key);

      if (!hasBefore && hasAfter) {
        pushDiff(diffs, nextPath, 'added', undefined, after[key]);
        continue;
      }
      if (hasBefore && !hasAfter) {
        pushDiff(diffs, nextPath, 'removed', before[key], undefined);
        continue;
      }

      compareValues(before[key], after[key], nextPath, diffs);
    }
    return;
  }

  if (Object.is(before, after)) return;

  const beforeType = Array.isArray(before) ? 'array' : typeof before;
  const afterType = Array.isArray(after) ? 'array' : typeof after;
  const kind: DiffKind = beforeType === afterType ? 'changed' : 'type-changed';
  pushDiff(diffs, path, kind, before, after);
}

function diffJson(before: unknown, after: unknown): DiffItem[] {
  const diffs: DiffItem[] = [];
  compareValues(before, after, '$', diffs);
  return diffs;
}

function valuePreview(value: unknown): string {
  if (value === undefined) return '-';

  const serialized =
    typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);

  if (!serialized) return String(value);
  return serialized.length > 88 ? `${serialized.slice(0, 85)}...` : serialized;
}

export default function JsonDiffClient() {
  const [beforeInput, setBeforeInput] = useState(JSON.stringify(SAMPLE_BEFORE, null, 2));
  const [afterInput, setAfterInput] = useState(JSON.stringify(SAMPLE_AFTER, null, 2));
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(
    () =>
      diffs.reduce(
        (acc, item) => {
          acc[item.kind] += 1;
          return acc;
        },
        { added: 0, removed: 0, changed: 0, 'type-changed': 0 } as Record<DiffKind, number>,
      ),
    [diffs],
  );

  const runDiff = () => {
    try {
      const beforeParsed = JSON.parse(beforeInput);
      const afterParsed = JSON.parse(afterInput);
      const nextDiffs = diffJson(beforeParsed, afterParsed);
      setDiffs(nextDiffs);
      setError(null);
    } catch (parseError) {
      setDiffs([]);
      setError(
        parseError instanceof Error
          ? parseError.message
          : 'Could not parse one of the JSON inputs.',
      );
    }
  };

  const clearAll = () => {
    setBeforeInput('');
    setAfterInput('');
    setDiffs([]);
    setError(null);
  };

  const copyDiffs = async () => {
    await navigator.clipboard.writeText(JSON.stringify(diffs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/80 px-3 py-0.5 text-xs font-semibold text-teal-700 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300">
                Data Comparison
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              JSON Diff Checker
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Compare two JSON payloads and inspect field-level changes before merging API or config updates.
            </p>
          </div>
        </header>

        <section className="container pb-12 pt-2 sm:pt-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card className="min-w-0 !p-4">
              <h2 className="mb-3 text-[0.95rem] font-semibold">Before JSON</h2>
              <textarea
                className="min-h-[280px] w-full resize-y rounded-xl border border-[var(--border)] p-4 font-mono text-[0.86rem] outline-none focus:border-[#0f766e]"
                value={beforeInput}
                onChange={(event) => setBeforeInput(event.target.value)}
                spellCheck={false}
              />
            </Card>

            <Card className="min-w-0 !p-4">
              <h2 className="mb-3 text-[0.95rem] font-semibold">After JSON</h2>
              <textarea
                className="min-h-[280px] w-full resize-y rounded-xl border border-[var(--border)] p-4 font-mono text-[0.86rem] outline-none focus:border-[#0f766e]"
                value={afterInput}
                onChange={(event) => setAfterInput(event.target.value)}
                spellCheck={false}
              />
            </Card>
          </div>

          <div className="mb-3 mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={runDiff}>
              <GitCompareArrows size={16} />
              Compare JSON
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <RefreshCw size={16} />
              Clear
            </Button>
            <button className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)] px-3 py-2 text-[0.82rem] font-bold text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-60" onClick={copyDiffs} disabled={diffs.length === 0}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Diff JSON'}
            </button>
          </div>

          {error && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-3.5 py-3 text-[0.9rem] text-[#b91c1c]">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <Card className="!p-4">
            <div className="mb-4 flex flex-wrap justify-between gap-4">
              <h3 className="text-base font-semibold">Diff Results</h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[rgba(16,185,129,0.14)] px-3 py-1 text-xs font-bold text-[#047857]">Added: {summary.added}</span>
                <span className="rounded-full bg-[rgba(239,68,68,0.13)] px-3 py-1 text-xs font-bold text-[#b91c1c]">Removed: {summary.removed}</span>
                <span className="rounded-full bg-[rgba(59,130,246,0.13)] px-3 py-1 text-xs font-bold text-[#1d4ed8]">Changed: {summary.changed}</span>
                <span className="rounded-full bg-[rgba(245,158,11,0.16)] px-3 py-1 text-xs font-bold text-[#b45309]">
                  Type changed: {summary['type-changed']}
                </span>
              </div>
            </div>

            {diffs.length === 0 && !error ? (
              <p className="text-[0.95rem] text-[var(--text-secondary)]">No differences yet. Run a comparison to inspect changes.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {diffs.map((diff) => (
                  <div key={`${diff.path}-${diff.kind}`} className="rounded-xl border border-[var(--border)] p-3">
                    <div className="mb-2 break-all font-mono text-[0.82rem] text-[var(--text-primary)]">{diff.path}</div>
                    <div className={`mb-2 inline-flex rounded-full px-2 py-1 text-[0.7rem] font-extrabold uppercase tracking-wide ${KIND_CLASS[diff.kind]}`}>{diff.kind}</div>
                    <div className="flex flex-col gap-1.5">
                      <span className="break-all font-mono text-sm text-[var(--text-secondary)]">before: {valuePreview(diff.before)}</span>
                      <span className="break-all font-mono text-sm text-[var(--text-secondary)]">after: {valuePreview(diff.after)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        <SEOSection
          title="JSON Diff Checker"
          description="Run fast JSON comparisons with exact path-level changes for safer API migrations and config reviews."
          howToUse={[
            'Paste old JSON in the first panel and the updated JSON in the second panel.',
            'Click Compare JSON to compute path-level differences.',
            'Review each changed path, including before and after values.',
            'Copy the full diff output when sharing with your team.',
          ]}
          benefits={[
            'Detects additions, removals, value edits, and type changes.',
            'Prevents hidden breaking changes in nested payloads.',
            'Works entirely in-browser with no data upload.',
            'Useful for API regression checks and release reviews.',
          ]}
        />

        <section className="container section" style={{ paddingTop: 0 }}>
          <RelatedTools currentToolId="json-diff" categoryId="devtools" />
        </section>
      </div>
      <Footer />
    </div>
  );
}
