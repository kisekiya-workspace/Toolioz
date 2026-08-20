'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Command, Grid3X3, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { TOOLS } from '@/data/sociials-tools';

const CATEGORY_COLORS: Record<string, { ink: string; wash: string; border: string }> = {
  Finance: { ink: '#075985', wash: '#e0f2fe', border: '#bae6fd' },
  Developer: { ink: '#5b21b6', wash: '#ede9fe', border: '#ddd6fe' },
  Design: { ink: '#9f1239', wash: '#ffe4e6', border: '#fecdd3' },
  PDF: { ink: '#b91c1c', wash: '#fee2e2', border: '#fecaca' },
  Media: { ink: '#9a3412', wash: '#ffedd5', border: '#fed7aa' },
  Utility: { ink: '#115e59', wash: '#ccfbf1', border: '#99f6e4' },
  Math: { ink: '#1d4ed8', wash: '#dbeafe', border: '#bfdbfe' },
  Health: { ink: '#047857', wash: '#d1fae5', border: '#a7f3d0' },
  Security: { ink: '#334155', wash: '#e2e8f0', border: '#cbd5e1' },
  Writing: { ink: '#7e22ce', wash: '#f3e8ff', border: '#e9d5ff' },
  Social: { ink: '#be185d', wash: '#fce7f3', border: '#fbcfe8' },
  Time: { ink: '#a16207', wash: '#fef3c7', border: '#fde68a' },
};

const fallbackColor = { ink: '#334155', wash: '#f1f5f9', border: '#e2e8f0' };

export default function ToolsLibraryClient() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const searchRef = useRef<HTMLInputElement>(null);
  const categories = useMemo(() => ['All', ...Array.from(new Set(TOOLS.map(tool => tool.category)))], []);
  const categoryCounts = useMemo(() => Object.fromEntries(categories.map(name => [name, name === 'All' ? TOOLS.length : TOOLS.filter(tool => tool.category === name).length])), [categories]);
  const popular = useMemo(() => TOOLS.filter(tool => tool.popular).slice(0, 8), []);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return TOOLS.filter(tool => (category === 'All' || tool.category === category) && (!term || `${tool.title} ${tool.description} ${tool.category}`.toLowerCase().includes(term)));
  }, [category, query]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) { setQuery(''); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f8f7] text-slate-800">
      <header className="relative overflow-hidden border-b border-teal-200 bg-[linear-gradient(135deg,#e6f7f4_0%,#edf7ff_58%,#fff9e8_100%)] px-4 pb-14 pt-12 text-slate-800 sm:px-6 sm:pb-20 sm:pt-16">
        <div aria-hidden className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(13,148,136,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,.08)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,#fff,transparent)]" />
        <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4"><div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-[.16em] text-teal-700"><Command size={14} /> Tool directory</div><div className="hidden items-center gap-2 text-xs font-semibold text-slate-600 sm:flex"><ShieldCheck size={15} className="text-emerald-600" /> Browser-first utilities</div></div>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_430px]"><div><p className="mb-4 text-sm font-bold text-teal-700">{TOOLS.length} tools · {categories.length - 1} categories</p><h1 className="max-w-4xl text-[clamp(2.8rem,8vw,6.4rem)] font-black leading-[.88] tracking-[-.065em] text-slate-800">Find the right tool.<br /><span className="text-teal-700">Skip the hunt.</span></h1><p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Search calculators, converters, generators, PDF utilities, design helpers, and developer tools from one focused workspace.</p></div><div className="rounded-2xl border border-teal-200 bg-white/80 p-3 shadow-lg"><label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-800"><Search size={21} className="shrink-0 text-slate-400" /><span className="sr-only">Search all tools</span><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Search JSON, percentage, PDF…" className="min-w-0 flex-1 bg-transparent py-4 text-base font-semibold outline-none placeholder:font-normal placeholder:text-slate-400" />{query ? <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="rounded-full p-1 text-slate-500 hover:bg-teal-50 hover:text-teal-700"><X size={17} /></button> : <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-400 sm:inline">/</kbd>}</label><p className="px-2 pt-3 text-xs leading-5 text-slate-500">Search checks names, descriptions, and categories instantly.</p></div></div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {!query && category === 'All' && <section aria-labelledby="popular-tools" className="mb-12"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Quick start</p><h2 id="popular-tools" className="mt-1 text-2xl font-black tracking-tight">Popular tools</h2></div><Sparkles className="text-amber-500" size={22} /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{popular.map(tool => <ToolCard key={tool.href} tool={tool} compact />)}</div></section>}

        <div className="sticky top-0 z-20 -mx-4 mb-8 border-y border-teal-200 bg-[#f4f8f7]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{categories.map(name => <button key={name} type="button" onClick={() => setCategory(name)} className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-black ${category === name ? 'border-teal-700 bg-teal-700 text-white shadow-sm hover:bg-teal-800' : 'border-slate-300 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800'}`}><span>{name}</span><span className={`rounded-full px-1.5 py-0.5 text-[10px] ${category === name ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryCounts[name]}</span></button>)}</div></div>

        <section aria-live="polite"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-slate-500"><Grid3X3 size={14} /> {category === 'All' ? 'Complete library' : `${category} collection`}</div><h2 className="mt-1 text-3xl font-black tracking-[-.035em]">{query ? `Results for “${query}”` : category === 'All' ? 'All tools' : `${category} tools`}</h2></div><p className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-500">{results.length} result{results.length === 1 ? '' : 's'}</p></div>
          {results.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{results.map(tool => <ToolCard key={tool.href} tool={tool} />)}</div> : <div className="rounded-[2rem] border border-dashed border-slate-400 bg-white/60 px-6 py-16 text-center"><Search className="mx-auto text-slate-300" size={42} /><h3 className="mt-5 text-xl font-black">No matching tool found</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Try a broader term such as “PDF”, “calculator”, “image”, or choose All categories.</p><button type="button" onClick={() => { setQuery(''); setCategory('All'); searchRef.current?.focus(); }} className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800">Reset filters</button></div>}
        </section>
      </main>
    </div>
  );
}

function ToolCard({ tool, compact = false }: { tool: (typeof TOOLS)[number]; compact?: boolean }) {
  const color = CATEGORY_COLORS[tool.category] ?? fallbackColor;
  return <Link href={tool.href} className="block h-full"><article className={`relative flex h-full overflow-hidden border bg-white hover:bg-teal-50/50 ${compact ? 'items-center gap-3 rounded-xl p-4' : 'min-h-48 flex-col rounded-2xl p-5'}`} style={{ borderColor: color.border }}><span className={`grid shrink-0 place-items-center rounded-xl ${compact ? 'h-10 w-10' : 'h-11 w-11'}`} style={{ color: color.ink, backgroundColor: color.wash }}><tool.icon size={compact ? 19 : 21} /></span><div className={compact ? 'min-w-0 flex-1' : 'mt-6 flex flex-1 flex-col'}><div className="flex items-start justify-between gap-3"><h3 className={`${compact ? 'truncate text-sm' : 'text-lg leading-6'} font-black tracking-tight text-slate-800`}>{tool.title}</h3><ArrowUpRight className="shrink-0 text-slate-400" size={17} /></div>{!compact && <><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{tool.description}</p><div className="mt-auto pt-5"><span className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em]" style={{ color: color.ink, backgroundColor: color.wash }}>{tool.category}</span></div></>}</div></article></Link>;
}
