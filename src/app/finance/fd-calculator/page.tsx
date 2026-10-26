import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import FDClient from './FDClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Fixed Deposit Calculator',
  description: 'Estimates fixed-deposit maturity from principal, annual rate, tenure, and compounding frequency, plus interest earned.',
  path: '/finance/fd-calculator',
  keywords: 'fd calculator, fixed deposit maturity, fd interest calculator, quarterly compounding',
});

export default function FDCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Fixed Deposit (FD) Calculator",
    description: "Maturity is A = P(1 + r/n)^(nt) for annual, half-yearly, quarterly, or monthly compounding, before tax.",
    path: "/finance/fd-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <FDClient />
    </>
  );
}
