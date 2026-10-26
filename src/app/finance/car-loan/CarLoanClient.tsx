'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateMonthlyPayment } from '@/lib/formulas';
import { Info, Car, ShieldCheck, TrendingUp, BookOpen, AlertTriangle, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const CAR_LOAN_FAQS = [
  {
    question: "Does this calculator use a flat rate?",
    answer: "No. The EMI is a reducing-balance payment: M = P [ i(1 + i)^n ] / [ (1 + i)^n − 1 ]. A flat rate on the original principal is not calculated."
  },
  {
    question: "How do 3 years and 5 years compare at the same rate?",
    answer: "The rate does not change with the tenure. ₹5,00,000 at 8.5% for 5 years is about ₹10,258 a month and about ₹1,15,496 of interest. Three years is about ₹15,784 a month and about ₹68,216 of interest."
  },
  {
    question: "Is a down payment subtracted from the loan amount?",
    answer: "No. The amount entered is the balance that is amortized. There is no purchase-price or down-payment field."
  }
];

export default function CarLoanClient() {
  const [principal, setPrincipal] = useState<number>(500000);
  const [rate, setRate] = useState<number>(8.5);
  const [years, setYears] = useState<number>(5);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const emi = calculateMonthlyPayment(principal, rate / 100, years);
    setResult(emi);
  }, [principal, rate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="mx-auto max-w-6xl">
            <h1 className={styles.title}>Car Loan EMI Calculator 2026</h1>
            <p className={styles.subtitle}>A reducing-balance car-loan EMI is the fixed monthly payment that clears the principal and interest over the tenure. Total interest is the sum of EMIs minus the amount borrowed.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> The 8.5% rate is an illustrative default. The payment is principal and interest only. Insurance, fuel, and a down payment are not included.
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Loan amount" 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  prefix="₹"
                />
                <Input 
                  label="Interest Rate (%)" 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  suffix="%"
                />
                <Input 
                  label="Loan Tenure (Years)" 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  suffix="years"
                />
              </div>
            </Card>

            <div className={styles.resultCol}>
              <Card className="rounded-2xl border border-sky-500/30 bg-sky-700 dark:bg-[#1f2430] dark:border-[#333a4d] p-6 text-center text-white sm:p-8 relative">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-100 dark:text-sky-400">Monthly EMI</h2>
                <div className={styles.resultValue}>{formatCurrency(result)}</div>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Interest</span>
                    <span className={styles.statVal}>{formatCurrency(result * years * 12 - principal)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Payable</span>
                    <span className={styles.statVal}>{formatCurrency(result * years * 12)}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Loan Amount</span>
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
                <div className={`${styles.infoIcon} text-cyan-500`}><Info size={20} /></div>
                <p className={styles.infoText}>
                  An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#ecfeff]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#0891b2] flex items-center gap-2">
              <ShieldCheck className="text-[#06b6d4]" /> Same rate, two tenures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0891b2]">5 years</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0891b2]/80">
                  <li><strong>Inputs:</strong> ₹5,00,000 at 8.5% for 5 years.</li>
                  <li><strong>EMI:</strong> About ₹10,258 a month.</li>
                  <li><strong>Interest:</strong> About ₹1,15,496. Total paid is about ₹6,15,496.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0891b2]">3 years</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0891b2]/80">
                  <li><strong>Same balance and rate:</strong> About ₹15,784 a month.</li>
                  <li><strong>Interest:</strong> About ₹68,216.</li>
                  <li><strong>Not applied:</strong> Tax, depreciation, insurance, and fuel are not added.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How this EMI is built</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">One loan amount, one annual rate, and a tenure in years. The rate does not change when the tenure changes.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Reducing balance only</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Formula:</strong> M = P [ i(1 + i)^n ] / [ (1 + i)^n − 1 ]. i is the annual rate divided by 12.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Flat rate:</strong> Interest on the original principal for the whole tenure is not calculated.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Fees:</strong> A processing fee and a foreclosure charge are not added.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Currency:</strong> Amounts are formatted in rupees.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Not in the payment</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Down payment:</strong> The amount entered is the balance. A car price is not split.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Insurance and fuel:</strong> They are not added to the EMI.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Used-car premium:</strong> The rate is whatever is typed. It does not rise by 2–4%.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Income:</strong> A 15% of salary check is not performed.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">3 years at the same 8.5%</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>EMI is about ₹15,784, higher than the 5-year payment of about ₹10,258.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Interest is about ₹68,216, versus about ₹1,15,496 over 5 years.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>The shorter tenure does not receive a lower rate.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>This is the same reducing-balance formula as the mortgage calculator.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>That mortgage page formats US dollars. This page formats rupees.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Reducing-balance car loan EMI"
          description={`A reducing-balance EMI is the fixed monthly payment that clears principal and interest. Total interest is the sum of the EMIs minus the amount borrowed. A flat rate is not used.

₹5,00,000 at 8.5% for 5 years is about ₹10,258 a month and about ₹1,15,496 of interest. The same balance and rate for 3 years is about ₹15,784 a month and about ₹68,216 of interest. The rate does not drop when the tenure is shortened. There is no down-payment field. Insurance, fuel, and tax are not added. Amounts are in rupees.`}
          howToUse={[
            "Enter the loan amount. The default is ₹5,00,000. A car price is not split into a down payment.",
            "Enter the annual rate as a percent. The default is 8.5.",
            "Enter the tenure in years. The default is 5.",
            "Read the monthly EMI.",
            "Interest is the EMI times the number of months, minus the loan amount."
          ]}
          benefits={[
            "The formula is reducing balance, the same payment formula as the mortgage calculator.",
            "The ₹10,258 example uses ₹5,00,000, 8.5%, and 5 years.",
            "A 3-year term at that same rate is about ₹15,784 a month.",
            "A flat-rate interest quote is not converted.",
            "Amounts are formatted in rupees."
          ]}
          formula="M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]"
        />
        <FAQSchema faqs={CAR_LOAN_FAQS} />
        <RelatedTools currentToolId="car-loan" categoryId="finance" />
      <Footer />
    </div>
    </>
  );
}
