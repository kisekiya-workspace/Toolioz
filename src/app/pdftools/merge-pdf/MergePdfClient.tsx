'use client';

import React, { useRef, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Plus,
  X,
  ShieldCheck,
  Zap,
  Download,
  FileUp,
  ArrowDownWideNarrow,
  Loader2,
} from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { mergePdfFilesInBrowser } from '@/lib/merge-pdfs-client';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: string;
}

interface MergeResult {
  blob: Blob;
  mergedCount: number;
  outputName: string;
}

const FAQS = [
  {
    question: 'How many PDFs can I merge in one go?',
    answer:
      'You can merge multiple files in one request. Keep the total upload size reasonable for best performance.',
  },
  {
    question: 'What happens to page order?',
    answer:
      'The merged output follows the exact order shown in your selected list.',
  },
  {
    question: 'Can I merge password-protected PDFs?',
    answer:
      'Not directly. Please unlock protected PDFs before uploading them for merging.',
  },
];

export default function MergePdfClient() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<MergeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: FileItem[] = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      name: file.name,
      size: formatFileSize(file.size),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setErrorMessage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const startMerge = async () => {
    if (files.length < 2) return;

    setIsMerging(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const merged = await mergePdfFilesInBrowser(files.map((item) => item.file));
      setResult(merged);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to merge files right now.';
      setErrorMessage(message);
    } finally {
      setIsMerging(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.outputName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-16 pb-12 text-center md:py-24 md:pb-16">
        <div className="container">
          <div className="mb-8 inline-flex rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] px-4 py-2 text-[0.875rem] font-bold text-[#dc2626]">PDF Suite Professional</div>
          <h1 className="mb-4 text-[2.25rem] font-black sm:text-[3.5rem]">
            Merge <span className="text-[#ef4444]">PDF</span> Files
          </h1>
          <p className="mx-auto max-w-[700px] text-[1.25rem] text-[var(--text-secondary)]">
            Combine multiple PDF documents into one file in your browser — nothing is uploaded to our servers.
          </p>
        </div>
      </header>

      <main className="container section">
        <div className="mx-auto max-w-[900px]">
          <Card className="!flex min-h-[400px] flex-col !rounded-[var(--radius-xl)] !border-2 !border-dashed !border-[var(--border)] !bg-[var(--bg-secondary)] !p-6 transition-all duration-300 sm:!p-10">
            <input
              type="file"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            {files.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white text-[#ef4444] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                  <FileUp size={48} />
                </div>
                <h3 className="mb-2 text-[1.5rem] font-extrabold">Select PDF Files</h3>
                <p className="mb-10 text-[var(--text-secondary)]">or click to browse your documents</p>
                <Button size="lg" className="!rounded-full !bg-[#ef4444] !px-8" onClick={() => fileInputRef.current?.click()}>
                  <Plus size={20} /> Choose Files
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[1.25rem] font-extrabold">Selected Files ({files.length})</h3>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Plus size={16} /> Add More
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {files.map((file, index) => (
                    <div key={file.id} className="relative flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 sm:gap-6 sm:p-5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[0.75rem] font-bold text-[var(--text-secondary)]">{index + 1}</div>
                      <FileText size={24} className="text-[#ef4444]" />
                      <div className="flex flex-1 flex-col">
                        <span className="text-[0.9375rem] font-bold">{file.name}</span>
                        <span className="text-[0.75rem] text-[var(--text-secondary)]">{file.size}</span>
                      </div>
                      <button className="text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[#ef4444]" onClick={() => removeFile(file.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {errorMessage && (
                  <p className="mt-4 font-semibold text-[var(--error)]">{errorMessage}</p>
                )}

                {result && (
                  <div className="mt-4 rounded-xl bg-[rgba(16,185,129,0.12)] p-3 font-semibold text-[var(--text-primary)]">
                    Successfully merged {result.mergedCount} files.
                  </div>
                )}

                <div className="mt-4 flex flex-col items-center justify-between gap-6 border-t border-[var(--border)] pt-8 md:flex-row md:gap-0">
                  <div className="flex items-center gap-3 text-[0.875rem] text-[var(--text-secondary)]">
                    <ArrowDownWideNarrow size={20} />
                    <span>Files will be merged in the order shown above.</span>
                  </div>
                  <div className="flex w-full justify-end gap-3 md:w-auto">
                    <Button
                      size="lg"
                      className="w-full !h-14 !rounded-full !bg-[#ef4444] !px-10 !text-[1rem] !font-extrabold sm:!h-16 sm:!text-[1.125rem] md:w-auto"
                      onClick={startMerge}
                      disabled={isMerging || files.length < 2}
                    >
                      {isMerging ? (
                        <>
                          <Loader2 className="mr-2.5 animate-spin" size={20} />
                          Merging Files...
                        </>
                      ) : (
                        <>
                          Merge PDF Now
                          <Zap className="ml-2.5" size={20} />
                        </>
                      )}
                    </Button>
                    {result && (
                      <Button size="lg" variant="outline" onClick={downloadResult} className="w-full md:w-auto !h-14 sm:!h-16">
                        <Download className="mr-2.5" size={20} />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-16">
            <div className="flex items-start gap-4 max-w-[300px]">
              <ShieldCheck size={32} className="text-[#ef4444] shrink-0" />
              <div>
                <h5 className="mb-2 font-bold text-[1.125rem]">Validated Uploads</h5>
                <p className="text-[0.875rem] text-[var(--text-secondary)]">Each file is validated as PDF with clear limits and structured error handling.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 max-w-[300px]">
              <Zap size={32} className="text-[#ef4444] shrink-0" />
              <div>
                <h5 className="mb-2 font-bold text-[1.125rem]">In-browser merge</h5>
                <p className="text-[0.875rem] text-[var(--text-secondary)]">
                  pdf-lib runs locally so files stay on your device and the Worker never processes
                  uploads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="container section">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-12">
          <div>
            <div className="mb-6 text-[#ef4444]">
              <FileText size={32} />
            </div>
            <h4 className="mb-4 text-[1.25rem] font-bold">Why Merge PDFs?</h4>
            <p className="leading-[1.6] text-[var(--text-secondary)]">
              Combine reports, invoices, or contracts into one clean file for faster sharing and simpler document
              management.
            </p>
          </div>
          <div>
            <div className="mb-6 text-[#ef4444]">
              <ShieldCheck size={32} />
            </div>
            <h4 className="mb-4 text-[1.25rem] font-bold">Safer Processing</h4>
            <p className="leading-[1.6] text-[var(--text-secondary)]">
              The merge pipeline validates each file and rejects invalid or encrypted uploads with clear messages.
            </p>
          </div>
          <div>
            <div className="mb-6 text-[#ef4444]">
              <ArrowDownWideNarrow size={32} />
            </div>
            <h4 className="mb-4 text-[1.25rem] font-bold">Exact Ordering</h4>
            <p className="leading-[1.6] text-[var(--text-secondary)]">The output PDF follows your selected sequence exactly, page-for-page.</p>
          </div>
        </div>
      </section>

      <SEOSection
        title="PDF Merge Tool"
        description="Merge multiple PDF files in your browser. Upload your documents, preserve ordering, and download one unified PDF — no server upload."
        howToUse={[
          'Add two or more PDF files to the queue.',
          'Review the file order in the selected list.',
          'Click Merge PDF Now to combine locally.',
          'Download the merged PDF once processing completes.',
        ]}
        benefits={[
          'Private client-side merging — files never leave your device.',
          'PDF validation and clear error messages.',
          'Exact page order preservation across input files.',
          'Quick output for sharing and archival workflows.',
        ]}
      />

      <FAQSchema faqs={FAQS} />

      <section className="container section !pt-0">
        <RelatedTools currentToolId="merge-pdf" categoryId="pdftools" />
      </section>

      <Footer />
    </div>
  );
}
