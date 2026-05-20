import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import CompoundInterestClient from './CompoundInterestClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Compound Interest Calculator 2026 | Rule of 72 & Wealth Planner | Toolioz",
  description: "Calculate compound interest with monthly/daily compounding. Learn the Rule of 72, wealth building secrets, and how to beat inflation with the power of compounding in 2026.",
  keywords: 'compound interest calculator with monthly contributions, rule of 72 calculator india, daily compounding interest tool, wealth building secrets 2026, power of compounding examples, compound interest vs simple interest, effective annual rate calculator, monthly investment growth estimator, financial freedom calculator',
  alternates: {
    canonical: 'https://toolioz.com/finance/compound-interest',
  },
  openGraph: {
    title: 'Compound Interest Calculator 2026 — The 8th Wonder of the World | Toolioz',
    description: 'Master the power of compounding. Calculate future wealth, learn the rule of 72, and get pro tips on frequency and consistency.',
    url: 'https://toolioz.com/finance/compound-interest',
    type: 'website',
  }
};

export default function CompoundInterestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "Compound Interest Calculator",
    "description": "Calculate compound interest with various frequencies.",
    "url": "https://toolioz.com/finance/compound-interest",
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
      <CompoundInterestClient />
    </>
  );
}
