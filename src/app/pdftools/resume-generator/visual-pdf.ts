import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, Color } from 'pdf-lib';
import type { ResumeData } from './resume-types';

/* ═══════════════════════════════════════════════════════════════════════════
   ATS-friendly PDF generator using pdf-lib
   All text is real vector text — fully selectable and parseable by ATS.
   ═══════════════════════════════════════════════════════════════════════════ */

const hex = (h: string): Color => {
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
};

// Simple word-wrap for pdf-lib
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = text.split(/\\r?\\n/);
  const lines: string[] = [];
  
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }
    
    const cleanPara = paragraph.replace(/[\\t\\v\\f]/g, ' ').replace(/[\\x00-\\x09\\x0B-\\x1F]/g, '');
    const words = cleanPara.split(' ');
    let current = '';
    
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      try {
        if (font.widthOfTextAtSize(test, size) <= maxWidth) {
          current = test;
        } else {
          if (current) lines.push(current);
          current = word;
        }
      } catch (e) {
        const safeWord = word.replace(/[^\\x20-\\x7E\\xA0-\\xFF]/g, '?');
        const safeTest = current ? `${current} ${safeWord}` : safeWord;
        if (font.widthOfTextAtSize(safeTest, size) <= maxWidth) {
          current = safeTest;
        } else {
          if (current) lines.push(current);
          current = safeWord;
        }
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function drawWrapped(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color: Color, maxWidth: number, lineHeight: number): number {
  const lines = wrapText(text, font, size, maxWidth);
  let cy = y;
  for (const line of lines) {
    if (cy < 40) break; // page bottom guard
    page.drawText(line, { x, y: cy, size, font, color });
    cy -= lineHeight;
  }
  return cy;
}

function drawBullet(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color: Color, maxWidth: number, lineHeight: number): number {
  const bulletChar = '•  ';
  const bw = font.widthOfTextAtSize(bulletChar, size);
  page.drawText(bulletChar, { x, y, size, font, color });
  return drawWrapped(page, text, x + bw, y, font, size, color, maxWidth - bw, lineHeight);
}

interface Ctx {
  page: PDFPage;
  y: number;
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont; boldItalic: PDFFont };
}

function drawSectionHeader(ctx: Ctx, title: string, color: Color, borderColor: Color, x: number, w: number) {
  ctx.y -= 6;
  ctx.page.drawText(title.toUpperCase(), { x, y: ctx.y, size: 11, font: ctx.fonts.bold, color });
  ctx.y -= 5;
  ctx.page.drawRectangle({ x, y: ctx.y, width: w, height: 1.5, color: borderColor });
  ctx.y -= 12;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Template 1: Gradient Sidebar (teal sidebar + white body)
   ═══════════════════════════════════════════════════════════════════════════ */
async function generateSidebar(doc: PDFDocument, data: ResumeData, fonts: Ctx['fonts']) {
  const page = doc.addPage([595.28, 841.89]); // A4
  const pw = 595.28, ph = 841.89;
  const sw = 170; // sidebar width
  const accent = hex('0f766e');
  const dark = hex('0f172a');
  const mid = hex('475569');
  const light = hex('64748b');
  const white = rgb(1, 1, 1);

  // Sidebar background
  page.drawRectangle({ x: 0, y: 0, width: sw, height: ph, color: accent });

  // Sidebar content
  let sy = ph - 40;
  // Initials circle
  const initials = data.contact.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
  page.drawCircle({ x: sw / 2, y: sy - 15, size: 28, color: rgb(1, 1, 1), opacity: 0.15 });
  page.drawText(initials, { x: sw / 2 - fonts.bold.widthOfTextAtSize(initials, 18) / 2, y: sy - 22, size: 18, font: fonts.bold, color: white });
  sy -= 60;

  // Contact label
  page.drawText('CONTACT', { x: 16, y: sy, size: 8, font: fonts.bold, color: rgb(1, 1, 1) });
  sy -= 4;
  page.drawRectangle({ x: 16, y: sy, width: sw - 32, height: 0.5, color: rgb(1, 1, 1), opacity: 0.3 });
  sy -= 14;

  const contactItems = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github].filter(Boolean);
  for (const item of contactItems) {
    const lines = wrapText(item, fonts.regular, 8.5, sw - 36);
    for (const line of lines) {
      page.drawText(line, { x: 16, y: sy, size: 8.5, font: fonts.regular, color: rgb(1, 1, 1), opacity: 0.9 });
      sy -= 12;
    }
    sy -= 2;
  }

  // Skills in sidebar
  if (data.skills) {
    sy -= 8;
    page.drawText('SKILLS', { x: 16, y: sy, size: 8, font: fonts.bold, color: rgb(1, 1, 1) });
    sy -= 4;
    page.drawRectangle({ x: 16, y: sy, width: sw - 32, height: 0.5, color: rgb(1, 1, 1), opacity: 0.3 });
    sy -= 14;
    const skills = data.skills.split(',').map(s => s.trim());
    for (const skill of skills) {
      const lines = wrapText(skill, fonts.regular, 8, sw - 36);
      for (const line of lines) {
        if (sy < 30) break;
        page.drawText(line, { x: 16, y: sy, size: 8, font: fonts.regular, color: rgb(1, 1, 1), opacity: 0.85 });
        sy -= 11;
      }
    }
  }

  // Main content area
  const mx = sw + 24;
  const mw = pw - sw - 48;
  let my = ph - 40;

  // Name & headline
  page.drawText(data.contact.fullName, { x: mx, y: my, size: 22, font: fonts.bold, color: dark });
  my -= 18;
  page.drawText(data.contact.headline, { x: mx, y: my, size: 12, font: fonts.bold, color: accent });
  my -= 16;

  // Summary
  if (data.summary) {
    my = drawWrapped(page, data.summary, mx, my, fonts.regular, 9.5, mid, mw, 13);
    my -= 6;
  }

  const ctx: Ctx = { page, y: my, fonts };

  // Experience
  if (data.experience.length > 0) {
    drawSectionHeader(ctx, 'Experience', accent, hex('d1fae5'), mx, mw);
    for (const exp of data.experience) {
      // Title + dates
      page.drawText(exp.title, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const dateStr = `${exp.startDate} — ${exp.endDate}`;
      const dw = fonts.regular.widthOfTextAtSize(dateStr, 8.5);
      page.drawText(dateStr, { x: mx + mw - dw, y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.italic, color: accent });
      ctx.y -= 13;
      for (const bullet of exp.bullets.filter(Boolean)) {
        ctx.y = drawBullet(ctx.page, bullet, mx + 4, ctx.y, fonts.regular, 9, mid, mw - 8, 12);
        ctx.y -= 2;
      }
      ctx.y -= 6;
    }
  }

  // Education
  if (data.education.length > 0) {
    drawSectionHeader(ctx, 'Education', accent, hex('d1fae5'), mx, mw);
    for (const edu of data.education) {
      page.drawText(edu.degree, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${edu.startDate} — ${edu.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${edu.school}${edu.gpa ? ' — GPA: ' + edu.gpa : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.regular, color: mid });
      ctx.y -= 16;
    }
  }

  // Projects
  if (data.projects.length > 0) {
    drawSectionHeader(ctx, 'Projects', accent, hex('d1fae5'), mx, mw);
    for (const proj of data.projects) {
      page.drawText(proj.name, { x: mx, y: ctx.y, size: 10, font: fonts.bold, color: dark });
      if (proj.tech) {
        const nw = fonts.bold.widthOfTextAtSize(proj.name, 10);
        page.drawText(` (${proj.tech})`, { x: mx + nw, y: ctx.y, size: 8.5, font: fonts.regular, color: accent });
      }
      ctx.y -= 12;
      if (proj.description) {
        ctx.y = drawWrapped(ctx.page, proj.description, mx, ctx.y, fonts.regular, 9, mid, mw, 12);
      }
      ctx.y -= 8;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Template 2: Royal Navy (navy header + gold accents)
   ═══════════════════════════════════════════════════════════════════════════ */
async function generateNavy(doc: PDFDocument, data: ResumeData, fonts: Ctx['fonts']) {
  const page = doc.addPage([595.28, 841.89]);
  const pw = 595.28, ph = 841.89;
  const navy = hex('1e293b');
  const gold = hex('fbbf24');
  const dark = hex('0f172a');
  const mid = hex('475569');
  const light = hex('94a3b8');
  const white = rgb(1, 1, 1);
  const mx = 36, mw = pw - 72;

  // Header background
  const hh = 90;
  page.drawRectangle({ x: 0, y: ph - hh, width: pw, height: hh, color: navy });

  // Header text
  let hy = ph - 32;
  page.drawText(data.contact.fullName, { x: mx, y: hy, size: 22, font: fonts.bold, color: white });
  hy -= 18;
  page.drawText(data.contact.headline, { x: mx, y: hy, size: 12, font: fonts.bold, color: gold });
  hy -= 16;
  const contactStr = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github].filter(Boolean).join('   ·   ');
  page.drawText(contactStr.slice(0, 120), { x: mx, y: hy, size: 8.5, font: fonts.regular, color: rgb(1, 1, 1), opacity: 0.8 });

  let my = ph - hh - 20;

  // Summary
  if (data.summary) {
    my = drawWrapped(page, data.summary, mx, my, fonts.regular, 9.5, mid, mw, 13);
    my -= 6;
  }

  const ctx: Ctx = { page, y: my, fonts };

  if (data.experience.length > 0) {
    drawSectionHeader(ctx, 'Experience', navy, gold, mx, mw);
    for (const exp of data.experience) {
      page.drawText(exp.title, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${exp.startDate} — ${exp.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${exp.company}${exp.location ? ' · ' + exp.location : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.bold, color: navy });
      ctx.y -= 13;
      for (const b of exp.bullets.filter(Boolean)) {
        ctx.y = drawBullet(ctx.page, b, mx + 4, ctx.y, fonts.regular, 9, mid, mw - 8, 12);
        ctx.y -= 2;
      }
      ctx.y -= 6;
    }
  }

  if (data.education.length > 0) {
    drawSectionHeader(ctx, 'Education', navy, gold, mx, mw);
    for (const edu of data.education) {
      page.drawText(edu.degree, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${edu.startDate} — ${edu.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${edu.school}${edu.gpa ? ' — GPA: ' + edu.gpa : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.regular, color: mid });
      ctx.y -= 16;
    }
  }

  if (data.skills) {
    drawSectionHeader(ctx, 'Skills', navy, gold, mx, mw);
    ctx.y = drawWrapped(ctx.page, data.skills, mx, ctx.y, fonts.regular, 9.5, mid, mw, 13);
    ctx.y -= 8;
  }

  if (data.projects.length > 0) {
    drawSectionHeader(ctx, 'Projects', navy, gold, mx, mw);
    for (const proj of data.projects) {
      page.drawText(proj.name, { x: mx, y: ctx.y, size: 10, font: fonts.bold, color: dark });
      if (proj.tech) {
        const nw = fonts.bold.widthOfTextAtSize(proj.name, 10);
        page.drawText(` (${proj.tech})`, { x: mx + nw, y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      }
      ctx.y -= 12;
      if (proj.description) ctx.y = drawWrapped(ctx.page, proj.description, mx, ctx.y, fonts.regular, 9, mid, mw, 12);
      ctx.y -= 8;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Template 3: Coral Modern (centered header + coral accents)
   ═══════════════════════════════════════════════════════════════════════════ */
async function generateCoral(doc: PDFDocument, data: ResumeData, fonts: Ctx['fonts']) {
  const page = doc.addPage([595.28, 841.89]);
  const pw = 595.28, ph = 841.89;
  const coral = hex('e11d48');
  const dark = hex('0f172a');
  const mid = hex('475569');
  const light = hex('94a3b8');
  const mx = 36, mw = pw - 72;

  let my = ph - 40;

  // Centered header
  const nameW = fonts.bold.widthOfTextAtSize(data.contact.fullName, 24);
  page.drawText(data.contact.fullName, { x: (pw - nameW) / 2, y: my, size: 24, font: fonts.bold, color: dark });
  my -= 18;
  const headW = fonts.bold.widthOfTextAtSize(data.contact.headline, 12);
  page.drawText(data.contact.headline, { x: (pw - headW) / 2, y: my, size: 12, font: fonts.bold, color: coral });
  my -= 16;
  const contactStr = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github].filter(Boolean).join('   ·   ');
  const csW = fonts.regular.widthOfTextAtSize(contactStr.slice(0, 120), 8.5);
  page.drawText(contactStr.slice(0, 120), { x: (pw - csW) / 2, y: my, size: 8.5, font: fonts.regular, color: light });
  my -= 10;
  // Coral bar
  page.drawRectangle({ x: (pw - 50) / 2, y: my, width: 50, height: 2.5, color: coral });
  my -= 16;

  // Summary centered
  if (data.summary) {
    my = drawWrapped(page, data.summary, mx + 20, my, fonts.regular, 9.5, mid, mw - 40, 13);
    my -= 6;
  }

  const ctx: Ctx = { page, y: my, fonts };
  const coralBorder = hex('fecdd3');

  if (data.experience.length > 0) {
    drawSectionHeader(ctx, 'Experience', coral, coralBorder, mx, mw);
    for (const exp of data.experience) {
      page.drawText(exp.title, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${exp.startDate} — ${exp.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${exp.company}${exp.location ? ' · ' + exp.location : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.bold, color: coral });
      ctx.y -= 13;
      for (const b of exp.bullets.filter(Boolean)) {
        ctx.y = drawBullet(ctx.page, b, mx + 4, ctx.y, fonts.regular, 9, mid, mw - 8, 12);
        ctx.y -= 2;
      }
      ctx.y -= 6;
    }
  }

  if (data.education.length > 0) {
    drawSectionHeader(ctx, 'Education', coral, coralBorder, mx, mw);
    for (const edu of data.education) {
      page.drawText(edu.degree, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${edu.startDate} — ${edu.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${edu.school}${edu.gpa ? ' — GPA: ' + edu.gpa : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.regular, color: mid });
      ctx.y -= 16;
    }
  }

  if (data.skills) {
    drawSectionHeader(ctx, 'Skills', coral, coralBorder, mx, mw);
    // Skill badges as comma-separated text (ATS friendly)
    ctx.y = drawWrapped(ctx.page, data.skills, mx, ctx.y, fonts.regular, 9.5, mid, mw, 13);
    ctx.y -= 8;
  }

  if (data.projects.length > 0) {
    drawSectionHeader(ctx, 'Projects', coral, coralBorder, mx, mw);
    for (const proj of data.projects) {
      page.drawText(proj.name, { x: mx, y: ctx.y, size: 10, font: fonts.bold, color: dark });
      if (proj.tech) {
        const nw = fonts.bold.widthOfTextAtSize(proj.name, 10);
        page.drawText(` (${proj.tech})`, { x: mx + nw, y: ctx.y, size: 8.5, font: fonts.regular, color: coral });
      }
      ctx.y -= 12;
      if (proj.description) ctx.y = drawWrapped(ctx.page, proj.description, mx, ctx.y, fonts.regular, 9, mid, mw, 12);
      ctx.y -= 8;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Template 4: Classic Mono (pure B&W, centered header)
   ═══════════════════════════════════════════════════════════════════════════ */
async function generateClassicMono(doc: PDFDocument, data: ResumeData, fonts: Ctx['fonts']) {
  const page = doc.addPage([595.28, 841.89]);
  const pw = 595.28, ph = 841.89;
  const dark = hex('111827');
  const mid = hex('374151');
  const light = hex('6b7280');
  const mx = 40, mw = pw - 80;

  let my = ph - 44;

  // Header
  const nameW = fonts.bold.widthOfTextAtSize(data.contact.fullName, 24);
  page.drawText(data.contact.fullName, { x: (pw - nameW) / 2, y: my, size: 24, font: fonts.bold, color: dark });
  my -= 16;
  const headW = fonts.bold.widthOfTextAtSize(data.contact.headline, 12);
  page.drawText(data.contact.headline, { x: (pw - headW) / 2, y: my, size: 12, font: fonts.bold, color: mid });
  my -= 14;
  const contactStr = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github].filter(Boolean).join('   ·   ');
  const csW = fonts.regular.widthOfTextAtSize(contactStr.slice(0, 120), 8.5);
  page.drawText(contactStr.slice(0, 120), { x: (pw - csW) / 2, y: my, size: 8.5, font: fonts.regular, color: light });
  my -= 10;
  
  // Separator
  page.drawRectangle({ x: mx, y: my, width: mw, height: 1.5, color: dark });
  my -= 16;

  // Summary
  if (data.summary) {
    my = drawWrapped(page, data.summary, mx, my, fonts.regular, 9.5, mid, mw, 13);
    my -= 6;
  }

  const ctx: Ctx = { page, y: my, fonts };

  if (data.experience.length > 0) {
    drawSectionHeader(ctx, 'Experience', dark, dark, mx, mw);
    for (const exp of data.experience) {
      page.drawText(exp.title, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${exp.startDate} — ${exp.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${exp.company}${exp.location ? ' · ' + exp.location : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.bold, color: mid });
      ctx.y -= 13;
      for (const b of exp.bullets.filter(Boolean)) {
        ctx.y = drawBullet(ctx.page, b, mx + 4, ctx.y, fonts.regular, 9, mid, mw - 8, 12);
        ctx.y -= 2;
      }
      ctx.y -= 6;
    }
  }

  if (data.education.length > 0) {
    drawSectionHeader(ctx, 'Education', dark, dark, mx, mw);
    for (const edu of data.education) {
      page.drawText(edu.degree, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${edu.startDate} — ${edu.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${edu.school}${edu.gpa ? ' — GPA: ' + edu.gpa : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.regular, color: mid });
      ctx.y -= 16;
    }
  }

  if (data.skills) {
    drawSectionHeader(ctx, 'Skills', dark, dark, mx, mw);
    ctx.y = drawWrapped(ctx.page, data.skills, mx, ctx.y, fonts.regular, 9.5, mid, mw, 13);
    ctx.y -= 8;
  }

  if (data.projects.length > 0) {
    drawSectionHeader(ctx, 'Projects', dark, dark, mx, mw);
    for (const proj of data.projects) {
      page.drawText(proj.name, { x: mx, y: ctx.y, size: 10, font: fonts.bold, color: dark });
      if (proj.tech) {
        const nw = fonts.bold.widthOfTextAtSize(proj.name, 10);
        page.drawText(` (${proj.tech})`, { x: mx + nw, y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      }
      ctx.y -= 12;
      if (proj.description) ctx.y = drawWrapped(ctx.page, proj.description, mx, ctx.y, fonts.regular, 9, mid, mw, 12);
      ctx.y -= 8;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Template 5: Blue Professional (left-aligned, blue accents)
   ═══════════════════════════════════════════════════════════════════════════ */
async function generateBlueProfessional(doc: PDFDocument, data: ResumeData, fonts: Ctx['fonts']) {
  const page = doc.addPage([595.28, 841.89]);
  const pw = 595.28, ph = 841.89;
  const blue = hex('1d4ed8');
  const dark = hex('0f172a');
  const mid = hex('475569');
  const light = hex('94a3b8');
  const borderBlue = hex('bfdbfe');
  const mx = 40, mw = pw - 80;

  let my = ph - 40;

  // Blue top bar
  page.drawRectangle({ x: mx, y: my, width: mw, height: 4, color: blue });
  my -= 24;

  // Header
  page.drawText(data.contact.fullName, { x: mx, y: my, size: 24, font: fonts.bold, color: dark });
  my -= 16;
  page.drawText(data.contact.headline, { x: mx, y: my, size: 11, font: fonts.bold, color: blue });
  my -= 14;
  const contactStr = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github].filter(Boolean).join('   ·   ');
  page.drawText(contactStr.slice(0, 120), { x: mx, y: my, size: 8.5, font: fonts.regular, color: light });
  my -= 16;

  const ctx: Ctx = { page, y: my, fonts };

  // Summary
  if (data.summary) {
    drawSectionHeader(ctx, 'Summary', blue, borderBlue, mx, mw);
    ctx.y = drawWrapped(ctx.page, data.summary, mx, ctx.y, fonts.regular, 9.5, mid, mw, 13);
    ctx.y -= 6;
  }

  if (data.experience.length > 0) {
    drawSectionHeader(ctx, 'Experience', blue, borderBlue, mx, mw);
    for (const exp of data.experience) {
      page.drawText(exp.title, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${exp.startDate} — ${exp.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${exp.company}${exp.location ? ' · ' + exp.location : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.bold, color: blue });
      ctx.y -= 13;
      for (const b of exp.bullets.filter(Boolean)) {
        ctx.y = drawBullet(ctx.page, b, mx + 4, ctx.y, fonts.regular, 9, mid, mw - 8, 12);
        ctx.y -= 2;
      }
      ctx.y -= 6;
    }
  }

  if (data.education.length > 0) {
    drawSectionHeader(ctx, 'Education', blue, borderBlue, mx, mw);
    for (const edu of data.education) {
      page.drawText(edu.degree, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${edu.startDate} — ${edu.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${edu.school}${edu.gpa ? ' — GPA: ' + edu.gpa : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.regular, color: mid });
      ctx.y -= 16;
    }
  }

  if (data.skills) {
    drawSectionHeader(ctx, 'Skills', blue, borderBlue, mx, mw);
    ctx.y = drawWrapped(ctx.page, data.skills, mx, ctx.y, fonts.regular, 9.5, mid, mw, 13);
    ctx.y -= 8;
  }

  if (data.projects.length > 0) {
    drawSectionHeader(ctx, 'Projects', blue, borderBlue, mx, mw);
    for (const proj of data.projects) {
      page.drawText(proj.name, { x: mx, y: ctx.y, size: 10, font: fonts.bold, color: dark });
      if (proj.tech) {
        const nw = fonts.bold.widthOfTextAtSize(proj.name, 10);
        page.drawText(` (${proj.tech})`, { x: mx + nw, y: ctx.y, size: 8.5, font: fonts.regular, color: blue });
      }
      ctx.y -= 12;
      if (proj.description) ctx.y = drawWrapped(ctx.page, proj.description, mx, ctx.y, fonts.regular, 9, mid, mw, 12);
      ctx.y -= 8;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Template 6: Emerald Executive (green background top bar)
   ═══════════════════════════════════════════════════════════════════════════ */
async function generateEmeraldExecutive(doc: PDFDocument, data: ResumeData, fonts: Ctx['fonts']) {
  const page = doc.addPage([595.28, 841.89]);
  const pw = 595.28, ph = 841.89;
  const green = hex('059669');
  const dark = hex('0f172a');
  const mid = hex('475569');
  const light = hex('94a3b8');
  const borderGreen = hex('a7f3d0');
  const mx = 40, mw = pw - 80;

  // Header background
  const hh = 100;
  page.drawRectangle({ x: 0, y: ph - hh, width: pw, height: hh, color: hex('f0fdf4') });
  // Green accent line at the bottom of the header
  page.drawRectangle({ x: 0, y: ph - hh, width: pw, height: 3, color: green });

  let my = ph - 36;
  page.drawText(data.contact.fullName, { x: mx, y: my, size: 24, font: fonts.bold, color: dark });
  my -= 16;
  page.drawText(data.contact.headline, { x: mx, y: my, size: 11, font: fonts.bold, color: green });
  my -= 14;
  const contactStr = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github].filter(Boolean).join('   ·   ');
  page.drawText(contactStr.slice(0, 120), { x: mx, y: my, size: 8.5, font: fonts.regular, color: mid });
  
  my = ph - hh - 20;

  // Summary
  if (data.summary) {
    my = drawWrapped(page, data.summary, mx, my, fonts.regular, 9.5, mid, mw, 13);
    my -= 6;
  }

  const ctx: Ctx = { page, y: my, fonts };

  if (data.experience.length > 0) {
    drawSectionHeader(ctx, 'Experience', green, borderGreen, mx, mw);
    for (const exp of data.experience) {
      page.drawText(exp.title, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${exp.startDate} — ${exp.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${exp.company}${exp.location ? ' · ' + exp.location : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.bold, color: green });
      ctx.y -= 13;
      for (const b of exp.bullets.filter(Boolean)) {
        ctx.y = drawBullet(ctx.page, b, mx + 4, ctx.y, fonts.regular, 9, mid, mw - 8, 12);
        ctx.y -= 2;
      }
      ctx.y -= 6;
    }
  }

  if (data.education.length > 0) {
    drawSectionHeader(ctx, 'Education', green, borderGreen, mx, mw);
    for (const edu of data.education) {
      page.drawText(edu.degree, { x: mx, y: ctx.y, size: 10.5, font: fonts.bold, color: dark });
      const ds = `${edu.startDate} — ${edu.endDate}`;
      page.drawText(ds, { x: mx + mw - fonts.regular.widthOfTextAtSize(ds, 8.5), y: ctx.y, size: 8.5, font: fonts.regular, color: light });
      ctx.y -= 13;
      page.drawText(`${edu.school}${edu.gpa ? ' — GPA: ' + edu.gpa : ''}`, { x: mx, y: ctx.y, size: 9, font: fonts.regular, color: mid });
      ctx.y -= 16;
    }
  }

  if (data.skills) {
    drawSectionHeader(ctx, 'Skills', green, borderGreen, mx, mw);
    ctx.y = drawWrapped(ctx.page, data.skills, mx, ctx.y, fonts.regular, 9.5, mid, mw, 13);
    ctx.y -= 8;
  }

  if (data.projects.length > 0) {
    drawSectionHeader(ctx, 'Projects', green, borderGreen, mx, mw);
    for (const proj of data.projects) {
      page.drawText(proj.name, { x: mx, y: ctx.y, size: 10, font: fonts.bold, color: dark });
      if (proj.tech) {
        const nw = fonts.bold.widthOfTextAtSize(proj.name, 10);
        page.drawText(` (${proj.tech})`, { x: mx + nw, y: ctx.y, size: 8.5, font: fonts.regular, color: green });
      }
      ctx.y -= 12;
      if (proj.description) ctx.y = drawWrapped(ctx.page, proj.description, mx, ctx.y, fonts.regular, 9, mid, mw, 12);
      ctx.y -= 8;
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main entry point
   ═══════════════════════════════════════════════════════════════════════════ */
export async function generateVisualPdf(data: ResumeData, templateId: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${data.contact.fullName} - Resume`);
  doc.setAuthor(data.contact.fullName);
  doc.setSubject('Resume');
  doc.setProducer('Toolioz Resume Builder');

  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  switch (templateId) {
    case 'gradient-sidebar':   await generateSidebar(doc, data, fonts); break;
    case 'royal-navy':         await generateNavy(doc, data, fonts); break;
    case 'coral-modern':       await generateCoral(doc, data, fonts); break;
    case 'classic-mono':       await generateClassicMono(doc, data, fonts); break;
    case 'blue-professional':  await generateBlueProfessional(doc, data, fonts); break;
    case 'emerald-executive':  await generateEmeraldExecutive(doc, data, fonts); break;
    default:                   await generateClassicMono(doc, data, fonts); break;
  }

  return doc.save();
}
