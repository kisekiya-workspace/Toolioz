"use client";

import React from "react";
import DrawesomeStudio from "@/components/drawesome/DrawesomeStudio";
import { Footer } from "@/components/layout/Footer";
import { RelatedTools } from "@/components/ui/RelatedTools";
import { Card } from "@/components/ui/Card";
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
          answer="Drawesome is a browser vector canvas with seven pens: pencil, ballpoint, fineliner, marker, highlighter, brush, and fountain pen. An area eraser subtracts part of a stroke. Export is SVG or a 2x PNG, with no account and no watermark."
          keyTakeaways={[
            "Resolution-Independent Vector SVG — Export scalable SVG code for web apps, icons, and illustrations.",
            "Area Subtraction Eraser — Subtract stroke geometry with real masking instead of deleting entire paths.",
            "7 Realistic Nib Presets — Pressure and velocity smoothing with fountain pen nib angle physics.",
            "Drawings stay in the browser session. JSON save and load restores the strokes."
          ]}
          categoryName="Design & Vector Studio"
        />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <Pencil className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">7 Realistic Pens</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pencil, ballpoint, technical fineliner, felt marker, highlighter, paint brush, and 45° calligraphy fountain pen with pressure-sensitive stroke smoothing.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <Eraser className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Area Subtraction Eraser</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A precise vector eraser that cuts through paths with polygon clipping algorithms rather than blindly deleting whole strokes.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">Crisp SVG & JSON Export</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Download an SVG, a PNG at twice the board size, or a project JSON file.
            </p>
          </Card>
        </section>

        {/* SEO Structured Content */}
        <SEOSection
          title="Drawesome Free Online Vector Drawing Studio"
          description="Drawesome is a freehand vector canvas with pencil, pen, marker, brush, and fountain-pen tools, plus SVG and PNG export."
          howToUse={[
            "Select a pen: pencil, fineliner, marker, calligraphy pen, or brush.",
            "Line thickness, opacity, smoothing, and color come from the controls.",
            "A pointer event records position. Pressure uses the device value, or 0.5 when the device reports none.",
            "The eraser stores a stroke and hides drawing under it with an SVG mask.",
            "Export downloads an SVG, a PNG at twice the board size, or a project JSON file."
          ]}
          benefits={[
            "The page does not ask for an account, and the SVG or PNG has no watermark.",
            "PNG export uses scale 2. The default board is 1600×1000, so that PNG is 3200×2000.",
            "Pointer events pass pressure to the stroke. A mouse that reports no pressure uses 0.5.",
            "Strokes are drawn in the page. The page still loads site assets."
          ]}
        />

        {/* Structured FAQ Section */}
        <FAQSchema
          faqs={[
            {
              question: "Is Drawesome completely free with no watermarks?",
              answer: "Drawesome does not require an account, and the SVG or PNG export has no watermark. The exported file is the visitor's to use."
            },
            {
              question: "Can I use Drawesome graphics in commercial web projects?",
              answer: "The page does not add a watermark or ask for an account. It does not grant a separate license for the drawing."
            },
            {
              question: "How does the Area Subtraction Eraser work?",
              answer: "The eraser stores a stroke and paints it black inside an SVG mask, which hides the drawing underneath. It does not split a path into new curves."
            },
            {
              question: "Can I save my drawing to finish editing later?",
              answer: "Export JSON downloads the strokes, layers, and pen settings. Open Project reads that file back onto the canvas."
            }
          ]}
        />

        <RelatedTools currentToolId="drawesome" categoryId="devtools" />
      </main>

      <Footer />
    </div>
  );
}
