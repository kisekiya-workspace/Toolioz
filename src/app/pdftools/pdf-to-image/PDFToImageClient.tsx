'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Upload,
  FileImage,
  Download,
  Zap,
  ShieldCheck,
  Loader2,
  ImageIcon,
  Settings,
  Server,
} from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';

type OutputFormat = 'png' | 'jpeg';
type ScaleOption = 1 | 2 | 3;

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
}

const FAQS = [
  {
    question: 'Does this tool upload my PDF to a server?',
    answer:
      'No. Rendering runs in the browser. The PDF is not uploaded.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'Pages can be saved as PNG or JPEG. PNG keeps the pixels. JPEG is smaller.',
  },
  {
    question: 'Is there a page limit?',
    answer:
      'A PDF is limited to 30 pages so the tab can render them.',
  },
  {
    question: 'Can I convert password-protected PDFs?',
    answer:
      'Not directly. Please unlock the PDF first, then upload the unlocked version for conversion.',
  },
];

export default function PDFToImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<RenderedPage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [scale, setScale] = useState<ScaleOption>(2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImages([]);
      setErrorMessage(null);
    }
  };

  const convertToImages = async () => {
    if (!file) return;

    setIsProcessing(true);
    setImages([]);
    setErrorMessage(null);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const MAX_PAGES = 30;
      if (pdf.numPages > MAX_PAGES) {
        throw new Error(`This tool supports up to ${MAX_PAGES} pages per conversion.`);
      }

      const generatedImages: RenderedPage[] = [];
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        const context = canvas.getContext('2d');

        if (!context) throw new Error('Could not create canvas context');

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // @ts-expect-error - canvas is omitted or pdfjs types are mismatched
        await page.render(renderContext).promise;

        const dataUrl = canvas.toDataURL(mimeType);
        generatedImages.push({
          pageNumber: pageNum,
          dataUrl,
        });

        page.cleanup();
      }

      setImages(generatedImages);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong during conversion.';
      
      if (message.toLowerCase().includes('encrypted') || message.toLowerCase().includes('password')) {
        setErrorMessage('This PDF is password-protected. Please unlock it before conversion.');
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    link.download = `${file?.name.replace(/\.pdf$/i, '')}_page_${index + 1}.${ext}`;
    link.click();
  };

  const downloadAllImages = () => {
    images.forEach((img, i) => {
      setTimeout(() => downloadImage(img.dataUrl, i), i * 300);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <header className="border-b border-[var(--border)] bg-red-50/50 px-4 py-5 text-center sm:py-7">
          <div className="container">
            <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl">PDF to Image Converter</h1>
            <p className="mx-auto max-w-[700px] text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Each PDF page is rendered as a PNG or JPEG at 1x, 2x, or 3x. The file is not uploaded.
            </p>
          </div>
        </header>

        <section className="container pb-12 pt-5 sm:pt-7">
          <div className={`mx-auto grid max-w-[1100px] gap-12 ${file && images.length > 0 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <Card className="!flex min-h-[400px] flex-col !rounded-[var(--radius-xl)] !border-2 !border-dashed !border-[var(--border)] !bg-[var(--bg-secondary)] !p-6 transition-all duration-300 sm:!p-10">
                {!file ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      id="pdf-upload"
                      className="hidden"
                    />
                    <label htmlFor="pdf-upload" className="w-full cursor-pointer">
                      <div className="mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white text-[#ef4444]">
                        <ImageIcon size={32} />
                      </div>
                      <h3 className="mb-2 text-[1.5rem] font-extrabold">Drop your PDF file</h3>
                      <p className="mb-10 text-[var(--text-secondary)]">to extract high-quality images</p>
                      <span className="mt-6 inline-flex rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] px-4 py-2 text-[0.875rem] font-bold text-[#dc2626]">Max 60MB · Up to 30 pages</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <div
                      className="relative flex items-center justify-between gap-4 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] p-4 sm:gap-6 sm:p-5"
                    >
                      <div className="flex flex-1 items-center gap-4">
                        <FileImage className="text-[#ef4444]" size={28} />
                        <div>
                          <span className="block text-[0.9375rem] font-bold">{file.name}</span>
                          <span className="block text-[0.75rem] text-[var(--text-secondary)]">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setImages([]);
                          setErrorMessage(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                      <div className="mb-6 flex items-center gap-2 text-foreground">
                        <Settings size={18} />
                        <span className="font-bold">Output Settings</span>
                      </div>

                      <div className="mb-6">
                        <span className="mb-2 block text-sm font-semibold text-muted-foreground">
                          Image Format
                        </span>
                        <div className="flex gap-3">
                          {(['png', 'jpeg'] as const).map((f) => (
                            <button
                              key={f}
                              className={`flex-1 cursor-pointer rounded-lg border-2 px-1.5 py-2.5 text-sm font-bold uppercase transition ${
                                format === f
                                  ? 'border-primary bg-blue-500/10 text-primary'
                                  : 'border-border bg-transparent text-muted-foreground'
                              }`}
                              onClick={() => setFormat(f)}
                            >
                              {f === 'png' ? 'PNG (Lossless)' : 'JPEG (Smaller)'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="mb-2 block text-sm font-semibold text-muted-foreground">
                          Resolution Scale
                        </span>
                        <div className="flex gap-3">
                          {([1, 2, 3] as const).map((s) => (
                            <button
                              key={s}
                              className={`flex-1 cursor-pointer rounded-lg border-2 px-1.5 py-2.5 text-sm font-bold transition ${
                                scale === s
                                  ? 'border-primary bg-blue-500/10 text-primary'
                                  : 'border-border bg-transparent text-muted-foreground'
                              }`}
                              onClick={() => setScale(s)}
                            >
                              {s}x{' '}
                              {s === 1
                                ? '(Fast)'
                                : s === 2
                                  ? '(Default)'
                                  : '(HD)'}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          A higher scale produces a sharper image and a larger file.
                        </p>
                      </div>
                    </div>

                    {errorMessage && (
                      <p className="mt-4 font-semibold text-red-600">
                        {errorMessage}
                      </p>
                    )}

                    {!isProcessing && images.length === 0 && (
                      <Button
                        fullWidth
                        className="!h-14 !rounded-full !bg-[#ef4444] !text-[1rem] !font-extrabold sm:!h-16 sm:!text-[1.125rem] mt-8"
                        onClick={convertToImages}
                      >
                        Convert to Images
                        <Server size={20} className="ml-2.5" />
                      </Button>
                    )}

                    {isProcessing && (
                      <Button
                        fullWidth
                        className="!h-14 !rounded-full !bg-[#ef4444] !text-[1rem] !font-extrabold sm:!h-16 sm:!text-[1.125rem] mt-8"
                        disabled
                      >
                        <Loader2
                          className="mr-2.5 animate-spin"
                          size={20}
                        />
                        Converting Pages...
                      </Button>
                    )}
                  </div>
                )}
              </Card>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                  <Server className="mb-6 text-sky-500" size={24} />
                  <h4 className="mb-3 text-[1.125rem] font-extrabold">Local rendering</h4>
                  <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    Each page is rendered in the browser. The PDF is not uploaded.
                  </p>
                </div>
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                  <Zap className="mb-6 text-amber-500" size={24} />
                  <h4 className="mb-3 text-[1.125rem] font-extrabold">Resolution scale</h4>
                  <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    The 1x, 2x, and 3x scales set how many pixels are drawn for each PDF point.
                  </p>
                </div>
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                  <ShieldCheck className="mb-6 text-emerald-500" size={24} />
                  <h4 className="mb-3 text-[1.125rem] font-extrabold">No upload</h4>
                  <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    The PDF bytes stay in the tab while the pages are converted.
                  </p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                  {images.map((img) => (
                    <Card
                      key={img.pageNumber}
                      className="relative overflow-hidden p-2"
                    >
                      <img
                        src={img.dataUrl}
                        alt={`Page ${img.pageNumber}`}
                        className="w-full rounded border border-border"
                      />
                      <div className="mt-2 flex items-center justify-between text-xs font-semibold">
                        <span>Page {img.pageNumber}</span>
                        <button
                          onClick={() =>
                            downloadImage(img.dataUrl, img.pageNumber - 1)
                          }
                          className="cursor-pointer border-0 bg-transparent text-primary"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>

                {!isProcessing && (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={downloadAllImages}
                    className="mt-8"
                  >
                    <Download size={20} className="mr-2" />
                    Download All {images.length} Pages
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        <SEOSection
          title="PDF to Image Converter"
          description="Renders each PDF page as a PNG or JPEG in the browser. The file is not uploaded."
          howToUse={[
            'Upload your PDF document (up to 60MB, 30 pages max).',
            'Select the output format: PNG for lossless quality or JPEG for smaller files.',
            'Choose a resolution scale from 1x (fast) to 3x (HD).',
            'Click Convert to Images to process locally.',
            'Download individual pages or all pages at once.',
          ]}
          benefits={[
            'Rendering runs in the browser. The PDF is not uploaded.',
            'Multiple format options to match your needs.',
            'Adjustable resolution scale up to 3x for print-ready images.',
            'The PDF is not uploaded.',
            'Perfect for presentations, social media, or extracting visual content.',
          ]}
        />

        <FAQSchema faqs={FAQS} />

        <RelatedTools currentToolId="pdf-to-image" categoryId="pdftools" />
      </div>
      <Footer />
    </>
  );
}
