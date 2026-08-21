'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Download, FileJson, FileText, Loader2, ShieldCheck, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';
import { form16ToComputation, parseForm16Text, parseIncomeJson, type NormalizedForm16, type TaxComputation } from '@/lib/tax-document-parser';

type Mode = 'income' | 'pdf' | 'form16';

const GENERIC_EXAMPLE = `{
  "assessmentYear": "2026-27",
  "taxpayer": { "name": "Asha Sharma", "pan": "ABCDE1234F" },
  "income": { "salary": 1125000, "houseProperty": 180000, "otherSources": 45000 },
  "deductions": { "section80C": 150000, "section80D": 25000 },
  "taxes": { "tds": 85000 }
}`;

const FORM16_EXAMPLE = `FORM NO. 16
Assessment Year: 2026-27
Name of the Employee: Asha Sharma
PAN of the Deductee: ABCDE1234F
Name and address of the Employer: Example Technologies Pvt Ltd
TAN of the Deductor: DELA12345B
Gross Salary: 1200000
Standard deduction under section 16(ia): 75000
Income chargeable under the head Salaries: 1125000
Section 80C: 150000
Section 80D: 25000
Total amount deductible under Chapter VI-A: 175000
Total Income: 950000
Tax on total income: 40000
Health and education cess: 1600
Net tax payable: 41600
Total tax deducted: 41600`;

const modeCopy = {
  income: { title: 'Income Computation from JSON', description: 'Reads official ITR-1, ITR-2, ITR-3 and ITR-4 summary fields or the documented generic format. Reported totals take priority, preventing duplicate schedule totals.', input: 'Income or ITR JSON', action: 'Read JSON accurately' },
  pdf: { title: 'ITR JSON to Computation PDF', description: 'Maps official ITR summary and tax-computation fields into a readable PDF without silently recalculating or changing reported return values.', input: 'Official ITR JSON', action: 'Create computation preview' },
  form16: { title: 'Form 16 to JSON Converter', description: 'Extracts a searchable Form 16 PDF or pasted text into structured employee, employer, salary, Chapter VI-A and tax fields.', input: 'Form 16 PDF or text', action: 'Extract Form 16 data' },
} as const;

function inr(value: number | null) {
  return value === null ? 'Not found' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}
function pdfMoney(value: number | null) { return value === null ? 'Not available' : `INR ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`; }
function maskPan(pan?: string) { return pan && pan.length >= 10 ? `${pan.slice(0, 2)}***${pan.slice(-2)}` : pan; }

export default function TaxDocumentClient({ mode }: { mode: Mode }) {
  const copy = modeCopy[mode];
  const [text, setText] = useState(mode === 'form16' ? FORM16_EXAMPLE : GENERIC_EXAMPLE);
  const [computation, setComputation] = useState<TaxComputation | null>(null);
  const [form16, setForm16] = useState<NormalizedForm16 | null>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isReading, setIsReading] = useState(false);
  const normalizedOutput = useMemo(() => mode === 'form16' ? form16 : computation, [mode, form16, computation]);

  async function readFile(file: File) {
    setError(''); setComputation(null); setForm16(null); setFileName(file.name); setIsReading(true);
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        if (mode !== 'form16') throw new Error('This tool expects an ITR JSON file. Use Form 16 to JSON for a Form 16 PDF.');
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        if (pdf.numPages > 20) throw new Error('Form 16 extraction supports up to 20 pages.');
        const pages: string[] = [];
        for (let number = 1; number <= pdf.numPages; number += 1) {
          const page = await pdf.getPage(number);
          const content = await page.getTextContent();
          pages.push(content.items.map(item => 'str' in item ? item.str : '').join('\n'));
          page.cleanup();
        }
        setText(pages.join('\n'));
      } else setText(await file.text());
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The file could not be read.'); }
    finally { setIsReading(false); }
  }

  function processInput() {
    setError(''); setComputation(null); setForm16(null);
    try {
      if (mode === 'form16') {
        const parsed = parseForm16Text(text);
        setForm16(parsed); setComputation(form16ToComputation(parsed));
      } else setComputation(parseIncomeJson(JSON.parse(text)));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The input could not be converted.'); }
  }

  function saveJson() {
    if (!normalizedOutput) return;
    const blob = new Blob([JSON.stringify(normalizedOutput, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = mode === 'form16' ? 'form-16-normalized.json' : 'income-tax-computation.json';
    link.click(); URL.revokeObjectURL(link.href);
  }

  function savePdf() {
    if (!computation) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' }); const left = 18; let y = 18;
    const write = (value: string, size = 10, bold = false, gap = 6) => { doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); const lines = doc.splitTextToSize(value, 174); if (y + lines.length * gap > 282) { doc.addPage(); y = 18; } doc.text(lines, left, y); y += lines.length * gap; };
    const row = (label: string, value: string) => { if (y > 280) { doc.addPage(); y = 18; } doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text(label, left + 3, y); doc.setFont('helvetica', 'bold'); doc.text(value, 192, y, { align: 'right' }); y += 7; };
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 38, 'F'); doc.setTextColor(255, 255, 255); y = 17;
    write('INCOME TAX COMPUTATION', 18, true, 7); write(`${computation.sourceFormat} | Assessment Year ${computation.assessmentYear ?? 'not available'}`, 9);
    doc.setTextColor(15, 23, 42); y = 48; write('Taxpayer', 12, true); write(`${computation.taxpayer.name ?? 'Name not available'}${computation.taxpayer.pan ? ` | PAN ${maskPan(computation.taxpayer.pan)}` : ''}`, 10); y += 3;
    write('Computation summary', 12, true); row('Gross total income', pdfMoney(computation.summary.grossTotalIncome)); row('Chapter VI-A deductions', pdfMoney(computation.summary.totalDeductions)); row('Total income', pdfMoney(computation.summary.totalIncome)); row('Tax and interest liability', pdfMoney(computation.summary.totalTaxLiability)); row('Taxes paid', pdfMoney(computation.summary.totalTaxesPaid)); row('Balance payable', pdfMoney(computation.summary.balancePayable)); row('Refund due', pdfMoney(computation.summary.refundDue)); y += 4;
    for (const [heading, lines] of [['Income details', computation.income], ['Deduction details', computation.deductions], ['Tax details', computation.taxes]] as const) { if (!lines.length) continue; write(heading, 12, true); lines.forEach(line => row(line.label, pdfMoney(line.amount))); y += 3; }
    if (computation.warnings.length) { write('Validation notes', 12, true); computation.warnings.forEach(warning => write(`- ${warning}`, 9, false, 5)); }
    y += 3; write('Working summary only. Verify against the official ITR/Form 16 and professional advice before filing.', 8);
    doc.save('income-tax-computation.pdf');
  }

  const summary = computation?.summary;
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        {/* Standard Clean Hero Header */}
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                Local Tax Document Workspace
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              {copy.title}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              {copy.description}
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-16 pt-2">
          <div className="grid gap-6 lg:grid-cols-[1.04fr_.96fr] items-start">
            {/* Left Card: Input */}
            <Card className="p-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900 px-5 py-4">
                <div>
                  <p className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{copy.input}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {fileName || (mode === 'form16' ? 'Searchable PDF or pasted text' : 'UTF-8 JSON object')}
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition">
                  <Upload size={14} /> Choose file
                  <input
                    className="hidden"
                    type="file"
                    accept={mode === 'form16' ? '.pdf,.txt,application/pdf,text/plain' : '.json,application/json'}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void readFile(file);
                    }}
                  />
                </label>
              </div>

              <div className="relative p-4">
                <textarea
                  aria-label={copy.input}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  spellCheck={false}
                  className="min-h-[420px] w-full resize-y rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-600 transition"
                />
                {isReading && (
                  <div className="absolute inset-4 flex items-center justify-center rounded-xl bg-zinc-950/80 text-white backdrop-blur-xs text-xs font-bold">
                    <Loader2 className="mr-2 animate-spin h-4 w-4" /> Reading PDF text locally...
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900 p-4">
                <Button onClick={processInput} disabled={isReading} size="sm">
                  {copy.action}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setText(mode === 'form16' ? FORM16_EXAMPLE : GENERIC_EXAMPLE);
                    setComputation(null);
                    setForm16(null);
                    setError('');
                    setFileName('');
                  }}
                >
                  Reset Example
                </Button>
                {error && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                    <AlertTriangle size={14} /> {error}
                  </div>
                )}
              </div>
            </Card>

            {/* Right Card: Result */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Normalized Result
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-zinc-950 dark:text-zinc-50">
                    {computation ? computation.sourceFormat : 'Waiting for input'}
                  </h2>
                </div>
                {computation && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 size={13} /> Parsed
                  </span>
                )}
              </div>

              {summary ? (
                <div className="space-y-6">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Metric label="Gross total income" value={summary.grossTotalIncome} />
                    <Metric label="Chapter VI-A deductions" value={summary.totalDeductions} />
                    <Metric label="Total income" value={summary.totalIncome} accent />
                    <Metric label="Tax liability" value={summary.totalTaxLiability} />
                    <Metric label="Taxes paid" value={summary.totalTaxesPaid} />
                    <Metric label={summary.refundDue ? 'Refund due' : 'Balance payable'} value={summary.refundDue ?? summary.balancePayable} />
                  </div>

                  <div className="max-h-60 overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {[...computation.income, ...computation.deductions, ...computation.taxes].map((line, index) => (
                          <tr key={`${line.code}-${line.sourcePath ?? index}`} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                            <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">{line.label}</td>
                            <td className="px-4 py-2.5 text-right font-bold text-zinc-950 dark:text-zinc-50 font-mono">{inr(line.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {computation.warnings.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        Validation Notes
                      </p>
                      <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        {computation.warnings.map((warning) => (
                          <li key={warning} className="flex gap-2">
                            <AlertTriangle className="mt-0.5 shrink-0" size={13} />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <Button onClick={saveJson} size="sm">
                      <Download size={14} className="mr-1.5" /> Download JSON
                    </Button>
                    <Button variant="outline" onClick={savePdf} size="sm">
                      <FileText size={14} className="mr-1.5" /> Download PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center text-zinc-400">
                  <FileJson size={44} className="mb-3 text-zinc-300 dark:text-zinc-700" />
                  <p className="max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    The output shows mapped summary fields only. Repeated schedule values are never added together.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {normalizedOutput && (
            <Card className="mt-6 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileJson className="text-blue-600 dark:text-blue-400" size={18} />
                <h2 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">Output JSON Structure</h2>
              </div>
              <pre className="max-h-72 overflow-auto rounded-xl bg-zinc-900 dark:bg-zinc-950 p-4 text-xs font-mono leading-relaxed text-zinc-200 border border-zinc-800">
                {JSON.stringify(normalizedOutput, null, 2)}
              </pre>
            </Card>
          )}

          <Card className="mt-8 p-6 space-y-4">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Related Tax Document Tools</h2>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-zinc-800 transition hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800" href="/finance/income-computation-from-json">
                Income Computation from JSON
              </Link>
              <Link className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-zinc-800 transition hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800" href="/finance/itr-json-to-computation-pdf">
                ITR JSON to Computation PDF
              </Link>
              <Link className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-zinc-800 transition hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800" href="/finance/form-16-to-json">
                Form 16 to JSON Converter
              </Link>
            </div>
            <p className="max-w-4xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Official ITR values are read from return summary and tax-computation sections. Generic JSON receives arithmetic totals only. Form 16 extraction runs completely client-side in browser memory.
            </p>
          </Card>
        </main>
      </div>

      <Footer />
    </div>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: number | null; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${accent ? 'bg-blue-600 text-white border-blue-700 dark:bg-blue-600 dark:border-blue-500' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-wider ${accent ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {label}
      </p>
      <p className="mt-1 text-lg font-bold font-mono">
        {inr(value)}
      </p>
    </div>
  );
}
