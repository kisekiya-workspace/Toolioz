'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateSIP } from '@/lib/formulas';
import { Info, TrendingUp, Sparkles, Target, AlertTriangle, ShieldCheck, BookOpen, Lightbulb, Download } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { FAQSchema } from '@/components/ui/FAQSchema';
const SIP_FAQS = [
  {
    question: "What is a Systematic Investment Plan (SIP)?",
    answer: "A Systematic Investment Plan (SIP) allows you to invest a fixed sum regularly (monthly or quarterly) in mutual funds. It promotes financial discipline and leverages Rupee Cost Averaging and compound growth over time."
  },
  {
    question: "How much monthly SIP is required to build ₹1 Crore in 10 years?",
    answer: "Assuming an average annual return of 12% in equity mutual funds, a monthly SIP of approximately ₹43,500 for 10 years is needed to accumulate ₹1 Crore. With a 10% annual Step-Up SIP, you can start with ~₹25,000/month."
  },
  {
    question: "What is Step-Up SIP and how does it work?",
    answer: "Step-Up SIP (or Top-Up SIP) allows you to automatically increase your monthly investment by a fixed percentage (e.g. 10%) every year in line with annual salary increments. This significantly accelerates reaching financial goals."
  },
  {
    question: "What is the difference between Direct and Regular Mutual Fund SIPs?",
    answer: "Direct plans have lower expense ratios because no distributor commissions are paid. Over 20 years, investing via Direct SIPs can increase your total returns by 10% to 15% compared to Regular plans."
  },
  {
    question: "How are SIP returns taxed in India (FY 2025-26 / 2026-27)?",
    answer: "For Equity Mutual Funds, Long-Term Capital Gains (LTCG) over ₹1.25 Lakh per financial year are taxed at 12.5%. Short-Term Capital Gains (units sold under 1 year) are taxed at 20%."
  }
];

export default function SIPClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [stepUpPercent, setStepUpPercent] = useState<number>(0);
  const [result, setResult] = useState<number>(0);

  // Persistence
  useEffect(() => {
    const savedMonthly = localStorage.getItem('toolioz_sip_monthly');
    const savedRate = localStorage.getItem('toolioz_sip_rate');
    const savedYears = localStorage.getItem('toolioz_sip_years');

    if (savedMonthly) setMonthlyInvestment(Number(savedMonthly));
    if (savedRate) setRate(Number(savedRate));
    if (savedYears) setYears(Number(savedYears));
  }, []);

  // Step-up SIP calculation: each year the monthly amount increases by stepUpPercent%
  const calculateStepUpSIP = (monthly: number, annualRate: number, totalYears: number, stepUp: number): number => {
    if (stepUp === 0) return calculateSIP(monthly, annualRate, totalYears);
    const i = annualRate / 12;
    let total = 0;
    let currentMonthly = monthly;
    for (let yr = 0; yr < totalYears; yr++) {
      // FV of annuity due for 12 months at this year's contribution
      const fvYear = i === 0
        ? currentMonthly * 12
        : currentMonthly * ((Math.pow(1 + i, 12) - 1) / i) * (1 + i);
      // Compound this year's FV for remaining years
      const remainingMonths = (totalYears - yr - 1) * 12;
      total += fvYear * Math.pow(1 + i, remainingMonths);
      currentMonthly *= (1 + stepUp / 100);
    }
    return total;
  };

  useEffect(() => {
    localStorage.setItem('toolioz_sip_monthly', monthlyInvestment.toString());
    localStorage.setItem('toolioz_sip_rate', rate.toString());
    localStorage.setItem('toolioz_sip_years', years.toString());

    const finalAmount = calculateStepUpSIP(monthlyInvestment, rate / 100, years, stepUpPercent);
    setResult(finalAmount);
  }, [monthlyInvestment, rate, years, stepUpPercent]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  // Calculate total invested considering step-up
  const totalInvested = useMemo(() => {
    let total = 0;
    let currentMonthly = monthlyInvestment;
    for (let yr = 0; yr < years; yr++) {
      total += currentMonthly * 12;
      currentMonthly *= (1 + stepUpPercent / 100);
    }
    return total;
  }, [monthlyInvestment, years, stepUpPercent]);

  const wealthGained = result - totalInvested;

  // Year-by-year breakdown
  const yearlyBreakdown = useMemo(() => {
    const rows: { year: number; invested: number; value: number }[] = [];
    const i = (rate / 100) / 12;
    let cumulativeInvested = 0;
    let currentMonthly = monthlyInvestment;
    
    for (let yr = 1; yr <= Math.min(years, 30); yr++) {
      cumulativeInvested += currentMonthly * 12;
      const value = calculateStepUpSIP(monthlyInvestment, rate / 100, yr, stepUpPercent);
      rows.push({ year: yr, invested: cumulativeInvested, value });
      currentMonthly *= (1 + stepUpPercent / 100);
    }
    return rows;
  }, [monthlyInvestment, rate, years, stepUpPercent]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Finance Tools', url: '/finance' },
          { name: 'SIP Calculator', url: '/finance/sip-calculator' },
        ]}
      />
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>SIP Return Calculator 2026</h1>
            <p className={styles.subtitle}>Plan your wealth creation with the best monthly SIP return calculator. Includes Step-Up SIP for annual increment planning.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Returns shown are <strong>hypothetical projections</strong> based on assumed rates of return. Mutual fund investments are subject to market risks. Past performance does not guarantee future results. This tool is for <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Monthly Investment" 
                  type="number" 
                  value={monthlyInvestment} 
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  prefix="₹"
                />
                <Input 
                  label="Expected Annual Return (%)" 
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
                <Input 
                  label="Annual Step-Up (Optional)" 
                  type="number" 
                  value={stepUpPercent} 
                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                  suffix="%"
                />
                <p className="mt-1 text-[0.75rem] text-[var(--text-tertiary)]">
                  Step-Up SIP increases your monthly contribution by this % every year. Set to 0 for a regular SIP.
                </p>
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-blue-500/30 bg-blue-600 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-100 dark:text-blue-400">Estimated Maturity Value</h2>
                <div className={styles.resultValue}>{formatCurrency(result)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Invested</span>
                    <span className={styles.statVal}>{formatCurrency(totalInvested)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Est. Returns</span>
                    <span className={styles.statVal}>{formatCurrency(wealthGained)}</span>
                  </div>
                </div>
                <Button 
                  fullWidth 
                  className={styles.btn}
                  onClick={() => window.print()}
                >
                  <Download className="mr-2 size-4" />
                  Get Detailed Plan
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#2563eb' }}><Info size={20} /></div>
                <p className={styles.infoText}>
                  A Systematic Investment Plan (SIP) is a disciplined way to invest in mutual funds. Equity SIPs have historically delivered 12–15% CAGR over 10+ years, while debt fund SIPs average 7–8%. Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>

          {/* Year-by-year breakdown table */}
          {years > 0 && (
            <div className="mx-auto mt-12 max-w-[900px]">
              <Card className="!p-6">
                <h3 className="mb-4 text-[1.1rem] font-bold text-[var(--text-primary)]">Year-by-Year Growth</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[0.875rem]">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="pb-3 pr-4 font-semibold text-[var(--text-secondary)]">Year</th>
                        <th className="pb-3 pr-4 font-semibold text-[var(--text-secondary)]">Total Invested</th>
                        <th className="pb-3 pr-4 font-semibold text-[var(--text-secondary)]">Est. Value</th>
                        <th className="pb-3 font-semibold text-[var(--text-secondary)]">Gains</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="border-b border-[var(--border)] last:border-0">
                          <td className="py-2.5 pr-4 font-medium">{row.year}</td>
                          <td className="py-2.5 pr-4 text-[var(--text-secondary)]">{formatCurrency(row.invested)}</td>
                          <td className="py-2.5 pr-4 font-semibold">{formatCurrency(row.value)}</td>
                          <td className="py-2.5 font-semibold" style={{ color: row.value - row.invested > 0 ? '#16a34a' : '#ef4444' }}>
                            {formatCurrency(row.value - row.invested)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          {/* Tax Implications Section */}
          <div className="mx-auto mt-12 max-w-[900px]">
            <Card className="!p-8 bg-[#f0fdf4]">
              <h2 className="mb-6 text-[1.4rem] font-bold text-[#065f46] flex items-center gap-2">
                <ShieldCheck className="text-[#10b981]" /> 💸 Tax Implications on SIP Returns (2026-27)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#065f46]">Equity Mutual Funds</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#065f46]/80">
                    <li><strong>LTCG (Long Term):</strong> If held for &gt;1 year, gains above <strong>₹1.25 Lakh</strong> are taxed at <strong>12.5%</strong>.</li>
                    <li><strong>STCG (Short Term):</strong> If sold within 1 year, gains are taxed at a flat <strong>20%</strong>.</li>
                    <li><strong>Strategy:</strong> Plan your redemptions to stay under the ₹1.25L annual limit to pay zero tax.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-[1.05rem] font-bold text-[#065f46]">Debt Mutual Funds</h3>
                  <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#065f46]/80">
                    <li><strong>Taxation:</strong> All gains from debt funds (SIP or Lumpsum) are added to your income and taxed as per your <strong>Income Tax Slab</strong>.</li>
                    <li><strong>No LTCG benefit:</strong> Since April 2023, debt funds no longer enjoy indexation or 20% flat tax benefits.</li>
                    <li><strong>Indexation:</strong> Only applicable to non-equity oriented funds bought before April 1, 2023.</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
          <div className="mx-auto mt-8 max-w-[900px]">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">📈 SIP Investing — Tips They Don&apos;t Teach You</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Master the art of wealth creation with these pro strategies.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Key SIP Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>NAV (Net Asset Value):</strong> Price of one unit. You buy more units when market falls — this is Rupee Cost Averaging.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Expense Ratio:</strong> The annual fee (0.5–2.5%). Over 20 years, a 1% difference costs you lakhs.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Exit Load:</strong> A penalty (usually 1%) for redeeming within 1 year. Plan your withdrawals carefully.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>XIRR vs CAGR:</strong> For SIPs, XIRR is the true metric. It accounts for your monthly cash flows correctly.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Common Mistakes</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Stopping during crashes:</strong> Bear markets are when you accumulate the most units at a discount.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Chasing last year&apos;s winner:</strong> Past returns ≠ future returns. Look at 5–10 year consistency.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Over-diversifying:</strong> Having 10+ funds dilutes returns. 3–4 funds across categories is optimal.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Ignoring step-up:</strong> Increase your SIP by 10% yearly to beat inflation and accelerate wealth creation.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Strategies</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Direct vs Regular:</strong> Use Direct plans to save 0.5–1% in distributor commissions.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Time &gt; Amount:</strong> ₹500/mo for 30 years beats ₹5000/mo for 10 years due to compounding.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Best Dates:</strong> The 1st or 5th of the month historically show slightly better long-term averages.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>The STP Exit:</strong> 3 years before your goal, systematically transfer funds from Equity to Debt.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Tax Harvesting:</strong> Book up to ₹1.25L of LTCG annually (tax-free) and reinvest it.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="sip-calculator" categoryId="finance" />
        
        <SEOSection 
          title="The Power of SIP: Monthly SIP Return Calculator for 1 Crore Target"
          description={`A Systematic Investment Plan (SIP) is more than just a way to invest in mutual funds; it's a financial philosophy that prioritizes consistency over market timing. In the volatile world of finance, trying to guess when the market will hit its lowest or highest point is often a losing game for retail investors. SIPs solve this by automating your investments, allowing you to buy more units when prices are low and fewer when prices are high. This process, known as Rupee Cost Averaging, significantly reduces the average cost of your investment over time.

The true magic of an SIP, however, lies in the power of compounding. By investing a small amount every month—be it ₹500 or ₹50,000—you are effectively putting your money to work 24/7. Use our tool to calculate how much to invest in SIP for 1 crore target or any other financial goal. Over a span of 10, 20, or 30 years, the interest earned on your contributions starts generating its own interest, leading to an exponential growth curve in the later years. This makes SIPs the ideal tool for long-term goals like buying a house, funding a child's higher education, or building a robust retirement corpus.

Our professional SIP calculator is designed to help you visualize this journey. By adjusting your monthly contribution, duration, and expected rate of return, you can see how even a small increase in your monthly savings can lead to a difference of lakhs or even crores in your final maturity amount. Financial freedom doesn't require a massive windfall; it requires a disciplined plan. Start your journey today by simulating your wealth creation path with our precision-engineered tool.`}
          howToUse={[
            "Enter the Fixed Amount you intend to invest every month (Monthly SIP contribution).",
            "Input the Expected Annual Rate of Return based on the historical performance of your chosen fund.",
            "Select the Investment Period in years to see the long-term impact of compounding.",
            "Optionally set a Step-Up % to simulate increasing your SIP by a fixed percentage every year.",
            "Instantly view the Total Maturity Value after the specified period.",
            "Analyze the year-by-year breakdown table to track your wealth growth over time."
          ]}
          benefits={[
            "Market Volatility Protection: Benefit from Rupee Cost Averaging and ignore market noise.",
            "Wealth Snowball: Harness the compounding effect to grow even small amounts into a fortune.",
            "Step-Up SIP: Model real-world salary increments for more accurate projections.",
            "Goal-Based Planning: Align your monthly savings with specific future milestones.",
            "Liquidity & Flexibility: Most SIPs allow you to stop, pause, or increase your investments at any time."
          ]}
          formula="M = P * [ ((1 + i)^n - 1) / i ] * (1 + i)"
        />
        <DirectAnswerBlock
          title="How to calculate SIP returns and target ₹1 Crore with Step-Up SIP?"
          answer="A Systematic Investment Plan (SIP) compounds monthly contributions over time using Rupee Cost Averaging. To build a ₹1 Crore corpus in 10 years at a 12% CAGR, you need a monthly SIP of ~₹43,500. By enabling a 10% annual Step-Up (Top-Up) SIP aligned with salary increments, you can start with ~₹25,000/month and achieve the same ₹1 Crore goal."
          keyTakeaways={[
            "SIP Formula — M = P × [((1 + i)^n - 1) / i] × (1 + i) where P is monthly deposit, i is monthly rate, and n is months.",
            "Step-Up SIP Advantage — Increasing your SIP by 10% each year reduces initial required monthly outlay by 40%.",
            "Direct Funds Save Commissions — Investing in Direct mutual fund plans adds 10%–15% more wealth over 20 years.",
            "LTCG Tax Rule (India) — Equity mutual fund LTCG over ₹1.25 Lakh per financial year is taxed at 12.5%."
          ]}
          categoryName="Personal Finance"
        />
        <FAQSchema faqs={SIP_FAQS} />
      <Footer />
    </div>
    </>
  );
}
