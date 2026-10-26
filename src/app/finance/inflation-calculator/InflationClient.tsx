'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateInflation } from '@/lib/formulas';
import { Info, Landmark, TrendingDown, AlertTriangle, ShieldCheck, BookOpen, Lightbulb, TrendingUp, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const INFLATION_FAQS = [
  {
    question: "What is the formula for calculating future inflation cost?",
    answer: "Future cost = present amount × (1 + rate)^years. ₹1,00,000 at 6% for 10 years is about ₹1,79,085. The page starts at 5%, which makes the same amount about ₹1,62,889."
  },
  {
    question: "Does this calculator subtract inflation from an investment return?",
    answer: "No. It raises a present amount by (1 + rate)^years and also shows that amount divided by the same factor. A nominal return minus inflation is not calculated."
  },
  {
    question: "Does this page rank assets that beat inflation?",
    answer: "No. Equity, real estate, gold, and savings-account returns are not inputs. The only rate used is the inflation percent entered on the page."
  }
];

export default function InflationClient() {
  const [amount, setAmount] = useState<number>(100000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [futurePrice, setFuturePrice] = useState<number>(0);

  useEffect(() => {
    const futureVal = calculateInflation(amount, rate / 100, years);
    setFuturePrice(futureVal);
  }, [amount, rate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  // What today's amount will be worth in purchasing power after inflation
  const realValue = amount / Math.pow(1 + rate / 100, years);
  const purchasingPowerLoss = ((1 - realValue / amount) * 100);

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>Inflation Calculator 2026</h1>
            <p className={styles.subtitle}>Inflation raises a future price by multiplying the present amount by (1 + rate) for each year. The same formula shows how much purchasing power a present sum loses over that period.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> The 5% rate is an illustrative default. The same rate is applied every year. A measured CPI series is not loaded.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Current Cost / Amount" 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  prefix="₹"
                />
                <Input 
                  label="Average Inflation Rate (%)" 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  suffix="%"
                />
                <Input 
                  label="Time Period (Years)" 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  suffix="years"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-rose-500/30 bg-rose-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-100 dark:text-rose-400">Future Purchasing Cost (After {years} Years)</h2>
                <div className={styles.resultValue}>{formatCurrency(futurePrice)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Price Increase</span>
                    <span className={styles.statVal}>{formatCurrency(futurePrice - amount)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Current Cost</span>
                    <span className={styles.statVal}>{formatCurrency(amount)}</span>
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

              {/* Purchasing Power Section */}
              <Card className="!rounded-[var(--radius-lg)] !border !border-[var(--border)] !bg-white !p-5">
                <h3 className="mb-3 text-[0.95rem] font-bold text-[var(--text-primary)]">💸 Purchasing Power Impact</h3>
                <p className="mb-2 text-[0.85rem] text-[var(--text-secondary)]">
                  Today&apos;s {formatCurrency(amount)} will only buy goods worth:
                </p>
                <p className="text-[1.5rem] font-black text-[#dc2626]">{formatCurrency(realValue)}</p>
                <p className="mt-2 text-[0.8rem] text-[var(--text-tertiary)]">
                  That&apos;s a purchasing power loss of <strong>{purchasingPowerLoss.toFixed(1)}%</strong> over {years} years.
                </p>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-red-500`}><Info size={20} /></div>
                <p className={styles.infoText}>
                   ₹1,00,000 at 5% for 10 years becomes about ₹1,62,889. In today&apos;s prices, that ₹1,00,000 later buys about ₹61,391, a loss of about 38.6%.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax & Inflation Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#fef2f2]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#991b1b] flex items-center gap-2">
              <ShieldCheck className="text-[#dc2626]" /> Two results from one rate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#991b1b]">Future price</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#991b1b]/80">
                  <li><strong>Formula:</strong> present amount × (1 + rate)^years.</li>
                  <li><strong>Default:</strong> ₹1,00,000 at 5% for 10 years is about ₹1,62,889.</li>
                  <li><strong>Increase:</strong> About ₹62,889.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#991b1b]">Purchasing power</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#991b1b]/80">
                  <li><strong>Formula:</strong> present amount ÷ (1 + rate)^years.</li>
                  <li><strong>Default:</strong> ₹1,00,000 later buys about ₹61,391 in today&apos;s prices.</li>
                  <li><strong>Not calculated:</strong> Tax, indexation, and an investment return are not subtracted.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How this inflation figure is built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">One amount, one annual rate, and a number of years. The rate does not change from year to year.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Worked figures</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>5% for 10 years:</strong> ₹1,00,000 becomes about ₹1,62,889.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Buying power:</strong> That ₹1,00,000 later buys about ₹61,391 of today&apos;s goods.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>6% check:</strong> ₹1,00,000 at 6% for 10 years is about ₹1,79,085.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Doubling:</strong> At 5%, prices double in about 14.2 years. 72 ÷ 5 is 14.4 years, which is the rough estimate, not the result printed above.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not an asset ranking</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>One rate:</strong> Equity, property, gold, and savings-account returns are not looked up.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Same rate each year:</strong> The entered percent is reused. A CPI history is not loaded.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>No tax:</strong> Indexation and capital-gains tax are not applied.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>10% example:</strong> ₹10,00,000 at 10% for 10 years is about ₹25,93,742.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Another check</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>₹50,000 at 5% for 14 years is about ₹98,997, just short of double.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>₹10,00,000 at 10% for 10 years is about ₹25,93,742.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>A 6% or 7% retirement assumption is not built in. The rate box starts at 5%.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>An investment return is not compared with this inflation rate.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Future price after inflation"
          description={`Inflation raises a future price by multiplying the present amount by (1 + rate) once for each year. Purchasing power is the present amount divided by that same factor.

₹1,00,000 at 5% for 10 years becomes about ₹1,62,889. In today's prices, that ₹1,00,000 later buys about ₹61,391, a loss of about 38.6%. At 5%, prices double in about 14.2 years. The page does not subtract tax or compare an investment return.`}
          howToUse={[
            "Enter the present amount. The default is ₹1,00,000.",
            "Enter the annual inflation rate as a percent. The default is 5.",
            "Enter the number of years. The default is 10.",
            "Read the future price, which is present amount × (1 + rate)^years.",
            "Read the purchasing-power figure, which is present amount ÷ (1 + rate)^years."
          ]}
          benefits={[
            "The same rate is applied every year.",
            "The ₹1,62,889 example uses ₹1,00,000, 5%, and 10 years.",
            "Purchasing power for that example is about ₹61,391.",
            "Tax and investment returns are not calculated.",
            "Amounts are formatted in rupees."
          ]}
          formula="Future price = Present amount × (1 + rate)^years"
        />
        <FAQSchema faqs={INFLATION_FAQS} />
        <RelatedTools currentToolId="inflation-calculator" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
