'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateRetirementCorpus } from '@/lib/formulas';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { BookOpen, Info, Lightbulb, ShieldCheck, Target, Wallet, Download } from 'lucide-react';

const RETIREMENT_FAQS = [
  {
    question: "What is the 4% Rule in Retirement Planning?",
    answer: "The 4% rule states that you can withdraw 4% of your total retirement savings in the first year of retirement, and adjust that amount for inflation each subsequent year, with a high probability that your money will last 30 years."
  },
  {
    question: "How does inflation affect retirement corpus calculations?",
    answer: "Inflation reduces purchasing power over time. At a 6% annual inflation rate, monthly expenses of ₹50,000 today will grow to ₹1.6 Lakhs per month in 20 years, quadrupling the required retirement corpus."
  },
  {
    question: "What is SWP (Systematic Withdrawal Plan)?",
    answer: "A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount regularly from your mutual fund investments, generating regular monthly cash flow for retirement while keeping the remaining principal invested."
  }
];

export default function RetirementCorpusClient() {
  const [monthlyExpense, setMonthlyExpense] = useState<number>(60000);
  const [yearsToRetirement, setYearsToRetirement] = useState<number>(20);
  const [yearsInRetirement, setYearsInRetirement] = useState<number>(25);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [preRetirementReturn, setPreRetirementReturn] = useState<number>(10.5);
  const [postRetirementReturn, setPostRetirementReturn] = useState<number>(5.5);
  const [currentSavings, setCurrentSavings] = useState<number>(2500000);

  const result = useMemo(
    () =>
      calculateRetirementCorpus(
        monthlyExpense,
        yearsToRetirement,
        yearsInRetirement,
        inflationRate / 100,
        preRetirementReturn / 100,
        postRetirementReturn / 100,
        currentSavings
      ),
    [monthlyExpense, yearsToRetirement, yearsInRetirement, inflationRate, preRetirementReturn, postRetirementReturn, currentSavings]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <div className="mb-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
              Inflation-Aware Retirement Planner
            </div>
            <h1 className={styles.title}>Retirement Corpus Calculator 2026</h1>
            <p className={styles.subtitle}>
              Estimate the corpus you need to fund retirement spending after inflation and expected returns.
            </p>
            <div className="mx-auto mt-6 max-w-[760px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-amber-900">
              <strong>Disclaimer:</strong> This is a planning estimate, not a promise. Lifestyle,
              healthcare, taxes, and market returns can change the number significantly.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input
                  label="Current Monthly Expense"
                  type="number"
                  value={monthlyExpense}
                  onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                  prefix="INR"
                />
                <Input
                  label="Years to Retirement"
                  type="number"
                  value={yearsToRetirement}
                  onChange={(e) => setYearsToRetirement(Number(e.target.value))}
                  suffix="years"
                />
                <Input
                  label="Years in Retirement"
                  type="number"
                  value={yearsInRetirement}
                  onChange={(e) => setYearsInRetirement(Number(e.target.value))}
                  suffix="years"
                />
                <Input
                  label="Expected Inflation (%)"
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  suffix="%"
                />
                <Input
                  label="Pre-Retirement Return (%)"
                  type="number"
                  value={preRetirementReturn}
                  onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
                  suffix="%"
                />
                <Input
                  label="Post-Retirement Return (%)"
                  type="number"
                  value={postRetirementReturn}
                  onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
                  suffix="%"
                />
                <Input
                  label="Current Retirement Savings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  prefix="INR"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-amber-500/30 bg-amber-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-100 dark:text-amber-400">Required Retirement Corpus</h2>
                <div className={styles.resultValue}>{formatCurrency(result.corpusNeeded)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Monthly Saving Needed</span>
                    <span className={styles.statVal}>{formatCurrency(result.monthlySavingsNeeded)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Future Expense / Month</span>
                    <span className={styles.statVal}>{formatCurrency(result.futureMonthlyExpense)}</span>
                  </div>
                </div>
                <Button fullWidth className={styles.btn} onClick={() => window.print()}>
                  <Download className="mr-2 size-4" />
                  Download Retirement Plan
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#d97706' }}>
                  <Info size={20} />
                </div>
                <p className={styles.infoText}>
                  Retirement planning is a spending problem first and an investing problem second.
                  Start with the monthly expense you want in the future, inflate it forward, and
                  then figure out how much capital you need to support that lifestyle.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[900px]">
            <Card className="!p-8 bg-[#fff7ed]">
              <h2 className="mb-6 flex items-center gap-2 text-[1.4rem] font-bold text-[#9a3412]">
                <ShieldCheck className="text-[#ea580c]" /> How the retirement corpus is built
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Future spending</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                    <li>
                      Your current monthly expenses are inflated forward to the retirement date.
                    </li>
                    <li>
                      That future monthly number is what retirement income has to support.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Corpus support period</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                    <li>
                      The tool assumes your corpus needs to last for the number of retirement years you enter.
                    </li>
                    <li>
                      A longer retirement horizon means a larger corpus, even when the monthly expense is unchanged.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="mx-auto mt-8 max-w-[900px]">
            <FinancialDisclaimer />
          </div>

          <section className="mx-auto max-w-[900px] px-6 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">
                <Target className="mr-2 inline-block text-amber-600" size={22} />
                Retirement Planning Tips
              </h2>
              <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
                The best retirement plan is one you can maintain before and after retirement.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What to include</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>Housing, food, transport, healthcare, and basic lifestyle spending.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>Any loan payments or family obligations that will still exist later.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Wallet size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What to review</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-green-500">-</span>
                    <span>Revisit your assumptions every year because inflation and income can change.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-green-500">-</span>
                    <span>Use current savings and future returns to see how much of the corpus is already funded.</span>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Practical check</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Test a higher inflation rate to see how sensitive the corpus target is.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Lower the return assumption if you want a more conservative plan.</span>
                    </li>
                  </ul>
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Include current retirement savings to estimate the remaining gap more accurately.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Keep the plan flexible. Retirement numbers are updated best when life changes.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <RelatedTools currentToolId="retirement-corpus" categoryId="finance" />

          <SEOSection
            title="Retirement Corpus Calculator with Inflation Planning"
            description="A retirement corpus calculator helps you estimate the amount of money you need so your retirement spending can continue after you stop working. The key is to start with your future monthly expense, not your current income, and then adjust that number for inflation and the time the money must last."
            howToUse={[
              'Enter your current monthly spending.',
              'Choose how many years remain until retirement.',
              'Pick how long the money should last during retirement.',
              'Set inflation and expected return assumptions.',
              'Review the retirement corpus and the monthly savings gap.',
            ]}
            benefits={[
              'Turns a vague retirement goal into a number you can plan around.',
              'Accounts for inflation, which is one of the biggest retirement risks.',
              'Shows how current savings can reduce future monthly investment needs.',
              'Useful for conservative, balanced, or more aggressive planning styles.',
            ]}
            formula="Corpus = Annual Expense x [1 - (1 + r)^-n] / r"
          />
          <FAQSchema faqs={RETIREMENT_FAQS} />
        </section>

        <Footer />
      </div>
    </>
  );
}
