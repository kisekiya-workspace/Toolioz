'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Download, FileJson, FileText, Loader2, ShieldCheck, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
    <main className="min-h-screen bg-[#f6f4ee] px-4 py-12 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="relative mb-8 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-xl md:px-10">
          <div className="absolute right-[-4rem] top-[-5rem] h-56 w-56 rounded-full border-[36px] border-teal-400/10" />
          <div className="relative max-w-4xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-300"><ShieldCheck size={14} /> Local tax document workspace</div><h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">{copy.title}</h1><p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">{copy.description}</p></div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[1.04fr_.96fr]">
          <Card className="overflow-hidden !rounded-[1.5rem] !border-slate-300 !p-0 shadow-[0_18px_60px_-35px_rgba(15,23,42,.45)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4"><div><p className="font-black">{copy.input}</p><p className="text-xs text-slate-500">{fileName || (mode === 'form16' ? 'Searchable PDF or pasted text' : 'UTF-8 JSON object')}</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"><Upload size={16} /> Choose file<input className="hidden" type="file" accept={mode === 'form16' ? '.pdf,.txt,application/pdf,text/plain' : '.json,application/json'} onChange={event => { const file = event.target.files?.[0]; if (file) void readFile(file); }} /></label></div>
            <div className="relative"><textarea aria-label={copy.input} value={text} onChange={event => setText(event.target.value)} spellCheck={false} className="min-h-[470px] w-full resize-y border-0 bg-[#07130f] p-5 font-mono text-[13px] leading-6 text-emerald-200 outline-none" />{isReading && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-white"><Loader2 className="mr-2 animate-spin" /> Reading PDF text locally...</div>}</div>
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white p-5"><Button onClick={processInput} disabled={isReading}>{copy.action}</Button><Button variant="secondary" onClick={() => { setText(mode === 'form16' ? FORM16_EXAMPLE : GENERIC_EXAMPLE); setComputation(null); setForm16(null); setError(''); setFileName(''); }}>Reset example</Button>{error && <div className="flex items-center gap-2 text-sm font-semibold text-red-700"><AlertTriangle size={16} /> {error}</div>}</div>
          </Card>
          <Card className="!rounded-[1.5rem] !border-slate-300 !p-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,.45)] md:!p-8">
            <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-teal-700">Normalized result</p><h2 className="mt-1 text-2xl font-black">{computation ? computation.sourceFormat : 'Waiting for input'}</h2></div>{computation && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"><CheckCircle2 size={14} /> Parsed</span>}</div>
            {summary ? <><div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2"><Metric label="Gross total income" value={summary.grossTotalIncome} /><Metric label="Chapter VI-A deductions" value={summary.totalDeductions} /><Metric label="Total income" value={summary.totalIncome} accent /><Metric label="Tax liability" value={summary.totalTaxLiability} /><Metric label="Taxes paid" value={summary.totalTaxesPaid} /><Metric label={summary.refundDue ? 'Refund due' : 'Balance payable'} value={summary.refundDue ?? summary.balancePayable} /></div><div className="mt-6 max-h-64 overflow-auto rounded-xl border border-slate-200"><table className="w-full text-sm"><tbody>{[...computation.income, ...computation.deductions, ...computation.taxes].map((line, index) => <tr key={`${line.code}-${line.sourcePath ?? index}`} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 text-slate-600">{line.label}</td><td className="px-4 py-3 text-right font-bold">{inr(line.amount)}</td></tr>)}</tbody></table></div>{computation.warnings.length > 0 && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-amber-900">Validation notes</p><ul className="space-y-2 text-sm leading-5 text-amber-950">{computation.warnings.map(warning => <li key={warning} className="flex gap-2"><AlertTriangle className="mt-0.5 shrink-0" size={15} />{warning}</li>)}</ul></div>}<div className="mt-6 flex flex-wrap gap-3"><Button onClick={saveJson}><Download size={16} /> Download normalized JSON</Button><Button variant="outline" onClick={savePdf}><FileText size={16} /> Download computation PDF</Button></div></> : <div className="flex min-h-[430px] flex-col items-center justify-center text-center text-slate-500"><FileJson size={48} className="mb-4 text-slate-300" /><p className="max-w-sm leading-6">The output shows mapped summary fields only. Repeated schedule values are never added together.</p></div>}
          </Card>
        </div>
        {normalizedOutput && <section className="mt-6 rounded-2xl border border-slate-300 bg-white p-6"><div className="mb-4 flex items-center gap-2"><FileJson className="text-teal-700" size={20} /><h2 className="font-black">Output JSON format</h2></div><pre className="max-h-80 overflow-auto rounded-xl bg-slate-950 p-5 text-xs leading-5 text-emerald-200">{JSON.stringify(normalizedOutput, null, 2)}</pre></section>}
        <section className="mt-8 rounded-2xl border border-slate-300 bg-white p-6"><h2 className="text-xl font-black">Related tax document tools</h2><div className="mt-4 flex flex-wrap gap-3 text-sm font-bold"><Link className="rounded-full bg-teal-50 px-4 py-2 text-teal-900" href="/finance/income-computation-from-json">Income computation from JSON</Link><Link className="rounded-full bg-amber-50 px-4 py-2 text-amber-900" href="/finance/itr-json-to-computation-pdf">ITR JSON to computation PDF</Link><Link className="rounded-full bg-sky-50 px-4 py-2 text-sky-900" href="/finance/form-16-to-json">Form 16 to JSON converter</Link></div><p className="mt-5 max-w-4xl text-sm leading-6 text-slate-600">Official ITR values are read from return summary and tax-computation sections. Generic JSON receives arithmetic totals only. Form 16 extraction requires verification because certificate layouts and PDF text order vary.</p></section>
      </div>
    </main>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: number | null; accent?: boolean }) {
  return <div className={accent ? 'bg-teal-950 p-4 text-white' : 'bg-white p-4'}><p className={accent ? 'text-xs font-bold uppercase text-teal-200' : 'text-xs font-bold uppercase text-slate-500'}>{label}</p><p className="mt-2 text-xl font-black">{inr(value)}</p></div>;
}
