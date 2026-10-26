import React from 'react';
import { notFound } from 'next/navigation';
import XHiddenImageClient from './XHiddenImageClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { TOOLS } from '@/lib/tools';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';
import {
  xHiddenImageKeywords,
  xRevealHowToSteps,
} from '@/lib/x-hidden-image-content';

export const metadata = buildPageMetadata({
  title: 'X Tap-to-Reveal PNG Maker',
    description:
      'Encodes a PNG with a muted timeline preview and a color image revealed on tap, with processing kept in the tab.',
  path: '/devtools/x-hidden-image',
  keywords: xHiddenImageKeywords,
});

export default function XHiddenImagePage() {
  const tool = TOOLS.find((t) => t.id === 'x-hidden-image');
  if (!tool) return notFound();

  const jsonLd = buildCalculatorJsonLd({
    name: 'X Tap-to-Reveal PNG Maker',
    description:
      'Encodes an X tap-to-reveal PNG with a muted feed preview, an opened color image, and optional brush masks.',
    path: '/devtools/x-hidden-image',
    applicationCategory: 'MultimediaApplication',
  });

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to make a tap-to-reveal hidden PNG for X (Twitter)',
    description:
      'Create a single PNG that looks muted in the X timeline and full color when opened or tap-and-held.',
    step: xRevealHowToSteps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <JSONLD data={howToJsonLd} />
      <XHiddenImageClient title={tool.title} color={tool.color} />
    </>
  );
}
