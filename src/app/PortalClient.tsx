'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  Lock,
  BookOpen,
  Sparkles,
  Command,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { TOOLS, CATEGORIES, type Tool } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const HUB_HREF: Record<string, string> = {
  finance: '/finance',
  devtools: '/devtools',
  design: '/design',
  pdftools: '/pdftools',
  biodata: '/biodata',
};

const QUICK_TAGS = [
  { id: 'all', label: 'All Tools' },
  { id: 'finance', label: 'Finance' },
  { id: 'devtools', label: 'Developer' },
  { id: 'design', label: 'Design' },
  { id: 'pdftools', label: 'PDF' },
  { id: 'biodata', label: 'Biodata' },
];

const BLOG_HUBS = [
  { title: 'Research Masterclasses', href: '/blog', desc: 'Quantitative finance, WebAssembly performance & zero-knowledge security' },
  { title: 'Step-by-Step Tutorials', href: '/how-to', desc: 'Actionable guides for PDF optimization, calculations & debugging' },
  { title: 'Top 5 Tool Benchmarks', href: '/top5', desc: 'Comprehensive comparative reviews, matrices & mathematical proofs' },
  { title: 'ATS Resume Builder', href: '/resume-builder', desc: 'Vector PDF generator optimized for applicant tracking scanners' },
];

const FAQS = [
  {
    q: 'Are Toolioz tools 100% free with no limits?',
    a: 'Yes. Every calculator and utility on Toolioz is 100% free with no signups, paywalls, or hidden usage limits. You get immediate access to the full feature set without registration.',
  },
  {
    q: 'How does client-side zero-server privacy work?',
    a: 'Calculations, parsing, document rendering, and image dithering execute entirely in your web browser sandbox using modern JavaScript and WebAssembly. Your financial inputs, confidential documents, and personal details never leave your device.',
  },
  {
    q: 'Do the financial formulas match banking and tax standards?',
    a: 'Yes. Our financial calculators implement exact compound interest, systematic investment plan (SIP), loan prepayment amortization, and tax slab formulas adhering to financial industry standards.',
  },
  {
    q: 'Can I export, print, or download my results?',
    a: 'Yes. All tools provide one-click actions to copy outputs to your clipboard, export data as JSON/CSV, or download vector-quality PDFs and processed images.',
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className="group block min-w-0">
      <Card hoverable className="h-full p-5">
        <div className="flex items-start gap-3.5">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
          >
            <tool.icon size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-zinc-950 transition-colors group-hover:text-blue-600 truncate dark:text-zinc-50 dark:group-hover:text-blue-400">
                {tool.title}
              </h3>
              <ArrowRight
                size={14}
                className="shrink-0 text-zinc-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5"
                style={{ color: tool.color }}
              />
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {tool.desc}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function PortalClient() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      if (!query) return matchesCategory;
      const matchesQuery =
        tool.title.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [search, activeCategory]);

  const isFiltering = search.trim().length > 0 || activeCategory !== 'all';

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* High-Impact Immediate Hero Section */}
      <section className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Feature Pill */}
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
              60+ Browser-Native Precision Utilities
            </span>
          </div>

          {/* Clean 1-Line Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl lg:text-6xl dark:text-zinc-50">
            Calculations, Code & <span className="text-blue-600">Document Utilities</span>
          </h1>

          {/* Ultra-Prominent Search Bar */}
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="relative flex items-center rounded-2xl border-2 border-zinc-200 bg-white p-2 shadow-sm transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900">
              <Search size={22} className="ml-3 shrink-0 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder={`Search across ${TOOLS.length}+ tools (e.g. SIP, JSON, Merge PDF, Drawesome)...`}
                className="w-full border-none bg-transparent px-3.5 py-2 text-base font-medium text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mr-2 flex size-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <div className="hidden items-center gap-1 pr-2 sm:flex">
                <kbd className="pointer-events-none rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-500 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800">
                  <Command size={11} className="inline mr-0.5" /> K
                </kbd>
              </div>
            </div>

            {/* Quick Category & Filter Tabs */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {QUICK_TAGS.map((tag) => {
                const count =
                  tag.id === 'all'
                    ? TOOLS.length
                    : TOOLS.filter((t) => t.category === tag.id).length;
                const isActive = activeCategory === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setActiveCategory(tag.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border border-zinc-900 bg-zinc-900 text-white shadow-xs dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                          : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              <Link
                href="/resume-builder"
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
              >
                <Sparkles size={12} className="text-blue-600" />
                <span>Resume Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Filter / Search Results Section (Shown immediately when searching or filtering) */}
      {isFiltering ? (
        <section className="bg-white py-8 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-blue-600" />
                <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {search
                    ? `Results for "${search}"`
                    : `${activeCategory.toUpperCase()} Utilities`}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="mono" size="sm">
                  {filteredTools.length} tools
                </Badge>
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('all');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  No tools found matching your criteria.
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Try searching with generic terms like "PDF", "SIP", "JSON", or "Converter".
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Workspace Suites Grid (Default View - Seamless right below Search) */
        <section className="bg-white pt-2 pb-14 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Specialized Suites
                </p>
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl text-zinc-950 dark:text-zinc-50 mt-0.5">
                  Explore Specialized Workspaces
                </h2>
              </div>
              <p className="max-w-md text-xs text-zinc-500 dark:text-zinc-400">
                High-performance utilities organized by computational domain.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length;
                return (
                  <Link key={cat.id} href={HUB_HREF[cat.id]} className="group block">
                    <Card hoverable className="h-full p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="flex size-11 items-center justify-center rounded-xl text-lg"
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                          >
                            <cat.icon size={22} />
                          </div>
                          <Badge variant="mono" size="sm">
                            {count} tools
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                          {cat.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs font-semibold" style={{ color: cat.color }}>
                        <span>Open Workspace</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}

              {/* Resume Builder Feature Card */}
              <Link href="/resume-builder" className="group block">
                <Card hoverable className="h-full p-5 flex flex-col justify-between border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                        <Sparkles size={18} />
                      </div>
                      <Badge variant="info" size="sm">
                        Featured
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                      ATS Resume Builder
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      Build clean, ATS-compliant resumes with real-time vector PDF rendering and local draft autosave.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Create Resume</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tools Directory Section (Full categorized listing) */}
      {!isFiltering && (
        <section className="border-t border-zinc-200 bg-white py-14 sm:py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                  All Utilities Directory
                </h2>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                  Fast, secure, browser-native computation suites.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#cat-${cat.id}`}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {cat.title.replace(' Tools', '').replace(' Utilities', '')}
                  </a>
                ))}
              </div>
            </div>

            {CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.category === cat.id);
              if (catTools.length === 0) return null;
              return (
                <div key={cat.id} id={`cat-${cat.id}`} className="mb-12 scroll-mt-24 last:mb-0">
                  <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <cat.icon size={18} style={{ color: cat.color }} className="shrink-0" />
                      <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{cat.title}</h3>
                      <Badge variant="mono" size="sm">
                        {catTools.length}
                      </Badge>
                    </div>
                    <Link
                      href={HUB_HREF[cat.id]}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View category →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {catTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Feature & Privacy Architecture Showcase */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-14 sm:py-16 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <Badge variant="outline" dot pulse size="sm" className="mb-3">
              Engineered for Precision
            </Badge>
            <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-zinc-950 dark:text-zinc-50">
              Zero-Knowledge Processing. <br />
              Zero Compromise on Speed.
            </h2>
            <p className="mb-6 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
              Traditional web utilities upload your personal financial data, confidential documents, and code to remote servers.
              Toolioz executes everything in local WebAssembly and browser memory.
            </p>

            <div className="space-y-3.5">
              {[
                {
                  icon: Lock,
                  title: 'Data Sovereignty Guarantee',
                  desc: 'All computations run locally in client-side RAM. No logs, no telemetry on calculations.',
                },
                {
                  icon: Zap,
                  title: 'Instantaneous Feedback',
                  desc: 'Immediate results with zero network round-trip latency as you drag sliders or type formulas.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Bank-Grade Mathematical Accuracy',
                  desc: 'Standardized compound growth, amortizations, tax deductions, and cryptographic hash engines.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-0.5 dark:text-zinc-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Visual Card */}
          <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/80" />
                <span className="size-2.5 rounded-full bg-amber-500/80" />
                <span className="size-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <Badge variant="mono" size="sm">
                Local Sandbox
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">SIP Compounding Growth</span>
                  <span className="font-mono text-blue-600 font-bold">+14.2% CAGR</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-[78%] bg-blue-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">PDF Vector Compression Ratio</span>
                  <span className="font-mono text-emerald-600 font-bold">-64.8%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-[64%] bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-600 dark:text-zinc-400">Wasm Dithering Execution Time</span>
                  <span className="font-mono text-purple-600 font-bold">4.2ms</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-[95%] bg-purple-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                  Verified Local Execution
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 font-bold dark:text-emerald-300">
                0 Bytes Sent
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="border-t border-zinc-200 bg-white py-14 sm:py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Knowledge Hub
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50 mt-0.5">
                Guides & Technical Blueprints
              </h2>
            </div>
            <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:underline">
              View all articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BLOG_HUBS.map((hub) => (
              <Link key={hub.href} href={hub.href} className="group block">
                <Card hoverable className="h-full p-5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 mb-3.5">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {hub.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {hub.desc}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Shadcn Accordion) */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-14 sm:py-16 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
              Answers regarding security, formulas, privacy, and browser utilities.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem key={faq.q} value={`item-${idx}`}>
                  <AccordionTrigger className="text-sm font-bold text-zinc-950 hover:text-blue-600 dark:text-zinc-50">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-8 sm:p-12 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
              Ready to Calculate, Convert or Build?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-zinc-500 sm:text-sm leading-relaxed dark:text-zinc-400">
              Choose a tool and start solving immediately. No credit card, no sign-in required.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="default" className="shadow-xs">
                <Link href="/finance/sip-calculator">
                  SIP Calculator
                </Link>
              </Button>
              <Button asChild variant="outline" size="default">
                <Link href="/devtools/json-formatter">
                  JSON Formatter
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100 font-semibold dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
              >
                <Link href="/resume-builder">
                  ATS Resume Builder
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
