import React from 'react';
import HashGeneratorClient from './HashGeneratorClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "Hash Generator Online | SHA-256, SHA-512, SHA-1",
  description:
    'Computes SHA-1, SHA-256, SHA-384, and SHA-512 from text or a file with the Web Crypto API. The input is not uploaded.',
  keywords:
    'SHA-256 hash generator, SHA-512 online, file checksum tool, hash text online, crypto hash generator free',
  alternates: {
    canonical: 'https://toolioz.com/devtools/hash-generator',
  },
  openGraph: {
    title: 'Hash Generator | Toolioz DevTools',
    description:
      'Computes SHA-1, SHA-256, SHA-384, and SHA-512 with the Web Crypto API. The input is not uploaded.',
    url: 'https://toolioz.com/devtools/hash-generator',
    type: 'website',
    images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: 'Toolioz Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Generator | Toolioz',
    description: 'Computes SHA-1, SHA-256, SHA-384, and SHA-512 with the Web Crypto API. The input is not uploaded.',
    images: ['/tooliozLogo.png'],
  },
};

export default function HashGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toolioz Hash Generator',
    description:
      'Browser-native cryptographic hash generator supporting SHA-1, SHA-256, SHA-384, and SHA-512 for text and files.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/devtools/hash-generator',
    provider: {
      '@type': 'Organization',
      name: 'Toolioz',
      url: 'https://toolioz.com',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <HashGeneratorClient />
    </>
  );
}
