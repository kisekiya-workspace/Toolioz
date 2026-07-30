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
      'No. All processing happens locally in your browser. Your PDF files never leave your device, ensuring complete privacy and security.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'You can export pages as high-resolution PNG (lossless) or JPEG (smaller file size) images.',
  },
  {
    question: 'Is there a page limit?',
    answer:
      'The tool supports up to 30 pages per PDF to ensure fast and reliable processing within your browser.',
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
        <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-16 pb-12 text-center md:py-24 md:pb-16">
          <div className="container">
            <h1 className="mb-4 text-[2.25rem] font-black sm:text-[3.5rem]">PDF to Image Converter</h1>
            <p className="mx-auto max-w-[700px] text-[1.25rem] text-[var(--text-secondary)]">
              Convert PDF pages to high-resolution PNG or JPEG images safely and securely right in your browser.
            </p>
          </div>
        </header>

        <section className="container section">
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
                      <div className="mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white text-[#ef4444] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '1.5rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <Settings size={18} />
                        <span style={{ fontWeight: 700 }}>Output Settings</span>
                      </div>

                      {/* Format Selection */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            display: 'block',
                            marginBottom: '8px',
                          }}
                        >
                          Image Format
                        </span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {(['png', 'jpeg'] as const).map((f) => (
                            <button
                              key={f}
                              style={{
                                flex: 1,
                                padding: '10px 6px',
                                borderRadius: '8px',
                                border: '2px solid',
                                borderColor:
                                  format === f ? 'var(--primary)' : 'var(--border)',
                                background:
                                  format === f
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'transparent',
                                color:
                                  format === f
                                    ? 'var(--primary)'
                                    : 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onClick={() => setFormat(f)}
                            >
                              {f === 'png' ? 'PNG (Lossless)' : 'JPEG (Smaller)'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scale Selection */}
                      <div>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            display: 'block',
                            marginBottom: '8px',
                          }}
                        >
                          Resolution Scale
                        </span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {([1, 2, 3] as const).map((s) => (
                            <button
                              key={s}
                              style={{
                                flex: 1,
                                padding: '10px 6px',
                                borderRadius: '8px',
                                border: '2px solid',
                                borderColor:
                                  scale === s ? 'var(--primary)' : 'var(--border)',
                                background:
                                  scale === s
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'transparent',
                                color:
                                  scale === s
                                    ? 'var(--primary)'
                                    : 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
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
                        <p
                          style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.8rem',
                            marginTop: '8px',
                          }}
                        >
                          Higher scale = sharper images but larger file size.
                        </p>
                      </div>
                    </div>

                    {errorMessage && (
                      <p
                        style={{
                          color: 'var(--error)',
                          marginTop: '1rem',
                          fontWeight: 600,
                        }}
                      >
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
                        <Server size={20} style={{ marginLeft: '10px' }} />
                      </Button>
                    )}

                    {isProcessing && (
                      <Button
                        fullWidth
                        className="!h-14 !rounded-full !bg-[#ef4444] !text-[1rem] !font-extrabold sm:!h-16 sm:!text-[1.125rem] mt-8"
                        disabled
                      >
                        <Loader2
                          className="animate-spin"
                          size={20}
                          style={{ marginRight: '10px' }}
                        />
                        Converting Pages...
                      </Button>
                    )}
                  </div>
                )}
              </Card>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                  <Server
                    className="mb-6"
                    size={24}
                    style={{ color: '#0ea5e9' }}
                  />
                  <h4 className="mb-3 text-[1.125rem] font-extrabold">100% Local Processing</h4>
                  <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    Pages are rendered directly on your device using a professional browser engine. Zero server uploads.
                  </p>
                </div>
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                  <Zap
                    className="mb-6"
                    size={24}
                    style={{ color: '#f59e0b' }}
                  />
                  <h4 className="mb-3 text-[1.125rem] font-extrabold">High Resolution</h4>
                  <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    Up to 3x scale rendering ensures your images remain crisp and
                    professional for any use case.
                  </p>
                </div>
                <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                  <ShieldCheck
                    className="mb-6"
                    size={24}
                    style={{ color: '#10b981' }}
                  />
                  <h4 className="mb-3 text-[1.125rem] font-extrabold">Complete Privacy</h4>
                  <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    Since the PDF is processed on your device, your confidential data is never transmitted over the internet.
                  </p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {images.map((img) => (
                    <Card
                      key={img.pageNumber}
                      style={{
                        padding: '8px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={img.dataUrl}
                        alt={`Page ${img.pageNumber}`}
                        style={{
                          width: '100%',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                        }}
                      />
                      <div
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <span>Page {img.pageNumber}</span>
                        <button
                          onClick={() =>
                            downloadImage(img.dataUrl, img.pageNumber - 1)
                          }
                          style={{
                            color: 'var(--primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
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
                    style={{ marginTop: '2rem' }}
                  >
                    <Download size={20} style={{ marginRight: '8px' }} />
                    Download All {images.length} Pages
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        <SEOSection
          title="PDF to Image Converter"
          description="Convert PDF documents into high-resolution PNG or JPEG images directly in your browser. 100% private and secure processing with zero server uploads."
          howToUse={[
            'Upload your PDF document (up to 60MB, 30 pages max).',
            'Select the output format: PNG for lossless quality or JPEG for smaller files.',
            'Choose a resolution scale from 1x (fast) to 3x (HD).',
            'Click Convert to Images to process locally.',
            'Download individual pages or all pages at once.',
          ]}
          benefits={[
            'Fast local processing directly in your browser.',
            'Multiple format options to match your needs.',
            'Adjustable resolution scale up to 3x for print-ready images.',
            'Complete privacy — your files are never uploaded to any server.',
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
