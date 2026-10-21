import React from 'react';
import ImageCompressorClient from './ImageCompressorClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "Image Compressor | Reduce Image Size Online",
  description:
    'Compress JPEG, PNG, and WebP images with 100% privacy. Use target file size logic and quality controls — all processing happens locally in your browser.',
  keywords:
    'image compressor online, jpeg compression, png optimizer, image size reducer, offline image compression tool, webp converter',
  alternates: {
    canonical: 'https://toolioz.com/pdftools/image-compressor',
  },
  openGraph: {
    title: 'Image Compressor | Toolioz',
    description:
      'Compress images for web performance instantly and securely without uploading to any server.',
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
      'Browser-native image compression with target size control and zero data leaks.',
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
