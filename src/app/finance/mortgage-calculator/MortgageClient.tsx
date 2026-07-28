'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateMonthlyPayment } from '@/lib/formulas';
import { Info, HomeIcon, ShieldCheck, PieChart, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';

const MORTGAGE_FAQS = [
  {
    question: "What is the 28/36 rule for mortgage affordability?",
    answer: "The 28/36 rule states that your housing expenses should not exceed 28% of your gross monthly income, and your total debt service (housing + credit cards + car loans) should not exceed 36%."
  },
  {
    question: "What is Private Mortgage Insurance (PMI)?",
    answer: "PMI is insurance required by conventional lenders when your down payment is less than 20% of the home purchase price. It protects the lender if you default."
  },
  {
    question: "Is a 15-year or 30-year mortgage better?",
    answer: "A 15-year mortgage has higher monthly payments but lower interest rates and saves huge amounts in overall interest. A 30-year mortgage has lower monthly payments, offering greater cash flow flexibility."
  }
];

export default function MortgageClient() {
  const [principal, setPrincipal] = useState<number>(300000);
  const [rate, setRate] = useState<number>(6.8);
  const [years, setYears] = useState<number>(30);
  const [result, setResult] = useState<number>(0);

  // Persistence
  useEffect(() => {
    const savedPrincipal = localStorage.getItem('toolioz_mortgage_principal');
    const savedRate = localStorage.getItem('toolioz_mortgage_rate');
    const savedYears = localStorage.getItem('toolioz_mortgage_years');

    if (savedPrincipal) setPrincipal(Number(savedPrincipal));
    if (savedRate) setRate(Number(savedRate));
    if (savedYears) setYears(Number(savedYears));
  }, []);

  useEffect(() => {
    localStorage.setItem('toolioz_mortgage_principal', principal.toString());
    localStorage.setItem('toolioz_mortgage_rate', rate.toString());
    localStorage.setItem('toolioz_mortgage_years', years.toString());

    const payment = calculateMonthlyPayment(principal, rate / 100, years);
    setResult(payment);
  }, [principal, rate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>Mortgage Calculator 2026</h1>
            <p className={styles.subtitle}>Estimate monthly mortgage payments for home buying &amp; property planning.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> This calculator provides <strong>approximate estimates</strong> and does not include property taxes, insurance (PMI), or HOA fees. Actual payments depend on your lender, credit score, and loan type. For <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="container section">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Loan Amount" 
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
                  label="Loan Term (Years)" 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  suffix="years"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className={styles.resultCard} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                <h2 className={styles.resultLabel}>Monthly Payment</h2>
                <div className={styles.resultValue}>{formatCurrency(result)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Payback</span>
                    <span className={styles.statVal}>{formatCurrency(result * years * 12)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Interest</span>
                    <span className={styles.statVal}>{formatCurrency((result * years * 12) - principal)}</span>
                  </div>
                </div>
                <Button 
                  fullWidth 
                  className={styles.btn}
                  onClick={() => window.print()}
                >
                  Download Amortization Schedule
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#8b5cf6' }}><Info size={20} /></div>
                <p className={styles.infoText}>
                  A mortgage calculator helps you determine how much your monthly payment will be, based on the loan amount, interest rate, and term.
                </p>
              </div>
            </div>
          </div>

          {/* Amortization Breakdown Table */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Mortgage Amortization Schedule (Yearly)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-3 font-bold">Year</th>
                    <th className="p-3 font-bold">Principal Paid</th>
                    <th className="p-3 font-bold">Interest Paid</th>
                    <th className="p-3 font-bold">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    let balance = principal;
                    const monthlyRate = rate / 100 / 12;
                    return Array.from({ length: Math.min(years, 30) }, (_, i) => {
                      const year = i + 1;
                      let yearPrincipal = 0;
                      let yearInterest = 0;

                      for (let m = 0; m < 12; m++) {
                        if (balance <= 0) break;
                        const interestPayment = balance * monthlyRate;
                        const principalPayment = Math.min(balance, result - interestPayment);
                        yearPrincipal += principalPayment;
                        yearInterest += interestPayment;
                        balance -= principalPayment;
                      }

                      return (
                        <tr key={year} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">Year {year}</td>
                          <td className="p-3 text-emerald-600 font-medium">{formatCurrency(yearPrincipal)}</td>
                          <td className="p-3 text-amber-600 font-medium">{formatCurrency(yearInterest)}</td>
                          <td className="p-3 font-bold text-slate-900">{formatCurrency(Math.max(0, balance))}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax Benefits Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#f5f3ff]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#5b21b6] flex items-center gap-2">
              <ShieldCheck className="text-[#8b5cf6]" /> 💸 Home Loan Tax Benefits (India 2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#5b21b6]">Interest Deductions</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#5b21b6]/80">
                  <li><strong>Section 24(b):</strong> Deduct up to <strong>₹2 Lakh</strong> per year on interest paid for a self-occupied property.</li>
                  <li><strong>Let-out Property:</strong> Entire interest paid can be offset against rental income (capped at ₹2L loss per year).</li>
                  <li><strong>Pre-construction Interest:</strong> Can be claimed in 5 equal installments after possession.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#5b21b6]">Principal & Others</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#5b21b6]/80">
                  <li><strong>Section 80C:</strong> Principal repayment is eligible for deduction up to <strong>₹1.5 Lakh</strong> (Old Regime only).</li>
                  <li><strong>Stamp Duty:</strong> Can also be claimed under Section 80C in the year of purchase.</li>
                  <li><strong>Joint Loans:</strong> If you co-own with a spouse, both can claim separate ₹2L (Interest) and ₹1.5L (Principal) deductions!</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">🏠 Before You Take a Home Loan</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Must-know strategies to save money and avoid common pitfalls.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Important Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>PMI:</strong> Required when down payment is &lt;20%. Adds $50–$200/month. Request removal once you hit 20% equity.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>APR vs Rate:</strong> APR includes fees and closing costs — it&apos;s the true cost of the loan.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Escrow:</strong> Lenders may require an account for property taxes and insurance, increasing monthly payment.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Points:</strong> Pay upfront to lower your rate. 1 point = 1% of loan = ~0.25% rate drop. Good if staying 7+ years.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Hidden Costs</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Closing costs:</strong> 2–5% of home price. Budget $6K–$15K on a $300K home.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Tax increases:</strong> Cities reassess property taxes. What&apos;s affordable today may not be tomorrow.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>HOA fees:</strong> Can range from $100 to $1,000+/month. Not in the mortgage but a real cost.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Maintenance rule:</strong> Budget 1% of home value annually ($3,000/yr on $300K home).</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Tips for Buyers</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Follow the <strong>28/36 rule</strong>: housing ≤28% of gross income, total debt ≤36%.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Get pre-approved (not just pre-qualified) for serious negotiating power.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>A <strong>15-year mortgage</strong> saves 50%+ in interest vs 30-year, but payments are ~40% higher.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>One extra payment per year on a 30-year loan can cut it by <strong>4–5 years</strong>.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Don&apos;t drain your emergency fund for the down payment — keep 3–6 months liquid.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Mortgage Affordability 2026: The Ultimate Guide to FHA & VA Loans"
          description={`Purchasing a home is likely the largest financial commitment you will ever make. Navigating the world of home loans requires a deep understanding of how mortgage payments are structured, particularly the relationship between principal and interest. Our mortgage affordability calculator 2026 is a strategic partner in your home-buying journey, supporting FHA mortgage with PMI and VA loan payment estimates. It allows you to peel back the curtain on your monthly installments and see exactly where every dollar goes.

Most mortgages operate on an amortization schedule, a table that details each periodic payment on a loan. In the early years of your mortgage, a significant portion of your monthly payment is directed toward interest, while only a small fraction reduces the principal balance. As time goes on, this ratio shifts, and you begin to equity much faster. By using our advanced calculator, you can see how even a 0.5% difference in your interest rate can save (or cost) you tens of thousands of dollars over the life of a 30-year loan.

Furthermore, our tool helps you evaluate different loan terms. While a 15-year mortgage typically comes with higher monthly payments, it drastically reduces the total interest paid compared to a traditional 30-year term. Beyond just principal and interest, remember that homeownership involves other costs like property taxes, homeowners insurance, and sometimes private mortgage insurance (PMI). While this calculator focuses on the loan mechanics, it provides the solid foundation you need to determine "How much house can I afford?" before you even speak to a lender.`}
          howToUse={[
            "Enter the Total Home Price or the amount you intend to borrow (Principal).",
            "Adjust the Down Payment amount to see how it reduces your monthly commitment and interest costs.",
            "Input the Annual Interest Rate provided by your bank or mortgage broker.",
            "Select the Loan Term (typically 15, 20, or 30 years) to understand the impact on affordability.",
            "Analyze the Monthly EMI (Equated Monthly Installment) and total interest payable.",
            "View the total cost of ownership over the entire period, including the principal payback."
          ]}
          benefits={[
            "Strategic Home Buying: Know your budget limits before you start house hunting.",
            "Interest Savings: Discover how making extra payments or choosing a shorter term can save you a fortune.",
            "Transparency: Understand exactly how your monthly payment is calculated using standard amortization formulas.",
            "Scenario Testing: Compare different lenders and interest rate offers side-by-side.",
            "Financial Confidence: Approach real estate negotiations with a firm grasp of your numbers."
          ]}
          formula="M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]"
        />
        <FAQSchema faqs={MORTGAGE_FAQS} />
        <RelatedTools currentToolId="mortgage-calculator" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
