import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import FinanceClient from './FinanceClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Finance Calculators & Guides | SIP, Tax, EMI, Retirement | Toolioz',
  description:
    'Free SIP, income tax, home loan EMI, FD, retirement corpus, and loan prepayment calculators plus step-by-step guides for India-focused financial planning.',
  path: '/finance',
  keywords: [
    'free finance calculators',
    'sip calculator online',
    'income tax calculator',
    'compound interest calculator',
    'car loan emi calculator',
    'fd calculator',
    'mortgage calculator',
    'retirement corpus planner',
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
