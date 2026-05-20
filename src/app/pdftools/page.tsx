import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import PDFToolsClient from './PDFToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { pdftoolsBlogKeywords } from '@/lib/pdftools-blog-content';

export const metadata = buildPageMetadata({
  title: 'Free PDF Tools Online | Merge, Compress & Convert | Toolioz',
  description:
    'Merge PDF files, compress for email, and convert images to PDF in your browser. Private, fast, no watermark on core tools.',
  path: '/pdftools',
  keywords: pdftoolsBlogKeywords.slice(0, 12),
});

export default function PDFToolsLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'PDF tools',
          description: 'Browser-native PDF merge, compress, and conversion utilities.',
          path: '/pdftools',
        })}
      />
      <PDFToolsClient />
    </>
  );
}
