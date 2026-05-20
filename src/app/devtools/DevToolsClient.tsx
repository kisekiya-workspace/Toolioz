'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowRight, BookOpen, Search, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { devtoolsBlogPosts } from '@/lib/devtools-blog-content';
import { TOOLS } from '@/lib/tools';

export default function DevToolsClient() {
  const [search, setSearch] = useState('');

  const devTools = useMemo(
    () =>
      TOOLS
        .filter((t) => t.category === 'devtools')
        .sort(
          (a, b) =>
            Number(Boolean(b.isTrending)) - Number(Boolean(a.isTrending)) ||
            a.title.localeCompare(b.title),
        ),
    [],
  );

  const normalizedSearch = search.trim().toLowerCase();
  const filteredTools = useMemo(
    () =>
      devTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(normalizedSearch) ||
          tool.desc.toLowerCase().includes(normalizedSearch),
      ),
    [devTools, normalizedSearch],
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.05)_0%,transparent_40%)] py-24 pb-16 text-center md:py-32 md:pb-24">
        <div className="absolute left-1/2 top-[-20%] h-full w-full -translate-x-1/2 bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
        <div className="container">
          <div className="relative z-10 mx-auto max-w-[850px]">
            <div className="mb-8 inline-flex rounded-full border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.1)] px-4 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-[#d97706]">Dev Productivity Suite</div>
            <h1 className="mb-6 text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-[1.1] tracking-[-0.02em]">Essential <span className="text-[#f59e0b]">Developer</span> Utilities</h1>
            <p className="mb-14 text-[1.125rem] leading-[1.6] text-[var(--text-secondary)] md:text-[1.35rem]">
              Accelerate your workflow with precision tools for data formatting, 
              validation, and transformation. Built for developers who value privacy and speed.
            </p>
            
            <div className="mx-auto mb-12 max-w-[650px]">
              <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 focus-within:-translate-y-[2px] focus-within:border-[#f59e0b] focus-within:shadow-[0_15px_45px_-10px_rgba(245,158,11,0.15)]">
                <Input
                  placeholder="Search tools (e.g. cURL, JWT, JSON diff, regex)"
                  prefix={<Search size={22} />}
                  className="!border-none !text-[1.125rem]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 text-[0.875rem] font-semibold text-[var(--text-secondary)] md:flex-row md:gap-10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10b981]" />
                <span>100% Client-Side</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#10b981]" />
                <span>Instant Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-[#10b981]" />
                <span>Developer-First UI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-24">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-[2.5rem] font-extrabold tracking-[-0.01em]">
              {search ? `Search Results for "${search}"` : 'Development Toolkit'}
            </h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
              {filteredTools.length} practical tools focused on debugging, API workflows, security, and data transformation.
            </p>
          </div>
          {filteredTools.length === 0 ? (
            <Card className="!p-8 text-center">
              <h3 className="mb-2 text-[1.125rem]">No matching tools found</h3>
              <p className="text-[var(--text-secondary)]">Try searching for `json`, `hash`, `curl`, `jwt`, or `regex`.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:gap-8">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="block">
                  <Card hoverable className="relative !flex h-full flex-col gap-6 !rounded-[var(--radius-xl)] !p-6 md:!p-10">
                    <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[16px]" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                      <tool.icon size={28} />
                    </div>
                    <div>
                      <h3 className="mb-3 text-[1.35rem] font-extrabold">{tool.title}</h3>
                      <p className="text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{tool.desc}</p>
                    </div>
                    {tool.isTrending && <div className="absolute right-6 top-6 rounded-full bg-[#fdf2f2] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.05em] text-[#991b1b]">Top Pick</div>}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[linear-gradient(180deg,#fffaf0_0%,#f8fafc_100%)] px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-amber-700">
                <BookOpen size={16} />
                DevTools Blog
              </div>
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-5xl">
                Guides that turn debugging questions into shortcuts
              </h2>
            </div>
            <Link
              href="/devtools/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-700"
            >
              Read all guides <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {devtoolsBlogPosts.slice(0, 4).map((post) => (
              <Link
                key={post.slug}
                href={`/devtools/blog/${post.slug}`}
                className="group flex h-full flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
                      {post.readTime}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      {post.updated}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-[-0.02em] text-slate-950 transition-colors group-hover:text-amber-700">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
                </div>

                <div className="mt-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.7rem] font-semibold text-slate-600"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-amber-700">
                    {post.toolLabel}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
