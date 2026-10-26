import React from 'react';
import type { Metadata } from 'next';
import CronGeneratorClient from './CronGeneratorClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'Cron Expression Generator',
    description: 'Builds a five-field cron expression for minute, hour, day, month, and weekday, then lists the next five local run times.',
    keywords: 'Cron expression generator, crontab builder, five-field cron, cron next run times',
    alternates: {
        canonical: 'https://toolioz.com/devtools/cron-generator',
    },
    openGraph: {
        title: 'Cron Expression Generator | Toolioz',
        description: 'Builds a five-field cron expression and lists the next five local run times.',
        url: 'https://toolioz.com/devtools/cron-generator',
        siteName: 'Toolioz DevTools',
        type: 'website',
    }
};

export default function CronGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Cron Schedule Generator",
        "description": "Builds a five-field cron expression and lists the next five local run times.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All",
        "url": "https://toolioz.com/devtools/cron-generator",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
    };

    return (
        <>
            <JSONLD data={jsonLd} />
            <CronGeneratorClient />
        </>
    );
}
