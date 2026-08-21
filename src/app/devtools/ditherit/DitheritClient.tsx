'use client';

import React from 'react';
import DitherStudio from '@/components/ditherit/DitherStudio';
import { Footer } from '@/components/layout/Footer';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { Card } from '@/components/ui/card';
import { ExternalLink, Sparkles, Code2, Film } from 'lucide-react';

import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { SEOSection } from '@/components/ui/SEOSection';

export default function DitheritClient() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
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
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Physics Dot Repulsion</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Experience dynamic spring physics where dithered dots react in real-time to your mouse movement with customizable repel radius, strength, and force fields.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-3">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Video & GIF Dithering</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Upload animated GIFs or WebM/MP4 video clips to render live dithered video playback. Record and download high-resolution WebM loops directly in your browser.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Export React Component</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Get clean, zero-dependency TSX code embedding your exact interactive particle animation with interactive canvas physics into your React or Next.js app.
            </p>
          </Card>
        </section>

        {/* SEO Structured Content */}
        <SEOSection
          title="ditherit Interactive ASCII & Dot Art Studio"
          description="A powerful browser-based particle canvas and dithering engine that turns your photos, graphics, and video clips into retro dithered art with interactive spring physics."
          howToUse={[
            "Upload an image (PNG, JPG, SVG), animated GIF, or video file into the studio.",
            "Select your dithering algorithm (Floyd-Steinberg, Atkinson, Bayer 8x8, or Sobel ASCII glyphs).",
            "Fine-tune Dot Size, Spacing, Contrast, and Brightness in real-time.",
            "Toggle Physics Simulation to make dots react to mouse movement with repel, attract, vortex, or wave forces.",
            "Export your artwork as a 4K PNG, SVG vector, WebM animation loop, or React component code."
          ]}
          benefits={[
            "100% Client-Side Processing — Your photos and videos never leave your browser or get uploaded to servers.",
            "Multi-Threaded Web Workers — Heavy image processing and matrix calculations run off the main thread for 60 FPS performance.",
            "Professional Color Palettes — 1-bit monochrome, Game Boy olive, Cyberpunk neon, Amber CRT, and custom hex dual-tones.",
            "High-Resolution Vector Export — Output crisp SVG vector paths suitable for print posters and merchandise."
          ]}
        />

        {/* Structured FAQ Section */}
        <FAQSchema
          faqs={[
            {
              question: "Is ditherit free to use for commercial projects?",
              answer: "Yes, ditherit Interactive Studio is 100% free and open-source under the MIT license. You can use generated graphics, videos, and exported React component code in personal and commercial projects without royalties or attribution required."
            },
            {
              question: "Are my uploaded photos and videos sent to any server?",
              answer: "No. All media decoding, Web Worker dithering algorithms, particle physics calculations, and canvas rendering happen strictly inside your browser's local sandbox memory. Zero data is sent to external servers."
            },
            {
              question: "What dithering algorithms are supported?",
              answer: "ditherit supports Floyd-Steinberg error diffusion, Atkinson dithering (classic Mac OS style), Bayer 4x4 and 8x8 ordered threshold matrices, Halftone clustered dot screens, and Sobel operator edge-detected ASCII character glyphs."
            },
            {
              question: "How do I embed the interactive dot animation into my React website?",
              answer: "Click the 'Export React Code' button in the toolbar to download a self-contained, lightweight TypeScript React component (DitherCanvas.tsx) that includes the canvas rendering and mouse physics engine ready to drop into Next.js, Vite, or Create React App."
            }
          ]}
        />

        <RelatedTools currentToolId="ditherit" categoryId="devtools" />
      </main>

      <Footer />
    </div>
  );
}
