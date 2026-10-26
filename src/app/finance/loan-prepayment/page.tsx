import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import LoanPrepaymentClient from './LoanPrepaymentClient';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Loan Prepayment Calculator',
  description: 'Keeps the EMI and adds an extra amount every month, then reports interest saved and months removed.',
  path: '/finance/loan-prepayment',
  keywords: 'loan prepayment calculator, extra emi calculator, home loan prepayment',
});

export default function LoanPrepaymentPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Loan Prepayment Calculator",
    description: "Estimate how extra EMI payments reduce total loan interest and tenure.",
    path: "/finance/loan-prepayment",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <LoanPrepaymentClient />
    </>
  );
}
