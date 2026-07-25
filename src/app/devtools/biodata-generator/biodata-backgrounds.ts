import type { TemplateId } from './types';

/**
 * Background image paths for biodata templates that use decorative backgrounds.
 * These are served from /public/biodata-backgrounds/ and used in both
 * the HTML preview and PDF export to ensure visual consistency.
 */
export const BIODATA_BACKGROUND_IMAGES: Partial<Record<TemplateId, string>> = {
  floral: '/biodata-backgrounds/floral-bg.png',
  slate: '/biodata-backgrounds/slate-bg.png',
  royal: '/biodata-backgrounds/royal-bg.png',
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
