'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, ImageIcon, Download, Zap, ShieldCheck, Settings, Info, Loader2, ArrowRight } from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const FAQS = [
  {
    question: 'Does this tool upload my images to a server?',
    answer:
      'No. Compression uses the canvas in the browser. The image is not uploaded.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'JPEG, PNG, and WebP can be compressed. The saved file is a JPEG.',
  },
  {
    question: 'What does a target size do?',
    answer:
      'A target in KB starts a search over scale and JPEG quality. The search can begin at 50% or 30% scale when the target is far below the original file. If nothing fits, the saved JPEG uses quality 0.05 and 10% scale, which can still be larger than the target.',
  },
  {
    question: 'Is the saved image lossless?',
    answer:
      'No. The output is a JPEG from canvas.toDataURL. A preview is shown before the file is downloaded.',
  },
];

export default function ImageCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [targetSize, setTargetSize] = useState<string>(''); // in KB
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [appliedScale, setAppliedScale] = useState<number>(1);

  // Persistence
  useEffect(() => {
    const savedQuality = localStorage.getItem('toolioz_img_quality');
    const savedTarget = localStorage.getItem('toolioz_img_target');
    if (savedQuality) setQuality(parseFloat(savedQuality));
    if (savedTarget) setTargetSize(savedTarget);
  }, []);

  useEffect(() => {
    localStorage.setItem('toolioz_img_quality', quality.toString());
    localStorage.setItem('toolioz_img_target', targetSize);
  }, [quality, targetSize]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCompressedUrl('');
      setCompressedSize(0);
    }
  };

  const getCompressedBlob = async (img: HTMLImageElement, q: number, scale: number = 1): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', q);
    });
  };

  const compressImage = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = originalUrl;
      await new Promise((resolve) => img.onload = resolve);

      let finalBlob: Blob;
      let currentScale = 1;
      
      if (targetSize && parseFloat(targetSize) > 0) {
        const targetBytes = parseFloat(targetSize) * 1024;
        
        // Phase 1: Heuristic Scaling
        // If target is < 1/10th of original, start by halving resolution
        if (targetBytes < file.size * 0.1) currentScale = 0.5;
        if (targetBytes < file.size * 0.02) currentScale = 0.3; // Extreme
        
        let lastBlob: Blob | null = null;
        let bestQ = 0.1;

        // Nested iteration for better convergence
        for (let s = currentScale; s >= 0.1; s -= 0.1) {
          let minQ = 0.05, maxQ = 0.95;
          currentScale = s;
          
          for (let i = 0; i < 8; i++) {
            const midQ = (minQ + maxQ) / 2;
            const blob = await getCompressedBlob(img, midQ, s);
            if (blob.size <= targetBytes) {
              lastBlob = blob;
              minQ = midQ;
              bestQ = midQ;
            } else {
              maxQ = midQ;
            }
          }
          if (lastBlob) break; // Found a working scale/quality
        }
        
        finalBlob = lastBlob || await getCompressedBlob(img, 0.05, 0.1);
        setAppliedScale(currentScale);
      } else {
        // Simple quality based compression
        finalBlob = await getCompressedBlob(img, quality, 1);
        setAppliedScale(1);
      }

      setCompressedSize(finalBlob.size);
      const url = URL.createObjectURL(finalBlob);
      setCompressedUrl(url);
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('Failed to compress image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed_${file?.name.split('.')[0]}.jpg`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <header className="border-b border-[var(--border)] bg-red-50/50 px-4 py-5 text-center sm:py-7">
          <div className="container">
            <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl">Image Compressor</h1>
            <p className="mx-auto max-w-[700px] text-sm leading-6 text-[var(--text-secondary)] sm:text-base">A JPEG, PNG, or WebP is reduced by a quality setting or a target file size. The image is not uploaded.</p>
          </div>
        </header>

        <section className="container pb-12 pt-5 sm:pt-7">
          <div className={`mx-auto grid max-w-[1100px] gap-12 ${file ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <Card className="!flex min-h-[400px] flex-col !rounded-[var(--radius-xl)] !border-2 !border-dashed !border-[var(--border)] !bg-[var(--bg-secondary)] !p-6 transition-all duration-300 sm:!p-10">
                {!file ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <input type="file" accept="image/*" onChange={handleFileChange} id="img-upload" className="hidden" />
                    <label htmlFor="img-upload" className="w-full cursor-pointer">
                      <div className="mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white text-[#ef4444]">
                        <Upload size={32} />
                      </div>
                      <h3 className="mb-2 text-[1.5rem] font-extrabold">Select Image</h3>
                      <p className="mb-10 text-[var(--text-secondary)]">to optimize quality and size</p>
                    </label>
                  </div>
                ) : (
                  <div className="flex h-full flex-col">
                    <div className="relative mb-8 flex items-center justify-between gap-4 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] p-4 sm:gap-6 sm:p-5">
                      <div className="flex flex-1 items-center gap-4">
                        <ImageIcon size={28} className="text-[#ef4444]" />
                        <div>
                          <span className="block text-[0.9375rem] font-bold">{file.name}</span>
                          <span className="block text-[0.75rem] text-[var(--text-secondary)]">{formatSize(file.size)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setFile(null)}>Change</Button>
                    </div>

                    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                      <div className="mb-6 flex items-center gap-2 text-foreground">
                        <Settings size={18} />
                        <span className="font-bold">Compression Settings</span>
                      </div>

                      <div className="flex flex-col gap-6">
                        <div>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-semibold">Visual Quality</span>
                            <span className="font-bold text-primary">{Math.round(quality * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.05" 
                            value={quality} 
                            onChange={(e) => setQuality(parseFloat(e.target.value))} 
                            className="w-full accent-primary"
                            disabled={!!targetSize}
                          />
                        </div>

                        <div>
                          <span className="mb-2 block text-sm font-semibold">Target Size (KB) - Optional</span>
                          <input 
                            type="number" 
                            placeholder="e.g. 100" 
                            value={targetSize}
                            onChange={(e) => setTargetSize(e.target.value)}
                            className="w-full rounded-[10px] border border-border bg-background px-3 py-3 text-foreground"
                          />
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            A target size overrides the quality setting until the file is at or under that size.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      fullWidth 
                      className="!h-14 !rounded-full !bg-[#ef4444] !text-[1rem] !font-extrabold sm:!h-16 sm:!text-[1.125rem] mt-8"
                      onClick={compressImage} 
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="mr-2 animate-spin" /> : 'Compress Image Now'}
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {file && (
              <div>
                <Card className="flex h-full flex-col p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="text-center">
                      <p className="mb-2 text-xs font-bold text-muted-foreground">ORIGINAL</p>
                      <div className="flex h-60 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
                        <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                      </div>
                      <p className="mt-2 font-extrabold">{formatSize(file.size)}</p>
                    </div>

                    <div className="text-center">
                      <p className="mb-2 text-xs font-bold text-primary">OPTIMIZED</p>
                      <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-xl border border-primary bg-secondary">
                        {compressedUrl ? (
                          <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <div className="opacity-30"><ImageIcon size={48} /></div>
                        )}
                        {compressedSize > 0 && (
                          <div className="absolute bottom-2 right-2 rounded-full bg-emerald-600 px-2 py-1 text-[0.7rem] font-bold text-white">
                            SAVED {Math.round((1 - compressedSize / file.size) * 100)}%
                          </div>
                        )}
                        {appliedScale < 1 && (
                          <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[0.65rem] font-bold text-primary-foreground">
                            SCALED {Math.round(appliedScale * 100)}%
                          </div>
                        )}
                      </div>
                      <p className="mt-2 font-extrabold">{compressedSize ? formatSize(compressedSize) : '-'}</p>
                    </div>
                  </div>

                  {compressedUrl && (
                    <div className="mt-8">
                      <Button fullWidth variant="primary" size="lg" onClick={downloadImage}>
                        <Download size={20} className="mr-2" />
                        Download Optimized Image
                      </Button>
                      
                      {dimensions && (
                        <div className="mt-6 flex justify-between rounded-xl bg-blue-500/5 p-4 text-sm">
                          <span className="text-muted-foreground">Dimensions</span>
                          <span className="font-bold">{dimensions.width} x {dimensions.height} px</span>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
              <ShieldCheck size={24} className="mt-1 shrink-0 text-emerald-500" />
              <div>
                <h4 className="mb-2 text-[1.125rem] font-extrabold">Local compression</h4>
                <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">Compression runs in the browser. The image is not uploaded.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
              <Zap size={24} className="mt-1 shrink-0 text-amber-500" />
              <div>
                <h4 className="mb-2 text-[1.125rem] font-extrabold">Quality or target size</h4>
                <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">The result follows the quality slider, or a target file size when one is entered.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
              <Info size={24} className="mt-1 shrink-0 text-blue-500" />
              <div>
                <h4 className="mb-2 text-[1.125rem] font-extrabold">JPEG, PNG, and WebP</h4>
                <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">JPEG, PNG, and WebP can be read. The downloaded file is a JPEG.</p>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="JPEG image compressor"
          description="Reads a JPEG, PNG, or WebP and saves a JPEG. A quality slider is used at full size. A target size in KB searches scale and quality, and can still miss the target."
          howToUse={[
            "Choose a JPEG, PNG, or WebP file.",
            "Set the quality slider, or enter a target size in KB.",
            "Click Compress Image Now.",
            "Compare the preview with the original.",
            "Download the JPEG. The filename starts with compressed_."
          ]}
          benefits={[
            "The image is drawn to a canvas in the browser and is not uploaded.",
            "Without a target, scale stays at 1 and the slider sets JPEG quality.",
            "A target can shrink the image to 10% scale and quality 0.05.",
            "That fallback can still be larger than the target.",
            "The saved type is image/jpeg."
          ]}
        />

        <FAQSchema faqs={FAQS} />

        <RelatedTools currentToolId="image-compressor" categoryId="pdftools" />
      </div>
      <Footer />
    </>
  );
}
