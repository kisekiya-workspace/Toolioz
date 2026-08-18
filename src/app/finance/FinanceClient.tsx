'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search, Landmark, ShieldCheck, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { financeBlogPosts } from '@/lib/finance-blog-content';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';

export default function FinanceClient() {
  const [search, setSearch] = useState('');

  const financeTools = TOOLS.filter(t => t.category === 'finance');
  const filteredTools = financeTools.filter(tool =>
    tool.title.toLowerCase().includes(search.toLowerCase()) ||
    tool.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.05)_0%,transparent_40%)] py-24 pb-16 text-center md:py-32 md:pb-24">
        <div className="absolute -top-[20%] left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-[850px]">
            <div className="mb-8 inline-flex rounded-full border border-[rgba(37,99,235,0.2)] bg-[rgba(37,99,235,0.1)] px-4 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-[var(--primary)]">Finance Suite v2026</div>
            <h1 className="mb-6 text-[clamp(2.75rem,8vw,4.5rem)] font-black leading-[1.1] tracking-[-0.02em]">Precision <span className="text-[var(--primary)]">Financial</span> Intelligence</h1>
            <p className="mb-14 text-[1.125rem] leading-[1.6] text-[var(--text-secondary)] md:text-[1.35rem]">
              Take full control of your wealth with our bank-grade mathematical engines and practical finance guides.
              Always updated for the latest planning needs across investing, debt, and inflation-aware goals.
            </p>

            <div className="mx-auto mb-12 max-w-[650px]">
              <div className="rounded-xl border border-(--border) bg-white p-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] focus-within:border-(--primary) focus-within:shadow-[0_15px_45px_-10px_rgba(37,99,235,0.15)]">
                <Input
                  placeholder="Search for a finance tool (e.g. SIP, Tax, ROI)"
                  prefix={<Search size={22} />}
                  className="border-none outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 text-[0.875rem] font-semibold text-[var(--text-secondary)] md:flex-row md:gap-10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10b981]" />
                <span>Verified Formulas</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#10b981]" />
                <span>Lump sum & SIP support</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-[#10b981]" />
                <span>Inflation Adjusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-24">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-[2.5rem] font-extrabold tracking-[-0.01em]">
              {search ? `Search Results for "${search}"` : 'All Financial Calculators'}
            </h2>
          </div>
          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="block">
                <Card hoverable className="relative flex h-full flex-col gap-6 !rounded-[var(--radius-xl)] !p-10">
                  <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                    <tool.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-[1.35rem] font-extrabold">{tool.title}</h3>
                    <p className="text-base leading-[1.6] text-[var(--text-secondary)]">{tool.desc}</p>
                  </div>
                  {tool.isTrending && (
                    <div className="absolute right-6 top-6 rounded-full bg-[#fef3c7] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.05em] text-[#92400e]">Trending</div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(241,245,249,0.75))] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
                <BookOpen size={16} />
                Finance Guides
              </div>
              <h2 className="text-[2.25rem] font-black tracking-[-0.02em] text-[var(--text-primary)] md:text-[3.25rem]">
                Research-backed articles for better money decisions
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
                Read practical guides on SIP growth, lump sum investing, retirement planning,
                debt payoff, and inflation-aware goal setting.
              </p>
            </div>
            <Link
              href="/finance/blog"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-5 py-3 text-sm font-bold text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              View all articles <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {financeBlogPosts.slice(0, 4).map((post) => (
              <Link key={post.slug} href={`/finance/blog/${post.slug}`} className="block">
                <div className="group h-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 shadow-sm hover:border-[var(--primary)] hover:shadow-[var(--shadow-lg)]">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                      <BookOpen size={12} />
                      {post.readTime}
                    </span>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                      Guide
                    </span>
                  </div>
                  <h3 className="mb-3 text-[1.2rem] font-extrabold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                    {post.title}
                  </h3>
                  <p className="text-[0.9rem] leading-6 text-[var(--text-secondary)] line-clamp-4">
                    {post.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--primary)]">
                      {post.keywords[0]}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-bold text-[var(--primary)]">
                      Read more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container section !py-8">
        <FinancialDisclaimer />
      </section>

      <Footer />
    </div>
  );
}
