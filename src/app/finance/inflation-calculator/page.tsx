import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import InflationClient from './InflationClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Inflation Calculator',
  description: 'Estimates a future price after inflation and the purchasing-power change of a present amount over selected years.',
  path: '/finance/inflation-calculator',
  keywords: 'inflation calculator, purchasing power calculator, future cost calculator',
});

export default function InflationCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Inflation Calculator",
    description: "Calculate purchasing power loss and future cost of goods due to inflation.",
    path: "/finance/inflation-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <InflationClient />
    </>
  );
}
