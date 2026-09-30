/**
 * Unique tools that have original publisher notes (formula, example, limits).
 * This set is the public catalog, sitemap, and AdSense ad allowlist.
 * Other unique URLs stay reachable but are not featured during review.
 */
export const ADSENSE_INDEX_TOOL_IDS = new Set([
  'sip-calculator',
  'lumpsum-calculator',
  'compound-interest',
  'income-tax',
  'gst-calculator',
  'fd-calculator',
  'mortgage-calculator',
  'loan-prepayment',
  'car-loan',
  'inflation-calculator',
  'retirement-corpus',
  'percentage-calculator',
  'percentage-change-calculator',
  'json-formatter',
  'jwt-decoder',
  'regex-tester',
  'timestamp-converter',
  'uuid-generator',
  'hash-generator',
  'merge-pdf',
  'split-pdf',
  'image-to-pdf',
  'pdf-to-image',
  'resume-generator',
  'biodata-generator',
  'x-hidden-image',
  'split-image-in-3',
]);

/** How-tos that describe a tool Toolioz does not currently publish as a reviewed page. */
export const ADSENSE_NOINDEX_HOWTO_SLUGS = new Set(['compress-pdf-under-2mb']);

/** Scaled or overlapping essays that should not sit in the publisher index. */
export const ADSENSE_NOINDEX_BLOG_SLUGS = new Set([
  'the-evolution-of-web-tool-directories-and-browser-based-utility-suites',
  'the-architecture-of-zero-knowledge-browser-utilities-and-data-sovereignty',
  'the-engineering-of-client-side-web-utilities-and-privacy',
  'behavioral-economics-and-capital-allocation-frameworks',
  'the-art-and-mathematics-of-retro-dithering-and-halftone-algorithms',
  'optimizing-web-performance-webassembly-canvas-2d-and-web-workers',
  'the-complete-guide-to-browser-based-financial-engineering',
  'free-online-financial-calculators-guide',
]);
