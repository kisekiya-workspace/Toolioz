import type { TemplateId } from './types';
import type { BiodataMotifId } from './biodata-motifs';

export type BiodataLayoutKind = 'split' | 'centered' | 'minimal';

/** Shared theme tokens — used by HTML preview and PDF export. */
export type BiodataThemeConfig = {
  id: TemplateId;
  layout: BiodataLayoutKind;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  bg: string;
  sidebar?: string;
  onSidebar?: string;
  /** Cultural / header line above name */
  subtitle?: string;
  /** Religious symbol in header (Hindu Om, Islamic crescent, Sikh Khanda) */
  motif?: BiodataMotifId;
  /** Thin rules only — no card panels */
  pageBorder?: boolean;
  headerBar?: { top?: string; bottom?: string };
};

export const BIODATA_THEMES: Record<TemplateId, BiodataThemeConfig> = {
  modern: {
    id: 'modern',
    layout: 'split',
    primary: '#4c1d95',
    accent: '#a78bfa',
    text: '#1e293b',
    muted: '#475569',
    bg: '#ffffff',
    sidebar: '#581c87',
    onSidebar: '#ffffff',
  },
  classic: {
    id: 'classic',
    layout: 'centered',
    primary: '#8b2332',
    accent: '#8b2332',
    text: '#1c1917',
    muted: '#57534e',
    bg: '#fdfaf5',
    pageBorder: false,
  },
  minimalist: {
    id: 'minimalist',
    layout: 'minimal',
    primary: '#0f172a',
    accent: '#0f172a',
    text: '#0f172a',
    muted: '#64748b',
    bg: '#ffffff',
  },
  hindu: {
    id: 'hindu',
    layout: 'centered',
    primary: '#800000',
    accent: '#d4af37',
    text: '#431407',
    muted: '#78350f',
    bg: '#fffbf2',
    subtitle: '|| Shree Ganeshay Namah ||',
    motif: 'om',
  },
  islamic: {
    id: 'islamic',
    layout: 'centered',
    primary: '#064e3b',
    accent: '#10b981',
    text: '#064e3b',
    muted: '#047857',
    bg: '#f0fdf4',
    subtitle: 'Bismillah ir-Rahman ir-Rahim',
    motif: 'crescent',
  },
  sikh: {
    id: 'sikh',
    layout: 'centered',
    primary: '#1e3a8a',
    accent: '#f97316',
    text: '#1e3a8a',
    muted: '#1e40af',
    bg: '#f8fafc',
    subtitle: 'Ik Onkar - Waheguru Ji Ki Fateh',
    motif: 'khanda',
    headerBar: { top: '#1e3a8a', bottom: '#f97316' },
  },
};

export function getBiodataTheme(id: string): BiodataThemeConfig {
  return BIODATA_THEMES[id as TemplateId] ?? BIODATA_THEMES.modern;
}
