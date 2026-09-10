import React from 'react';
import type { Metadata } from 'next';
import JwtDecoderClient from './JwtDecoderClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'JWT Decoder & Inspector Online | Toolioz DevTools',
    description:
      'Decode JSON Web Tokens in the browser. Optional HS256 check if you type the shared secret. Decoding alone is not verification.',
    keywords: 'JWT decoder, JSON Web Token parser, inspect JWT claims, HS256 browser verify',
    alternates: {
        canonical: 'https://toolioz.com/devtools/jwt-decoder',
    },
    openGraph: {
        title: 'JWT Token Decoder | Toolioz',
        description: 'Decode JWT claims in the browser. Optional HS256 check if you type the shared secret. Decoding alone is not proof of authenticity.',
        url: 'https://toolioz.com/devtools/jwt-decoder',
        siteName: 'Toolioz DevTools',
        type: 'website',
    }
};

export default function JwtDecoderPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Local JWT Decoder",
        "description": "Cryptographic developer utility used to decode JSON Web Tokens and view the literal JSON payload and headers without transferring tokens externally.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "url": "https://toolioz.com/devtools/jwt-decoder",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
    };

    return (
        <>
            <JSONLD data={jsonLd} />
            <JwtDecoderClient />
        </>
    );
}
