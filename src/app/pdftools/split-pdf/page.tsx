import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import SplitPdfClient from './SplitPdfClient';

export const metadata: Metadata = {
  title: 'Split PDF Online | Extract Pages from PDF | Toolioz',
  description:
    'Split PDF files or extract specific pages into separate PDF documents free in your browser. 100% client-side execution with zero server uploads.',
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
    description: 'Extract specific pages or split PDF documents locally in your browser.',
    url: 'https://toolioz.com/pdftools/split-pdf',
    type: 'website',
    images: ['/tooliozLogo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online | Toolioz',
    description: 'Split PDF files locally in your browser with zero server uploads.',
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
