'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Download, Scissors, Upload } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { SEOSection } from '@/components/ui/SEOSection';

const RATIO = 16 / 9;

const FAQS = [
  {
    question: 'How does the 16:9 to 3-part split work?',
    answer:
      'Your photo is center-cropped to 16:9, then cut into three equal vertical strips (1×3). Each slice is a PNG you can post as a triptych on X, Instagram, or a carousel.',
  },
  {
    question: 'Does this upload my image?',
    answer: 'No. Cropping and export run in your browser. Files stay on your device.',
  },
  {
    question: 'What if my photo is not 16:9?',
    answer:
      'The tool crops from the center to 16:9 so the three panels line up as a widescreen triptych. Edges outside that frame are discarded.',
  },
];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });
}

function cropTo16x9(img: HTMLImageElement): HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = w;
  let sh = h;
  if (w / h > RATIO) {
    sw = h * RATIO;
    sx = (w - sw) / 2;
  } else {
    sh = w / RATIO;
    sy = (h - sh) / 2;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw);
  canvas.height = Math.round(sh);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function sliceThirds(source: HTMLCanvasElement): HTMLCanvasElement[] {
  const { width, height } = source;
  const left = Math.floor(width / 3);
  const mid = Math.floor(width / 3);
  const parts = [left, mid, width - left - mid];
  let x = 0;
  return parts.map((pw) => {
    const canvas = document.createElement('canvas');
    canvas.width = pw;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(source, x, 0, pw, height, 0, 0, pw, height);
    x += pw;
    return canvas;
  });
}

function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadPng(canvas: HTMLCanvasElement, name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not encode PNG'));
        return;
      }
      downloadBlob(blob, name);
      resolve();
    }, 'image/png');
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Uncompressed ZIP (store) so Download all is a single save dialog. */
function zipFiles(files: { name: string; data: Uint8Array }[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const crc = crc32(file.data);
    const local = new Uint8Array(30 + nameBytes.length + file.data.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(8, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, file.data.length, true);
    lv.setUint32(22, file.data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(file.data, 30 + nameBytes.length);
    localParts.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, file.data.length, true);
    cv.setUint32(24, file.data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length;
  }

  const centralSize = centralParts.reduce((n, p) => n + p.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);

  return new Blob(
    [...localParts, ...centralParts, end].map((part) =>
      part.buffer.slice(part.byteOffset, part.byteOffset + part.byteLength),
    ) as BlobPart[],
    { type: 'application/zip' },
  );
}

async function canvasPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not encode PNG');
  return new Uint8Array(await blob.arrayBuffer());
}

export default function SplitImageIn3Client({
  title,
  color,
}: {
  title?: string;
  color?: string;
}) {
  const accent = color ?? '#ea580c';
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const slicesRef = useRef<HTMLCanvasElement[]>([]);

  const handleFile = useCallback(async (file: File) => {
    const img = await loadImage(file);
    const cropped = cropTo16x9(img);
    const slices = sliceThirds(cropped);
    slicesRef.current = slices;
    setFileName(file.name);
    setPreviewUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return slices.map((c) => c.toDataURL('image/png'));
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) void handleFile(file);
  };

  const downloadOne = (index: number) => {
    const canvas = slicesRef.current[index];
    if (!canvas) return;
    const base = fileName?.replace(/\.[^.]+$/, '') ?? 'split';
    downloadPng(canvas, `${base}-part-${index + 1}.png`);
  };

  const downloadAllZip = async () => {
    const slices = slicesRef.current;
    if (slices.length !== 3) return;
    const base = fileName?.replace(/\.[^.]+$/, '') ?? 'split';
    const files = await Promise.all(
      slices.map(async (canvas, i) => ({
        name: `${base}-part-${i + 1}.png`,
        data: await canvasPngBytes(canvas),
      })),
    );
    downloadBlob(zipFiles(files), `${base}-split-3.zip`);
  };

  const downloadAllPngs = async () => {
    const slices = slicesRef.current;
    if (slices.length !== 3) return;
    const base = fileName?.replace(/\.[^.]+$/, '') ?? 'split';
    for (let i = 0; i < slices.length; i++) {
      await downloadPng(slices[i], `${base}-part-${i + 1}.png`);
      if (i < slices.length - 1) await wait(350);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] py-10 md:py-14">
        <div className="container max-w-4xl">
          <p
            className="mb-3 text-[0.75rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            Toolioz · 16:9 triptych
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            {title ?? 'Split Image in 3'}
          </h1>
          <p className="mt-3 text-[var(--text-secondary)] md:text-lg">
            Crop to 16:9, then split into three equal vertical parts. Download PNG
            slices for X, Instagram, or print — processed in your browser.
          </p>
        </div>
      </header>

      <main className="container max-w-4xl flex-1 py-8 pb-20">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className="mb-8 flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-white px-4 py-12 text-center transition hover:border-[var(--primary)]"
        >
          <Upload size={28} className="text-[var(--text-tertiary)]" />
          <span className="text-sm font-bold">Drop a photo or click to upload</span>
          <span className="text-xs text-[var(--text-secondary)]">
            {fileName ?? 'JPEG · PNG · WebP'}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
        </div>

        {previewUrls.length === 3 && (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[var(--text-tertiary)]">
                <Scissors size={16} /> Split result
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => void downloadAllPngs()}>
                  <Download size={16} /> Download all PNGs
                </Button>
                <Button type="button" onClick={() => void downloadAllZip()}>
                  <Download size={16} /> Download ZIP
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {previewUrls.map((url, i) => (
                <div
                  key={url.slice(-24) + i}
                  className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Part ${i + 1}`} className="block w-full" />
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-bold text-[var(--text-tertiary)]">
                      {i + 1}
                    </span>
                    <Button type="button" size="sm" variant="secondary" onClick={() => downloadOne(i)}>
                      <Download size={14} /> PNG
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <RelatedTools currentToolId="split-image-in-3" categoryId="design" />
      </main>

      <SEOSection
        title="the 16:9 Image Splitter"
        description="Split a widescreen photo into three equal vertical panels. The source is center-cropped to 16:9 so the slices line up as one triptych when posted side by side."
        howToUse={[
          'Upload a JPEG, PNG, or WebP.',
          'The tool crops to 16:9 from the center, then cuts three equal vertical parts.',
          'Download each PNG, all three PNGs, or a single ZIP.',
        ]}
        benefits={[
          'Fixed 16:9 → 1×3 layout — no extra settings.',
          'Runs locally; nothing is uploaded to Toolioz.',
          'PNG export ready for X, Instagram carousels, and canvas prints.',
        ]}
      />

      <FAQSchema faqs={FAQS} />
      <Footer />
    </div>
  );
}
