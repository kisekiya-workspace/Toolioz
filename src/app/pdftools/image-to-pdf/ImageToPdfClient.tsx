'use client';

import React, { useRef, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FileImage,
  Plus,
  X,
  ShieldCheck,
  Zap,
  Download,
  FileUp,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { PDFDocument } from 'pdf-lib';

interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  size: string;
  previewUrl: string;
}

const FAQS = [
  {
    question: 'How does Image to PDF conversion work in Toolioz?',
    answer:
      'All image processing happens directly inside your web browser memory using pdf-lib. Your images are never uploaded to any cloud server.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'You can convert JPG, JPEG, PNG, WebP, and BMP images into a clean single PDF file.',
  },
  {
    question: 'Can I re-arrange the order of images before generating the PDF?',
    answer:
      'Yes. You can add multiple photos, view thumbnail previews, remove unwanted images, and generate the PDF in exact order.',
  },
];

export default function ImageToPdfClient() {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
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
    const validImages = selectedFiles.filter((f) => f.type.startsWith('image/'));

    if (validImages.length === 0) {
      setErrorMessage('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    const newItems: ImageFileItem[] = validImages.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
    setErrorMessage(null);
    setPdfBlobUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setPdfBlobUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const file = item.file;
        const imageBytes = new Uint8Array(await file.arrayBuffer());

        let embeddedImage;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Convert WebP / BMP / GIF to PNG via browser Canvas
          const img = document.createElement('img');
          img.src = item.previewUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 600;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const pngBlob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, 'image/png')
          );
          if (!pngBlob) throw new Error(`Could not process image "${file.name}"`);

          const pngBuffer = new Uint8Array(await pngBlob.arrayBuffer());
          embeddedImage = await pdfDoc.embedPng(pngBuffer);
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to convert images to PDF.'
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
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side In-Browser Conversion
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Image to PDF Converter
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Convert JPG, PNG, and WebP photos into a clean single PDF document. Zero server uploads.
          </p>
        </header>

        {/* Action Card */}
        <Card className="rounded-3xl border-cyan-200 bg-white p-6 sm:p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-cyan-300 bg-cyan-50/60 p-8 text-center hover:border-cyan-500 hover:bg-cyan-50"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-100 text-cyan-700">
              <FileUp className="w-7 h-7" />
            </div>
            <p className="mb-1 text-lg font-bold text-slate-900">Click to upload image files</p>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WebP, GIF, and BMP formats</p>
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Selected Images List */}
          {images.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <FileImage className="w-4 h-4 text-cyan-400" />
                Selected Images ({images.length})
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {images.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-xl border border-cyan-200 bg-cyan-50 p-2"
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                    <p className="truncate px-1 text-xs font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 px-1">{item.size}</p>

                    <button
                      onClick={() => removeImage(item.id)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-800 pt-6">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add More Images
                </Button>

                <Button
                  onClick={convertToPdf}
                  disabled={isProcessing}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-cyan-500/20 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Convert to PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Download Generated PDF */}
          {pdfBlobUrl && (
            <div className="mt-8 p-6 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-center">
              <h3 className="mb-2 text-lg font-bold text-slate-900">PDF Document Ready!</h3>
              <p className="mb-4 text-sm text-slate-600">
                Your images were merged into a PDF file locally in browser memory.
              </p>
              <a
                href={pdfBlobUrl}
                download={`images_doc_${Date.now()}.pdf`}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-700"
              >
                <Download className="w-4 h-4" /> Download PDF File
              </a>
            </div>
          )}
        </Card>

        {/* SEO & Educational Content */}
        <SEOSection
          title="Image to PDF Conversion"
          description="Converting JPG and PNG photos into a PDF is essential for submitting official application forms, university reports, and business documentation. Unlike traditional web converters that require uploading confidential photos to remote cloud servers, Toolioz processes all image embedding locally inside your browser memory using WebAssembly and JavaScript."
          howToUse={[
            "Select your JPG, PNG, or WebP images using the file picker.",
            "Preview selected images and remove unwanted files.",
            "Click 'Convert to PDF' to generate the document in browser memory.",
            "Click 'Download PDF File' to save your new PDF locally."
          ]}
          benefits={[
            "100% private in-browser image processing with zero server uploads.",
            "Supports multi-image conversion (JPG, PNG, WebP, GIF, BMP).",
            "Generates clean, full-resolution PDF pages matching image dimensions.",
            "Fast, free, and accessible on both desktop and mobile browsers."
          ]}
        />

        <FAQSchema faqs={FAQS} />
        <RelatedTools currentToolId="image-to-pdf" categoryId="pdftools" />
      </div>

      <Footer />
    </main>
  );
}
