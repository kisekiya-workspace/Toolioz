import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import SIPClient from './SIPClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: "SIP Calculator 2026 | Step-Up SIP | ₹5000 Monthly Returns | Toolioz",
  description: "Calculate SIP returns with step-up option. See how ₹5000/month grows to 1 crore. Includes year-by-year breakdown, XIRR, and direct vs regular plan comparison tips.",
  keywords: 'sip calculator for 1 crore target, step up sip calculator india, sip 5000 per month for 10 years, mutual fund sip return calculator 2026, best sip date to invest, direct vs regular mutual fund, sip vs lumpsum which is better, how to choose mutual fund for sip, sip calculator with inflation',
  alternates: {
    canonical: 'https://toolioz.com/finance/sip-calculator',
  },
  openGraph: {
    title: 'SIP Calculator 2026 — Step-Up SIP & Year-by-Year Growth | Toolioz',
    description: 'Plan your wealth with step-up SIP. See year-by-year growth, get insider tips on NAV, expense ratio, and when to stop your SIP.',
    url: 'https://toolioz.com/finance/sip-calculator',
    type: 'website',
  }
};

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
