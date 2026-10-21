import React from 'react';
import UUIDClient from './UUIDClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "Bulk v4 UUID Generator | Professional GUID Creation Suite",
  description: 'Generate 10,000+ cryptographically secure v4 UUIDs effortlessly. Customize formatting with hyphens, casing, and bulk export. 100% client-side for data security.',
  keywords: 'Bulk v4 UUID generator, GUID creation online, online guid maker, uuid generator without hyphens, mass uuid generation pro, secure browser identifiers',
  alternates: {
    canonical: 'https://toolioz.com/devtools/uuid-generator',
  },
  openGraph: {
    title: 'Toolioz Advanced Bulk UUID Suite | Browser Native v4 GUIDs',
    description: 'Instant, secure, and mass generation of UUIDs for databases and development.',
    url: 'https://toolioz.com/devtools/uuid-generator',
    type: 'website',
  }
};

export default function UUIDGeneratorPage() {
  const tool = TOOLS.find(t => t.id === 'uuid-generator');
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mass UUID v4 Generation Suite",
    "description": "High-performance browser-native tool to generate bulk randomized database identifiers.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/uuid-generator",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <UUIDClient title={tool.title} color={tool.color} />
    </>
  );
}
