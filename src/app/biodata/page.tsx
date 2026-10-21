import { JSONLD } from '@/components/ui/JSONLD';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import BiodataStudioClient from '@/app/devtools/biodata-generator/BiodataStudioClient';
import { biodataFaqs, biodataKeywords } from '@/lib/biodata-content';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Marriage Biodata Maker — Live Editor, PDF Download',
  description:
    'Make a marriage biodata in the browser. Pick a template, fill your details, preview A4, and download a PDF. Nothing is uploaded.',
  path: '/biodata',
  keywords: biodataKeywords,
});

export default function BiodataPage() {
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create a marriage biodata PDF',
    description: 'Choose a template, fill the form, preview A4, and download a PDF.',
    step: [
      { '@type': 'HowToStep', name: 'Choose a template', text: 'Pick a Hindu, Muslim, Sikh, classic, or modern A4 layout.' },
      { '@type': 'HowToStep', name: 'Fill details', text: 'Add photo, personal, family, and optional horoscope fields. Empty fields stay off the page.' },
      { '@type': 'HowToStep', name: 'Download', text: 'Check the live preview, then save a PDF or PNG.' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: biodataFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Marriage Biodata Maker', url: '/biodata' },
        ]}
      />
      <JSONLD
        data={buildCalculatorJsonLd({
          name: 'Marriage Biodata Maker',
          description: 'Browser-based marriage biodata editor with live A4 preview and PDF download.',
          path: '/biodata',
          applicationCategory: 'BusinessApplication',
        })}
      />
      <JSONLD data={howToJsonLd} />
      <JSONLD data={faqJsonLd} />
      <h1 className="sr-only">Marriage biodata maker</h1>
      <BiodataStudioClient />
    </>
  );
}
