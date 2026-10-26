'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateROI } from '@/lib/formulas';
import { Info, BarChart3, TrendingUp, ShieldCheck, BookOpen, AlertTriangle, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const ROI_FAQS = [
  {
    question: "What is the difference between ROI and CAGR on this page?",
    answer: "ROI is (ending value − starting value) ÷ starting value. It ignores time. CAGR is (ending ÷ starting)^(1 ÷ years) − 1. It is the constant annual rate between those two values. Neither uses cash flows in between."
  },
  {
    question: "What do the starting inputs produce?",
    answer: "$1,000 growing to $1,500 in 3 years is a 50% ROI, a $500 gain, and a CAGR of about 14.47%."
  },
  {
    question: "Does this page say what a good ROI is?",
    answer: "No. It does not compare the result with stocks, real estate, or deposits, and it does not subtract tax or inflation."
  }
];

export default function ROIClient() {
  const [initial, setInitial] = useState<number>(1000);
  const [final, setFinal] = useState<number>(1500);
  const [holdingYears, setHoldingYears] = useState<number>(3);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const roi = calculateROI(initial, final);
    setResult(roi);
  }, [initial, final]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // CAGR = (FV/IV)^(1/n) - 1
  const cagr = initial > 0 && holdingYears > 0
    ? (Math.pow(final / initial, 1 / holdingYears) - 1) * 100
    : 0;

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="mx-auto max-w-6xl">
            <h1 className={styles.title}>ROI &amp; CAGR Calculator 2026</h1>
            <p className={styles.subtitle}>Return on investment is ending value minus starting value, divided by starting value. CAGR is the constant annual rate that turns the starting value into the ending value over the holding period.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Dividends, taxes, fees, inflation, and cash flows between the start and the end are not included. Amounts are in US dollars.
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
                  value={initial} 
                  onChange={(e) => setInitial(Number(e.target.value))}
                  prefix="$"
                />
                <Input 
                  label="Final Value (at Exit)" 
                  type="number" 
                  value={final} 
                  onChange={(e) => setFinal(Number(e.target.value))}
                  prefix="$"
                />
                <Input 
                  label="Holding Period (Years)" 
                  type="number" 
                  value={holdingYears} 
                  onChange={(e) => setHoldingYears(Number(e.target.value))}
                  suffix="years"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-100 dark:text-emerald-400">Total Return on Investment</h2>
                <div className={styles.resultValue}>{result.toFixed(2)}%</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Absolute Profit</span>
                    <span className={styles.statVal}>{formatCurrency(final - initial)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Initial Capital</span>
                    <span className={styles.statVal}>{formatCurrency(initial)}</span>
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

              {/* CAGR Card */}
              <Card className="!rounded-[var(--radius-lg)] !border !border-[var(--border)] !bg-white !p-5">
                <h3 className="mb-2 text-[0.95rem] font-bold text-[var(--text-primary)]">📈 Annualized Return (CAGR)</h3>
                <p className={`text-[2rem] font-black ${cagr >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {cagr.toFixed(2)}%
                </p>
                <p className="mt-2 text-[0.8rem] text-[var(--text-tertiary)]">
                  Compound Annual Growth Rate over {holdingYears} year{holdingYears !== 1 ? 's' : ''}. CAGR is more accurate than simple ROI for multi-year investments.
                </p>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-emerald-500`}><Info size={20} /></div>
                <p className={styles.infoText}>
                  $1,000 to $1,500 in 3 years is a 50% ROI and a $500 gain. The CAGR is about 14.47%. A 200% gain over 10 years, which is a tripling, is a CAGR of about 11.61%.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax & Returns Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#f0fdf4]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#065f46] flex items-center gap-2">
              <ShieldCheck className="text-[#10b981]" /> What is not subtracted
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#065f46]">Tax and fees</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#065f46]/80">
                  <li><strong>Not applied:</strong> LTCG, STCG, a tax slab, and dividends are not taken off the ending value.</li>
                  <li><strong>Two values only:</strong> The page uses a starting value and an ending value.</li>
                  <li><strong>No expense ratio:</strong> Fees are not an input.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#065f46]">Inflation</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#065f46]/80">
                  <li><strong>Not applied:</strong> (1 + return) ÷ (1 + inflation) − 1 is not calculated.</li>
                  <li><strong>Years affect CAGR only:</strong> ROI stays 50% for $1,000 to $1,500 no matter the holding period.</li>
                  <li><strong>XIRR:</strong> Irregular cash flows are not solved.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How ROI and CAGR are built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Two values and a holding period. The period changes CAGR and leaves ROI unchanged.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">The two rates</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>ROI:</strong> (ending − starting) ÷ starting. Time is ignored.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>CAGR:</strong> (ending ÷ starting)^(1 ÷ years) − 1.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Default:</strong> $1,000 to $1,500 in 3 years is 50% ROI and about 14.47% CAGR.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Tripling:</strong> A value that becomes 3 times as large in 10 years has a CAGR of about 11.61%.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Left out</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Fees and tax:</strong> They are not subtracted from the ending value.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Cash flows:</strong> Deposits between the start and the end are not dated. XIRR is not calculated.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Inflation:</strong> A real return is not calculated.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Currency:</strong> Amounts are formatted in US dollars.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What changes the result</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>A longer holding period lowers CAGR when the two values stay the same.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>ROI does not change when only the holding period changes.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>A starting value of zero returns 0% ROI.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Absolute profit is ending value minus starting value.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>A benchmark such as the Nifty 50 is not loaded.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="ROI and CAGR from two values"
          description={`Return on investment is (ending value − starting value) ÷ starting value. CAGR is (ending ÷ starting)^(1 ÷ years) − 1.

$1,000 to $1,500 in 3 years is a 50% ROI, a $500 gain, and a CAGR of about 14.47%. Changing only the years changes CAGR and leaves ROI at 50%. Tax, fees, inflation, dividends, and cash flows between the two dates are not included. Amounts are in US dollars.`}
          howToUse={[
            "Enter the starting value. The default is $1,000.",
            "Enter the ending value. The default is $1,500.",
            "Enter the holding period in years. The default is 3. It is used only for CAGR.",
            "Read ROI, which ignores the holding period.",
            "Read CAGR and the absolute profit, which is ending value minus starting value."
          ]}
          benefits={[
            "ROI for the default inputs is 50%.",
            "CAGR for those inputs is about 14.47%.",
            "A tripling in 10 years is a CAGR of about 11.61%.",
            "XIRR is not calculated.",
            "Amounts are formatted in US dollars."
          ]}
          formula="ROI = ((FV - IV) / IV) × 100 | CAGR = (FV/IV)^(1/n) - 1"
        />
        <FAQSchema faqs={ROI_FAQS} />
        <RelatedTools currentToolId="roi-calculator" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
