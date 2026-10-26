import React from 'react';
import ImageCompressorClient from './ImageCompressorClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "Image Compressor",
  description:
    'Reads a JPEG, PNG, or WebP and saves a JPEG. A target size in KB can still be missed.',
  keywords:
    'image compressor online, jpeg compression, png optimizer, image size reducer, webp input, jpeg output',
  alternates: {
    canonical: 'https://toolioz.com/pdftools/image-compressor',
  },
  openGraph: {
    title: 'Image Compressor | Toolioz',
    description:
      'Reads a JPEG, PNG, or WebP and saves a JPEG. A target size in KB can still be missed.',
    url: 'https://toolioz.com/pdftools/image-compressor',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Image Compressor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor | Toolioz',
    description:
      'Reads a JPEG, PNG, or WebP and saves a JPEG. A target size in KB can still be missed.',
    images: ['/tooliozLogo.png'],
  },
};

export default function ImageCompressorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolioz Image Compressor',
    description:
      'Browser-native image compression tool with granular quality control and target file size logic.',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/pdftools/image-compressor',
    provider: {
      '@type': 'Organization',
      name: 'Toolioz',
      url: 'https://toolioz.com',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <ImageCompressorClient />
    </>
  );
}
