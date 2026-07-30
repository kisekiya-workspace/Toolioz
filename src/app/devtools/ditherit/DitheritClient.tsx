'use client';

import React from 'react';
import DitherStudio from '@/components/ditherit/DitherStudio';
import { Footer } from '@/components/layout/Footer';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { Card } from '@/components/ui/Card';
import { ExternalLink, Sparkles, Code2, Film } from 'lucide-react';

import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { SEOSection } from '@/components/ui/SEOSection';

export default function DitheritClient() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
          { name: 'ditherit Interactive Studio', url: '/devtools/ditherit' },
        ]}
      />

      {/* Main Full Ditherit Studio Pro Editor Workspace */}
      <div className="flex-1 mb-10">
        <DitherStudio />
      </div>

      {/* Educational & Attribution Cards Section (Below Editor) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 my-8 space-y-10 w-full">
        
        {/* GEO / AEO Direct Answer Block */}
        <DirectAnswerBlock
          title="How to convert images and videos into interactive ASCII & dithered dot art?"
          answer="ditherit Interactive ASCII & Dot Art Studio is a browser-based graphic engine that processes images, GIFs, and video clips into dithered dot matrices and ASCII art. It features real-time spring physics mouse repulsion (repel, attract, wave, vortex, breathe), WebM recording, background flood-fill removal, Sobel edge glyph rendering, and lightweight React code export (ditherit-react)."
          keyTakeaways={[
            "Real-Time Physics Interactive Dots — Dots dynamically react to cursor movement with custom force fields.",
            "Off-Thread Web Worker Dithering — Smooth Floyd-Steinberg, Atkinson, Bayer 8x8, and Sobel edge glyph rendering.",
            "Video & GIF Frame Extractor — Import animated GIF or video files and record dithered WebM clips.",
            "React & JS Code Export — Download self-contained React component code to embed interactive dot art on your website."
          ]}
          categoryName="ASCII & Dot Art Studio"
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          <Card className="bg-white border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Physics Dot Repulsion</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Experience dynamic spring physics where dithered dots react in real-time to your mouse movement with customizable repel radius, strength, and force fields.
            </p>
          </Card>

          <Card className="bg-white border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Video & Animated GIF Dithering</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Process frame-by-frame MP4, WebM, and animated GIF files in browser memory and export dithered video clips or interactive ASCII animations.
            </p>
          </Card>

          <Card className="bg-white border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Interactive Code Export</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Export generated dot coordinates and physics animation logic directly as lightweight React components (`ditherit-react`) or Vanilla JS snippets.
            </p>
          </Card>
        </section>

        <SEOSection
          title="Free Interactive ASCII & Dither Dot Art Generator"
          description="ditherit is a digital artwork studio created by Prasanjit Dey. Upload any photo, video, or GIF to instantly generate dithered dot matrices, ASCII text glowing characters, or interactive physics-driven canvas art."
          howToUse={[
            "Upload an image, animated GIF, or video file into the studio canvas.",
            "Choose a dithering algorithm (Floyd-Steinberg, Atkinson, Bayer 8x8, Hard Threshold, Sobel Edge Glyphs).",
            "Pick a preset aesthetic (Dot Art, Neon Glow ASCII, Minimal Charset, Pixel Block).",
            "Adjust physics repulsion mode (Repel, Attract, Wave, Vortex, Breathe) and cursor radius.",
            "Export PNG high-res image, WebM video clip, or click 'React Code' to copy component code."
          ]}
          benefits={[
            "100% Client-Side Privacy — Media processing happens entirely inside your browser via Web Workers.",
            "React Code Export — Embed responsive interactive dot art in Next.js/React websites.",
            "Animated GIF & Video Frame Decoding — Full support for animated media and WebM video export.",
            "Split Compare Slider — Side-by-side split screen handle to compare original vs dithered result."
          ]}
        />

        <FAQSchema
          faqs={[
            {
              question: "How do I embed interactive dither dot art in my React website?",
              answer: "Click the 'React Code' modal button inside the ditherit editor. It generates a self-contained, lightweight React component (`ditherit-react`) with full Canvas 2D spring physics that you can paste directly into any Next.js or React codebase."
            },
            {
              question: "Does ditherit support video and animated GIF files?",
              answer: "Yes! ditherit extracts individual video and GIF frames locally in browser memory, applies the chosen dithering matrix across frames, and allows you to record and download a WebM video clip."
            },
            {
              question: "Is my uploaded video or image sent to a server?",
              answer: "No. All Web Worker image processing, GIF frame parsing, and physics rendering run 100% locally on your computer."
            }
          ]}
        />

        {/* Owner Credit Card Section */}
        <div className="my-10">
          <Card className="bg-white border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                Open Source Attribution & Credit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                This tool is built upon the open-source <strong>ditherit</strong> project created by <strong>Prasanjit Dey (@prasanjit-dey-ux)</strong>. All algorithms, physics mouse repulsion logic, ASCII renderer, and preset design systems were authored by Prasanjit Dey.
              </p>
            </div>

            <a
              href="https://github.com/prasanjit-dey-ux/ditherit"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm shrink-0 transition"
            >
              Visit GitHub Repository <ExternalLink className="w-4 h-4" />
            </a>
          </Card>
        </div>

        <div className="my-12">
          <RelatedTools currentToolId="ditherit" categoryId="design" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
