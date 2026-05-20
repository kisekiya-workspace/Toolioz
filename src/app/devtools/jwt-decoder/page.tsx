import React from 'react';
import type { Metadata } from 'next';
import JwtDecoderClient from './JwtDecoderClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'JWT Decoder & Inspector Online | Toolioz DevTools',
    description: 'Securely decode, verify, and inspect JSON Web Tokens (JWT) natively in your browser. Validate signature headers and payload claims mathematically.',
    keywords: 'JWT decoder free, JSON Web Token parser online, Decode JWT structure secure, verify JWT signature browser, online JWT inspection developer',
    alternates: {
        canonical: 'https://toolioz.com/devtools/jwt-decoder',
    },
    openGraph: {
        title: 'JWT Token Decoder & Verifier | Toolioz',
        description: 'Securely decode, verify, and inspect JSON Web Tokens (JWT) natively inside your browser. No data leaves your machine.',
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
