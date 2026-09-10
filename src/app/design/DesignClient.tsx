'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap, X } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';

export default function DesignClient() {
  const [search, setSearch] = useState('');

  const designTools = useMemo(
    () =>
      TOOLS
        .filter((t) => t.category === 'design')
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
      designTools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(normalizedSearch) ||
          tool.desc.toLowerCase().includes(normalizedSearch),
      ),
    [designTools, normalizedSearch],
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] dark:bg-[#0a0a0a] dark:text-[#ededed]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
        ]}
      />

      {/* Skimmed Compact Hero Section */}
      <section className="bg-[#fafafa] pt-8 pb-6 text-center dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-3 inline-flex items-center gap-2">
            <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
              Creative & Graphic Studio
            </Badge>
          </div>
          
          <h1 className="text-[32px] font-semibold leading-none tracking-[-1.28px] text-[#171717] sm:text-5xl sm:tracking-[-2.28px] dark:text-[#ededed]">
            Design & <span className="text-cyan-500">Creative</span> Studio
          </h1>
          
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
            Interactive vector drawing, retro dithering, GLSL shaders, ASCII art generators, and high-resolution image toolkits.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-5 max-w-xl">
            <div className="relative flex items-center rounded-[12px] bg-white p-2 ds-surface dark:bg-[#111]">
              <Search size={18} className="ml-3 shrink-0 text-zinc-400" />
              <input
                type="search"
                placeholder="Search creative tools (e.g. Split Image, Drawesome, Dither, Shader)..."
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

      {/* Design Tools Directory (Directly Visible) */}
      <section className="pt-2 pb-16 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 sm:text-2xl dark:text-zinc-50">
                {search ? `Search Results (${filteredTools.length})` : 'All Creative Studios'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5 dark:text-zinc-400">
                Pixel-precision canvas applications, visual generators, and image shaders.
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
                    <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-cyan-600 mb-1 dark:text-zinc-50 dark:group-hover:text-cyan-400">
                      {tool.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    <span>Open Studio</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <DirectAnswerBlock
              title="What is the Toolioz Design & Creative Studio?"
              answer="Toolioz Design & Creative Studio is a suite of client-side web tools for digital artists, designers, and developers. It includes Drawesome vector drawing, ditherit ASCII and dot art, a GLSL shader editor, wallpaper generator, tap-to-reveal PNG creator, 16:9 split-into-3 image tool, and color converters."
              keyTakeaways={[
                "Local image processing where the tool page says so — files are not uploaded to Toolioz for those tools.",
                "Export SVG, PNG, or WebM depending on the tool.",
                "Algorithms and limitations are described on each tool page.",
                "The shader editor runs GLSL in the browser; results depend on the device GPU.",
              ]}
              categoryName="Design Studio"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
