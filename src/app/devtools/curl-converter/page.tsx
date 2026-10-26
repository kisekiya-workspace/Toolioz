import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import CurlConverterClient from './CurlConverterClient';

export const metadata: Metadata = {
  title: 'cURL to Code Converter',
  description:
    'Parses a cURL command into method, URL, headers, and body, then writes fetch, Axios, or Python requests code.',
  alternates: {
    canonical: 'https://toolioz.com/devtools/curl-converter',
  },
  openGraph: {
    title: 'cURL Converter | Toolioz DevTools',
    description:
      'Parses a cURL command into method, URL, headers, and body, then writes fetch, Axios, or Python requests code.',
    url: 'https://toolioz.com/devtools/curl-converter',
    type: 'website',
  },
};

export default function CurlConverterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'cURL Converter',
    description:
      'Developer utility to convert cURL commands into Fetch, Axios, and Python requests snippets.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    url: 'https://toolioz.com/devtools/curl-converter',
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <CurlConverterClient />
    </>
  );
}
