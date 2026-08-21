'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateIncomeTax, Country, FilingStatus } from '@/lib/formulas';
import { Wallet, Info, AlertTriangle, ShieldCheck, PieChart, Download, BookOpen, Scale, Lightbulb } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { FinancialDisclaimer } from '@/components/ui/FinancialDisclaimer';

const INCOME_TAX_FAQS = [
  {
    question: "What is the difference between New Tax Regime and Old Tax Regime in FY 2026-27?",
    answer: "The New Tax Regime features lower tax slab rates but removes most exemptions (80C, 80D, HRA). The Old Tax Regime allows all traditional tax-saving deductions under Section 80C up to ₹1.5 Lakh, 80D medical insurance, and HRA."
  },
  {
    question: "What is the Standard Deduction for salaried employees in FY 2025-26 and 2026-27?",
    answer: "The Standard Deduction under the New Tax Regime is ₹75,000 for salaried employees and pensioners. Under the Old Tax Regime, it remains ₹50,000."
  },
  {
    question: "Is income up to ₹7 Lakh or ₹12 Lakh tax-free under Section 87A?",
    answer: "Under Section 87A of the New Tax Regime, full tax rebate is available for taxable income up to ₹7 Lakhs (making effective tax zero up to ₹7.75 Lakhs including standard deduction). In proposed budget provisions for 2026-27, rebate limits for low/middle income brackets extend up to ₹12 Lakhs effective tax relief."
  },
  {
    question: "Can I switch between New and Old Tax Regime every year?",
    answer: "Salaried individuals without business/professional income can switch between New and Old tax regimes every financial year at the time of filing their ITR."
  }
];

import { FAQSchema } from '@/components/ui/FAQSchema';
const COUNTRIES: { id: Country; name: string; currency: string; locale: string }[] = [
  { id: 'IN', name: 'India (FY 2026-27)', currency: 'INR', locale: 'en-IN' },
  { id: 'US', name: 'USA', currency: 'USD', locale: 'en-US' },
  { id: 'UK', name: 'UK', currency: 'GBP', locale: 'en-GB' },
];

const YEARS = [2024, 2025, 2026] as const;

export default function IncomeTaxClient() {
  const [country, setCountry] = useState<Country>('IN');
  const [year, setYear] = useState<number>(2026);
  const [status, setStatus] = useState<FilingStatus>('single');
  const [income, setIncome] = useState<number>(1200000);
  const [deductions, setDeductions] = useState<number>(75000);
  const [mode, setMode] = useState<'yearly' | 'monthly'>('yearly');
  
  const [results, setResults] = useState({
    tax: 0,
    taxable: 0,
    social: 0,
    takeHome: 0,
    effectiveRate: 0,
  });

  const [isDownloading, setIsDownloading] = useState(false);

  // Persistence
  useEffect(() => {
    const savedCountry = localStorage.getItem('toolioz_tax_country');
    const savedYear = localStorage.getItem('toolioz_tax_year');
    const savedStatus = localStorage.getItem('toolioz_tax_status');
    const savedIncome = localStorage.getItem('toolioz_tax_income');
    const savedDeductions = localStorage.getItem('toolioz_tax_deductions');

    if (savedCountry) setCountry(savedCountry as Country);
    if (savedYear) setYear(Number(savedYear));
    if (savedStatus) setStatus(savedStatus as FilingStatus);
    if (savedIncome) setIncome(Number(savedIncome));
    if (savedDeductions) setDeductions(Number(savedDeductions));
    else if (country === 'IN') setDeductions(75000); // Standard deduction default
  }, []);

  useEffect(() => {
    localStorage.setItem('toolioz_tax_country', country);
    localStorage.setItem('toolioz_tax_year', year.toString());
    localStorage.setItem('toolioz_tax_status', status);
    localStorage.setItem('toolioz_tax_income', income.toString());
    localStorage.setItem('toolioz_tax_deductions', deductions.toString());

    const res = calculateIncomeTax(income, deductions, country, status, 'new', year);
    setResults({
      tax: res.taxAmount,
      taxable: res.taxableIncome,
      social: res.socialSecurity || 0,
      takeHome: res.takeHome,
      effectiveRate: res.effectiveRate
    });
  }, [income, deductions, country, year, status]);

  const selectedCountry = COUNTRIES.find(c => c.id === country)!;

  const displayVal = (val: number) => mode === 'monthly' ? val / 12 : val;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(selectedCountry.locale, { 
      style: 'currency', 
      currency: selectedCountry.currency,
      maximumFractionDigits: 0
    }).format(displayVal(val));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 800);
  };

  const taxPercent = (results.tax + results.social) / (income || 1) * 100;

  return (
    <>
      <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 pb-16">
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                Tax Optimization Engine
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              Income Tax Calculator 2026-27
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Estimate your income tax under the New Regime (default from FY 2023-24). Supports India, USA & UK.
            </p>
          </div>
        </header>

        <section className="container pb-12 pt-2">
          <div className="mx-auto mb-8 flex max-w-[280px] rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-1 border border-zinc-200 dark:border-zinc-700">
            <button 
              className={`flex-1 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${mode === 'yearly' ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'}`}
              onClick={() => setMode('yearly')}
            >Yearly View</button>
            <button 
              className={`flex-1 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${mode === 'monthly' ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'}`}
              onClick={() => setMode('monthly')}
            >Monthly View</button>
          </div>

          <div className="mx-auto grid max-w-[1000px] grid-cols-[1fr] gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:items-start">
            <div className="flex flex-col gap-6">
              <Card className="!p-5 sm:!p-8">
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Country</label>
                    <select className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--primary)]" value={country} onChange={(e) => setCountry(e.target.value as Country)}>
                      {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Filing Status</label>
                    <select className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--primary)]" value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)}>
                      <option value="single">Single Individual</option>
                      {country === 'IN' && <option value="senior">Senior Citizen (60+)</option>}
                      {country === 'US' && <option value="married">Married Filing Jointly</option>}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Tax Year</label>
                  <select className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--primary)]" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div className="my-6 h-px w-full bg-[var(--border)]" />

                <h3 className="mb-5 text-[1.1rem] font-bold text-[var(--text-primary)]">Earnings & Data</h3>
                <div className="flex flex-col gap-6">
                  <Input 
                    label={`Gross ${mode === 'monthly' ? 'Monthly' : 'Annual'} Income`}
                    type="number" 
                    value={mode === 'monthly' ? income / 12 : income} 
                    onChange={(e) => setIncome(mode === 'monthly' ? Number(e.target.value) * 12 : Number(e.target.value))}
                    prefix={selectedCountry.currency === 'INR' ? '₹' : selectedCountry.currency === 'USD' ? '$' : '£'}
                  />
                  <Input 
                    label={country === 'IN' ? 'Deductions (Standard Deduction ₹75,000 included by default)' : 'Deductions / Exemptions'}
                    type="number" 
                    value={mode === 'monthly' ? deductions / 12 : deductions} 
                    onChange={(e) => setDeductions(mode === 'monthly' ? Number(e.target.value) * 12 : Number(e.target.value))}
                    prefix={selectedCountry.currency === 'INR' ? '₹' : selectedCountry.currency === 'USD' ? '$' : '£'}
                  />
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-md)] bg-[rgba(59,130,246,0.1)] p-4 text-[#2563eb]">
                   <div className="mt-1 flex shrink-0 items-center gap-2 font-bold text-[#1d4ed8]"><Info size={16} /> Tax Optimization Tip</div>
                   <p className="m-0 text-[0.85rem] leading-[1.5]">
                     {country === 'IN' ? 'Under the New Regime, standard deduction has been increased to ₹75,000 for salaried individuals. No other deductions like 80C apply.' : 
                      country === 'US' ? 'Contributing to a 401(k) or IRA can significantly reduce your taxable income and lower your effective tax rate.' :
                      'Pensions are one of the most tax-efficient ways to save in the UK. Any contributions made are deducted from your gross income before tax.'}
                   </p>
                </div>
              </Card>

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-5 sm:p-8">
                <h3 className="mb-5 text-[1.1rem] font-bold text-[var(--text-primary)]">Visual Breakdown</h3>
                <div className="mt-4">
                  <div className="relative mb-4 flex h-6 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                    <div className="h-full bg-[#10b981] transition-all duration-500 ease-out" style={{ width: `${100 - taxPercent}%` }} title="Take Home" />
                    <div className="h-full bg-[#ef4444] transition-all duration-500 ease-out" style={{ width: `${taxPercent}%` }} title="Total Tax" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-[0.85rem] font-medium text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: '#10b981' }} />
                      Take Home: {(100 - taxPercent).toFixed(1)}%
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} />
                      Total Taxes: {taxPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-6">
              <Card className="!p-5 sm:!p-8">
                <div className="mb-6 flex items-start gap-4 rounded-[var(--radius-md)] bg-[#f0fdf4] p-5">
                  <ShieldCheck size={28} className="shrink-0 text-[#16a34a]" />
                  <div>
                    <h3 className="mb-1 text-[0.9rem] font-bold uppercase tracking-[0.05em] text-[#166534]">Net Take-Home Pay</h3>
                    <p className="text-[1.5rem] font-black tracking-tight text-[#14532d]">{formatCurrency(results.takeHome)} <span className="text-[1rem] font-medium opacity-80">/ {mode}</span></p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3">
                  <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4" style={{ gridColumn: '1 / -1' }}>
                    <span className="mb-1 text-[0.85rem] font-semibold text-[var(--text-secondary)]">Total Tax Liability</span>
                    <span className="font-bold text-[var(--text-primary)]" style={{ color: '#ef4444', fontSize: '2rem' }}>{formatCurrency(results.tax + results.social)}</span>
                  </div>
                </div>

                <div className="mb-6 flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-4 text-[0.95rem]">
                   <div className="flex justify-between text-[var(--text-secondary)]">
                     <span>Income Tax</span>
                     <span className="font-bold text-[var(--text-primary)]">{formatCurrency(results.tax)}</span>
                   </div>
                   {results.social > 0 && (
                     <div className="flex justify-between text-[var(--text-secondary)]">
                       <span>{country === 'US' ? 'FICA (Social Security)' : 'National Insurance'}</span>
                       <span className="font-bold text-[var(--text-primary)]">{formatCurrency(results.social)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-[var(--text-secondary)]" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                     <strong className="text-[var(--text-primary)]">Effective Tax Rate</strong>
                     <strong className="text-[var(--text-primary)]">{results.effectiveRate.toFixed(2)}%</strong>
                   </div>
                </div>

                <Button 
                  fullWidth 
                  className="h-12 text-[0.95rem] font-bold" 
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? 'Generating PDF...' : 'Download Full Tax Report'} 
                  {!isDownloading && <Download size={18} style={{ marginLeft: '8px' }} />}
                </Button>

                <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-md)] border p-3" style={{ marginTop: '1.5rem', background: '#fff7ed', borderColor: '#ffedd5' }}>
                  <AlertTriangle size={18} style={{ color: '#ea580c' }} className="shrink-0" />
                  <p style={{ fontSize: '0.75rem', color: '#9a3412', margin: 0 }}>
                    <strong>Disclaimer:</strong> These are <strong>approximate estimates</strong> for FY {year}-{(year + 1).toString().slice(2)} based on publicly available tax rules. Actual tax liability may differ due to surcharges, rebates, employer-specific deductions, state/local taxes, and other factors. This tool is for <strong>assumption &amp; planning purposes only</strong> — not a substitute for professional tax advice.
                  </p>
                </div>
              </Card>

              <div className="mt-4">
                <FinancialDisclaimer />
              </div>

              <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5 mt-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#3b82f6]"><PieChart size={24} /></div>
                <p className="m-0 text-[0.85rem] leading-[1.6] text-[var(--text-secondary)]">{country === 'IN' ? 'The New Regime (default) is optimized for higher incomes with lower compliance overhead.' : 'Always check for local state/city taxes as they are not included in this federal estimation.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Saving Decision Guide Section */}
        <div className="mx-auto mt-12 max-w-[900px]">
          <Card className="!p-8 bg-[#f5f3ff]">
            <h2 className="mb-6 text-[1.4rem] font-bold text-[#4c1d95] flex items-center gap-2">
              <ShieldCheck className="text-[#7c3aed]" /> 💸 New vs Old Regime Decision Guide (2026-27)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#4c1d95]">The Breakeven Rule</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#4c1d95]/80">
                  <li><strong>New Regime:</strong> Best if your total deductions (80C, 80D, HRA, Home Loan Interest) are <strong>below ₹3.75 - 4.25 Lakh</strong>.</li>
                  <li><strong>Standard Deduction:</strong> A flat ₹75,000 deduction is available in the New Regime for salaried employees.</li>
                  <li><strong>Tax Free Limit:</strong> Effectively zero tax for income up to ₹12.75 Lakh in 2026 (including SD).</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-[1.05rem] font-bold text-[#4c1d95]">When to Choose Old?</h3>
                <ul className="flex flex-col gap-3 text-[0.875rem] leading-[1.6] text-[#4c1d95]/80">
                  <li><strong>Home Loan:</strong> If you pay high interest (₹2L+) and principal (₹1.5L), the Old Regime is often superior.</li>
                  <li><strong>HRA:</strong> If you live in a Tier-1 city and pay high rent, the HRA exemption can significantly lower your taxable income.</li>
                  <li><strong>Maximize 80C:</strong> If you already have ₹1.5L in PPF/Insurance, you are halfway to the breakeven point.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-World Tips Section */}
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-[1.8rem] font-black text-[var(--text-primary)]">💼 Income Tax Tips</h2>
            <p className="mt-3 text-[1rem] text-[var(--text-secondary)]">Save more and pay less (legally) with these pro strategies.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Key Terms (India)</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Section 80C (₹1.5L):</strong> PPF, ELSS, NPS, life insurance, home loan principal.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Section 80D:</strong> Medical Insurance — ₹25k for self/family + ₹50k for senior parents.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>HRA Exemption:</strong> Claim exemption on rent paid based on specific calculations.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-purple-500">•</span><span><strong>Section 87A:</strong> New regime income up to ₹12 lakh is effectively tax-free for FY 2025-26.</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Scale size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">New vs Old Regime</h3>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Choose New if:</strong> Total deductions (80C, 80D, HRA, home loan) are below ₹3.75 lakh.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Choose Old if:</strong> You maximize 80C, pay rent, and have a home loan interest deduction.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Salaried with no investments?</strong> New regime is almost always better.</span></li>
                <li className="flex gap-2"><span className="mt-1 shrink-0 text-blue-500">•</span><span><strong>Flexibility:</strong> Salaried can switch every year. Self-employed can only switch once.</span></li>
              </ul>
            </div>

            <div className="col-span-1 rounded-2xl border border-[var(--border)] bg-white p-6 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Pro Tax-Saving Tips</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>NPS (80CCD(1B)):</strong> Additional ₹50,000 deduction on top of 80C.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Harvest LTCG:</strong> Book gains below ₹1.25 lakh tax-free limit each year.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span><strong>Don&apos;t wait until March:</strong> Invest in ELSS and PPF by April for better compounding.</span></li>
                </ul>
                <ul className="flex flex-col gap-3 text-[0.9rem] leading-[1.6] text-[var(--text-secondary)]">
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>File returns on time (July 31). Late penalty is ₹5,000 and you lose interest on refunds.</span></li>
                  <li className="flex gap-2"><span className="mt-1 shrink-0 text-emerald-500">✅</span><span>Keep rent receipts and medical bills organized. Digital copies are accepted.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="income-tax" categoryId="finance" />
        
        <SEOSection 
          title="Income Tax Calculator 2026-27 | New vs Old Regime Analysis"
          description={`Taxation is one of the most complex yet essential aspects of modern citizenship. Whether you are living in India, the United Kingdom, or the United States, understanding your income tax liability is critical for effective financial planning and legal compliance. As we approach fiscal years like 2025 and 2026, many governments are introducing significant changes to tax slabs, rebates, and deduction rules. An income tax calculator is no longer just a simple math tool; it's a strategic guide to navigating these shifts.

For instance, in the Indian context, the introduction of the 'New Tax Regime' as the default option has fundamentally changed how salaried individuals approach their savings. With higher standard deductions (₹75,000 for FY 24-25) and tax-free income up to ₹12 lakh in the proposed 2026 budget (thanks to rebate u/s 87A), many taxpayers are finding that the New Regime offers significant savings without the need for traditional 80C investments. However, for those with existing home loans or high insurance premiums, the 'Old Regime' might still be the superior choice.

In the United States, tax brackets are adjusted annually for inflation to prevent "bracket creep," where taxpayers move into higher brackets despite no real increase in purchasing power. Our tool factors in these 2026 inflation-adjusted thresholds for various filing statuses, including Single and Married Filing Jointly. Similarly, UK residents must navigate the complexities of Personal Allowances, National Insurance contributions, and the tapering of allowances for high earners. Our global tax engine provides the depth and accuracy needed to simulate these scenarios, help you understand your 'Take-Home Pay', and plan your yearly investments for maximum tax efficiency.`}
          howToUse={[
            "Begin by selecting your Country (India, USA, or UK) and the relevant Tax Year (2024-2026).",
            "Choose your Filing Status—this is critical as it determines your baseline exemptions and slab thresholds.",
            "Enter your Total Estimated Gross Income for the period (you can toggle between Monthly and Yearly views).",
            "Input any legally applicable Deductions or Exemptions (e.g., 80C in India, 401k in US, or Pensions in UK).",
            "Review the 'Net Take-Home Pay' to understand exactly what hits your bank account after all taxes and social contributions.",
            "Use the 'Visual Breakdown' chart to see the percentage of your income that goes toward taxes vs. what you keep."
          ]}
          benefits={[
            "Global Versatility: Accurately estimate taxes for multiple major jurisdictions in one unified tool.",
            "Regime Comparison: Instantly see the difference between various tax models (e.g., Old vs. New) to choose the best path.",
            "Future-Proofing: Stay ahead of the curve with pre-configured 2026 budget rules and inflation-adjusted slabs.",
            "Detailed Breakdown: Understand exactly where your money goes, from basic income tax to social security and cess.",
            "Interactive Planning: Use the monthly toggle to align your tax liability with your monthly household budget."
          ]}
        />
        <FAQSchema faqs={INCOME_TAX_FAQS} />
      <Footer />
    </div>
    </>
  );
}
