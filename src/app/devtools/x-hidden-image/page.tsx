import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import XHiddenImageClient from './XHiddenImageClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'X Hidden Image Maker — Tap-to-Reveal PNG for Twitter | Toolioz',
  description:
    'Create tap-to-reveal PNGs for X (Twitter): muted feed preview, full-color when opened. Brush masks, line art, PNG8 export — all in the browser.',
  keywords:
    'X hidden image, Twitter tap to reveal, transparent PNG timeline, Twitter engagement image, checker mesh PNG, Toolioz',
  alternates: {
    canonical: 'https://toolioz.com/devtools/x-hidden-image',
  },
  openGraph: {
    title: 'X Hidden Image Maker | Toolioz DevTools',
    description: 'Build tap-to-reveal PNG images for X posts — 100% in your browser.',
    url: 'https://toolioz.com/devtools/x-hidden-image',
    siteName: 'Toolioz DevTools',
    type: 'website',
  },
};

export default function XHiddenImagePage() {
  const tool = TOOLS.find((t) => t.id === 'x-hidden-image');
  if (!tool) return notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'X Hidden Image Maker',
    description:
      'Client-side utility to compose dual-background PNG images for X (Twitter) tap-to-reveal posts.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    url: 'https://toolioz.com/devtools/x-hidden-image',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <XHiddenImageClient title={tool.title} color={tool.color} />
    </>
  );
}
