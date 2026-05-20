import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import FinanceClient from './FinanceClient';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { financeBlogKeywords } from '@/lib/finance-blog-content';

export const metadata = buildPageMetadata({
  title: 'Finance Calculators & Guides 2026 | SIP, Tax, EMI, Retirement | Toolioz',
  description:
    'Free SIP, income tax, home loan EMI, FD, retirement corpus, and loan prepayment calculators plus step-by-step guides for India-focused financial planning.',
  path: '/finance',
  keywords: financeBlogKeywords.slice(0, 15),
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
