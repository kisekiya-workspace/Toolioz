'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  TrendingUp,
  ArrowRight,
  Zap,
  ShieldCheck,
  Lock,
  ChevronDown,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { TOOLS, CATEGORIES, type Tool } from '@/lib/tools';

const HUB_HREF: Record<string, string> = {
  finance: '/finance',
  devtools: '/devtools',
  design: '/design',
  pdftools: '/pdftools',
  biodata: '/biodata',
};

const QUICK_LINKS = [
  { label: 'SIP', href: '/finance/sip-calculator' },
  { label: 'Drawesome', href: '/devtools/drawesome' },
  { label: 'JSON', href: '/devtools/json-formatter' },
  { label: 'ditherit', href: '/devtools/ditherit' },
  { label: 'Merge PDF', href: '/pdftools/merge-pdf' },
  { label: 'Biodata', href: '/biodata/biodata-generator' },
];

const BLOG_HUBS = [
  { title: 'Finance guides', href: '/finance/blog', desc: 'SIP, tax, loans & retirement' },
  { title: 'Dev guides', href: '/devtools/blog', desc: 'JSON, JWT, regex & more' },
  { title: 'PDF tips', href: '/pdftools/blog', desc: 'Merge, compress & workflows' },
  { title: 'Biodata help', href: '/biodata/blog', desc: 'Formats, photos & templates' },
];

const FAQS = [
  {
    q: 'Are these tools really free?',
    a: 'Yes. No trials, no signup, and no paywall on core calculators and utilities.',
  },
  {
    q: 'Is my data secure?',
    a: 'Calculations and file processing run in your browser. Sensitive inputs are not stored on our servers.',
  },
  {
    q: 'Do the finance formulas match real-world use?',
    a: 'We use standard EMI, SIP, tax, and compounding formulas used in planning—not generic placeholders.',
  },
  {
    q: 'Can I suggest a new tool?',
    a: 'Use the contact page—we add utilities based on what users search for most.',
  },
];

const SECTION = 'px-4 sm:px-6';
const HEADING_LG = 'text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl md:text-4xl';

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className="group block min-w-0">
      <article className="flex h-full items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] sm:gap-4 sm:p-5 sm:hover:-translate-y-0.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
          style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
        >
          <tool.icon size={20} strokeWidth={2} className="sm:h-[22px] sm:w-[22px]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-0.5 text-base font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)] sm:mb-1 sm:text-lg">
            {tool.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">{tool.desc}</p>
        </div>
        <ArrowRight
          size={16}
          className="mt-0.5 hidden shrink-0 text-[var(--text-tertiary)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:mt-1 sm:block"
          style={{ color: tool.color }}
        />
      </article>
    </Link>
  );
}

export default function PortalClient() {
  const [search, setSearch] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredTools = useMemo(
    () =>
      TOOLS.filter(
        (tool) =>
          tool.title.toLowerCase().includes(search.toLowerCase()) ||
          tool.desc.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const trendingTools = useMemo(() => TOOLS.filter((t) => t.isTrending), []);
  const toolCount = TOOLS.length;

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[var(--bg-primary)]">
      <section className={`relative overflow-hidden border-b border-[var(--border)] ${SECTION}`}>
        <div className="landing-hero-grid pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.07] sm:-right-32 sm:-top-32 sm:h-[420px] sm:w-[420px]"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl py-10 sm:py-14 md:py-20">
          <div className="landing-stagger mx-auto max-w-3xl text-center lg:max-w-4xl">
            <p className="mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] sm:mb-5 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.12em]">
              <Sparkles size={13} className="shrink-0 text-[var(--primary)] sm:size-[14px]" />
              <span>{toolCount}+ free tools · Private by default</span>
            </p>

            <h1 className="mb-4 text-[clamp(1.75rem,7vw,4.25rem)] font-black leading-[1.08] tracking-[-0.03em] text-[var(--text-primary)] sm:mb-6 sm:leading-[1.05] sm:tracking-[-0.035em]">
              Finance, dev & PDF tools
              <span className="mt-1 block text-[var(--primary)]">that run in your browser</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-sm leading-6 text-[var(--text-secondary)] sm:mb-10 sm:text-base sm:leading-7 md:text-lg">
              SIP and tax calculators, JSON utilities, PDF merge, marriage biodata, and ATS resumes—accurate and
              private.
            </p>

            <label className="mx-auto mb-4 block w-full max-w-xl text-left">
              <span className="sr-only">Search tools</span>
              <div className="flex min-w-0 items-center gap-2 rounded-[var(--radius-lg)] border-2 border-[var(--border-strong)] bg-[var(--surface)] px-3 py-0.5 shadow-[var(--shadow-sm)] transition-shadow focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)] sm:gap-3 sm:px-4 sm:py-1">
                <Search size={20} className="shrink-0 text-[var(--text-tertiary)] sm:size-[22px]" aria-hidden />
                <input
                  type="search"
                  placeholder="Search tools…"
                  className="min-w-0 flex-1 border-none bg-transparent py-3 text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </label>

            <div className="mb-6 flex flex-wrap justify-center gap-1.5 sm:mb-8 sm:gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:px-3.5 sm:py-1.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex w-full flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
              <Link
                href="/finance"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-[var(--shadow-md)] transition-all hover:bg-[var(--primary-hover)] sm:h-12 sm:px-7 sm:text-base"
              >
                Browse finance tools
                <ArrowRight size={16} className="sm:size-[18px]" />
              </Link>
              <Link
                href="/resume-builder"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)] sm:h-12 sm:px-7 sm:text-base"
              >
                ATS resume builder
              </Link>
            </div>
          </div>

          <ul className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-2 text-center text-xs text-[var(--text-secondary)] sm:mt-12 sm:flex sm:max-w-lg sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-4 sm:text-sm">
            <li className="flex flex-col rounded-lg bg-[var(--bg-secondary)]/80 px-2 py-3 sm:bg-transparent sm:px-0 sm:py-0">
              <strong className="text-xl font-black tabular-nums text-[var(--text-primary)] sm:text-2xl">{toolCount}+</strong>
              <span>tools</span>
            </li>
            <li className="flex flex-col rounded-lg bg-[var(--bg-secondary)]/80 px-2 py-3 sm:bg-transparent sm:px-0 sm:py-0">
              <strong className="text-xl font-black text-[var(--text-primary)] sm:text-2xl">100%</strong>
              <span className="hidden sm:inline">client-side</span>
              <span className="sm:hidden">local</span>
            </li>
            <li className="flex flex-col rounded-lg bg-[var(--bg-secondary)]/80 px-2 py-3 sm:bg-transparent sm:px-0 sm:py-0">
              <strong className="text-xl font-black text-[var(--success)] sm:text-2xl">Free</strong>
              <span>no account</span>
            </li>
          </ul>
        </div>
      </section>

      {!search && trendingTools.length > 0 && (
        <section className={`border-b border-[var(--border)] bg-[var(--bg-secondary)] py-8 sm:py-10 md:py-12 ${SECTION}`}>
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 sm:mb-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Popular now</p>
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)] sm:text-2xl md:text-3xl">
                Trending tools
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {trendingTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 transition-all hover:shadow-[var(--shadow-md)] sm:p-4 sm:hover:-translate-y-0.5"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
                    style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
                  >
                    <tool.icon size={18} className="sm:size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] sm:text-base">
                      {tool.title}
                    </span>
                    <span className="block truncate text-xs text-[var(--text-tertiary)]">{tool.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!search && (
        <section className={`border-b border-[var(--border)] py-10 sm:py-14 md:py-20 ${SECTION}`}>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 sm:mb-10 md:mb-14">
              <h2 className={`mb-2 sm:mb-3 ${HEADING_LG}`}>Four suites, one place</h2>
              <p className="max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base md:text-lg">
                Jump into a category hub for guides, blogs, and every tool in that family.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              {CATEGORIES.map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={HUB_HREF[cat.id]}
                    className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:shadow-[var(--shadow-lg)] sm:p-8 sm:hover:-translate-y-1"
                  >
                    <div
                      className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full opacity-[0.08] sm:h-32 sm:w-32 sm:translate-x-8 sm:-translate-y-8"
                      style={{ backgroundColor: cat.color }}
                      aria-hidden
                    />
                    <cat.icon size={24} style={{ color: cat.color }} className="mb-4 sm:mb-5 sm:size-7" />
                    <h3 className="mb-1.5 text-xl font-extrabold text-[var(--text-primary)] sm:mb-2 sm:text-2xl">{cat.title}</h3>
                    <p className="mb-3 text-sm text-[var(--text-secondary)] sm:mb-4 sm:max-w-md sm:text-base">{cat.desc}</p>
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] sm:text-sm">
                      {count} tools ·{' '}
                      <span className="inline-flex items-center gap-1 text-[var(--primary)]">
                        Open hub <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </p>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/resume-builder"
              className="mt-4 flex flex-col gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)] p-4 transition-colors hover:border-[var(--primary)] sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Also featured</p>
                <p className="text-base font-bold text-[var(--text-primary)] sm:text-lg">ATS resume builder — vector PDF</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                Build resume <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </section>
      )}

      <section className={`border-b border-[var(--border)] bg-[var(--bg-secondary)] py-10 sm:py-14 md:py-20 ${SECTION}`}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h2 className={HEADING_LG}>{search ? 'Search results' : 'All tools'}</h2>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)] sm:mt-2 sm:text-base">
                {search
                  ? `${filteredTools.length} match${filteredTools.length === 1 ? '' : 'es'} for “${search}”`
                  : 'Browse by category or search above.'}
              </p>
            </div>
            {!search && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#cat-${cat.id}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)] sm:px-3 sm:text-xs"
                  >
                    {cat.title.replace(' Tools', '').replace(' Utilities', '')}
                  </a>
                ))}
              </div>
            )}
          </div>

          {search ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {filteredTools.length === 0 ? (
                <p className="col-span-full py-10 text-center text-sm text-[var(--text-secondary)] sm:py-12">
                  No tools found. Try &quot;SIP&quot;, &quot;JSON&quot;, or &quot;PDF&quot;.
                </p>
              ) : (
                filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
              )}
            </div>
          ) : (
            CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.category === cat.id);
              if (catTools.length === 0) return null;
              return (
                <div key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-20 last:mb-0 sm:mb-14 sm:scroll-mt-24">
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2.5 sm:mb-6 sm:gap-4 sm:pb-3">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <cat.icon size={20} style={{ color: cat.color }} className="shrink-0 sm:size-[22px]" />
                      <h3 className="truncate text-lg font-bold text-[var(--text-primary)] sm:text-xl">{cat.title}</h3>
                    </div>
                    <Link
                      href={HUB_HREF[cat.id]}
                      className="shrink-0 text-xs font-semibold text-[var(--primary)] hover:underline sm:text-sm"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {catTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className={`border-b border-[var(--border)] py-10 sm:py-14 md:py-20 ${SECTION}`}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)] sm:mb-3">Why Toolioz</p>
            <h2 className={`mb-4 sm:mb-5 ${HEADING_LG}`}>Built for accuracy, not ads</h2>
            <p className="mb-6 text-sm text-[var(--text-secondary)] sm:mb-8 sm:text-base md:text-lg">
              Real formulas for finance. Local processing for dev tools. Drafts stay on your device for biodata and
              resume flows.
            </p>
            <ul className="space-y-4 sm:space-y-5">
              {[
                { icon: Zap, title: 'Instant results', text: 'No queue, no login—open a tool and go.' },
                { icon: Lock, title: 'Privacy first', text: 'Inputs stay in your browser for core calculators.' },
                { icon: ShieldCheck, title: 'Production quality', text: 'Clean UI, readable outputs, mobile-friendly.' },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3 sm:gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] sm:h-10 sm:w-10">
                    <Icon size={18} className="sm:size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[var(--text-primary)] sm:text-base">{title}</span>
                    <span className="text-sm text-[var(--text-secondary)]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 sm:p-8 md:p-10">
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xl)]">
              <div className="flex gap-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 sm:px-4 sm:py-3">
                <span className="h-2 w-2 rounded-full bg-[#ef4444]/60 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]/60 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-[#10b981]/60 sm:h-2.5 sm:w-2.5" />
              </div>
              <div className="space-y-2.5 p-4 sm:space-y-3 sm:p-6">
                <div className="h-2 w-[55%] rounded bg-[var(--bg-tertiary)] sm:h-2.5" />
                <div className="h-2 w-[80%] rounded bg-[var(--bg-tertiary)] sm:h-2.5" />
                <div className="h-2 w-[40%] rounded bg-[var(--bg-tertiary)] sm:h-2.5" />
                <div className="mt-4 flex h-16 items-end gap-1.5 sm:mt-6 sm:h-24 sm:gap-2">
                  {[45, 72, 95, 58, 82].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[var(--primary)]"
                      style={{ height: `${h}%`, opacity: 0.35 + i * 0.12 }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold shadow-[var(--shadow-md)] sm:absolute sm:-bottom-3 sm:right-6 sm:mt-0 sm:justify-start">
              <TrendingUp size={14} className="text-[var(--success)]" />
              Live in-browser math
            </p>
          </div>
        </div>
      </section>

      {!search && (
        <section className={`border-b border-[var(--border)] bg-[var(--bg-secondary)] py-10 sm:py-14 md:py-16 ${SECTION}`}>
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-2 sm:mb-8">
              <BookOpen size={18} className="shrink-0 text-[var(--primary)] sm:size-5" />
              <h2 className="text-xl font-black text-[var(--text-primary)] sm:text-2xl md:text-3xl">Guides & blogs</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {BLOG_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:shadow-[var(--shadow-md)] sm:p-5 sm:hover:-translate-y-0.5"
                >
                  <h3 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">{hub.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">{hub.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!search && (
        <section className={`border-b border-[var(--border)] py-10 sm:py-14 md:py-20 ${SECTION}`}>
          <div className="mx-auto max-w-6xl text-center">
            <h2 className={`mb-2 sm:mb-3 ${HEADING_LG}`}>How it works</h2>
            <p className="mx-auto mb-8 max-w-xl text-sm text-[var(--text-secondary)] sm:mb-12 sm:text-base">
              Pick a tool, enter your data, get an answer—no account needed.
            </p>
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6 md:gap-8">
              {[
                { n: '1', title: 'Choose a tool', desc: 'Finance, dev, PDF, or biodata—from the hub or search.' },
                { n: '2', title: 'Work locally', desc: 'Your inputs process on your device for most utilities.' },
                { n: '3', title: 'Export or share', desc: 'Copy results, download PDFs, or save drafts in-browser.' },
              ].map((step) => (
                <li key={step.n} className="px-2 sm:px-4">
                  <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-black text-white sm:mb-4 sm:h-10 sm:w-10">
                    {step.n}
                  </span>
                  <h3 className="mb-1.5 text-base font-bold text-[var(--text-primary)] sm:mb-2 sm:text-lg">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className={`border-b border-[var(--border)] py-10 sm:py-14 md:py-20 ${SECTION}`}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-black text-[var(--text-primary)] sm:mb-8 sm:text-3xl">Common questions</h2>
          <div className="space-y-2.5 sm:space-y-3">
            {FAQS.map((faq, idx) => {
              const open = activeFaq === idx;
              return (
                <div key={faq.q} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 p-4 text-left text-sm font-bold text-[var(--text-primary)] sm:items-center sm:gap-4 sm:p-5 sm:text-base"
                    onClick={() => setActiveFaq(open ? null : idx)}
                    aria-expanded={open}
                  >
                    <span className="min-w-0 flex-1">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`mt-0.5 shrink-0 text-[var(--text-tertiary)] transition-transform sm:mt-0 ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-[var(--border)] px-4 pb-4 sm:px-5 sm:pb-5">
                      <p className="pt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-10 sm:py-14 md:py-16 ${SECTION}`}>
        <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--text-primary)] px-5 py-8 text-center text-[var(--bg-primary)] sm:px-8 sm:py-10 md:px-12 md:py-14">
          <h2 className="mb-2 text-xl font-black sm:mb-3 sm:text-2xl md:text-3xl">Start with what you need today</h2>
          <p className="mb-6 text-sm opacity-80 sm:mb-8 md:text-base">
            Plan investments, debug JSON, merge a PDF, or ship a resume—all free on Toolioz.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
            <Link
              href="/finance/sip-calculator"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-bold text-white hover:bg-[var(--primary-hover)] sm:text-base"
            >
              SIP calculator
            </Link>
            <Link
              href="/biodata/biodata-generator"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 px-6 text-sm font-bold hover:bg-white/10 sm:text-base"
            >
              Biodata maker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
