import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import BiodataGeneratorClient from '@/app/devtools/biodata-generator/BiodataStudioClient';
import { biodataFaqs, biodataKeywords } from '@/lib/biodata-content';

export const metadata: Metadata = {
  title: 'Free Marriage Biodata Generator | PDF Download With Photo',
  description:
    'Create marriage biodata PDF online with photo, family details, Hindu, Muslim, Sikh, classic, and modern templates. No login required.',
  keywords: biodataKeywords,
  alternates: {
    canonical: 'https://toolioz.com/biodata/biodata-generator',
  },
  openGraph: {
    title: 'Marriage Biodata Generator | Toolioz',
    description:
      'Build biodata layouts with live preview, customizable sections, and direct PDF export.',
    url: 'https://toolioz.com/biodata/biodata-generator',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Biodata Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biodata Generator | Toolioz',
    description:
      'Generate modern and religion-based marriage biodata templates with PDF export.',
    images: ['/tooliozLogo.png'],
  },
};

import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';

export default function BiodataGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Marriage Biodata Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: 'https://toolioz.com/biodata/biodata-generator',
    description:
      'Browser-based biodata builder with live preview and PDF download for matrimonial profiles.',
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create a marriage biodata PDF online',
    description:
      'Create a marriage biodata with photo, family details, template preview, and PDF download.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choose a template',
        text: 'Select a modern, classic, Hindu, Islamic, Sikh, or minimalist biodata template.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add personal and family details',
        text: 'Enter name, birth details, education, profession, family background, contact details, and partner preferences.',
      },
      {
        '@type': 'HowToStep',
        name: 'Preview and download',
        text: 'Open the A4 preview, check spacing, and export the biodata as a PDF.',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: biodataFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Biodata Tools', url: '/biodata' },
          { name: 'Marriage Biodata Generator', url: '/biodata/biodata-generator' },
        ]}
      />
      <JSONLD data={jsonLd} />
      <JSONLD data={howToJsonLd} />
      <JSONLD data={faqJsonLd} />
      <BiodataGeneratorClient />
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <DirectAnswerBlock
            title="How to create a free marriage biodata PDF with photo online?"
            answer="Toolioz Marriage Biodata Generator is a free, mobile-friendly tool for creating a polished matrimonial profile. Choose from 12 A4 templates, add personal, family, career, horoscope, and preference details, upload a photo, then download a print-ready PDF or PNG without registration or watermarks."
            keyTakeaways={[
              "12 Traditional, Royal & Modern Layouts — including Hindu, Islamic, Sikh, editorial, and minimalist designs.",
              "100% Client-Side Data Privacy — Personal and family details remain in your browser and are never uploaded to servers.",
              "Guided Five-Step Editor — Choose a design, add profile and family details, then review the live A4 preview.",
              "Free PDF & PNG Downloads — Save a print-ready document directly to your phone or laptop."
            ]}
            categoryName="Marriage Biodata Maker"
          />
          <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Create Your Professional Marriage Biodata in Minutes</h2>
          <div className="prose prose-slate max-w-none space-y-6 text-gray-600 leading-relaxed">
            <p>
              Our <strong>Free Marriage Biodata Generator</strong> helps you create a polished matrimonial profile without complex design tools or expensive services. Whether you need a <strong>Hindu biodata format</strong>, an <strong>Islamic elegant design</strong>, or a <strong>modern professional layout</strong>, you can choose from 12 carefully structured A4 templates.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-sm">1</span>
                  Religion-Specific Templates
                </h3>
                <p>We understand that different communities have different requirements. Our tool includes specialized templates for Hindu, Muslim, and Sikh backgrounds, featuring appropriate symbols and sections for horoscope details, family heritage, and more.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-sm">2</span>
                  Modern & Premium Designs
                </h3>
                <p>Choose from refined options such as <strong>Royal Ivory &amp; Gold</strong>, <strong>Floral Editorial</strong>, and <strong>Minimalist Clean</strong>. Each design keeps important details readable while giving the profile a distinct character.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-sm">3</span>
                  Mobile-Friendly Experience
                </h3>
                <p>Created with a mobile-first approach, you can fill in your details, preview your A4 layout, and download your <strong>biodata PDF</strong> directly on your smartphone. No login, no registration, and completely free.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-sm">4</span>
                  Privacy Guaranteed
                </h3>
                <p>Your privacy is our priority. All your data is processed locally in your browser and never stored on our servers. You have complete control over your information and photos.</p>
              </div>
            </div>

            <div className="mt-16 p-8 bg-stone-50 rounded-3xl border border-stone-200">
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Tips for a Great Marriage Biodata</h3>
              <ul className="list-disc pl-6 space-y-3 text-stone-700">
                <li><strong>Use a clear photo:</strong> A recent, high-quality portrait makes the profile feel more authentic.</li>
                <li><strong>Be concise:</strong> Families often scan many profiles; use bullet points for family details and education.</li>
                <li><strong>Honesty is key:</strong> Provide accurate information about your profession, income, and lifestyle.</li>
                <li><strong>Partner preferences:</strong> Clearly but respectfully state what you are looking for to ensure compatibility.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
     </>
  );
}
