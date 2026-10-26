import React from 'react';
import type { Metadata } from 'next';
import BcryptGeneratorClient from './BcryptGeneratorClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'Bcrypt Password Hash Generator & Verifier',
    description: 'Generates bcrypt password hashes and checks a password against a hash, with the work kept in the browser.',
    keywords: 'bcrypt hash generator, bcryptjs compare, $2b$ bcrypt hash',
    alternates: {
        canonical: 'https://toolioz.com/devtools/bcrypt-generator',
    },
    openGraph: {
        title: 'Bcrypt Generator & Verifier | Toolioz',
        description: 'Generates bcrypt hashes and checks a password against a hash in the browser.',
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
