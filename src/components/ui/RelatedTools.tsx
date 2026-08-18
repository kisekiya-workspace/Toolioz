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
    <section className="my-12 sm:my-16 border-t border-slate-200 bg-slate-50/50 py-12 sm:py-16 rounded-3xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          Explore Related Tools
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {related.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-500 hover:shadow-md"
            >
              <div>
                <div
                  className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                >
                  <tool.icon size={24} />
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 group-hover:text-indigo-600">
                  {tool.title}
                </h3>
                <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 transition-opacity duration-200 group-hover:opacity-100">
                <span>Try it out</span>
                <ChevronRight
                  className="ml-1.5"
                  size={16}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
