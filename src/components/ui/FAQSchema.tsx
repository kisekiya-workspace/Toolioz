'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-t border-slate-200 bg-slate-50/50 py-16 sm:py-20 my-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl sm:text-3xl font-black text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-5">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={[
                  'overflow-hidden rounded-2xl border bg-white transition-all duration-200',
                  openIndex === i ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300',
                ].join(' ')}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 bg-white px-6 py-5 text-left text-sm sm:text-base font-bold leading-6 text-slate-900"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={[
                      'shrink-0 text-slate-400 transition-transform duration-200',
                      openIndex === i ? 'rotate-180 text-indigo-600' : '',
                    ].join(' ')}
                  />
                </button>
                <div
                  className={[
                    'overflow-hidden px-6 transition-all duration-300',
                    openIndex === i ? 'max-h-96 pb-6 pt-1' : 'max-h-0 pb-0',
                  ].join(' ')}
                >
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
