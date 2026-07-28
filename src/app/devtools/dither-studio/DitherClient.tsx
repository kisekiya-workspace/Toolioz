'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Play,
  Pause,
  Download,
  Video,
  Image as ImageIcon,
  Sliders,
  Palette as PaletteIcon,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldCheck,
  Zap,
  HelpCircle,
  Film,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { RelatedTools } from '@/components/ui/RelatedTools';
import {
  DitherAlgorithm,
  PaletteId,
  ALGORITHM_CATEGORIES,
  PALETTES,
  RGB,
  processDitherImageData,
  hexToRgb,
  rgbToHex,
} from '@/lib/ditherEngine';

type MediaType = 'image' | 'video';

export default function DitherClient() {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('sample-media');

  // Controls state
  const [algorithm, setAlgorithm] = useState<DitherAlgorithm>('floyd-steinberg');
  const [paletteId, setPaletteId] = useState<PaletteId>('gameboy');
  const [customColors, setCustomColors] = useState<string[]>(['#000000', '#ffffff']);
  const [scaleFactor, setScaleFactor] = useState<number>(2);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [diffusionAmount, setDiffusionAmount] = useState<number>(1);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);

  // Video states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);

  // Elements refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const activePalette = useCallback((): RGB[] => {
    if (paletteId === 'custom') {
      return customColors.map(hexToRgb);
    }
    return PALETTES[paletteId].colors;
  }, [paletteId, customColors]);

  // Generate Sample Canvas Pattern if no image loaded
  const generateSampleImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    const radGrad = ctx.createRadialGradient(200, 200, 20, 200, 200, 160);
    radGrad.addColorStop(0, '#ffffff');
    radGrad.addColorStop(0.4, '#f472b6');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(200, 200, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px sans-serif';
    ctx.fillText('DITHER STUDIO', 280, 220);
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#fbcfe8';
    ctx.fillText('Retro 1-Bit & Pixel Art', 285, 255);

    const dataUrl = canvas.toDataURL('image/png');
    setMediaSrc(dataUrl);
    setMediaType('image');
    setFileName('dither-sample-pattern');
  }, []);

  useEffect(() => {
    generateSampleImage();
  }, [generateSampleImage]);

  // Render Dithered Image or Video Frame
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sourceWidth = 0;
    let sourceHeight = 0;
    let sourceElement: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | null = null;

    if (mediaType === 'image' && imageRef.current && imageRef.current.complete) {
      sourceElement = imageRef.current;
      sourceWidth = imageRef.current.naturalWidth || 600;
      sourceHeight = imageRef.current.naturalHeight || 400;
    } else if (mediaType === 'video' && videoRef.current) {
      sourceElement = videoRef.current;
      sourceWidth = videoRef.current.videoWidth || 600;
      sourceHeight = videoRef.current.videoHeight || 400;
    }

    if (!sourceElement || sourceWidth === 0 || sourceHeight === 0) return;

    const scaledWidth = Math.max(16, Math.floor(sourceWidth / scaleFactor));
    const scaledHeight = Math.max(16, Math.floor(sourceHeight / scaleFactor));

    if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
    }

    ctx.drawImage(sourceElement, 0, 0, scaledWidth, scaledHeight);

    if (showOriginal) return;

    const rawData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
    const ditheredData = processDitherImageData(rawData, {
      algorithm,
      palette: activePalette(),
      brightness,
      contrast,
      errorDiffusionAmount: diffusionAmount,
    });

    ctx.putImageData(ditheredData, 0, 0);
  }, [
    mediaType,
    scaleFactor,
    showOriginal,
    algorithm,
    activePalette,
    brightness,
    contrast,
    diffusionAmount,
  ]);

  // Video loop
  useEffect(() => {
    if (mediaType === 'video' && isPlaying) {
      const loop = () => {
        renderFrame();
        animFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      renderFrame();
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mediaType, isPlaying, renderFrame]);

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setFileName(nameWithoutExt);

    if (file.type.startsWith('video/')) {
      setMediaType('video');
      setMediaSrc(url);
      setIsPlaying(false);
    } else {
      setMediaType('image');
      setMediaSrc(url);
      setIsPlaying(false);
    }
  };

  // Image Download
  const downloadImage = (format: 'png' | 'webp' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${fileName}-dithered.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.95);
    link.click();
  };

  // Generate ASCII string
  const getAsciiText = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    const chars = algorithm === 'ascii-blocks' ? [' ', '░', '▒', '▓', '█'] : [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
    
    let asciiStr = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        const charIdx = Math.floor((lum / 255) * (chars.length - 1));
        asciiStr += chars[charIdx];
      }
      asciiStr += '\n';
    }
    return asciiStr;
  }, [algorithm]);

  const copyAsciiText = () => {
    const text = getAsciiText();
    navigator.clipboard.writeText(text);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  // Video Recording Export
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stream = canvas.captureStream(30);
    recordedChunksRef.current = [];

    try {
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      alert('MediaRecorder API not supported for this video format in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Tool Header Section */}
      <header className="bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.06)_0%,transparent_50%)] py-10 text-center md:py-16 border-b border-[var(--border)]">
        <div className="container">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-600" /> 100% In-Browser Canvas Dither Studio
          </div>
          <h1 className="mb-3 text-3xl font-black text-[var(--text-primary)] md:text-5xl">
            Image & Video <span className="text-pink-600">Dither Studio</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-[var(--text-secondary)]">
            Apply Floyd-Steinberg, Bayer matrix, Halftone, Atkinson 1-bit, and ASCII retro dithering algorithms to your images and videos live in your browser.
          </p>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="container section">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Controls Panel (Left Column) - Compact & Dropdown Driven */}
          <div className="lg:col-span-5 bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
            {/* File Upload Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-pink-600" /> Media Source
                </h2>
                <button
                  onClick={generateSampleImage}
                  className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sample Pattern
                </button>
              </div>

              <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-200 hover:border-pink-500 rounded-xl cursor-pointer bg-slate-50/60 hover:bg-pink-50/30 transition-all text-center group">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-pink-600 transition-colors" />
                <span className="text-xs font-bold text-slate-800">
                  Click or drag image/video
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <hr className="border-slate-100" />

            {/* Compact Algorithm Dropdown */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-2">
                <Sliders className="w-4 h-4 text-pink-600" /> Dither Algorithm
              </label>
              <div className="relative">
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as DitherAlgorithm)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 outline-none transition-colors focus:border-pink-500 focus:bg-white pr-10 cursor-pointer shadow-sm"
                >
                  {ALGORITHM_CATEGORIES.map((cat) => (
                    <optgroup key={cat.categoryName} label={cat.categoryName} className="font-extrabold text-pink-700">
                      {cat.items.map((item) => (
                        <option key={item.id} value={item.id} className="text-slate-800 font-medium">
                          {item.label} — {item.desc}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Compact Palette Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <PaletteIcon className="w-4 h-4 text-pink-600" /> Retro Palette
                </label>
                {/* Active Palette Color Swatches Preview */}
                <div className="flex gap-1">
                  {activePalette().map((c, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: rgbToHex(c) }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <select
                  value={paletteId}
                  onChange={(e) => setPaletteId(e.target.value as PaletteId)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 outline-none transition-colors focus:border-pink-500 focus:bg-white pr-10 cursor-pointer shadow-sm"
                >
                  {(Object.keys(PALETTES) as PaletteId[]).map((pid) => (
                    <option key={pid} value={pid} className="text-slate-800 font-medium">
                      {PALETTES[pid].name} ({PALETTES[pid].colors.length} colors)
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {/* Custom Color Swatch Picker */}
              {paletteId === 'custom' && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-600 mb-1">Custom Palette Swatches</div>
                  <div className="flex flex-wrap gap-2">
                    {customColors.map((color, idx) => (
                      <input
                        key={idx}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const updated = [...customColors];
                          updated[idx] = e.target.value;
                          setCustomColors(updated);
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-300 bg-white cursor-pointer"
                      />
                    ))}
                    {customColors.length < 8 && (
                      <button
                        onClick={() => setCustomColors([...customColors, '#888888'])}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold rounded-lg text-slate-700"
                      >
                        + Add Swatch
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Adjustments Sliders */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Pixel Art Scale / Resolution</span>
                  <span className="text-pink-600 font-mono">{scaleFactor}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(Number(e.target.value))}
                  className="w-full accent-pink-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Contrast Adjustment</span>
                  <span className="text-pink-600 font-mono">{contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-pink-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Brightness Offset</span>
                  <span className="text-pink-600 font-mono">{brightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-pink-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {algorithm !== 'threshold' && !algorithm.startsWith('bayer') && algorithm !== 'halftone' && (
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Error Diffusion Strength</span>
                    <span className="text-pink-600 font-mono">{Math.round(diffusionAmount * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={diffusionAmount}
                    onChange={(e) => setDiffusionAmount(Number(e.target.value))}
                    className="w-full accent-pink-600 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Interactive Output Preview (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Canvas Preview Container */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-pink-500 animate-ping" />
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                    {mediaType === 'video' ? 'Video Canvas Render' : 'Dither Output Preview'}
                  </h2>
                </div>

                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition select-none cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-pink-600" /> Hold to view Original
                </button>
              </div>

              {/* Display Area */}
              <div className="relative max-w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-3 min-h-[360px] w-full">
                {mediaType === 'image' && mediaSrc && (
                  <img
                    ref={imageRef}
                    src={mediaSrc}
                    alt="Source input"
                    onLoad={renderFrame}
                    className="hidden"
                  />
                )}

                {mediaType === 'video' && mediaSrc && (
                  <video
                    ref={videoRef}
                    src={mediaSrc}
                    loop
                    playsInline
                    muted
                    onLoadedData={renderFrame}
                    className="hidden"
                  />
                )}

                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl image-rendering-pixelated"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Video Playback Bar */}
              {mediaType === 'video' && (
                <div className="w-full mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      if (!videoRef.current) return;
                      if (isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause Video' : 'Play Video'}
                  </button>

                  <div className="text-xs text-slate-500 font-mono">
                    Live Frame Dithering Active
                  </div>
                </div>
              )}
            </div>

            {/* Export & Download Card */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Download className="w-4 h-4 text-pink-600" /> Download & Export Actions
              </h2>

              {mediaType === 'image' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => downloadImage('png')}
                      className="px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <ImageIcon className="w-4 h-4" /> Export PNG
                    </button>
                    <button
                      onClick={() => downloadImage('webp')}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <ImageIcon className="w-4 h-4" /> Export WEBP
                    </button>
                    <button
                      onClick={() => downloadImage('jpeg')}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <ImageIcon className="w-4 h-4" /> Export JPG
                    </button>
                  </div>

                  {(algorithm === 'ascii-blocks' || algorithm === 'ascii-text') && (
                    <button
                      onClick={copyAsciiText}
                      className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      {copiedAscii ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                      {copiedAscii ? 'ASCII Text Copied to Clipboard!' : 'Copy ASCII Text Grid to Clipboard'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-5 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                      >
                        <Video className="w-4 h-4" /> Record Canvas Dither Clip
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 animate-pulse transition"
                      >
                        <Pause className="w-4 h-4" /> Stop Recording
                      </button>
                    )}

                    <button
                      onClick={() => downloadImage('png')}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <ImageIcon className="w-4 h-4" /> Capture Still Frame
                    </button>
                  </div>

                  {recordedBlobUrl && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dithered Video Clip Ready
                      </span>
                      <a
                        href={recordedBlobUrl}
                        download={`${fileName}-dithered.webm`}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
                      >
                        Download WebM Video
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Privacy Guarantee Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>100% Client-Side Privacy Guarantee:</strong> All dithering calculations run locally in your web browser memory. Your images and videos are never sent to any external server.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed SEO Information Section */}
        <section className="mt-20 border-t border-[var(--border)] pt-16 space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-3">
              <Film className="w-6 h-6 text-pink-600" />
              What is Dithering in Digital Media?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              <p>
                Dithering is a classic digital graphics technique used to approximate color gradients and continuous shaded textures when using restricted color palettes (such as 1-bit monochrome, Game Boy 4-color olive screens, CGA, or Commodore 64 colors).
              </p>
              <p>
                By positioning small patterns of contrasting pixels or halftone dots next to each other, the human eye perceives intermediate shades that do not exist in the physical palette, producing retro pixel art graphics popularized in Macintosh computers, early arcade games, and modern cyberpunk art styles.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-pink-600" />
              Supported Dithering Algorithms & Effects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-[var(--border)] rounded-2xl space-y-2 shadow-sm">
                <h3 className="text-base font-bold text-[var(--text-primary)]">Floyd-Steinberg</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Classic 75% error diffusion algorithm distributing quantization error to neighboring right, down-left, down, and down-right pixels for smooth organic stippling.
                </p>
              </div>

              <div className="p-6 bg-white border border-[var(--border)] rounded-2xl space-y-2 shadow-sm">
                <h3 className="text-base font-bold text-[var(--text-primary)]">Halftone Dot Screen</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Simulates CMYK newspaper print matrices with circular halftone dot clusters that adjust diameter based on localized pixel brightness.
                </p>
              </div>

              <div className="p-6 bg-white border border-[var(--border)] rounded-2xl space-y-2 shadow-sm">
                <h3 className="text-base font-bold text-[var(--text-primary)]">ASCII Text Matrix</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Translates pixel luminance into ASCII characters (`.:-=+*#%@` or `░▒▓█`) for vintage terminal computer aesthetics.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-pink-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is this dither studio completely free to use?',
                  a: 'Yes, 100% free with unlimited image and video dithering export options with zero watermarks.',
                },
                {
                  q: 'Are my uploaded files stored on your server?',
                  a: 'No. HTML5 Canvas processing and video frame dithering execute 100% locally on your computer.',
                },
                {
                  q: 'How do I copy ASCII text output?',
                  a: 'Select ASCII Blocks or ASCII Character Matrix algorithm, then click "Copy ASCII Text Grid to Clipboard" under Export Actions.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-5 bg-white border border-[var(--border)] rounded-2xl shadow-sm">
                  <h3 className="font-bold text-[var(--text-primary)] text-base mb-2">{faq.q}</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools Footer Section */}
        <RelatedTools currentToolId="dither-studio" categoryId="devtools" />
      </main>

      <Footer />
    </div>
  );
}
