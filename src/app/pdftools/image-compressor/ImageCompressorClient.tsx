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
      'No. All processing happens entirely in your browser using canvas-based compression. Your images never leave your device.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'You can compress JPEG, PNG, and WebP images. The output is always optimized JPEG for maximum size reduction.',
  },
  {
    question: 'What does the Target Size feature do?',
    answer:
      'When you set a target file size (e.g. 200KB), the engine automatically finds the best quality-and-scale combination to meet your goal.',
  },
  {
    question: 'Will I lose image quality?',
    answer:
      'The compressor uses intelligent resampling to preserve visual fidelity. You can see a side-by-side comparison before downloading.',
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
        <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-16 pb-12 text-center md:py-24 md:pb-16">
          <div className="container">
            <h1 className="mb-4 text-[2.25rem] font-black sm:text-[3.5rem]">Image Compressor</h1>
            <p className="mx-auto max-w-[700px] text-[1.25rem] text-[var(--text-secondary)]">Reduce image file size instantly with professional-grade compression settings.</p>
          </div>
        </header>

        <section className="container section">
          <div className={`mx-auto grid max-w-[1100px] gap-12 ${file ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <Card className="!flex min-h-[400px] flex-col !rounded-[var(--radius-xl)] !border-2 !border-dashed !border-[var(--border)] !bg-[var(--bg-secondary)] !p-6 transition-all duration-300 sm:!p-10">
                {!file ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <input type="file" accept="image/*" onChange={handleFileChange} id="img-upload" className="hidden" />
                    <label htmlFor="img-upload" className="w-full cursor-pointer">
                      <div className="mx-auto mb-8 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white text-[#ef4444] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                        <Upload size={32} />
                      </div>
                      <h3 className="mb-2 text-[1.5rem] font-extrabold">Select Image</h3>
                      <p className="mb-10 text-[var(--text-secondary)]">to optimize quality and size</p>
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="relative flex items-center justify-between gap-4 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] p-4 sm:gap-6 sm:p-5" style={{ marginBottom: '2rem' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        <Settings size={18} />
                        <span style={{ fontWeight: 700 }}>Compression Settings</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 600 }}>Visual Quality</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Math.round(quality * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.05" 
                            value={quality} 
                            onChange={(e) => setQuality(parseFloat(e.target.value))} 
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                            disabled={!!targetSize}
                          />
                        </div>

                        <div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Target Size (KB) - Optional</span>
                          <input 
                            type="number" 
                            placeholder="e.g. 100" 
                            value={targetSize}
                            onChange={(e) => setTargetSize(e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              borderRadius: '10px', 
                              border: '1px solid var(--border)',
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)'
                            }}
                          />
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                            Overrides quality to meet your size goal.
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
                      {isProcessing ? <Loader2 className="animate-spin" style={{ marginRight: '8px' }} /> : 'Compress Image Now'}
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {file && (
              <div>
                <Card style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-tertiary)' }}>ORIGINAL</p>
                      <div style={{ 
                        height: '240px', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={originalUrl} alt="Original" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <p style={{ marginTop: '0.5rem', fontWeight: 800 }}>{formatSize(file.size)}</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>OPTIMIZED</p>
                      <div style={{ 
                        height: '240px', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '12px', 
                        overflow: 'hidden',
                        border: '1px solid var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {compressedUrl ? (
                          <img src={compressedUrl} alt="Compressed" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ opacity: 0.3 }}><ImageIcon size={48} /></div>
                        )}
                        {compressedSize > 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            bottom: '8px', 
                            right: '8px', 
                            background: 'var(--success)', 
                            color: 'white', 
                            fontSize: '0.7rem', 
                            padding: '4px 8px', 
                            borderRadius: '100px',
                            fontWeight: 700
                          }}>
                            SAVED {Math.round((1 - compressedSize / file.size) * 100)}%
                          </div>
                        )}
                        {appliedScale < 1 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '8px', 
                            left: '8px', 
                            background: 'var(--primary)', 
                            color: 'white', 
                            fontSize: '0.65rem', 
                            padding: '4px 8px', 
                            borderRadius: '100px',
                            fontWeight: 700
                          }}>
                            SCALED {Math.round(appliedScale * 100)}%
                          </div>
                        )}
                      </div>
                      <p style={{ marginTop: '0.5rem', fontWeight: 800 }}>{compressedSize ? formatSize(compressedSize) : '-'}</p>
                    </div>
                  </div>

                  {compressedUrl && (
                    <div style={{ marginTop: '2rem' }}>
                      <Button fullWidth variant="primary" size="lg" onClick={downloadImage}>
                        <Download size={20} style={{ marginRight: '8px' }} />
                        Download Optimized Image
                      </Button>
                      
                      {dimensions && (
                        <div style={{ 
                          marginTop: '1.5rem', 
                          padding: '1rem', 
                          background: 'rgba(59, 130, 246, 0.05)', 
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem'
                        }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Dimensions</span>
                          <span style={{ fontWeight: 700 }}>{dimensions.width} x {dimensions.height} px</span>
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
              <ShieldCheck size={24} className="mt-1 flex-shrink-0" style={{ color: '#10b981' }} />
              <div>
                <h4 className="mb-2 text-[1.125rem] font-extrabold">Secure & Private</h4>
                <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">All processing happens locally in your browser. Your images never leave your device.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
              <Zap size={24} className="mt-1 flex-shrink-0" style={{ color: '#f59e0b' }} />
              <div>
                <h4 className="mb-2 text-[1.125rem] font-extrabold">Instant Optimization</h4>
                <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">Our advanced engine compresses your images in milliseconds with pixel-perfect results.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
              <Info size={24} className="mt-1 flex-shrink-0" style={{ color: '#3b82f6' }} />
              <div>
                <h4 className="mb-2 text-[1.125rem] font-extrabold">No File Limits</h4>
                <p className="text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">Completely free to use with no hidden caps on file size or daily usage counts.</p>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Best Online Image Compressor: Reduce Size Without Losing Quality"
          description="Compress images for fast web performance or email. Set a target file size and let our engine find the perfect balance between quality and compression. All processing is local — your photos never leave your device."
          howToUse={[
            "Select or drop your image file into the dropzone.",
            "Adjust the visual quality slider or enter a specific Target Size in KB.",
            "Click Compress Image Now to run the local optimization engine.",
            "Review the before vs after preview to ensure quality is preserved.",
            "Download your optimized image instantly."
          ]}
          benefits={[
            "Faster page loads improve search engine rankings.",
            "100% private — all processing happens in your browser.",
            "Target Size feature for meeting strict upload limits.",
            "Intelligent resampling preserves fine details.",
            "Supports JPEG, PNG, and WebP image formats."
          ]}
        />

        <FAQSchema faqs={FAQS} />

        <RelatedTools currentToolId="image-compressor" categoryId="pdftools" />
      </div>
      <Footer />
    </>
  );
}
