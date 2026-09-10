import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import FinanceClient from './FinanceClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Finance Calculators | SIP, Tax, EMI, Inflation | Toolioz',
  description:
    'SIP, income tax, GST, home-loan EMI, compound interest, inflation, percentage, and prepayment calculators with documented formulas and limits.',
  path: '/finance',
  keywords: [
    'free finance calculators',
    'sip calculator online',
    'income tax calculator',
    'compound interest calculator',
    'gst calculator',
    'mortgage calculator',
    'loan prepayment calculator',
  ],
});

export default function FinanceLandingPage() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Finance calculators and guides',
          description: 'Investment, tax, and loan planning tools with educational articles.',
          path: '/finance',
        })}
      />
      <FinanceClient />
    </>
  );
}
