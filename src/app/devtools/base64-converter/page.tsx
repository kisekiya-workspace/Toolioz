import React from 'react';
import type { Metadata } from 'next';
import Base64Client from './Base64Client';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder Online',
  description: 'Encodes text with btoa and files from a data URL. Decodes with atob. Characters outside Latin-1 fail. Base64 is not encryption.',
  keywords: 'Base64 encoder, btoa, atob, Base64 file data URL',
  alternates: {
      canonical: 'https://toolioz.com/devtools/base64-converter',
  },
  openGraph: {
      title: 'Base64 Encoder and Decoder | Toolioz',
      description: 'Encodes text with btoa and files from a data URL. Decodes with atob. Base64 is not encryption.',
      url: 'https://toolioz.com/devtools/base64-converter',
      siteName: 'Toolioz DevTools',
      type: 'website',
  }
};

export default function Base64Page() {
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Base64 Encoder and Decoder",
      "description": "Encodes text with btoa and files from a data URL. Decodes with atob. Characters outside Latin-1 fail. Base64 is not encryption.",
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
