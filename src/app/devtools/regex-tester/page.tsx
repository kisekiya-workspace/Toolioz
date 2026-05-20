import React from 'react';
import type { Metadata } from 'next';
import RegexTesterClient from './RegexTesterClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'Regular Expression (Regex) Tester & Debugger | Toolioz DevTools',
    description: 'Free browser-native Regex tester. Test, debug, and understand your Regular Expressions with live syntax highlighting and real-time JavaScript matching.',
    keywords: 'Regex tester online, Regular expression debugger free, JS regex matcher online, Live syntax highlighting regex, Test regular expressions safely',
    alternates: {
        canonical: 'https://toolioz.com/devtools/regex-tester',
    },
    openGraph: {
        title: 'Live Regex Tester & Debugger | Toolioz',
        description: 'Test, debug, and understand your JavaScript Regular Expressions with live highlighting and instant matches natively inside your browser.',
        url: 'https://toolioz.com/devtools/regex-tester',
        siteName: 'Toolioz DevTools',
        type: 'website',
    }
};

export default function RegexTesterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Live Regex Tester & Debugger",
        "description": "Developer utility to test custom regular expressions and string matching securely in a local sandbox.",
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
