'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateTax } from '@/lib/formulas';
import { CreditCard, Info, AlertTriangle, CheckCircle2, ShieldCheck, BookOpen, Clock, Lightbulb } from 'lucide-react';
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
        <header className="px-6 py-8 text-center md:py-16">
          <div className="container">
            <h1 className="mb-4 text-[1.75rem] font-extrabold text-[var(--text-primary)] sm:text-[2.5rem]">GST Calculator Online India 2026</h1>
            <p className="mx-auto max-w-[600px] text-[0.95rem] leading-[1.5] text-[var(--text-secondary)] sm:text-[1.1rem]">Calculate GST with CGST/SGST &amp; IGST split for accurate invoicing.</p>
            <div className="mx-auto mt-6 max-w-[700px] rounded-lg border border-[#fbbf24] bg-[#fffbeb] px-4 py-3 text-left text-[0.8rem] leading-[1.6] text-[#92400e]">
              <strong>⚠️ Disclaimer:</strong> This calculator provides <strong>approximate GST computations</strong> for general reference. Actual GST rates vary by product/service (HSN/SAC code). This tool is for <strong>assumption &amp; planning purposes only</strong>. Always verify with the official GST portal or a CA before filing.
            </div>
          </div>
        </header>

        <section className="container section">
          <div className="mx-auto grid max-w-[1000px] grid-cols-[1fr] gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:items-start">
            <div className="flex flex-col gap-6">
              <Card className="!p-5 sm:!p-8">
                <div className="mb-6 flex rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-1">
                  <button 
                    className={`flex-1 rounded-[calc(var(--radius-md)-4px)] px-3 py-2 text-[0.85rem] font-bold transition-all sm:text-[0.95rem] ${!isInclusive ? 'bg-white text-[#1e293b] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    onClick={() => setIsInclusive(false)}
                  >
                    Tax Exclusive (Add Tax)
                  </button>
                  <button 
                    className={`flex-1 rounded-[calc(var(--radius-md)-4px)] px-3 py-2 text-[0.85rem] font-bold transition-all sm:text-[0.95rem] ${isInclusive ? 'bg-white text-[#1e293b] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
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
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
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
                  <div className="flex items-center gap-2 text-[0.9rem] font-medium text-[var(--text-secondary)]"><CheckCircle2 size={16} className="text-[#10b981]" /> Instant precise computation</div>
                  <div className="flex items-center gap-2 text-[0.9rem] font-medium text-[var(--text-secondary)]"><CheckCircle2 size={16} className="text-[#10b981]" /> Dual-mode computation</div>
                  <div className="flex items-center gap-2 text-[0.9rem] font-medium text-[var(--text-secondary)]"><CheckCircle2 size={16} className="text-[#10b981]" /> Error-free formula</div>
                </div>
                <Button 
                  fullWidth 
                  className="h-14 text-[1.05rem] font-bold shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)]"
                  onClick={() => window.print()}
                >
                  Download Tax Invoice
                </Button>
              </Card>

              <div className="flex items-start gap-4 rounded-[var(--radius-md)] bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9]" style={{ color: '#1e293b' }}><Info size={20} /></div>
                <p className="m-0 text-[0.85rem] leading-[1.6] text-[var(--text-secondary)]">
                  Accurate tax calculation is critical for business compliance. Our engine uses standard accounting rounding to ensure your numbers stay consistent with professional software.
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
              <ShieldCheck className="text-[#ea580c]" /> 💸 GST Registration & Filing (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Who Needs to Register?</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                  <li><strong>Turnover Limit:</strong> ₹40 Lakh for goods (₹20 Lakh for services). Special states have a ₹10 Lakh limit.</li>
                  <li><strong>Inter-state Sales:</strong> Compulsory registration if you sell across state lines, regardless of turnover.</li>
                  <li><strong>E-commerce:</strong> Selling on Amazon/Flipkart requires GST registration from Day 1.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#9a3412]">Composition Scheme</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#9a3412]/80">
                  <li><strong>Eligibility:</strong> Businesses with turnover below <strong>₹1.5 Crore</strong> can opt for this to avoid complex filing.</li>
                  <li><strong>Tax Rates:</strong> Pay flat 1% (Manufacturers/Traders) or 6% (Service Providers).</li>
                  <li><strong>Limitation:</strong> You cannot collect GST from customers and cannot claim Input Tax Credit (ITC).</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">🧾 GST Guide for Business Owners</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Master the terms, rules, and tips to ensure 100% compliance.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Must-Know Terms</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>CGST + SGST:</strong> Intra-state supply. Rate is split equally (e.g., 18% = 9% CGST + 9% SGST).</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>IGST:</strong> Inter-state supply. Full rate is charged as IGST.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>HSN/SAC Code:</strong> Determines the exact GST rate. Wrong code means penalties.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-orange-500">•</span><span><strong>Input Tax Credit (ITC):</strong> Claim credit for GST paid, assuming your supplier files returns.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Clock size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Deadlines & Penalties</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>GSTR-1 (Sales):</strong> Due by 11th of next month. Late fee: ₹50/day.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>GSTR-3B:</strong> Due by 20th of next month. Interest at 18% p.a. on unpaid tax.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>Annual Return (GSTR-9):</strong> Due by Dec 31. Audit needed if turnover &gt; ₹5 crore.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-red-500">•</span><span><strong>E-Invoice:</strong> Mandatory for turnover above ₹5 crore via IRP portal.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Compliance Tips</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span><strong>Composition Scheme:</strong> If turnover &lt; ₹1.5Cr, pay flat 1–6% tax with simpler filing (no ITC).</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span><strong>Reconcile 2A/2B:</strong> Mismatches are the #1 reason for ITC rejection. Always reconcile.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span><strong>Keep Invoices:</strong> Maintain all records for 6 years (GST audit limit).</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span><strong>Freelancers:</strong> Registration needed only if turnover &gt; ₹20L (or ₹10L for NE states).</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-amber-500">✅</span><span><strong>Compliant Software:</strong> Use standard software to reduce manual error risk.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="gst-calculator" categoryId="finance" />

        <SEOSection 
          title="GST Online: Reverse Charge Mechanism & Tax Computation 2026"
          description={`The Goods and Services Tax (GST) is a comprehensive, destination-based tax. Our GST online calculator for India 2026 helps businesses and accountants calculate GST on services India seamlessly, supporting the Reverse Charge Mechanism (RCM) for accurate tax filing and invoice generation.

One of the most common challenges in GST is distinguishing between GST-inclusive and GST-exclusive prices. An inclusive price means the tax is already part of the total amount shown to the consumer, while an exclusive price means the tax will be added on top of the base cost. Our advanced calculator handles both scenarios seamlessly. Whether you are a retailer trying to extract the tax component from your daily sales or a service provider calculating the total billable amount for a client, this tool provides the precision you need.

Beyond just basic calculation, our tool serves as an educational resource to understand the different tax slabs (typically 5%, 12%, 18%, and 28%). Different products and services fall into different categories, and knowing how these rates impact your profit margins is essential for competitive pricing. By using our unified tax engine, you can ensure your business accounting stays robust, minimize the risk of manual errors, and better manage your cash flow for quarterly tax payments.`}
          howToUse={[
            "Select the appropriate mode: 'Tax Exclusive' to add tax to a base price, or 'Tax Inclusive' to find the base price from a total.",
            "Enter the Principal Amount in your local currency.",
            "Choose a standard tax slab (5%, 12%, 18%, 28%) or input a custom percentage rate.",
            "Review the detailed breakdown, including the Net Amount, the GST Amount, and the Final Total.",
            "Verify the calculation against your invoice or purchase receipt for total accuracy.",
            "Use the 'Download Tax Invoice' button to generate a quick summary for your records."
          ]}
          benefits={[
            "Compliance Accuracy: Ensure your tax calculations align with government standards.",
            "Seamless Invoicing: Quickly calculate the tax component for both B2B and B2C transactions.",
            "Error Elimination: Avoid costly manual mistakes in GST filings and accounting books.",
            "Transparency: Clearly understand the tax burden being passed on to the consumer.",
            "Versatility: Suitable for freelancers, small business owners, and large corporations alike."
          ]}
        />
        <FAQSchema faqs={GST_FAQS} />
      <Footer />
    </div>
    </>
  );
}
