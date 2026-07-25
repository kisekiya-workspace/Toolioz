'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateInflation } from '@/lib/formulas';
import { Info, Landmark, TrendingDown, AlertTriangle, ShieldCheck, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const INFLATION_FAQS = [
  {
    question: "What is the formula for calculating future inflation cost?",
    answer: "Future Cost = Current Cost * (1 + Inflation Rate)^Years. For example, ₹1,00,000 at 6% inflation over 10 years becomes ₹1,79,084."
  },
  {
    question: "What is Real Rate of Return?",
    answer: "Real Rate of Return is your nominal investment return minus the inflation rate and tax drag. If your FD yields 7% but inflation is 6% and tax is 30%, your real return is negative."
  },
  {
    question: "Which asset classes beat inflation in India long term?",
    answer: "Historically, Equity Mutual Funds (12-14% CAGR) and Real Estate (8-10% CAGR) beat retail CPI inflation (5-6% average) over 10+ year horizons."
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
            <p className={styles.subtitle}>See how inflation erodes purchasing power and how much things will cost in the future.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Inflation rates are <strong>assumed averages</strong> and actual inflation varies year to year. This calculator is for <strong>assumption &amp; planning purposes only</strong>. India&apos;s CPI inflation has averaged ~5% over recent years; your actual experience may differ.
            </div>
          </div>
        </header>

        <section className="container section">
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
              <Card className={styles.resultCard} style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
                <h2 className={styles.resultLabel}>Future Cost (After {years} Years)</h2>
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
                  Download Report
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
                <div className={styles.infoIcon} style={{ color: '#ef4444' }}><Info size={20} /></div>
                <p className={styles.infoText}>
                   Inflation is the rate at which the general level of prices for goods and services rises. India&apos;s CPI inflation has averaged around 5% over recent years, though it fluctuates. Your investments should aim to beat inflation for real wealth growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax & Inflation Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#fef2f2]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#991b1b] flex items-center gap-2">
              <ShieldCheck className="text-[#dc2626]" /> 💸 Inflation & Taxes (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#991b1b]">The Silent Wealth Tax</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#991b1b]/80">
                  <li><strong>Nominal vs Real:</strong> If you earn 10% interest but inflation is 6%, your real growth is 4%.</li>
                  <li><strong>Double Taxation:</strong> You pay tax on the full 10%, even though 6% of it was just matching inflation. This effectively taxes your principal.</li>
                  <li><strong>Indexation:</strong> Some assets (like real estate in certain regimes) allow "Indexation" to adjust your purchase price for inflation before calculating tax.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#991b1b]">Investment Strategies</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#991b1b]/80">
                  <li><strong>Debt Funds:</strong> Since April 2023, indexation benefits are removed. Gains are taxed at slab rate, making inflation impact even harsher.</li>
                  <li><strong>Equity (LTCG):</strong> The ₹1.25L tax-free threshold acts as a buffer against inflation-driven gains.</li>
                  <li><strong>Net Real Return:</strong> Always calculate: <code>(Interest - Tax) - Inflation</code>. If this is negative, your wealth is shrinking.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">💰 Inflation Insights</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">What you need to know to protect your money.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Key Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>CPI (Consumer Price Index):</strong> The official measure of retail inflation.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Real Return:</strong> Your return minus inflation. If FD gives 7% and inflation is 5%, real return is 2%.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Core Inflation:</strong> Inflation excluding volatile food and fuel prices.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Rule of 72:</strong> Divide 72 by inflation rate to know when prices double (e.g., 6% = 12 years).</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Assets That Beat Inflation</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Equity/Stocks:</strong> Historically 12–15% returns. Best long-term inflation hedge.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Real Estate:</strong> Property values generally track or beat inflation.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Gold:</strong> Traditional inflation hedge averaging 8–10% over long periods.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">❌</span><span><strong>Savings Account:</strong> Always loses to inflation. Use only for emergencies.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Tips</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Healthcare inflation is 10–14%/year</strong> — much higher than general inflation.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Education inflation is 8–12%/year.</strong> A ₹10 lakh course will cost ₹26 lakh in 10 years at 10%.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>For retirement, assume <strong>6–7% inflation</strong> — not the RBI target of 4%.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Review your portfolio annually. If it&apos;s not beating inflation after tax, you&apos;re getting poorer.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Inflation Calculator 2026: Protecting Your Purchasing Power"
          description={`Inflation is the silent killer of wealth. Our inflation calculator 2026 helps you understand how the general level of prices for goods and services is rising and how much your future purchasing power is falling. Whether planning for retirement or long-term purchases, adjust your strategy to combat the cumulative effect of inflation.

Historically, average inflation rates hover around 2% to 6% depending on the region and economic climate. While this might seem small annually, the cumulative effect over 20 or 30 years is staggering. For example, at a 5% inflation rate, the cost of living doubles roughly every 14 years. This means if you need ₹50,000 today to maintain your lifestyle, you might need ₹1,00,000 in just 14 years to buy the same goods and services. Our inflation calculator helps you see this future reality clearly so you can adjust your investment strategies accordingly.

The only way to effectively combat inflation is through "Real Returns"—returns that exceed the inflation rate. If your savings account offers 4% interest but inflation is 6%, you are actually losing 2% in purchasing power every year. By using this tool to project future costs, you can better understand the necessity of investing in growth assets like stocks or real estate, which historically offer higher returns than inflation. Use our precision tool to safeguard your future and ensure your long-term financial goals remain reachable.`}
          howToUse={[
            "Enter a Current Amount or the price of an item you wish to track into the future.",
            "Input the Average Annual Inflation Rate (India's recent CPI average is ~5%).",
            "Select the Time Period in years you want to project.",
            "View the Future Cost — how much that item will cost after inflation.",
            "Check the Purchasing Power Impact — what today's money will be worth in real terms.",
            "Use the results to plan savings that beat inflation."
          ]}
          benefits={[
            "Realistic Planning: Avoid the 'Money Illusion' by focusing on real future costs, not just nominal numbers.",
            "Portfolio Optimization: Identify whether your current investments are actually growing your wealth or just losing to inflation.",
            "Cost of Living Awareness: Understand how everyday expenses like healthcare and housing might escalate over time.",
            "Retirement Safety: Ensure your future nest egg is large enough to sustain your desired lifestyle decades from now.",
            "Business Strategy: Help entrepreneurs project future operational costs and adjust pricing models accordingly."
          ]}
          formula="Future Value = Current Value × (1 + inflationRate)^years"
        />
        <FAQSchema faqs={INFLATION_FAQS} />
        <RelatedTools currentToolId="inflation-calculator" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
