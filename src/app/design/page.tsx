import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DesignClient from './DesignClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Design Tools — Drawing, Dithering & Image Utilities',
  description:
    'Explore drawing, dithering, ASCII art, shaders, CSS generators, and image utilities. Create previews and export designs with Toolioz.',
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
          description: 'Drawing studios, dithering, shaders, colors, CSS generators, and image utilities.',
          path: '/design',
        })}
      />
      <DesignClient />
    </>
  );
}
