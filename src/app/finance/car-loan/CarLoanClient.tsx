'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateMonthlyPayment } from '@/lib/formulas';
import { Info, Car, ShieldCheck, TrendingUp, BookOpen, AlertTriangle, Lightbulb, Download } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';

const CAR_LOAN_FAQS = [
  {
    question: "What is the difference between Flat Rate and Reducing Balance Interest Rate?",
    answer: "A flat rate interest rate calculates interest on the original loan amount throughout the entire tenure. A reducing balance rate calculates interest only on the outstanding loan balance, which reduces monthly as you pay principal."
  },
  {
    question: "Is 3-year or 5-year tenure better for a car loan?",
    answer: "A 3-year car loan reduces total interest cost and ensures you don't end up in negative equity (owing more than the depreciated car value). A 5-year loan offers lower monthly EMIs."
  },
  {
    question: "What is the recommended down payment for a car loan?",
    answer: "Financial experts recommend putting down at least 20% as a down payment to avoid negative equity and secure lower interest rates from banks."
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
            <p className={styles.subtitle}>Calculate monthly installments with latest car loan interest rates.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> Interest rates shown are <strong>illustrative defaults</strong> and may not match actual bank offers. EMI depends on your credit score, loan tenure, and lender. For <strong>assumption &amp; planning purposes only</strong>.
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl pb-12 pt-4">
          <div className={styles.grid}>
            <Card className={styles.inputCard}>
              <div className={styles.inputGroup}>
                <Input 
                  label="Loan Amount / Price" 
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
                  <Download className="mr-2 size-4" />
                  Download EMI Schedule
                </Button>
              </Card>

              <div className={styles.infoBox}>
                <div className={styles.infoIcon} style={{ color: '#06b6d4' }}><Info size={20} /></div>
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
              <ShieldCheck className="text-[#06b6d4]" /> 💸 Tax & Car Loans (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0891b2]">Salaried Individuals</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0891b2]/80">
                  <li><strong>No Direct Benefit:</strong> Unfortunately, there are <strong>no income tax deductions</strong> for car loan EMI or interest for salaried employees.</li>
                  <li><strong>Electric Vehicles (EV):</strong> Section 80EEB (deduction up to ₹1.5L on interest) was available until March 2023. Check for any 2026 extensions in state-specific EV policies.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#0891b2]">Business / Professionals</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#0891b2]/80">
                  <li><strong>Interest Deduction:</strong> If the car is used for business, the **entire interest amount** can be claimed as a business expense.</li>
                  <li><strong>Depreciation:</strong> You can claim <strong>15% depreciation</strong> (standard) or higher for EVs annually on the car&apos;s value to reduce taxable profit.</li>
                  <li><strong>Fuel & Maintenance:</strong> Expenses like fuel and servicing can also be deducted proportionally for business use.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">🚗 Car Loan Tips</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Must-know advice before signing the dotted line.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Important Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Flat vs Reducing:</strong> Dealers quote "flat rate" (e.g., 5%), but it's really ~9-10% reducing.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Processing Fee:</strong> Usually 0.5–2% of the loan amount. Highly negotiable.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Foreclosure:</strong> Banks charge 2–5% if you repay early (except floating rate).</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-cyan-500">•</span><span><strong>Ex-showroom:</strong> Loans are on ex-showroom. Registration & insurance are out-of-pocket.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Unwritten Rules</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Dealer Financing:</strong> Usually more expensive. Get pre-approved at a bank first.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Zero Down Payment:</strong> A trap. 100% financing = maximum interest. Pay 20% down.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Insurance:</strong> You are free to buy insurance from any provider, not just the dealer.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Negotiation:</strong> Agree on the car price first, THEN discuss finance.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Tips for Borrowers</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>15% Rule:</strong> Keep EMI below 15% of your monthly take-home salary.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Tenure:</strong> 3 years is the sweet spot for balancing affordable EMIs and low interest.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Credit Score:</strong> Wait 3 months to fix a bad score; it can save lakhs in interest.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Used Cars:</strong> Bank rates are 2–4% higher. Try certified pre-owned programs.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>TCO:</strong> Calculate Total Cost of Ownership (EMI + Insurance + Fuel), not just EMI.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SEOSection 
          title="Car Loan EMI Calculator 2026: Navigating Interest Rates & Tenures"
          description={`Buying a new car is a significant financial decision. Our car loan EMI calculator with interest rates 2026 provides a clear breakdown of your monthly commitment. Plan your vehicle purchase with the latest auto financing rules and ensure your dream drive fits your budget.

When you take out a car loan, you are essentially borrowing the purchase price (minus your down payment) and agreeing to pay it back over a fixed tenure with interest. Unlike home loans, car loans typically have shorter tenures—ranging from 1 to 7 years—and higher interest rates. The shorter the tenure, the higher your monthly EMI will be, but the less interest you will pay in total. Conversely, a longer tenure makes the car more affordable on a month-to-month basis but significantly increases the total cost of ownership due to interest accumulation.

Our car loan calculator helps you find the perfect balance. By experimenting with different down payment amounts and tenures, you can see how to minimize your interest burden while keeping your installments manageable. Beyond just the EMI, remember to factor in other ownership costs like insurance, maintenance, and fuel. By entering your numbers into our precision tool, you gain the power to negotiate better with lenders and choose a financing plan that fits seamlessly into your monthly household budget.`}
          howToUse={[
            "Enter the Full Purchase Price of the car or the loan amount you intend to borrow.",
            "Input the Interest Rate offered by the bank or dealership's finance department.",
            "Select the Loan Tenure (the number of years you have to pay back the loan).",
            "Instantly view the Monthly EMI you will need to pay.",
            "Analyze the Total Interest Cost—this shows the 'extra' you are paying for the convenience of financing.",
            "Compare the 'Total Payback Amount' against the original car price to understand the full cost of the loan."
          ]}
          benefits={[
            "Negotiation Power: Walk into the dealership with a firm understanding of what your monthly payment should be.",
            "Affordability Check: Ensure the car you want fits within your actual monthly income limits.",
            "Interest Minimization: Discover how a larger down payment or a shorter term can save you significant money.",
            "Quick Comparison: Side-by-side comparison of different loan offers from various banks.",
            "Budget Discipline: Plan your monthly expenses with absolute certainty about your auto loan commitment."
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
