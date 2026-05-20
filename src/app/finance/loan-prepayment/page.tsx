import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import LoanPrepaymentClient from './LoanPrepaymentClient';

export const metadata: Metadata = {
  title: 'Loan Prepayment Calculator 2026 | Extra EMI Savings | Toolioz',
  description:
    'See how extra EMI payments reduce total interest and shorten your loan term for car, home, or personal loans.',
  keywords:
    'loan prepayment calculator, extra emi calculator, car loan prepayment savings, home loan prepayment calculator, pay off loan early',
  alternates: {
    canonical: 'https://toolioz.com/finance/loan-prepayment',
  },
  openGraph: {
    title: 'Loan Prepayment Calculator 2026 | Toolioz',
    description:
      'Estimate how much interest you can save by making extra EMI or principal payments.',
    url: 'https://toolioz.com/finance/loan-prepayment',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Loan Prepayment Calculator',
      },
    ],
  },
};

export default function LoanPrepaymentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialCalculator',
    name: 'Loan Prepayment Calculator',
    description: 'Estimate how extra payments reduce total loan interest.',
    url: 'https://toolioz.com/finance/loan-prepayment',
    brand: {
      '@type': 'Brand',
      name: 'Toolioz',
    },
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <LoanPrepaymentClient />
    </>
  );
}
