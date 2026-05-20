import React from 'react';
import type { Metadata } from 'next';
import Base64Client from './Base64Client';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder Online | Toolioz DevTools',
  description: 'Instantly convert text or files to Base64 and decode Base64 strings to raw data natively in your browser. Secure, fast, and 100% client-side.',
  keywords: 'Base64 encoder online, Decode Base64 string to text, Base64 file converter safely, Free developer base64 tool, Cryptography encoding',
  alternates: {
      canonical: 'https://toolioz.com/devtools/base64-converter',
  },
  openGraph: {
      title: 'Browser-Native Base64 Encoder/Decoder | Toolioz',
      description: 'Convert text, strings, and files directly to/from Base64 encoding without server processing.',
      url: 'https://toolioz.com/devtools/base64-converter',
      siteName: 'Toolioz DevTools',
      type: 'website',
  }
};

export default function Base64Page() {
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Base64 Encoder & Decoder Studio",
      "description": "Secure local-first tool for encoding text strings into Base64 algorithms or decoding existing Base64 hashes.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "url": "https://toolioz.com/devtools/base64-converter",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
      <>
          <JSONLD data={jsonLd} />
          <Base64Client />
      </>
  );
}
