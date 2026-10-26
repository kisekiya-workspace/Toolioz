import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import IncomeTaxClient from './IncomeTaxClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Income Tax Calculator',
  description: 'Compares Indian old and new income-tax regimes, including slabs, standard deduction, and the Section 87A rebate.',
  path: '/finance/income-tax',
  keywords: 'income tax calculator india, new vs old tax regime, section 87a rebate, income tax slabs',
  robots: { index: false, follow: true },
});

export default function IncomeTaxPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Income Tax Calculator",
    description: "Calculate income tax with New vs Old Regime comparison for FY 2026-27.",
    path: "/finance/income-tax",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <IncomeTaxClient />
    </>
  );
}
