import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import TaxDocumentClient from '@/components/tax-documents/TaxDocumentClient';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { buildCalculatorJsonLd } from '@/lib/seo';
export const metadata: Metadata = { title: 'ITR JSON to Computation PDF | Tax Summary | Toolioz', description: 'Converts ITR JSON to an income tax computation PDF with income, deductions, and taxable income. Processing stays in the browser.', keywords: 'itr json to computation pdf, itr json income tax computation, json to tax computation pdf, itr json converter pdf', alternates: { canonical: 'https://toolioz.com/finance/itr-json-to-computation-pdf' } };
const faqs = [{ question: 'How is an ITR JSON converted to a computation PDF?', answer: 'Load the ITR JSON, generate the computation preview, and select Download PDF. The PDF lists detected income and deduction fields with an estimated taxable-income summary.' }, { question: 'Does the generated PDF replace an official ITR acknowledgement?', answer: 'No. The PDF is a readable working summary and does not replace an official return, acknowledgement, tax audit report, or professional tax computation.' }];
export default function Page() { return <><JSONLD data={buildCalculatorJsonLd({ name: 'ITR JSON to Computation PDF', description: 'Convert ITR JSON into a printable income tax computation PDF.', path: '/finance/itr-json-to-computation-pdf', applicationCategory: 'FinanceApplication' })} /><TaxDocumentClient mode="pdf" /><FAQSchema faqs={faqs} /></>; }
