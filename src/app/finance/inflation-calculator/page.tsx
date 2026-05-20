import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import InflationClient from './InflationClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Inflation Calculator 2026 | Future Cost & Purchasing Power Loss | Toolioz",
  description: "Calculate how inflation erodes purchasing power. Know future cost of education, healthcare, and retirement. Includes real return calculator and rule of 72 explained.",
  keywords: 'inflation calculator india 2026, purchasing power calculator, future cost of education calculator, healthcare inflation india, real return after inflation calculator, rule of 72 inflation, how to beat inflation india, inflation adjusted retirement calculator, cost of living increase calculator',
  alternates: {
    canonical: 'https://toolioz.com/finance/inflation-calculator',
  },
  openGraph: {
    title: 'Inflation Calculator 2026 — Protect Your Purchasing Power | Toolioz',
    description: 'See how inflation eats your savings. Calculate future costs, learn which investments beat inflation, and plan for real-world price increases.',
    url: 'https://toolioz.com/finance/inflation-calculator',
    type: 'website',
  }
};

export default function InflationCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "Inflation Calculator",
    "description": "Calculate purchasing power loss over time due to inflation.",
    "url": "https://toolioz.com/finance/inflation-calculator",
    "brand": {
      "@type": "Brand",
      "name": "Toolioz / FinanceCalc"
    },

    "offers": {

      "@type": "Offer",

      "price": "0.00",

      "priceCurrency": "USD"

    }

  };

return (
    <>
      <JSONLD data={jsonLd} />
      <InflationClient />
    </>
  );
}
