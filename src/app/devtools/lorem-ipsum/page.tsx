import React from 'react';
import type { Metadata } from 'next';
import LoremIpsumClient from './LoremIpsumClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'Professional Lorem Ipsum Generator & Text Placeholder | Toolioz',
  description: 'Generate customizable Lorem Ipsum placeholder text for designs. Specify paragraphs, words, and optional HTML tags for mockups.',
  keywords: 'Lorem ipsum generator professional, placeholder text maker, dummy text for web design, html lipsum generator, customizable placeholder text',
  alternates: {
    canonical: 'https://toolioz.com/devtools/lorem-ipsum',
  },
  openGraph: {
    title: 'Custom Lorem Ipsum Text Generator | Toolioz',
    description: 'Create professional dummy text formatted for web development and UI/UX design mocks.',
    url: 'https://toolioz.com/devtools/lorem-ipsum',
    siteName: 'Toolioz DevTools',
    type: 'website',
  }
};

export default function LoremIpsumPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Professional Lorem Ipsum Utility",
    "description": "Text generation utility for creating industry-standard filler text for graphic and web design.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/lorem-ipsum",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <LoremIpsumClient />
    </>
  );
}
