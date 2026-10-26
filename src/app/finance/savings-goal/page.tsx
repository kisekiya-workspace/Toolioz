import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import SavingsGoalClient from './SavingsGoalClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Savings Goal Calculator',
  description: 'Monthly deposit, paid at the start of each month, that reaches a target at a constant annual return. No starting balance.',
  path: '/finance/savings-goal',
  keywords: 'savings goal calculator, monthly deposit for a target, annuity due savings',
});

export default function SavingsGoalPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Savings Goal Calculator",
    description: "Calculate the monthly deposit required to reach a financial target.",
    path: "/finance/savings-goal",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <SavingsGoalClient />
    </>
  );
}
