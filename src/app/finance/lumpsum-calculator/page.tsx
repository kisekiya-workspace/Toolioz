import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import LumpsumClient from './LumpsumClient';

export const metadata: Metadata = {
  title: 'Lumpsum Calculator 2026 | Future Value Projection | Toolioz',
  description:
    'Project how a one-time investment can grow with compounding. Estimate future value, gains, and long-term wealth growth with the Toolioz lumpsum calculator.',
  keywords:
    'lumpsum calculator, lumpsum investment calculator, one time investment future value, lump sum calculator with compounding, mutual fund lumpsum growth',
  alternates: {
    canonical: 'https://toolioz.com/finance/lumpsum-calculator',
  },
  openGraph: {
    title: 'Lumpsum Calculator 2026 | Toolioz',
    description:
      'Estimate how a one-time investment can grow over time with monthly compounding and long-term wealth projections.',
    url: 'https://toolioz.com/finance/lumpsum-calculator',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Lumpsum Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumpsum Calculator 2026 | Toolioz',
    description: 'Project future value from a one-time investment.',
    images: ['/tooliozLogo.png'],
  },
};

export default function LumpsumCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialCalculator',
    name: 'Lumpsum Calculator',
    description: 'Estimate the future value of a one-time investment.',
    url: 'https://toolioz.com/finance/lumpsum-calculator',
    brand: {
      '@type': 'Brand',
      name: 'Toolioz',
    },
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <LumpsumClient />
    </>
  );
}
