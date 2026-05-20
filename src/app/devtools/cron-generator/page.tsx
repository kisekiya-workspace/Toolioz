import React from 'react';
import type { Metadata } from 'next';
import CronGeneratorClient from './CronGeneratorClient';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
    title: 'Cron Expression Generator & Schedule Descriptor | Toolioz DevTools',
    description: 'Generate cron schedules easily and understand what they mean with our interactive syntax generator. Human-readable cron schedule descriptions.',
    keywords: 'Cron expression generator online, Crontab syntax builder, Cron schedule descriptor, Linux cron job helper, Quartz cron generator',
    alternates: {
        canonical: 'https://toolioz.com/devtools/cron-generator',
    },
    openGraph: {
        title: 'Interactive Cron Schedule Generator | Toolioz',
        description: 'Easily build and describe cron job schedules with a visual interface and human-readable summaries.',
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
        "description": "Visual cron expression builder for crontab and quartz schedules with natural language translation.",
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
