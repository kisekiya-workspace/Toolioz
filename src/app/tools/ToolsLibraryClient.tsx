'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ElementType } from 'react';
import Link from 'next/link';
import { ArrowRight, Command, Grid3X3, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { TOOLS as IMPORTED_TOOLS } from '@/data/sociials-tools';
import { TOOLS as CORE_TOOLS } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';

type LibraryTool = {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  category: string;
  popular?: boolean;
};

const importedPaths = new Set(IMPORTED_TOOLS.map((tool) => tool.href));
const categoryNames = {
  finance: 'Finance',
  devtools: 'Developer',
  design: 'Design',
  pdftools: 'PDF',
  biodata: 'Utility',
} as const;

const TOOLS: LibraryTool[] = [
  ...IMPORTED_TOOLS,
  ...CORE_TOOLS.filter((tool) => !importedPaths.has(tool.href)).map((tool) => ({
    title: tool.title,
    description: tool.desc,
    href: tool.href,
    icon: tool.icon,
    category: categoryNames[tool.category],
    popular: tool.isTrending,
  })),
];

export default function ToolsLibraryClient() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const searchRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(TOOLS.map((tool) => tool.category)))],
    []
  );

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((name) => [
          name,
          name === 'All'
            ? TOOLS.length
            : TOOLS.filter((tool) => tool.category === name).length,
        ])
      ),
    [categories]
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return TOOLS.filter(
      (tool) =>
        (category === 'All' || tool.category === category) &&
        (!term ||
          `${tool.title} ${tool.description} ${tool.category}`
            .toLowerCase()
            .includes(term))
    );
  }, [category, query]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        {/* Skimmed Compact Hero Header */}
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                All Utilities Directory ({TOOLS.length})
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50">
              Complete <span className="text-blue-600">Tool Directory</span>
            </h1>
            
            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Browse or instantly filter through 60+ finance calculators, developer helpers, PDF converters, and design tools.
            </p>

            {/* Search Box */}
            <div className="mx-auto mt-5 max-w-xl">
              <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white p-2 transition-all focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900">
                <Search size={18} className="ml-3 shrink-0 text-zinc-400" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search JSON, SIP, PDF, hash, unit converter…"
                  className="w-full border-none bg-transparent px-3 py-1 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="mr-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <kbd className="hidden rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] text-zinc-500 sm:inline dark:border-zinc-700 dark:bg-zinc-800 mr-2">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              {categories.map((name) => {
                const active = category === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCategory(name)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      active
                        ? 'border border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
                    }`}
                  >
                    <span>{name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                        active
                          ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                          : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {categoryCounts[name]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pt-2 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 sm:text-2xl dark:text-zinc-50">
                {query ? `Search Results (${results.length})` : `${category} Utilities`}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5 dark:text-zinc-400">
                Fast, secure, browser-native computation suites.
              </p>
            </div>
            <Badge variant="mono" size="sm">
              {results.length} tools
            </Badge>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                No tools found matching &quot;{query}&quot;.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href} className="group block">
                    <Card hoverable className="h-full p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 text-lg font-semibold">
                            <Icon size={20} />
                          </div>
                          <Badge variant="mono" size="sm">
                            {tool.category}
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-blue-600 mb-1 dark:text-zinc-50 dark:group-hover:text-blue-400">
                          {tool.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {tool.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <span>Open Tool</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
