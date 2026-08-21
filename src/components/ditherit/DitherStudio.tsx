"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Upload, Download, Code, RefreshCw,
  ChevronDown, ChevronRight, Copy, Check,
  Play, Pause, Film, Type, Sun, Moon, Star,
  Columns2, FileVideo, Eraser, Sparkles, ChevronLeft, ArrowLeft
} from "lucide-react";
import {
  ditherImage, drawDots, generateInteractionCode, generateReactCode,
  DEFAULT_PARAMS, DitherParams, DotCoord, BLEND_MODES, dotsToSVG
} from "@/lib/ditherit/dither";
import {
  imageDataToAscii, renderAsciiToCanvas, generateAsciiVideoCode,
  DEFAULT_ASCII_PARAMS, AsciiParams, AsciiCell
} from "@/lib/ditherit/ascii";
import { extractVideoFrames } from "@/lib/ditherit/videoFrames";
import { decodeGif } from "@/lib/ditherit/gifDecoder";
import { removeBackground } from "@/lib/ditherit/bgErase";
import { useDebounce } from "@/lib/ditherit/useDebounce";

import Slider from "./Slider";
import Toggle from "./Toggle";

const OUTPUT_SIZE = 600;
const MAX_VIDEO_FRAMES = 90;

type Tab = "studio" | "preview";
type Mode = "image" | "video" | "ascii";
type VideoRender = "dither" | "ascii";
type DetectedType = "image" | "video" | "gif" | null;

const ALGORITHMS = [
  { value: "floyd-steinberg", label: "Floyd-Steinberg" },
  { value: "atkinson", label: "Atkinson" },
  { value: "ordered", label: "Ordered (Bayer)" },
  { value: "threshold", label: "Hard Threshold" },
] as const;

const ASCII_CHARSET_OPTS = [
  { value: "detailed", label: "@#S%?*+;:,. " },
  { value: "blocks", label: "█▓▒░ " },
  { value: "pixel", label: "Pixel Blocks" },
  { value: "minimal", label: "@:. " },
  { value: "custom", label: "Custom" },
] as const;

const PAINT_ONLY_DITHER = new Set<keyof DitherParams>(["bgColor", "dotColor", "repelRadius", "repelStrength"]);
const PAINT_ONLY_ASCII = new Set<keyof AsciiParams>(["bgColor", "fgColor", "colored", "glow", "glowColor", "glowRadius"]);

function detectFileType(file: File): DetectedType {
  if (file.type === "image/gif") return "gif";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "gif") return "gif";
  if (["mp4", "webm", "mov"].includes(ext ?? "")) return "video";
  if (["png", "jpg", "jpeg", "webp", "svg", "bmp"].includes(ext ?? "")) return "image";
  return null;
}

function computeDims(w: number, h: number) {
  const asp = w / h;
  let cw = OUTPUT_SIZE, ch = OUTPUT_SIZE;
  if (asp > 1) ch = Math.round(OUTPUT_SIZE / asp);
  else cw = Math.round(OUTPUT_SIZE * asp);
  return { cw, ch };
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-2.5 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition text-left cursor-pointer"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          {open ? <ChevronDown size={12} className="text-zinc-400 dark:text-zinc-500" /> : <ChevronRight size={12} className="text-zinc-400 dark:text-zinc-500" />}
          {title}
        </span>
      </button>
      {open && <div className="flex flex-col gap-1 px-3 pb-3 pt-1">{children}</div>}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 rounded-xl h-9 px-3 mb-1.5">
      <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">{value}</span>
        <label className="relative w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 overflow-hidden cursor-pointer flex-shrink-0" style={{ background: value }}>
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0"
          />
        </label>
      </div>
    </div>
  );
}

export default function DitherStudio() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  type PhysDot = DotCoord & { ox: number; oy: number; tx: number; ty: number; vx: number; vy: number };
  const previewDotsRef = useRef<PhysDot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const ditherFramesRef = useRef<DotCoord[][]>([]);
  const asciiFramesRef = useRef<AsciiCell[][]>([]);
  const rawFramesRef = useRef<ImageData[]>([]);
  const canvasSizeRef = useRef({ w: OUTPUT_SIZE, h: OUTPUT_SIZE });

  const videoRafRef = useRef<number>(0);
  const frameIdxRef = useRef(0);
  const videoPlayingRef = useRef(false);
  const lastFrameTimeRef = useRef(0);

  const paramsRef = useRef<DitherParams>(DEFAULT_PARAMS);
  const asciiParamsRef = useRef<AsciiParams>(DEFAULT_ASCII_PARAMS);

  const [tab, setTab] = useState<Tab>("studio");
  const [mode, setMode] = useState<Mode>("image");
  const [videoRender, setVideoRender] = useState<VideoRender>("dither");
  const [detectedType, setDetectedType] = useState<DetectedType>(null);
  const videoRenderRef = useRef<VideoRender>("dither");
  const [params, setParams] = useState<DitherParams>(DEFAULT_PARAMS);
  const [asciiParams, setAsciiParams] = useState<AsciiParams>(DEFAULT_ASCII_PARAMS);
  const [dots, setDots] = useState<DotCoord[]>([]);
  const dotsRef = useRef<DotCoord[]>([]);
  const [dotCount, setDotCount] = useState(0);
  const [hasMedia, setHasMedia] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [rendering, setRendering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<"json" | "code" | "ascii" | "react" | null>(null);
  const [codeModal, setCodeModal] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: OUTPUT_SIZE, h: OUTPUT_SIZE });
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoFrameCount, setVideoFrameCount] = useState(0);
  const [videoCurrentFrame, setVideoCurFrame] = useState(0);
  const [videoFps, setVideoFps] = useState(24);
  const [progressLabel, setProgressLabel] = useState("");
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [exportingWebM, setExportingWebM] = useState(false);
  const [bgEraseEnabled, setBgEraseEnabled] = useState(false);
  const bgEraseRef = useRef(false);
  const [scale, setScale] = useState(1.0);
  const scaleRef = useRef(1.0);
  const debouncedScale = useDebounce(scale, 100);

  const compareCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingSplitRef = useRef(false);
  type Effect = "repel" | "attract" | "wave" | "noise" | "vortex" | "breathe";
  const [effect, setEffect] = useState<Effect>("repel");
  const effectRef = useRef<Effect>("repel");
  useEffect(() => { effectRef.current = effect; }, [effect]);

  const isVideo = mode === "video";
  const isAscii = mode === "ascii" || (isVideo && videoRender === "ascii");
  const showDots = mode === "image" || (isVideo && videoRender === "dither");
  const canBg = bgEraseEnabled ? "transparent" : (isAscii ? asciiParams.bgColor : (hasMedia ? params.bgColor : "#0f172a"));
  const isLoading = isExtracting || isProcessing;

  useEffect(() => { videoRenderRef.current = videoRender; }, [videoRender]);

  useEffect(() => {
    fetch("https://api.github.com/repos/prasanjit-dey-ux/ditherit")
      .then(r => r.json())
      .then(d => { if (typeof d.stargazers_count === "number") setGithubStars(d.stargazers_count); })
      .catch(() => { });
  }, []);

  const repaintDither = useCallback((frameDots: DotCoord[], p: DitherParams) => {
    const canvas = studioCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    drawDots(ctx, frameDots, p, canvas.width, canvas.height, bgEraseRef.current);
  }, []);

  const repaintAscii = useCallback((cells: AsciiCell[], ap: AsciiParams) => {
    const canvas = studioCanvasRef.current; if (!canvas) return;
    const { w, h } = canvasSizeRef.current;
    renderAsciiToCanvas(canvas, cells, { ...ap, transparentBg: bgEraseRef.current }, w, h);
  }, []);

  const workerRef = useRef<Worker | null>(null);
  const renderImageDither = useCallback(async (img: HTMLImageElement, p: DitherParams) => {
    if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null; }
    setRendering(true);
    const sc = scaleRef.current;
    const srcW = Math.max(1, Math.round(img.naturalWidth * sc));
    const srcH = Math.max(1, Math.round(img.naturalHeight * sc));
    const { cw, ch } = computeDims(srcW, srcH);
    const canvas = studioCanvasRef.current!;
    canvas.width = cw; canvas.height = ch;
    canvasSizeRef.current = { w: cw, h: ch }; setCanvasSize({ w: cw, h: ch });

    const off = document.createElement("canvas");
    off.width = srcW; off.height = srcH;
    const offCtx = off.getContext("2d", { willReadFrequently: true })!;
    offCtx.clearRect(0, 0, srcW, srcH);
    offCtx.drawImage(img, 0, 0, srcW, srcH);
    const imageData = offCtx.getImageData(0, 0, srcW, srcH);
    imageDataRef.current = imageData;

    const worker = new Worker(new URL("../../lib/ditherit/dither.worker.ts", import.meta.url));
    workerRef.current = worker;

    const newDots: DotCoord[] = await new Promise((res, rej) => {
      worker.onmessage = e => { res(e.data.dots); worker.terminate(); workerRef.current = null; };
      worker.onerror = e => { rej(e); worker.terminate(); workerRef.current = null; };
      worker.postMessage({ imageData, params: p, outputWidth: cw, outputHeight: ch, frameIndex: 0 });
    });

    dotsRef.current = newDots;
    setDots(newDots); setDotCount(newDots.length);
    repaintDither(newDots, p);
    setRendering(false);
  }, [repaintDither]);

  const renderImageAscii = useCallback((img: HTMLImageElement, ap: AsciiParams, transparent?: boolean) => {
    setRendering(true);
    const transparentBg = transparent !== undefined ? transparent : bgEraseRef.current;
    const sc = scaleRef.current;
    const srcW = Math.max(1, Math.round(img.naturalWidth * sc));
    const srcH = Math.max(1, Math.round(img.naturalHeight * sc));
    const { cw, ch } = computeDims(srcW, srcH);
    const canvas = studioCanvasRef.current!;
    canvas.width = cw; canvas.height = ch;
    canvasSizeRef.current = { w: cw, h: ch }; setCanvasSize({ w: cw, h: ch });
    const off = document.createElement("canvas");
    off.width = srcW; off.height = srcH;
    const offCtx2 = off.getContext("2d", { willReadFrequently: true })!;
    offCtx2.clearRect(0, 0, srcW, srcH);
    offCtx2.drawImage(img, 0, 0, srcW, srcH);
    const imageData = offCtx2.getImageData(0, 0, srcW, srcH);
    const cells = imageDataToAscii(imageData, ap, cw, ch);
    renderAsciiToCanvas(canvas, cells, { ...ap, transparentBg }, cw, ch);
    setRendering(false);
  }, []);

  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMediaRef = useRef(false);
  const isVideoRef = useRef(false);
  const modeRef = useRef<Mode>("image");
  const isReprocessingRef = useRef(false);
  const erasedFramesRef = useRef<ImageData[]>([]);
  const isErasingBgRef = useRef(false);

  const getActiveFrames = useCallback(() => {
    return bgEraseRef.current && erasedFramesRef.current.length === rawFramesRef.current.length
      ? erasedFramesRef.current
      : rawFramesRef.current;
  }, []);

  useEffect(() => { hasMediaRef.current = hasMedia; }, [hasMedia]);
  useEffect(() => { isVideoRef.current = isVideo; }, [isVideo]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const reprocessDitherFrames = useCallback(async (p: DitherParams) => {
    if (isReprocessingRef.current) return;
    isReprocessingRef.current = true;
    const frames = getActiveFrames();
    if (!frames.length) { isReprocessingRef.current = false; return; }
    const { w: width, h: height } = canvasSizeRef.current;
    const dFrames: DotCoord[][] = [];
    for (let i = 0; i < frames.length; i++) {
      dFrames.push(ditherImage(frames[i], p, width, height));
      if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
    }
    ditherFramesRef.current = dFrames;
    dotsRef.current = dFrames[0] ?? [];
    setDots(dFrames[0] ?? []); setDotCount((dFrames[0] ?? []).length);
    const idx = frameIdxRef.current;
    const f = dFrames[idx] ?? dFrames[0];
    if (f) repaintDither(f, p);
    isReprocessingRef.current = false;
  }, [repaintDither]);

  const reprocessAsciiFrames = useCallback(async (ap: AsciiParams) => {
    if (isReprocessingRef.current) return;
    isReprocessingRef.current = true;
    const frames = getActiveFrames();
    if (!frames.length) { isReprocessingRef.current = false; return; }
    const { w: width, h: height } = canvasSizeRef.current;
    const aFrames: AsciiCell[][] = [];
    for (let i = 0; i < frames.length; i++) {
      aFrames.push(imageDataToAscii(frames[i], ap, width, height));
      if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
    }
    asciiFramesRef.current = aFrames;
    const idx = frameIdxRef.current;
    const f = aFrames[idx] ?? aFrames[0];
    if (f) repaintAscii(f, ap);
    isReprocessingRef.current = false;
  }, [repaintAscii]);

  const triggerRender = useCallback((p: DitherParams, prev: DitherParams) => {
    if (!hasMediaRef.current || isVideoRef.current || modeRef.current !== "image" || !imageRef.current) return;
    const changed = (Object.keys(p) as (keyof DitherParams)[]).filter(k => p[k] !== prev[k]);
    if (changed.length === 0) return;
    const onlyPaint = changed.every(k => PAINT_ONLY_DITHER.has(k));
    if (onlyPaint && dotsRef.current.length > 0) {
      repaintDither(dotsRef.current, p);
    } else {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        renderImageDither(imageRef.current!, paramsRef.current);
      }, 80);
    }
  }, [repaintDither, renderImageDither]);

  const triggerAsciiRender = useCallback((ap: AsciiParams, prev: AsciiParams) => {
    if (!hasMediaRef.current || isVideoRef.current || modeRef.current !== "ascii" || !imageRef.current) return;
    const changed = (Object.keys(ap) as (keyof AsciiParams)[]).filter(k => ap[k] !== prev[k]);
    if (changed.length === 0) return;
    const onlyPaint = changed.every(k => PAINT_ONLY_ASCII.has(k));
    if (onlyPaint) {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      renderImageAscii(imageRef.current!, ap);
    } else {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        renderImageAscii(imageRef.current!, asciiParamsRef.current);
      }, 80);
    }
  }, [renderImageAscii]);

  const prevParamsRef = useRef<DitherParams>(DEFAULT_PARAMS);
  const prevAsciiParamsRef = useRef<AsciiParams>(DEFAULT_ASCII_PARAMS);

  const setParamLive = useCallback(<K extends keyof DitherParams>(k: K, v: DitherParams[K]) => {
    setParams(p => {
      const n = { ...p, [k]: v };
      paramsRef.current = n;
      if (isVideoRef.current && hasMediaRef.current) {
        const changed = (Object.keys(n) as (keyof DitherParams)[]).filter(key => n[key] !== p[key]);
        if (changed.every(key => PAINT_ONLY_DITHER.has(key))) {
          const idx = frameIdxRef.current;
          const f = ditherFramesRef.current[idx];
          if (f) repaintDither(f, n);
        } else {
          reprocessDitherFrames(n);
        }
      } else {
        triggerRender(n, prevParamsRef.current);
      }
      prevParamsRef.current = n;
      return n;
    });
  }, [triggerRender, repaintDither, reprocessDitherFrames]);

  const setAsciiParamLive = useCallback(<K extends keyof AsciiParams>(k: K, v: AsciiParams[K]) => {
    setAsciiParams(p => {
      const n = { ...p, [k]: v };
      asciiParamsRef.current = n;
      if (isVideoRef.current && hasMediaRef.current && videoRenderRef.current === "ascii") {
        const changed = (Object.keys(n) as (keyof AsciiParams)[]).filter(key => n[key] !== p[key]);
        if (changed.every(key => PAINT_ONLY_ASCII.has(key))) {
          const idx = frameIdxRef.current;
          const f = asciiFramesRef.current[idx];
          if (f) repaintAscii(f, n);
        } else {
          reprocessAsciiFrames(n);
        }
      } else {
        triggerAsciiRender(n, prevAsciiParamsRef.current);
      }
      prevAsciiParamsRef.current = n;
      return n;
    });
  }, [triggerAsciiRender, repaintAscii, reprocessAsciiFrames]);

  useEffect(() => {
    if (!hasMedia || !isVideo || videoPlaying) return;
    const idx = frameIdxRef.current;
    if (videoRender === "dither") { const f = ditherFramesRef.current[idx]; if (f) repaintDither(f, params); }
    else { const f = asciiFramesRef.current[idx]; if (f) repaintAscii(f, asciiParams); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRender, params.bgColor, params.dotColor, asciiParams.bgColor, asciiParams.fgColor, asciiParams.colored, asciiParams.glow, asciiParams.glowColor, asciiParams.glowRadius]);

  const applyBgErase = useCallback((img: HTMLImageElement, enabled: boolean): Promise<HTMLImageElement> => {
    if (!enabled) return Promise.resolve(img);
    const off = document.createElement("canvas");
    off.width = img.width; off.height = img.height;
    const ctx = off.getContext("2d", { willReadFrequently: true })!;
    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const erased = removeBackground(imageData);
    ctx.putImageData(erased, 0, 0);
    return new Promise<HTMLImageElement>((resolve) => {
      const result = new Image();
      result.onload = () => resolve(result);
      result.src = off.toDataURL();
    });
  }, []);

  useEffect(() => {
    bgEraseRef.current = bgEraseEnabled;
    if (!hasMedia) return;

    if (isVideoRef.current) {
      if (bgEraseEnabled && erasedFramesRef.current.length === 0 && rawFramesRef.current.length > 0 && !isErasingBgRef.current) {
        isErasingBgRef.current = true;
        setIsProcessing(true);
        (async () => {
          const frames = rawFramesRef.current;
          const activeFrames: ImageData[] = [];
          for (let i = 0; i < frames.length; i++) {
            setProgressLabel(`Removing Background ${i + 1}/${frames.length}`);
            setVideoProgress(i / frames.length);
            activeFrames.push(removeBackground(frames[i]));
            if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
          }
          erasedFramesRef.current = activeFrames;
          isErasingBgRef.current = false;

          setProgressLabel("Updating Video Frames…");
          await reprocessDitherFrames(paramsRef.current);
          await reprocessAsciiFrames(asciiParamsRef.current);
          setIsProcessing(false);
        })();
        return;
      }

      (async () => {
        setIsProcessing(true);
        setProgressLabel("Updating Video Frames…");
        await reprocessDitherFrames(paramsRef.current);
        await reprocessAsciiFrames(asciiParamsRef.current);
        setIsProcessing(false);
      })();
      return;
    }
    const orig = originalImageRef.current;
    if (!orig) return;
    applyBgErase(orig, bgEraseEnabled).then((processed) => {
      imageRef.current = processed;
      if (modeRef.current === "ascii") renderImageAscii(processed, asciiParamsRef.current, bgEraseEnabled);
      else renderImageDither(processed, paramsRef.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgEraseEnabled]);

  useEffect(() => { scaleRef.current = scale; }, [scale]);

  useEffect(() => {
    if (!hasMedia || isVideoRef.current) return;
    const img = imageRef.current;
    if (!img) return;
    if (modeRef.current === "ascii") renderImageAscii(img, asciiParamsRef.current);
    else renderImageDither(img, paramsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedScale]);

  const loadImage = useCallback((file: File) => {
    setMode("image"); setMediaName(file.name);
    setDetectedType(detectFileType(file));
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      applyBgErase(img, bgEraseEnabled).then((processed) => {
        imageRef.current = processed; setHasMedia(true); renderImageDither(processed, paramsRef.current);
      });
    };
    img.src = URL.createObjectURL(file);
  }, [renderImageDither, applyBgErase, bgEraseEnabled]);

  const loadAsciiImage = useCallback((file: File) => {
    setMode("ascii"); setMediaName(file.name);
    setDetectedType(detectFileType(file));
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      applyBgErase(img, bgEraseEnabled).then((processed) => {
        imageRef.current = processed; setHasMedia(true);
        renderImageAscii(processed, asciiParamsRef.current, bgEraseEnabled);
      });
    };
    img.src = URL.createObjectURL(file);
  }, [renderImageAscii, applyBgErase, bgEraseEnabled]);

  const loadVideo = useCallback(async (file: File) => {
    setMode("video"); setMediaName(file.name);
    setDetectedType(detectFileType(file));
    setHasMedia(false); setIsExtracting(true);
    setVideoProgress(0); setProgressLabel("Reading video…");
    ditherFramesRef.current = []; asciiFramesRef.current = []; rawFramesRef.current = [];
    frameIdxRef.current = 0; setVideoCurFrame(0);
    setVideoPlaying(false); videoPlayingRef.current = false;
    try {
      const { frames, width, height } = await extractVideoFrames(
        file, videoFps, OUTPUT_SIZE, MAX_VIDEO_FRAMES,
        (ratio, label) => { setVideoProgress(ratio * 0.35); setProgressLabel(label); }
      );
      rawFramesRef.current = frames;
      erasedFramesRef.current = [];
      const canvas = studioCanvasRef.current!;
      canvas.width = width; canvas.height = height;
      canvasSizeRef.current = { w: width, h: height }; setCanvasSize({ w: width, h: height });
      setIsExtracting(false); setIsProcessing(true);

      const p = paramsRef.current;
      const ap = asciiParamsRef.current;

      const activeFrames: ImageData[] = [];
      if (bgEraseRef.current) {
        for (let i = 0; i < frames.length; i++) {
          setProgressLabel(`Removing Background ${i + 1}/${frames.length}`);
          setVideoProgress(i / frames.length);
          activeFrames.push(removeBackground(frames[i]));
          if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }
        erasedFramesRef.current = activeFrames;
      } else {
        activeFrames.push(...frames);
      }

      const dFrames: DotCoord[][] = [];
      for (let i = 0; i < activeFrames.length; i++) {
        setProgressLabel(`Dithering ${i + 1}/${activeFrames.length}`);
        setVideoProgress(0.35 + (i / activeFrames.length) * 0.35);
        dFrames.push(ditherImage(activeFrames[i], p, width, height));
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
      ditherFramesRef.current = dFrames;

      const aFrames: AsciiCell[][] = [];
      for (let i = 0; i < activeFrames.length; i++) {
        setProgressLabel(`ASCII ${i + 1}/${activeFrames.length}`);
        setVideoProgress(0.70 + (i / activeFrames.length) * 0.30);
        aFrames.push(imageDataToAscii(activeFrames[i], ap, width, height));
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
      asciiFramesRef.current = aFrames;

      setVideoFrameCount(frames.length);
      dotsRef.current = dFrames[0] ?? [];
      setDots(dFrames[0] ?? []); setDotCount((dFrames[0] ?? []).length);
      const vr = videoRender;
      if (vr === "dither") repaintDither(dFrames[0] ?? [], p);
      else repaintAscii(aFrames[0] ?? [], ap);
      setHasMedia(true); setIsProcessing(false);
    } catch (e) {
      console.error("Video error:", e);
      setIsExtracting(false); setIsProcessing(false);
      setProgressLabel("Error — " + (e as Error).message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoFps, videoRender, repaintDither, repaintAscii]);

  const loadGif = useCallback(async (file: File) => {
    setMode("video"); setMediaName(file.name);
    setDetectedType(detectFileType(file));
    setHasMedia(false); setIsExtracting(true);
    setVideoProgress(0); setProgressLabel("Decoding GIF…");
    ditherFramesRef.current = []; asciiFramesRef.current = []; rawFramesRef.current = [];
    frameIdxRef.current = 0; setVideoCurFrame(0);
    setVideoPlaying(false); videoPlayingRef.current = false;
    try {
      const { frames, fps: gifFps, width, height } = await decodeGif(
        file,
        (ratio, label) => { setVideoProgress(ratio * 0.35); setProgressLabel(label); }
      );
      rawFramesRef.current = frames;
      erasedFramesRef.current = [];
      const canvas = studioCanvasRef.current!;
      canvas.width = width; canvas.height = height;
      canvasSizeRef.current = { w: width, h: height }; setCanvasSize({ w: width, h: height });
      setVideoFps(gifFps);
      setIsExtracting(false); setIsProcessing(true);
      const p = paramsRef.current; const ap = asciiParamsRef.current;

      const activeFrames: ImageData[] = [];
      if (bgEraseRef.current) {
        for (let i = 0; i < frames.length; i++) {
          setProgressLabel(`Removing Background ${i + 1}/${frames.length}`);
          setVideoProgress(i / frames.length);
          activeFrames.push(removeBackground(frames[i]));
          if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }
        erasedFramesRef.current = activeFrames;
      } else {
        activeFrames.push(...frames);
      }

      const dFrames: DotCoord[][] = [];
      for (let i = 0; i < activeFrames.length; i++) {
        setProgressLabel(`Dithering ${i + 1}/${activeFrames.length}`); setVideoProgress(0.35 + (i / activeFrames.length) * 0.35);
        dFrames.push(ditherImage(activeFrames[i], p, width, height));
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
      ditherFramesRef.current = dFrames;
      const aFrames: AsciiCell[][] = [];
      for (let i = 0; i < activeFrames.length; i++) {
        setProgressLabel(`ASCII ${i + 1}/${activeFrames.length}`); setVideoProgress(0.70 + (i / activeFrames.length) * 0.30);
        aFrames.push(imageDataToAscii(activeFrames[i], ap, width, height));
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
      asciiFramesRef.current = aFrames;
      setVideoFrameCount(frames.length);
      dotsRef.current = dFrames[0] ?? [];
      setDots(dFrames[0] ?? []); setDotCount((dFrames[0] ?? []).length);
      const vr = videoRenderRef.current;
      if (vr === "dither") repaintDither(dFrames[0] ?? [], p);
      else repaintAscii(aFrames[0] ?? [], ap);
      setHasMedia(true); setIsProcessing(false);
    } catch (e) {
      console.error("GIF error:", e);
      setIsExtracting(false); setIsProcessing(false);
      setProgressLabel("Error — " + (e as Error).message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repaintDither]);

  const handleFile = useCallback((file: File) => {
    const t = file.type;
    if (t === "image/gif") {
      loadGif(file);
    } else if (t.startsWith("video/")) {
      loadVideo(file);
    } else if (t.startsWith("image/")) {
      videoRenderRef.current === "ascii" || modeRef.current === "ascii"
        ? loadAsciiImage(file)
        : loadImage(file);
    }
  }, [loadImage, loadAsciiImage, loadVideo, loadGif]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("video") !== -1) {
          const file = items[i].getAsFile();
          if (file) { handleFile(file); break; }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  useEffect(() => {
    const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget || (e.relatedTarget as HTMLElement).nodeName === "HTML") setDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault(); setDragging(false);
      const f = e.dataTransfer?.files[0]; if (f) handleFile(f);
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [handleFile]);

  /* ── Video playback loop ── */
  useEffect(() => {
    if (!isVideo || !hasMedia) return;
    if (!videoPlaying) {
      const idx = frameIdxRef.current;
      if (videoRender === "dither") { const f = ditherFramesRef.current[idx]; if (f) repaintDither(f, paramsRef.current); }
      else { const f = asciiFramesRef.current[idx]; if (f) repaintAscii(f, asciiParamsRef.current); }
      return;
    }
    const interval = 1000 / videoFps;
    const loop = (time: number) => {
      if (!videoPlayingRef.current) return;
      if (time - lastFrameTimeRef.current >= interval) {
        lastFrameTimeRef.current = time;
        const total = videoRender === "dither" ? ditherFramesRef.current.length : asciiFramesRef.current.length;
        if (!total) return;
        frameIdxRef.current = (frameIdxRef.current + 1) % total;
        setVideoCurFrame(frameIdxRef.current);
        if (videoRender === "dither") { const f = ditherFramesRef.current[frameIdxRef.current]; if (f) repaintDither(f, paramsRef.current); }
        else { const f = asciiFramesRef.current[frameIdxRef.current]; if (f) repaintAscii(f, asciiParamsRef.current); }
      }
      videoRafRef.current = requestAnimationFrame(loop);
    };
    videoRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(videoRafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPlaying, videoRender, hasMedia, videoFps]);

  /* ── Preview: spring physics ── */
  useEffect(() => {
    if (tab !== "preview" || !hasMedia || isAscii) return;
    const canvas = previewCanvasRef.current; if (!canvas) return;
    const { w, h } = canvasSizeRef.current;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const SPRING = 0.12, DAMPING = 0.78;
    const interval = 1000 / videoFps;
    let fidx = 0, lastFrameT = 0, prevTime = 0, t = 0;
    const initDots = isVideo ? (ditherFramesRef.current[0] ?? []) : dotsRef.current;
    previewDotsRef.current = initDots.map(d => ({ ...d, ox: d.x, oy: d.y, tx: d.x, ty: d.y, vx: 0, vy: 0 }));
    const noise2 = (x: number, y: number) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };
    const loop = (time: number) => {
      const dt = Math.min((time - prevTime) / 16.67, 2); prevTime = time; t += 0.016 * dt;
      const mouse = mouseRef.current; const p = paramsRef.current;
      const eff = effectRef.current;
      if (isVideo && ditherFramesRef.current.length > 1 && time - lastFrameT >= interval) {
        lastFrameT = time; fidx = (fidx + 1) % ditherFramesRef.current.length;
        const next = ditherFramesRef.current[fidx]; const prev = previewDotsRef.current;
        const len = Math.min(prev.length, next.length);
        for (let i = 0; i < len; i++) {
          prev[i].tx = next[i].x; prev[i].ty = next[i].y; prev[i].r = next[i].r;
          if (next[i].cr !== undefined) { prev[i].cr = next[i].cr; prev[i].cg = next[i].cg; prev[i].cb = next[i].cb; }
        }
        if (next.length > prev.length)
          for (let i = prev.length; i < next.length; i++)
            prev.push({ ...next[i], ox: next[i].x, oy: next[i].y, tx: next[i].x, ty: next[i].y, vx: 0, vy: 0 });
        previewDotsRef.current = prev.slice(0, next.length);
      }
      for (const d of previewDotsRef.current) {
        d.ox += (d.tx - d.ox) * 0.18 * dt; d.oy += (d.ty - d.oy) * 0.18 * dt;
        const sx = (d.ox - d.x) * SPRING * dt, sy = (d.oy - d.y) * SPRING * dt;
        let fx = sx, fy = sy;
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (eff === "repel") {
          if (dist < p.repelRadius && dist > 0.5) {
            const tt = 1 - dist / p.repelRadius, force = tt * tt * tt * p.repelStrength;
            fx += (dx / dist) * force * dt; fy += (dy / dist) * force * dt;
          }
        } else if (eff === "attract") {
          if (dist < p.repelRadius && dist > 0.5) {
            const tt = 1 - dist / p.repelRadius, force = tt * tt * tt * p.repelStrength;
            fx -= (dx / dist) * force * dt; fy -= (dy / dist) * force * dt;
          }
        } else if (eff === "wave") {
          const amp = p.repelStrength * 0.4;
          const lambda = Math.max(w, h) * 0.15;
          d.x = d.ox + Math.sin(d.oy / lambda + t * 2.5) * amp;
          d.y = d.oy + Math.sin(d.ox / lambda + t * 2.5 + Math.PI * 0.5) * amp;
          d.vx = 0; d.vy = 0; continue;
        } else if (eff === "noise") {
          const scale = 0.008, speed = 1.2;
          const angle = noise2(d.ox * scale + t * speed, d.oy * scale) * Math.PI * 4;
          const force = p.repelStrength * 0.08 * dt;
          fx += Math.cos(angle) * force; fy += Math.sin(angle) * force;
        } else if (eff === "vortex") {
          if (dist < p.repelRadius && dist > 0.5) {
            const tt = 1 - dist / p.repelRadius, force = tt * tt * p.repelStrength * 0.6 * dt;
            fx += (-dy / dist) * force; fy += (dx / dist) * force;
          }
        } else if (eff === "breathe") {
          const amp = p.repelStrength * 0.35;
          const phase = t * 1.8;
          d.x = d.ox + Math.sin(phase + d.oy * 0.012) * amp;
          d.y = d.oy + Math.cos(phase + d.ox * 0.012) * amp;
          d.vx = 0; d.vy = 0; continue;
        }
        d.vx = (d.vx + fx) * Math.pow(DAMPING, dt); d.vy = (d.vy + fy) * Math.pow(DAMPING, dt);
        d.x += d.vx; d.y += d.vy;
      }
      drawDots(ctx, previewDotsRef.current, p, w, h);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, mode, videoRender, hasMedia, canvasSize]);

  /* ── Preview: ASCII transform effects ── */
  useEffect(() => {
    if (tab !== "preview" || !hasMedia || !isAscii) return;
    const canvas = previewCanvasRef.current; if (!canvas) return;
    const { w, h } = canvasSizeRef.current; canvas.width = w; canvas.height = h;
    const ap = asciiParamsRef.current; const interval = 1000 / videoFps;
    let fidx = 0, lastT = 0, t = 0, prevTime = 0;
    if (mode === "ascii" && imageRef.current) renderImageAscii(imageRef.current, ap, bgEraseRef.current);
    else { const f = asciiFramesRef.current[0]; if (f) renderAsciiToCanvas(canvas, f, { ...ap, transparentBg: bgEraseRef.current }, w, h); }
    const loop = (time: number) => {
      const dt = Math.min((time - prevTime) / 16.67, 2); prevTime = time; t += 0.016 * dt;
      if (isVideo && asciiFramesRef.current.length > 1 && time - lastT >= interval) {
        lastT = time; fidx = (fidx + 1) % asciiFramesRef.current.length;
        const f = asciiFramesRef.current[fidx];
        if (f) renderAsciiToCanvas(canvas, f, { ...asciiParamsRef.current, transparentBg: bgEraseRef.current }, w, h);
      } else if (!isVideo) {
        const f = asciiFramesRef.current[0];
        if (f) renderAsciiToCanvas(canvas, f, { ...asciiParamsRef.current, transparentBg: bgEraseRef.current }, w, h);
      }

      const eff = effectRef.current;
      const mouse = mouseRef.current;
      const amp = 6;
      if (eff === "wave") {
        canvas.style.transform = `translate(${Math.sin(t * 2.5) * amp}px, ${Math.cos(t * 1.8) * amp * 0.6}px)`;
      } else if (eff === "breathe") {
        const s = 1 + Math.sin(t * 1.8) * 0.015;
        canvas.style.transform = `scale(${s})`;
      } else if (eff === "noise") {
        const nx = Math.sin(t * 7.3) * amp * 0.5, ny = Math.cos(t * 5.7) * amp * 0.5;
        canvas.style.transform = `translate(${nx}px,${ny}px)`;
      } else if (eff === "vortex" || eff === "repel" || eff === "attract") {
        const cx = w / 2, cy = h / 2;
        const dx = (mouse.x - cx) / cx, dy = (mouse.y - cy) / cy;
        const sign = eff === "attract" ? -1 : 1;
        canvas.style.transform = `rotate(${dx * dy * sign * 1.2}deg) translate(${dx * sign * amp * 0.4}px,${dy * sign * amp * 0.4}px)`;
      } else {
        canvas.style.transform = "";
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); canvas.style.transform = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, mode, videoRender, hasMedia, canvasSize]);

  const handlePreviewMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) * ((previewCanvasRef.current?.width ?? 1) / rect.width),
      y: (e.clientY - rect.top) * ((previewCanvasRef.current?.height ?? 1) / rect.height),
    };
  }, []);

  const togglePlay = useCallback(() => {
    const next = !videoPlaying; videoPlayingRef.current = next; setVideoPlaying(next);
  }, [videoPlaying]);

  /* ── Exports ── */
  const exportJSON = useCallback(() => {
    const clean = (d: DotCoord) => ({ x: Math.round(d.x), y: Math.round(d.y), r: +d.r.toFixed(2), ...(d.cr !== undefined ? { cr: d.cr, cg: d.cg, cb: d.cb } : {}) });
    const data = isVideo ? JSON.stringify(ditherFramesRef.current.map(f => f.map(clean)), null, 2) : JSON.stringify(dotsRef.current.map(clean), null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    a.download = `${mediaName.replace(/\.[^.]+$/, "") || "dither"}-dots.json`; a.click();
  }, [mediaName, isVideo]);

  const copyJSON = useCallback(() => {
    const clean = (d: DotCoord) => ({ x: Math.round(d.x), y: Math.round(d.y), r: +d.r.toFixed(2), ...(d.cr !== undefined ? { cr: d.cr, cg: d.cg, cb: d.cb } : {}) });
    navigator.clipboard.writeText(JSON.stringify(dotsRef.current.map(clean)));
    setCopied("json"); setTimeout(() => setCopied(null), 2000);
  }, []);

  const copyCode = useCallback(() => {
    const p = paramsRef.current;
    navigator.clipboard.writeText(generateInteractionCode(dotsRef.current, p.repelRadius, p.repelStrength, bgEraseRef.current));
    setCopied("code"); setTimeout(() => setCopied(null), 2000);
  }, []);

  const copyAsciiCode = useCallback(() => {
    const frames = asciiFramesRef.current; if (!frames.length) return;
    navigator.clipboard.writeText(generateAsciiVideoCode(frames, videoFps, canvasSizeRef.current.w, canvasSizeRef.current.h, asciiParamsRef.current));
    setCopied("ascii"); setTimeout(() => setCopied(null), 2000);
  }, [videoFps]);

  const exportPNG = useCallback(() => {
    if (!hasMedia) return;
    const { w, h } = canvasSizeRef.current;
    const exportW = paramsRef.current.exportWidth || w;
    const exportH = paramsRef.current.exportHeight || h;
    const transparent = bgEraseRef.current;

    const out = document.createElement("canvas");
    out.width = exportW; out.height = exportH;
    const ctx = out.getContext("2d")!;

    if (modeRef.current === "ascii" || (modeRef.current === "video" && videoRenderRef.current === "ascii")) {
      const cells = modeRef.current === "video"
        ? (asciiFramesRef.current[frameIdxRef.current] ?? asciiFramesRef.current[0] ?? [])
        : (() => {
          const img = imageRef.current; if (!img) return [];
          const off = document.createElement("canvas");
          off.width = img.width; off.height = img.height;
          const offCtx = off.getContext("2d", { willReadFrequently: true })!;
          offCtx.clearRect(0, 0, img.width, img.height);
          offCtx.drawImage(img, 0, 0);
          return imageDataToAscii(offCtx.getImageData(0, 0, img.width, img.height), asciiParamsRef.current, exportW, exportH);
        })();
      renderAsciiToCanvas(out, cells, { ...asciiParamsRef.current, transparentBg: transparent }, exportW, exportH);
    } else {
      const dots = modeRef.current === "video"
        ? (ditherFramesRef.current[frameIdxRef.current] ?? ditherFramesRef.current[0] ?? [])
        : dotsRef.current;
      const scaleX = exportW / w, scaleY = exportH / h;
      const scaledDots = (scaleX !== 1 || scaleY !== 1)
        ? dots.map(d => ({ ...d, x: d.x * scaleX, y: d.y * scaleY }))
        : dots;
      drawDots(ctx, scaledDots, paramsRef.current, exportW, exportH, transparent);
    }

    out.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${mediaName.replace(/\.[^.]+$/, "") || "dither"}.png`; a.click();
    }, "image/png");
  }, [mediaName, hasMedia]);

  const exportSVG = useCallback(() => {
    const d = dotsRef.current; if (!d.length) return;
    const { w, h } = canvasSizeRef.current;
    const svg = dotsToSVG(d, w, h, paramsRef.current.dotColor, paramsRef.current.bgColor);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = `${mediaName.replace(/\.[^.]+$/, "") || "dither"}.svg`; a.click();
  }, [mediaName]);

  const showReactCode = useCallback(() => {
    setCodeModal(generateReactCode(paramsRef.current, asciiParamsRef.current as unknown as Record<string, unknown>, mode, videoRender, bgEraseRef.current));
  }, [mode, videoRender]);

  const exportWebM = useCallback(() => {
    if (!videoFrameCount) return;
    const { w, h } = canvasSizeRef.current;
    const transparent = bgEraseRef.current;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = w; exportCanvas.height = h;
    const exportCtx = exportCanvas.getContext("2d")!;

    const mimeTypes = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    const mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) ?? "video/webm";
    const stream = exportCanvas.captureStream(videoFps);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${mediaName.replace(/\.[^.]+$/, "") || "dither"}.webm`; a.click();
      setExportingWebM(false);
    };

    const isAsciiMode = videoRenderRef.current === "ascii";
    const frameInterval = 1000 / videoFps;
    const totalFrames = isAsciiMode ? asciiFramesRef.current.length : ditherFramesRef.current.length;

    setExportingWebM(true);
    recorder.start(100);

    let fi = 0;
    const renderFrame = () => {
      if (fi >= totalFrames) {
        setTimeout(() => { recorder.stop(); }, 200);
        return;
      }
      if (isAsciiMode) {
        const cells = asciiFramesRef.current[fi] ?? [];
        exportCtx.clearRect(0, 0, w, h);
        renderAsciiToCanvas(exportCanvas, cells, { ...asciiParamsRef.current, transparentBg: transparent }, w, h);
      } else {
        const dots = ditherFramesRef.current[fi] ?? [];
        if (transparent) {
          exportCtx.clearRect(0, 0, w, h);
        }
        drawDots(exportCtx, dots, paramsRef.current, w, h, transparent);
      }
      fi++;
      setTimeout(renderFrame, frameInterval);
    };
    renderFrame();
  }, [videoFps, videoFrameCount, mediaName]);

  useEffect(() => {
    if (!showCompare || !hasMedia) return;
    const canvas = compareCanvasRef.current; if (!canvas) return;
    const { w, h } = canvasSizeRef.current; canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    if (isVideo) {
      const raw = rawFramesRef.current[frameIdxRef.current]; if (raw) ctx.putImageData(raw, 0, 0);
    } else if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, w, h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompare, hasMedia, isVideo, videoCurrentFrame]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[650px] bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden font-sans border-b border-zinc-200 dark:border-zinc-800">

      {/* ═══ TOP BREADCRUMB & HEADER NAV BAR ═══ */}
      <header className="h-11 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2 font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <Link href="/devtools" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition text-zinc-500 dark:text-zinc-400">
            Developer Tools
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
            ditherit (Interactive Studio)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/prasanjit-dey-ux/ditherit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-[11px] font-mono transition"
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>GitHub</span>
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-1 font-bold">MIT</span>
          </a>
        </div>
      </header>

      {/* ═══ MAIN WORKSPACE CONTAINER ═══ */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ═══ LEFT CONTROL SIDEBAR ═══ */}
        <aside className="w-72 sm:w-80 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 overflow-hidden z-20">

          {/* Dither vs ASCII Mode Switcher */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              {(["dither", "ascii"] as VideoRender[]).map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setVideoRender(v);
                    videoRenderRef.current = v;
                    if (!isVideo) {
                      const newMode = v === "ascii" ? "ascii" : "image";
                      setMode(newMode);
                      modeRef.current = newMode;
                      const img = imageRef.current;
                      if (img) {
                        if (v === "ascii") renderImageAscii(img, asciiParamsRef.current, bgEraseEnabled);
                        else renderImageDither(img, paramsRef.current);
                      }
                    }
                  }}
                  className={`py-1.5 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    videoRender === v
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {v === "dither" ? "Dither Dot Art" : "ASCII Art"}
                </button>
              ))}
            </div>

            <button
              onClick={() => setBgEraseEnabled(b => !b)}
              className={`w-full mt-2.5 py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                bgEraseEnabled
                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                  : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <Eraser className="w-3.5 h-3.5" /> {bgEraseEnabled ? "Background Eraser: ON" : "Remove Background"}
            </button>
          </div>

          {/* Scrollable Control Accordions */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800/80 custom-scrollbar">

            {showDots && (<>
              <Section title="Algorithm & Dots">
                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  {ALGORITHMS.map(a => (
                    <button
                      key={a.value}
                      onClick={() => setParamLive("algorithm", a.value)}
                      className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition cursor-pointer text-center ${
                        params.algorithm === a.value
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                <Slider label="Spacing" value={params.scale} min={2} max={20} step={1} onChange={v => setParamLive("scale", v)} unit="px" />
                <Slider label="Min Radius" value={params.dotMinRadius} min={0.3} max={4} step={0.1} decimals={1} onChange={v => setParamLive("dotMinRadius", v)} unit="px" />
                <Slider label="Max Radius" value={params.dotMaxRadius} min={0.5} max={8} step={0.1} decimals={1} onChange={v => setParamLive("dotMaxRadius", v)} unit="px" />
              </Section>

              <Section title="Transform & Zoom">
                <Slider
                  label="Scale Zoom"
                  min={25} max={300} step={5}
                  value={Math.round(scale * 100)}
                  onChange={v => setScale(v / 100)}
                  displayValue={`${Math.round(scale * 100)}%`}
                />
              </Section>

              <Section title="Glyph Overlay" defaultOpen={false}>
                <Toggle label="Enable Glyph Layer" value={params.glyphOverlay} onChange={v => setParamLive("glyphOverlay", v)} />
                {params.glyphOverlay && (<>
                  <Slider label="Glyph Radius" value={params.glyphRadius} min={0.5} max={8} step={0.1} decimals={1} onChange={v => setParamLive("glyphRadius", v)} unit="px" />
                  <Slider label="Glyph Spacing" value={params.glyphSpacing} min={2} max={30} step={1} onChange={v => setParamLive("glyphSpacing", v)} unit="px" />
                  <Toggle label="Sobel Edges Only" value={params.glyphEdgeOnly} onChange={v => setParamLive("glyphEdgeOnly", v)} />
                  {params.glyphEdgeOnly && <Slider label="Edge Threshold" value={params.glyphEdgeThreshold} min={5} max={200} step={1} onChange={v => setParamLive("glyphEdgeThreshold", v)} />}
                </>)}
              </Section>

              <Section title="Tone & Intensity">
                <Slider label="Threshold" value={params.threshold} min={0} max={255} step={1} onChange={v => setParamLive("threshold", v)} />
                <Slider label="Contrast" value={params.contrast} min={-100} max={100} step={1} onChange={v => setParamLive("contrast", v)} />
                <Slider label="Brightness" value={params.brightness} min={-100} max={100} step={1} onChange={v => setParamLive("brightness", v)} />
                <Slider label="Gamma" value={params.gamma} min={0.2} max={3} step={0.05} decimals={2} onChange={v => setParamLive("gamma", v)} />
                <Slider label="Blur" value={params.blur} min={0} max={5} step={0.1} decimals={1} onChange={v => setParamLive("blur", v)} />
                <Slider label="Highlights" value={params.highlightCompression} min={0} max={1} step={0.01} decimals={2} onChange={v => setParamLive("highlightCompression", v)} />
                <Slider label="Error Strength" value={params.errorStrength} min={0} max={1} step={0.01} decimals={2} onChange={v => setParamLive("errorStrength", v)} />
                <Toggle label="Serpentine Path" value={params.serpentine} onChange={v => setParamLive("serpentine", v)} />
                <Toggle label="Invert Values" value={params.invert} onChange={v => setParamLive("invert", v)} />
              </Section>

              <Section title="Colors & Palette">
                <ColorRow label="Background" value={params.bgColor} onChange={v => setParamLive("bgColor", v)} />
                <Toggle label="Source Colors" value={params.useSourceColor} onChange={v => setParamLive("useSourceColor", v)} />
                {!params.useSourceColor && <ColorRow label="Dot Color" value={params.dotColor} onChange={v => setParamLive("dotColor", v)} />}
              </Section>

              <Section title="Color Tint Overlay" defaultOpen={false}>
                <ColorRow label="Tint Color" value={params.overlayColor} onChange={v => setParamLive("overlayColor", v)} />
                <Slider label="Opacity" value={params.overlayOpacity} min={0} max={1} step={0.01} decimals={2} onChange={v => setParamLive("overlayOpacity", v)} />
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Blend Mode</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BLEND_MODES.map(b => (
                      <button
                        key={b.value}
                        onClick={() => setParamLive("blendMode", b.value)}
                        className={`py-1 px-1.5 text-[9px] font-bold rounded-lg border transition cursor-pointer text-center ${
                          params.blendMode === b.value
                            ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Physics Repulsion">
                <Slider label="Radius" value={params.repelRadius} min={20} max={200} step={1} onChange={v => setParamLive("repelRadius", v)} unit="px" />
                <Slider label="Strength" value={params.repelStrength} min={5} max={200} step={1} onChange={v => setParamLive("repelStrength", v)} unit="px" />
              </Section>

              <Section title="Export Resolution" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-2 mb-1.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">WIDTH</span>
                    <input
                      type="number"
                      value={params.exportWidth}
                      min={100} max={4000}
                      onChange={e => {
                        const w = Math.max(100, Math.min(4000, parseInt(e.target.value) || 100));
                        setParamLive("exportWidth", w);
                        if (params.lockAspect && canvasSizeRef.current.w > 0) {
                          setParamLive("exportHeight", Math.round(w * (canvasSizeRef.current.h / canvasSizeRef.current.w)));
                        }
                      }}
                      className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-2 py-1 text-xs font-mono rounded-lg outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">HEIGHT</span>
                    <input
                      type="number"
                      value={params.exportHeight}
                      min={100} max={4000}
                      onChange={e => {
                        const h = Math.max(100, Math.min(4000, parseInt(e.target.value) || 100));
                        setParamLive("exportHeight", h);
                        if (params.lockAspect && canvasSizeRef.current.h > 0) {
                          setParamLive("exportWidth", Math.round(h * (canvasSizeRef.current.w / canvasSizeRef.current.h)));
                        }
                      }}
                      className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-2 py-1 text-xs font-mono rounded-lg outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
                <Toggle label="Lock Aspect" value={params.lockAspect} onChange={v => setParamLive("lockAspect", v)} />
              </Section>
            </>)}

            {(mode === "ascii" || (isVideo && videoRender === "ascii")) && (<>
              <Section title="ASCII Characters">
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {ASCII_CHARSET_OPTS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => setAsciiParamLive("charset", o.value)}
                      className={`py-1.5 px-2 text-[10px] font-mono font-bold rounded-lg border transition cursor-pointer text-center ${
                        asciiParams.charset === o.value
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {asciiParams.charset === "custom" && (
                  <input
                    value={asciiParams.customCharset}
                    onChange={e => setAsciiParamLive("customCharset", e.target.value)}
                    placeholder="@#%+:. "
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 text-xs font-mono rounded-xl outline-none w-full focus:border-zinc-500"
                  />
                )}
              </Section>
              <Section title="Typography">
                <Slider label="Font Size" value={asciiParams.fontSize} min={4} max={24} step={1} onChange={v => setAsciiParamLive("fontSize", v)} unit="px" />
                <Slider label="Char Spacing" value={asciiParams.charSpacing} min={0.4} max={2.0} step={0.05} decimals={2} onChange={v => setAsciiParamLive("charSpacing", v)} unit="×" />
                <Slider label="Line Spacing" value={asciiParams.lineSpacing} min={0.8} max={2.5} step={0.05} decimals={2} onChange={v => setAsciiParamLive("lineSpacing", v)} unit="×" />
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(["monospace", "courier", "consolas"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setAsciiParamLive("fontFamily", f)}
                      className={`py-1 text-[10px] font-bold capitalize rounded-lg border transition cursor-pointer text-center ${
                        asciiParams.fontFamily === f
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                          : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="ASCII Tone">
                <Slider label="Contrast" value={asciiParams.contrast} min={-100} max={100} step={1} onChange={v => setAsciiParamLive("contrast", v)} />
                <Slider label="Brightness" value={asciiParams.brightness} min={-100} max={100} step={1} onChange={v => setAsciiParamLive("brightness", v)} />
                <Slider label="Gamma" value={asciiParams.gamma} min={0.2} max={3} step={0.05} decimals={2} onChange={v => setAsciiParamLive("gamma", v)} />
                <Toggle label="Invert Brightness" value={asciiParams.invertBrightness} onChange={v => setAsciiParamLive("invertBrightness", v)} />
              </Section>
              <Section title="ASCII Palette">
                <Toggle label="Source Colors" value={asciiParams.colored} onChange={v => setAsciiParamLive("colored", v)} />
                {!asciiParams.colored && <ColorRow label="Text Color" value={asciiParams.fgColor} onChange={v => setAsciiParamLive("fgColor", v)} />}
                <ColorRow label="Background" value={asciiParams.bgColor} onChange={v => setAsciiParamLive("bgColor", v)} />
              </Section>
            </>)}

            {isVideo && (
              <Section title="Video Extract Options">
                <Slider label="Target FPS" value={videoFps} min={6} max={60} step={1} onChange={setVideoFps} unit="fps" />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">Re-upload file to apply new frame rate.</p>
              </Section>
            )}
          </div>

          {/* Export Action Buttons */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 flex flex-col gap-2 bg-zinc-50 dark:bg-zinc-900">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportPNG}
                disabled={!hasMedia}
                className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-40 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export PNG
              </button>

              <button
                onClick={showReactCode}
                disabled={!hasMedia}
                className="py-2 px-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 disabled:opacity-40 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" /> React Code
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {showDots && (
                <button
                  onClick={copyCode}
                  disabled={!hasMedia}
                  className="py-1.5 px-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
                >
                  {copied === "code" ? <Check className="w-3 h-3 text-emerald-500" /> : <Code className="w-3 h-3 text-zinc-400" />}
                  {copied === "code" ? "Copied!" : "Copy JS"}
                </button>
              )}

              {showDots && (
                <button
                  onClick={exportSVG}
                  disabled={!hasMedia}
                  className="py-1.5 px-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
                >
                  <Download className="w-3 h-3 text-zinc-400" /> SVG Vector
                </button>
              )}
            </div>

            {videoFrameCount > 0 && (
              <button
                onClick={exportWebM}
                disabled={!hasMedia || exportingWebM}
                className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40"
              >
                <FileVideo className="w-3.5 h-3.5" /> {exportingWebM ? "Recording WebM Clip…" : "Export WebM Video"}
              </button>
            )}
          </div>
        </aside>

        {/* ═══ RIGHT MAIN CANVAS VIEWPORT ═══ */}
        <main className="flex-1 flex flex-col bg-zinc-100 dark:bg-zinc-950 overflow-hidden relative">

          {/* Sub Header Toolbar */}
          <div className="h-11 bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between shrink-0">
            {/* Studio / Preview Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setTab("studio")}
                className={`py-1 px-3 text-xs font-bold rounded-lg transition cursor-pointer ${
                  tab === "studio"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
              >
                Studio Editor
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`py-1 px-3 text-xs font-bold rounded-lg transition cursor-pointer ${
                  tab === "preview"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
              >
                Physics Preview
              </button>
            </div>

            {/* Contextual Toolbar Options */}
            <div className="flex items-center gap-3">
              {isVideo && hasMedia && !isLoading && tab === "studio" && (
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1">
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    Frame <strong className="text-zinc-900 dark:text-zinc-100">{videoCurrentFrame + 1}</strong>/{videoFrameCount}
                  </span>
                  <button
                    onClick={togglePlay}
                    className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    {videoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {videoPlaying ? "Pause" : "Play"}
                  </button>
                </div>
              )}

              {tab === "preview" && hasMedia && (
                <div className="flex items-center gap-1">
                  {(["repel", "attract", "wave", "noise", "vortex", "breathe"] as const).map(e => (
                    <button
                      key={e}
                      onClick={() => setEffect(e)}
                      className={`px-2.5 py-1 text-[11px] font-bold capitalize rounded-lg transition cursor-pointer border ${
                        effect === e
                          ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                          : "bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {hasMedia && (
                <button
                  onClick={() => { setShowCompare(c => !c); if (!showCompare) setTab("studio"); }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    showCompare
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" /> Compare Split
                </button>
              )}
            </div>
          </div>

          {/* Canvas Display Viewport */}
          {showCompare && hasMedia ? (
            /* Split Screen Comparison */
            <div
              className="flex-1 flex overflow-hidden relative select-none"
              onPointerMove={e => {
                if (!isDraggingSplitRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setSplitRatio(Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width)));
              }}
              onPointerUp={() => { isDraggingSplitRef.current = false; }}
            >
              <div style={{ width: `${splitRatio * 100}%` }} className="flex-shrink-0 bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-zinc-900/90 text-zinc-200 border border-zinc-700 px-2 py-0.5 rounded-lg z-10">
                  ORIGINAL SOURCE
                </span>
                <canvas ref={compareCanvasRef} className="max-w-full max-h-full object-contain" />
              </div>

              <div
                onPointerDown={e => { isDraggingSplitRef.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
                className="w-1 bg-zinc-400 dark:bg-zinc-600 cursor-ew-resize flex-shrink-0 z-20 relative group"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                  <Columns2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden relative" style={{ background: canBg }}>
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-zinc-900/90 text-zinc-200 border border-zinc-700 px-2 py-0.5 rounded-lg z-10">
                  DITHERED OUTPUT
                </span>
                <canvas ref={studioCanvasRef} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          ) : (
            /* Single Main Viewport Canvas */
            <div
              className="flex-1 flex items-center justify-center overflow-hidden relative p-4"
              style={{
                background: bgEraseEnabled
                  ? `repeating-conic-gradient(#e2e8f0 0% 25%, #f8fafc 0% 50%) 0 0 / 20px 20px`
                  : canBg
              }}
            >
              <canvas
                ref={studioCanvasRef}
                className={`max-w-full max-h-full object-contain border border-zinc-200/80 dark:border-zinc-800 rounded-lg ${tab === "studio" ? "block" : "hidden"}`}
              />

              <canvas
                ref={previewCanvasRef}
                onMouseMove={handlePreviewMouseMove}
                onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
                onTouchMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  mouseRef.current = {
                    x: (touch.clientX - rect.left) * ((previewCanvasRef.current?.width ?? 1) / rect.width),
                    y: (touch.clientY - rect.top) * ((previewCanvasRef.current?.height ?? 1) / rect.height),
                  };
                }}
                onTouchEnd={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
                className={`max-w-full max-h-full object-contain border border-zinc-200/80 dark:border-zinc-800 rounded-lg ${tab === "preview" ? "block" : "hidden"}`}
                style={{ cursor: !isAscii ? "none" : "default", touchAction: "none" }}
              />

              {!hasMedia && !isLoading && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer gap-4 z-10 transition ${
                    dragging ? "bg-zinc-200/40 dark:bg-zinc-800/40 border-2 border-dashed border-zinc-400 dark:border-zinc-600" : "bg-transparent"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                    {isVideo ? <Film className="w-8 h-8" /> : mode === "ascii" ? <Type className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <div className="text-center space-y-1.5">
                    <h3 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-base sm:text-lg">Drop your image, video, or GIF</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Supports PNG, JPG, WebP, GIF, MP4, WebM, MOV</p>
                    <button className="mt-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-extrabold text-xs rounded-xl inline-flex items-center gap-2 transition pointer-events-none">
                      <Upload className="w-4 h-4" /> Browse Local File
                    </button>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur z-30">
                  <div className="w-64 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-200"
                      style={{ width: `${videoProgress * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">{progressLabel}</span>
                </div>
              )}

              {hasMedia && !isLoading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 px-3.5 py-2 bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl flex items-center gap-2 backdrop-blur transition cursor-pointer z-20"
                >
                  <Upload className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" /> Change Media File
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,image/gif,video/*,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />

      {codeModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setCodeModal(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-base flex items-center gap-2">
                <Code className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> React Component Code
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  onClick={() => { if (codeModal) navigator.clipboard.writeText(codeModal); setCopied("react"); setTimeout(() => setCopied(null), 2000); }}
                >
                  {copied === "react" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === "react" ? "Copied!" : "Copy React Code"}
                </button>
                <button
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
                  onClick={() => setCodeModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap custom-scrollbar">
              {codeModal}
            </pre>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              Requires <strong>ditherit-react</strong> package installed in your React or Next.js project.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
