"use client";

import React from "react";
import DrawesomeStudio from "@/components/drawesome/DrawesomeStudio";
import { Footer } from "@/components/layout/Footer";
import { RelatedTools } from "@/components/ui/RelatedTools";
import { Card } from "@/components/ui/card";
import { ExternalLink, Sparkles, Pencil, Eraser, FileCode } from "lucide-react";

import { DirectAnswerBlock } from "@/components/ui/DirectAnswerBlock";
import { BreadcrumbJsonLd } from "@/components/ui/BreadcrumbJsonLd";
import { FAQSchema } from "@/components/ui/FAQSchema";
import { SEOSection } from "@/components/ui/SEOSection";

export default function DrawesomeClient() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
          { name: 'Drawesome Vector Studio', url: '/devtools/drawesome' },
        ]}
      />

      {/* Full Drawesome Vector Drawing Editor Workspace */}
      <div className="flex-1 mb-10">
        <DrawesomeStudio />
      </div>

      {/* Educational & Attribution Cards Section (Below Editor) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 my-8 space-y-10 w-full">
        
        {/* GEO / AEO Direct Answer Block */}
        <DirectAnswerBlock
          title="How to create vector drawings and export transparent SVGs free online?"
          answer="Drawesome Vector Studio is a free, browser-based vector drawing tool powered by pressure-sensitive stroke smoothing algorithms. You can sketch with 7 realistic pens (pencil, ballpoint, technical fineliner, felt marker, highlighter, paint brush, and 45° fountain pen), erase precise stroke sub-regions using area subtraction, and export crisp, resolution-independent SVG vector graphics or 2x PNGs without sign-up or watermarks."
          keyTakeaways={[
            "Resolution-Independent Vector SVG — Export scalable SVG code for web apps, icons, and illustrations.",
            "Area Subtraction Eraser — Subtract stroke geometry with real masking instead of deleting entire paths.",
            "7 Realistic Nib Presets — Pressure and velocity smoothing with fountain pen nib angle physics.",
            "100% Client-Side Privacy — Drawings stay local in your browser session with JSON save/load capability."
          ]}
          categoryName="Design & Vector Studio"
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          <Card className="p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <Pencil className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">7 Realistic Pens</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pencil, ballpoint, technical fineliner, felt marker, highlighter, paint brush, and 45° calligraphy fountain pen with pressure-sensitive stroke smoothing.
            </p>
          </Card>

          <Card className="p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <Eraser className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Area Subtraction Eraser</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A precise vector eraser that cuts through paths with polygon clipping algorithms rather than blindly deleting whole strokes.
            </p>
          </Card>

          <Card className="p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Crisp SVG & JSON Export</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Download clean vector SVG markup formatted for web illustrations, export high-res transparent PNGs, or save project JSON to edit later.
            </p>
          </Card>
        </section>

        {/* SEO Structured Content */}
        <SEOSection
          title="Drawesome Free Online Vector Drawing Studio"
          description="A professional, open-source web whiteboard and vector canvas for creating sketches, diagrams, wireframes, and handwritten calligraphy with zero lag."
          howToUse={[
            "Select your preferred pen tool (Pencil, Fineliner, Marker, Calligraphy Pen, or Brush).",
            "Adjust line thickness, opacity, smoothing tension, and color from the palette.",
            "Draw naturally with mouse, trackpad, or stylus — pressure and speed are calculated in real-time.",
            "Use the subtraction eraser to carve out fine details or slice paths.",
            "Click Export to download your artwork as an SVG vector, 2x PNG, or project backup file."
          ]}
          benefits={[
            "100% Free & No Sign-up — Immediate access to full drawing capabilities with no registration or watermarks.",
            "True Vector Output — Scalable SVG curves that look pin-sharp on 4K retina displays and large format prints.",
            "Stylus & Pressure Simulation — Realistic stroke taper and velocity thinning curves mimicking natural ink flow.",
            "Completely Private — All vector geometry and raster buffers are processed strictly in browser memory."
          ]}
        />

        {/* Structured FAQ Section */}
        <FAQSchema
          faqs={[
            {
              question: "Is Drawesome completely free with no watermarks?",
              answer: "Yes, Drawesome is 100% free with no account creation, limits, or watermark stamps. All exported SVG and PNG files belong to you."
            },
            {
              question: "Can I use Drawesome graphics in commercial web projects?",
              answer: "Yes, SVG vectors exported from Drawesome can be used freely in personal and commercial web designs, apps, logos, and print products without attribution."
            },
            {
              question: "How does the Area Subtraction Eraser work?",
              answer: "Unlike standard whiteboards that delete entire connected strokes when touched by an eraser, Drawesome uses geometric path boolean subtraction to carve holes and split lines exactly where the eraser passes."
            },
            {
              question: "Can I save my drawing to finish editing later?",
              answer: "Yes. Click 'Export JSON' to download your project file. Later, click 'Open Project' to restore your exact stroke vectors, layers, and pen configurations."
            }
          ]}
        />

        <RelatedTools currentToolId="drawesome" categoryId="devtools" />
      </main>

      <Footer />
    </div>
  );
}
