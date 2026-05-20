import React from 'react';
import type { Metadata } from 'next';
import BcryptGeneratorClient from './BcryptGeneratorClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'Bcrypt Password Hash Generator & Verifier | Toolioz DevTools',
    description: 'Instantly generate cryptographically secure Bcrypt hashes and verify passwords entirely inside your browser. No data leaves your machine.',
    keywords: 'Bcrypt generator online free, Browser hash password checker, Secure bcrypt verification tool, 2y hash generator, cryptographically secure password',
    alternates: {
        canonical: 'https://toolioz.com/devtools/bcrypt-generator',
    },
    openGraph: {
        title: 'Bcrypt Generator & Verifier | Toolioz',
        description: 'Generate hashes and verify passwords using the Bcrypt algorithm instantly in your browser.',
        url: 'https://toolioz.com/devtools/bcrypt-generator',
        siteName: 'Toolioz DevTools',
        type: 'website',
    }
};

export default function BcryptGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Bcrypt Hash Utility",
        "description": "Client-side Bcrypt password processing, hashing, and matching library analyzer.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "url": "https://toolioz.com/devtools/bcrypt-generator",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
    };

    return (
        <>
            <JSONLD data={jsonLd} />
            <BcryptGeneratorClient />
        </>
    );
}
