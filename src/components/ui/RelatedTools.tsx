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
    <section className="mt-16 border-t border-[var(--border)] bg-[#fafafa] py-16 sm:mt-20 sm:py-20">
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="mb-10 text-center text-[1.8rem] font-black tracking-tight text-[var(--text-primary)]">
          Explore Related Tools
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div
                  className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                >
                  <tool.icon size={24} />
                </div>
                <h3 className="mb-2 text-[1.1rem] font-bold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
                  {tool.title}
                </h3>
                <p className="line-clamp-3 text-[0.875rem] leading-[1.6] text-[var(--text-secondary)]">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center text-[0.875rem] font-bold text-[var(--primary)] opacity-80 transition-opacity duration-200 group-hover:opacity-100">
                <span>Try it out</span>
                <ChevronRight
                  className="ml-1.5 translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
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
