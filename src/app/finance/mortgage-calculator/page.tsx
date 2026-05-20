import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import MortgageClient from './MortgageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mortgage Calculator 2026 | Monthly Payment & Hidden Costs Guide | Toolioz",
  description: "Calculate monthly mortgage payments for 15 or 30 year terms. Learn about PMI, closing costs, the 28/36 rule, and hidden expenses before buying your first home.",
  keywords: 'mortgage calculator 2026, how much house can i afford calculator, 15 year vs 30 year mortgage comparison, first time home buyer calculator, mortgage payment with pmi, closing costs calculator, 28 36 rule mortgage, home loan emi calculator usa, monthly house payment estimator',
  alternates: {
    canonical: 'https://toolioz.com/finance/mortgage-calculator',
  },
  openGraph: {
    title: 'Mortgage Calculator 2026 — What Banks Don\'t Tell You | Toolioz',
    description: 'Calculate EMI, compare 15 vs 30 year terms, and learn about PMI, closing costs, and the real cost of homeownership.',
    url: 'https://toolioz.com/finance/mortgage-calculator',
    type: 'website',
  }
};

export default function MortgageCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "Professional Mortgage Calculator",
    "description": "Calculate monthly mortgage payments and total interest payback.",
    "url": "https://toolioz.com/finance/mortgage-calculator",
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
      <MortgageClient />
    </>
  );
}
