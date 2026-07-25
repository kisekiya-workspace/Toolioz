import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import IncomeTaxClient from './IncomeTaxClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Income Tax Calculator 2026-27 | New vs Old Regime Comparison | Toolioz",
  description: "Calculate income tax for FY 2026-27 with new vs old regime comparison. Know about Section 80C, 80D, HRA exemption, NPS deduction, and Section 87A rebate up to ₹12.75 lakh.",
  keywords: 'income tax calculator india 2026-27, new vs old tax regime comparison, section 80c deduction list, hra exemption calculator, section 87a rebate 12 lakh, income tax on 15 lakh salary, nps tax benefit section 80ccd, tax saving tips for salaried, income tax slab rates 2026-27 new regime',
  alternates: {
    canonical: 'https://toolioz.com/finance/income-tax',
  },
  openGraph: {
    title: 'Income Tax Calculator FY 2026-27 — New vs Old Regime & Tax Tips | Toolioz',
    description: 'Compare new vs old regime, learn 80C deductions, HRA exemption rules, and tax-saving strategies for salaried employees.',
    url: 'https://toolioz.com/finance/income-tax',
    type: 'website',
  }
};

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
