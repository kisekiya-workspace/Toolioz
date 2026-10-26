import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DevToolsClient from './DevToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Developer Tools | JSON, JWT, Regex | Toolioz',
  description:
    'JSON formatter, JWT decoder, regex tester, and UUID and hash generators that run in the browser.',
  path: '/devtools',
  keywords: [
    'json formatter pretty print',
    'jwt decoder online',
    'regex tester javascript',
    'free developer tools online',
  ],
});

export default function DevToolsLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Developer tools',
          description: 'JSON formatter, JWT decoder, regex tester, UUID, hash, and timestamp tools.',
          path: '/devtools',
        })}
      />
      <DevToolsClient />
    </>
  );
}
