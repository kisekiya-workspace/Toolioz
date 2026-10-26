import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import CompoundInterestClient from './CompoundInterestClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Compound Interest Calculator',
  description: 'Calculates future value with annual, quarterly, monthly, or daily compounding from A = P(1 + r/n)^(nt).',
  path: '/finance/compound-interest',
  keywords: 'compound interest calculator, rule of 72, daily compounding, monthly compounding, future value',
});

export default function CompoundInterestPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Compound Interest Calculator",
    description: "Future value is A = P(1 + r/n)^(nt) for annual, quarterly, monthly, or daily compounding.",
    path: "/finance/compound-interest",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <CompoundInterestClient />
    </>
  );
}
