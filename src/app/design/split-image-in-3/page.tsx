import React from 'react';
import { notFound } from 'next/navigation';
import SplitImageIn3Client from './SplitImageIn3Client';
import { JSONLD } from '@/components/ui/JSONLD';
import { TOOLS } from '@/lib/tools';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Split Image in 3 Parts — 16:9 Triptych PNG | Toolioz',
  description:
    'Crops a 16:9 photo and splits it into three equal vertical PNG slices for X, Instagram, and carousels.',
  path: '/design/split-image-in-3',
  keywords: [
    'split image in 3',
    'split 16:9 into 3 parts',
    'triptych image splitter',
    'twitter 3 image split',
    'instagram carousel splitter',
    'divide photo into 3 pieces',
    '1x3 image splitter',
  ],
});

export default function SplitImageIn3Page() {
  const tool = TOOLS.find((t) => t.id === 'split-image-in-3');
  if (!tool) return notFound();

  const jsonLd = buildCalculatorJsonLd({
    name: 'Split Image in 3',
    description:
      'Crop an image to 16:9 and split it into three equal vertical PNG slices in the browser.',
    path: '/design/split-image-in-3',
    applicationCategory: 'MultimediaApplication',
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <SplitImageIn3Client title={tool.title} color={tool.color} />
    </>
  );
}
