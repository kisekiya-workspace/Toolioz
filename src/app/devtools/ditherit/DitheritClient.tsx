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
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
          { name: 'ditherit Interactive Studio', url: '/devtools/ditherit' },
        ]}
      />

      {/* Main Full Ditherit Studio Pro Editor Workspace */}
      <header className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">ditherit — Interactive ASCII &amp; Dot Art</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">ditherit turns an image, GIF, or video into dithered dots or ASCII and can move those dots with a spring force. Export includes a still, a WebM, or generated code.</p>
      </header>
      <div className="flex-1 mb-10">
        <DitherStudio />
      </div>

      {/* Educational & Attribution Cards Section (Below Editor) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 my-8 space-y-10 w-full">
        
        {/* GEO / AEO Direct Answer Block */}
        <DirectAnswerBlock
          title="How to convert images and videos into interactive ASCII & dithered dot art?"
          answer="ditherit turns an image, GIF, or video into dots or ASCII. Video sampling stops at 90 frames on a canvas whose long side is 600 pixels. Pointer effects are repel, attract, wave, noise, vortex, and breathe. PNG export defaults to 600×600. Background removal is a corner flood fill with tolerance 32. The React snippet imports ditherit-react and does not include the image."
          keyTakeaways={[
            "Pointer effects are repel, attract, wave, noise, vortex, and breathe.",
            "Image dithering runs in a web worker. Algorithms are Floyd-Steinberg, Atkinson, Bayer 8×8, and a hard threshold.",
            "Video sampling stops at 90 frames. WebM recording uses the 600-pixel canvas.",
            "React code export copies a snippet that imports ditherit-react. The asset path is a placeholder.",
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
              Pointer movement can repel, attract, wave, add noise, vortex, or breathe the dots. Radius and strength are the two controls.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-3">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Video & GIF Dithering</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A GIF or video is sampled up to 90 frames on a canvas whose long side is 600 pixels. WebM recording uses that canvas.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Export React Component</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The React export is a snippet that imports ditherit-react. The image path is a placeholder, and the package is not included in the snippet.
            </p>
          </Card>
        </section>

        {/* SEO Structured Content */}
        <SEOSection
          title="ditherit Interactive ASCII & Dot Art Studio"
          description="ditherit turns an image, GIF, or video into dithered dots or ASCII and can move those dots with a spring force. Export includes a still, a WebM, or generated code."
          howToUse={[
            "An image, GIF, or video can be opened. Video sampling stops at 90 frames, and the working canvas uses a 600-pixel long side.",
            "The algorithm list is Floyd-Steinberg, Atkinson, ordered Bayer 8×8, or a hard threshold.",
            "Dot size, spacing, contrast, and brightness are controls.",
            "The pointer can repel, attract, wave, add noise, vortex, or breathe the dots.",
            "PNG export uses the width and height fields. The default is 600×600. SVG, WebM, and a React snippet are separate exports."
          ]}
          benefits={[
            "Media is decoded and drawn in the browser. Photos and videos are not uploaded.",
            "Image dithering runs in a web worker. The page does not measure a frame rate.",
            "Dot color and background color are hex values. Named palettes such as Game Boy are on the separate dither studio page.",
            "SVG export uses the same width and height as the PNG. It is not a fixed print size."
          ]}
        />

        {/* Structured FAQ Section */}
        <FAQSchema
          faqs={[
            {
              question: "Is ditherit free to use for commercial projects?",
              answer: "The page does not ask for payment or add a watermark. The site repository is private, so this page does not grant an MIT license."
            },
            {
              question: "Are my uploaded photos and videos sent to any server?",
              answer: "Decoding, dithering, physics, and canvas drawing run in the browser. The media is not uploaded."
            },
            {
              question: "What dithering algorithms are supported?",
              answer: "The algorithm list is Floyd-Steinberg, Atkinson, ordered Bayer 8×8, and a hard threshold. Sobel is used for optional glyph edges, not as its own algorithm. There is no halftone mode and no Bayer 4×4 mode."
            },
            {
              question: "How do I embed the interactive dot animation into my React website?",
              answer: "Export React Code copies a snippet that imports ditherit-react and sets the image path to /path/to/your/asset. The snippet does not include the pixels or the package."
            }
          ]}
        />

        <RelatedTools currentToolId="ditherit" categoryId="devtools" />
      </main>

      <Footer />
    </div>
  );
}
