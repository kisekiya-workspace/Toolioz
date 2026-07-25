import React from 'react';
import { notFound } from 'next/navigation';
import XHiddenImageClient from './XHiddenImageClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { TOOLS } from '@/lib/tools';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'X Tap-to-Reveal PNG Maker — Hidden Image & Tap-and-Hold Trend | Toolioz',
  description:
    'Free X (Twitter) hidden image maker for the tap-to-reveal trend: muted timeline preview, full color when opened or tap-and-hold. Paint feed masks, optional line art, PNG8 export — 100% in your browser.',
  path: '/devtools/x-hidden-image',
  keywords: [
    'X tap and hold image',
    'X tap to reveal PNG',
    'Twitter hidden image maker',
    'X timeline reveal trend',
    'tap and hold Twitter image 2026',
    'Twitter engagement image PNG',
    'checkerboard PNG X post',
    'dual view PNG Twitter',
    'PNG8 X upload',
    'hidden picture X feed',
    'open image full color X',
    'Twitter tap to open image',
    'X viral image trick',
    'client-side PNG encoder',
    'Toolioz',
  ],
});

export default function XHiddenImagePage() {
  const tool = TOOLS.find((t) => t.id === 'x-hidden-image');
  if (!tool) return notFound();

  const jsonLd = buildCalculatorJsonLd({
    name: 'X Tap-to-Reveal PNG Maker',
    description:
      'Browser-based encoder for X (Twitter) tap-to-reveal and tap-and-hold hidden images: timeline-safe PNG8 with brush masks and feed vs opened previews.',
    path: '/devtools/x-hidden-image',
    applicationCategory: 'MultimediaApplication',
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <XHiddenImageClient title={tool.title} color={tool.color} />
    </>
  );
}
