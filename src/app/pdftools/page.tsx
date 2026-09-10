import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import PDFToolsClient from './PDFToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'PDF Tools | Merge and Image to PDF | Toolioz',
  description:
    'Merge PDF files and convert images to PDF in the browser. Split and compress are not separate public tools; large files still need an external compressor for portal size caps.',
  path: '/pdftools',
  keywords: [
    'merge pdf online free',
    'image to pdf converter',
    'client side pdf tools',
  ],
});

export default function PDFToolsLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'PDF tools',
          description: 'Browser-native PDF merge and image-to-PDF conversion.',
          path: '/pdftools',
        })}
      />
      <PDFToolsClient />
    </>
  );
}
