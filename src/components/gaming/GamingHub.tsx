'use client';

import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';
import type { Tool } from '@/lib/tools';

export interface HubGroup {
  title: string;
  description: string;
  href?: string;
  tools: Tool[];
}

export function GamingHub({
  eyebrow,
  title,
  highlight,
  subtitle,
  groups,
  extraLinks,
  searchPlaceholder = 'Search circle, nether, sensitivity, type chart…',
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  groups: HubGroup[];
  extraLinks?: Array<{ title: string; href: string; description: string }>;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          tools: group.tools.filter(
            (tool) =>
              !term ||
              `${tool.title} ${tool.desc}`.toLowerCase().includes(term),
          ),
        }))
        .filter((group) => group.tools.length > 0 || (!term && extraLinks?.length)),
    [groups, term, extraLinks],
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] dark:bg-[#0a0a0a] dark:text-[#ededed]">
      <section className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Badge variant="outline" size="sm" className="mb-3 font-mono text-xs">
            {eyebrow}
          </Badge>
          <h1 className="text-[32px] font-semibold tracking-[-1.28px] sm:text-5xl dark:text-[#ededed]">
            {title} <span className="text-emerald-600 dark:text-emerald-400">{highlight}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </p>
          <div className="relative mx-auto mt-5 max-w-xl">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-9 pr-9 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            {query && (
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {filtered.map((group) => (
          <div key={group.title} className="mb-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{group.title}</h2>
                <p className="mt-1 text-xs text-zinc-500">{group.description}</p>
              </div>
              {group.href && (
                <Link href={group.href} className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Open hub
                </Link>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="group block">
                  <Card hoverable className="flex h-full flex-col justify-between p-5">
                    <div>
                      <div
                        className="mb-3 flex size-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${tool.color}18`, color: tool.color }}
                      >
                        <tool.icon size={22} />
                      </div>
                      <h3 className="text-sm font-bold group-hover:text-blue-600">{tool.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">{tool.desc}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center text-xs font-semibold text-blue-600">
                      Open <ArrowRight size={14} className="ml-1" />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {extraLinks && extraLinks.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold">Sensitivity pair pages</h2>
            <p className="mb-4 text-xs text-zinc-500">
              One page per game pair for searches such as CS2 to Valorant sens. The main converter still accepts any two games.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extraLinks
                .filter((link) => !term || `${link.title} ${link.description}`.toLowerCase().includes(term))
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <span className="font-medium">{link.title}</span>
                    <span className="mt-1 block text-xs text-zinc-500">{link.description}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
