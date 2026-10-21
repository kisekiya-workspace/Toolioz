import React from 'react';
import HashGeneratorClient from './HashGeneratorClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "Hash Generator Online | SHA-256, SHA-512, SHA-1",
  description:
    'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes from text or files instantly. 100% private — uses browser Web Crypto API. No data uploads.',
  keywords:
    'SHA-256 hash generator, SHA-512 online, file checksum tool, hash text online, crypto hash generator free',
  alternates: {
    canonical: 'https://toolioz.com/devtools/hash-generator',
  },
  openGraph: {
    title: 'Hash Generator | Toolioz DevTools',
    description:
      'Compute cryptographic hashes from text or files using browser-native Web Crypto API.',
    url: 'https://toolioz.com/devtools/hash-generator',
    type: 'website',
    images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: 'Toolioz Hash Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Generator | Toolioz',
    description: 'SHA-256, SHA-512 hash generator — 100% client-side.',
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
