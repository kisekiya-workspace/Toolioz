'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateCompoundInterest } from '@/lib/formulas';
import { TrendingUp, Info, Sparkles, ShieldCheck, BookOpen, Clock, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
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
    answer: "Divide 72 by the annual rate in percent for a rough doubling time. At 12% that estimate is 6 years. It is not the result this calculator prints."
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
            <p className={styles.subtitle}>Compound interest is interest earned on both the original principal and interest already added. Future value follows A = P(1 + r/n)^(nt) for the compounding frequency selected on this page.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> This calculator provides <strong>theoretical projections</strong> based on assumed constant interest rates. Actual returns depend on market conditions, fees, and tax implications. For <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl pb-12 pt-4">
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
              <Card className="rounded-2xl border border-indigo-500/30 bg-indigo-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-100 dark:text-indigo-400">Total Future Value</h2>
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
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-blue-600`}><Info size={20} /></div>
                <p className={styles.infoText}>
                  Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods on a deposit or loan.
                </p>
              </div>
            </div>
          </div>

          {/* Year-by-Year Growth Table */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-6">
            <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Year-by-Year Growth Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-3 font-bold">Year</th>
                    <th className="p-3 font-bold">Starting Principal</th>
                    <th className="p-3 font-bold">Interest Earned</th>
                    <th className="p-3 font-bold">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: Math.min(years, 30) }, (_, i) => {
                    const y = i + 1;
                    const startBal = calculateCompoundInterest(principal, rate / 100, freq, y - 1);
                    const endBal = calculateCompoundInterest(principal, rate / 100, freq, y);
                    const interestEarned = endBal - startBal;
                    return (
                      <tr key={y} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">Year {y}</td>
                        <td className="p-3 text-slate-600">{formatCurrency(startBal)}</td>
                        <td className="p-3 text-emerald-600 font-semibold">+{formatCurrency(interestEarned)}</td>
                        <td className="p-3 font-bold text-slate-900">{formatCurrency(endBal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax & Compounding Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#ecfeff]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#0e7490] flex items-center gap-2">
              <ShieldCheck className="text-[#0891b2]" /> What the annual example leaves out
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0e7490]">Annual compounding only</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0e7490]/80">
                  <li><strong>$10,000 at 10%:</strong> With frequency set to yearly, 20 years grows to about $67,275, or 6.73 times the principal.</li>
                  <li><strong>$10,000 at 7%:</strong> The same yearly setting for 20 years grows to about $38,697, or 3.87 times the principal.</li>
                  <li><strong>No tax field:</strong> The page does not reduce the rate for income tax, capital gains, or a mutual-fund exit.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0e7490]">Not a product comparison</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0e7490]/80">
                  <li><strong>One principal:</strong> The formula does not add deposits or withdrawals.</li>
                  <li><strong>Frequencies:</strong> The selector is yearly, quarterly, monthly, or daily. The default is monthly.</li>
                  <li><strong>Currency:</strong> Results are formatted in USD. The page does not rank PPF, FDs, or equity funds.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">What the formula does</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">One principal, one annual rate, and a compounding frequency of 1, 4, 12, or 365.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Worked figures</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Default:</strong> ₹10,000 at 5% for 10 years, compounded monthly, finishes near ₹16,470. Interest is about ₹6,470.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Daily:</strong> The same principal, rate, and term compounded daily finishes near ₹16,487.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Rule of 72:</strong> 72 divided by the annual percent is a rough doubling time. At 12% that estimate is 6 years. The calculator does not print it.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>EAR:</strong> A 12% nominal rate compounded monthly is about 12.68% effective per year: (1 + 0.12 / 12)^12 − 1.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not in this calculator</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>No deposits:</strong> Monthly contributions and step-ups are not inputs. Those belong on the SIP calculator.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>No withdrawals:</strong> The balance is never reduced during the term.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>No inflation:</strong> A nominal result is not converted to purchasing power.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>No tax:</strong> The future value is before tax and fees.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Frequency options</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Annual:</strong> n = 1.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Quarterly:</strong> n = 4.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Monthly:</strong> n = 12. This is the starting selection.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Daily:</strong> n = 365. The same 5% and 10-year example is about ₹17 higher than monthly.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Interest line:</strong> Future value minus the principal typed in.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="compound-interest" categoryId="finance" />

        <SEOSection 
          title="Compound interest future value"
          description="Compound interest adds each period’s interest to the principal. Future value is A = P(1 + r/n)^(nt). The page starts at monthly compounding. ₹10,000 at 5% for 10 years finishes near ₹16,470 monthly and near ₹16,487 daily. Contributions, withdrawals, inflation, and tax are not applied."
          howToUse={[
            "Enter the principal.",
            "Enter the annual rate as a percent. The formula uses that number divided by 100.",
            "Enter the term in years.",
            "Select annual, quarterly, monthly, or daily compounding.",
            "Read the future value and the interest, which is future value minus principal."
          ]}
          benefits={[
            "Annual, quarterly, monthly, and daily use n = 1, 4, 12, and 365.",
            "The starting selection is monthly.",
            "Interest shown is future value minus the entered principal.",
            "No extra deposits or withdrawals are applied during the term.",
            "Inflation and tax are not subtracted."
          ]}
          formula="A = P(1 + r/n)^(nt)"
        />
        <FAQSchema faqs={COMPOUND_FAQS} />
      <Footer />
    </div>
    </>
  );
}
