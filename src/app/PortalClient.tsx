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
  FileText,
  Command,
  X,
  Filter,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { HomePublisherExplainer } from '@/components/content/PublisherExplainer';
import { PUBLISHER_READY_TOOLS as TOOLS, CATEGORIES, type Tool } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
  { title: 'Step-by-step guides', href: '/how-to', desc: 'Worked SIP, JSON, PDF, and biodata walkthroughs' },
  { title: 'Amortization notes', href: '/blog/debt-amortization-mathematics-and-mortgage-acceleration-blueprints', desc: 'How EMI and prepayment change remaining interest' },
  { title: 'ATS Resume Builder', href: '/resume-builder', desc: 'Build a resume PDF in the browser and export locally' },
  { title: 'Editorial policy', href: '/editorial-policy', desc: 'What Toolioz indexes, tests, and will not publish' },
];

const FAQS = [
  {
    q: 'Are Toolioz tools free to use?',
    a: 'Yes. Listed calculators and utilities can be used without an account or paywall. Advertising, when approved, does not change calculator outputs.',
  },
  {
    q: 'How does local processing work?',
    a: 'When a page is labelled local processing, its tool inputs and files are handled in your browser rather than uploaded to Toolioz. The website still loads normal page assets and analytics services; see the privacy policy for those separate network requests.',
  },
  {
    q: 'Do the financial formulas match banking and tax standards?',
    a: 'Each published calculator documents its formula, assumptions, and limitations. Results are planning estimates rather than financial or tax advice, and time-sensitive rules should be verified with an official source.',
  },
  {
    q: 'Can I export or download results?',
    a: 'Published tools that produce a file or copyable output include a download or copy control on that page. Not every calculator exports a PDF.',
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
              <h3 className="truncate text-sm font-medium text-[#171717] group-hover:text-[#0072F5] dark:text-[#ededed]">
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
    <div className="w-full min-w-0 overflow-x-hidden bg-[#fafafa] text-[#171717] dark:bg-[#0a0a0a] dark:text-[#ededed]">
      <section className="bg-[#fafafa] pt-8 pb-6 text-center dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3 py-0.5 text-xs font-normal text-[#4d4d4d] dark:bg-[#171717] dark:text-[#a1a1a1]">
              <span className="size-2.5 rounded-full bg-[#0072F5]" />
              {TOOLS.length} reviewed browser-native utilities
            </span>
          </div>

          <h1 className="text-[32px] font-semibold leading-none tracking-[-1.28px] text-[#171717] sm:text-5xl sm:tracking-[-2.28px] dark:text-[#ededed]">
            Calculations, Code & <span className="text-[#0072F5]">Document Utilities</span>
          </h1>

          <div className="mx-auto mt-6 max-w-3xl">
            <div className="relative flex items-center rounded-[12px] bg-white p-2 ds-surface focus-within:shadow-[0_0_0_2px_#fff,0_0_0_4px_#0072F5] dark:bg-[#111]">
              <Search size={22} className="ml-3 shrink-0 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder={`Search published tools (SIP, JSON, Merge PDF)...`}
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
                <kbd className="pointer-events-none rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
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
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-normal ${
                      isActive
                        ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-[#0a0a0a]'
                        : 'bg-[#f2f2f2] text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717] dark:bg-[#171717] dark:text-[#a1a1a1] dark:hover:bg-[#262626] dark:hover:text-[#ededed]'
                    }`}
                  >
                    <span>{tag.label}</span>
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#0a0a0a]'
                          : 'bg-[#ebebeb] text-[#4d4d4d] dark:bg-[#262626] dark:text-[#a1a1a1]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              <Link
                href="/resume-builder"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3.5 py-1 text-xs font-normal text-[#0072F5] hover:bg-[#ebebeb] dark:bg-[#171717] dark:text-[#52aeff]"
              >
                <FileText size={12} className="text-blue-600" />
                <span>Resume Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Filter / Search Results Section (Shown immediately when searching or filtering) */}
      {isFiltering ? (
        <section className="bg-[#fafafa] py-8 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-6 flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">
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
                  className="text-xs font-normal text-[#0072F5]"
                >
                  Reset filters
                </button>
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <div className="rounded-[12px] bg-[#f2f2f2] p-12 text-center ds-surface dark:bg-[#111]">
                <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                  No tools found matching your criteria.
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Try searching with generic terms like &quot;PDF&quot;, &quot;SIP&quot;, &quot;JSON&quot;, or &quot;Converter&quot;.
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
        <section className="bg-[#fafafa] pt-2 pb-14 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-6 flex flex-col gap-1 pb-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#0072F5]">
                  Specialized Suites
                </p>
                <h2 className="mt-0.5 text-xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-2xl dark:text-[#ededed]">
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
                        <h3 className="text-base font-semibold text-[#171717] group-hover:text-[#0072F5] dark:text-[#ededed]">
                          {cat.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 pt-3 text-xs font-medium" style={{ color: cat.color }}>
                        <span>Open Workspace</span>
                        <ArrowRight size={13} />
                      </div>
                    </Card>
                  </Link>
                );
              })}

              {/* Resume Builder Feature Card */}
              <Link href="/resume-builder" className="group block">
                <Card hoverable className="flex h-full flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#0072F5] text-white">
                        <FileText size={18} />
                      </div>
                      <Badge variant="info" size="sm">
                        Featured
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-[#171717] group-hover:text-[#0072F5] dark:text-[#ededed]">
                      ATS Resume Builder
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      Build clean, ATS-compliant resumes with real-time vector PDF rendering and local draft autosave.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 pt-3 text-xs font-medium text-[#0072F5]">
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
        <section className="bg-[#fafafa] py-14 sm:py-16 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-8 flex flex-col gap-3 pb-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] dark:text-[#ededed]">
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
                    className="rounded-full bg-[#f2f2f2] px-3 py-1 text-xs font-normal text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717] dark:bg-[#171717] dark:text-[#a1a1a1] dark:hover:text-[#ededed]"
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
                  <div className="mb-4 flex items-center justify-between pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <cat.icon size={18} style={{ color: cat.color }} className="shrink-0" />
                      <h3 className="text-base font-semibold text-[#171717] dark:text-[#ededed]">{cat.title}</h3>
                      <Badge variant="mono" size="sm">
                        {catTools.length}
                      </Badge>
                    </div>
                    <Link
                      href={HUB_HREF[cat.id]}
                      className="text-xs font-normal text-[#0072F5]"
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
      <section className="bg-[#fafafa] py-14 sm:py-16 dark:bg-[#0a0a0a]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="outline" dot pulse size="sm" className="mb-3">
              Engineered for Precision
            </Badge>
            <h2 className="mb-4 text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl dark:text-[#ededed]">
              Local Tool Processing. <br />
              Clear Assumptions and Fast Results.
            </h2>
            <p className="mb-6 text-sm text-zinc-600 leading-relaxed dark:text-zinc-400">
              Tool pages labelled local processing keep their inputs and files inside your browser. Calculators also show the
              assumptions and formulas needed to understand the result.
            </p>

            <div className="space-y-3.5">
              {[
                {
                  icon: Lock,
                  title: 'Local Inputs Where Stated',
                  desc: 'Pages identify when calculations or file processing stay in browser memory.',
                },
                {
                  icon: Zap,
                  title: 'Instantaneous Feedback',
                  desc: 'Immediate results with zero network round-trip latency as you drag sliders or type formulas.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Documented Calculation Methods',
                  desc: 'Published calculators explain their equations, assumptions, examples, and limitations.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-[12px] bg-white p-3.5 ds-surface dark:bg-[#111]">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-[6px] bg-[#f2f2f2] text-[#0072F5] dark:bg-[#171717]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">{title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-0.5 dark:text-zinc-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Visual Card */}
          <div className="relative rounded-[12px] bg-white p-6 ds-surface-elevated sm:p-8 dark:bg-[#111]">
            <div className="mb-5 flex items-center justify-between pb-3">
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

            <div className="mt-6 flex items-center justify-between rounded-[12px] bg-[#f2f2f2] p-3.5 text-xs dark:bg-[#171717]">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#45A557]" />
                <span className="font-medium text-[#171717] dark:text-[#ededed]">
                  Local processing where the tool page says so
                </span>
              </div>
              <span className="font-mono text-[11px] font-medium text-[#4d4d4d] dark:text-[#a1a1a1]">
                See privacy policy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="bg-[#fafafa] py-14 sm:py-16 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-8 flex items-center justify-between pb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#0072F5]">
                Knowledge Hub
              </p>
              <h2 className="mt-0.5 text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl dark:text-[#ededed]">
                Guides & Technical Blueprints
              </h2>
            </div>
            <Link href="/blog" className="text-xs font-normal text-[#0072F5]">
              View all articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BLOG_HUBS.map((hub) => (
              <Link key={hub.href} href={hub.href} className="group block">
                <Card hoverable className="h-full p-5">
                  <div className="mb-3.5 flex size-9 items-center justify-center rounded-[8px] bg-[#f2f2f2] text-[#0072F5] dark:bg-[#171717]">
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-sm font-medium text-[#171717] group-hover:text-[#0072F5] dark:text-[#ededed]">
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

      <HomePublisherExplainer />

      {/* Frequently Asked Questions (Shadcn Accordion) */}
      <section className="bg-[#fafafa] py-14 sm:py-16 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl dark:text-[#ededed]">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
              Answers regarding security, formulas, privacy, and browser utilities.
            </p>
          </div>

          <div className="rounded-[12px] bg-white p-6 ds-surface sm:p-8 dark:bg-[#111]">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem key={faq.q} value={`item-${idx}`}>
                  <AccordionTrigger className="text-sm font-medium text-[#171717] hover:text-[#0072F5] dark:text-[#ededed]">
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
      <section className="bg-[#fafafa] py-14 sm:py-16 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-[12px] bg-white p-8 ds-surface sm:p-12 dark:bg-[#111]">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl dark:text-[#ededed]">
              Ready to Calculate, Convert or Build?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-zinc-500 sm:text-sm leading-relaxed dark:text-zinc-400">
              Choose a tool and start solving immediately. No credit card, no sign-in required.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="brand" size="default">
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
                className="font-normal text-[#0072F5]"
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
