'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  LoaderCircle,
  RotateCcw,
  RotateCw,
  Trash2,
  Upload,
} from 'lucide-react';
import type { NewToolDefinition } from '@/lib/new-tool-catalog';
import {
  ToolWorkbench,
  downloadBlob,
  fieldClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './ToolWorkbench';

type PdfMode =
  | 'organize'
  | 'page-numbers'
  | 'watermark'
  | 'metadata'
  | 'text'
  | 'bates';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
type PageItem = { sourceIndex: number; label: number; rotation: number };

const MAX_FILE_SIZE = 80 * 1024 * 1024;

function cleanName(name: string, suffix: string, extension = 'pdf') {
  return `${name.replace(/\.pdf$/i, '')}-${suffix}.${extension}`;
}

function positionText(
  width: number,
  height: number,
  textWidth: number,
  size: number,
  position: Position,
  margin = 28
) {
  const x = position.endsWith('left')
    ? margin
    : position.endsWith('right')
    ? width - textWidth - margin
    : (width - textWidth) / 2;
  const y = position.startsWith('top') ? height - size - margin : margin;
  return { x: Math.max(4, x), y: Math.max(4, y) };
}

export default function PdfUtilityClient({ tool }: { tool: NewToolDefinition }) {
  const mode = tool.mode as PdfMode;
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [position, setPosition] = useState<Position>('bottom-center');
  const [start, setStart] = useState(1);
  const [skip, setSkip] = useState(0);
  const [fontSize, setFontSize] = useState(11);
  const [watermark, setWatermark] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.22);
  const [angle, setAngle] = useState(-35);
  const [prefix, setPrefix] = useState('DOC-');
  const [suffix, setSuffix] = useState('');
  const [padding, setPadding] = useState(6);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
  });

  async function selectFile(selected?: File) {
    if (!selected) return;
    setError('');
    setResult('');
    if (
      selected.type !== 'application/pdf' &&
      !selected.name.toLowerCase().endsWith('.pdf')
    )
      return setError('Choose a PDF file.');
    if (selected.size > MAX_FILE_SIZE)
      return setError('Choose a PDF smaller than 80 MB.');
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.load(await selected.arrayBuffer(), {
        updateMetadata: false,
      });
      setFile(selected);
      setPages(
        pdf.getPages().map((page, index) => ({
          sourceIndex: index,
          label: index + 1,
          rotation: page.getRotation().angle,
        }))
      );
      if (mode === 'metadata') {
        setMetadata({
          title: pdf.getTitle() || '',
          author: pdf.getAuthor() || '',
          subject: pdf.getSubject() || '',
          keywords: pdf.getKeywords() || '',
          creator: pdf.getCreator() || '',
          producer: pdf.getProducer() || '',
        });
      }
    } catch (cause) {
      setFile(null);
      setError(
        cause instanceof Error
          ? cause.message
          : 'The PDF could not be opened. Password-protected PDFs are not supported.'
      );
    } finally {
      setBusy(false);
    }
  }

  function movePage(index: number, offset: number) {
    const target = index + offset;
    if (target < 0 || target >= pages.length) return;
    setPages((current) => {
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function processPdf() {
    if (!file) return;
    if (mode === 'organize' && pages.length === 0)
      return setError('Keep at least one page.');
    setBusy(true);
    setError('');
    setResult('');
    try {
      if (mode === 'text') {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() })
          .promise;
        const pageTexts: string[] = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          let line = '';
          let previousY: number | undefined;
          for (const item of content.items) {
            if (!('str' in item)) continue;
            const y = item.transform[5];
            if (previousY !== undefined && Math.abs(y - previousY) > 4)
              line += '\n';
            else if (line && !line.endsWith('\n')) line += ' ';
            line += item.str;
            previousY = y;
          }
          pageTexts.push(`--- Page ${pageNumber} ---\n${line.trim()}`);
        }
        const text = pageTexts.join('\n\n');
        setResult(
          text ||
            'No selectable text was found. This may be a scanned PDF; use the OCR Image to Text tool after converting pages to images.'
        );
        return;
      }

      const { PDFDocument, StandardFonts, degrees, rgb } = await import(
        'pdf-lib'
      );
      const source = await PDFDocument.load(await file.arrayBuffer(), {
        updateMetadata: false,
      });
      let output = source;
      if (mode === 'organize') {
        output = await PDFDocument.create();
        const copied = await output.copyPages(
          source,
          pages.map((page) => page.sourceIndex)
        );
        copied.forEach((page, index) => {
          page.setRotation(
            degrees(((pages[index].rotation % 360) + 360) % 360)
          );
          output.addPage(page);
        });
      } else if (mode === 'metadata') {
        output.setTitle(metadata.title);
        output.setAuthor(metadata.author);
        output.setSubject(metadata.subject);
        output.setKeywords(
          metadata.keywords
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
        );
        output.setCreator(metadata.creator);
        output.setProducer(metadata.producer);
      } else {
        const font = await output.embedFont(StandardFonts.Helvetica);
        output.getPages().forEach((page, index) => {
          if (mode === 'page-numbers' && index < skip) return;
          const number = start + index - (mode === 'page-numbers' ? skip : 0);
          const text =
            mode === 'watermark'
              ? watermark
              : mode === 'bates'
              ? `${prefix}${String(start + index).padStart(padding, '0')}${suffix}`
              : String(number);
          if (!text) return;
          const size = mode === 'watermark' ? fontSize : Math.max(7, fontSize);
          const { width, height } = page.getSize();
          if (mode === 'watermark') {
            const textWidth = font.widthOfTextAtSize(text, size);
            page.drawText(text, {
              x: (width - textWidth) / 2,
              y: height / 2,
              size,
              font,
              color: rgb(0.15, 0.23, 0.42),
              opacity,
              rotate: degrees(angle),
            });
          } else {
            const textWidth = font.widthOfTextAtSize(text, size);
            page.drawText(text, {
              ...positionText(width, height, textWidth, size, position),
              size,
              font,
              color: rgb(0.15, 0.23, 0.29),
            });
          }
        });
      }
      const bytes = await output.save();
      const suffixName =
        mode === 'organize'
          ? 'organized'
          : mode === 'metadata'
          ? 'metadata-updated'
          : mode === 'watermark'
          ? 'watermarked'
          : mode === 'bates'
          ? 'bates-numbered'
          : 'numbered';
      downloadBlob(
        bytes,
        cleanName(file.name, suffixName),
        'application/pdf'
      );
      setResult('Your processed PDF was downloaded.');
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Processing failed. Try a smaller, unlocked PDF.'
      );
    } finally {
      setBusy(false);
    }
  }

  function clearMetadata() {
    setMetadata({
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
    });
  }

  return (
    <ToolWorkbench tool={tool}>
      {!file ? (
        <label className="flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center transition hover:border-zinc-300 hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60">
          <input
            className="hidden"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
          {busy ? (
            <LoaderCircle className="animate-spin text-blue-600 dark:text-blue-400" size={36} />
          ) : (
            <Upload className="text-blue-600 dark:text-blue-400" size={36} />
          )}
          <strong className="mt-4 text-base font-bold text-zinc-950 dark:text-zinc-50">
            Choose a PDF file
          </strong>
          <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Up to 80 MB · Processed 100% locally
          </span>
        </label>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <FileText size={20} />
              </span>
              <div>
                <strong className="block text-sm font-bold text-zinc-950 dark:text-zinc-50">
                  {file.name}
                </strong>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  {pages.length} page{pages.length === 1 ? '' : 's'} ·{' '}
                  {(file.size / 1048576).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              className={secondaryButtonClass}
              onClick={() => {
                setFile(null);
                setPages([]);
                setResult('');
                setError('');
              }}
            >
              Choose another
            </button>
          </div>

          {mode === 'organize' && (
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Page Order & Orientation
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page, index) => (
                  <div
                    key={`${page.sourceIndex}-${index}`}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <span className="mr-auto text-xs font-bold text-zinc-950 dark:text-zinc-50">
                      Page {page.label}
                    </span>
                    <button
                      aria-label="Move page up"
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
                      onClick={() => movePage(index, -1)}
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      aria-label="Move page down"
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
                      onClick={() => movePage(index, 1)}
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button
                      aria-label="Rotate left"
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
                      onClick={() =>
                        setPages((all) =>
                          all.map((item, i) =>
                            i === index
                              ? { ...item, rotation: item.rotation - 90 }
                              : item
                          )
                        )
                      }
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      aria-label="Rotate right"
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
                      onClick={() =>
                        setPages((all) =>
                          all.map((item, i) =>
                            i === index
                              ? { ...item, rotation: item.rotation + 90 }
                              : item
                          )
                        )
                      }
                    >
                      <RotateCw size={15} />
                    </button>
                    <button
                      aria-label="Remove page"
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer"
                      onClick={() =>
                        setPages((all) => all.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(mode === 'page-numbers' || mode === 'bates') && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Start number
                <input
                  className={`${fieldClass} mt-1.5`}
                  type="number"
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value) || 0)}
                />
              </label>
              {mode === 'page-numbers' && (
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Skip first pages
                  <input
                    className={`${fieldClass} mt-1.5`}
                    min="0"
                    type="number"
                    value={skip}
                    onChange={(e) =>
                      setSkip(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </label>
              )}
              {mode === 'bates' && (
                <>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Prefix
                    <input
                      className={`${fieldClass} mt-1.5`}
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                    />
                  </label>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Suffix
                    <input
                      className={`${fieldClass} mt-1.5`}
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                    />
                  </label>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Digits
                    <input
                      className={`${fieldClass} mt-1.5`}
                      min="1"
                      max="12"
                      type="number"
                      value={padding}
                      onChange={(e) =>
                        setPadding(
                          Math.min(12, Math.max(1, Number(e.target.value) || 1))
                        )
                      }
                    />
                  </label>
                </>
              )}
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Position
                <select
                  className={`${fieldClass} mt-1.5`}
                  value={position}
                  onChange={(e) => setPosition(e.target.value as Position)}
                >
                  {[
                    'top-left',
                    'top-center',
                    'top-right',
                    'bottom-left',
                    'bottom-center',
                    'bottom-right',
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Font size
                <input
                  className={`${fieldClass} mt-1.5`}
                  min="7"
                  max="48"
                  type="number"
                  value={fontSize}
                  onChange={(e) =>
                    setFontSize(Number(e.target.value) || 11)
                  }
                />
              </label>
            </div>
          )}

          {mode === 'watermark' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 sm:col-span-2">
                Watermark text
                <input
                  className={`${fieldClass} mt-1.5`}
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Font size: {fontSize}px
                <input
                  className="mt-3 w-full accent-blue-600"
                  type="range"
                  min="12"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Opacity: {Math.round(opacity * 100)}%
                <input
                  className="mt-3 w-full accent-blue-600"
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Angle: {angle}°
                <input
                  className="mt-3 w-full accent-blue-600"
                  type="range"
                  min="-90"
                  max="90"
                  step="5"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                />
              </label>
            </div>
          )}

          {mode === 'metadata' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Document Metadata
                </h2>
                <button
                  className={secondaryButtonClass}
                  onClick={clearMetadata}
                >
                  <Trash2 size={14} /> Clear fields
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(metadata).map(([key, value]) => (
                  <label
                    key={key}
                    className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 capitalize"
                  >
                    {key}
                    <input
                      className={`${fieldClass} mt-1.5`}
                      value={value}
                      onChange={(e) =>
                        setMetadata((current) => ({
                          ...current,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Clearing these standard properties updates the catalog metadata without re-encoding binary content.
              </p>
            </div>
          )}

          {mode === 'text' && result && (
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5">
                <strong className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
                  Extracted Text
                </strong>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-lg bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition shadow-2xs cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(result)}
                  >
                    Copy Text
                  </button>
                  <button
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs cursor-pointer"
                    onClick={() =>
                      downloadBlob(
                        result,
                        cleanName(file.name, 'text', 'txt'),
                        'text/plain;charset=utf-8'
                      )
                    }
                  >
                    <Download className="mr-1 inline" size={13} /> Download TXT
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                className="min-h-80 w-full resize-y border-0 bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-900 dark:text-zinc-100 outline-none"
                value={result}
              />
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/30 p-3 text-xs font-semibold text-red-700 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {result && mode !== 'text' && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30 p-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {result}
            </p>
          )}

          <button
            className={primaryButtonClass}
            onClick={processPdf}
            disabled={busy}
          >
            {busy ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {busy
              ? 'Processing…'
              : mode === 'text'
              ? 'Extract text'
              : 'Process and download PDF'}
          </button>
        </div>
      )}
    </ToolWorkbench>
  );
}
