'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateCompoundInterest } from '@/lib/formulas';
import { Info, Banknote, ShieldCheck, AlertTriangle, BookOpen, TrendingUp, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const FD_FAQS = [
  {
    question: "Does this calculator deduct TDS?",
    answer: "No. Maturity is principal plus compound interest at the selected frequency. A note appears only when total interest divided by the number of years is above ₹40,000. That note does not reduce the maturity figure, and a senior-citizen threshold is not applied."
  },
  {
    question: "Does this page build an FD ladder?",
    answer: "No. The result is one deposit. Splitting a sum across several maturity dates is not calculated."
  },
  {
    question: "Is the maturity figure capped by deposit insurance?",
    answer: "No. The formula does not apply an insurance limit, a premature-withdrawal penalty, or a senior-citizen rate."
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
            <p className={styles.subtitle}>A fixed deposit pays a stated annual rate for a fixed tenure. Maturity is principal plus compound interest at the selected frequency. Tax is not deducted.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> The 7.1% rate is an illustrative default. Maturity depends on the rate, tenure, and frequency entered. The result is before tax.
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
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--primary)]"
                    value={compoundFreq}
                    onChange={(e) => setCompoundFreq(Number(e.target.value))}
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Half-Yearly (Semi-Annual)</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-sky-500/30 bg-sky-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
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
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-sky-700`}><Info size={20} /></div>
                <p className={styles.infoText}>
                  Maturity uses A = P(1 + r/n)^(nt). The starting frequency is quarterly, n = 4. Annual, half-yearly, and monthly are also available.
                </p>
              </div>

              {/* TDS Warning */}
              {tdsApplicable && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#fbbf24] bg-[#fffbeb] p-4">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#d97706]" />
                  <p className="m-0 text-[0.8rem] leading-[1.6] text-[#92400e]">
                    <strong>Interest flag:</strong> Total interest divided by years is {formatCurrency(annualInterest)}, which is above ₹40,000. The maturity figure above is not reduced.
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
              <ShieldCheck className="text-[#0284c7]" /> What is left out of the maturity figure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0369a1]">Tax is not subtracted</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0369a1]/80">
                  <li><strong>Flag only:</strong> A note appears when total interest ÷ years is above ₹40,000.</li>
                  <li><strong>No rate applied:</strong> 10% or 20% is not taken off the maturity amount.</li>
                  <li><strong>No senior threshold:</strong> The comparison stays at ₹40,000.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0369a1]">One deposit</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0369a1]/80">
                  <li><strong>No ladder:</strong> Several maturity dates are not calculated.</li>
                  <li><strong>No Section 80C:</strong> A tax-saver lock-in is not an input.</li>
                  <li><strong>No post-tax yield:</strong> A 30% slab is not applied to the 7.1% default.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How this FD maturity is built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">The same compound-interest formula as the result above, with n chosen in the frequency list.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Default example</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>Inputs:</strong> ₹1,00,000, 7.1% a year, 5 years, quarterly.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>Maturity:</strong> Near ₹1,42,175. Interest is about ₹42,175.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>Formula:</strong> A = P(1 + r/n)^(nt), with n = 4 and t = 5.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-sky-500">•</span><span><strong>Flag:</strong> ₹42,175 ÷ 5 is about ₹8,435, under ₹40,000, so the note stays hidden.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Frequency values</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Annual:</strong> n = 1.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Half-yearly:</strong> n = 2.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Quarterly:</strong> n = 4. This is the starting selection.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-indigo-500">•</span><span><strong>Monthly:</strong> n = 12.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not calculated</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Payout:</strong> Interest is added back. A periodic payout FD is not a separate mode.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Penalty:</strong> Breaking the deposit early is not modeled.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Insurance:</strong> No cap is applied to the maturity amount.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-teal-500">✅</span><span><strong>Rate source:</strong> 7.1% is a default, not a quoted bank rate.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Fixed deposit maturity"
          description={`A fixed deposit pays a stated annual rate for a fixed tenure. Maturity is principal plus compound interest at the selected frequency, before tax.

The formula is A = P(1 + r/n)^(nt). The page starts at quarterly compounding, n = 4. ₹1,00,000 at 7.1% for 5 years finishes near ₹1,42,175, so interest is about ₹42,175. Annual, half-yearly, and monthly use n = 1, 2, and 12. A note appears when total interest divided by years is above ₹40,000. That note does not change the maturity amount.`}
          howToUse={[
            "Enter the principal.",
            "Enter the annual rate as a percent. The default is 7.1.",
            "Enter the tenure in years. The default is 5.",
            "Select annual, half-yearly, quarterly, or monthly compounding.",
            "Read maturity and interest. Interest is maturity minus principal.",
            "If total interest divided by years is above ₹40,000, a note appears and the maturity figure stays the same."
          ]}
          benefits={[
            "Quarterly compounding is the starting frequency.",
            "The ₹1,42,175 example uses ₹1,00,000, 7.1%, 5 years, and n = 4.",
            "Tax is not subtracted from maturity.",
            "One deposit is calculated. A ladder of several deposits is not.",
            "The 7.1% rate is an illustrative default."
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
