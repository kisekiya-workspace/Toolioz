import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import ROIClient from './ROIClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'ROI and CAGR Calculator',
  description: 'Calculates total return and compound annual growth rate from a starting value, ending value, and holding period.',
  path: '/finance/roi-calculator',
  keywords: 'roi calculator, cagr calculator, annualized return, investment profit calculator',
});

export default function ROICalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "ROI & CAGR Calculator",
    description: "Calculate Return on Investment (ROI) and Compound Annual Growth Rate (CAGR).",
    path: "/finance/roi-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <ROIClient />
    </>
  );
}
