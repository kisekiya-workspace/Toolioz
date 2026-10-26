'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateSIP } from '@/lib/formulas';
import { Info, TrendingUp, Sparkles, Target, AlertTriangle, ShieldCheck, BookOpen, Lightbulb, Printer } from 'lucide-react';
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
    answer: "A systematic investment plan invests a fixed sum on a schedule, usually monthly. Each installment is compounded for the time it remains invested."
  },
  {
    question: "How much monthly SIP is required to build ₹1 Crore in 10 years?",
    answer: "At a constant 12% annual return, compounded monthly with each installment at the start of the month, about ₹43,040 a month for 10 years reaches ₹1 crore. A 10% yearly step-up reaches the same total from about ₹29,640 a month. A different return changes both amounts."
  },
  {
    question: "What is Step-Up SIP and how does it work?",
    answer: "A step-up SIP increases the monthly amount by a fixed percentage each year. A 10% annual increase is a common illustration."
  },
  {
    question: "What is the difference between Direct and Regular Mutual Fund SIPs?",
    answer: "Direct plans omit distributor commissions, so the expense ratio is lower. Over long periods that difference compounds into a larger corpus than a regular plan with the same fund."
  },
  {
    question: "How are SIP returns taxed in India (FY 2025-26 / 2026-27)?",
    answer: "This calculator does not subtract tax or an expense ratio. Equity long-term capital gains rules should be checked against current Income Tax Department guidance before a filing decision."
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
            <p className={styles.subtitle}>A systematic investment plan adds a fixed amount on a schedule and compounds each contribution. This calculator projects future value, amount invested, and estimated gain, including an optional annual step-up.</p>
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
                  Step-up raises the monthly amount by this percent each year. Zero keeps a regular SIP.
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
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-blue-600`}><Info size={20} /></div>
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
                          <td className={`py-2.5 font-semibold ${row.value - row.invested > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
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
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How this SIP projection is built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">The figures below use the same monthly compounding formula as the calculator.</p>
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
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Monthly rate:</strong> The annual percent is divided by 12. A 12% input is 1% per month.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Payment timing:</strong> The extra (1 + i) treats each installment as paid at the start of the month.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Step-up:</strong> Each year&apos;s 12 installments are compounded, then grown for the months that remain.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Not a fund return:</strong> NAV, expense ratio, exit load, and XIRR are not inputs.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What this projection leaves out</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>One rate:</strong> The projection uses a single annual return. It does not model a market drop or a fund&apos;s past return.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>No unit prices:</strong> Rupee-cost averaging is not simulated. Every installment compounds at the same monthly rate.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Table limit:</strong> The year-by-year table stops at 30 years even when the term is longer.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Step-up:</strong> A value above zero raises the monthly amount once a year. Zero keeps it flat.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Worked examples at 12%</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Timing:</strong> Each installment is treated as paid at the start of the month. A calendar date is not an input.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>12% comparison:</strong> ₹500 a month for 30 years finishes near ₹17.6 lakh. ₹5,000 a month for 10 years finishes near ₹11.6 lakh.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Not included:</strong> Expense ratio, tax, and a switch from equity to debt are not subtracted or modeled.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>₹1 crore at 12%:</strong> About ₹43,040 a month for 10 years. With a 10% yearly step-up, about ₹29,640 a month.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Default example:</strong> ₹5,000 a month for 10 years at 12% invests ₹6,00,000 and finishes near ₹11.6 lakh.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="sip-calculator" categoryId="finance" />
        
        <SEOSection 
          title="Monthly SIP future value"
          description={`A systematic investment plan adds a fixed amount on a schedule and compounds each contribution. Future value depends on the amount, the annual return, the number of years, and any annual step-up.

The formula is M = P × [((1 + i)^n − 1) / i] × (1 + i). P is the monthly amount, i is the annual rate divided by 12, and n is the number of months. The final (1 + i) treats each installment as paid at the start of the month. ₹5,000 a month for 10 years at 12% invests ₹6,00,000 and finishes near ₹11.6 lakh. At the same rate, about ₹43,040 a month for 10 years reaches ₹1 crore.

A step-up raises that monthly amount once a year and compounds each year for the months that remain. At 12% for 10 years, a 10% step-up reaches ₹1 crore from about ₹29,640 a month. The year-by-year table shows at most 30 years. Tax and expense ratio are not subtracted.`}
          howToUse={[
            "Enter the monthly amount.",
            "Enter the annual return as a percent. The formula divides it by 12.",
            "Enter the term in years.",
            "Enter a step-up percent, or leave it at zero for a flat SIP.",
            "Read the maturity value, the amount invested, and the estimated gain.",
            "The year-by-year table lists at most the first 30 years."
          ]}
          benefits={[
            "A zero step-up uses the ordinary annuity-due formula.",
            "A step-up above zero raises the monthly amount once each year.",
            "The same rate is applied every month. Unit prices are not simulated.",
            "The ₹1 crore figures above use a constant 12% annual return.",
            "Tax and expense ratio are left out of the result."
          ]}
          formula="M = P * [ ((1 + i)^n - 1) / i ] * (1 + i)"
        />
        <DirectAnswerBlock
          title="How much monthly SIP reaches ₹1 crore in 10 years?"
          answer="At a constant 12% annual return, compounded monthly with each installment at the start of the month, about ₹43,040 a month for 10 years reaches ₹1 crore. A 10% yearly step-up reaches the same total from about ₹29,640 a month."
          keyTakeaways={[
            "SIP formula — M = P × [((1 + i)^n − 1) / i] × (1 + i), with i = annual rate / 12 and n = months.",
            "10% step-up at 12% for 10 years lowers the starting monthly amount from about ₹43,040 to about ₹29,640, roughly 31%.",
            "The calculator does not subtract an expense ratio or tax.",
            "The year-by-year table stops at 30 years."
          ]}
          categoryName="Personal Finance"
        />
        <FAQSchema faqs={SIP_FAQS} />
      <Footer />
    </div>
    </>
  );
}
