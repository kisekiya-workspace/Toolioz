import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import MortgageClient from './MortgageClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Mortgage Calculator',
  description: 'Estimates the monthly mortgage payment, total interest, and payoff amount for a loan balance, rate, and term.',
  path: '/finance/mortgage-calculator',
  keywords: 'mortgage calculator, monthly mortgage payment, home loan emi, amortization',
});

export default function MortgageCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Mortgage Calculator",
    description: "Monthly principal-and-interest payment from M = P [ i(1 + i)^n ] / [ (1 + i)^n − 1 ]. Tax, insurance, and PMI are not included.",
    path: "/finance/mortgage-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <MortgageClient />
    </>
  );
}
