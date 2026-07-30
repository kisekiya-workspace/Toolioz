'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowRight, Palette, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
        ]}
      />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_90%_80%,rgba(6,182,212,0.08)_0%,transparent_40%)] py-24 pb-16 text-center md:py-32 md:pb-24">
        <div className="absolute left-1/2 top-[-20%] h-full w-full -translate-x-1/2 bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_70%)]" />
        <div className="container">
          <div className="relative z-10 mx-auto max-w-[850px]">
            <div className="mb-8 inline-flex rounded-full border border-[rgba(6,182,212,0.3)] bg-[rgba(6,182,212,0.1)] px-4 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-[#0891b2]">
              Creative & Graphic Suite
            </div>
            <h1 className="mb-6 text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-[1.1] tracking-[-0.02em]">
              Design & <span className="text-[#06b6d4]">Creative</span> Studio
            </h1>
            <p className="mb-14 text-[1.125rem] leading-[1.6] text-[var(--text-secondary)] md:text-[1.35rem]">
              Interactive vector drawing, retro dithering, GLSL shaders, ASCII art generators, and high-resolution image toolkits. Free and 100% browser-based.
            </p>

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

            <div className="mx-auto mb-12 max-w-[650px]">
              <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 focus-within:-translate-y-[2px] focus-within:border-[#06b6d4] focus-within:shadow-[0_15px_45px_-10px_rgba(6,182,212,0.15)]">
                <Input
                  placeholder="Search design tools (e.g. Drawesome, ditherit, shader, X reveal PNG)"
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
                <span>100% Browser Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#06b6d4]" />
                <span>SVG & High-Res Export</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#10b981]" />
                <span>Real-Time Physics & Shaders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-24">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-[2.5rem] font-extrabold tracking-[-0.01em]">
              {search ? `Search Results for "${search}"` : 'Design & Creative Toolkit'}
            </h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
              {filteredTools.length} visual design, vector art, dithering, and graphic generation tools.
            </p>
          </div>
          {filteredTools.length === 0 ? (
            <Card className="!p-8 text-center">
              <h3 className="mb-2 text-[1.125rem]">No matching design tools found</h3>
              <p className="text-[var(--text-secondary)]">Try searching for `draw`, `dither`, `shader`, `color`, or `background`.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:gap-8">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="block">
                  <Card hoverable className="relative !flex h-full flex-col gap-6 !rounded-[var(--radius-xl)] !p-6 md:!p-10">
                    <div
                      className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[16px]"
                      style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                    >
                      <tool.icon size={28} />
                    </div>
                    <div>
                      <h3 className="mb-3 text-[1.35rem] font-extrabold">{tool.title}</h3>
                      <p className="text-[1rem] leading-[1.6] text-[var(--text-secondary)]">{tool.desc}</p>
                    </div>
                    {tool.isTrending && (
                      <div className="absolute right-6 top-6 rounded-full bg-[#ecfeff] px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.05em] text-[#0891b2]">
                        Featured Studio
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
