import type { TemplateId } from './types';
import type { BiodataMotifId } from './biodata-motifs';

export type BiodataLayoutKind = 'split' | 'centered' | 'minimal' | 'floral' | 'banner' | 'ornate';

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
    primary: '#12343b',
    accent: '#d79a2b',
    text: '#1f2937',
    muted: '#4b5563',
    bg: '#fbfaf7',
    sidebar: '#12343b',
    onSidebar: '#fbfaf7',
  },
  classic: {
    id: 'classic',
    layout: 'centered',
    primary: '#17324d',
    accent: '#b8860b',
    text: '#202124',
    muted: '#4f5b62',
    bg: '#f8f5ef',
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
  floral: {
    id: 'floral',
    layout: 'floral',
    primary: '#4f5a48',
    accent: '#c8a7a0',
    text: '#252525',
    muted: '#656565',
    bg: '#fbfaf7',
  },
  slate: {
    id: 'slate',
    layout: 'banner',
    primary: '#595550',
    accent: '#d9d0cb',
    text: '#2f2d2a',
    muted: '#5f5b55',
    bg: '#f4f1ef',
  },
  royal: {
    id: 'royal',
    layout: 'ornate',
    primary: '#006d72',
    accent: '#f2c078',
    text: '#f8e7c4',
    muted: '#f4d99c',
    bg: '#00777c',
  },
};

export function getBiodataTheme(id: string): BiodataThemeConfig {
  return BIODATA_THEMES[id as TemplateId] ?? BIODATA_THEMES.modern;
}
