import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import JsonDiffClient from './JsonDiffClient';

export const metadata: Metadata = {
  title: 'JSON Diff Checker',
  description:
    'Compare two JSON payloads and inspect additions, removals, value edits, and type changes.',
  alternates: {
    canonical: 'https://toolioz.com/devtools/json-diff',
  },
  openGraph: {
    title: 'JSON Diff Checker | Toolioz DevTools',
    description: 'Field-level JSON comparison for API payload and config change reviews.',
    url: 'https://toolioz.com/devtools/json-diff',
    type: 'website',
  },
};

export default function JsonDiffPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON Diff Checker',
    description:
      'Developer tool for comparing two JSON objects and listing field-level changes.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/devtools/json-diff',
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <JsonDiffClient />
    </>
  );
}
