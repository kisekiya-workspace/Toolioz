import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import SIPClient from './SIPClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'SIP Calculator',
  description: 'Calculates SIP future value with an optional annual step-up, invested amount, estimated gain, and a year-by-year projection.',
  path: '/finance/sip-calculator',
  keywords: 'sip calculator, step up sip calculator, systematic investment plan, monthly investment growth',
});

export default function SIPCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "SIP Calculator",
    description: "Calculate returns on systematic investment plans with step-up option.",
    path: "/finance/sip-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <SIPClient />
    </>
  );
}
