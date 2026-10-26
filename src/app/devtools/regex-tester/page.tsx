import React from 'react';
import type { Metadata } from 'next';
import RegexTesterClient from './RegexTesterClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'Regular Expression (Regex) Tester & Debugger',
    description: 'Tests JavaScript regular expressions against sample text and highlights matches, groups, and syntax errors.',
    keywords: 'Regex tester online, Regular expression debugger free, JS regex matcher online, Live syntax highlighting regex, Test regular expressions safely',
    alternates: {
        canonical: 'https://toolioz.com/devtools/regex-tester',
    },
    openGraph: {
        title: 'Live Regex Tester & Debugger | Toolioz',
        description: 'Tests JavaScript regular expressions against sample text and highlights matches and groups.',
        url: 'https://toolioz.com/devtools/regex-tester',
        siteName: 'Toolioz DevTools',
        type: 'website',
    }
};

export default function RegexTesterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Regular Expression Tester",
        "description": "Tests a pattern with JavaScript new RegExp and can copy a JavaScript snippet.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "url": "https://toolioz.com/devtools/regex-tester",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
    };

    return (
        <>
            <JSONLD data={jsonLd} />
            <RegexTesterClient />
        </>
    );
}
