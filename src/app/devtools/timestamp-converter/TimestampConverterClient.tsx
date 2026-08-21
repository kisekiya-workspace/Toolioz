'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Check, Clock, Copy, RotateCcw, CalendarDays } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';

type EpochUnit = 'seconds' | 'milliseconds';

const FAQS = [
  {
    question: 'How do I know if a timestamp is seconds or milliseconds?',
    answer:
      'Ten digits usually means seconds, while thirteen digits usually means milliseconds. The source API or logging system is the best place to confirm the expected unit.',
  },
  {
    question: 'Why do local and UTC dates look different?',
    answer:
      'They represent the same instant, but UTC shows the time without a local offset. The browser local view applies the time zone configured on the device.',
  },
  {
    question: 'Can I paste a date string into the converter?',
    answer:
      'Yes. Use the date-to-epoch field to convert an ISO-style or datetime-local value back into Unix time.',
  },
  {
    question: 'Is Unix time always based on the same epoch?',
    answer:
      'Yes. Unix time counts from 1970-01-01T00:00:00Z. What changes is the unit, the display format, and the time zone used to render it.',
  },
];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDatetimeLocalValue(date: Date) {
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('');
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
}

function OutputRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-[0.75rem] font-bold text-[var(--text-secondary)] transition hover:border-[#d97706] hover:text-[#b45309]"
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="break-all font-mono text-[0.95rem] leading-7 text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}

export default function TimestampConverterClient() {
  const [epochUnit, setEpochUnit] = useState<EpochUnit>('seconds');
  const [epochInput, setEpochInput] = useState('1710000000');
  const [dateInput, setDateInput] = useState('2024-03-09T12:00');
  const [copied, setCopied] = useState<string | null>(null);

  const epochDate = useMemo(() => {
    const raw = epochInput.trim();
    if (!raw) return null;

    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) return null;

    const ms = epochUnit === 'seconds' ? numeric * 1000 : numeric;
    const parsed = new Date(ms);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [epochInput, epochUnit]);

  const dateFromInput = useMemo(() => {
    const raw = dateInput.trim();
    if (!raw) return null;

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [dateInput]);

  const copyValue = async (label: string, value: string | null) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const resetNow = () => {
    const now = new Date();
    setEpochUnit('seconds');
    setEpochInput(String(Math.floor(now.getTime() / 1000)));
    setDateInput(toDatetimeLocalValue(now));
  };

  const epochSeconds = epochDate ? Math.floor(epochDate.getTime() / 1000) : null;
  const epochMilliseconds = epochDate ? epochDate.getTime() : null;
  const dateEpochSeconds = dateFromInput ? Math.floor(dateFromInput.getTime() / 1000) : null;
  const dateEpochMilliseconds = dateFromInput ? dateFromInput.getTime() : null;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div>
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                Time Utilities
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              Unix Timestamp Converter
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Convert epoch seconds or milliseconds into readable dates, then turn a date string back into Unix time.
            </p>
          </div>
        </header>

        <main className="container pb-12 pt-2 sm:pt-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="flex flex-col gap-6 !p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-[#d97706]" />
                  <h3 className="text-lg font-extrabold">Epoch to Date</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={resetNow} className="text-[var(--text-secondary)]">
                  <RotateCcw size={16} />
                  Use current time
                </Button>
              </div>

              <div className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    epochUnit === 'seconds'
                      ? 'bg-[#d97706] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                  onClick={() => setEpochUnit('seconds')}
                >
                  Seconds
                </button>
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    epochUnit === 'milliseconds'
                      ? 'bg-[#d97706] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                  onClick={() => setEpochUnit('milliseconds')}
                >
                  Milliseconds
                </button>
              </div>

              <Input
                type="number"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder={epochUnit === 'seconds' ? '1710000000' : '1710000000000'}
                className="font-mono"
              />

              {epochDate ? (
                <div className="space-y-3">
                  <OutputRow
                    label="Unix seconds"
                    value={String(epochSeconds)}
                    copied={copied === 'epoch-seconds'}
                    onCopy={() => copyValue('epoch-seconds', String(epochSeconds))}
                  />
                  <OutputRow
                    label="Unix milliseconds"
                    value={String(epochMilliseconds)}
                    copied={copied === 'epoch-milliseconds'}
                    onCopy={() => copyValue('epoch-milliseconds', String(epochMilliseconds))}
                  />
                  <OutputRow
                    label="Local date"
                    value={formatDate(epochDate)}
                    copied={copied === 'local-date'}
                    onCopy={() => copyValue('local-date', formatDate(epochDate))}
                  />
                  <OutputRow
                    label="ISO 8601"
                    value={epochDate.toISOString()}
                    copied={copied === 'iso'}
                    onCopy={() => copyValue('iso', epochDate.toISOString())}
                  />
                  <OutputRow
                    label="UTC string"
                    value={epochDate.toUTCString()}
                    copied={copied === 'utc'}
                    onCopy={() => copyValue('utc', epochDate.toUTCString())}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] p-4 text-[0.95rem] text-[#b91c1c]">
                  Enter a valid numeric timestamp to see the converted date.
                </div>
              )}
            </Card>

            <Card className="flex flex-col gap-6 !p-6">
              <div className="flex items-center gap-2">
                <CalendarDays size={20} className="text-[#d97706]" />
                <h3 className="text-lg font-extrabold">Date to Epoch</h3>
              </div>

              <Input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
              />

              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                The input is interpreted in your browser&apos;s local time zone, which is useful
                when matching log timestamps or schedule events.
              </p>

              {dateFromInput ? (
                <div className="space-y-3">
                  <OutputRow
                    label="Unix seconds"
                    value={String(dateEpochSeconds)}
                    copied={copied === 'date-seconds'}
                    onCopy={() => copyValue('date-seconds', String(dateEpochSeconds))}
                  />
                  <OutputRow
                    label="Unix milliseconds"
                    value={String(dateEpochMilliseconds)}
                    copied={copied === 'date-milliseconds'}
                    onCopy={() => copyValue('date-milliseconds', String(dateEpochMilliseconds))}
                  />
                  <OutputRow
                    label="ISO 8601"
                    value={dateFromInput.toISOString()}
                    copied={copied === 'date-iso'}
                    onCopy={() => copyValue('date-iso', dateFromInput.toISOString())}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] p-4 text-[0.95rem] text-[#b91c1c]">
                  Enter a date and time to generate epoch values.
                </div>
              )}
            </Card>
          </div>
        </main>

        <SEOSection
          title="Unix Timestamp Converter"
          description="A browser-native utility for converting Unix epoch seconds and milliseconds into readable dates, UTC strings, ISO timestamps, and back again."
          howToUse={[
            'Enter a Unix timestamp in seconds or milliseconds.',
            'Switch units if your source system uses a different epoch format.',
            'Review the local, UTC, and ISO outputs to confirm the time zone behavior.',
            'Use the date-to-epoch input when you need to turn a browser-local date back into Unix time.',
          ]}
          benefits={[
            'All conversions happen locally in the browser.',
            'Great for logs, API payloads, analytics timestamps, and scheduling.',
            'Shows multiple date views so timezone issues are easier to spot.',
            'Helps avoid the common seconds-versus-milliseconds mistake.',
          ]}
        />

        <FAQSchema faqs={FAQS} />

        <section className="container section" style={{ paddingTop: 0 }}>
          <RelatedTools currentToolId="timestamp-converter" categoryId="devtools" />
        </section>
      </div>

      <Footer />
    </div>
  );
}
