import React from 'react';
import PDFToImageClient from './PDFToImageClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "PDF to Image Converter | Export PDF to PNG/JPG",
  description:
    'Convert PDF pages to PNG or JPG images locally in the browser. Choose a resolution scale, preview pages, and download the results without uploading your PDF.',
  keywords:
    'PDF to image converter, export pdf to png online, convert pdf to jpg high quality, extract images from pdf, free pdf to image tool',
  alternates: {
    canonical: 'https://toolioz.com/pdftools/pdf-to-image',
  },
  openGraph: {
    title: 'PDF to Image Converter | Toolioz',
    description:
      'Transform PDF pages into professional PNG or JPEG images with adjustable resolution.',
    url: 'https://toolioz.com/pdftools/pdf-to-image',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz PDF to Image converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Image Converter | Toolioz',
    description:
      'Browser-local PDF to PNG/JPEG conversion with adjustable resolution scale.',
    images: ['/tooliozLogo.png'],
  },
};

export default function PDFToImagePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolioz PDF to Image Converter',
    description:
      'Browser-local PDF to image conversion tool supporting PNG and JPEG output with adjustable resolution scale.',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/pdftools/pdf-to-image',
    provider: {
      '@type': 'Organization',
      name: 'Toolioz',
      url: 'https://toolioz.com',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <PDFToImageClient />
    </>
  );
}
