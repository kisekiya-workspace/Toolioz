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
import { BookOpen, Coins, Info, Lightbulb, ShieldCheck, TrendingUp } from 'lucide-react';

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
              Project how a one-time investment can grow with compounding over the years.
            </p>
            <div className="mx-auto mt-6 max-w-[760px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-amber-900">
              <strong>Disclaimer:</strong> This calculator shows a simplified projection based on
              constant return assumptions. Actual market returns vary and may be higher or lower.
              Use it for planning, not guarantees.
            </div>
          </div>
        </header>

        <section className="container section">
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
              <Card className={styles.resultCard} style={{ background: 'linear-gradient(135deg, #0f766e, #115e59)' }}>
                <h2 className={styles.resultLabel}>Projected Future Value</h2>
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
                  Download Projection
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#0f766e' }}>
                  <Info size={20} />
                </div>
                <p className={styles.infoText}>
                  A lumpsum investment gives your money more time to compound. If the goal is long
                  term, getting capital into the market sooner can matter more than waiting for the
                  &quot;perfect&quot; entry date.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[900px]">
            <Card className="!p-8 bg-[#ecfdf5]">
              <h2 className="mb-6 flex items-center gap-2 text-[1.4rem] font-bold text-[#047857]">
                <ShieldCheck className="text-[#10b981]" /> Why lumpsum investing works
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#047857]">When it helps most</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#047857]/80">
                    <li>
                      If you already have idle cash and a long time horizon, investing the money
                      sooner can give compounding more years to work.
                    </li>
                    <li>
                      It can be useful for long-term goals like retirement, education, or a future
                      down payment that is several years away.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#047857]">What the Rule of 72 suggests</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#047857]/80">
                    <li>
                      Divide 72 by your expected return to estimate how many years it may take to
                      double the money.
                    </li>
                    <li>
                      A 12 percent return implies roughly 6 years to double, while a 9 percent
                      return implies about 8 years.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <section className="mx-auto max-w-[900px] px-6 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">
                <TrendingUp className="mr-2 inline-block text-emerald-600" size={22} />
                Long-Term Growth Tips
              </h2>
              <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">
                Small choices in the beginning can create large differences later.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Use Case Fit</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-teal-500">-</span>
                    <span>
                      Best for long-duration goals where you want your capital working from day one.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-teal-500">-</span>
                    <span>
                      Useful when you are comfortable with market volatility and have a clear time horizon.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Coins size={20} />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Planning Reality Check</h3>
                </div>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-amber-500">-</span>
                    <span>
                      If you need the money in 1 to 3 years, keep the return assumption conservative.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 shrink-0 text-amber-500">-</span>
                    <span>
                      For short-term goals, a bank deposit or safer debt option may be more suitable.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:col-span-2">
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
                      <span>Use the projection as a planning guide, then verify the assumptions with your advisor.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <RelatedTools currentToolId="lumpsum-calculator" categoryId="finance" />

          <SEOSection
            title="Lumpsum Calculator for Long-Term Investing"
            description="A lumpsum calculator helps you estimate how a one-time investment may grow over time when compounding is allowed to work uninterrupted. It is especially useful for long-term goals where the money can stay invested for years rather than months."
            howToUse={[
              'Enter the amount you want to invest in one go.',
              'Add your expected annual return assumption.',
              'Choose the time horizon for the investment.',
              'Review the projected future value and total gain.',
              'Compare different return scenarios to stress test your plan.',
            ]}
            benefits={[
              'Shows the power of starting early with capital already available.',
              'Helps compare one-time investing with monthly SIP planning.',
              'Makes long-term goal setting more realistic and measurable.',
              'Useful for retirement, education, and other distant goals.',
            ]}
            formula="FV = P(1 + r/12)^(12t)"
          />
        </section>

        <Footer />
      </div>
    </>
  );
}
