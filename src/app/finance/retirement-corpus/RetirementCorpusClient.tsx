'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateRetirementCorpus } from '@/lib/formulas';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { BookOpen, Info, Lightbulb, ShieldCheck, Target, Wallet, Printer } from 'lucide-react';

const RETIREMENT_FAQS = [
  {
    question: "Does this calculator use the 4% rule?",
    answer: "No. The corpus is the present value of a constant annual expense for the retirement years, discounted at the post-retirement return. The default is 25 years at 5.5% a year."
  },
  {
    question: "How does the 6% inflation input change today's expense?",
    answer: "₹60,000 a month for 20 years at 6% becomes about ₹1,92,428 a month, about 3.21 times the starting expense. ₹50,000 on the same path becomes about ₹1,60,357. Spending is not inflated again during retirement."
  },
  {
    question: "Is the withdrawal a mutual-fund SWP?",
    answer: "No. Retirement spending is one constant annual amount. Monthly fund units and a systematic withdrawal plan are not modeled."
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
              Today&apos;s monthly expense is inflated to the retirement date. That amount times 12 is then discounted as a constant annual payment for the retirement years. Current savings compound monthly until retirement, and the gap is turned into a flat monthly deposit.
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
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-amber-600`}>
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
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Default at 6% inflation</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                    <li>₹60,000 a month for 20 years becomes about ₹1,92,428 a month.</li>
                    <li>That is about ₹23,09,138 a year, and it stays at that level during retirement.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Corpus and the gap</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                    <li>25 years of that annual expense, discounted at 5.5%, is a corpus of about ₹3.10 crore.</li>
                    <li>₹25,00,000 compounded monthly at 10.5% for 20 years is about ₹2.02 crore. The gap is about ₹1.07 crore, which needs about ₹13,142 a month.</li>
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
                Retirement defaults
              </h2>
              <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
                Pre-retirement growth is monthly. The retirement corpus is an annual annuity.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Before retirement</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>Current savings use monthly compounding at the pre-retirement return. The default is 10.5%.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>The monthly deposit uses the same start-of-month formula as the savings-goal calculator.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Wallet size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">During retirement</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-green-500">-</span>
                    <span>The annual expense stays flat. It is not inflated again each retirement year.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-green-500">-</span>
                    <span>The discount rate is the post-retirement return, compounded once a year. The default is 5.5%.</span>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not applied</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>A 4% withdrawal rule is not used.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Tax and healthcare costs are not added on top of the expense.</span>
                    </li>
                  </ul>
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>A mutual-fund systematic withdrawal plan is not modeled.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Amounts are formatted in rupees.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <RelatedTools currentToolId="retirement-corpus" categoryId="finance" />

          <SEOSection
            title="Retirement corpus from an annual annuity"
            description={`Today's monthly expense is inflated to the retirement date and multiplied by 12. That annual amount is discounted for the retirement years at the post-retirement return. It stays flat during retirement. Current savings compound monthly, and the gap becomes a flat monthly deposit.

₹60,000 a month, 20 years to retirement, 25 years in retirement, 6% inflation, 10.5% before retirement, and 5.5% after, with ₹25,00,000 already saved, produces a future expense of about ₹1,92,428 a month and a corpus of about ₹3.10 crore. The savings grow to about ₹2.02 crore, leaving a gap of about ₹1.07 crore, or about ₹13,142 a month. A 4% withdrawal rule is not used.`}
            howToUse={[
              'Enter the current monthly expense. The default is ₹60,000.',
              'Enter years to retirement and years in retirement. The defaults are 20 and 25.',
              'Enter inflation, the pre-retirement return, and the post-retirement return. The defaults are 6%, 10.5%, and 5.5%.',
              'Enter current savings. The default is ₹25,00,000. It compounds monthly.',
              'Read the corpus, the future monthly expense, and the monthly deposit for the gap.',
            ]}
            benefits={[
              'Inflation is applied only until the retirement date.',
              'The corpus discounts a constant annual expense once a year.',
              'The ₹3.10 crore example uses the defaults above.',
              'The monthly deposit matches the savings-goal formula.',
              'Tax and a systematic withdrawal plan are not applied.',
            ]}
            formula="Corpus = Annual expense × [1 − (1 + r)^−n] / r"
          />
          <FAQSchema faqs={RETIREMENT_FAQS} />
        </section>

        <Footer />
      </div>
    </>
  );
}
