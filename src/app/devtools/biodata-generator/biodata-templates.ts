import type { ComponentType } from 'react';
import type { BiodataForm, TemplateId } from './types';
import { HinduTemplate } from './templates/HinduTemplate';
import { IvoryGoldTemplate } from './templates/IvoryGoldTemplate';
import { MaroonGoldTemplate } from './templates/MaroonGoldTemplate';
import { RoseGoldTemplate } from './templates/RoseGoldTemplate';
import { NavyGoldTemplate } from './templates/NavyGoldTemplate';
import { IslamicTemplate } from './templates/IslamicTemplate';
import { SikhTemplate } from './templates/SikhTemplate';
import { ClassicCenteredTemplate } from './templates/ClassicCenteredTemplate';
import { FloralEditorialTemplate } from './templates/FloralEditorialTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { ModernSplitTemplate } from './templates/ModernSplitTemplate';
import { SlateBannerTemplate } from './templates/SlateBannerTemplate';

export type BiodataTemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
  accentClass: string;
  component: ComponentType<{ data: BiodataForm }>;
  community: 'Hindu' | 'Muslim' | 'Sikh' | 'Universal';
  style: 'Traditional' | 'Royal' | 'Modern' | 'Minimal';
};

export const BIODATA_TEMPLATES: BiodataTemplateMeta[] = [
  {
    id: 'hindu',
    name: 'Hindu Traditional (Ganesh Om)',
    description: 'Auspicious saffron and maroon layout with || Shree Ganeshay Namah || header.',
    accentClass: 'bg-amber-100 text-amber-900',
    component: HinduTemplate,
    community: 'Hindu',
    style: 'Traditional',
  },
  {
    id: 'ivory_gold',
    name: 'Royal Ivory & Gold',
    description: 'Luxury antique parchment tone with ornate gold double frame and circular photo ring.',
    accentClass: 'bg-yellow-100 text-yellow-900',
    component: IvoryGoldTemplate,
    community: 'Universal',
    style: 'Royal',
  },
  {
    id: 'maroon_gold',
    name: 'Maroon & Gold Classic',
    description: 'Rich royal maroon with gold dividers and clear structured family heritage sections.',
    accentClass: 'bg-red-100 text-red-900',
    component: MaroonGoldTemplate,
    community: 'Universal',
    style: 'Royal',
  },
  {
    id: 'rose_gold',
    name: 'Rose Gold Matrimonial',
    description: 'Soft blush background with rose-gold framing, oval portrait, and romantic botanical accents.',
    accentClass: 'bg-rose-100 text-rose-900',
    component: RoseGoldTemplate,
    community: 'Universal',
    style: 'Royal',
  },
  {
    id: 'navy_gold',
    name: 'Royal Navy & Gold',
    description: 'Formal navy blue and gold border presentation with centered matrimonial header.',
    accentClass: 'bg-blue-100 text-blue-900',
    component: NavyGoldTemplate,
    community: 'Universal',
    style: 'Royal',
  },
  {
    id: 'islamic',
    name: 'Islamic Elegant (Bismillah)',
    description: 'Emerald green styling with Bismillah header and respectful arch motif.',
    accentClass: 'bg-emerald-100 text-emerald-900',
    component: IslamicTemplate,
    community: 'Muslim',
    style: 'Traditional',
  },
  {
    id: 'sikh',
    name: 'Sikh Heritage (Ik Onkar)',
    description: 'Navy blue and kesari orange layout with Ik Onkar and Punjabi family structure.',
    accentClass: 'bg-blue-100 text-blue-900',
    component: SikhTemplate,
    community: 'Sikh',
    style: 'Traditional',
  },
  {
    id: 'classic',
    name: 'Modern Classic',
    description: 'Balanced centered profile with warm paper tones and formal spacing.',
    accentClass: 'bg-amber-100 text-amber-900',
    component: ClassicCenteredTemplate,
    community: 'Universal',
    style: 'Traditional',
  },
  {
    id: 'floral',
    name: 'Floral Editorial',
    description: 'Soft botanical layout with lifestyle and expectations sections.',
    accentClass: 'bg-stone-100 text-stone-800',
    component: FloralEditorialTemplate,
    community: 'Universal',
    style: 'Modern',
  },
  {
    id: 'minimalist',
    name: 'Minimalist Clean',
    description: 'Spacious editorial design focusing purely on clear readability.',
    accentClass: 'bg-slate-100 text-slate-800',
    component: MinimalistTemplate,
    community: 'Universal',
    style: 'Minimal',
  },
  {
    id: 'modern',
    name: 'Modern Split Profile',
    description: 'A contemporary two-column profile that keeps key facts easy to scan.',
    accentClass: 'bg-teal-100 text-teal-900',
    component: ModernSplitTemplate,
    community: 'Universal',
    style: 'Modern',
  },
  {
    id: 'slate',
    name: 'Slate Editorial',
    description: 'A calm editorial layout with a strong banner, refined typography, and generous spacing.',
    accentClass: 'bg-slate-200 text-slate-900',
    component: SlateBannerTemplate,
    community: 'Universal',
    style: 'Modern',
  },
];

export const DEFAULT_BIODATA_TEMPLATE: TemplateId = 'hindu';

const VALID_IDS = new Set(BIODATA_TEMPLATES.map((t) => t.id));

/** Normalize saved template ids (drops removed templates like royal). */
export function normalizeTemplateId(id: string | null | undefined): TemplateId {
  if (id && VALID_IDS.has(id as TemplateId)) return id as TemplateId;
  return DEFAULT_BIODATA_TEMPLATE;
}
