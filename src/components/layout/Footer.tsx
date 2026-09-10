'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Mail, Sparkles, Terminal, FileText, Calculator } from 'lucide-react';
import { ToolPublisherArticle } from '@/components/content/ToolPublisherArticle';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <ToolPublisherArticle />
      <footer className="mt-auto bg-[#fafafa] py-10 text-[#171717] dark:bg-[#0a0a0a] dark:text-[#ededed] sm:py-16" style={{ boxShadow: 'var(--header-border-bottom)' }}>
      <div className="mx-auto max-w-[1200px] px-6">
        
        <div className="mb-10 flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-[#171717] dark:text-[#ededed]"
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
              Calculators and file tools with documented formulas. Inputs stay in the browser when a page says so.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3 py-1 text-[11px] font-normal text-[#4d4d4d] dark:bg-[#171717] dark:text-[#a1a1a1]">
              <span className="size-2.5 rounded-full bg-[#45A557]" />
              <span>Tool inputs stay local where stated</span>
            </div>
          </div>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 mb-12">
          
          {/* Column 1: Financial Engines */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#171717] dark:text-[#ededed]">
              <Calculator size={13} className="text-blue-600 dark:text-blue-400" />
              Finance Suite
            </h4>
            <Link href="/finance" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Finance Hub
            </Link>
            <Link href="/finance/sip-calculator" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              SIP Calculator
            </Link>
            <Link href="/finance/income-tax" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Income Tax Calculator
            </Link>
            <Link href="/finance/compound-interest" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Compound Interest
            </Link>
            <Link href="/finance/mortgage-calculator" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Home / vehicle EMI
            </Link>
            <Link href="/finance/loan-prepayment" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Loan prepayment
            </Link>
            <Link href="/finance/inflation-calculator" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Inflation
            </Link>
            <Link href="/finance/gst-calculator" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              GST Calculator
            </Link>
          </div>

          {/* Column 2: Developer Suite */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#171717] dark:text-[#ededed]">
              <Terminal size={13} className="text-amber-600 dark:text-amber-400" />
              Dev Tools
            </h4>
            <Link href="/devtools" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Developer Hub
            </Link>
            <Link href="/devtools/json-formatter" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              JSON Formatter
            </Link>
            <Link href="/devtools/jwt-decoder" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              JWT Token Decoder
            </Link>
            <Link href="/devtools/regex-tester" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Regex Tester & Debugger
            </Link>
            <Link href="/devtools/x-hidden-image" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              X Tap-to-Reveal PNG
            </Link>
          </div>

          {/* Column 3: PDF & Document Tools */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#171717] dark:text-[#ededed]">
              <FileText size={13} className="text-red-600 dark:text-red-400" />
              PDF & Studio
            </h4>
            <Link href="/pdftools" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              PDF Utilities Hub
            </Link>
            <Link href="/pdftools/merge-pdf" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Merge Multiple PDFs
            </Link>
            <Link href="/pdftools/image-to-pdf" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Images to PDF
            </Link>
            <Link href="/biodata" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Marriage Biodata Studio
            </Link>
            <Link href="/resume-builder" className="inline-flex items-center gap-1 text-xs font-medium text-[#0072F5]">
              ATS Resume Builder <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Column 4: Guides & Comparisons */}
          <div className="flex flex-col gap-2.5">
            <h4 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#171717] dark:text-[#ededed]">
              <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
              Editorial Guides
            </h4>
            <Link href="/blog" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Guides
            </Link>
            <Link href="/how-to" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Step-by-Step How-To
            </Link>
            <Link href="/editorial-policy" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Editorial policy
            </Link>
            <Link href="/how-to/calculate-sip-returns" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors truncate">
              Calculate SIP Returns
            </Link>
            <Link href="/how-to/format-json-and-fix-errors" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors truncate">
              Format JSON
            </Link>
            <Link href="/how-to/reduce-home-loan-interest" className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors truncate">
              Reduce home-loan interest
            </Link>
          </div>

          {/* Column 5: Company & Support */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-[#171717] dark:text-[#ededed]">
              Company & Legal
            </h4>
            <Link href="/about" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              About Toolioz
            </Link>
            <Link href="/editorial-policy" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Editorial &amp; Review Policy
            </Link>
            <Link href="/privacy-policy" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-xs text-[#8f8f8f] hover:text-[#171717] dark:text-[#8f8f8f] dark:hover:text-[#ededed]">
              Contact & Feedback
            </Link>
            <a
              href="mailto:support@toolioz.com"
              className="inline-flex items-center gap-1.5 pt-2 text-xs text-[#8f8f8f] hover:text-[#171717] dark:hover:text-[#ededed]"
            >
              <Mail size={12} />
              <span>support@toolioz.com</span>
            </a>
          </div>
        </div>

        {/* Modern Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-[#8f8f8f] sm:flex-row">
          <p>© {currentYear} Toolioz. Documented calculators and browser utilities.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#45A557]" />
              <span>Local processing where labelled</span>
            </span>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-zinc-700 dark:hover:text-zinc-200">Privacy details</Link>
          </div>
        </div>

      </div>
    </footer>
    </>
  );
}
