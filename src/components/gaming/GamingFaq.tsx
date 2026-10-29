'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function GamingFaq({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-zinc-200 bg-zinc-50/50 py-14 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const expanded = open === index;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 ${
                  expanded
                    ? 'border-zinc-400 dark:border-zinc-600'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-zinc-950 dark:text-zinc-50"
                  onClick={() => setOpen(expanded ? null : index)}
                  aria-expanded={expanded}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded && (
                  <p className="border-t border-zinc-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
