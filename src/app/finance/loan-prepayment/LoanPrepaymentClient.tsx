'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateLoanPrepayment } from '@/lib/formulas';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { BookOpen, Info, Lightbulb, ShieldCheck, TrendingDown, Printer } from 'lucide-react';

const PREPAYMENT_FAQS = [
  {
    question: "Does this calculator shorten the tenure or lower the EMI?",
    answer: "It keeps the EMI and adds the extra amount every month. The loan closes in fewer months. A version that keeps the tenure and lowers the EMI is not calculated."
  },
  {
    question: "Does the result include a prepayment penalty?",
    answer: "No. A penalty is not subtracted. A one-time lump-sum prepayment is not an input."
  },
  {
    question: "Does this page compare prepayment with a mutual fund?",
    answer: "No. The result is interest saved and months removed on this loan. An investment return is not calculated."
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
              The EMI stays the same. An extra amount is added every month, interest is charged on the remaining balance, and the loan closes in fewer months. A one-time lump sum is not an input.
            </p>
            <div className="mx-auto mt-6 max-w-[760px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-amber-900">
              <strong>Disclaimer:</strong> The 10.5% rate is an illustrative default. A prepayment penalty is not subtracted. Amounts are in rupees.
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
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-red-600`}>
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
                    EMI plus the extra monthly amount. The EMI itself does not change.
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
                Default prepayment
              </h2>
              <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
                The extra amount is paid every month from the first month. The EMI is not reduced.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Starting example</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-red-500">-</span>
                    <span>₹15,00,000 at 10.5% for 5 years has an EMI of about ₹32,241.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-red-500">-</span>
                    <span>Interest without the extra payment is about ₹4,34,451 over 60 months.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Info size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">With ₹5,000 extra</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>Interest falls to about ₹3,57,528. About ₹76,923 of interest is saved.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-orange-500">-</span>
                    <span>The loan closes in 50 months, which is 10 months sooner.</span>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not simulated</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>A one-time lump sum is not an input.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>A penalty is not subtracted from the interest saved.</span>
                    </li>
                  </ul>
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>An investment return is not compared with the interest saved.</span>
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

          <RelatedTools currentToolId="loan-prepayment" categoryId="finance" />

          <SEOSection
            title="Extra monthly payment on a loan"
            description={`The EMI stays the same. An extra amount is added every month, interest is charged on the remaining balance, and the loan closes in fewer months.

₹15,00,000 at 10.5% for 5 years has an EMI of about ₹32,241 and about ₹4,34,451 of interest over 60 months. Adding ₹5,000 every month cuts interest to about ₹3,57,528, a saving of about ₹76,923, and closes the loan in 50 months. A one-time lump sum and a prepayment penalty are not applied. The EMI is not reduced.`}
            howToUse={[
              'Enter the outstanding principal. The default is ₹15,00,000.',
              'Enter the annual rate. The default is 10.5%.',
              'Enter the remaining tenure in years. The default is 5, which is 60 months.',
              'Enter the extra amount paid every month. The default is ₹5,000.',
              'Read interest saved, the months until the balance reaches zero, and the months removed.',
            ]}
            benefits={[
              'The EMI is calculated once and then held constant.',
              'The ₹76,923 example uses the defaults above.',
              'The loan in that example closes 10 months sooner.',
              'A lower EMI with the same tenure is not calculated.',
              'Amounts are formatted in rupees.',
            ]}
            formula="EMI = P * r * (1+r)^n / ((1+r)^n - 1)"
          />
          <FAQSchema faqs={PREPAYMENT_FAQS} />
          <Footer />
      </div>
    </>
  );
}
