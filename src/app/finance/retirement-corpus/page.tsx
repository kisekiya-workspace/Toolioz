import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import RetirementCorpusClient from './RetirementCorpusClient';
import { buildCalculatorJsonLd } from '@/lib/seo';

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
  },
};

export default function RetirementCorpusPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Retirement Corpus Calculator",
    description: "Estimate the retirement corpus needed to fund future inflation-adjusted spending.",
    path: "/finance/retirement-corpus",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <RetirementCorpusClient />
    </>
  );
}
