'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateSavingsGoal } from '@/lib/formulas';
import { Info, Target, TrendingUp, Sparkles, ShieldCheck, BookOpen, AlertTriangle, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const SAVINGS_FAQS = [
  {
    question: "Does this calculator use the 50/30/20 rule?",
    answer: "No. Income is not an input. The result is the monthly deposit that reaches the target."
  },
  {
    question: "Is a current balance subtracted from the target?",
    answer: "No. The path starts at zero. There is no field for money already saved."
  },
  {
    question: "When is each deposit assumed to be paid?",
    answer: "At the start of the month. The formula divides by an extra (1 + monthly rate), which is the same timing as the SIP calculator."
  }
];

export default function SavingsGoalClient() {
  const [target, setTarget] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(5);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const monthly = calculateSavingsGoal(target, rate / 100, years);
    setResult(monthly);
  }, [target, rate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>Savings Goal Calculator 2026</h1>
            <p className={styles.subtitle}>The monthly figure is the deposit, paid at the start of each month, that reaches the target at a constant annual return. The path starts at zero. A zero return divides the target by the number of months.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Returns shown are based on <strong>assumed constant rates</strong>. Actual investment returns fluctuate and are not guaranteed. This calculator is for <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Target Amount" 
                  type="number" 
                  value={target} 
                  onChange={(e) => setTarget(Number(e.target.value))}
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
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-amber-500/30 bg-amber-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-100 dark:text-amber-400">Required Monthly Savings</h2>
                <div className={styles.resultValue}>{formatCurrency(result)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Target Amount</span>
                    <span className={styles.statVal}>{formatCurrency(target)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Contributions</span>
                    <span className={styles.statVal}>{formatCurrency(result * years * 12)}</span>
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
                <div className={`${styles.infoIcon} text-amber-500`}><Info size={20} /></div>
                <p className={styles.infoText}>
                  ₹10,00,000 in 5 years at 10% needs about ₹12,807 a month. The deposits total about ₹7,68,419. The rest of the target, about ₹2,31,581, is growth.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax & Goals Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#fffbeb]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#b45309] flex items-center gap-2">
              <ShieldCheck className="text-[#f59e0b]" /> What the monthly figure assumes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#b45309]">Starting example</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#b45309]/80">
                  <li><strong>Target:</strong> ₹10,00,000 in 5 years at 10% a year.</li>
                  <li><strong>Deposit:</strong> About ₹12,807 at the start of each month.</li>
                  <li><strong>Contributions:</strong> About ₹7,68,419. Growth makes up the rest, about ₹2,31,581.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#b45309]">Not in the formula</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#b45309]/80">
                  <li><strong>No starting balance:</strong> Money already saved is not subtracted.</li>
                  <li><strong>No tax:</strong> PPF, ELSS, NPS, and insurance deductions are not applied.</li>
                  <li><strong>Zero return:</strong> The deposit is the target divided by the number of months. For this example that is ₹10,00,000 ÷ 60, about ₹16,667.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How this monthly deposit is built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">The target, one annual rate, and a term in years. Each deposit is treated as paid at the start of the month.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Formula</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Monthly rate:</strong> The annual percent is divided by 12. A 10% input is about 0.833% a month.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Months:</strong> Years times 12. The default is 60 months.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Payment:</strong> Target × i ÷ [((1 + i)^n − 1) × (1 + i)].</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Contributions line:</strong> Monthly deposit × years × 12.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Target size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not chosen by the page</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>No fund type:</strong> Equity, debt, and liquid funds are not selected.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>No income split:</strong> 50/30/20 is not applied.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>No inflation:</strong> The target is not increased over time.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>No step-up:</strong> The monthly deposit stays flat.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Same target, other inputs</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>A longer term or a higher rate lowers the monthly deposit.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>At 0% for 5 years, ₹10,00,000 needs about ₹16,667 a month.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>The term is entered in years, then converted to months.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Registration costs and a house price are not added to the target.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Amounts are formatted in rupees.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Monthly deposit for a savings target"
          description={`The monthly figure is the deposit, paid at the start of each month, that reaches the target at a constant annual return. The path starts at zero. A zero return divides the target by the number of months.

₹10,00,000 in 5 years at 10% needs about ₹12,807 a month. Those deposits total about ₹7,68,419, and growth supplies about ₹2,31,581. The formula is target × i ÷ [((1 + i)^n − 1) × (1 + i)], with i = annual rate ÷ 12 and n = years × 12. Tax, inflation, and a starting balance are not applied.`}
          howToUse={[
            "Enter the target amount. The default is ₹10,00,000.",
            "Enter the term in years. The default is 5, which is 60 months.",
            "Enter the annual return as a percent. The default is 10.",
            "Read the required monthly deposit.",
            "Total contributions are that deposit times the number of months.",
            "A zero rate divides the target by the number of months."
          ]}
          benefits={[
            "Each deposit is treated as paid at the start of the month.",
            "The ₹12,807 example uses ₹10,00,000, 10%, and 5 years.",
            "No money already saved is subtracted.",
            "The monthly amount does not step up.",
            "Amounts are formatted in rupees."
          ]}
        />
        <FAQSchema faqs={SAVINGS_FAQS} />
        <RelatedTools currentToolId="savings-goal" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
