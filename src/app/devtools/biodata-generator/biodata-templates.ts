import type { ComponentType } from 'react';
import type { BiodataForm, TemplateId } from './types';
import { ModernSplitTemplate } from './templates/ModernSplitTemplate';
import { ClassicCenteredTemplate } from './templates/ClassicCenteredTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { HinduTemplate } from './templates/HinduTemplate';
import { IslamicTemplate } from './templates/IslamicTemplate';
import { SikhTemplate } from './templates/SikhTemplate';
import { FloralEditorialTemplate } from './templates/FloralEditorialTemplate';
import { SlateBannerTemplate } from './templates/SlateBannerTemplate';
import { RoyalTealTemplate } from './templates/RoyalTealTemplate';

export type BiodataTemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
  accentClass: string;
  component: ComponentType<{ data: BiodataForm }>;
};

export const BIODATA_TEMPLATES: BiodataTemplateMeta[] = [
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Sharp two-column biodata with a polished contact rail and clear family sections.',
    accentClass: 'bg-teal-100 text-teal-900',
    component: ModernSplitTemplate,
  },
  {
    id: 'classic',
    name: 'Modern Classic',
    description: 'Balanced centered profile with warm paper tones, strong hierarchy, and formal spacing.',
    accentClass: 'bg-amber-100 text-amber-900',
    component: ClassicCenteredTemplate,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean editorial design with generous whitespace and sharp typography.',
    accentClass: 'bg-slate-100 text-slate-800',
    component: MinimalistTemplate,
  },
  {
    id: 'hindu',
    name: 'Hindu Traditional',
    description: 'Saffron and gold accents with ornate borders for Hindu matrimonial profiles.',
    accentClass: 'bg-amber-100 text-amber-900',
    component: HinduTemplate,
  },
  {
    id: 'islamic',
    name: 'Islamic Elegant',
    description: 'Emerald styling with respectful motifs for Muslim marriage biodata.',
    accentClass: 'bg-emerald-100 text-emerald-900',
    component: IslamicTemplate,
  },
  {
    id: 'sikh',
    name: 'Sikh Heritage',
    description: 'Navy and kesari layout inspired by Punjabi matrimonial traditions.',
    accentClass: 'bg-blue-100 text-blue-900',
    component: SikhTemplate,
  },
  {
    id: 'floral',
    name: 'Floral Editorial',
    description: 'Soft botanical biodata with magazine-style columns and refined spacing.',
    accentClass: 'bg-stone-100 text-stone-800',
    component: FloralEditorialTemplate,
  },
  {
    id: 'slate',
    name: 'Slate Banner',
    description: 'Modern profile header with a calm sidebar for lifestyle and contact details.',
    accentClass: 'bg-zinc-100 text-zinc-800',
    component: SlateBannerTemplate,
  },
  {
    id: 'royal',
    name: 'Royal Teal',
    description: 'Decorative teal and gold profile for a more premium matrimonial presentation.',
    accentClass: 'bg-teal-100 text-teal-900',
    component: RoyalTealTemplate,
  },
];

export const DEFAULT_BIODATA_TEMPLATE: TemplateId = 'modern';

const VALID_IDS = new Set(BIODATA_TEMPLATES.map((t) => t.id));

/** Normalize saved template ids (drops removed templates). */
export function normalizeTemplateId(id: string | null | undefined): TemplateId {
  if (id && VALID_IDS.has(id as TemplateId)) return id as TemplateId;
  return DEFAULT_BIODATA_TEMPLATE;
}
