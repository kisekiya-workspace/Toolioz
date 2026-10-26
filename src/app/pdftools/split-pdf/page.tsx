import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import SplitPdfClient from './SplitPdfClient';

export const metadata: Metadata = {
  title: "Split PDF Online | Extract Pages from PDF",
  description:
    'Splits a PDF into separate files or extracts selected pages, with the document kept in the browser.',
  keywords: [
    'split pdf online free',
    'extract pages from pdf',
    'split pdf pages client side',
    'separate pdf pages free',
    'pdf page extractor no upload',
  ],
  alternates: {
    canonical: 'https://toolioz.com/pdftools/split-pdf',
  },
  openGraph: {
    title: 'Split PDF Online | Toolioz',
    description: 'Extracts selected PDF pages or splits a document, with the file kept in the browser.',
    url: 'https://toolioz.com/pdftools/split-pdf',
    type: 'website',
    images: ['/tooliozLogo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online | Toolioz',
    description: 'Splits PDF files in the browser without uploading the document.',
    images: ['/tooliozLogo.png'],
  },
};

export default function SplitPdfPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolioz PDF Splitter',
    description:
      'Browser-based utility for splitting PDF documents and extracting selected page ranges.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/pdftools/split-pdf',
    provider: {
      '@type': 'Organization',
      name: 'Toolioz',
      url: 'https://toolioz.com',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <SplitPdfClient />
    </>
  );
}
