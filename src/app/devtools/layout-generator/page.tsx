import React from 'react';
import LayoutGeneratorClient from './LayoutGeneratorClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'CSS Grid Generator Pro | Advanced Track & Visual Builder | Toolioz',
  description: 'Pro-grade CSS Grid visual builder with dynamic track sizing (minmax, fr, auto). Build responsive layouts with automatic semantic HTML and state-persistent grid tracks.',
  keywords: 'CSS Grid minmax generator, advanced css grid tracks, visual grid builder pro, responsive layout architecture, grid-template-areas generator, css layout tool developers',
  alternates: {
    canonical: 'https://toolioz.com/devtools/layout-generator',
  },
  openGraph: {
    title: 'Professional CSS Grid Visual Orchestrator | Toolioz',
    description: 'Dynamic grid track management (fr, px, minmax) and visual layout building. Export pixel-perfect CSS Grid code instantly.',
    url: 'https://toolioz.com/devtools/layout-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced CSS Grid Layout Visualizer',
    description: 'Build complex, production-ready CSS Grid layouts visually with pro track management.',
  }
};

export default function LayoutGeneratorPage() {
  const tool = TOOLS.find(t => t.id === 'layout-generator');
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CSS Grid Builder Visual Studio",
    "description": "Interactive layout creation utility capable of generating absolute CSS grid coordinates, z-indices, and semantic html tags.",
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
