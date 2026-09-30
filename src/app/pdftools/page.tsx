import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import PDFToolsClient from './PDFToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'PDF Tools | Merge, Split, Convert | Toolioz',
  description:
    'Merge, split, and convert PDF files and images in the browser. Large files may still need an external compressor for portal size caps.',
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
          description: 'Browser-native PDF merge, split, and image conversion.',
          path: '/pdftools',
        })}
      />
      <PDFToolsClient />
    </>
  );
}
