import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DevToolsClient from './DevToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Developer Tools Online | JSON, JWT, Regex, X Tap-to-Reveal PNG | Toolioz',
  description:
    'Free JSON formatter, JWT decoder, regex tester, Base64 encoder, X tap-to-reveal hidden PNG maker, and timestamp converter. Runs in your browser—private by default.',
  path: '/devtools',
  keywords: [
    'x tap to reveal png',
    'twitter hidden image maker',
    'free developer tools online',
    'json formatter pretty print',
    'jwt decoder online',
    'regex tester tool',
    'base64 encode decode',
    'timestamp converter',
    'uuid generator',
  ],
});

export default function DevToolsLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Developer tools',
          description: 'JSON, security, encoding, and debugging utilities for developers.',
          path: '/devtools',
        })}
      />
      <DevToolsClient />
    </>
  );
}
