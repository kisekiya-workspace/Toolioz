import React from 'react';
import JsonFormatterClient from './JsonFormatterClient';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator Online | Toolioz DevTools',
  description: 'Free browser-native JSON formatter, validator, and minifier. Prettify messy or nested JSON payloads instantly, strictly client-side to ensure maximum privacy.',
  keywords: 'JSON formatter online, Prettify JSON, Minify JSON payload fast, Browser JSON validator free, Private JSON formatter secure',
  alternates: {
    canonical: 'https://toolioz.com/devtools/json-formatter',
  },
  openGraph: {
    title: 'JSON Formatter & Minifier | Toolioz',
    description: 'Format, validate, or minify JSON data instantly. 100% private processing in your browser.',
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
