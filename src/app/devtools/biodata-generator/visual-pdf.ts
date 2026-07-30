import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, Color } from 'pdf-lib';
import type { BiodataForm } from './types';
import type { TemplateId } from './types';
import { MOTIF_SVG_PATHS, MOTIF_UNICODE, type BiodataMotifId } from './biodata-motifs';
import { getBackgroundUrl } from './biodata-backgrounds';

/* ═══════════════════════════════════════════════════════════════════════════
   Vector PDF generator for Biodata — mirrors resume generator architecture.
   Six dedicated layouts with colors, borders, sidebars, and photo frames.
   ═══════════════════════════════════════════════════════════════════════════ */

const A4 = { w: 595.28, h: 841.89 };

const hex = (h: string): Color => {
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
};

function sanitize(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\t\v\f]/g, ' ')
    .replace(/[\x00-\x09\x0B-\x1F]/g, '')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function sanitizeMultiline(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/[\t\v\f]/g, ' ')
    .replace(/[\x00-\x09\x0B-\x1F]/g, '')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = text.split(/\n/);
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(' ').filter(Boolean);
    let current = '';
    for (const word of words) {
      const safeWord = word.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
      if (!safeWord) continue;
      const test = current ? `${current} ${safeWord}` : safeWord;
      try {
        if (font.widthOfTextAtSize(test, size) <= maxWidth) current = test;
        else {
          if (current) lines.push(current);
          current = safeWord;
        }
      } catch {
        if (current) lines.push(current);
        current = safeWord;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function safeDraw(
  page: PDFPage,
  text: string,
  opts: { x: number; y: number; size: number; font: PDFFont; color: Color; opacity?: number }
) {
  try {
    const safe = text.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
    if (!safe) return;
    page.drawText(safe, opts);
  } catch {
    /* encoding */
  }
}

function textWidth(font: PDFFont, text: string, size: number): number {
  try {
    return font.widthOfTextAtSize(text.replace(/[^\x20-\x7E\xA0-\xFF]/g, ''), size);
  } catch {
    return 0;
  }
}

function drawWrapped(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color: Color,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = wrapText(text, font, size, maxWidth);
  let cy = y;
  for (const line of lines) {
    if (cy < 40) break;
    safeDraw(page, line, { x, y: cy, size, font, color });
    cy -= lineHeight;
  }
  return cy;
}

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont; boldItalic: PDFFont };

type Theme = {
  primary: Color;
  accent: Color;
  text: Color;
  muted: Color;
  bg: Color;
  border: Color;
  headerFill?: Color;
  sidebar?: Color;
  onSidebar?: Color;
};

type Layout = {
  mx: number;
  mw: number;
  my: number;
  centeredHeaders?: boolean;
};

type DrawCtx = {
  doc: PDFDocument;
  page: PDFPage;
  fonts: Fonts;
  data: BiodataForm;
  theme: Theme;
  layout: Layout;
  embeddedImage: Awaited<ReturnType<PDFDocument['embedPng']>> | null;
  imageDims: { width: number; height: number };
};

async function embedPhoto(doc: PDFDocument, photo: string | null) {
  if (!photo) return { image: null as Awaited<ReturnType<PDFDocument['embedPng']>> | null, dims: { width: 0, height: 0 } };
  try {
    const isPng = photo.startsWith('data:image/png');
    const base64Data = photo.split(',')[1];
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const image = isPng ? await doc.embedPng(imageBytes) : await doc.embedJpg(imageBytes);
    const scaled = image.scaleToFit(110, 110);
    return { image, dims: { width: scaled.width, height: scaled.height } };
  } catch {
    return { image: null, dims: { width: 0, height: 0 } };
  }
}

/** Fetch a background image from /public and embed it in the PDF document. */
async function embedBackgroundImage(
  doc: PDFDocument,
  templateId: TemplateId
): Promise<Awaited<ReturnType<PDFDocument['embedPng']>> | null> {
  const url = getBackgroundUrl(templateId);
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    // Detect PNG vs JPG
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
    return isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

/**
 * Draw a full-page background image on a PDF page using a "cover" strategy.
 * The image is scaled proportionally to fully cover the A4 page (no stretching),
 * then centered so any overflow is cropped equally on both sides.
 */
function drawBackgroundImage(
  page: PDFPage,
  bgImage: Awaited<ReturnType<PDFDocument['embedPng']>>
) {
  const imgW = bgImage.width;
  const imgH = bgImage.height;

  // Scale factor: pick the larger so the image fully covers the page
  const scaleX = A4.w / imgW;
  const scaleY = A4.h / imgH;
  const scale = Math.max(scaleX, scaleY);

  const drawW = imgW * scale;
  const drawH = imgH * scale;

  // Center the image (overflow is cropped by the page boundary)
  const x = (A4.w - drawW) / 2;
  const y = (A4.h - drawH) / 2;

  page.drawImage(bgImage, { x, y, width: drawW, height: drawH });
}

/** Draw religious motif above header text; returns new y position. */
function drawMotif(
  page: PDFPage,
  fonts: Fonts,
  motif: BiodataMotifId,
  color: Color,
  y: number
): number {
  const path = MOTIF_SVG_PATHS[motif];
  try {
    page.drawSvgPath(path, { x: A4.w / 2 - 12, y: y + 10, scale: 0.05, color });
    return y - 32;
  } catch {
    const unicode = MOTIF_UNICODE[motif];
    if (unicode) {
      const uw = textWidth(fonts.bold, unicode, 22);
      safeDraw(page, unicode, { x: A4.w / 2 - uw / 2, y, size: 22, font: fonts.bold, color });
      return y - 28;
    }
    return y;
  }
}

function drawPhotoPlain(page: PDFPage, image: NonNullable<DrawCtx['embeddedImage']>, x: number, y: number, dims: { width: number; height: number }) {
  page.drawImage(image, {
    x,
    y: y - dims.height,
    width: dims.width,
    height: dims.height,
  });
  return y - dims.height - 14;
}

function drawSectionHeader(ctx: DrawCtx, title: string) {
  const { page, fonts, theme, layout } = ctx;
  let { my } = layout;
  if (my < 60) return;
  my -= 4;
  const label = title.toUpperCase();
  if (layout.centeredHeaders) {
    const sw = textWidth(fonts.bold, label, 11);
    safeDraw(page, label, { x: A4.w / 2 - sw / 2, y: my, size: 11, font: fonts.bold, color: theme.primary });
    my -= 6;
    page.drawRectangle({ x: A4.w / 2 - sw / 2 - 10, y: my, width: sw + 20, height: 1.2, color: theme.accent });
  } else {
    safeDraw(page, label, { x: layout.mx, y: my, size: 11, font: fonts.bold, color: theme.primary });
    my -= 5;
    page.drawRectangle({ x: layout.mx, y: my, width: layout.mw, height: 1.5, color: theme.accent });
  }
  layout.my = my - 14;
}

function drawField(ctx: DrawCtx, label: string, value: string | undefined | null) {
  const val = sanitize(value);
  if (!val || ctx.layout.my < 50) return;
  const { page, fonts, theme, layout } = ctx;
  const labelW = 125;
  safeDraw(page, label, { x: layout.mx, y: layout.my, size: 9.5, font: fonts.bold, color: theme.text });
  safeDraw(page, ':', { x: layout.mx + labelW - 6, y: layout.my, size: 9.5, font: fonts.regular, color: theme.muted });
  layout.my = drawWrapped(page, val, layout.mx + labelW, layout.my, fonts.regular, 9.5, theme.muted, layout.mw - labelW, 13);
  layout.my -= 5;
}

function drawTextBlock(ctx: DrawCtx, title: string, text: string | undefined | null) {
  const val = sanitize(text);
  if (!val) return;
  drawSectionHeader(ctx, title);
  const { page, fonts, theme, layout } = ctx;
  layout.my = drawWrapped(page, val, layout.mx, layout.my, fonts.italic, 9.5, theme.muted, layout.mw, 13);
  layout.my -= 12;
}

function drawBiodataBody(ctx: DrawCtx, opts?: { skipSidebarFields?: boolean; skipContact?: boolean }) {
  const { data } = ctx;
  drawTextBlock(ctx, 'About Me', data.about);
  drawSectionHeader(ctx, 'Personal Details');
  drawField(ctx, 'Date of Birth', data.dateOfBirth);
  drawField(ctx, 'Time of Birth', data.birthTime);
  drawField(ctx, 'Place of Birth', data.birthPlace);
  if (!opts?.skipSidebarFields) {
    drawField(ctx, 'Height', data.height);
    drawField(ctx, 'Religion', data.religion);
    drawField(ctx, 'Caste', data.caste);
    drawField(ctx, 'Manglik', data.manglik);
    drawField(ctx, 'Languages', data.languages);
  }
  ctx.layout.my -= 4;
  drawSectionHeader(ctx, 'Education & Career');
  drawField(ctx, 'Education', data.education);
  drawField(ctx, 'Occupation', data.occupation);
  drawField(ctx, 'Annual Income', data.annualIncome);
  ctx.layout.my -= 4;
  drawSectionHeader(ctx, 'Family Heritage');
  drawField(ctx, "Father's Name", data.fatherName);
  drawField(ctx, "Father's Occupation", data.fatherOccupation);
  drawField(ctx, "Mother's Name", data.motherName);
  drawField(ctx, "Mother's Occupation", data.motherOccupation);
  const sib = sanitizeMultiline(data.siblings);
  if (sib && ctx.layout.my > 50) {
    const labelW = 125;
    safeDraw(ctx.page, 'Siblings', {
      x: ctx.layout.mx,
      y: ctx.layout.my,
      size: 9.5,
      font: ctx.fonts.bold,
      color: ctx.theme.text,
    });
    ctx.layout.my = drawWrapped(
      ctx.page,
      sib,
      ctx.layout.mx + labelW,
      ctx.layout.my,
      ctx.fonts.regular,
      9.5,
      ctx.theme.muted,
      ctx.layout.mw - labelW,
      13
    );
    ctx.layout.my -= 5;
  }
  ctx.layout.my -= 4;
  drawTextBlock(ctx, 'Hobbies & Interests', data.hobbies);
  drawTextBlock(ctx, 'Partner Expectations', data.partnerPreferences);
  if (!opts?.skipContact) {
    drawSectionHeader(ctx, 'Contact Information');
    drawField(ctx, 'Mobile', data.phone);
    drawField(ctx, 'Email', data.email);
    drawField(ctx, 'Address', data.address);
  }
}

/* ── Template: Modern Split ───────────────────────────────────────────── */
async function pdfModern(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('12343b'),
    accent: hex('d79a2b'),
    text: hex('1f2937'),
    muted: hex('4b5563'),
    bg: hex('fbfaf7'),
    border: hex('d79a2b'),
    sidebar: hex('12343b'),
    onSidebar: hex('fbfaf7'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  const sw = 185;
  page.drawRectangle({ x: 0, y: 0, width: sw, height: A4.h, color: theme.sidebar! });
  page.drawRectangle({ x: 0, y: A4.h - 6, width: A4.w, height: 6, color: theme.accent });

  const name = sanitize(data.fullName) || 'Biodata';
  let sy = A4.h - 42;
  if (photo.image) {
    sy = drawPhotoPlain(page, photo.image, sw / 2 - photo.dims.width / 2, sy, photo.dims);
  }
  for (const line of wrapText(name, fonts.bold, 17, sw - 28)) {
    safeDraw(page, line, { x: 14, y: sy, size: 17, font: fonts.bold, color: theme.onSidebar! });
    sy -= 20;
  }
  page.drawRectangle({ x: 14, y: sy + 6, width: 36, height: 2.5, color: theme.accent });
  sy -= 18;
  safeDraw(page, 'CONTACT', { x: 14, y: sy, size: 7.5, font: fonts.bold, color: theme.onSidebar!, opacity: 0.85 });
  sy -= 12;
  for (const ci of [
    { l: 'Phone', v: data.phone },
    { l: 'Email', v: data.email },
    { l: 'Address', v: data.address },
  ]) {
    const v = sanitize(ci.v);
    if (!v) continue;
    safeDraw(page, ci.l.toUpperCase(), { x: 14, y: sy, size: 6.5, font: fonts.bold, color: theme.onSidebar!, opacity: 0.55 });
    sy -= 10;
    sy = drawWrapped(page, v, 14, sy, fonts.regular, 8.5, theme.onSidebar!, sw - 28, 11);
    sy -= 8;
  }
  sy -= 6;
  safeDraw(page, 'BASIC DETAILS', { x: 14, y: sy, size: 7.5, font: fonts.bold, color: theme.onSidebar!, opacity: 0.85 });
  sy -= 12;
  for (const row of [
    ['Height', data.height],
    ['Religion', data.religion],
    ['Caste', data.caste],
    ['Manglik', data.manglik],
    ['Languages', data.languages],
  ]) {
    const v = sanitize(row[1]);
    if (!v || sy < 44) continue;
    safeDraw(page, `${row[0]}: `, { x: 14, y: sy, size: 8.5, font: fonts.regular, color: theme.onSidebar!, opacity: 0.75 });
    const lw = textWidth(fonts.regular, `${row[0]}: `, 8.5);
    safeDraw(page, v, { x: 14 + lw, y: sy, size: 8.5, font: fonts.bold, color: theme.onSidebar! });
    sy -= 14;
  }

  const layout: Layout = { mx: sw + 22, mw: A4.w - sw - 44, my: A4.h - 42 };
  const ctx: DrawCtx = {
    doc,
    page,
    fonts,
    data,
    theme,
    layout,
    embeddedImage: photo.image,
    imageDims: photo.dims,
  };
  safeDraw(page, 'MARRIAGE BIODATA', { x: layout.mx, y: layout.my, size: 8, font: fonts.bold, color: theme.accent });
  layout.my -= 14;
  drawBiodataBody(ctx, { skipSidebarFields: true, skipContact: true });
}

/* ── Template: Classic Centered ───────────────────────────────────────── */
async function pdfClassic(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('17324d'),
    accent: hex('b8860b'),
    text: hex('202124'),
    muted: hex('4f5b62'),
    bg: hex('f8f5ef'),
    border: hex('b8860b'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  page.drawRectangle({ x: 28, y: A4.h - 24, width: A4.w - 56, height: 2, color: theme.accent });
  page.drawRectangle({ x: 28, y: 22, width: A4.w - 56, height: 2, color: theme.accent });
  page.drawRectangle({ x: 22, y: 28, width: 2, height: A4.h - 56, color: theme.primary, opacity: 0.18 });
  page.drawRectangle({ x: A4.w - 24, y: 28, width: 2, height: A4.h - 56, color: theme.primary, opacity: 0.18 });

  let my = A4.h - 42;
  const hdr = 'MARRIAGE BIODATA';
  const hw = textWidth(fonts.bold, hdr, 10);
  safeDraw(page, hdr, { x: A4.w / 2 - hw / 2, y: my, size: 10, font: fonts.bold, color: theme.accent });
  my -= 22;
  if (photo.image) {
    my = drawPhotoPlain(page, photo.image, A4.w / 2 - photo.dims.width / 2, my, photo.dims);
  }
  const name = sanitize(data.fullName) || 'Biodata';
  const nw = textWidth(fonts.bold, name, 22);
  safeDraw(page, name, { x: A4.w / 2 - nw / 2, y: my, size: 22, font: fonts.bold, color: theme.primary });
  my -= 14;
  const occ = sanitize(data.occupation);
  if (occ) {
    const ow = textWidth(fonts.italic, occ, 10);
    safeDraw(page, occ, { x: A4.w / 2 - ow / 2, y: my, size: 10, font: fonts.italic, color: theme.muted });
    my -= 12;
  }
  page.drawRectangle({ x: A4.w / 2 - 45, y: my, width: 90, height: 1.5, color: theme.accent });
  my -= 22;

  const layout: Layout = { mx: 48, mw: A4.w - 96, my, centeredHeaders: true };
  drawBiodataBody({
    doc,
    page,
    fonts,
    data,
    theme,
    layout,
    embeddedImage: photo.image,
    imageDims: photo.dims,
  });
}

/* ── Template: Minimalist ───────────────────────────────────────────────── */
async function pdfMinimalist(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('0f172a'),
    accent: hex('0f172a'),
    text: hex('0f172a'),
    muted: hex('64748b'),
    bg: hex('ffffff'),
    border: hex('e2e8f0'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  page.drawRectangle({ x: 40, y: A4.h - 44, width: A4.w - 80, height: 3, color: theme.primary });

  let my = A4.h - 56;
  const name = sanitize(data.fullName) || 'Biodata';
  safeDraw(page, 'BIODATA PROFILE', { x: 40, y: my, size: 7, font: fonts.bold, color: theme.muted });
  my -= 18;
  safeDraw(page, name, { x: 40, y: my, size: 24, font: fonts.bold, color: theme.text });
  if (photo.image) {
    drawPhotoPlain(page, photo.image, A4.w - 40 - photo.dims.width, my + 4, photo.dims);
  }
  my -= 14;
  const occ = sanitize(data.occupation);
  if (occ) safeDraw(page, occ, { x: 40, y: my, size: 11, font: fonts.regular, color: theme.muted });
  my -= 28;

  const layout: Layout = { mx: 40, mw: A4.w - 80, my };
  drawBiodataBody({ doc, page, fonts, data, theme, layout, embeddedImage: photo.image, imageDims: photo.dims });
}

async function pdfCulturalCentered(
  doc: PDFDocument,
  data: BiodataForm,
  fonts: Fonts,
  photo: Awaited<ReturnType<typeof embedPhoto>>,
  variant: 'hindu' | 'islamic' | 'sikh'
) {
  const page = doc.addPage([A4.w, A4.h]);
  const palettes: Record<
    'hindu' | 'islamic' | 'sikh',
    { primary: Color; accent: Color; text: Color; muted: Color; bg: Color; border: Color; subtitle: string; motif: BiodataMotifId }
  > = {
    hindu: {
      primary: hex('800000'),
      accent: hex('d4af37'),
      text: hex('431407'),
      muted: hex('78350f'),
      bg: hex('fffbf2'),
      border: hex('d4af37'),
      subtitle: '|| Shree Ganeshay Namah ||',
      motif: 'om',
    },
    islamic: {
      primary: hex('064e3b'),
      accent: hex('10b981'),
      text: hex('064e3b'),
      muted: hex('047857'),
      bg: hex('f0fdf4'),
      border: hex('10b981'),
      subtitle: 'Bismillah ir-Rahman ir-Rahim',
      motif: 'crescent',
    },
    sikh: {
      primary: hex('1e3a8a'),
      accent: hex('f97316'),
      text: hex('1e3a8a'),
      muted: hex('1e40af'),
      bg: hex('f8fafc'),
      border: hex('f97316'),
      subtitle: 'Ik Onkar - Waheguru Ji Ki Fateh',
      motif: 'khanda',
    },
  };
  const p = palettes[variant];
  const theme: Theme = {
    primary: p.primary,
    accent: p.accent,
    text: p.text,
    muted: p.muted,
    bg: p.bg,
    border: p.border,
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  if (variant === 'sikh') {
    page.drawRectangle({ x: 0, y: A4.h - 3, width: A4.w, height: 3, color: theme.primary });
    page.drawRectangle({ x: 0, y: 0, width: A4.w, height: 3, color: theme.accent });
  }

  let my = A4.h - 42;
  my = drawMotif(page, fonts, p.motif, theme.accent, my);
  const subW = textWidth(fonts.bold, p.subtitle, 9);
  safeDraw(page, p.subtitle, { x: A4.w / 2 - subW / 2, y: my, size: 9, font: fonts.bold, color: theme.accent });
  my -= 22;
  const hdr = 'BIODATA';
  const hw = textWidth(fonts.bold, hdr, 10);
  safeDraw(page, hdr, { x: A4.w / 2 - hw / 2, y: my, size: 10, font: fonts.bold, color: theme.primary });
  my -= 24;
  if (photo.image) {
    my = drawPhotoPlain(page, photo.image, A4.w / 2 - photo.dims.width / 2, my, photo.dims);
  }
  const name = sanitize(data.fullName) || 'Biodata';
  const nw = textWidth(fonts.bold, name, 22);
  safeDraw(page, name, { x: A4.w / 2 - nw / 2, y: my, size: 22, font: fonts.bold, color: theme.primary });
  my -= 14;
  const occ = sanitize(data.occupation);
  if (occ) {
    const ow = textWidth(fonts.italic, occ, 10);
    safeDraw(page, occ, { x: A4.w / 2 - ow / 2, y: my, size: 10, font: fonts.italic, color: theme.muted });
    my -= 12;
  }
  page.drawRectangle({ x: A4.w / 2 - 45, y: my, width: 90, height: 1.5, color: theme.accent });
  my -= 22;

  const layout: Layout = { mx: 48, mw: A4.w - 96, my, centeredHeaders: true };
  drawBiodataBody({ doc, page, fonts, data, theme, layout, embeddedImage: photo.image, imageDims: photo.dims });
}

/* ── Entry point ────────────────────────────────────────────────────────── */
async function pdfFloral(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('4f5a48'),
    accent: hex('c8a7a0'),
    text: hex('252525'),
    muted: hex('656565'),
    bg: hex('fbfaf7'),
    border: hex('c8a7a0'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  // Draw background image
  const bgImage = await embedBackgroundImage(doc, 'floral');
  if (bgImage) drawBackgroundImage(page, bgImage);
  page.drawCircle({ x: A4.w - 78, y: A4.h - 110, size: 44, color: theme.accent, opacity: 0.16 });
  page.drawCircle({ x: A4.w - 42, y: A4.h - 64, size: 18, color: theme.accent, opacity: 0.22 });

  const name = sanitize(data.fullName) || 'Biodata';
  safeDraw(page, name, { x: 54, y: A4.h - 72, size: 34, font: fonts.regular, color: theme.text });

  let leftY = A4.h - 118;
  if (photo.image) leftY = drawPhotoPlain(page, photo.image, 54, leftY, photo.dims);
  const leftLayout: Layout = { mx: 54, mw: 145, my: leftY };
  const leftCtx: DrawCtx = { doc, page, fonts, data, theme, layout: leftLayout, embeddedImage: photo.image, imageDims: photo.dims };
  drawTextBlock(leftCtx, 'Lifestyle', data.hobbies || data.about);
  drawTextBlock(leftCtx, 'Expectations', data.partnerPreferences);
  drawSectionHeader(leftCtx, 'Contacts');
  drawField(leftCtx, 'Mobile', data.phone);
  drawField(leftCtx, 'Email', data.email);
  drawField(leftCtx, 'Address', data.address);

  const layout: Layout = { mx: 235, mw: A4.w - 290, my: A4.h - 130 };
  const ctx: DrawCtx = { doc, page, fonts, data, theme, layout, embeddedImage: photo.image, imageDims: photo.dims };
  drawBiodataBody(ctx, { skipContact: true });
}

async function pdfSlate(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('595550'),
    accent: hex('d9d0cb'),
    text: hex('2f2d2a'),
    muted: hex('5f5b55'),
    bg: hex('ffffff'),
    border: hex('d9d0cb'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  // Draw background image
  const bgImage = await embedBackgroundImage(doc, 'slate');
  if (bgImage) drawBackgroundImage(page, bgImage);
  page.drawRectangle({ x: 0, y: 0, width: 190, height: A4.h, color: hex('f4f1ef'), opacity: bgImage ? 0.85 : 1 });
  page.drawRectangle({ x: 158, y: A4.h - 156, width: A4.w - 158, height: 92, color: theme.primary });

  if (photo.image) {
    const dims = photo.image.scaleToFit(112, 112);
    page.drawCircle({ x: 95, y: A4.h - 96, size: 62, color: rgb(1, 1, 1) });
    page.drawImage(photo.image, { x: 95 - dims.width / 2, y: A4.h - 96 - dims.height / 2, width: dims.width, height: dims.height });
  }

  const name = (sanitize(data.fullName) || 'Biodata').toUpperCase();
  safeDraw(page, name, { x: 235, y: A4.h - 116, size: 22, font: fonts.bold, color: rgb(1, 1, 1) });

  const leftLayout: Layout = { mx: 26, mw: 138, my: A4.h - 226 };
  const leftCtx: DrawCtx = { doc, page, fonts, data, theme, layout: leftLayout, embeddedImage: photo.image, imageDims: photo.dims };
  drawTextBlock(leftCtx, 'About', data.about);
  drawTextBlock(leftCtx, 'Lifestyle', data.hobbies);
  drawSectionHeader(leftCtx, 'Contact');
  drawField(leftCtx, 'Mobile', data.phone);
  drawField(leftCtx, 'Email', data.email);

  const layout: Layout = { mx: 220, mw: A4.w - 260, my: A4.h - 200 };
  const ctx: DrawCtx = { doc, page, fonts, data, theme, layout, embeddedImage: photo.image, imageDims: photo.dims };
  drawBiodataBody(ctx, { skipContact: true });
}

async function pdfRoyal(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('006d72'),
    accent: hex('f2c078'),
    text: hex('f8e7c4'),
    muted: hex('f4d99c'),
    bg: hex('00777c'),
    border: hex('f2c078'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  // Draw background image
  const bgImage = await embedBackgroundImage(doc, 'modern');
  if (bgImage) drawBackgroundImage(page, bgImage);
  page.drawRectangle({ x: 20, y: 20, width: A4.w - 40, height: A4.h - 40, borderColor: theme.accent, borderWidth: 1.4 });
  page.drawCircle({ x: A4.w / 2, y: A4.h / 2, size: 126, borderColor: theme.accent, borderWidth: 1, opacity: 0.18 });
  page.drawCircle({ x: 56, y: A4.h - 56, size: 34, borderColor: theme.accent, borderWidth: 1.2, opacity: 0.55 });
  page.drawCircle({ x: A4.w - 56, y: 56, size: 34, borderColor: theme.accent, borderWidth: 1.2, opacity: 0.55 });

  const name = sanitize(data.fullName) || 'Biodata';
  const nw = textWidth(fonts.boldItalic, name, 25);
  safeDraw(page, name, { x: A4.w / 2 - nw / 2, y: A4.h - 62, size: 25, font: fonts.boldItalic, color: theme.accent });
  let my = A4.h - 92;
  if (photo.image) {
    const dims = photo.image.scaleToFit(104, 104);
    page.drawCircle({ x: A4.w / 2, y: my - dims.height / 2, size: 58, color: theme.accent });
    page.drawImage(photo.image, { x: A4.w / 2 - dims.width / 2, y: my - dims.height, width: dims.width, height: dims.height });
    my -= dims.height + 28;
  }

  const layout: Layout = { mx: 82, mw: A4.w - 164, my, centeredHeaders: true };
  const ctx: DrawCtx = { doc, page, fonts, data, theme, layout, embeddedImage: photo.image, imageDims: photo.dims };
  drawBiodataBody(ctx);
}

export async function generateBiodataPdf(data: BiodataForm, templateId: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${sanitize(data.fullName) || 'Biodata'} - Marriage Biodata`);
  doc.setAuthor(sanitize(data.fullName) || 'Toolioz');
  doc.setSubject('Marriage Biodata');
  doc.setProducer('Toolioz Biodata Generator');

  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  const photo = await embedPhoto(doc, data.photo);
  const id = templateId as TemplateId;

  switch (id) {
    case 'hindu':
    case 'ivory_gold':
    case 'maroon_gold':
      await pdfCulturalCentered(doc, data, fonts, photo, 'hindu');
      break;
    case 'islamic':
      await pdfCulturalCentered(doc, data, fonts, photo, 'islamic');
      break;
    case 'sikh':
    case 'navy_gold':
      await pdfCulturalCentered(doc, data, fonts, photo, 'sikh');
      break;
    case 'rose_gold':
    case 'floral':
      await pdfFloral(doc, data, fonts, photo);
      break;
    case 'classic':
      await pdfClassic(doc, data, fonts, photo);
      break;
    case 'minimalist':
      await pdfMinimalist(doc, data, fonts, photo);
      break;
    case 'slate':
      await pdfSlate(doc, data, fonts, photo);
      break;
    default:
      await pdfCulturalCentered(doc, data, fonts, photo, 'hindu');
  }

  return doc.save();
}
