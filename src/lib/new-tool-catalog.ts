export type NewToolGroup = 'pdf' | 'image' | 'developer' | 'seo';

export interface NewToolDefinition {
  slug: string;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  group: NewToolGroup;
  mode: string;
}

export const NEW_PDF_TOOLS: NewToolDefinition[] = [
  { slug: 'organize-pdf', path: '/pdftools/organize-pdf', title: 'Organize PDF Pages Online', shortTitle: 'Organize PDF', description: 'Reorder, rotate, and remove PDF pages privately in your browser.', keywords: ['organize PDF', 'reorder PDF pages', 'rotate PDF pages', 'delete PDF pages'], group: 'pdf', mode: 'organize' },
  { slug: 'add-page-numbers-to-pdf', path: '/pdftools/add-page-numbers-to-pdf', title: 'Add Page Numbers to PDF Online', shortTitle: 'Add PDF Page Numbers', description: 'Add customizable page numbers to every PDF page without uploading the file.', keywords: ['add page numbers to PDF', 'number PDF pages', 'PDF pagination'], group: 'pdf', mode: 'page-numbers' },
  { slug: 'watermark-pdf', path: '/pdftools/watermark-pdf', title: 'Watermark PDF Online', shortTitle: 'Watermark PDF', description: 'Place a text watermark on PDF pages with control over size, opacity, and angle.', keywords: ['watermark PDF', 'add watermark to PDF', 'PDF text watermark'], group: 'pdf', mode: 'watermark' },
  { slug: 'pdf-metadata-editor', path: '/pdftools/pdf-metadata-editor', title: 'PDF Metadata Viewer, Editor & Remover', shortTitle: 'PDF Metadata Editor', description: 'Inspect, update, or clear PDF title, author, subject, and keyword metadata.', keywords: ['PDF metadata viewer', 'PDF metadata editor', 'remove PDF metadata'], group: 'pdf', mode: 'metadata' },
  { slug: 'pdf-to-text', path: '/pdftools/pdf-to-text', title: 'PDF to Text Converter Online', shortTitle: 'PDF to Text', description: 'Extract selectable text from PDF pages into a downloadable plain-text file.', keywords: ['PDF to text', 'extract text from PDF', 'PDF text converter'], group: 'pdf', mode: 'text' },
  { slug: 'bates-numbering-pdf', path: '/pdftools/bates-numbering-pdf', title: 'Bates Numbering PDF Tool', shortTitle: 'Bates Numbering PDF', description: 'Apply sequential Bates identifiers with a prefix, suffix, and configurable padding.', keywords: ['Bates numbering PDF', 'Bates stamp PDF', 'legal document numbering'], group: 'pdf', mode: 'bates' },
];

export const NEW_DEV_TOOLS: NewToolDefinition[] = [
  { slug: 'exif-viewer-remover', path: '/devtools/exif-viewer-remover', title: 'EXIF Metadata Viewer & Remover', shortTitle: 'EXIF Viewer & Remover', description: 'Inspect photo metadata and remove embedded EXIF, XMP, GPS, and comment blocks locally.', keywords: ['EXIF viewer', 'remove EXIF data', 'photo metadata remover'], group: 'image', mode: 'exif' },
  { slug: 'remove-gps-data-from-photo', path: '/devtools/remove-gps-data-from-photo', title: 'Remove GPS Data from Photos', shortTitle: 'Remove Photo GPS Data', description: 'Check for location metadata and create a privacy-clean copy of a JPEG or PNG photo.', keywords: ['remove GPS from photo', 'photo location remover', 'delete image GPS metadata'], group: 'image', mode: 'gps' },
  { slug: 'image-dimensions-aspect-ratio', path: '/devtools/image-dimensions-aspect-ratio', title: 'Image Dimensions & Aspect Ratio Calculator', shortTitle: 'Image Dimensions & Ratio', description: 'Read image dimensions, simplify its aspect ratio, and calculate proportional sizes.', keywords: ['image dimensions', 'aspect ratio calculator', 'image size calculator'], group: 'image', mode: 'dimensions' },
  { slug: 'ocr-image-to-text', path: '/devtools/ocr-image-to-text', title: 'OCR Image to Text Converter', shortTitle: 'OCR Image to Text', description: 'Recognize English text in JPG, PNG, and WebP images directly in your browser.', keywords: ['OCR image to text', 'extract text from image', 'photo to text'], group: 'image', mode: 'ocr' },
  { slug: 'yaml-json-converter', path: '/devtools/yaml-json-converter', title: 'YAML to JSON & JSON to YAML Converter', shortTitle: 'YAML ↔ JSON', description: 'Convert and validate YAML and JSON in either direction with clear parse errors.', keywords: ['YAML to JSON', 'JSON to YAML', 'YAML converter'], group: 'developer', mode: 'yaml-json' },
  { slug: 'xml-formatter-validator', path: '/devtools/xml-formatter-validator', title: 'XML Formatter & Validator', shortTitle: 'XML Formatter', description: 'Validate and format XML locally with readable parser errors.', keywords: ['XML formatter', 'XML validator', 'format XML online'], group: 'developer', mode: 'xml' },
  { slug: 'json-schema-validator', path: '/devtools/json-schema-validator', title: 'JSON Schema Validator', shortTitle: 'JSON Schema Validator', description: 'Validate JSON data against JSON Schema and inspect exact field-level failures.', keywords: ['JSON Schema validator', 'validate JSON schema', 'AJV validator'], group: 'developer', mode: 'json-schema' },
  { slug: 'http-status-code-lookup', path: '/devtools/http-status-code-lookup', title: 'HTTP Status Code Lookup', shortTitle: 'HTTP Status Lookup', description: 'Search common HTTP response codes by number, name, category, or meaning.', keywords: ['HTTP status codes', 'HTTP code lookup', '404 meaning'], group: 'developer', mode: 'http-status' },
  { slug: 'mime-type-lookup', path: '/devtools/mime-type-lookup', title: 'MIME Type Lookup', shortTitle: 'MIME Type Lookup', description: 'Find common MIME media types from a file extension or content type.', keywords: ['MIME type lookup', 'file extension MIME type', 'content type lookup'], group: 'developer', mode: 'mime' },
  { slug: 'utm-builder', path: '/devtools/utm-builder', title: 'UTM Campaign URL Builder', shortTitle: 'UTM Builder', description: 'Build properly encoded campaign URLs with source, medium, campaign, term, and content.', keywords: ['UTM builder', 'campaign URL builder', 'UTM link generator'], group: 'seo', mode: 'utm' },
  { slug: 'robots-txt-generator', path: '/devtools/robots-txt-generator', title: 'Robots.txt Generator', shortTitle: 'Robots.txt Generator', description: 'Create a valid robots.txt file with crawler rules, disallow paths, and a sitemap URL.', keywords: ['robots.txt generator', 'create robots.txt', 'SEO robots file'], group: 'seo', mode: 'robots' },
  { slug: 'hreflang-generator', path: '/devtools/hreflang-generator', title: 'Hreflang Tag Generator', shortTitle: 'Hreflang Generator', description: 'Generate reciprocal hreflang link tags for multilingual and multi-region pages.', keywords: ['hreflang generator', 'hreflang tags', 'international SEO'], group: 'seo', mode: 'hreflang' },
  { slug: 'schema-markup-generator', path: '/devtools/schema-markup-generator', title: 'Schema Markup Generator', shortTitle: 'Schema Markup Generator', description: 'Build valid JSON-LD for FAQ, HowTo, and Product structured data.', keywords: ['schema markup generator', 'JSON-LD generator', 'structured data generator'], group: 'seo', mode: 'schema' },
  { slug: 'faq-schema-generator', path: '/devtools/faq-schema-generator', title: 'FAQ Schema Generator', shortTitle: 'FAQ Schema Generator', description: 'Create FAQPage JSON-LD from question-and-answer pairs and copy clean markup.', keywords: ['FAQ schema generator', 'FAQ JSON-LD', 'FAQ structured data'], group: 'seo', mode: 'faq-schema' },
  { slug: 'howto-schema-generator', path: '/devtools/howto-schema-generator', title: 'HowTo Schema Generator', shortTitle: 'HowTo Schema Generator', description: 'Create HowTo JSON-LD with a name, description, and ordered instructions.', keywords: ['HowTo schema generator', 'HowTo JSON-LD', 'instruction schema'], group: 'seo', mode: 'howto-schema' },
  { slug: 'product-schema-generator', path: '/devtools/product-schema-generator', title: 'Product Schema Generator', shortTitle: 'Product Schema Generator', description: 'Generate Product and Offer JSON-LD with price, currency, availability, and identifiers.', keywords: ['Product schema generator', 'Product JSON-LD', 'Offer schema'], group: 'seo', mode: 'product-schema' },
];

export const ALL_NEW_TOOLS = [...NEW_PDF_TOOLS, ...NEW_DEV_TOOLS];

export function getNewTool(slug: string, group: 'pdf' | 'dev') {
  return (group === 'pdf' ? NEW_PDF_TOOLS : NEW_DEV_TOOLS).find((tool) => tool.slug === slug);
}
