'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateTax } from '@/lib/formulas';
import { CreditCard, Info, AlertTriangle, CheckCircle2, ShieldCheck, BookOpen, Clock, Lightbulb, Printer } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';

import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSchema } from '@/components/ui/FAQSchema';
const TAX_SLABS = [5, 12, 18, 28];

const GST_FAQS = [
  {
    question: "How is GST calculated on Inclusive and Exclusive amounts?",
    answer: "For Exclusive amount: GST = Base Amount * Rate / 100. For Inclusive amount: GST = Total Amount - (Total Amount * 100 / (100 + Rate))."
  },
  {
    question: "What is the difference between CGST, SGST, and IGST?",
    answer: "CGST (Central GST) and SGST (State GST) apply to intra-state sales within the same state and are split equally 50/50. IGST (Integrated GST) applies to inter-state sales across state borders."
  },
  {
    question: "What is Input Tax Credit (ITC)?",
    answer: "Input Tax Credit allows registered businesses to deduct the GST paid on purchases from the GST liability due on output sales, preventing double taxation."
  }
];

export default function GSTClient() {
  const [amount, setAmount] = useState<number>(1000);
  const [rate, setRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [result, setResult] = useState({ taxAmount: 0, totalAmount: 0, baseAmount: 0 });

  useEffect(() => {
    setResult(calculateTax(amount, rate, isInclusive));
  }, [amount, rate, isInclusive]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2 
    }).format(val);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)] pb-16 max-[900px]:pb-32">
        <header className="px-6 pb-4 pt-6 text-center md:pb-6 md:pt-8">
          <div className="container">
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">GST Calculator Online India 2026</h1>
            <p className="mx-auto max-w-[600px] text-[0.95rem] leading-[1.5] text-[var(--text-secondary)] sm:text-[1.1rem]">GST is a percentage of taxable value. An exclusive price adds tax on top, while an inclusive price already contains tax. The split shows CGST and SGST for intra-state supply, or IGST for inter-state supply.</p>
            <div className="mx-auto mt-3 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-2 text-left text-[0.75rem] leading-5 text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> This calculator provides <strong>approximate GST computations</strong> for general reference. Actual GST rates vary by product/service (HSN/SAC code). This tool is for <strong>assumption &amp; planning purposes only</strong>. Always verify with the official GST portal or a CA before filing.
            </div>
          </div>
        </header>

        <section className="container pb-12 pt-4">
          <div className="mx-auto grid max-w-[1000px] grid-cols-[1fr] gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:items-start">
            <div className="flex flex-col gap-6">
              <Card className="!p-5 sm:!p-8">
                <div className="mb-6 flex rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-1">
                  <button 
                    className={`flex-1 rounded-[calc(var(--radius-md)-4px)] px-3 py-2 text-[0.85rem] font-bold transition-all sm:text-[0.95rem] ${!isInclusive ? 'bg-white text-[#1e293b]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => setIsInclusive(false)}
                  >
                    Tax Exclusive (Add Tax)
                  </button>
                  <button 
                    className={`flex-1 rounded-[calc(var(--radius-md)-4px)] px-3 py-2 text-[0.85rem] font-bold transition-all sm:text-[0.95rem] ${isInclusive ? 'bg-white text-[#1e293b]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => setIsInclusive(true)}
                  >
                    Tax Inclusive (Remove Tax)
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  <Input 
                    label={isInclusive ? "Total Amount (Incl. Tax)" : "Amount (Excl. Tax)"}
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    prefix="₹"
                  />
                  <div className="flex flex-col gap-3">
                    <Input 
                      label="GST Rate (%)" 
                      type="number" 
                      value={rate} 
                      onChange={(e) => setRate(Number(e.target.value))}
                      suffix="%"
                    />
                    <div className="flex flex-wrap gap-2">
                      {TAX_SLABS.map(s => (
                        <button key={s} className="cursor-pointer rounded-full border border-[var(--border)] bg-transparent px-3 py-1.5 text-[0.8rem] font-bold text-[var(--text-secondary)] transition-colors hover:border-[#3b82f6] hover:text-[#3b82f6]" onClick={() => setRate(s)}>
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Inter-State Toggle */}
                <div className="mb-6 flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-3 text-[0.9rem] text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      checked={isInterState}
                      onChange={(e) => setIsInterState(e.target.checked)}
                      className="size-[18px] accent-primary"
                    />
                    <span>Inter-State Supply (IGST instead of CGST+SGST)</span>
                  </label>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-md)] bg-[rgba(245,158,11,0.1)] p-4 text-[#d97706]">
                  <AlertTriangle size={16} className="mt-1 shrink-0" />
                  <p className="m-0 text-[0.85rem] leading-[1.5]">
                    <strong>Disclaimer:</strong> This tool provides estimated values for informational purposes only. Tax laws vary by jurisdiction. Please consult a qualified tax professional before filing.
                  </p>
                </div>
              </Card>

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-5 sm:p-8">
                <h3 className="mb-5 text-[1.1rem] font-bold text-[var(--text-primary)]">Calculation Breakdown</h3>
                <div className="mb-3 flex justify-between text-[0.95rem] text-[var(--text-secondary)]">
                  <span>Net Amount (Base Price)</span>
                  <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(result.baseAmount)}</span>
                </div>

                {isInterState ? (
                  <div className="mb-3 flex justify-between text-[0.95rem] text-[var(--text-secondary)]">
                    <span>IGST ({rate}%)</span>
                    <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(result.taxAmount)}</span>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex justify-between text-[0.95rem] text-[var(--text-secondary)]">
                      <span>CGST ({rate / 2}%)</span>
                      <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(result.taxAmount / 2)}</span>
                    </div>
                    <div className="mb-3 flex justify-between text-[0.95rem] text-[var(--text-secondary)]">
                      <span>SGST/UTGST ({rate / 2}%)</span>
                      <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(result.taxAmount / 2)}</span>
                    </div>
                  </>
                )}

                <div className="my-4 h-px w-full bg-[var(--border)]" />
                <div className="flex justify-between text-[1.1rem] font-black text-[#1e293b]">
                  <span>Total Payable</span>
                  <span>{formatCurrency(result.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-6">
              <Card className="flex flex-col items-center border-[#3b82f6] bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] p-6 text-center sm:p-8">
                <h2 className="mb-2 text-[0.9rem] font-bold uppercase tracking-[0.05em] text-[var(--text-secondary)]">{isInclusive ? "Total Tax Included" : "Grand Total Amount"}</h2>
                <div className="my-4 text-[clamp(2.5rem,5vw,3.5rem)] font-black leading-none tracking-tight text-[#1e293b]">
                  {formatCurrency(isInclusive ? result.taxAmount : result.totalAmount)}
                </div>
                <div className="mb-8 mt-4 flex w-full flex-col gap-3 text-left">
                  <div className="flex items-center gap-2 text-[0.9rem] font-medium text-[var(--text-secondary)]"><CheckCircle2 size={16} className="text-[#10b981]" /> Exclusive or inclusive mode</div>
                  <div className="flex items-center gap-2 text-[0.9rem] font-medium text-[var(--text-secondary)]"><CheckCircle2 size={16} className="text-[#10b981]" /> CGST, SGST, or IGST split</div>
                  <div className="flex items-center gap-2 text-[0.9rem] font-medium text-[var(--text-secondary)]"><CheckCircle2 size={16} className="text-[#10b981]" /> Invoice arithmetic only</div>
                </div>
                <Button 
                  fullWidth 
                  className="h-14 text-[1.05rem] font-bold"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 size-4" />
                  Print this calculation
                </Button>
              </Card>

              <div className="flex items-start gap-4 rounded-[var(--radius-md)] bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800"><Info size={20} /></div>
                <p className="m-0 text-[0.85rem] leading-[1.6] text-[var(--text-secondary)]">
                  GST on an invoice is the rate times the taxable value. An inter-state supply uses IGST. An intra-state supply splits the same rate into equal CGST and SGST amounts.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[1000px]">
            <FinancialDisclaimer />
          </div>
        </section>

        {/* Tax & GST Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#fff7ed]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#9a3412] flex items-center gap-2">
              <ShieldCheck className="text-[#ea580c]" /> What this GST page calculates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Two invoice modes</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                  <li><strong>Exclusive:</strong> Tax is amount × rate / 100. ₹1,000 at 18% is ₹180 of tax and a ₹1,180 total.</li>
                  <li><strong>Inclusive:</strong> Base is total / (1 + rate / 100). Tax is total minus that base.</li>
                  <li><strong>Intra-state split:</strong> The same ₹180 is shown as ₹90 CGST and ₹90 SGST.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Not a filing tool</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                  <li><strong>No registration test:</strong> The page does not apply a turnover threshold or an e-commerce rule.</li>
                  <li><strong>No composition scheme:</strong> It does not switch to a flat 1% or 6% rate.</li>
                  <li><strong>No ITC or reverse charge:</strong> The result is the invoice arithmetic only.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">How the two GST modes differ</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Exclusive adds the rate on top of the amount. Inclusive extracts tax already included in the total.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Must-Know Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>CGST + SGST:</strong> Intra-state supply. Rate is split equally (e.g., 18% = 9% CGST + 9% SGST).</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>IGST:</strong> Inter-state supply. Full rate is charged as IGST.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>HSN/SAC:</strong> This page does not look up a code or a penalty.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Input tax credit:</strong> The result is not reduced by credit from another invoice.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Clock size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">What is not calculated</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Return dates:</strong> GSTR-1, GSTR-3B, and GSTR-9 due dates are not shown.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Late fees:</strong> The page does not add a daily fee or 18% interest.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Turnover tests:</strong> A ₹5 crore audit or e-invoice rule is not applied.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Print:</strong> The button calls window.print(). It does not file a return.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Limits of the result</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">•</span><span><strong>One rate:</strong> The selected percent applies to the whole amount.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">•</span><span><strong>Equal split:</strong> Intra-state CGST and SGST are each half of the tax.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">•</span><span><strong>No cess:</strong> A compensation cess is not added.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">•</span><span><strong>Checkbox only:</strong> The inter-state box chooses IGST or an equal CGST and SGST split. It does not look up a place of supply.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">•</span><span><strong>Planning figure:</strong> The numbers are not a GST return.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="gst-calculator" categoryId="finance" />

        <SEOSection 
          title="GST inclusive and exclusive calculation"
          description={`GST is a percentage of taxable value. An exclusive price adds the tax on top. An inclusive price already contains the tax. An inter-state supply uses IGST. An intra-state supply splits the same rate into CGST and SGST.

Exclusive tax is amount × rate ÷ 100. Inclusive tax removes the tax already inside the total: base = total ÷ (1 + rate ÷ 100), and tax = total − base. A ₹1,000 amount at 18% exclusive is ₹180 of tax and a ₹1,180 total. The same ₹1,180 marked inclusive is a ₹1,000 base and ₹180 of tax. Intra-state supply splits that ₹180 into ₹90 CGST and ₹90 SGST. Inter-state supply shows the ₹180 as IGST.

The rate buttons are 5%, 12%, 18%, and 28%. Any other rate can be typed. The page does not apply reverse charge, input tax credit, or a state-specific cess.`}
          howToUse={[
            "Choose Tax Exclusive to add tax to a base amount, or Tax Inclusive to remove tax from a total.",
            "Enter the amount in rupees.",
            "Choose 5%, 12%, 18%, or 28%, or type another rate.",
            "Leave the inter-state box unchecked for an equal CGST and SGST split. Check it to show the whole tax as IGST.",
            "Read the base, the tax, and the total.",
            "Print this calculation opens the browser print dialog for the figures on the page."
          ]}
          benefits={[
            "Exclusive and inclusive amounts use the two formulas above.",
            "CGST and SGST are each half of the tax. IGST is the full tax.",
            "A custom rate is accepted in addition to the four preset buttons.",
            "Print this calculation opens the browser print dialog.",
            "Reverse charge and input tax credit are not calculated."
          ]}
        />
        <FAQSchema faqs={GST_FAQS} />
      <Footer />
    </div>
    </>
  );
}
