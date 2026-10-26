import React from 'react';
import LayoutGeneratorClient from './LayoutGeneratorClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "CSS Grid Layout Generator",
  description: 'Builds CSS Grid tracks visually, including minmax and fr units, and exports semantic HTML for the layout.',
  keywords: 'CSS Grid minmax generator, advanced css grid tracks, visual grid builder pro, responsive layout architecture, grid-template-areas generator, css layout tool developers',
  alternates: {
    canonical: 'https://toolioz.com/devtools/layout-generator',
  },
  openGraph: {
    title: 'CSS Grid Layout Generator | Toolioz',
    description: 'Builds a CSS grid. Columns start as 1fr and rows start as minmax(60px, auto). Export writes grid-column, grid-row, and a z-index.',
    url: 'https://toolioz.com/devtools/layout-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Grid Layout Generator',
    description: 'Builds a CSS grid. Columns start as 1fr and rows start as minmax(60px, auto).',
  }
};

export default function LayoutGeneratorPage() {
  const tool = TOOLS.find(t => t.id === 'layout-generator');
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CSS Grid Layout Generator",
    "description": "Builds a CSS grid. Columns start as 1fr and rows start as minmax(60px, auto). Export writes grid-column, grid-row, and a z-index.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/layout-generator",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <LayoutGeneratorClient title={tool.title} color={tool.color} />
    </>
  );
}
