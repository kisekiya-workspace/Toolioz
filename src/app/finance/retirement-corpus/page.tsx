import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import RetirementCorpusClient from './RetirementCorpusClient';

export const metadata: Metadata = {
  title: 'Retirement Corpus Calculator 2026 | Inflation Planning | Toolioz',
  description:
    'Estimate how much you need for retirement after inflation, future spending growth, and existing savings are considered.',
  keywords:
    'retirement corpus calculator, retirement planning calculator with inflation, how much corpus needed for retirement, inflation adjusted retirement savings, retirement monthly expense calculator',
  alternates: {
    canonical: 'https://toolioz.com/finance/retirement-corpus',
  },
  openGraph: {
    title: 'Retirement Corpus Calculator 2026 | Toolioz',
    description:
      'Estimate the corpus needed to fund retirement spending after inflation and expected returns.',
    url: 'https://toolioz.com/finance/retirement-corpus',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Retirement Corpus Calculator',
      },
    ],
  },
};

export default function RetirementCorpusPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialCalculator',
    name: 'Retirement Corpus Calculator',
    description: 'Estimate the retirement corpus needed to fund future spending.',
    url: 'https://toolioz.com/finance/retirement-corpus',
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
      <RetirementCorpusClient />
    </>
  );
}
