import React from 'react';
import type { Metadata } from 'next';
import UnitConverterClient from './UnitConverterClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'Scientific Unit Converter & Global Measure Tool | Toolioz',
  description: 'Fast, precise unit conversion for Length, Mass, Temperature, Volume, and Data. Scientific precision measurements for educational and engineering needs.',
  keywords: 'Unit converter online, scientific measurement tool, convert length weight volume, precise metric converter, temperature conversion tool',
  alternates: {
    canonical: 'https://toolioz.com/devtools/unit-converter',
  },
  openGraph: {
    title: 'Scientific Unit Converter Suite | Toolioz',
    description: 'Instant and accurate conversions across hundreds of scientific and common measures.',
    url: 'https://toolioz.com/devtools/unit-converter',
    siteName: 'Toolioz DevTools',
    type: 'website',
  }
};

export default function UnitConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Scientific Unit Conversion Tool",
    "description": "Multi-category unit conversion utility supporting high-precision engineering and standard calculations.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/unit-converter",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <UnitConverterClient />
    </>
  );
}
