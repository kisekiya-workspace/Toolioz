'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateSavingsGoal } from '@/lib/formulas';
import { Info, Target, TrendingUp, Sparkles, ShieldCheck, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const SAVINGS_FAQS = [
  {
    question: "What is the 50/30/20 Budgeting Rule?",
    answer: "The 50/30/20 rule recommends allocating 50% of net income to Needs (housing, utilities, food), 30% to Wants (entertainment, dining), and 20% to Savings and debt repayment."
  },
  {
    question: "How much should be in an Emergency Fund?",
    answer: "An ideal emergency fund should cover 3 to 6 months of basic essential living expenses, kept in a highly liquid savings account or liquid mutual fund."
  },
  {
    question: "What is a Sinking Fund?",
    answer: "A sinking fund is a dedicated savings bucket created by setting aside small monthly amounts for a specific upcoming purchase (like a car down payment, vacation, or annual insurance premium)."
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
            <p className={styles.subtitle}>Find out how much to save monthly for a house, car, or any financial goal.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Returns shown are based on <strong>assumed constant rates</strong>. Actual investment returns fluctuate and are not guaranteed. This calculator is for <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="container section">
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
              <Card className={styles.resultCard} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <h2 className={styles.resultLabel}>Required Monthly Savings</h2>
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
                  Download Savings Plan
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#f59e0b' }}><Info size={20} /></div>
                <p className={styles.infoText}>
                  Setting a financial goal helps you stay focused and motivated. This tool calculates the systematic monthly investment needed to reach your goal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax & Goals Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#fffbeb]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#b45309] flex items-center gap-2">
              <ShieldCheck className="text-[#f59e0b]" /> 💸 Tax-Efficient Goal Planning (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#b45309]">EEE Instruments (Tax-Free)</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#b45309]/80">
                  <li><strong>PPF (Public Provident Fund):</strong> Invest up to ₹1.5L/year. Interest and Maturity are 100% Tax-Free. 15-year lock-in.</li>
                  <li><strong>SSY (Sukanya Samriddhi):</strong> For girl children. Best-in-class interest rates and zero tax on maturity.</li>
                  <li><strong>EPF (Provident Fund):</strong> Mandatory for salaried. Interest is tax-free up to ₹2.5L annual contribution.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#b45309]">Tax-Saving Investments</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#b45309]/80">
                  <li><strong>ELSS (Mutual Funds):</strong> Only 3-year lock-in. 80C benefit in old regime + equity growth. (LTCG applies on maturity).</li>
                  <li><strong>NPS (Retirement):</strong> Additional ₹50,000 tax benefit (u/s 80CCD(1B)). 60% maturity is tax-free at age 60.</li>
                  <li><strong>Life Insurance:</strong> Term insurance premiums are tax-deductible. Payouts are usually tax-free (u/s 10(10D)).</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">🎯 Savings Tips</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Build your financial safety net with these essential rules.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Essential Savings Rules</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Emergency Fund First:</strong> Before any goal, build 3–6 months of expenses in a liquid fund to prevent breaking other investments.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>50/30/20 Rule:</strong> Allocate 50% to needs, 30% to wants, 20% to savings. Never save less than 10%.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Pay Yourself First:</strong> Auto-debit savings on salary day. Don&apos;t save what&apos;s left after spending.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Sinking Fund:</strong> For predictable large expenses (car service, vacation), save small amounts monthly.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Target size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Goal-Based Strategy</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>&lt;3 years (Short):</strong> FDs, liquid funds, or short-term debt funds. Never use equity.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>3–5 years (Medium):</strong> Balanced advantage funds or hybrid funds.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>5+ years (Long):</strong> Equity mutual funds or index funds. Higher risk but better wealth creator.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>15+ years (Education):</strong> 100% equity SIP, gradually shift to debt as the goal approaches.</span></li>
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
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Automate everything:</strong> Auto-debit SIPs, auto-sweep savings accounts, and automated bill payments.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Review goals <strong>every 6 months</strong>. Life changes should trigger a savings recalculation.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Use separate bank accounts or funds for separate goals to track progress effectively.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Don&apos;t keep more than ₹1–2 lakh in savings.</strong> Keep the rest in liquid mutual funds.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>For house down payment: Assume <strong>20% value + 7–8% registration costs</strong>.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Savings Goal Calculator 2026: Plan for a House Down Payment or Milestone"
          description={`Financial success is rarely an accident; it is the result of a deliberate and disciplined saving strategy. Whether you are wondering how much to save for a house calculator 2026 or planning a down payment for a milestone, having a specific 'Savings Goal' is the first step. Our savings goal calculator for down payment transforms abstract desires into concrete, actionable steps.

This is where a savings goal calculator becomes essential. By working backward from your target amount, the tool determines the monthly contribution required to cross the finish line on time. It accounts for the power of compounding, which means if you invest your savings in interest-bearing assets, you actually need to contribute less out of your own pocket. For instance, saving for a $50,000 goal over 10 years requires a much smaller monthly effort than saving for the same amount over 2 years.

Beyond just the numbers, goal-oriented saving helps in prioritizing your spending. When you have a clear target in sight, it becomes easier to skip unnecessary expenses in favor of your long-term vision. Our tool is designed to provide this clarity, allowing you to simulate different timeframes and interest rates. By visualizing your progress and understanding the regular effort required, you can stay motivated and turn your financial aspirations into a reality.`}
          howToUse={[
            "Begin by defining your Target Goal Amount (e.g., the cost of a car or a home down payment).",
            "Specify the Time Horizon—the number of years or months you have to reach this goal.",
            "Input the Expected Annual Return Rate if you plan to invest these savings in a bank account or fund.",
            "Review the Required Monthly Saving amount calculated by the tool.",
            "Analyze the 'Total Contributions' vs. 'Target Amount' to see the impact of interest earned.",
            "If the monthly amount is too high, experiment with extending the timeline or increasing your return expectations."
          ]}
          benefits={[
            "Clarity & Focus: Know exactly what you need to do every month to hit your target.",
            "Motivation: Seeing a clear path to your goal makes it easier to stay disciplined with your budget.",
            "Informed Investing: Understand how higher returns can drastically reduce your required monthly effort.",
            "Risk Management: Account for inflation and potential market changes in your long-term plans.",
            "Financial Peace: Reduce stress by having a pre-planned roadmap for your major life expenses."
          ]}
        />
        <FAQSchema faqs={SAVINGS_FAQS} />
        <RelatedTools currentToolId="savings-goal" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
