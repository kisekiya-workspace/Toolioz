'use client';

import React, { useRef, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  ShieldCheck,
  Zap,
  Download,
  FileUp,
  Loader2,
  Scissors,
  CheckCircle2,
} from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { PDFDocument } from 'pdf-lib';

const FAQS = [
  {
    question: 'How do I specify pages to extract?',
    answer:
      'Enter page numbers or ranges separated by commas. For example, "1-3, 5, 8-10" will extract pages 1, 2, 3, 5, 8, 9, and 10 into a new PDF.',
  },
  {
    question: 'Is my PDF uploaded to external servers?',
    answer:
      'No. The page extraction and PDF splitting happen 100% locally in your web browser memory using pdf-lib. No bytes leave your device.',
  },
  {
    question: 'Can I split password-protected PDFs?',
    answer:
      'Please unlock password-protected PDFs before processing them in the browser.',
  },
];

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [splitPdfBlobUrl, setSplitPdfBlobUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Please select a valid PDF file.');
        return;
      }

      setFile(selectedFile);
      setErrorMessage(null);
      setSplitPdfBlobUrl(null);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setPageRange(`1-${count}`);
      } catch (err) {
        setErrorMessage('Could not load PDF file. Please ensure it is not password-protected.');
      }
    }
  };

  const parsePageRange = (rangeStr: string, max: number): number[] => {
    const indices = new Set<number>();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(max, end); p++) {
            indices.add(p - 1);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          indices.add(p - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !totalPages) return;

    const pageIndices = parsePageRange(pageRange, totalPages);
    if (pageIndices.length === 0) {
      setErrorMessage('Please enter a valid page range within 1 to ' + totalPages);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSplitPdfBlobUrl(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSplitPdfBlobUrl(url);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to split PDF file.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-cyan-50/40 py-5 text-slate-900 sm:py-7">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-5 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-800">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side In-Browser Extraction
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Split PDF & Extract Pages
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Extract specific pages or page ranges into a separate PDF file. Zero server uploads.
          </p>
        </header>

        <Card className="rounded-3xl border-cyan-200 bg-white p-6 sm:p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50/60 p-10 text-center hover:border-cyan-500 hover:bg-cyan-50"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-100 text-cyan-700">
                <FileUp className="w-7 h-7" />
              </div>
              <p className="mb-1 text-lg font-bold text-slate-900">Click to select PDF document</p>
              <p className="text-xs text-slate-400">Select any PDF file up to 200MB</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(file.size)} • {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setFile(null);
                    setTotalPages(null);
                    setSplitPdfBlobUrl(null);
                  }}
                  variant="outline"
                  className="border-cyan-200 text-xs text-slate-500 hover:bg-cyan-100 hover:text-cyan-800"
                >
                  Change File
                </Button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Pages to Extract (Total: {totalPages} Pages)
                </label>
                <Input
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="border-cyan-200 bg-white font-mono text-slate-900"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Format: Individual pages separated by commas or ranges with hyphens (e.g. 1-4, 7, 10-12).
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-sm font-semibold">
                  {errorMessage}
                </div>
              )}

              <Button
                onClick={handleSplit}
                disabled={isProcessing}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl shadow-cyan-500/20 flex items-center justify-center gap-2 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Extracting Pages...
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    Extract Selected Pages
                  </>
                )}
              </Button>
            </div>
          )}

          {splitPdfBlobUrl && (
            <div className="mt-8 p-6 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-center">
              <h3 className="mb-2 text-lg font-bold text-slate-900">Split PDF Ready!</h3>
              <p className="mb-4 text-sm text-slate-600">
                Selected pages were extracted into a new PDF document in browser memory.
              </p>
              <a
                href={splitPdfBlobUrl}
                download={`extracted_pages_${Date.now()}.pdf`}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-700"
              >
                <Download className="w-4 h-4" /> Download Extracted PDF
              </a>
            </div>
          )}
        </Card>

        <SEOSection
          title="PDF Page Extraction & Splitting"
          description="Splitting confidential documents like legal contracts, tax records, or bank statements should never require uploading files to external server pipelines. Toolioz extracts pages in your browser using JavaScript and pdf-lib. No external server transfers occur, keeping your data secure."
          howToUse={[
            "Upload your target PDF document.",
            "Enter the page numbers or page ranges you wish to extract (e.g. 1-3, 5).",
            "Click 'Extract Selected Pages' to process the document in memory.",
            "Click 'Download Extracted PDF' to save your output file."
          ]}
          benefits={[
            "100% private client-side extraction with zero cloud uploads.",
            "Extract individual pages or custom page ranges effortlessly.",
            "Preserves vector fonts, layout structure, and document quality.",
            "Fast processing for PDF documents up to 200MB."
          ]}
        />

        <FAQSchema faqs={FAQS} />
        <RelatedTools currentToolId="split-pdf" categoryId="pdftools" />
      </div>

      <Footer />
    </main>
  );
}
