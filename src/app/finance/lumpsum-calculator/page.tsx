import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import LumpsumClient from './LumpsumClient';
import { buildCalculatorJsonLd } from '@/lib/seo';

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
  },
};

export default function LumpsumCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Lumpsum Calculator",
    description: "Estimate the future value of a one-time investment with compounding.",
    path: "/finance/lumpsum-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <LumpsumClient />
    </>
  );
}
