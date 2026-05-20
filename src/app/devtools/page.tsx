import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import DevToolsClient from './DevToolsClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { devtoolsBlogKeywords } from '@/lib/devtools-blog-content';

export const metadata = buildPageMetadata({
  title: 'Developer Tools Online | JSON, JWT, Regex, Base64, Hash | Toolioz',
  description:
    'Free JSON formatter, JWT decoder, regex tester, Base64 encoder, SHA-256 hash, and timestamp converter. Runs in your browser—private by default.',
  path: '/devtools',
  keywords: devtoolsBlogKeywords.slice(0, 15),
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
