'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateCompoundInterest } from '@/lib/formulas';
import { TrendingUp, Info, Sparkles, ShieldCheck, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { calculatorPageStyles as styles } from './page.styles';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
const COMPOUND_FAQS = [
  {
    question: "What is the compound interest formula?",
    answer: "The compound interest formula is A = P(1 + r/n)^(nt), where A is the future value, P is principal, r is annual rate, n is compounding frequency per year, and t is time in years."
  },
  {
    question: "How does compounding frequency affect total returns?",
    answer: "Higher compounding frequency (e.g. daily vs annual) leads to higher Effective Annual Rate (EAR) and greater overall returns, because interest is added back to principal more frequently."
  },
  {
    question: "What is the Rule of 72?",
    answer: "The Rule of 72 is a quick mental math rule to estimate how many years it takes for an investment to double. Simply divide 72 by the annual interest rate (e.g., 72 / 12% = 6 years)."
  }
];

export default function CompoundInterestClient() {
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [freq, setFreq] = useState<number>(12); // Monthly
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const finalAmount = calculateCompoundInterest(principal, rate / 100, freq, years);
    setResult(finalAmount);
  }, [principal, rate, years, freq]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="mx-auto max-w-6xl">
            <h1 className={styles.title}>Compound Interest Calculator 2026</h1>
            <p className={styles.subtitle}>Future value of investment calculator with daily, monthly, quarterly &amp; annual compounding.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> This calculator provides <strong>theoretical projections</strong> based on assumed constant interest rates. Actual returns depend on market conditions, fees, and tax implications. For <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl py-16">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Initial Investment" 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  prefix="$"
                />
                <Input 
                  label="Annual Interest Rate (%)" 
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
                <div className={styles.selectGroup}>
                  <label className={styles.label}>Compounding Frequency</label>
                  <select 
                    className={styles.select}
                    value={freq}
                    onChange={(e) => setFreq(Number(e.target.value))}
                  >
                    <option value={1}>Annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className={styles.resultCard}>
                <h2 className={styles.resultLabel}>Future Value</h2>
                <div className={styles.resultValue}>{formatCurrency(result)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Interest</span>
                    <span className={styles.statVal}>{formatCurrency(result - principal)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Principal</span>
                    <span className={styles.statVal}>{formatCurrency(principal)}</span>
                  </div>
                </div>
                <Button 
                  fullWidth 
                  className={styles.btn}
                  onClick={() => window.print()}
                >
                  Download Report
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon}><Info size={20} /></div>
                <p className={styles.infoText}>
                  Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods on a deposit or loan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax & Compounding Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#ecfeff]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#0e7490] flex items-center gap-2">
              <ShieldCheck className="text-[#0891b2]" /> 💸 Tax Impact on Compounding (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0e7490]">Tax-Deferred Growth</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0e7490]/80">
                  <li><strong>The Advantage:</strong> Compounding works best when tax is not deducted every year. In mutual funds, you only pay tax when you sell.</li>
                  <li><strong>The Cost of Tax:</strong> If you pay 30% tax on interest every year (like in an FD), your effective compounding rate drops significantly.</li>
                  <li><strong>Example:</strong> A 10% return compounded for 20 years yields 6.7x. But if 30% tax is taken annually (7% net), it yields only 3.8x!</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0e7490]">Tax-Free Havens</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0e7490]/80">
                  <li><strong>PPF (India):</strong> The ultimate compounding tool. Zero tax on interest and zero tax on maturity (EEE status).</li>
                  <li><strong>LTCG Buffer:</strong> Since the first ₹1.25 Lakh of equity gains are tax-free each year, small investors can compound wealth almost tax-free.</li>
                  <li><strong>Post-Tax Compounding:</strong> Always focus on the post-tax return to see the true power of your wealth journey.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">⏳ Compound Interest Tips</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Unlocking the eighth wonder of the world.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Compounding Magic</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Frequency:</strong> Monthly compounding beats annual compounding for the same rate.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Rule of 72:</strong> Divide 72 by interest rate to estimate when your money doubles (e.g., 72/10 = 7.2 yrs).</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Principal vs Interest:</strong> In later years, interest on interest drives the most growth.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>EAR:</strong> Effective Annual Rate is the true return. A 12% rate compounded monthly is 12.68% EAR.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Unwritten Rules</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Time beats Timing:</strong> Starting 5 years early is better than finding a 2% higher return.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Cost of Delay:</strong> Delaying a ₹10,000 monthly investment by 1 year costs lakhs over 20 years.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Both Ways:</strong> It destroys wealth in high-interest debt like credit cards.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Inflation:</strong> The negative compounder. 10% growth - 6% inflation = 4% real growth.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Exponential Growth Tips</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Reinvest Dividends:</strong> Always choose the "Growth" option in mutual funds.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>10-10-10 Rule:</strong> Save 10% of income for 10 years at a 10% return.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Tax-efficiency:</strong> Works best in tax-free accounts (like PPF) to avoid tax drag.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Step-up:</strong> Increase monthly investments by 5–10% annually to reach goals faster.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Discipline:</strong> A single withdrawal in year 10 can halve the maturity value in year 20.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="compound-interest" categoryId="finance" />

        <SEOSection 
          title="Compound Interest: Daily Compounding & Future Value Analysis 2026"
          description="Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. Our future value of investment calculator 2026 allows you to simulate daily compound interest with deposits to see how 'interest on interest' makes your wealth grow at a faster rate."
          howToUse={[
            "Enter the initial investment amount (principal).",
            "Specify the annual interest rate as a percentage.",
            "Choose the total number of years you plan to invest.",
            "Select the compounding frequency (monthly, annually, etc.).",
            "Review the future value and total interest earned."
          ]}
          benefits={[
            "Helps in long-term wealth projection.",
            "Demonstrates the power of consistent investing.",
            "Compares different compounding frequencies.",
            "Visualizes the impact of inflationary growth."
          ]}
          formula="A = P(1 + r/n)^(nt)"
        />
        <FAQSchema faqs={COMPOUND_FAQS} />
      <Footer />
    </div>
    </>
  );
}
