import React from 'react';
import JsonFormatterClient from './JsonFormatterClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator Online',
  description: 'Formats, validates, and minifies JSON in the browser and reports the first syntax error with its location.',
  keywords: 'JSON formatter online, Prettify JSON, Minify JSON payload fast, Browser JSON validator free, Private JSON formatter secure',
  alternates: {
    canonical: 'https://toolioz.com/devtools/json-formatter',
  },
  openGraph: {
    title: 'JSON Formatter & Minifier | Toolioz',
    description: 'Formats, validates, or minifies JSON in the browser and reports the first syntax error.',
    url: 'https://toolioz.com/devtools/json-formatter',
    siteName: 'Toolioz DevTools',
    type: 'website',
  }
};

export default function JsonFormatterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JSON Beautifier and Formatter Studio",
    "description": "Utility program for validating JSON strings, prettifying structures, and minifying payloads.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/json-formatter",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <JsonFormatterClient />
    </>
  );
}
