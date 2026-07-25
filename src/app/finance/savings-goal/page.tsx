import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import SavingsGoalClient from './SavingsGoalClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Savings Goal Calculator 2026 | Monthly Target & 50/30/20 Budget | Toolioz",
  description: "Calculate how much to save monthly for a house, car, or emergency fund. Includes 50/30/20 budgeting rule, goal-based investing strategies, and sinking fund tips.",
  keywords: 'savings goal calculator, how much to save per month for house, emergency fund calculator india, 50 30 20 rule calculator, down payment savings calculator, child education fund calculator, monthly savings target tool, financial goal planner, sinking fund calculator',
  alternates: {
    canonical: 'https://toolioz.com/finance/savings-goal',
  },
  openGraph: {
    title: 'Savings Goal Calculator 2026 — Monthly Target & Budgeting Tips | Toolioz',
    description: 'Calculate monthly savings needed for your goals. Get tips on 50/30/20 budgeting, emergency funds, and goal-based investing.',
    url: 'https://toolioz.com/finance/savings-goal',
    type: 'website',
  }
};

export default function SavingsGoalPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "Savings Goal Calculator",
    description: "Plan your monthly savings to reach a financial target.",
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
