import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, Color } from 'pdf-lib';
import type { BiodataForm } from './types';
import type { TemplateId } from './types';
import { MOTIF_SVG_PATHS, MOTIF_UNICODE, type BiodataMotifId } from './biodata-motifs';

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
    primary: hex('4c1d95'),
    accent: hex('a78bfa'),
    text: hex('1e293b'),
    muted: hex('475569'),
    bg: hex('ffffff'),
    border: hex('c4b5fd'),
    sidebar: hex('581c87'),
    onSidebar: rgb(1, 1, 1),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });
  const sw = 185;
  page.drawRectangle({ x: 0, y: 0, width: sw, height: A4.h, color: theme.sidebar! });

  const name = sanitize(data.fullName) || 'Biodata';
  let sy = A4.h - 36;
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

  const layout: Layout = { mx: sw + 22, mw: A4.w - sw - 44, my: A4.h - 36 };
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
  safeDraw(page, 'MARRIAGE BIODATA', { x: layout.mx, y: layout.my, size: 8, font: fonts.bold, color: theme.primary });
  layout.my -= 14;
  drawBiodataBody(ctx, { skipSidebarFields: true, skipContact: true });
}

/* ── Template: Classic Centered ───────────────────────────────────────── */
async function pdfClassic(doc: PDFDocument, data: BiodataForm, fonts: Fonts, photo: Awaited<ReturnType<typeof embedPhoto>>) {
  const page = doc.addPage([A4.w, A4.h]);
  const theme: Theme = {
    primary: hex('8b2332'),
    accent: hex('8b2332'),
    text: hex('1c1917'),
    muted: hex('57534e'),
    bg: hex('fdfaf5'),
    border: hex('8b2332'),
  };
  page.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: theme.bg });

  let my = A4.h - 42;
  const hdr = 'BIODATA';
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
    case 'modern':
      await pdfModern(doc, data, fonts, photo);
      break;
    case 'classic':
      await pdfClassic(doc, data, fonts, photo);
      break;
    case 'minimalist':
      await pdfMinimalist(doc, data, fonts, photo);
      break;
    case 'hindu':
      await pdfCulturalCentered(doc, data, fonts, photo, 'hindu');
      break;
    case 'islamic':
      await pdfCulturalCentered(doc, data, fonts, photo, 'islamic');
      break;
    case 'sikh':
      await pdfCulturalCentered(doc, data, fonts, photo, 'sikh');
      break;
    default:
      await pdfModern(doc, data, fonts, photo);
  }

  return doc.save();
}
