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
  pdftools: '/pdftools',
  biodata: '/biodata',
};

const QUICK_LINKS = [
  { label: 'SIP Calculator', href: '/finance/sip-calculator' },
  { label: 'Income Tax', href: '/finance/income-tax' },
  { label: 'JSON Formatter', href: '/devtools/json-formatter' },
  { label: 'Merge PDF', href: '/pdftools/merge-pdf' },
  { label: 'Biodata Maker', href: '/biodata/biodata-generator' },
  { label: 'Resume Builder', href: '/resume-builder' },
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

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className="group block max-md:min-w-[268px] max-md:snap-center">
      <article className="flex h-full items-start gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
        >
          <tool.icon size={22} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-lg font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
            {tool.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">{tool.desc}</p>
        </div>
        <ArrowRight
          size={18}
          className="mt-1 shrink-0 text-[var(--text-tertiary)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
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
    <div className="bg-[var(--bg-primary)]">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="landing-hero-grid pointer-events-none absolute inset-0 opacity-80" aria-hidden />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="landing-stagger mx-auto max-w-3xl text-center lg:max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
              <Sparkles size={14} className="text-[var(--primary)]" />
              {toolCount}+ free tools · Private by default
            </p>

            <h1 className="mb-6 text-[clamp(2.25rem,6.5vw,4.25rem)] font-black leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)]">
              Finance, dev & PDF tools
              <span className="mt-1 block text-[var(--primary)]">that run in your browser</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              SIP and tax calculators, JSON and regex utilities, PDF merge, marriage biodata, and ATS resumes—accurate,
              fast, and built for everyday decisions.
            </p>

            <label className="mx-auto mb-4 block max-w-xl text-left">
              <span className="sr-only">Search tools</span>
              <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border-2 border-[var(--border-strong)] bg-[var(--surface)] px-4 py-1 shadow-[var(--shadow-sm)] transition-shadow focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)]">
                <Search size={22} className="shrink-0 text-[var(--text-tertiary)]" aria-hidden />
                <input
                  type="search"
                  placeholder="Search SIP, JSON, biodata, resume…"
                  className="w-full border-none bg-transparent py-3.5 text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] md:text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </label>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/finance"
                className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 text-base font-bold text-white shadow-[var(--shadow-md)] transition-all hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-lg)]"
              >
                Browse finance tools
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/resume-builder"
                className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--surface)] px-7 text-base font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
              >
                ATS resume builder
              </Link>
            </div>
          </div>

          <ul className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center text-sm text-[var(--text-secondary)]">
            <li className="flex flex-col">
              <strong className="text-2xl font-black tabular-nums text-[var(--text-primary)]">{toolCount}+</strong>
              <span>utilities</span>
            </li>
            <li className="hidden h-8 w-px bg-[var(--border)] sm:block" aria-hidden />
            <li className="flex flex-col">
              <strong className="text-2xl font-black text-[var(--text-primary)]">0</strong>
              <span>server uploads for calcs</span>
            </li>
            <li className="hidden h-8 w-px bg-[var(--border)] sm:block" aria-hidden />
            <li className="flex flex-col">
              <strong className="text-2xl font-black text-[var(--success)]">Free</strong>
              <span>no account</span>
            </li>
          </ul>
        </div>
      </section>

      {!search && trendingTools.length > 0 && (
        <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-10 md:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Popular now</p>
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] md:text-3xl">
                Trending tools
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
                  >
                    <tool.icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)]">
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
        <section className="border-b border-[var(--border)] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 md:mb-14">
              <h2 className="mb-3 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
                Four suites, one place
              </h2>
              <p className="max-w-2xl text-lg text-[var(--text-secondary)]">
                Jump into a category hub for guides, blogs, and every tool in that family.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {CATEGORIES.map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={HUB_HREF[cat.id]}
                    className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
                  >
                    <div
                      className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full opacity-[0.08]"
                      style={{ backgroundColor: cat.color }}
                      aria-hidden
                    />
                    <cat.icon size={28} style={{ color: cat.color }} className="mb-5" />
                    <h3 className="mb-2 text-2xl font-extrabold text-[var(--text-primary)]">{cat.title}</h3>
                    <p className="mb-4 max-w-md text-[var(--text-secondary)]">{cat.desc}</p>
                    <p className="text-sm font-semibold text-[var(--text-tertiary)]">
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
              className="mt-5 flex flex-col gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--primary)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Also featured</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">ATS resume builder — vector PDF export</p>
              </div>
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary)]">
                Build resume <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </section>
      )}

      <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
                {search ? 'Search results' : 'All tools'}
              </h2>
              <p className="mt-2 text-[var(--text-secondary)]">
                {search
                  ? `${filteredTools.length} match${filteredTools.length === 1 ? '' : 'es'} for “${search}”`
                  : 'Scroll by category or use search above.'}
              </p>
            </div>
            {!search && (
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#cat-${cat.id}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  >
                    {cat.title.replace(' Tools', '').replace(' Utilities', '')}
                  </a>
                ))}
              </div>
            )}
          </div>

          {search ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTools.length === 0 ? (
                <p className="col-span-full py-12 text-center text-[var(--text-secondary)]">
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
                <div key={cat.id} id={`cat-${cat.id}`} className="mb-14 scroll-mt-24 last:mb-0">
                  <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
                    <div className="flex items-center gap-3">
                      <cat.icon size={22} style={{ color: cat.color }} />
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">{cat.title}</h3>
                    </div>
                    <Link
                      href={HUB_HREF[cat.id]}
                      className="shrink-0 text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 max-md:flex max-md:snap-x max-md:gap-4 max-md:overflow-x-auto max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
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

      <section className="border-b border-[var(--border)] px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">Why Toolioz</p>
            <h2 className="mb-5 text-3xl font-black leading-tight text-[var(--text-primary)] md:text-4xl">
              Built for accuracy, not ads
            </h2>
            <p className="mb-8 text-lg text-[var(--text-secondary)]">
              Every calculator uses real formulas. Dev tools run locally. PDF and biodata flows keep drafts on your
              device unless you choose to export.
            </p>
            <ul className="space-y-5">
              {[
                { icon: Zap, title: 'Instant results', text: 'No queue, no login—open a tool and go.' },
                { icon: Lock, title: 'Privacy first', text: 'Inputs stay in your browser for core calculators.' },
                { icon: ShieldCheck, title: 'Production quality', text: 'Clean UI, readable outputs, mobile-friendly.' },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-bold text-[var(--text-primary)]">{title}</span>
                    <span className="text-[var(--text-secondary)]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 md:p-10">
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xl)]">
              <div className="flex gap-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]/60" />
              </div>
              <div className="space-y-3 p-6">
                <div className="h-2.5 w-[55%] rounded bg-[var(--bg-tertiary)]" />
                <div className="h-2.5 w-[80%] rounded bg-[var(--bg-tertiary)]" />
                <div className="h-2.5 w-[40%] rounded bg-[var(--bg-tertiary)]" />
                <div className="mt-6 flex h-24 items-end gap-2">
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
            <p className="absolute -bottom-3 right-6 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold shadow-[var(--shadow-md)]">
              <TrendingUp size={14} className="text-[var(--success)]" />
              Live in-browser math
            </p>
          </div>
        </div>
      </section>

      {!search && (
        <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-14 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--primary)]" />
              <h2 className="text-2xl font-black text-[var(--text-primary)] md:text-3xl">Guides & blogs</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BLOG_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                >
                  <h3 className="font-bold text-[var(--text-primary)]">{hub.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{hub.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!search && (
        <section className="border-b border-[var(--border)] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-3 text-3xl font-black text-[var(--text-primary)] md:text-4xl">How it works</h2>
            <p className="mx-auto mb-12 max-w-xl text-[var(--text-secondary)]">
              Pick a tool, enter your numbers or data, get an answer—without creating an account.
            </p>
            <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
              {[
                { n: '1', title: 'Choose a tool', desc: 'Finance, dev, PDF, or biodata—from the hub or search.' },
                { n: '2', title: 'Work locally', desc: 'Your inputs process on your device for most utilities.' },
                { n: '3', title: 'Export or share', desc: 'Copy results, download PDFs, or save drafts in-browser.' },
              ].map((step) => (
                <li key={step.n} className="relative px-4">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-black text-white">
                    {step.n}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="border-b border-[var(--border)] px-6 py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-black text-[var(--text-primary)]">Common questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const open = activeFaq === idx;
              return (
                <div key={faq.q} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-[var(--text-primary)]"
                    onClick={() => setActiveFaq(open ? null : idx)}
                    aria-expanded={open}
                  >
                    {faq.q}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[var(--text-tertiary)] transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-[var(--border)] px-5 pb-5">
                      <p className="pt-4 leading-relaxed text-[var(--text-secondary)]">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--text-primary)] px-8 py-10 text-center text-[var(--bg-primary)] md:px-12 md:py-14">
          <h2 className="mb-3 text-2xl font-black md:text-3xl">Start with what you need today</h2>
          <p className="mb-8 text-sm opacity-80 md:text-base">
            Plan investments, debug JSON, merge a PDF, or ship a resume—all free on Toolioz.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/finance/sip-calculator"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-6 font-bold text-white hover:bg-[var(--primary-hover)]"
            >
              SIP calculator
            </Link>
            <Link
              href="/biodata/biodata-generator"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 px-6 font-bold hover:bg-white/10"
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
