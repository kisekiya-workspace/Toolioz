import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import LumpsumClient from './LumpsumClient';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Lumpsum Calculator',
  description: 'Projects one deposit with monthly compounding, plus gain and a Rule of 72 estimate. No further deposits are added.',
  path: '/finance/lumpsum-calculator',
  keywords: 'lumpsum calculator, one time investment future value, lump sum compounding',
});

export default function LumpsumCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Lumpsum Calculator",
    description: "Future value uses monthly compounding: A = P(1 + r/12)^(12t).",
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
