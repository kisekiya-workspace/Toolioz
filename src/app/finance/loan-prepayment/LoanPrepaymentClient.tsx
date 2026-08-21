'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateLoanPrepayment } from '@/lib/formulas';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { BookOpen, Info, Lightbulb, ShieldCheck, TrendingDown, Download } from 'lucide-react';

const PREPAYMENT_FAQS = [
  {
    question: "Does loan prepayment reduce tenure or EMI?",
    answer: "Most banks automatically apply loan prepayments toward reducing the remaining loan tenure, keeping the monthly EMI the same. However, you can request your bank to keep the tenure same and reduce your monthly EMI instead."
  },
  {
    question: "Are there prepayment penalty charges on home loans in India?",
    answer: "As per RBI guidelines, banks and housing finance companies (HFCs) cannot charge prepayment penalties on floating-rate home loans granted to individual borrowers."
  },
  {
    question: "Is it better to prepay a home loan or invest in mutual funds?",
    answer: "If your loan interest rate (e.g. 8.5%) is lower than expected long-term mutual fund returns (e.g. 12%), investing may yield higher net returns. However, prepayments guarantee a risk-free return equal to your loan interest rate."
  }
];

export default function LoanPrepaymentClient() {
  const [principal, setPrincipal] = useState<number>(1500000);
  const [annualRate, setAnnualRate] = useState<number>(10.5);
  const [yearsRemaining, setYearsRemaining] = useState<number>(5);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(5000);

  const result = useMemo(
    () =>
      calculateLoanPrepayment(principal, annualRate / 100, yearsRemaining, extraMonthlyPayment),
    [principal, annualRate, yearsRemaining, extraMonthlyPayment]
  );

  const monthlyPaymentWithExtra = result.baseEmi + Math.max(extraMonthlyPayment, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <div className="mb-4 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-700">
              Debt Paydown Tool
            </div>
            <h1 className={styles.title}>Loan Prepayment Calculator 2026</h1>
            <p className={styles.subtitle}>
              See how extra EMI payments reduce total interest and shorten your loan term.
            </p>
            <div className="mx-auto mt-6 max-w-[760px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-amber-900">
              <strong>Disclaimer:</strong> Some loans charge prepayment penalties or apply extra
              payments in specific ways. Always check your contract before making a lump sum payment.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input
                  label="Loan Principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  prefix="INR"
                />
                <Input
                  label="Annual Interest Rate (%)"
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  suffix="%"
                />
                <Input
                  label="Remaining Tenure (Years)"
                  type="number"
                  value={yearsRemaining}
                  onChange={(e) => setYearsRemaining(Number(e.target.value))}
                  suffix="years"
                />
                <Input
                  label="Extra Monthly Payment"
                  type="number"
                  value={extraMonthlyPayment}
                  onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
                  prefix="INR"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-red-500/30 bg-red-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-red-100 dark:text-red-400">Total Interest Saved</h2>
                <div className={styles.resultValue}>{formatCurrency(result.interestSaved)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Loan Closes In</span>
                    <span className={styles.statVal}>{result.monthsToClose} months</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Months Saved</span>
                    <span className={styles.statVal}>{result.monthsSaved} months</span>
                  </div>
                </div>
                <Button fullWidth className={styles.btn} onClick={() => window.print()}>
                  <Download className="mr-2 size-4" />
                  Download Prepayment Plan
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#dc2626' }}>
                  <Info size={20} />
                </div>
                <p className={styles.infoText}>
                  Extra payments reduce the principal faster, which means less interest is charged
                  in future months. The earlier you pay extra, the stronger the effect tends to be.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[900px]">
            <Card className="!p-8 bg-[#fef2f2]">
              <h2 className="mb-6 flex items-center gap-2 text-[1.4rem] font-bold text-[#991b1b]">
                <ShieldCheck className="text-[#dc2626]" /> What the prepayment math is showing
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-red-500">
                    Base EMI
                  </div>
                  <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
                    {formatCurrency(result.baseEmi)}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    The regular monthly payment without extra principal.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-red-500">
                    With Extra Payment
                  </div>
                  <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
                    {formatCurrency(monthlyPaymentWithExtra)}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    What you would pay each month if you add the extra amount.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-red-500">
                    Interest Without Prepayment
                  </div>
                  <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
                    {formatCurrency(result.totalInterestWithoutPrepayment)}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    A benchmark for comparing the savings impact.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mx-auto mt-8 max-w-[900px]">
            <FinancialDisclaimer />
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-6 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">
                <TrendingDown className="mr-2 inline-block text-red-600" size={22} />
                Debt Reduction Tips
              </h2>
              <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
                Prepayment works best when the payment is applied directly to principal.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Why early payment matters</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-red-500">-</span>
                    <span>Interest is charged on the remaining balance, so a smaller balance means less interest.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-red-500">-</span>
                    <span>Extra payments made early usually save more than the same amount paid later.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Info size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What to check first</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>Confirm whether the lender charges a prepayment penalty.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>Check whether extra money reduces principal immediately or is simply held as an advance payment.</span>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Good use cases</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Use a small extra EMI amount if you want to prepay without hurting cash flow.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Use a larger lump sum if you have a bonus or other one-time windfall.</span>
                    </li>
                  </ul>
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Compare the savings with any investment alternative before deciding.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Make sure you keep enough cash for emergencies after any prepayment.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <RelatedTools currentToolId="loan-prepayment" categoryId="finance" />

          <SEOSection
            title="Loan Prepayment Calculator for Faster Debt Payoff"
            description="A loan prepayment calculator shows how extra payments can reduce total interest and shorten your loan term. It is especially useful for loans with a large balance at the beginning, because more of each early payment goes toward interest."
            howToUse={[
              'Enter the loan principal, rate, and remaining tenure.',
              'Add the extra amount you can pay each month.',
              'Compare the baseline EMI with the prepayment scenario.',
              'Review how much interest and time you may save.',
              'Check your loan contract for any prepayment penalty.',
            ]}
            benefits={[
              'Shows the value of paying down principal sooner.',
              'Helps you compare debt payoff with other uses for extra cash.',
              'Useful for car loans, home loans, and personal loans.',
              'Makes the effect of an extra EMI easy to see before you commit.',
            ]}
            formula="EMI = P * r * (1+r)^n / ((1+r)^n - 1)"
          />
          <FAQSchema faqs={PREPAYMENT_FAQS} />
          <Footer />
      </div>
    </>
  );
}
