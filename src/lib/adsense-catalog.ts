export const ADSENSE_INDEX_TOOL_IDS = new Set([
  'sip-calculator',
  'compound-interest',
  'income-tax',
  'gst-calculator',
  'mortgage-calculator',
  'loan-prepayment',
  'inflation-calculator',
  'percentage-calculator',
  'json-formatter',
  'jwt-decoder',
  'regex-tester',
  'merge-pdf',
  'image-to-pdf',
  'biodata-generator',
  'x-hidden-image',
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
