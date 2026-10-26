import React from 'react';
import ColorClient from './ColorClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Color and Mesh Gradient Tool",
  description: 'Converts hex, RGB, and HSL. Hue shifts make secondary, accent, and surface swatches. Mesh CSS uses radial gradients. Contrast uses a 0.03928 cutoff.',
  keywords: 'hex to RGB, hex to HSL, CSS radial gradient mesh, color contrast ratio, hue shift palette',
  alternates: {
    canonical: 'https://toolioz.com/devtools/color-converter',
  },
  openGraph: {
    title: 'CSS Color Suite & Mesh Generator | Toolioz',
    description: 'Converts hex, RGB, and HSL, copies radial-gradient mesh CSS, and reports contrast with a 0.03928 luminance cutoff.',
    url: 'https://toolioz.com/devtools/color-converter',
    siteName: 'Toolioz DevTools',
    type: 'website',
  }
};

export default function ColorConverterPage() {
  const tool = TOOLS.find(t => t.id === 'color-converter');
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Color Converter",
    "description": "Converts hex, RGB, and HSL. Mesh CSS uses radial gradients. Contrast uses a 0.03928 luminance cutoff.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/color-converter",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <ColorClient title={tool.title} color={tool.color} />
      <Footer />
    </>
  );
}
