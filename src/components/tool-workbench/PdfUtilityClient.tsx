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
  | 'bates'
  | 'remove-blank-pages'
  | 'letter-to-a4'
  | 'split-bookmarks'
  | 'reverse-pages'
  | 'add-blank-pages'
  | '2-pages-per-sheet'
  | 'flatten';
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
  const [blankSensitivity, setBlankSensitivity] = useState(99.5);
  const [resizeDirection, setResizeDirection] = useState<'letter-to-a4' | 'a4-to-letter'>('letter-to-a4');

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

      if (mode === 'remove-blank-pages') {
        const pdfjs = await import('pdfjs-dist');
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }
        const pdfData = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: pdfData.slice(0) }).promise;
        const blankPages: number[] = [];

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });
          canvas.width = Math.max(1, Math.ceil(viewport.width));
          canvas.height = Math.max(1, Math.ceil(viewport.height));
          if (!ctx) continue;

          // Crucial: fill with white first because blank pages have transparent background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          let whitePixels = 0;
          const totalPixels = data.length / 4;
          for (let p = 0; p < data.length; p += 4) {
            const r = data[p];
            const g = data[p + 1];
            const b = data[p + 2];
            const a = data[p + 3];
            // Count transparent or white/off-white pixels
            if (a < 15 || (r > 240 && g > 240 && b > 240)) {
              whitePixels++;
            }
          }
          const whiteRatio = (whitePixels / totalPixels) * 100;
          if (whiteRatio >= blankSensitivity) {
            blankPages.push(i);
          }
        }

        if (blankPages.length === 0) {
          setResult(`No blank pages detected at ${blankSensitivity}% sensitivity. All ${pdfDoc.numPages} pages contain content.`);
          return;
        }
        if (blankPages.length === pdfDoc.numPages) {
          setError('All pages in this PDF were detected as blank! Try increasing the sensitivity threshold or keeping at least one page.');
          return;
        }

        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(pdfData);
        const outDoc = await PDFDocument.create();
        const keepIndices: number[] = [];
        for (let idx = 0; idx < pdfDoc.numPages; idx++) {
          if (!blankPages.includes(idx + 1)) {
            keepIndices.push(idx);
          }
        }
        const copied = await outDoc.copyPages(srcDoc, keepIndices);
        copied.forEach((p) => outDoc.addPage(p));
        const bytes = await outDoc.save();
        downloadBlob(bytes, cleanName(file.name, 'blank-removed'), 'application/pdf');
        setResult(`Removed ${blankPages.length} blank page${blankPages.length === 1 ? '' : 's'} (page ${blankPages.join(', ')}). Downloaded clean document with ${keepIndices.length} pages.`);
        return;
      }

      if (mode === 'letter-to-a4') {
        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(await file.arrayBuffer());
        const outDoc = await PDFDocument.create();
        const isTargetA4 = resizeDirection === 'letter-to-a4';
        const targetW = isTargetA4 ? 595.28 : 612;
        const targetH = isTargetA4 ? 841.89 : 792;
        const total = srcDoc.getPageCount();

        for (let i = 0; i < total; i++) {
          const [copiedPage] = await outDoc.copyPages(srcDoc, [i]);
          const { width: origW, height: origH } = copiedPage.getSize();
          const isLandscape = origW > origH;
          const finalW = isLandscape ? targetH : targetW;
          const finalH = isLandscape ? targetW : targetH;
          const scale = Math.min(finalW / origW, finalH / origH);
          const scaledW = origW * scale;
          const scaledH = origH * scale;
          const x = (finalW - scaledW) / 2;
          const y = (finalH - scaledH) / 2;

          copiedPage.scale(scale, scale);
          copiedPage.setSize(finalW, finalH);
          copiedPage.translateContent(x, y);
          outDoc.addPage(copiedPage);
        }
        const bytes = await outDoc.save();
        downloadBlob(bytes, cleanName(file.name, isTargetA4 ? 'resized-a4' : 'resized-letter'), 'application/pdf');
        setResult(`Resized all ${total} pages to ${isTargetA4 ? 'ISO A4 (210 × 297 mm)' : 'US Letter (8.5 × 11 in)'}.`);
        return;
      }

      if (mode === 'split-bookmarks') {
        const pdfjs = await import('pdfjs-dist');
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }
        const pdfData = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: pdfData.slice(0) }).promise;
        const outline = await pdfDoc.getOutline();

        if (!outline || outline.length === 0) {
          setError('No chapter bookmarks or outline found in this document. Use the Organize PDF or Split PDF tools to split by page numbers.');
          return;
        }

        function flattenOutline(items: any[]): any[] {
          const flat: any[] = [];
          for (const it of items) {
            flat.push(it);
            if (it.items && Array.isArray(it.items) && it.items.length) {
              flat.push(...flattenOutline(it.items));
            }
          }
          return flat;
        }

        const allItems = flattenOutline(outline);
        const sections: { title: string; pageNum: number }[] = [];
        for (const item of allItems) {
          let dest = item.dest;
          if (typeof dest === 'string') {
            dest = await pdfDoc.getDestination(dest);
          }
          if (Array.isArray(dest)) {
            const pageRef = dest[0];
            try {
              const pageIndex = await pdfDoc.getPageIndex(pageRef);
              sections.push({
                title: (item.title || 'Chapter').replace(/[/\\?%*:|"<>]/g, '_').trim(),
                pageNum: pageIndex + 1,
              });
            } catch {}
          }
        }

        if (sections.length === 0) {
          setError('Bookmarks were found but destination pages could not be resolved.');
          return;
        }

        sections.sort((a, b) => a.pageNum - b.pageNum);
        const uniqueSections: { title: string; pageNum: number }[] = [];
        for (const s of sections) {
          if (!uniqueSections.some((u) => u.pageNum === s.pageNum)) {
            uniqueSections.push(s);
          }
        }

        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(pdfData);
        const total = srcDoc.getPageCount();

        for (let s = 0; s < uniqueSections.length; s++) {
          const startPage = uniqueSections[s].pageNum;
          const endPage = s + 1 < uniqueSections.length ? uniqueSections[s + 1].pageNum - 1 : total;
          if (startPage > endPage || startPage > total) continue;

          const chapterDoc = await PDFDocument.create();
          const pageIndices: number[] = [];
          for (let p = startPage - 1; p < endPage; p++) {
            pageIndices.push(p);
          }
          const copied = await chapterDoc.copyPages(srcDoc, pageIndices);
          copied.forEach((page) => chapterDoc.addPage(page));
          const bytes = await chapterDoc.save();
          downloadBlob(bytes, `${uniqueSections[s].title}.pdf`, 'application/pdf');
          if (s < uniqueSections.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 350));
          }
        }

        setResult(`Extracted and downloaded ${uniqueSections.length} chapter files: ${uniqueSections.map((s) => s.title).slice(0, 4).join(', ')}${uniqueSections.length > 4 ? '...' : ''}.`);
        return;
      }

      if (mode === 'reverse-pages') {
        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(await file.arrayBuffer());
        const outDoc = await PDFDocument.create();
        const total = srcDoc.getPageCount();
        const reversedIndices = Array.from({ length: total }, (_, i) => total - 1 - i);
        const copied = await outDoc.copyPages(srcDoc, reversedIndices);
        copied.forEach((p) => outDoc.addPage(p));
        const bytes = await outDoc.save();
        downloadBlob(bytes, cleanName(file.name, 'reversed'), 'application/pdf');
        setResult(`Reversed page order across all ${total} pages (Page ${total} is now Page 1).`);
        return;
      }

      if (mode === 'add-blank-pages') {
        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(await file.arrayBuffer());
        const outDoc = await PDFDocument.create();
        const total = srcDoc.getPageCount();
        for (let i = 0; i < total; i++) {
          const [copiedPage] = await outDoc.copyPages(srcDoc, [i]);
          const { width, height } = copiedPage.getSize();
          outDoc.addPage(copiedPage);
          outDoc.addPage([width, height]);
        }
        const bytes = await outDoc.save();
        downloadBlob(bytes, cleanName(file.name, 'with-blank-pages'), 'application/pdf');
        setResult(`Inserted a blank page after every page (${total} pages expanded to ${total * 2} pages).`);
        return;
      }

      if (mode === '2-pages-per-sheet') {
        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(await file.arrayBuffer());
        const outDoc = await PDFDocument.create();
        const total = srcDoc.getPageCount();
        const sheetW = 841.89; // A4 landscape
        const sheetH = 595.28;
        const halfW = sheetW / 2;

        for (let i = 0; i < total; i += 2) {
          const sheet = outDoc.addPage([sheetW, sheetH]);
          const p1 = srcDoc.getPage(i);
          if (!p1.node.Contents()) p1.drawText('', { x: 0, y: 0 });
          const [emb1] = await outDoc.embedPages([p1]);
          const { width: w1, height: h1 } = p1.getSize();
          const scale1 = Math.min((halfW - 20) / w1, (sheetH - 20) / h1);
          sheet.drawPage(emb1, {
            x: 10 + (halfW - 20 - w1 * scale1) / 2,
            y: (sheetH - h1 * scale1) / 2,
            xScale: scale1,
            yScale: scale1,
          });

          if (i + 1 < total) {
            const p2 = srcDoc.getPage(i + 1);
            if (!p2.node.Contents()) p2.drawText('', { x: 0, y: 0 });
            const [emb2] = await outDoc.embedPages([p2]);
            const { width: w2, height: h2 } = p2.getSize();
            const scale2 = Math.min((halfW - 20) / w2, (sheetH - 20) / h2);
            sheet.drawPage(emb2, {
              x: halfW + 10 + (halfW - 20 - w2 * scale2) / 2,
              y: (sheetH - h2 * scale2) / 2,
              xScale: scale2,
              yScale: scale2,
            });
          }
        }
        const bytes = await outDoc.save();
        downloadBlob(bytes, cleanName(file.name, '2-up-booklet'), 'application/pdf');
        setResult(`Formatted ${total} pages onto ${Math.ceil(total / 2)} landscape sheets (2-up booklet layout).`);
        return;
      }

      if (mode === 'flatten') {
        const { PDFDocument } = await import('pdf-lib');
        const srcDoc = await PDFDocument.load(await file.arrayBuffer());
        try {
          srcDoc.getForm().flatten();
        } catch {}
        const pages = srcDoc.getPages();
        for (const page of pages) {
          try {
            page.node.delete(srcDoc.context.obj('Annots'));
          } catch {}
        }
        const bytes = await srcDoc.save();
        downloadBlob(bytes, cleanName(file.name, 'flattened'), 'application/pdf');
        setResult(`Flattened form fields and stripped annotations on ${pages.length} pages.`);
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
      setResult('The processed PDF was downloaded.');
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
            Up to 80 MB · Processed in this tab
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
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
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
                    className="rounded-lg bg-white dark:bg-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(result)}
                  >
                    Copy Text
                  </button>
                  <button
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
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

          {mode === 'remove-blank-pages' && (
            <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Blank Sensitivity Threshold: {blankSensitivity}%
                </label>
                <span className="text-xs text-zinc-500 font-mono">
                  {blankSensitivity >= 99.8 ? 'Strict (only pure white)' : blankSensitivity >= 99.0 ? 'Recommended (standard)' : 'Aggressive (catches shadows & scanner specks)'}
                </span>
              </div>
              <input
                type="range"
                min="92.0"
                max="99.9"
                step="0.1"
                className="w-full accent-blue-600 cursor-pointer"
                value={blankSensitivity}
                onChange={(e) => setBlankSensitivity(Number(e.target.value))}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pages with higher than {blankSensitivity}% white pixels will be automatically removed.
              </p>
            </div>
          )}

          {mode === 'letter-to-a4' && (
            <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <strong className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Choose Target Page Dimensions
              </strong>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className={`flex flex-col p-4 rounded-xl border text-left transition cursor-pointer ${
                    resizeDirection === 'letter-to-a4'
                      ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/40'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
                  }`}
                  onClick={() => setResizeDirection('letter-to-a4')}
                >
                  <strong className="text-sm font-bold text-zinc-950 dark:text-zinc-50">US Letter → ISO A4</strong>
                  <span className="text-xs text-zinc-500 mt-1">Convert 8.5 × 11 in to 210 × 297 mm with uniform proportional scaling.</span>
                </button>
                <button
                  type="button"
                  className={`flex flex-col p-4 rounded-xl border text-left transition cursor-pointer ${
                    resizeDirection === 'a4-to-letter'
                      ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/40'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
                  }`}
                  onClick={() => setResizeDirection('a4-to-letter')}
                >
                  <strong className="text-sm font-bold text-zinc-950 dark:text-zinc-50">ISO A4 → US Letter</strong>
                  <span className="text-xs text-zinc-500 mt-1">Convert 210 × 297 mm to 8.5 × 11 in with balanced margins.</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'split-bookmarks' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                This tool reads internal chapter bookmarks (outlines) and splits your PDF into clean section files named after each chapter.
              </p>
            </div>
          )}

          {mode === 'reverse-pages' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Inverts page order from back to front across all {pages.length} pages. Perfect for fixing reverse-scanned documents.
              </p>
            </div>
          )}

          {mode === 'add-blank-pages' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Interleaves an empty page after each page. Your {pages.length}-page document will become {pages.length * 2} pages for double-sided booklet printing or notes.
              </p>
            </div>
          )}

          {mode === '2-pages-per-sheet' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Combines two pages side-by-side onto one landscape A4 sheet. Your {pages.length} pages will be formatted onto {Math.ceil(pages.length / 2)} sheets.
              </p>
            </div>
          )}

          {mode === 'flatten' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Locks all interactive form fields and strips dynamic annotations to create a permanent, non-editable PDF.
              </p>
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
              : mode === 'remove-blank-pages'
              ? 'Detect & remove blank pages'
              : mode === 'letter-to-a4'
              ? `Convert to ${resizeDirection === 'letter-to-a4' ? 'ISO A4' : 'US Letter'}`
              : mode === 'split-bookmarks'
              ? 'Split PDF by bookmarks'
              : mode === 'reverse-pages'
              ? 'Reverse page order & download'
              : mode === 'add-blank-pages'
              ? 'Insert blank pages & download'
              : mode === '2-pages-per-sheet'
              ? 'Format 2 pages per sheet'
              : mode === 'flatten'
              ? 'Flatten form & download'
              : 'Process and download PDF'}
          </button>
        </div>
      )}
    </ToolWorkbench>
  );
}
