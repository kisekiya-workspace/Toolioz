'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Mail, Sparkles, Terminal, FileText, Calculator } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50/50 py-12 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Mission Header */}
        <div className="mb-10 flex flex-col gap-4 border-b border-zinc-200/80 pb-8 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              <Image
                src="/tooliozLogo.svg"
                alt="Toolioz logo"
                width={30}
                height={30}
                className="rounded-lg"
              />
              <span>Toolioz</span>
            </Link>
            <span className="hidden sm:inline-block text-zinc-300 dark:text-zinc-700">•</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              Practical calculators and utilities with working tools, documented assumptions, and browser-local processing where stated.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tool inputs stay local where stated</span>
            </div>
          </div>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 mb-12">
          
          {/* Column 1: Financial Engines */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <Calculator size={13} className="text-blue-600 dark:text-blue-400" />
              Finance Suite
            </h4>
            <Link href="/finance" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Finance Hub
            </Link>
            <Link href="/finance/sip-calculator" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              SIP Calculator
            </Link>
            <Link href="/finance/income-tax" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Income Tax Calculator
            </Link>
            <Link href="/finance/compound-interest" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Compound Interest
            </Link>
            <Link href="/finance/car-loan" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Car Loan EMI
            </Link>
            <Link href="/finance/fd-calculator" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Fixed Deposit (FD)
            </Link>
            <Link href="/finance/retirement-corpus" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Retirement Corpus
            </Link>
            <Link href="/finance/gst-calculator" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              GST Calculator
            </Link>
          </div>

          {/* Column 2: Developer Suite */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <Terminal size={13} className="text-amber-600 dark:text-amber-400" />
              Dev Tools
            </h4>
            <Link href="/devtools" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Developer Hub
            </Link>
            <Link href="/devtools/json-formatter" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              JSON Formatter
            </Link>
            <Link href="/devtools/jwt-decoder" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              JWT Token Decoder
            </Link>
            <Link href="/devtools/regex-tester" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Regex Tester & Debugger
            </Link>
            <Link href="/devtools/base64-converter" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Base64 Encoder/Decoder
            </Link>
            <Link href="/devtools/timestamp-converter" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Timestamp Converter
            </Link>
            <Link href="/devtools/uuid-generator" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              UUID Generator
            </Link>
            <Link href="/devtools/x-hidden-image" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              X Tap-to-Reveal PNG
            </Link>
          </div>

          {/* Column 3: PDF & Document Tools */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <FileText size={13} className="text-red-600 dark:text-red-400" />
              PDF & Studio
            </h4>
            <Link href="/pdftools" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              PDF Utilities Hub
            </Link>
            <Link href="/pdftools/image-compressor" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Compress PDF & Images
            </Link>
            <Link href="/pdftools/merge-pdf" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Merge Multiple PDFs
            </Link>
            <Link href="/pdftools/split-pdf" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Split PDF Pages
            </Link>
            <Link href="/pdftools/image-to-pdf" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Images to PDF
            </Link>
            <Link href="/pdftools/pdf-to-image" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              PDF to Image Converter
            </Link>
            <Link href="/biodata" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Marriage Biodata Studio
            </Link>
            <Link href="/resume-builder" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              ATS Resume Builder <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Column 4: Guides & Comparisons */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
              Editorial Guides
            </h4>
            <Link href="/blog" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Research Masterclasses
            </Link>
            <Link href="/how-to" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Step-by-Step How-To
            </Link>
            <Link href="/top5" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Top 5 Benchmark Lists
            </Link>
            <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Full Tools Directory (60+)
            </Link>
            <Link href="/how-to/compress-pdf-under-2mb" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors truncate">
              Compress PDF Under 2MB
            </Link>
            <Link href="/how-to/calculate-sip-returns" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors truncate">
              Calculate SIP Returns
            </Link>
            <Link href="/top5/best-finance-calculators-india" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors truncate">
              Top Finance Calculators
            </Link>
          </div>

          {/* Column 5: Company & Support */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Company & Legal
            </h4>
            <Link href="/about" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              About Toolioz
            </Link>
            <Link href="/editorial-policy" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Editorial &amp; Review Policy
            </Link>
            <Link href="/privacy-policy" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Contact & Feedback
            </Link>
            <a
              href="mailto:support@toolioz.com"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors pt-2"
            >
              <Mail size={12} />
              <span>support@toolioz.com</span>
            </a>
          </div>
        </div>

        {/* Modern Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 text-xs text-zinc-400 dark:border-zinc-800 sm:flex-row">
          <p>© {currentYear} Toolioz. Built for speed, privacy, and precision.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Local Tool Processing</span>
            </span>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-zinc-700 dark:hover:text-zinc-200">Privacy details</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
