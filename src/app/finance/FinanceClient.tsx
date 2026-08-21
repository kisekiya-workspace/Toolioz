'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Landmark, ShieldCheck, Zap, BookOpen, ArrowRight, X } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';

export default function FinanceClient() {
  const [search, setSearch] = useState('');

  const financeTools = TOOLS.filter((t) => t.category === 'finance');
  const filteredTools = financeTools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Skimmed Compact Hero Section */}
      <section className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2">
            <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
              Financial Engineering Suite
            </Badge>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
            Precision <span className="text-blue-600 dark:text-blue-400">Financial</span> Calculators
          </h1>
          
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
            Bank-grade compound interest, SIP projections, tax slab calculators, and amortization schedules.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-5 max-w-xl">
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white p-2 transition-all focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900">
              <Search size={18} className="ml-3 shrink-0 text-zinc-400" />
              <input
                type="search"
                placeholder="Search calculators (e.g. SIP, Tax, ROI, Loan)..."
                className="w-full border-none bg-transparent px-3 py-1 text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mr-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Directory (Directly Visible) */}
      <section className="pt-2 pb-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 sm:text-2xl dark:text-zinc-50">
                {search ? `Search Results (${filteredTools.length})` : 'All Financial Calculators'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5 dark:text-zinc-400">
                Calculators engineered for investment planning, loans, and tax optimization.
              </p>
            </div>
            <Badge variant="mono" size="sm">
              {filteredTools.length} tools
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="group block">
                <Card hoverable className="h-full p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="flex size-11 items-center justify-center rounded-xl text-lg font-semibold"
                        style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                      >
                        <tool.icon size={22} />
                      </div>
                      {tool.isTrending && (
                        <Badge variant="warning" size="sm">
                          Trending
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-blue-600 mb-1 dark:text-zinc-50 dark:group-hover:text-blue-400">
                      {tool.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Calculate now</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Finance Guides Section */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 py-14 sm:py-16 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <BookOpen size={14} />
                Financial Engineering Guides
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
                Essential Financial Blueprints
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse all research articles →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Browser-Based Financial Engineering & Compounding Math',
                description: 'The mathematical frameworks of compounding frequency, annual percentage yields, and cash flow modeling.',
                href: '/blog/the-complete-guide-to-browser-based-financial-engineering',
                readTime: '12 min read',
              },
              {
                title: 'How to Calculate SIP Mutual Fund Returns & XIRR',
                description: 'A complete step-by-step tutorial on calculating mutual fund SIP growth, XIRR returns, and annual step-up multipliers.',
                href: '/how-to/calculate-sip-returns',
                readTime: '8 min read',
              },
              {
                title: 'Top 5 Free Finance Calculators for Indian Investors',
                description: 'Comparative review and mathematical breakdown of the best SIP, tax, FD, and inflation calculators.',
                href: '/top5/best-finance-calculators-india',
                readTime: '10 min read',
              },
            ].map((post) => (
              <Link key={post.href} href={post.href} className="group block">
                <Card hoverable className="h-full p-5 flex flex-col justify-between">
                  <div>
                    <Badge variant="mono" size="sm" className="mb-3">
                      {post.readTime}
                    </Badge>
                    <h3 className="text-sm font-bold text-zinc-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 dark:text-zinc-50">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Read Guide</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <FinancialDisclaimer />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
