import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DesignClient from './DesignClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Design & Creative Studio Online | Drawesome, ditherit, Shader Studio | Toolioz',
  description:
    'Free online vector drawing studio, ditherit dot & ASCII art, GLSL shader editor, background generator, and tap-to-reveal PNG tools. 100% browser-based.',
  path: '/design',
  keywords: [
    'vector drawing studio',
    'ditherit ascii studio',
    'dither studio online',
    'glsl shader studio',
    'shader background generator',
    'x tap to reveal png',
    'drawesome online',
    'free design tools',
  ],
});

export default function DesignLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Design & Creative Studio',
          description: 'Vector drawing, shader backgrounds, dithering, ASCII art, and image generator tools.',
          path: '/design',
        })}
      />
      <DesignClient />
    </>
  );
}
