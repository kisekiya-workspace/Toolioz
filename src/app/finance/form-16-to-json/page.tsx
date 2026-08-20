import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import TaxDocumentClient from '@/components/tax-documents/TaxDocumentClient';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { buildCalculatorJsonLd } from '@/lib/seo';
export const metadata: Metadata = { title: 'Form 16 to JSON Converter | Extract Tax Details | Toolioz', description: 'Convert copied Form 16 text into structured JSON for income computation and tax workflows. Local browser processing keeps the document private.', keywords: 'form 16 to json converter, convert form 16 into json, form 16 json extractor, form 16 data to json', alternates: { canonical: 'https://toolioz.com/finance/form-16-to-json' } };
const faqs = [{ question: 'How does the Form 16 to JSON converter work?', answer: 'Paste labelled Form 16 text in a field-and-value format, generate the structured preview, and download JSON. Common salary, deduction, TDS, PAN, and assessment-year labels are preserved.' }, { question: 'Can the Form 16 JSON be used for filing an ITR?', answer: 'The output can support preparation and data transfer, but every field must be verified against the signed Form 16 and the applicable ITR schema before filing.' }];
export default function Page() { return <><JSONLD data={buildCalculatorJsonLd({ name: 'Form 16 to JSON Converter', description: 'Convert labelled Form 16 text into structured JSON.', path: '/finance/form-16-to-json', applicationCategory: 'FinanceApplication' })} /><TaxDocumentClient mode="form16" /><FAQSchema faqs={faqs} /></>; }
