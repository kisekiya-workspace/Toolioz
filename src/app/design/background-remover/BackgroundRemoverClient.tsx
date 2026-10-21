'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, ImagePlus, LoaderCircle, RotateCcw, ShieldCheck, Undo2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { renderCutout, type BrushStroke, type Cutout, type Raster } from '@/lib/background-removal/engine';
import type { CutoutRequest } from '@/lib/background-removal/worker';

type LoadedImage = { original: Raster; analysis: Raster; name: string };
type WorkerReply = { id: number; result?: Cutout; data?: Uint8ClampedArray; error?: string };
const button = 'inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800';
const checker = { backgroundColor: '#fff', backgroundImage: 'conic-gradient(#e4e4e7 25%, transparent 0 50%, #e4e4e7 0 75%, transparent 0)', backgroundSize: '20px 20px' };

export default function BackgroundRemoverClient() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [cutout, setCutout] = useState<Cutout | null>(null);
  const [strength, setStrength] = useState(35), [appliedStrength, setAppliedStrength] = useState(35);
  const [softness, setSoftness] = useState(1), [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<'keep' | 'remove'>('remove');
  const [strokes, setStrokes] = useState<BrushStroke[]>([]);
  const [view, setView] = useState<'cutout' | 'original'>('cutout');
  const [background, setBackground] = useState('transparent'), [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState(''), [error, setError] = useState(''), [elapsed, setElapsed] = useState(0);
  const [exported, setExported] = useState<{ url: string; image: LoadedImage; cutout: Cutout; strokes: BrushStroke[]; softness: number } | null>(null);
  const downloadUrl = useRef<string | null>(null);
  const input = useRef<HTMLInputElement>(null), preview = useRef<HTMLCanvasElement>(null), overlay = useRef<HTMLCanvasElement>(null);
  const active = useRef<BrushStroke | null>(null);
  const worker = useRef<Worker | null>(null), pending = useRef<((reason: Error) => void) | null>(null);
  const generation = useRef(0), job = useRef(0), alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; worker.current?.terminate(); pending.current?.(new Error('Cancelled')); if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current); };
  }, []);

  function run(request: Omit<Extract<CutoutRequest, { type: 'analyze' }>, 'id'> | Omit<Extract<CutoutRequest, { type: 'render' }>, 'id'>) {
    worker.current?.terminate(); pending.current?.(new Error('Cancelled'));
    return new Promise<WorkerReply>((resolve, reject) => {
      const instance = new Worker(new URL('../../../lib/background-removal/worker.ts', import.meta.url));
      worker.current = instance; pending.current = reject;
      const id = ++job.current;
      const timeout = setTimeout(() => { finish(); reject(new Error('Processing took too long. Please try a smaller image.')); }, 60_000);
      const finish = () => { clearTimeout(timeout); instance.terminate(); if (worker.current === instance) { worker.current = null; pending.current = null; } };
      instance.onmessage = (event: MessageEvent<WorkerReply>) => {
        if (event.data.id !== id) return;
        finish(); if (event.data.error) reject(new Error(event.data.error)); else resolve(event.data);
      };
      instance.onerror = () => { finish(); reject(new Error('The processing worker could not run. Please reload or try a smaller image.')); };
      // Structured cloning leaves source buffers intact for undo and subsequent exports.
      instance.postMessage({ ...request, id });
    });
  }

  function cancel() {
    generation.current++; worker.current?.terminate(); pending.current?.(new Error('Cancelled'));
    worker.current = null; pending.current = null; setBusy('');
  }

  async function analyze(next: LoadedImage, level: number, token: number) {
    const start = performance.now();
    setBusy('Finding the background…'); setError('');
    try {
      const reply = await run({ type: 'analyze', image: next.analysis, strength: level });
      if (token !== generation.current || !alive.current) return;
      setCutout(reply.result!); setAppliedStrength(level); setElapsed(performance.now() - start);
    } catch (cause) {
      if (token === generation.current && alive.current) setError(cause instanceof Error ? cause.message : 'Processing failed.');
    } finally { if (token === generation.current && alive.current) setBusy(''); }
  }

  async function load(file: File) {
    const token = ++generation.current;
    worker.current?.terminate(); pending.current?.(new Error('Cancelled')); worker.current = null; pending.current = null;
    setError(''); setBusy('Opening image…'); setCutout(null); setImage(null); setStrokes([]); setZoom(1); setView('cutout');
    if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
    downloadUrl.current = null; setExported(null);
    let bitmap: ImageBitmap | null = null;
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
      if (file.size > 25 * 1024 * 1024) throw new Error('Choose an image smaller than 25 MB.');
      bitmap = await createImageBitmap(file);
      if (token !== generation.current || !alive.current) return;
      const w = bitmap.width, h = bitmap.height;
      if (w * h > 16_000_000 || Math.max(w, h) > 8192) throw new Error('Maximum image size is 16 megapixels, with no side longer than 8192 pixels. Resize the image first.');
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Your browser does not support image processing.');
      ctx.drawImage(bitmap, 0, 0);
      const original: Raster = { width: w, height: h, data: ctx.getImageData(0, 0, w, h).data };
      const scale = Math.min(1, 720 / Math.max(w, h));
      canvas.width = Math.max(1, Math.round(w * scale)); canvas.height = Math.max(1, Math.round(h * scale));
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const analysis: Raster = { width: canvas.width, height: canvas.height, data: ctx.getImageData(0, 0, canvas.width, canvas.height).data };
      const next = { original, analysis, name: file.name.replace(/\.[^.]+$/, '') || 'image' };
      setImage(next); await analyze(next, strength, token);
    } catch (cause) {
      if (token === generation.current && alive.current) { setError(cause instanceof Error ? cause.message : 'Unable to open this image.'); setBusy(''); }
    } finally { bitmap?.close(); }
  }

  function sample() {
    const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 700;
    const ctx = canvas.getContext('2d')!;
    const backdrop = ctx.createLinearGradient(0, 0, 900, 700);
    backdrop.addColorStop(0, '#f4eee6'); backdrop.addColorStop(1, '#dad2c5');
    ctx.fillStyle = backdrop; ctx.fillRect(0, 0, 900, 700);
    ctx.fillStyle = '#183f38'; ctx.beginPath(); ctx.roundRect(300, 180, 260, 390, 45); ctx.fill();
    ctx.fillStyle = '#102c27'; ctx.fillRect(350, 125, 160, 65);
    ctx.fillStyle = '#fff8e7'; ctx.fillRect(332, 310, 196, 140);
    ctx.textAlign = 'center'; ctx.fillStyle = '#183f38'; ctx.font = 'bold 28px Georgia'; ctx.fillText('FIELD NOTES', 430, 365);
    ctx.font = '16px sans-serif'; ctx.fillText('BOTANICAL / 01', 430, 405);
    ctx.strokeStyle = '#326b44'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(630, 560); ctx.lineTo(660, 260); ctx.stroke();
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#467b49' : '#275a3c'; ctx.beginPath(); ctx.ellipse(655 + (i % 2 ? 25 : -30), 300 + i * 45, 42, 17, i % 2 ? -0.5 : 0.5, 0, Math.PI * 2); ctx.fill(); }
    canvas.toBlob(blob => { if (blob) void load(new File([blob], 'field-notes-sample.png', { type: 'image/png' })); }, 'image/png');
  }

  useEffect(() => {
    const canvas = preview.current;
    if (!canvas || !image || !cutout) return;
    canvas.width = image.analysis.width; canvas.height = image.analysis.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = view === 'original' ? image.analysis.data : renderCutout(image.analysis, image.analysis, cutout.mask, strokes, softness);
    ctx.putImageData(new ImageData(new Uint8ClampedArray(data), canvas.width, canvas.height), 0, 0);
    if (overlay.current) { overlay.current.width = canvas.width; overlay.current.height = canvas.height; }
  }, [image, cutout, strokes, view, softness]);

  function point(event: PointerEvent<HTMLCanvasElement>): [number, number] {
    const rect = event.currentTarget.getBoundingClientRect();
    return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))];
  }
  function drawHint(next: [number, number]) {
    const canvas = overlay.current, stroke = active.current;
    if (!canvas || !stroke) return;
    const ctx = canvas.getContext('2d')!, prev = stroke.points[stroke.points.length - 1];
    ctx.strokeStyle = stroke.mode === 'keep' ? '#10b981aa' : '#f43f5eaa'; ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = stroke.radius * Math.min(canvas.width, canvas.height) * 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(prev[0] * canvas.width, prev[1] * canvas.height); ctx.lineTo(next[0] * canvas.width, next[1] * canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.arc(next[0] * canvas.width, next[1] * canvas.height, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill();
  }
  function startStroke(event: PointerEvent<HTMLCanvasElement>) {
    if (busy || !cutout || strokes.length >= 100 || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current = { mode, radius: brushSize / 200, points: [point(event)] }; drawHint(point(event));
  }
  function moveStroke(event: PointerEvent<HTMLCanvasElement>) {
    const stroke = active.current;
    if (!stroke) return;
    const next = point(event), prev = stroke.points[stroke.points.length - 1];
    if (Math.hypot(next[0] - prev[0], next[1] - prev[1]) < stroke.radius * 0.15 || stroke.points.length >= 2000) return;
    drawHint(next); stroke.points.push(next);
  }
  function endStroke(event: PointerEvent<HTMLCanvasElement>) {
    if (!active.current) return;
    const stroke = active.current; active.current = null;
    setStrokes(previous => [...previous, stroke]); setView('cutout');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  async function download() {
    if (!image || !cutout || busy || active.current) return;
    const token = generation.current;
    setBusy('Rendering full-resolution PNG…'); setError('');
    try {
      const reply = await run({ type: 'render', image: image.original, analysis: image.analysis, mask: cutout.mask, strokes, softness });
      if (token !== generation.current || !alive.current) return;
      const canvas = document.createElement('canvas'); canvas.width = image.original.width; canvas.height = image.original.height;
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Could not create the export.');
      ctx.putImageData(new ImageData(new Uint8ClampedArray(reply.data!), canvas.width, canvas.height), 0, 0);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG export failed. Try a smaller image.');
      if (token !== generation.current || !alive.current) return;
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
      const url = URL.createObjectURL(blob), anchor = document.createElement('a');
      downloadUrl.current = url; setExported({ url, image, cutout, strokes, softness });
      anchor.href = url; anchor.download = `${image.name}-cutout.png`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
    } catch (cause) { if (token === generation.current && alive.current) setError(cause instanceof Error ? cause.message : 'Export failed.'); }
    finally { if (token === generation.current && alive.current) setBusy(''); }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <Link href="/design" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-emerald-700"><ArrowLeft size={14} /> Design utilities</Link>
        <header className="my-8 flex flex-wrap items-end justify-between gap-6">
          <div><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Toolioz / Cutout studio</p><h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Keep the subject.<br /><span className="font-serif italic text-emerald-800 dark:text-emerald-400">Lose the background.</span></h1><p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">Free background removal for product shots and simple backdrops. Refine the edges by hand, then download a transparent PNG.</p></div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-800/15 px-4 py-2 text-xs text-emerald-800 dark:text-emerald-400"><ShieldCheck size={16} /> Images stay in this tab</div>
        </header>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload image" onChange={event => { const file = event.target.files?.[0]; if (file) void load(file); event.target.value = ''; }} />
        <div className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm lg:grid-cols-[1fr_300px] dark:border-zinc-800 dark:bg-zinc-900">
          <section className="min-w-0 border-b border-zinc-200 lg:border-b-0 lg:border-r dark:border-zinc-800" aria-label="Image preview">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">{(['cutout', 'original'] as const).map(item => <button key={item} type="button" aria-pressed={view === item} disabled={!cutout || !!busy} onClick={() => setView(item)} className={`rounded-md px-3 py-1.5 text-xs capitalize ${view === item ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>{item}</button>)}</div>
              <button type="button" className={button} disabled={!!busy} onClick={() => input.current?.click()}><ImagePlus size={16} /> {image ? 'Replace image' : 'Upload image'}</button>
            </div>
            <div className={`relative flex min-h-[430px] items-center ${zoom > 1 ? 'justify-start' : 'justify-center'} overflow-auto p-5 sm:min-h-[540px]`} style={background === 'transparent' ? checker : { backgroundColor: background }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (!busy && event.dataTransfer.files[0]) void load(event.dataTransfer.files[0]); }}>
              {image && cutout ? <div className="relative shrink-0" style={{ width: `${zoom * 100}%`, maxWidth: zoom === 1 ? image.analysis.width : undefined }}><canvas ref={preview} className="block h-auto w-full" /><canvas ref={overlay} aria-label="Paint on image to keep or remove pixels" className="absolute inset-0 h-full w-full touch-none cursor-crosshair" onPointerDown={startStroke} onPointerMove={moveStroke} onPointerUp={endStroke} onPointerCancel={endStroke} /></div> : <div className="max-w-sm rounded-2xl border border-zinc-200 bg-white/95 p-8 text-center text-zinc-900"><ImagePlus size={32} className="mx-auto mb-4 text-emerald-700" /><h2 className="text-xl font-semibold">A clean cut starts here</h2><p className="mb-6 mt-2 text-sm leading-6 text-zinc-500">Drop a photo, or choose one below.<br />JPEG, PNG, WebP · up to 25 MB / 16 MP</p><button type="button" className={`${button} w-full`} disabled={!!busy} onClick={() => input.current?.click()}>Choose image</button><button type="button" className="mt-4 text-xs font-medium text-emerald-700 underline underline-offset-4 disabled:opacity-40" disabled={!!busy} onClick={sample}>Try our generated sample</button></div>}
              {!!busy && <div className="absolute inset-0 flex items-center justify-center bg-white/85 text-zinc-900"><div className="rounded-xl border bg-white px-5 py-4 text-sm"><p role="status" className="flex items-center gap-3"><LoaderCircle size={18} className="animate-spin" />{busy}</p><button type="button" className="mt-3 text-xs underline underline-offset-4" onClick={cancel}>Cancel processing</button></div></div>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs text-zinc-500"><span>{image ? `${image.original.width} × ${image.original.height} px · original-size export` : 'No upload. No account. No watermark.'}</span>{cutout && <label className="flex items-center gap-2">Zoom<select aria-label="Preview zoom" value={zoom} onChange={event => setZoom(Number(event.target.value))} className="rounded border bg-transparent p-1"><option value={1}>100%</option><option value={2}>200%</option><option value={3}>300%</option></select></label>}</div>
          </section>
          <aside className="space-y-6 p-6" aria-label="Cutout controls">
            <div><h2 className="text-sm font-semibold">01 / Separate</h2><label className="mt-4 block text-xs text-zinc-500">Background separation <span className="float-right font-mono">{strength}</span><input type="range" min="0" max="100" value={strength} onChange={event => setStrength(Number(event.target.value))} className="mt-3 w-full accent-emerald-700" disabled={!!busy} /></label><p className="mt-1 text-xs leading-5 text-zinc-500">Increase to remove more. Lower if parts of the subject disappear.</p><button type="button" className={`${button} mt-3 w-full`} disabled={!image || !!busy} onClick={() => image && void analyze(image, strength, generation.current)}><RotateCcw size={14} /> Recalculate</button>{strength !== appliedStrength && cutout && <p className="mt-2 text-xs text-amber-700">Apply the new separation with Recalculate.</p>}</div>
            <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800"><h2 className="text-sm font-semibold">02 / Refine by hand</h2><div className="mt-3 flex gap-2">{(['remove', 'keep'] as const).map(item => <button type="button" key={item} aria-pressed={mode === item} disabled={!cutout || !!busy} onClick={() => setMode(item)} className={`${button} flex-1 capitalize ${mode === item ? '!border-emerald-700 !bg-emerald-50 !text-emerald-900' : ''}`}>{item}</button>)}</div><p className="mt-2 text-xs leading-5 text-zinc-500">Paint to erase or restore. Switch to Original to locate missing parts. Each stroke applies when you release.</p><label className="mt-3 block text-xs text-zinc-500">Brush diameter <span className="float-right font-mono">{brushSize}%</span><input type="range" min="1" max="25" value={brushSize} disabled={!!busy} onChange={event => setBrushSize(Number(event.target.value))} className="mt-2 w-full accent-emerald-700" /></label><div className="mt-3 flex gap-2"><button type="button" className={`${button} flex-1 !px-2`} disabled={!strokes.length || !!busy} onClick={() => setStrokes(s => s.slice(0, -1))}><Undo2 size={14} /> Undo</button><button type="button" className={`${button} flex-1 !px-2`} disabled={!strokes.length || !!busy} onClick={() => setStrokes([])}>Clear edits</button></div><p className="mt-2 text-xs text-zinc-500">{strokes.length}/100 strokes · edits survive recalculation</p></div>
            <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800"><h2 className="text-sm font-semibold">03 / Finish</h2><label className="mt-3 block text-xs text-zinc-500">Edge softness<input type="range" min="0" max="4" step="0.5" value={softness} disabled={!!busy} onChange={event => setSoftness(Number(event.target.value))} className="mt-2 w-full accent-emerald-700" /></label><p className="mt-3 text-xs text-zinc-500">Preview backdrop (not exported)</p><div className="mt-2 flex gap-2">{['transparent', '#ffffff', '#18181b', '#dcfce7'].map(color => <button key={color} type="button" aria-label={`Preview on ${color === 'transparent' ? 'checkerboard' : color}`} aria-pressed={background === color} onClick={() => setBackground(color)} style={color === 'transparent' ? checker : { backgroundColor: color }} className={`size-8 rounded-full border ${background === color ? 'ring-2 ring-emerald-600 ring-offset-2' : 'border-zinc-300'}`} />)}</div><button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40" disabled={!cutout || !!busy} onClick={() => void download()}><Download size={16} /> Download PNG</button><p className="mt-2 text-center text-xs text-zinc-500">Transparent · full resolution · free</p></div>
          </aside>
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {exported && exported.image === image && exported.cutout === cutout && exported.strokes === strokes && exported.softness === softness && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Your PNG is ready. If the download did not start, <a href={exported.url} download={`${exported.image.name}-cutout.png`} className="font-semibold underline underline-offset-2">save the transparent PNG</a>.</p>}
        {cutout?.warning && <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{cutout.warning}</p>}
        {cutout && <p className="mt-3 font-mono text-xs text-zinc-500">Background analyzed in {(elapsed / 1000).toFixed(2)}s · reduced-resolution analysis, original-resolution export</p>}
        <div className="my-10 grid gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-3 dark:border-zinc-800"><section><h2 className="text-sm font-semibold">Made for simple backdrops</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Start with a contrasting subject and an uncluttered background that reaches the image edges. Product photos, graphics, and studio shots are a good fit.</p></section><section><h2 className="text-sm font-semibold">Not a portrait AI</h2><p className="mt-2 text-sm leading-6 text-zinc-500">This is our own color-and-connectivity engine, not a trained neural model. Hair, glass, shadows, busy scenery, and matching foreground/background colors need cleanup.</p></section><section><h2 className="text-sm font-semibold">Your image stays yours</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Image pixels are processed in your browser, not uploaded. The website still loads its normal assets and analytics. Downloads contain no watermark.</p></section></div>
      </main>
      <Footer />
    </div>
  );
}
