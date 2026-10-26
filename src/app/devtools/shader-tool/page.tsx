import React from 'react';
import ShaderClient from './ShaderClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "WebGL Shader Studio",
  description: 'Previews animated WebGL backgrounds from presets and exports HTML, React, CSS, or Three.js snippets.',
  keywords: 'WebGL animated background generator, GLSL shader designer tool, website background effects, animated gradient generator, hero section background, Three.js shader export, React WebGL component, CSS gradient fallback, web design shader tool, particle background, mesh gradient animator',
  alternates: {
    canonical: 'https://toolioz.com/devtools/shader-tool',
  },
  openGraph: {
    title: 'WebGL Shader Studio — Animated Backgrounds for Designers | Toolioz',
    description: 'Previews animated WebGL backgrounds and exports HTML, React, CSS, or Three.js snippets.',
    url: 'https://toolioz.com/devtools/shader-tool',
    siteName: 'Toolioz DevTools',
    type: 'website',
  }
};

export default function ShaderToolPage() {
  const tool = TOOLS.find((t) => t.id === 'shader-tool');
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WebGL Shader Studio — Animated Background Generator for Designers",
    "description": "Create stunning animated website backgrounds with WebGL shaders. 18 designer-ready presets, color picker controls, and one-click export to HTML, React, Three.js, CSS fallbacks, and Web Components.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/shader-tool",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <ShaderClient title={tool.title} color={tool.color} />
    </>
  );
}
