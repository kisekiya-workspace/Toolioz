import {
  TrendingUp,
  HomeIcon,
  Landmark,
  PiggyBank,
  Briefcase,
  Percent,
  CreditCard,
  Banknote,
  Car,
  Wallet,
  FileText,
  FileJson,
  Binary,
  Code,
  FileSearch,
  Coins,
  Hash,
  ImagePlus,
  Key,
  Clock,
  SearchCode,
  Link as LinkIcon,
  Asterisk,
  LayoutDashboard,
  Palette,
  Target,
  Terminal,
  TrendingDown,
  UserRound,
  Sparkles,
  Pencil,
  Scissors,
  RotateCcw,
  BadgePercent,
  GraduationCap,
  Trophy,
  Scale,
  Activity,
  Sigma,
  type LucideIcon
} from 'lucide-react';
import { NEW_DEV_TOOLS, NEW_PDF_TOOLS } from '@/lib/new-tool-catalog';
import { ADSENSE_INDEX_TOOL_IDS, ADSENSE_NOINDEX_HOWTO_SLUGS } from '@/lib/adsense-catalog';
import { TOOLS as LEGACY_TOOLS } from '@/data/sociials-tools';
import { canonicalToolPath, CHANGING_RULES_NOINDEX_PATHS, PAUSED_TOOL_PATHS, TOOL_ALIASES, WITHHELD_TOOL_PATHS } from '@/lib/tool-routes';

export type Category = 'finance' | 'devtools' | 'design' | 'pdftools' | 'biodata' | 'utility';

export interface Tool {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  color: string;
  category: Category;
  isTrending?: boolean;
}

export const TOOLS: Tool[] = [
  {
    id: 'background-remover',
    title: 'Background Remover',
    desc: 'Remove simple backgrounds locally, refine with brushes, and export a transparent PNG.',
    icon: Scissors,
    href: '/design/background-remover',
    color: '#047857',
    category: 'design',
  },
  // ═══ FINANCE TOOLS ═══
  { id: 'unit-converter', title: 'Unit Converter', desc: 'Convert length, mass, temperature, and binary data units.', icon: Scale, href: '/devtools/unit-converter', color: '#0f766e', category: 'utility' },
  { id: 'lorem-ipsum', title: 'Lorem Ipsum Generator', desc: 'Generate placeholder paragraphs, words, or HTML for design mockups.', icon: FileText, href: '/devtools/lorem-ipsum', color: '#0369a1', category: 'utility' },
  { id: 'image-compressor', title: 'Image Compressor', desc: 'Reduce image size with adjustable quality and target-size controls.', icon: ImagePlus, href: '/pdftools/image-compressor', color: '#0891b2', category: 'design' },
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    desc: 'Future value with daily, monthly, quarterly, or annual compounding.',
    icon: TrendingUp,
    href: '/finance/compound-interest',
    color: '#3b82f6',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'mortgage-calculator',
    title: 'Mortgage Calc',
    desc: 'Monthly mortgage payment, total interest, and payoff for a balance, rate, and term.',
    icon: HomeIcon,
    href: '/finance/mortgage-calculator',
    color: '#0ea5e9',
    category: 'finance'
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator',
    desc: 'Measure the profitability of an investment quickly.',
    icon: Briefcase,
    href: '/finance/roi-calculator',
    color: '#10b981',
    category: 'finance'
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    desc: 'Wealth generation through systematic monthly investments.',
    icon: Percent,
    href: '/finance/sip-calculator',
    color: '#2563eb',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'lumpsum-calculator',
    title: 'Lumpsum Calculator',
    desc: 'Project how a one-time investment can grow with compounding.',
    icon: Coins,
    href: '/finance/lumpsum-calculator',
    color: '#0f766e',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'gst-calculator',
    title: 'GST/Tax Calc',
    desc: 'Calculate tax amounts and total costs in seconds.',
    icon: CreditCard,
    href: '/finance/gst-calculator',
    color: '#475569',
    category: 'finance'
  },
  {
    id: 'fd-calculator',
    title: 'Fixed Deposit',
    desc: 'Estimate maturity value for a fixed-rate bank deposit.',
    icon: Banknote,
    href: '/finance/fd-calculator',
    color: '#0369a1',
    category: 'finance'
  },
  {
    id: 'savings-goal',
    title: 'Savings Goal',
    desc: 'Monthly deposit that grows a balance to a target by a deadline.',
    icon: PiggyBank,
    href: '/finance/savings-goal',
    color: '#f59e0b',
    category: 'finance'
  },
  {
    id: 'retirement-corpus',
    title: 'Retirement Corpus',
    desc: 'Corpus that can fund inflation-adjusted spending for a chosen number of years.',
    icon: Target,
    href: '/finance/retirement-corpus',
    color: '#d97706',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'inflation-calculator',
    title: 'Inflation Calc',
    desc: 'Future price and purchasing-power change after a chosen inflation rate and number of years.',
    icon: Landmark,
    href: '/finance/inflation-calculator',
    color: '#ef4444',
    category: 'finance'
  },
  {
    id: 'loan-prepayment',
    title: 'Loan Prepayment',
    desc: 'Interest saved and months removed when an extra EMI or principal payment is applied.',
    icon: TrendingDown,
    href: '/finance/loan-prepayment',
    color: '#dc2626',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'car-loan',
    title: 'Car Loan EMI',
    desc: 'Reducing-balance car-loan EMI, total interest, and total amount payable.',
    icon: Car,
    href: '/finance/car-loan',
    color: '#06b6d4',
    category: 'finance'
  },
  {
    id: 'income-tax',
    title: 'Income Tax',
    desc: 'Professional Old vs New regime tax comparison & planning.',
    icon: Wallet,
    href: '/finance/income-tax',
    color: '#2563eb',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'income-computation-from-json',
    title: 'Income Computation from JSON',
    desc: 'Upload or paste income JSON and generate a clear taxable-income computation summary locally.',
    icon: FileJson,
    href: '/finance/income-computation-from-json',
    color: '#0f766e',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'itr-json-to-computation-pdf',
    title: 'ITR JSON to Computation PDF',
    desc: 'Reads ITR-1 through ITR-4 summary fields from JSON and builds a computation PDF. The JSON is not uploaded.',
    icon: FileText,
    href: '/finance/itr-json-to-computation-pdf',
    color: '#b45309',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'form-16-to-json',
    title: 'Form 16 to JSON Converter',
    desc: 'Convert copied Form 16 text or a structured file into clean JSON for tax workflows.',
    icon: FileJson,
    href: '/finance/form-16-to-json',
    color: '#7c3aed',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    desc: 'Find a percentage of a number or what percent one value is of another, with steps.',
    icon: Percent,
    href: '/finance/percentage-calculator',
    color: '#2563eb',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'percentage-change-calculator',
    title: 'Percentage Change',
    desc: 'Calculate percentage increase or decrease from an original value to a new value.',
    icon: TrendingUp,
    href: '/finance/percentage-change-calculator',
    color: '#0891b2',
    category: 'finance'
  },
  {
    id: 'reverse-percentage-calculator',
    title: 'Reverse Percentage',
    desc: 'Recover an original amount before a percentage increase or decrease.',
    icon: RotateCcw,
    href: '/finance/reverse-percentage-calculator',
    color: '#0f766e',
    category: 'finance'
  },
  {
    id: 'discount-calculator-after-tax',
    title: 'Discount After Tax',
    desc: 'Break down sale savings, tax on the reduced price, and the final amount.',
    icon: BadgePercent,
    href: '/finance/discount-calculator-after-tax',
    color: '#d97706',
    category: 'finance'
  },
  {
    id: 'grade-percentage-calculator', title: 'Grade Percentage Calculator',
    desc: 'Convert points or marks earned into a percentage and indicative letter grade.',
    icon: GraduationCap, href: '/finance/grade-percentage-calculator', color: '#4f46e5', category: 'finance', isTrending: true
  },
  {
    id: 'win-percentage-calculator', title: 'Win Percentage Calculator',
    desc: 'Calculate winning percentage from wins, losses, and ties or draws.',
    icon: Trophy, href: '/finance/win-percentage-calculator', color: '#ca8a04', category: 'finance'
  },
  {
    id: 'weight-loss-percentage-calculator', title: 'Weight Loss Percentage',
    desc: 'Measure percentage of starting body weight lost or gained.',
    icon: Scale, href: '/finance/weight-loss-percentage-calculator', color: '#059669', category: 'finance'
  },
  {
    id: 'body-fat-percentage-calculator', title: 'Body Fat Percentage',
    desc: 'Estimate body-fat percentage with the U.S. Navy circumference method.',
    icon: Activity, href: '/finance/body-fat-percentage-calculator', color: '#e11d48', category: 'finance'
  },
  {
    id: 'average-percentage-calculator', title: 'Average Percentage',
    desc: 'Find the arithmetic mean of multiple percentage values.',
    icon: Sigma, href: '/finance/average-percentage-calculator', color: '#0284c7', category: 'finance'
  },

  // ═══ DEVELOPER TOOLS ═══
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    desc: 'Formats, validates, and minifies JSON, and can emit YAML or TypeScript.',
    icon: Code,
    href: '/devtools/json-formatter',
    color: '#f59e0b',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'base64-converter',
    title: 'Base64 Converter',
    desc: 'Encode and decode strings to and from Base64 format.',
    icon: Binary,
    href: '/devtools/base64-converter',
    color: '#3b82f6',
    category: 'devtools'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    desc: 'Decode, verify and inspect JSON Web Tokens securely.',
    icon: Key,
    href: '/devtools/jwt-decoder',
    color: '#f43f5e',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'cron-generator',
    title: 'Cron Generator',
    desc: 'Generate, parse and explain cron expression schedules.',
    icon: Clock,
    href: '/devtools/cron-generator',
    color: '#0d9488',
    category: 'devtools'
  },
  {
    id: 'regex-tester',
    title: 'RegExp Tester',
    desc: 'Test and debug Regular Expressions with live highlighting.',
    icon: SearchCode,
    href: '/devtools/regex-tester',
    color: '#10b981',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder',
    desc: 'Encode and decode URLs or URI components instantly.',
    icon: LinkIcon,
    href: '/devtools/url-encoder',
    color: '#3b82f6',
    category: 'devtools'
  },
  {
    id: 'bcrypt-generator',
    title: 'Bcrypt Generator',
    desc: 'Generate and verify Bcrypt password hashes securely.',
    icon: Asterisk,
    href: '/devtools/bcrypt-generator',
    color: '#f59e0b',
    category: 'devtools'
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    desc: 'Generate SHA hashes for text or files using Web Crypto APIs.',
    icon: Hash,
    href: '/devtools/hash-generator',
    color: '#16a34a',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'curl-converter',
    title: 'cURL Converter',
    desc: 'Convert cURL commands into Fetch, Axios, and Python snippets.',
    icon: Terminal,
    href: '/devtools/curl-converter',
    color: '#1d4ed8',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    desc: 'Convert Unix seconds, milliseconds, and date strings instantly.',
    icon: Clock,
    href: '/devtools/timestamp-converter',
    color: '#d97706',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'json-diff',
    title: 'JSON Diff Checker',
    desc: 'Compare two JSON payloads and inspect exact field-level changes.',
    icon: SearchCode,
    href: '/devtools/json-diff',
    color: '#0f766e',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    desc: 'Generate secure v4 UUIDs in bulk effortlessly.',
    icon: Hash,
    href: '/devtools/uuid-generator',
    color: '#10b981',
    category: 'devtools'
  },

  // ═══ DESIGN & CREATIVE STUDIO ═══
  {
    id: 'drawesome',
    title: 'Drawesome Vector Studio ✦ (by Benji Taylor)',
    desc: 'Freehand vector drawing canvas with 7 realistic pens (pencil, ballpoint, fineliner, marker, highlighter, brush, fountain pen), area eraser, and SVG/PNG export.',
    icon: Pencil,
    href: '/devtools/drawesome',
    color: '#06b6d4',
    category: 'design',
    isTrending: true
  },
  {
    id: 'ditherit',
    title: 'ditherit ✦ Interactive ASCII & Dot Art (by Prasanjit Dey)',
    desc: 'Convert images, videos, and GIFs into dithered dot art or ASCII with interactive physics repulsion, WebM export, and React/JS code export.',
    icon: Sparkles,
    href: '/devtools/ditherit',
    color: '#4f46e5',
    category: 'design',
    isTrending: true
  },
  {
    id: 'dither-studio',
    title: 'Image & Video Dither Studio',
    desc: 'Apply retro 1-bit, Floyd-Steinberg, Bayer ordered, GameBoy, CGA, and pixel art dithering to images and videos live in browser.',
    icon: Palette,
    href: '/devtools/dither-studio',
    color: '#ec4899',
    category: 'design',
    isTrending: true
  },
  {
    id: 'shader-tool',
    title: 'WebGL GLSL Shader Studio',
    desc: 'Interactive real-time GLSL fragment shader editor & playground. Live preview, Shadertoy uniforms, raymarching SDFs, presets, and code export.',
    icon: Sparkles,
    href: '/devtools/shader-tool',
    color: '#8b5cf6',
    category: 'design',
    isTrending: true
  },
  {
    id: 'background-generator',
    title: 'Free Shader Background Generator',
    desc: 'Design beautiful animated shader-based background images for wallpapers, social headers, and website hero sections.',
    icon: LayoutDashboard,
    href: '/devtools/background-generator',
    color: '#a855f7',
    category: 'design',
    isTrending: true
  },
  {
    id: 'x-hidden-image',
    title: 'X Tap-to-Reveal PNG Maker',
    desc: 'Tap-to-reveal PNG for X and Twitter. Timeline preview versus opened view, brush masks, PNG8.',
    icon: ImagePlus,
    href: '/devtools/x-hidden-image',
    color: '#0f172a',
    category: 'design',
  },
  {
    id: 'split-image-in-3',
    title: 'Split Image in 3',
    desc: 'Crop a photo to 16:9 and split it into 3 equal vertical parts for X, Instagram, and carousels. Client-side PNG export.',
    icon: Scissors,
    href: '/design/split-image-in-3',
    color: '#ea580c',
    category: 'design',
    isTrending: true
  },
  {
    id: 'color-converter',
    title: 'Color Format Suite',
    desc: 'Convert seamlessly between HEX, RGB, HSL and CMYK color codes with palette generation.',
    icon: Palette,
    href: '/devtools/color-converter',
    color: '#2563eb',
    category: 'design',
    isTrending: true
  },
  {
    id: 'layout-generator',
    title: 'CSS Grid Builder',
    desc: 'Visually build CSS Grid layouts with rows, columns, gaps, and code export.',
    icon: LayoutDashboard,
    href: '/devtools/layout-generator',
    color: '#0ea5e9',
    category: 'design',
    isTrending: true
  },

  // ═══ PDF & RESUME UTILITIES ═══
  {
    id: 'merge-pdf',
    title: 'PDF Merge Tool',
    desc: 'Combines PDF files in the chosen order. The files stay in the browser.',
    icon: FileText,
    href: '/pdftools/merge-pdf',
    color: '#ef4444',
    category: 'pdftools',
    isTrending: true
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    desc: 'Renders each PDF page as a PNG or JPEG in the browser.',
    icon: FileSearch,
    href: '/pdftools/pdf-to-image',
    color: '#f97316',
    category: 'pdftools',
    isTrending: true
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    desc: 'Combines JPG, PNG, and WebP images into one PDF in the browser.',
    icon: ImagePlus,
    href: '/pdftools/image-to-pdf',
    color: '#10b981',
    category: 'pdftools',
    isTrending: true
  },
  {
    id: 'split-pdf',
    title: 'Split PDF & Extract Pages',
    desc: 'Extracts selected pages or ranges with pdf-lib. The PDF is not uploaded.',
    icon: Scissors,
    href: '/pdftools/split-pdf',
    color: '#8b5cf6',
    category: 'pdftools',
    isTrending: true
  },
  {
    id: 'resume-generator',
    title: 'ATS Resume Generator',
    desc: 'Create polished resumes with a live LaTeX editor and text-based PDF export.',
    icon: Briefcase,
    href: '/pdftools/resume-generator',
    color: '#111827',
    category: 'pdftools',
    isTrending: true
  },
  ...NEW_PDF_TOOLS.map((tool) => ({
    id: tool.slug,
    title: tool.shortTitle,
    desc: tool.description,
    icon: FileText,
    href: tool.path,
    color: '#0f766e',
    category: 'pdftools' as const,
    isTrending: ['organize', 'page-numbers', 'text'].includes(tool.mode),
  })),
  ...NEW_DEV_TOOLS.map((tool) => ({
    id: tool.slug,
    title: tool.shortTitle,
    desc: tool.description,
    icon: tool.group === 'image' ? ImagePlus : tool.group === 'seo' ? SearchCode : Code,
    href: tool.path,
    color: tool.group === 'image' ? '#0891b2' : tool.group === 'seo' ? '#0f766e' : '#d97706',
    category: (tool.group === 'image' ? 'design' : 'devtools') as Category,
    isTrending: ['ocr', 'yaml-json', 'utm', 'schema'].includes(tool.mode),
  })),
  // ═══ BIODATA TOOLS ═══
  {
    id: 'biodata-generator',
    title: 'Biodata Generator',
    desc: 'Create marriage biodata PDFs with religion-based and modern templates.',
    icon: UserRound,
    href: '/biodata',
    color: '#db2777',
    category: 'biodata',
    isTrending: true
  }
];

const legacyCategories: Record<string, Category> = {
  Finance: 'finance', PDF: 'pdftools', Developer: 'devtools', Security: 'devtools',
  Design: 'design', Media: 'design', Social: 'design', Writing: 'utility',
};
const existingPaths = new Set(TOOLS.map(tool => canonicalToolPath(tool.href)));
const restoredLegacyTools: Tool[] = LEGACY_TOOLS
  .filter(tool => !existingPaths.has(canonicalToolPath(tool.href)) && !TOOL_ALIASES[tool.href])
  .map(tool => ({
    id: tool.href.split('/').pop()!, title: tool.title, desc: tool.description,
    href: tool.href, icon: tool.icon, category: legacyCategories[tool.category] ?? 'utility',
    color: '#0369a1', isTrending: tool.popular,
  }));

/** One discoverable entry per task. Visibility is independent of advertising approval. */
export const PUBLIC_TOOLS: Tool[] = Array.from(new Map([...TOOLS, ...restoredLegacyTools]
  .filter(tool => !TOOL_ALIASES[tool.href] && !PAUSED_TOOL_PATHS.has(tool.href) && !WITHHELD_TOOL_PATHS.has(tool.href) && !CHANGING_RULES_NOINDEX_PATHS.has(tool.href))
  .map(tool => {
    const canonical = canonicalToolPath(tool.href);
    return [canonical, { ...tool, href: canonical }] as const;
  })).values());
// Resume lives at its preferred public URL; retain its ID for related links and ad eligibility.
const resume = TOOLS.find(tool => tool.id === 'resume-generator');
if (resume) PUBLIC_TOOLS.push({ ...resume, href: '/resume-builder' });

/** Kept for existing consumers; this is a catalog, not an AdSense approval claim. */
export const PUBLISHER_READY_TOOLS = PUBLIC_TOOLS;
export const INDEXABLE_TOOLS = PUBLIC_TOOLS;

const INDEXABLE_TOOL_PATHS = new Set(INDEXABLE_TOOLS.map((tool) => tool.href));

const ADSENSE_AD_PATHS = new Set(
  PUBLIC_TOOLS.filter((tool) => ADSENSE_INDEX_TOOL_IDS.has(tool.id)).map((tool) => tool.href),
);
ADSENSE_AD_PATHS.add('/resume-builder');

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, '') || '/';
}

function isToolPagePath(path: string): boolean {
  if (path === '/biodata' || path === '/resume-builder') return true;
  return /^\/(finance|devtools|design|pdftools|biodata)\/.+/.test(path) && !path.includes('/blog/');
}

/** Compatibility helper for ad components; catalog restoration does not enable ads. */
export function isLowValuePublisherPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (path === '/tools' || path.startsWith('/tools/')) return true;
  if (path === '/top5' || path.startsWith('/top5/')) return true;
  if (path.startsWith('/how-to/')) {
    const slug = path.slice('/how-to/'.length);
    if (ADSENSE_NOINDEX_HOWTO_SLUGS.has(slug)) return true;
  }
  if (TOOL_ALIASES[path] || PAUSED_TOOL_PATHS.has(path) || WITHHELD_TOOL_PATHS.has(path) || CHANGING_RULES_NOINDEX_PATHS.has(path)) return true;
  return isToolPagePath(path) && !INDEXABLE_TOOL_PATHS.has(path);
}

/** Ads only on original article URLs and non-tool publisher pages. Never on duplicates or unfinished workbench tools. */
export function isAdSenseEligiblePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (isLowValuePublisherPath(path)) return false;
  if (isToolPagePath(path)) {
    return ADSENSE_AD_PATHS.has(path);
  }
  return true;
}

export const CATEGORIES = [
  {
    id: 'finance',
    title: 'Finance Tools',
    desc: 'Calculators for tax, investments, and personal finance.',
    color: '#3b82f6',
    icon: Landmark
  },
  {
    id: 'devtools',
    title: 'Developer Tools',
    desc: 'Utilities for coding, formatting, security, and data conversion.',
    color: '#f59e0b',
    icon: Code
  },
  {
    id: 'design',
    title: 'Design & Creative Studio',
    desc: 'Drawing, dithering, shaders, colors, images, and creative export tools.',
    color: '#06b6d4',
    icon: Palette
  },
  {
    id: 'pdftools',
    title: 'PDF Utilities',
    desc: 'Merge, split, and convert PDFs in the browser. Resume export is a separate page.',
    color: '#ef4444',
    icon: FileText
  },
  {
    id: 'utility',
    title: 'Everyday Utilities',
    desc: 'Text, time, measurement, and everyday calculation tools.',
    color: '#0f766e',
    icon: Clock,
  },
  {
    id: 'biodata',
    title: 'Biodata Tools',
    desc: 'Marriage biodata builders with cultural, traditional, and modern layouts.',
    color: '#db2777',
    icon: UserRound
  }
];
