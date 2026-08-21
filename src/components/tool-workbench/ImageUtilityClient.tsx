'use client';
/* eslint-disable @next/next/no-img-element -- local blob previews cannot use the Next image optimizer */

import { useMemo, useState } from 'react';
import { Copy, Download, Eye, ImageIcon, LoaderCircle, ShieldCheck, Upload } from 'lucide-react';
import type { NewToolDefinition } from '@/lib/new-tool-catalog';
import { ToolWorkbench, areaClass, downloadBlob, fieldClass, primaryButtonClass, secondaryButtonClass } from './ToolWorkbench';

type ImageMode = 'exif' | 'gps' | 'dimensions' | 'ocr';

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

function stripJpegMetadata(source: Uint8Array) {
  if (source[0] !== 0xff || source[1] !== 0xd8) throw new Error('This file is not a valid JPEG.');
  const pieces: Uint8Array[] = [source.subarray(0, 2)];
  let offset = 2;
  while (offset < source.length) {
    if (source[offset] !== 0xff) throw new Error('Unexpected JPEG structure.');
    const marker = source[offset + 1];
    if (marker === 0xda) { pieces.push(source.subarray(offset)); break; }
    if (marker === 0xd9) { pieces.push(source.subarray(offset, offset + 2)); break; }
    if (marker >= 0xd0 && marker <= 0xd7) { pieces.push(source.subarray(offset, offset + 2)); offset += 2; continue; }
    const length = (source[offset + 2] << 8) | source[offset + 3];
    if (length < 2 || offset + length + 2 > source.length) throw new Error('The JPEG contains a damaged segment.');
    const remove = marker === 0xe1 || marker === 0xed || marker === 0xfe;
    if (!remove) pieces.push(source.subarray(offset, offset + length + 2));
    offset += length + 2;
  }
  const size = pieces.reduce((total, piece) => total + piece.length, 0);
  const result = new Uint8Array(size);
  let cursor = 0;
  pieces.forEach((piece) => { result.set(piece, cursor); cursor += piece.length; });
  return result;
}

function stripPngMetadata(source: Uint8Array) {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (!signature.every((value, index) => source[index] === value)) throw new Error('This file is not a valid PNG.');
  const pieces: Uint8Array[] = [source.subarray(0, 8)];
  const removable = new Set(['eXIf', 'tEXt', 'zTXt', 'iTXt', 'tIME']);
  let offset = 8;
  while (offset + 12 <= source.length) {
    const view = new DataView(source.buffer, source.byteOffset + offset, 4);
    const length = view.getUint32(0);
    const end = offset + 12 + length;
    if (end > source.length) throw new Error('The PNG contains a damaged chunk.');
    const type = String.fromCharCode(...source.subarray(offset + 4, offset + 8));
    if (!removable.has(type)) pieces.push(source.subarray(offset, end));
    offset = end;
    if (type === 'IEND') break;
  }
  const size = pieces.reduce((total, piece) => total + piece.length, 0);
  const result = new Uint8Array(size);
  let cursor = 0;
  pieces.forEach((piece) => { result.set(piece, cursor); cursor += piece.length; });
  return result;
}

function printable(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(printable).join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value ?? '');
}

export default function ImageUtilityClient({ tool }: { tool: NewToolDefinition }) {
  const mode = tool.mode as ImageMode;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [targetWidth, setTargetWidth] = useState(1920);
  const [targetHeight, setTargetHeight] = useState(1080);
  const [ocrText, setOcrText] = useState('');
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ratio = useMemo(() => { if (!width || !height) return ''; const divisor = gcd(width, height); return `${width / divisor}:${height / divisor}`; }, [width, height]);
  const gpsEntries = useMemo(() => Object.entries(metadata).filter(([key]) => /gps|latitude|longitude|location/i.test(key)), [metadata]);

  async function loadImage(selected?: File) {
    if (!selected) return;
    setBusy(true); setError(''); setOcrText(''); setMetadata({});
    if (!selected.type.startsWith('image/')) { setBusy(false); return setError('Choose a JPG, PNG, or WebP image.'); }
    if (selected.size > 30 * 1024 * 1024) { setBusy(false); return setError('Choose an image smaller than 30 MB.'); }
    try {
      const url = URL.createObjectURL(selected);
      const image = new Image();
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('The image could not be decoded.')); image.src = url; });
      if (preview) URL.revokeObjectURL(preview);
      setFile(selected); setPreview(url); setWidth(image.naturalWidth); setHeight(image.naturalHeight); setTargetWidth(image.naturalWidth); setTargetHeight(image.naturalHeight);
      if (mode === 'exif' || mode === 'gps') {
        const exifr = await import('exifr');
        const parsed = await exifr.parse(selected, { tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: true });
        setMetadata(parsed || {});
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The image could not be read.'); }
    finally { setBusy(false); }
  }

  async function cleanMetadata() {
    if (!file) return;
    setError('');
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const isJpeg = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name);
      const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);
      if (!isJpeg && !isPng) throw new Error('Lossless metadata removal currently supports JPEG and PNG. Convert other formats first.');
      const cleaned = isJpeg ? stripJpegMetadata(bytes) : stripPngMetadata(bytes);
      const extension = isJpeg ? 'jpg' : 'png';
      downloadBlob(cleaned, `${file.name.replace(/\.[^.]+$/, '')}-metadata-clean.${extension}`, isJpeg ? 'image/jpeg' : 'image/png');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Metadata removal failed.'); }
  }

  async function runOcr() {
    if (!file) return;
    setBusy(true); setError(''); setProgress(0); setOcrText('');
    try {
      const { recognize } = await import('tesseract.js');
      const result = await recognize(file, 'eng', { logger: (message) => { if (message.status === 'recognizing text') setProgress(Math.round((message.progress || 0) * 100)); } });
      setOcrText(result.data.text.trim());
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'OCR failed. Try a smaller, sharper image.'); }
    finally { setBusy(false); }
  }

  return <ToolWorkbench tool={tool}>
    {!file ? <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--tool-border)] bg-[var(--tool-soft)] p-8 text-center hover:bg-[var(--tool-wash)]"><input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => loadImage(e.target.files?.[0])} />{busy ? <LoaderCircle className="text-[var(--tool-accent)]" size={36} /> : <Upload className="text-[var(--tool-accent)]" size={36} />}<strong className="mt-4 text-lg text-slate-900">Choose an image</strong><span className="mt-2 text-sm text-slate-500">JPG, PNG, or WebP · up to 30 MB</span></label> : <div className="space-y-6">
      <div className="grid overflow-hidden rounded-2xl border border-[var(--tool-border)] md:grid-cols-[220px_1fr]"><div className="flex min-h-48 items-center justify-center overflow-hidden bg-[var(--tool-wash)] p-4"><img src={preview} alt="Selected image preview" className="max-h-56 max-w-full rounded-xl object-contain" /></div><div className="flex flex-col justify-center bg-[var(--tool-soft)] p-5"><div className="flex items-center gap-2 font-bold text-slate-900"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--tool-accent)] text-white"><ImageIcon size={19} /></span>{file.name}</div><p className="mt-3 text-sm text-slate-500">{width.toLocaleString()} × {height.toLocaleString()} pixels · {(file.size / 1048576).toFixed(2)} MB</p><button className={`${secondaryButtonClass} mt-4 self-start`} onClick={() => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(''); setMetadata({}); }}>Choose another</button></div></div>

      {(mode === 'exif' || mode === 'gps') && <div className="space-y-4"><div className="rounded-2xl border border-[var(--tool-border)] bg-[var(--tool-accent)] p-5 text-white"><div className="flex items-center gap-2 font-bold">{gpsEntries.length ? <Eye size={18} /> : <ShieldCheck size={18} />}{gpsEntries.length ? `${gpsEntries.length} location-related field${gpsEntries.length === 1 ? '' : 's'} detected` : 'No GPS fields detected by the metadata reader'}</div><p className="mt-1 text-sm leading-6 text-white/85">The cleaned download removes JPEG EXIF/XMP/IPTC/comment blocks or PNG EXIF/text/time chunks byte-for-byte, without re-encoding image pixels.</p></div>{mode === 'exif' && <div className="max-h-[32rem] overflow-auto rounded-2xl border border-[var(--tool-border)]"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-[var(--tool-soft)] text-[var(--tool-accent-dark)]"><tr><th className="px-4 py-3">Field</th><th className="px-4 py-3">Value</th></tr></thead><tbody>{Object.entries(metadata).length ? Object.entries(metadata).map(([key, value]) => <tr key={key} className="border-t border-slate-100 hover:bg-[var(--tool-soft)]"><th className="px-4 py-3 align-top font-semibold text-slate-700">{key}</th><td className="break-all px-4 py-3 text-slate-600">{printable(value)}</td></tr>) : <tr><td className="px-4 py-6 text-slate-500" colSpan={2}>No readable metadata was found.</td></tr>}</tbody></table></div>}{mode === 'gps' && gpsEntries.length > 0 && <div className="rounded-2xl border border-[var(--tool-border)] bg-[var(--tool-soft)] p-4">{gpsEntries.map(([key, value]) => <p key={key} className="mb-2 text-sm"><strong>{key}:</strong> {printable(value)}</p>)}</div>}<button className={primaryButtonClass} onClick={cleanMetadata}><Download size={18} />Download privacy-clean copy</button></div>}

      {mode === 'dimensions' && <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3">{[['Width', `${width.toLocaleString()} px`], ['Height', `${height.toLocaleString()} px`], ['Simplified ratio', ratio]].map(([label, value], index) => <div key={label} className={index === 2 ? 'rounded-2xl border border-[var(--tool-accent)] bg-[var(--tool-accent)] p-5 text-white' : 'rounded-2xl border border-[var(--tool-border)] bg-[var(--tool-soft)] p-5'}><span className={`text-xs font-bold uppercase tracking-wider ${index === 2 ? 'text-white/80' : 'text-[var(--tool-accent-dark)]'}`}>{label}</span><strong className={`mt-2 block text-3xl ${index === 2 ? 'text-white' : 'text-slate-900'}`}>{value}</strong></div>)}</div><h2 className="text-lg font-black text-slate-900">Calculate a proportional size</h2><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Target width<input className={`${fieldClass} mt-2`} type="number" min="1" value={targetWidth} onChange={(e) => { const next = Math.max(1, Number(e.target.value) || 1); setTargetWidth(next); setTargetHeight(Math.round(next * height / width)); }} /></label><label className="text-sm font-bold">Target height<input className={`${fieldClass} mt-2`} type="number" min="1" value={targetHeight} onChange={(e) => { const next = Math.max(1, Number(e.target.value) || 1); setTargetHeight(next); setTargetWidth(Math.round(next * width / height)); }} /></label></div><p className="text-sm text-slate-500">The other dimension updates automatically while preserving {ratio}.</p></div>}

      {mode === 'ocr' && <div className="space-y-4">{!ocrText && <button className={primaryButtonClass} disabled={busy} onClick={runOcr}>{busy ? <LoaderCircle size={18} /> : <Eye size={18} />}{busy ? `Recognizing text… ${progress}%` : 'Extract text with OCR'}</button>}{busy && <div className="h-2 overflow-hidden rounded-full bg-[var(--tool-wash)]"><div className="h-full bg-[var(--tool-accent)]" style={{ width: `${progress}%` }} /></div>}{ocrText && <div className="overflow-hidden rounded-2xl border border-[var(--tool-border)]"><div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--tool-accent)] px-4 py-3 text-white"><strong>Recognized text</strong><div className="flex gap-2"><button className="rounded-lg bg-white/15 px-3 py-2 text-sm font-bold hover:bg-white/25" onClick={() => navigator.clipboard.writeText(ocrText)}><Copy className="mr-1 inline" size={16} />Copy</button><button className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[var(--tool-accent-dark)] hover:bg-[var(--tool-soft)]" onClick={() => downloadBlob(ocrText, `${file.name.replace(/\.[^.]+$/, '')}-ocr.txt`, 'text/plain;charset=utf-8')}><Download className="mr-1 inline" size={16} />Download</button></div></div><textarea className={`${areaClass} min-h-72 !rounded-none !border-0 !bg-[var(--tool-soft)]`} value={ocrText} onChange={(e) => setOcrText(e.target.value)} /></div>}</div>}
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
    </div>}
  </ToolWorkbench>;
}
