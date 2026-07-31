import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import ImageToPdfClient from './ImageToPdfClient';

export const metadata: Metadata = {
  title: 'Image to PDF Converter | Convert JPG/PNG to PDF Online | Toolioz',
  description:
    'Convert JPG, PNG, and WebP images into a single PDF document free in your browser. 100% client-side processing with zero server uploads.',
  keywords: [
    'image to pdf converter',
    'convert jpg to pdf online free',
    'png to pdf converter',
    'combine photos into pdf document',
    'client side image to pdf maker',
  ],
  alternates: {
    canonical: 'https://toolioz.com/pdftools/image-to-pdf',
  },
  openGraph: {
    title: 'Image to PDF Converter | Toolioz',
    description: 'Convert JPG/PNG photos into a clean PDF file locally in your browser.',
    url: 'https://toolioz.com/pdftools/image-to-pdf',
    type: 'website',
    images: ['/tooliozLogo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to PDF Converter | Toolioz',
    description: 'Convert images to PDF locally in your browser with zero server uploads.',
    images: ['/tooliozLogo.png'],
  },
};

export default function ImageToPdfPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolioz Image to PDF Converter',
    description:
      'Browser-based utility for converting JPG and PNG images into custom PDF documents.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/pdftools/image-to-pdf',
    provider: {
      '@type': 'Organization',
      name: 'Toolioz',
      url: 'https://toolioz.com',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <ImageToPdfClient />
    </>
  );
}
