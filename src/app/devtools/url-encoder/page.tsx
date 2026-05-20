import React from 'react';
import type { Metadata } from 'next';
import UrlEncoderClient from './UrlEncoderClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'URL Encoder & Decoder Online | Clean URI Formatter | Toolioz',
    description: 'Quickly encode and decode URIs and URLs for safe transmission. Clean percent-encoding for special characters in web development.',
    keywords: 'URL encoder online, Decode URI string, Percent encoding tool, URL escape characters, safe web transmission formatter',
    alternates: {
        canonical: 'https://toolioz.com/devtools/url-encoder',
    },
    openGraph: {
        title: 'Secure URL Encoder / Decoder | Toolioz',
        description: 'Sanitize and decode URLs for web requests and safe data transmission natively in-browser.',
        url: 'https://toolioz.com/devtools/url-encoder',
        siteName: 'Toolioz DevTools',
        type: 'website',
    }
};

export default function UrlEncoderPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "URI Formatter & URL Utility",
        "description": "Client-side encoding/decoding utility for string sanitization and URL percent-encoding.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "url": "https://toolioz.com/devtools/url-encoder",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
    };

    return (
        <>
            <JSONLD data={jsonLd} />
            <UrlEncoderClient />
        </>
    );
}
