import React from 'react';
import UUIDClient from './UUIDClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: "Bulk UUID Generator",
  description: 'Creates version 4 UUIDs with crypto.randomUUID. If that function is missing, the page uses Math.random. Quantity is capped at 1000.',
  keywords: 'Bulk v4 UUID generator, GUID creation online, online guid maker, uuid generator without hyphens, mass uuid generation pro, secure browser identifiers',
  alternates: {
    canonical: 'https://toolioz.com/devtools/uuid-generator',
  },
  openGraph: {
    title: 'Bulk UUID Generator | Toolioz',
    description: 'Creates version 4 UUIDs with crypto.randomUUID, or Math.random if that function is missing. Quantity is capped at 1000.',
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
    "name": "Bulk UUID Generator",
    "description": "Creates version 4 UUIDs with crypto.randomUUID, or Math.random if that function is missing. Quantity is capped at 1000.",
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
