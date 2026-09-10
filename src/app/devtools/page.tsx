import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DevToolsClient from './DevToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Developer Tools | JSON, JWT, Regex | Toolioz',
  description:
    'JSON formatter, JWT decoder, and JavaScript regex tester that run in the browser. Each page documents what it does and what it does not verify.',
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
          description: 'JSON formatter, JWT decoder, and JavaScript regex tester.',
          path: '/devtools',
        })}
      />
      <DevToolsClient />
    </>
  );
}
