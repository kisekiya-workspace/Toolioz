'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateMonthlyPayment } from '@/lib/formulas';
import { Info, HomeIcon, ShieldCheck, PieChart, BookOpen, AlertTriangle, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';

const MORTGAGE_FAQS = [
  {
    question: "Does this calculator apply the 28/36 affordability rule?",
    answer: "No. The result is the principal-and-interest payment for the entered balance, rate, and term. Income and other debts are not inputs."
  },
  {
    question: "Does the payment include private mortgage insurance?",
    answer: "No. Property tax, homeowners insurance, PMI, and HOA fees are not added."
  },
  {
    question: "How do 15 years and 30 years compare at the same rate?",
    answer: "The rate does not change with the term. At 6.8% on $300,000, 30 years is about $1,956 a month and about $404,079 of interest. Fifteen years is about $2,663 a month and about $179,349 of interest."
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
            <p className={styles.subtitle}>A mortgage payment is the monthly amount that repays principal and interest over the loan term. The standard formula uses the loan balance, the annual rate divided by 12, and the number of months.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> The payment is principal and interest only. Property tax, insurance, PMI, and HOA fees are not included. The 6.8% rate is an illustrative default.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
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
              <Card className="rounded-2xl border border-violet-500/30 bg-violet-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-violet-100 dark:text-violet-400">Monthly Mortgage Payment</h2>
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
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={`${styles.infoIcon} text-violet-500`}><Info size={20} /></div>
                <p className={styles.infoText}>
                  The payment is M = P [ i(1 + i)^n ] / [ (1 + i)^n − 1 ]. i is the annual rate divided by 12, and n is the term in months. There is no down-payment field.
                </p>
              </div>
            </div>
          </div>

          {/* Amortization Breakdown Table */}
          <div className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-6">
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
              <ShieldCheck className="text-[#8b5cf6]" /> What the payment leaves out
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#5b21b6]">Not in the formula</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#5b21b6]/80">
                  <li><strong>Taxes and insurance:</strong> Property tax, PMI, and HOA fees are not added.</li>
                  <li><strong>No Section 24 or 80C:</strong> Indian interest and principal deductions are not calculated.</li>
                  <li><strong>No extra payments:</strong> One extra payment a year is not modeled.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#5b21b6]">Same rate, two terms</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#5b21b6]/80">
                  <li><strong>30 years:</strong> $300,000 at 6.8% is about $1,956 a month.</li>
                  <li><strong>Interest:</strong> About $404,079 over 360 payments.</li>
                  <li><strong>15 years:</strong> The same balance and rate is about $2,663 a month and about $179,349 of interest.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How this payment is built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">One balance, one annual rate, and a term in years. The rate does not change when the term changes.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Starting example</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Inputs:</strong> $300,000, 6.8% a year, 30 years.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Payment:</strong> About $1,956 a month.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Interest:</strong> About $404,079. Total paid is about $704,079.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Schedule:</strong> A month-by-month table is not shown.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not added</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>PMI, tax, insurance, HOA:</strong> None of these are in the payment.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Down payment:</strong> There is no purchase-price field. The amount entered is the balance.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Fees:</strong> Points and closing costs are not subtracted from the rate.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>FHA and VA:</strong> Those loan types are not separate formulas.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">15 years at the same 6.8%</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Payment is about $2,663 a month, about 36% above the 30-year payment.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Interest is about $179,349, versus about $404,079 over 30 years.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>The shorter term does not receive a lower rate in this calculator.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Extra payments are not applied.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span>Currency formatting is US dollars.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Monthly mortgage payment"
          description={`A mortgage payment is the monthly amount that repays principal and interest over the term. The formula is M = P [ i(1 + i)^n ] / [ (1 + i)^n − 1 ], where i is the annual rate divided by 12 and n is the number of months.

$300,000 at 6.8% for 30 years is about $1,956 a month and about $404,079 of interest. The same balance and rate for 15 years is about $2,663 a month and about $179,349 of interest. The rate does not drop when the term is shortened. Property tax, insurance, PMI, HOA fees, and a down payment are not inputs. A month-by-month schedule is not shown.`}
          howToUse={[
            "Enter the loan balance. There is no separate purchase price or down payment.",
            "Enter the annual rate as a percent. The default is 6.8.",
            "Enter the term in years. The default is 30.",
            "Read the monthly payment.",
            "Interest is the monthly payment times the number of months, minus the balance."
          ]}
          benefits={[
            "The payment is principal and interest only.",
            "The $1,956 example uses $300,000, 6.8%, and 30 years.",
            "A 15-year term at that same rate is about $2,663 a month.",
            "FHA, VA, and tax deductions are not separate formulas.",
            "Amounts are formatted in US dollars."
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
