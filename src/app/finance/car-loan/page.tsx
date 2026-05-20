import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import CarLoanClient from './CarLoanClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Car Loan EMI Calculator 2026 | Flat vs Reducing Rate | Total Cost | Toolioz",
  description: "Calculate car loan EMI with real reducing balance rates. Know total interest cost, check 3-year vs 5-year tenure comparison, and get smart borrowing tips before buying.",
  keywords: 'car loan emi calculator india 2026, flat rate vs reducing balance car loan, car loan interest rate comparison, car loan tips before buying, used car loan calculator, how much car loan can i afford, total cost of car loan calculator, car loan prepayment calculator, best car loan tenure 3 years vs 5 years',
  alternates: {
    canonical: 'https://toolioz.com/finance/car-loan',
  },
  openGraph: {
    title: 'Car Loan EMI Calculator 2026 — Know Before You Borrow | Toolioz',
    description: 'Calculate EMI, total interest, and get real tips on flat vs reducing rate, dealer traps, and CIBIL score impact.',
    url: 'https://toolioz.com/finance/car-loan',
    type: 'website',
  }
};

export default function CarLoanCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "Car Loan EMI Calculator",
    "description": "Calculate monthly EMIs for car loans.",
    "url": "https://toolioz.com/finance/car-loan",
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
      <CarLoanClient />
    </>
  );
}
