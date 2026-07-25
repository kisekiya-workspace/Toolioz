import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import MergePdfClient from './MergePdfClient';

export const metadata: Metadata = {
  title: 'Merge PDF Online | Combine PDF Files | Toolioz',
  description:
    'Merge multiple PDF files into one document in your browser. Validated uploads, preserved page order, no server processing.',
  alternates: {
    canonical: 'https://toolioz.com/pdftools/merge-pdf',
  },
  openGraph: {
    title: 'Merge PDF Online | Toolioz',
    description: 'Upload multiple PDFs, merge in order, and download one combined document.',
    url: 'https://toolioz.com/pdftools/merge-pdf',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz PDF merge tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Online | Toolioz',
    description: 'Client-side PDF merge — combine files in order and download one document.',
    images: ['/tooliozLogo.png'],
  },
};

export default function MergePdfPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolioz PDF Merger',
    description:
      'Browser-based PDF merge utility for combining multiple documents while preserving selected order.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/pdftools/merge-pdf',
    provider: {
      '@type': 'Organization',
      name: 'Toolioz',
      url: 'https://toolioz.com',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <MergePdfClient />
    </>
  );
}
