import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import RetirementCorpusClient from './RetirementCorpusClient';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Retirement Corpus Calculator',
  description: "Inflates today's expense to retirement, then discounts a flat annual amount for the retirement years.",
  path: '/finance/retirement-corpus',
  keywords: 'retirement corpus calculator, inflation adjusted retirement, retirement planning calculator',
});

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
