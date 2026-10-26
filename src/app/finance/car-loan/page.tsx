import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import CarLoanClient from './CarLoanClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Car Loan EMI Calculator',
  description: 'Calculates a reducing-balance car-loan EMI, total interest, and total payable from loan amount, rate, and tenure.',
  path: '/finance/car-loan',
  keywords: 'car loan emi calculator, reducing balance car loan, car loan interest calculator',
});

export default function CarLoanCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Car Loan EMI Calculator",
    description: "Calculate car loan EMI, total interest payable, and payback breakdown.",
    path: "/finance/car-loan",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <CarLoanClient />
    </>
  );
}
