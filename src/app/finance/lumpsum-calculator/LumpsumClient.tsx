'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateLumpsum } from '@/lib/formulas';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { BookOpen, Coins, Info, Lightbulb, ShieldCheck, TrendingUp, Printer } from 'lucide-react';

const LUMPSUM_FAQS = [
  {
    question: "What does this lumpsum calculator project?",
    answer: "One principal compounded monthly until the end of the term. No further deposits are added, and the annual rate stays constant."
  },
  {
    question: "Which compounding frequency is used?",
    answer: "Monthly only. Future value is P × (1 + r/12)^(12 × years). It is not P × (1 + r)^years."
  },
  {
    question: "Does this page decide whether a lumpsum beats a SIP?",
    answer: "No. A monthly SIP is calculated on the SIP page. This result does not model market drops or rupee-cost averaging."
  }
];

export default function LumpsumClient() {
  const [principal, setPrincipal] = useState<number>(250000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const futureValue = useMemo(() => calculateLumpsum(principal, rate / 100, years), [principal, rate, years]);
  const totalGain = futureValue - principal;
  const growthMultiplier = principal > 0 ? futureValue / principal : 0;
  const ruleOf72 = rate > 0 ? 72 / rate : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              One-Time Investment Planner
            </div>
            <h1 className={styles.title}>Lumpsum Calculator 2026</h1>
            <p className={styles.subtitle}>
              A lumpsum here is one deposit compounded monthly. Future value is P × (1 + r/12)^(12 × years). The rate stays constant, and no further deposits are added.
            </p>
            <div className="mx-auto mt-6 max-w-[760px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-amber-900">
              <strong>Disclaimer:</strong> This calculator shows a simplified projection based on
              constant return assumptions. Actual market returns vary and may be higher or lower.
              Use it for planning, not guarantees.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input
                  label="Investment Amount"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  prefix="INR"
                />
                <Input
                  label="Expected Annual Return (%)"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  suffix="%"
                />
                <Input
                  label="Time Horizon (Years)"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  suffix="years"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-teal-500/30 bg-teal-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-100 dark:text-teal-400">Total Maturity Value</h2>
                <div className={styles.resultValue}>{formatCurrency(futureValue)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Gain</span>
                    <span className={styles.statVal}>{formatCurrency(totalGain)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Growth Multiple</span>
                    <span className={styles.statVal}>{growthMultiplier.toFixed(2)}x</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Rule of 72</span>
                    <span className={styles.statVal}>
                      {ruleOf72 > 0 ? `~${ruleOf72.toFixed(1)} years to double` : 'N/A'}
                    </span>
                  </div>
                </div>
                <Button fullWidth className={styles.btn} onClick={() => window.print()}>
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-teal-700`}>
                  <Info size={20} />
                </div>
                <p className={styles.infoText}>
                  ₹2,50,000 at 12% for 10 years finishes near ₹8,25,097. The gain is about ₹5,75,097, about 3.30 times the principal. The Rule of 72 line is 72 ÷ 12 = 6.0 years. Doubling at 1% a month is about 5.8 years.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[900px]">
            <Card className="!p-8 bg-[#ecfdf5]">
              <h2 className="mb-6 flex items-center gap-2 text-[1.4rem] font-bold text-[#047857]">
                <ShieldCheck className="text-[#10b981]" /> Starting example at 12%
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#047857]">Monthly compound</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#047857]/80">
                    <li>₹2,50,000 at 12% for 10 years finishes near ₹8,25,097.</li>
                    <li>The gain is about ₹5,75,097. The growth multiple is about 3.30.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#047857]">Rule of 72</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#047857]/80">
                    <li>The on-screen estimate is 72 divided by the annual percent. At 12% that is 6.0 years.</li>
                    <li>Doubling under the monthly formula, at 1% a month, takes about 5.8 years. The page does not print that second figure.</li>
                  </ul>
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
                <TrendingUp className="mr-2 inline-block text-emerald-600" size={22} />
                Long-term growth is one monthly compound path
              </h2>
              <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
                The frequency is fixed at 12. Tax and an expense ratio are not subtracted.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What is included</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-teal-500">-</span>
                    <span>One principal, compounded every month.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-teal-500">-</span>
                    <span>No extra deposits during the term.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Coins size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What is left out</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-amber-500">-</span>
                    <span>A market drop is not modeled. The rate stays at the number entered.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-amber-500">-</span>
                    <span>Tax and an expense ratio are not subtracted. A SIP comparison is not calculated.</span>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Useful inputs to test</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Compare 8 percent, 10 percent, and 12 percent return scenarios.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>See how adding even 2 to 3 extra years changes the final corpus.</span>
                    </li>
                  </ul>
                  <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>Check how the growth multiple changes if you start with a larger corpus.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 shrink-0 text-cyan-500">-</span>
                      <span>The result is a constant-rate projection. It is not a fund recommendation.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <RelatedTools currentToolId="lumpsum-calculator" categoryId="finance" />

          <SEOSection
            title="Monthly lumpsum future value"
            description="A lumpsum here is one deposit compounded monthly. Future value is P × (1 + r/12)^(12 × years). ₹2,50,000 at 12% for 10 years finishes near ₹8,25,097, a gain of about ₹5,75,097. The Rule of 72 line is 72 divided by the annual percent, which is 6.0 years at 12%. Tax and further deposits are not applied."
            howToUse={[
              'Enter the one-time amount. The default is ₹2,50,000.',
              'Enter the annual rate as a percent. The formula divides it by 12.',
              'Enter the term in years. The default is 10.',
              'Read the maturity value, the gain, and the growth multiple.',
              'The Rule of 72 line is 72 divided by the annual percent. It is not the monthly formula’s doubling time.',
            ]}
            benefits={[
              'Compounding is monthly. Annual compounding is not used.',
              'The ₹8,25,097 example uses ₹2,50,000, 12%, and 10 years.',
              'No further deposits are added.',
              'A SIP comparison is not calculated on this page.',
              'Amounts are formatted in rupees.',
            ]}
            formula="A = P(1 + r/12)^(12t)"
          />
          <FAQSchema faqs={LUMPSUM_FAQS} />
          <Footer />
      </div>
    </>
  );
}
