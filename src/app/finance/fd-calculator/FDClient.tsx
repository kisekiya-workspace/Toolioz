'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateCompoundInterest } from '@/lib/formulas';
import { Info, Banknote, ShieldCheck, AlertTriangle, BookOpen, TrendingUp, Lightbulb, Download } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const FD_FAQS = [
  {
    question: "What is TDS on Fixed Deposit interest in India?",
    answer: "Tax Deducted at Source (TDS) at 10% is deducted by banks if annual FD interest exceeds ₹40,000 (₹50,000 for senior citizens). Submitting Form 15G / 15H prevents TDS if your total taxable income is below the exemption limit."
  },
  {
    question: "What is FD Laddering?",
    answer: "FD Laddering is a strategy of breaking your total investment into multiple FDs maturing across different years (e.g. 1, 2, 3, 4, 5 years). This ensures liquidity every year and optimizes interest rate cycles."
  },
  {
    question: "Are Fixed Deposits insured?",
    answer: "In India, bank deposits up to ₹5 Lakh per depositor per bank (principal + interest) are insured by the DICGC (a wholly-owned subsidiary of RBI)."
  }
];

export default function FDClient() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(7.1);
  const [years, setYears] = useState<number>(5);
  const [compoundFreq, setCompoundFreq] = useState<number>(4); // Quarterly default
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const maturityVal = calculateCompoundInterest(principal, rate / 100, compoundFreq, years);
    setResult(maturityVal);
  }, [principal, rate, years, compoundFreq]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  const interestEarned = result - principal;
  // TDS threshold: ₹40,000 for regular, ₹50,000 for senior citizens
  const annualInterest = interestEarned / (years || 1);
  const tdsApplicable = annualInterest > 40000;

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>Fixed Deposit (FD) Calculator 2026</h1>
            <p className={styles.subtitle}>Calculate maturity value with selectable compounding frequency. Updated for 2026 bank rates.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Interest rates shown are <strong>illustrative defaults</strong> and may not match your bank&apos;s current rates. Actual maturity values depend on your bank, tenure, and deposit amount. This calculator is for <strong>assumption &amp; planning purposes only</strong>. Verify with your bank before investing.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Deposit Amount" 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  prefix="₹"
                />
                <Input 
                  label="Annual Interest Rate (%)" 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  suffix="%"
                />
                <Input 
                  label="Tenure (Years)" 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  suffix="years"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Compounding Frequency</label>
                  <select 
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)]"
                    value={compoundFreq}
                    onChange={(e) => setCompoundFreq(Number(e.target.value))}
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Half-Yearly (Semi-Annual)</option>
                    <option value={4}>Quarterly (Most Common)</option>
                    <option value={12}>Monthly</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-sky-500/30 bg-sky-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white shadow-md sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-100 dark:text-sky-400">Total Maturity Amount</h2>
                <div className={styles.resultValue}>{formatCurrency(result)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Interest</span>
                    <span className={styles.statVal}>{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Investment</span>
                    <span className={styles.statVal}>{formatCurrency(principal)}</span>
                  </div>
                </div>
                <Button 
                  fullWidth 
                  className={styles.btn}
                  onClick={() => window.print()}
                >
                  <Download className="mr-2 size-4" />
                  Download FD Summary
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#0369a1' }}><Info size={20} /></div>
                <p className={styles.infoText}>
                  A Fixed Deposit (FD) is a financial instrument provided by banks or NBFCs which provides investors a higher rate of interest than a regular savings account. Interest is typically compounded quarterly in India.
                </p>
              </div>

              {/* TDS Warning */}
              {tdsApplicable && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#fbbf24] bg-[#fffbeb] p-4">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#d97706]" />
                  <p className="m-0 text-[0.8rem] leading-[1.6] text-[#92400e]">
                    <strong>TDS Note:</strong> Your estimated annual interest of {formatCurrency(annualInterest)} exceeds ₹40,000. TDS at 10% may be deducted by the bank (threshold is ₹50,000 for senior citizens). Submit Form 15G/15H to avoid TDS if your total income is below the taxable limit.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax & TDS Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#f0f9ff]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#0369a1] flex items-center gap-2">
              <ShieldCheck className="text-[#0284c7]" /> 💸 Tax & TDS on Fixed Deposits (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0369a1]">TDS (Tax Deducted at Source)</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0369a1]/80">
                  <li><strong>Limit:</strong> If interest exceeds <strong>₹40,000</strong> (₹50,000 for seniors), bank deducts <strong>10% TDS</strong>.</li>
                  <li><strong>Without PAN:</strong> If you don&apos;t provide PAN, bank will deduct <strong>20% TDS</strong>.</li>
                  <li><strong>Form 15G/15H:</strong> Submit these if your total annual income is below the taxable limit to avoid TDS.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0369a1]">Final Income Tax</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0369a1]/80">
                  <li><strong>Slab Rate:</strong> Interest earned is added to your total income and taxed at your <strong>Income Tax Slab</strong> (10%, 20%, 30%).</li>
                  <li><strong>Tax-Saving FD:</strong> 5-year FDs qualify for deduction under Section 80C (up to ₹1.5L) in the old regime.</li>
                  <li><strong>Post-Tax Yield:</strong> Always calculate your post-tax return. A 7% FD in the 30% slab yields only 4.9%.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">🏦 Fixed Deposit Tips</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">What banks won&apos;t tell you about maximizing your FD returns.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Important FD Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>TDS:</strong> 10% TDS if interest &gt; ₹40k/year. Submit Form 15G/15H to avoid it.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>Penalty:</strong> 0.5–1% rate reduction on premature withdrawal.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>Cumulative:</strong> Reinvests interest. <strong>Non-cumulative:</strong> Pays out periodically.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>DICGC Insurance:</strong> Deposits up to ₹5 lakh per bank are insured.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Smart Strategies</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>FD Laddering:</strong> Instead of one ₹10L FD, make 5 × ₹2L FDs with 1–5 year tenures.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Tax-Saver FD:</strong> 5-year lock-in gives Section 80C deduction, but interest is taxable.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Small Finance Banks:</strong> Offer 0.5–1.5% higher rates, still DICGC insured.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Senior Citizens:</strong> 0.25–0.5% extra rate. Super seniors (80+) get even more.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Tips</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Calculate Post-Tax:</strong> A 7% FD in the 30% slab yields only ~4.9%.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Don&apos;t Break FDs:</strong> Take a loan against FD instead (costs ~1–2% above FD rate).</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Timing:</strong> Lock in high rates for longer tenures before RBI cuts rates.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Auto-sweep:</strong> Keeps money liquid but auto-converts to FD for better returns.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Fixed Deposits (FD): The Bedrock of a Secure Savings Strategy"
          description={`A Fixed Deposit (FD) has long been considered one of the safest and most reliable investment instruments, particularly for those who prioritize capital preservation over high-risk growth. When you open an FD, you agree to leave a specific amount of money with a bank or non-banking financial company (NBFC) for a set tenure at a fixed interest rate. Unlike market-linked investments like stocks or mutual funds, the returns on an FD are guaranteed and unaffected by market volatility.

The efficiency of a fixed deposit depends largely on its compounding frequency. Most banks in India and other regions compound interest on a quarterly basis, which means your interest earns interest four times a year. This leads to a slightly higher 'effective' yield compared to the nominal interest rate. Our FD calculator simplifies this complex math, allowing you to see the exact maturity value of your deposit based on the principal, tenure, and current bank rates.

For many, FDs serve as an emergency fund or a way to save for specific future milestones, such as a down payment on a home or post-graduation expenses. Some FDs also offer tax-saving benefits under Section 80C (in India), though these typically come with a mandatory 5-year lock-in period. By comparing the maturity amounts across different interest rates and tenures using our tool, you can make an informed decision on where to park your hard-earned money for the best guaranteed returns.`}
          howToUse={[
            "Enter the Principal Deposit Amount you wish to invest in the bank.",
            "Input the Annual Interest Rate offered by the financial institution (Bank/NBFC).",
            "Select the Tenure or duration of the deposit in years.",
            "Choose the Compounding Frequency (quarterly is the most common in India).",
            "Instantly view the Final Maturity Amount you will receive at the end of the term.",
            "Check the Total Interest Earned—this is the profit your money has generated over the period."
          ]}
          benefits={[
            "Capital Security: Your principal amount is safe and guaranteed by the institution.",
            "Predictable Income: Know exactly how much you will receive on the day of maturity.",
            "Wealth Protection: Provides a steady hedge against short-term market fluctuations.",
            "Flexible Tenures: Choose a term that perfectly matches your future financial needs.",
            "Tax Planning: Utilize tax-saving FD schemes to reduce your annual tax liability."
          ]}
          formula="A = P(1 + r/n)^(nt)"
        />
        <FAQSchema faqs={FD_FAQS} />
        <RelatedTools currentToolId="fd-calculator" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
