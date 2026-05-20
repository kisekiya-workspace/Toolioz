import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import ROIClient from './ROIClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ROI & CAGR Calculator 2026 | Annualized Return Calculator | Toolioz",
  description: "Calculate ROI and CAGR for stocks, real estate, and mutual funds. Learn the difference between ROI vs CAGR vs XIRR, common investment mistakes, and due diligence tips.",
  keywords: 'roi calculator online, cagr calculator india, annualized return calculator, roi vs cagr vs xirr difference, stock return calculator, real estate roi calculator, mutual fund return calculator, investment profit calculator, how to calculate cagr in excel',
  alternates: {
    canonical: 'https://toolioz.com/finance/roi-calculator',
  },
  openGraph: {
    title: 'ROI & CAGR Calculator 2026 — Annualized Returns & Investment Tips | Toolioz',
    description: 'Calculate total ROI and CAGR for any investment. Learn ROI vs CAGR vs XIRR, avoid common mistakes, and make smarter decisions.',
    url: 'https://toolioz.com/finance/roi-calculator',
    type: 'website',
  }
};

export default function ROICalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "ROI Calculator",
    "description": "Calculate Return on Investment for any asset.",
    "url": "https://toolioz.com/finance/roi-calculator",
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
      <ROIClient />
    </>
  );
}
