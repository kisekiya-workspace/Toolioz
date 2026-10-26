/** Equivalent tools only. Different operations (PDF split/merge, for example) are not aliases. */
export const TOOL_ALIASES: Readonly<Record<string, string>> = {
  '/tools/sip-calculator': '/finance/sip-calculator',
  '/tools/gst-calculator': '/finance/gst-calculator',
  '/tools/income-tax-calculator': '/finance/income-tax',
  '/tools/compound-interest-calculator': '/finance/compound-interest',
  '/tools/percentage-calculator': '/finance/percentage-calculator',
  '/tools/emi-calculator': '/finance/mortgage-calculator',
  '/tools/json-formatter': '/devtools/json-formatter',
  '/tools/jwt-decoder': '/devtools/jwt-decoder',
  '/tools/regex-tester': '/devtools/regex-tester',
  '/tools/base64-converter': '/devtools/base64-converter',
  '/tools/url-converter': '/devtools/url-encoder',
  '/tools/hash-generator': '/devtools/hash-generator',
  '/tools/timestamp-converter': '/devtools/timestamp-converter',
  '/tools/uuid-generator': '/devtools/uuid-generator',
  '/tools/cron-job-generator': '/devtools/cron-generator',
  '/tools/color-converter': '/devtools/color-converter',
  '/tools/lorem-ipsum': '/devtools/lorem-ipsum',
  '/tools/unit-converter': '/devtools/unit-converter',
  '/tools/pdf-splitter': '/pdftools/split-pdf',
  '/tools/pdf-merger': '/pdftools/merge-pdf',
  '/tools/image-to-pdf': '/pdftools/image-to-pdf',
  '/tools/pdf-to-image': '/pdftools/pdf-to-image',
  '/tools/image-compressor': '/pdftools/image-compressor',
  '/devtools/split-image-in-3': '/design/split-image-in-3',
  '/devtools/biodata-generator': '/biodata',
  '/biodata/biodata-generator': '/biodata',
  '/pdftools/resume-generator': '/resume-builder',
  '/devtools/remove-gps-data-from-photo': '/devtools/exif-viewer-remover',
  '/devtools/faq-schema-generator': '/devtools/schema-markup-generator',
  '/devtools/howto-schema-generator': '/devtools/schema-markup-generator',
  '/devtools/product-schema-generator': '/devtools/schema-markup-generator',
  '/tools/json-to-csv': '/devtools/csv-json-converter',
  '/tools/word-counter': '/tools/text-tools',
};

/**
 * Keyword variants of the same percentage arithmetic. Reachable by URL,
 * but not a distinct product in hubs, sitemap, or ads.
 */
export const WITHHELD_TOOL_PATHS = new Set([
  '/finance/grade-percentage-calculator',
  '/finance/win-percentage-calculator',
  '/finance/weight-loss-percentage-calculator',
  '/finance/body-fat-percentage-calculator',
  '/finance/average-percentage-calculator',
]);

/** Tools that do not reliably complete their stated job in production. */
export const PAUSED_TOOL_PATHS = new Set([
  '/tools/audio-converter',
]);

/**
 * Tools with regulatory, statutory tax, or financial rules that change with government budgets/circulars.
 * Kept functional for direct visitors, but noindexed and excluded from sitemap to maintain an evergreen site profile.
 */
export const CHANGING_RULES_NOINDEX_PATHS = new Set([
  '/finance/income-tax',
  '/finance/gst-calculator',
  '/finance/itr-json-to-computation-pdf',
  '/finance/form-16-to-json',
  '/finance/income-computation-from-json',
  '/tools/salary-breakup-calculator',
  '/tools/loan-eligibility-calculator',
]);

export function canonicalToolPath(pathname: string): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  return TOOL_ALIASES[path] ?? path;
}
