import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DesignClient from './DesignClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Design Tools | Tap-to-Reveal PNG | Toolioz',
  description:
    'Published design utilities for Toolioz, currently the X tap-to-reveal PNG maker. Drawing, dither, and shader workbenches are not in the public catalog.',
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
          description: 'Published image utilities, including tap-to-reveal PNGs.',
          path: '/design',
        })}
      />
      <DesignClient />
    </>
  );
}
