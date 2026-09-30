import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DesignClient from './DesignClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Design Tools | Tap-to-Reveal PNG | Toolioz',
  description:
    'Published design utilities for Toolioz: the X tap-to-reveal PNG maker and a three-panel image splitter. Both run in the browser.',
  path: '/design',
  keywords: [
    'x tap to reveal png',
    'twitter hidden image maker',
    'browser png tools',
  ],
});

export default function DesignLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Design & Creative Studio',
          description: 'Published image utilities, including tap-to-reveal PNGs and a three-panel splitter.',
          path: '/design',
        })}
      />
      <DesignClient />
    </>
  );
}
