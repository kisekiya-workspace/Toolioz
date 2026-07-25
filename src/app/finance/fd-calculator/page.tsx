import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import FDClient from './FDClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: "FD Calculator 2026 | Maturity Value & TDS on Fixed Deposit | Toolioz",
  description: "Calculate FD maturity with quarterly/monthly compounding. Know about TDS on FD interest, FD laddering strategy, and best small finance bank rates for 2026.",
  keywords: 'fd calculator online india 2026, fixed deposit maturity calculator, tds on fd interest above 40000, fd laddering strategy, fd vs debt mutual fund comparison, best fd rates small finance banks 2026, senior citizen fd rates, tax saver fd section 80c, fd interest calculator quarterly compounding',
  alternates: {
    canonical: 'https://toolioz.com/finance/fd-calculator',
  },
  openGraph: {
    title: 'FD Calculator 2026 — Compounding, TDS & Smart Strategies | Toolioz',
    description: 'Calculate FD maturity value, understand TDS rules, and learn FD laddering strategy to maximize returns.',
    url: 'https://toolioz.com/finance/fd-calculator',
    type: 'website',
  }
};

export default function FDCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Fixed Deposit (FD) Calculator",
    description: "Calculate FD maturity amount, total interest, and quarterly compounding returns.",
    path: "/finance/fd-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <FDClient />
    </>
  );
}
