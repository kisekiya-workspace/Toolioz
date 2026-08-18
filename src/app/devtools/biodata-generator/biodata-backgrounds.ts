import type { TemplateId } from './types';

/**
 * Background image paths for biodata templates that use decorative backgrounds.
 * These are served from /public/biodata-backgrounds/ and used in both
 * the HTML preview and PDF export to ensure visual consistency.
 */
export const BIODATA_BACKGROUND_IMAGES: Partial<Record<TemplateId, string>> = {
  ivory_gold: '/biodata-backgrounds/ivory-gold-bg.png',
  floral: '/biodata-backgrounds/floral-editorial-v2.png',
  rose_gold: '/biodata-backgrounds/rose-gold-editorial-v2.png',
  slate: '/biodata-backgrounds/slate-editorial-v2.png',
  modern: '/biodata-backgrounds/modern-architectural-v2.png',
};

/**
 * Convert a public path to an absolute URL for fetching during PDF export.
 * Falls back to window.location.origin in the browser.
 */
export function getBackgroundUrl(templateId: TemplateId): string | null {
  const path = BIODATA_BACKGROUND_IMAGES[templateId];
  if (!path) return null;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
}
