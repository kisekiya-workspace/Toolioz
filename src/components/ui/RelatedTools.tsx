'use client';

import React from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { ChevronRight } from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
  categoryId: string;
  limit?: number;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentToolId,
  categoryId,
  limit = 3,
}) => {
  const related = TOOLS
    .filter((tool) => tool.category === categoryId && tool.id !== currentToolId)
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="my-12 sm:my-16 border-t border-zinc-200 bg-zinc-50/50 py-12 sm:py-16 rounded-3xl dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 text-center text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Explore Related Tools
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                <div
                  className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                >
                  <tool.icon size={20} />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {tool.title}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Try tool</span>
                <ChevronRight className="ml-1" size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
