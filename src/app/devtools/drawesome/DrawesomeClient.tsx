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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
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
          <Card className="bg-white border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <Pencil className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">7 Realistic Pens</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pencil, ballpoint, technical fineliner, felt marker, highlighter, paint brush, and 45° calligraphy fountain pen with pressure-sensitive stroke smoothing.
            </p>
          </Card>

          <Card className="bg-white border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <Eraser className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Area Subtraction Eraser</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Unlike traditional stroke erasers that delete whole lines, the area eraser subtracts precise SVG mask geometry exactly like erasing on real paper.
            </p>
          </Card>

          <Card className="bg-white border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">SVG, PNG & JSON Export</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Export high-resolution standalone SVG vector graphics, 2x raster PNGs, or raw stroke JSON payloads to save and restore your drawings anytime.
            </p>
          </Card>
        </section>

        <SEOSection
          title="Free Online Vector Drawing & Sketch Studio"
          description="Drawesome is a professional freehand vector studio operating entirely inside your browser. Draw with natural pressure dynamics, erase geometry with pixel-perfect masks, and export clean SVG code or transparent 2x PNGs for websites, UI designs, and digital art."
          howToUse={[
            "Select a tool from the left toolbar (Pencil, Pen, Fineliner, Marker, Highlighter, Brush, Fountain Pen, Eraser).",
            "Adjust nib size, opacity slider, and pick a custom color or swatch from the palette.",
            "Draw or sketch freehand on the canvas with touch, stylus, or mouse.",
            "Use the Area Eraser to carve out stroke geometry or erase specific parts without deleting entire paths.",
            "Click 'Export SVG' for resolution-independent vector graphics or 'Export PNG' for transparent images."
          ]}
          benefits={[
            "100% Free & No Sign-up Required.",
            "Scalable SVG Output — Infinite resolution for web development and graphic design.",
            "Area Mask Eraser — Subtraction masking rather than destructive path deletions.",
            "Stroke JSON Export — Save raw vector drawing state to disk and restore later."
          ]}
        />

        <FAQSchema
          faqs={[
            {
              question: "Can I export SVG vector files for commercial use?",
              answer: "Yes! All SVG vector graphics and PNG images created in Drawesome Vector Studio are 100% yours to download and use for personal or commercial projects without watermarks."
            },
            {
              question: "How does the Area Eraser differ from standard stroke erasers?",
              answer: "Standard canvas erasers either erase pixels (losing vector quality) or delete entire vector lines. Drawesome's area eraser creates non-destructive SVG clipping masks that cut out stroke sub-regions, preserving vector geometry."
            },
            {
              question: "Are my drawings saved on a cloud server?",
              answer: "No. Your drawings stay entirely private in your browser's local memory. You can click 'Save JSON' to download your raw vector drawing payload to your computer and reload it anytime."
            }
          ]}
        />

        {/* Owner Credit Card Section (MIT Compliance) */}
        <div className="my-10">
          <Card className="bg-white border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                Open Source Attribution & Credit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                This tool is built upon the open-source <strong>drawesome</strong> vector drawing engine created by <strong>Benji Taylor (@benjitaylor)</strong> under the MIT License. All stroke algorithms, freehand geometry math, and realistic pen physics were authored by Benji Taylor.
              </p>
            </div>

            <a
              href="https://github.com/benjitaylor/drawesome"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm shrink-0 transition"
            >
              Visit GitHub Repository <ExternalLink className="w-4 h-4" />
            </a>
          </Card>
        </div>

        <div className="my-12">
          <RelatedTools currentToolId="drawesome" categoryId="design" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
