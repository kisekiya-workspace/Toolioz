import React from 'react';
import ColorClient from './ColorClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Advanced CSS Mesh Gradient & Color Palette Generator",
  description: 'Pro developer tools for WCAG contrast checking, web UI theme generation (Primary, Accent, Surface), and creating interactive pure CSS mesh gradients.',
  keywords: 'CSS mesh gradient generator online, WCAG visual contrast checker, Triadic color palette math, UI theme variable generator, HEX to HSL tool free, developer color suite',
  alternates: {
    canonical: 'https://toolioz.com/devtools/color-converter',
  },
  openGraph: {
    title: 'CSS Color Suite & Mesh Generator | Toolioz',
    description: 'Create mathematical color palettes and export modern CSS mesh background gradients instantly.',
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
    "name": "Advanced CSS Color Converter & Mesh Generator",
    "description": "Professional browser-based utility for CSS mesh gradients, WCAG legibility checking, and mathematical web UI theme generation.",
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
