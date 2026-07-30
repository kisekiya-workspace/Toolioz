'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  Download,
  Eraser,
  ImageIcon,
  Info,
  Monitor,
  Paintbrush,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Smartphone,
  Undo2,
  Upload,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { SEOSection } from '@/components/ui/SEOSection';
import { xRevealFaqs, xRevealSeoSection } from '@/lib/x-hidden-image-content';
import {
  buildOpenViewPreview,
  buildTimelineVisibleOverlay,
  brushCursorOnCanvas,
  clientToCanvasPixel,
  createHiddenTimelineMask,
  detectFeedLineArtMask,
  downloadBlob,
  drawPreviewOnBackground,
  encodePngBlob,
  encodeTimelineRevealRgba,
  feedLineStyleFromPreset,
  fitCanvasSize,
  lineStrengthToThreshold,
  loadImageFile,
  OUTPUT_PRESETS,
  paintMaskDisk,
  paintMaskStroke,
  paintOverlayDisk,
  paintOverlayStroke,
  putRgbaOnCanvas,
  rasterizeCoverFit,
  simulateFeedThumbnail,
  syncCanvasBitmap,
  TIMELINE_HIDDEN,
  TIMELINE_VISIBLE,
  type OutputPresetId,
} from './x-reveal-core';

type ExportFormat = 'png8' | 'rgba';

const subscribeNoop = () => () => {};

/** Same value on server and during hydration; true only after client attach. */
function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export default function XHiddenImageClient({ title, color }: { title?: string; color?: string }) {
  const isClient = useIsClient();
  const accent = color ?? '#0f172a';
  const fileRef = useRef<HTMLInputElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintingRef = useRef(false);
  const lastPaintPointRef = useRef<{ x: number; y: number } | null>(null);
  const pendingPaintRef = useRef<{
    clientX: number;
    clientY: number;
    continueStroke: boolean;
  } | null>(null);
  const paintFrameRef = useRef<number | null>(null);
  const timelineMaskRef = useRef<Uint8Array | null>(null);
  /** Immutable snapshot for undo; updated after each stroke (not on mousedown). */
  const preStrokeMaskRef = useRef<Uint8Array | null>(null);
  const eraserActiveRef = useRef(false);
  const brushSizeRef = useRef(32);
  const maskOpacityRef = useRef(35);

  const [fileName, setFileName] = useState<string | null>(null);
  const [preset, setPreset] = useState<OutputPresetId>('square');
  const [eraserActive, setEraserActive] = useState(false);
  const [brushSize, setBrushSize] = useState(32);
  const [maskOpacity, setMaskOpacity] = useState(35);
  const [openBrightness, setOpenBrightness] = useState(1.5);
  const [openBoostEnabled, setOpenBoostEnabled] = useState(true);
  const [feedLineEnabled, setFeedLineEnabled] = useState(false);
  const [lineStrength, setLineStrength] = useState(60);
  const [lineStrengthApplied, setLineStrengthApplied] = useState(60);
  const [lineColor, setLineColor] = useState<'darken' | 'black' | 'white'>('darken');
  const [lineArtBusy, setLineArtBusy] = useState(false);
  const [timelineBg, setTimelineBg] = useState<'light' | 'dark'>('light');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png8');
  const [hasImage, setHasImage] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1664, height: 2432 });
  const [timelineMask, setTimelineMask] = useState<Uint8Array | null>(null);
  const [sourceRaster, setSourceRaster] = useState<ImageData | null>(null);
  const [feedLineMask, setFeedLineMask] = useState<Uint8Array | null>(null);
  const [maskHistory, setMaskHistory] = useState<Uint8Array[]>([]);
  const [encodeTick, setEncodeTick] = useState(0);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    timelineMaskRef.current = timelineMask;
  }, [timelineMask]);

  useEffect(() => {
    eraserActiveRef.current = eraserActive;
  }, [eraserActive]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    maskOpacityRef.current = maskOpacity;
  }, [maskOpacity]);

  useEffect(() => {
    return () => {
      if (paintFrameRef.current !== null) {
        cancelAnimationFrame(paintFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLineStrengthApplied(lineStrength), 220);
    return () => window.clearTimeout(timer);
  }, [lineStrength]);

  const reprocessSource = useCallback(
    (img: HTMLImageElement, presetId: OutputPresetId, resetBrush: boolean) => {
      const size = fitCanvasSize(img.naturalWidth, img.naturalHeight, presetId);
      const raster = rasterizeCoverFit(img, size.width, size.height);
      setSourceRaster(raster);
      setCanvasSize(size);
      setTimelineMask((prev) => {
        if (resetBrush || !prev || prev.length !== size.width * size.height) {
          const fresh = createHiddenTimelineMask(size.width, size.height);
          timelineMaskRef.current = fresh;
          preStrokeMaskRef.current = new Uint8Array(fresh);
          return fresh;
        }
        timelineMaskRef.current = prev;
        return prev;
      });
      if (resetBrush) setMaskHistory([]);
      setEncodeTick((t) => t + 1);
    },
    [],
  );

  const loadSourceImage = useCallback(
    async (file: File) => {
      const img = await loadImageFile(file);
      sourceImageRef.current = img;
      setFileName(file.name);
      setHasImage(true);
      reprocessSource(img, preset, true);
    },
    [preset, reprocessSource],
  );

  useEffect(() => {
    const img = sourceImageRef.current;
    if (!hasImage || !img) return;
    reprocessSource(img, preset, true);
  }, [preset, hasImage, reprocessSource]);

  useEffect(() => {
    if (!feedLineEnabled || !sourceRaster) {
      setFeedLineMask(null);
      setLineArtBusy(false);
      return;
    }
    setLineArtBusy(true);
    const threshold = lineStrengthToThreshold(lineStrengthApplied);
    const id = window.requestAnimationFrame(() => {
      const mask = detectFeedLineArtMask(
        sourceRaster.data,
        sourceRaster.width,
        sourceRaster.height,
        threshold,
      );
      setFeedLineMask(mask);
      setLineArtBusy(false);
      setEncodeTick((t) => t + 1);
    });
    return () => window.cancelAnimationFrame(id);
  }, [sourceRaster, feedLineEnabled, lineStrengthApplied, lineColor]);

  const encodedRgba = useMemo(() => {
    void encodeTick;
    if (!sourceRaster || !timelineMask) return null;
    return encodeTimelineRevealRgba(sourceRaster, {
      timelineMask,
      feedLineMask,
      openBrightness,
      openBoostEnabled,
      feedLineStyle: feedLineStyleFromPreset(lineColor),
    });
  }, [
    sourceRaster,
    timelineMask,
    encodeTick,
    feedLineMask,
    openBrightness,
    openBoostEnabled,
    lineColor,
  ]);

  const exportDisabled = !isClient || encodedRgba === null || exporting;
  const resetDisabled = !isClient || !hasImage;
  const undoDisabled = !isClient || maskHistory.length === 0;

  const redrawMaskStage = useCallback(
    (maskOverride?: Uint8Array) => {
      const mask = maskOverride ?? timelineMask;
      if (!sourceRaster || !mask) return;
      const base = baseCanvasRef.current;
      const overlay = overlayCanvasRef.current;
      if (!base || !overlay) return;

      syncCanvasBitmap(base, sourceRaster.width, sourceRaster.height);
      syncCanvasBitmap(overlay, sourceRaster.width, sourceRaster.height);

      const baseCtx = base.getContext('2d');
      const overlayCtx = overlay.getContext('2d');
      if (!baseCtx || !overlayCtx) return;

      baseCtx.putImageData(sourceRaster, 0, 0);
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      if (maskOpacity > 0) {
        const overlayData = buildTimelineVisibleOverlay(
          mask,
          sourceRaster.width,
          sourceRaster.height,
          maskOpacity / 100,
        );
        overlayCtx.putImageData(overlayData, 0, 0);
      }
    },
    [sourceRaster, timelineMask, maskOpacity],
  );

  useEffect(() => {
    redrawMaskStage();
  }, [redrawMaskStage, encodeTick]);

  useEffect(() => {
    if (!encodedRgba || !sourceRaster) return;

    const beforeThumb = simulateFeedThumbnail(
      encodedRgba,
      sourceRaster.width,
      sourceRaster.height,
    );
    const thumbCanvas = document.createElement('canvas');
    putRgbaOnCanvas(thumbCanvas, beforeThumb.data, beforeThumb.width, beforeThumb.height);

    const afterFull = buildOpenViewPreview(sourceRaster, openBoostEnabled, openBrightness);
    const afterCanvas = document.createElement('canvas');
    afterCanvas.width = afterFull.width;
    afterCanvas.height = afterFull.height;
    const afterCtx = afterCanvas.getContext('2d');
    afterCtx?.putImageData(afterFull, 0, 0);

    const before = beforeCanvasRef.current;
    const after = afterCanvasRef.current;
    if (before) {
      drawPreviewOnBackground(
        before,
        thumbCanvas,
        timelineBg === 'light' ? '#ffffff' : '#15202b',
      );
    }
    if (after) {
      drawPreviewOnBackground(after, afterCanvas, '#000000');
    }
  }, [encodedRgba, sourceRaster, timelineBg, openBoostEnabled, openBrightness]);

  const applyBrushAt = useCallback(
    (clientX: number, clientY: number, continueStroke: boolean) => {
      const mask = timelineMaskRef.current;
      if (!mask || !sourceRaster) return;
      const base = baseCanvasRef.current;
      const overlay = overlayCanvasRef.current;
      if (!base || !overlay) return;
      const pt = clientToCanvasPixel(base, clientX, clientY);
      if (!pt) return;

      const value: 0 | 1 = eraserActiveRef.current ? TIMELINE_HIDDEN : TIMELINE_VISIBLE;
      const radius = brushSizeRef.current;
      const prev = lastPaintPointRef.current;

      if (continueStroke && prev) {
        paintMaskStroke(
          mask,
          sourceRaster.width,
          sourceRaster.height,
          prev.x,
          prev.y,
          pt.x,
          pt.y,
          radius,
          value,
        );
      } else {
        paintMaskDisk(mask, sourceRaster.width, sourceRaster.height, pt.x, pt.y, radius, value);
      }
      lastPaintPointRef.current = pt;

      const opacity = maskOpacityRef.current;
      if (opacity > 0) {
        const overlayCtx = overlay.getContext('2d');
        if (overlayCtx) {
          const mode = eraserActiveRef.current ? 'erase' : 'paint';
          if (continueStroke && prev) {
            paintOverlayStroke(
              overlayCtx,
              prev.x,
              prev.y,
              pt.x,
              pt.y,
              radius,
              mode,
              opacity / 100,
            );
          } else {
            paintOverlayDisk(overlayCtx, pt.x, pt.y, radius, mode, opacity / 100);
          }
        }
      }
    },
    [sourceRaster],
  );

  const flushPendingPaint = useCallback(() => {
    paintFrameRef.current = null;
    const job = pendingPaintRef.current;
    if (!job || !paintingRef.current) return;
    pendingPaintRef.current = null;
    applyBrushAt(job.clientX, job.clientY, job.continueStroke);
  }, [applyBrushAt]);

  const queuePaint = useCallback(
    (clientX: number, clientY: number, continueStroke: boolean) => {
      pendingPaintRef.current = { clientX, clientY, continueStroke };
      if (paintFrameRef.current === null) {
        paintFrameRef.current = requestAnimationFrame(flushPendingPaint);
      }
    },
    [flushPendingPaint],
  );

  const commitMaskToReact = useCallback(() => {
    const mask = timelineMaskRef.current;
    if (!mask) return;
    const snapshot = new Uint8Array(mask);
    preStrokeMaskRef.current = snapshot;
    requestAnimationFrame(() => {
      setTimelineMask(snapshot);
      setEncodeTick((t) => t + 1);
    });
  }, []);

  const queueUndoSnapshot = useCallback(() => {
    const snap = preStrokeMaskRef.current;
    if (!snap) return;
    requestAnimationFrame(() => {
      setMaskHistory((h) => [...h.slice(-24), snap]);
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasImage) return;
    paintingRef.current = true;
    lastPaintPointRef.current = null;
    queueUndoSnapshot();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    applyBrushAt(e.clientX, e.clientY, false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (paintingRef.current) {
      queuePaint(e.clientX, e.clientY, true);
    }
  };

  const endStroke = () => {
    if (!paintingRef.current) return;
    if (paintFrameRef.current !== null) {
      cancelAnimationFrame(paintFrameRef.current);
      paintFrameRef.current = null;
    }
    if (pendingPaintRef.current) {
      const job = pendingPaintRef.current;
      pendingPaintRef.current = null;
      applyBrushAt(job.clientX, job.clientY, job.continueStroke);
    }
    paintingRef.current = false;
    lastPaintPointRef.current = null;
    commitMaskToReact();
  };

  const handleUndo = () => {
    if (maskHistory.length === 0) return;
    const prev = maskHistory[maskHistory.length - 1];
    const copy = new Uint8Array(prev);
    timelineMaskRef.current = copy;
    preStrokeMaskRef.current = new Uint8Array(copy);
    setTimelineMask(copy);
    setMaskHistory((h) => h.slice(0, -1));
    redrawMaskStage(copy);
    setEncodeTick((t) => t + 1);
  };

  const handleResetMask = () => {
    if (!sourceRaster) return;
    const current = timelineMaskRef.current;
    if (current && preStrokeMaskRef.current) {
      setMaskHistory((h) => [...h.slice(-24), preStrokeMaskRef.current!]);
    }
    const fresh = createHiddenTimelineMask(sourceRaster.width, sourceRaster.height);
    timelineMaskRef.current = fresh;
    preStrokeMaskRef.current = new Uint8Array(fresh);
    setTimelineMask(fresh);
    redrawMaskStage(fresh);
    setEncodeTick((t) => t + 1);
  };

  const handleExport = async () => {
    if (!encodedRgba || !sourceRaster) return;
    setExporting(true);
    try {
      const blob = await encodePngBlob(
        encodedRgba,
        sourceRaster.width,
        sourceRaster.height,
        exportFormat,
      );
      const base = fileName?.replace(/\.[^.]+$/, '') ?? 'x-hidden-image';
      downloadBlob(blob, `${base}-x-reveal-${exportFormat}.png`);
    } finally {
      setExporting(false);
    }
  };

  const [leftPanel, setLeftPanel] = useState<'source' | 'effects'>('source');

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) void loadSourceImage(file);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-primary)] py-10 md:py-14">
        <div className="container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p
              className="mb-3 text-[0.75rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              Toolioz · X reveal PNG
            </p>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              {title ?? 'X Tap-to-Reveal PNG Maker'}
            </h1>
            <p className="mt-3 text-[var(--text-secondary)] md:text-lg">
              Free hidden-image PNG maker for the viral X tap-to-reveal and Twitter tap-and-hold
              trend: muted timeline preview, full color when opened. Brush masks, feed mockups,
              PNG8 export — all processing stays in your browser.
            </p>
            <p className="mt-3 text-sm text-[var(--text-tertiary)]">
              New to the trend?{' '}
              <Link
                href="/devtools/blog/x-tap-to-reveal-hidden-png-twitter-guide"
                className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
              >
                Read the tap-to-reveal guide
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={exportDisabled}
              onClick={() => void handleExport()}
            >
              <Download size={18} />
              {exporting ? 'Encoding…' : 'Download PNG'}
            </Button>
            <label className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold">
              <span className="text-[var(--text-tertiary)]">Format</span>
              <select
                className="bg-transparent font-medium outline-none"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              >
                <option value="png8">PNG8</option>
                <option value="rgba">RGBA</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8 pb-20 md:py-10">
        <div className="mb-6 flex flex-wrap items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)]">
          <Info className="mt-0.5 shrink-0 text-[var(--primary)]" size={18} />
          <p>
            Upload from <strong>desktop x.com</strong> so transparency survives. Mobile apps often
            re-encode to JPEG. Light-mode timelines show the effect best.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,280px)]">
          {/* Left rail — source & output */}
          <div className="flex flex-col gap-4">
            <div className="flex rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
              <button
                type="button"
                className={`flex-1 rounded-[var(--radius-sm)] py-2 text-xs font-bold uppercase tracking-wide ${leftPanel === 'source' ? 'bg-white shadow-sm' : 'text-[var(--text-tertiary)]'}`}
                onClick={() => setLeftPanel('source')}
              >
                Source
              </button>
              <button
                type="button"
                className={`flex-1 rounded-[var(--radius-sm)] py-2 text-xs font-bold uppercase tracking-wide ${leftPanel === 'effects' ? 'bg-white shadow-sm' : 'text-[var(--text-tertiary)]'}`}
                onClick={() => setLeftPanel('effects')}
              >
                Effects
              </button>
            </div>

            {leftPanel === 'source' ? (
              <Card className="!p-5">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className="mb-4 flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-8 text-center transition hover:border-[var(--primary)]"
                >
                  <Upload size={24} className="text-[var(--text-tertiary)]" />
                  <span className="text-sm font-bold">Add image</span>
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
                      if (f) void loadSourceImage(f);
                    }}
                  />
                </div>
                <label className="mb-3 flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
                  Canvas
                  <select
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3 py-2 text-sm font-normal normal-case"
                    value={preset}
                    onChange={(e) => setPreset(e.target.value as OutputPresetId)}
                  >
                    {OUTPUT_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
                {hasImage && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    {canvasSize.width}×{canvasSize.height}px
                  </p>
                )}
              </Card>
            ) : (
              <Card className="!space-y-4 !p-5">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={openBoostEnabled}
                    onChange={(e) => {
                      setOpenBoostEnabled(e.target.checked);
                      setEncodeTick((t) => t + 1);
                    }}
                  />
                  Brightness after open
                </label>
                <label className="block text-sm font-bold">
                  ×{openBrightness.toFixed(2)}
                  <input
                    type="range"
                    className="mt-2 w-full"
                    min={1}
                    max={2.5}
                    step={0.05}
                    value={openBrightness}
                    disabled={!openBoostEnabled}
                    onChange={(e) => {
                      setOpenBrightness(Number(e.target.value));
                      setEncodeTick((t) => t + 1);
                    }}
                  />
                </label>
                <hr className="border-[var(--border)]" />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={feedLineEnabled}
                    onChange={(e) => setFeedLineEnabled(e.target.checked)}
                  />
                  Line art on feed
                </label>
                {feedLineEnabled && (
                  <>
                    <label className="block text-sm font-bold">
                      Lines {lineStrength}%
                      {lineArtBusy && (
                        <span className="ml-2 text-xs font-normal text-[var(--text-tertiary)]">
                          Updating…
                        </span>
                      )}
                      <input
                        type="range"
                        className="mt-2 w-full"
                        min={0}
                        max={100}
                        value={lineStrength}
                        onChange={(e) => setLineStrength(Number(e.target.value))}
                      />
                    </label>
                    <select
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-sm"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value as typeof lineColor)}
                    >
                      <option value="darken">Darken</option>
                      <option value="black">Black</option>
                      <option value="white">White</option>
                    </select>
                  </>
                )}
              </Card>
            )}

            <div className="hidden text-xs text-[var(--text-tertiary)] xl:flex xl:items-center xl:gap-2">
              <ShieldCheck size={14} className="text-[#10b981]" />
              Client-side only
            </div>
          </div>

          {/* Center — editor + feed mockups */}
          <div className="flex min-w-0 flex-col gap-5">
            <Card className="!overflow-hidden !p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Paintbrush size={16} className="text-[var(--primary)]" />
                  Timeline mask
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={eraserActive ? 'primary' : 'secondary'}
                  onClick={() => setEraserActive((v) => !v)}
                  aria-pressed={eraserActive}
                >
                  <Eraser size={16} />
                  {eraserActive ? 'Eraser on' : 'Eraser'}
                </Button>
              </div>
              <p className="border-b border-[var(--border)] px-4 py-2 text-xs text-[var(--text-secondary)]">
                Paint to mark feed-visible areas (blue). Turn on Eraser to hide them again.
              </p>

              <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <label className="text-sm font-bold">
                  Brush {brushSize}px
                  <input
                    type="range"
                    className="mt-1 w-full"
                    min={4}
                    max={120}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                  />
                </label>
                <label className="text-sm font-bold md:w-40">
                  Overlay {maskOpacity}%
                  <input
                    type="range"
                    className="mt-1 w-full"
                    min={0}
                    max={80}
                    value={maskOpacity}
                    onChange={(e) => setMaskOpacity(Number(e.target.value))}
                  />
                </label>
              </div>

              <div className="border-t border-[var(--border)] bg-[#0f172a]/[0.02] p-4">
                <BrushStage
                  hasImage={hasImage}
                  canvasSize={canvasSize}
                  brushSize={brushSize}
                  eraserActive={eraserActive}
                  baseRef={baseCanvasRef}
                  overlayRef={overlayCanvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endStroke}
                  onPointerLeave={endStroke}
                />
              </div>

              <div className="flex flex-wrap gap-2 border-t border-[var(--border)] px-4 py-3">
                <Button type="button" variant="ghost" size="sm" onClick={handleUndo} disabled={undoDisabled}>
                  <Undo2 size={16} /> Undo
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleResetMask} disabled={resetDisabled}>
                  <RotateCcw size={16} /> Reset mask
                </Button>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeedMock
                icon={<Smartphone size={14} />}
                title="In feed"
                subtitle="Mask affects this view"
                canvasRef={beforeCanvasRef}
                ready={!!encodedRgba}
                toolbar={
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className={`rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase ${timelineBg === 'light' ? 'bg-white shadow' : 'opacity-60'}`}
                      onClick={() => setTimelineBg('light')}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      className={`rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase ${timelineBg === 'dark' ? 'bg-slate-800 text-white' : 'opacity-60'}`}
                      onClick={() => setTimelineBg('dark')}
                    >
                      Dark
                    </button>
                  </div>
                }
              />
              <FeedMock
                icon={<Monitor size={14} />}
                title="Opened"
                subtitle="Full image always"
                canvasRef={afterCanvasRef}
                ready={!!sourceRaster}
                dark
              />
            </div>
          </div>

          {/* Right — quick help */}
          <Card className="!p-5 xl:sticky xl:top-6 xl:self-start">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[var(--text-tertiary)]">
              <Settings2 size={16} /> How masking works
            </h3>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex gap-2">
                <Eraser size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                <span>
                  <strong className="text-[var(--text-primary)]">Default:</strong> whole image hidden
                  in feed, full color when opened.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-blue-500/70" />
                <span>
                  <strong className="text-[var(--text-primary)]">Blue paint:</strong> regions visible
                  in the feed before tap.
                </span>
              </li>
              <li className="flex gap-2">
                <ImageIcon size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                <span>PNG8 export is tuned for X; post from desktop web.</span>
              </li>
            </ul>
            <Button
              type="button"
              className="mt-6 w-full xl:hidden"
              disabled={exportDisabled}
              onClick={() => void handleExport()}
            >
              <Download size={18} /> Download PNG
            </Button>
          </Card>
        </div>

        <RelatedTools currentToolId="x-hidden-image" categoryId="design" />
      </main>

      <SEOSection
        title={xRevealSeoSection.title}
        description={xRevealSeoSection.description}
        howToUse={xRevealSeoSection.howToUse}
        benefits={xRevealSeoSection.benefits}
      />

      <FAQSchema faqs={xRevealFaqs} />

      <Footer />
    </div>
  );
}

function BrushStage({
  hasImage,
  canvasSize,
  brushSize,
  eraserActive,
  baseRef,
  overlayRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
}: {
  hasImage: boolean;
  canvasSize: { width: number; height: number };
  brushSize: number;
  eraserActive: boolean;
  baseRef: React.RefObject<HTMLCanvasElement | null>;
  overlayRef: React.RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
}) {
  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
    diameter: number;
    visible: boolean;
  }>({ x: 0, y: 0, diameter: 32, visible: false });

  const syncCursor = (e: React.PointerEvent) => {
    if (!hasImage) {
      setCursor((c) => (c.visible ? { ...c, visible: false } : c));
      return;
    }
    const base = baseRef.current;
    if (!base) return;
    const mapped = brushCursorOnCanvas(base, e.clientX, e.clientY, brushSize);
    setCursor({
      x: mapped.x,
      y: mapped.y,
      diameter: mapped.diameter,
      visible: mapped.inside,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    syncCursor(e);
    onPointerDown(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    syncCursor(e);
    onPointerMove(e);
  };

  const handlePointerLeave = () => {
    setCursor((c) => ({ ...c, visible: false }));
    onPointerLeave();
  };

  const ringColor = eraserActive ? 'rgba(239, 68, 68, 0.95)' : 'rgba(59, 130, 246, 0.95)';
  const fillColor = eraserActive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)';

  return (
    <div
      className={`relative mx-auto w-full max-w-lg touch-none ${hasImage ? 'cursor-none' : ''}`}
      style={{
        aspectRatio: `${canvasSize.width} / ${canvasSize.height}`,
        maxHeight: 'min(520px, 58vh)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={syncCursor}
    >
      <canvas ref={baseRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      {hasImage && cursor.visible && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1px_rgba(255,255,255,0.85)]"
          style={{
            left: cursor.x,
            top: cursor.y,
            width: cursor.diameter,
            height: cursor.diameter,
            borderColor: ringColor,
            backgroundColor: fillColor,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90"
            style={{ boxShadow: '0 0 0 1px rgba(15,23,42,0.35)' }}
          />
        </div>
      )}
      {!hasImage && (
        <p className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-white/80 text-sm text-[var(--text-secondary)]">
          Upload an image to edit the feed mask
        </p>
      )}
    </div>
  );
}

function FeedMock({
  title,
  subtitle,
  icon,
  canvasRef,
  ready,
  dark,
  toolbar,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  ready: boolean;
  dark?: boolean;
  toolbar?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-tertiary)]">
            {icon}
            {title}
          </div>
          <p className="text-[0.65rem] text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        {toolbar}
      </div>
      <div
        className={`flex min-h-[140px] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] p-2 ${dark ? 'bg-black' : 'bg-white'}`}
      >
        {ready ? (
          <canvas ref={canvasRef} className="max-h-44 max-w-full object-contain" />
        ) : (
          <span className="text-xs text-[var(--text-tertiary)]">Waiting for image…</span>
        )}
      </div>
    </div>
  );
}
