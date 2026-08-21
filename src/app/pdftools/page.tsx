import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import PDFToolsClient from './PDFToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Free PDF Tools Online | Merge, Compress & Convert | Toolioz',
  description:
    'Merge PDF files, compress for email, and convert images to PDF in your browser. Private, fast, no watermark on core tools.',
  path: '/pdftools',
  keywords: [
    'merge pdf online free',
    'compress pdf under 2mb',
    'image to pdf converter',
    'pdf to image converter',
    'split pdf pages',
    'client side pdf tools',
  ],
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
