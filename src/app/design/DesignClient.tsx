'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap, X } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
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
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
        ]}
      />

      {/* Skimmed Compact Hero Section */}
      <section className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2">
            <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
              Creative & Graphic Studio
            </Badge>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
            Design & <span className="text-cyan-500">Creative</span> Studio
          </h1>
          
          <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
            Interactive vector drawing, retro dithering, GLSL shaders, ASCII art generators, and high-resolution image toolkits.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-5 max-w-xl">
            <div className="relative flex items-center rounded-xl border border-zinc-300 bg-white p-2 shadow-xs transition-all focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-900">
              <Search size={18} className="ml-3 shrink-0 text-zinc-400" />
              <input
                type="search"
                placeholder="Search creative tools (e.g. Drawesome, Dither, Shader, Color)..."
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
              answer="Toolioz Design & Creative Studio is a suite of client-side web tools for digital artists, designers, and developers. It includes Drawesome vector drawing with 7 pressure-sensitive pens, ditherit interactive ASCII and dot art, GLSL shader editor, wallpaper generator, tap-to-reveal PNG creator, and color converter tools."
              keyTakeaways={[
                "100% Client-Side Privacy — Images, videos & SVG drawings never leave your device.",
                "Vector & Raster Export — Download scalable SVG files, 4K PNGs, and WebM video recordings.",
                "Free & Open Source Compliant — Built with MIT-licensed vector and dithering algorithms.",
                "Real-time Shader Engine — Experiment with GLSL fragment shaders and interactive physics."
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
