import React from 'react';
import { CheckCircle2, ArrowRightCircle, Calculator } from 'lucide-react';

interface SEOSectionProps {
  title: string;
  description: string;
  howToUse: string[];
  formula?: string;
  benefits: string[];
}

export const SEOSection: React.FC<SEOSectionProps> = ({
  title,
  description,
  howToUse,
  formula,
  benefits,
}) => {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50/50 py-14 sm:py-16 my-10 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="mb-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              About {title}
            </h2>
            <p className="mx-auto max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* How to Use Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <ArrowRightCircle size={18} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">How to Use</h3>
              </div>
              <ul className="space-y-3.5">
                {howToUse.map((step, i) => (
                  <li key={i} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">Key Benefits</h3>
              </div>
              <ul className="space-y-3.5">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {formula && (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white my-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-200/80 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="flex items-center gap-2.5">
                  <Calculator className="text-blue-600 dark:text-blue-400" size={16} />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">Mathematical Formula</h3>
                </div>
              </div>
              <div className="p-6">
                <code className="block whitespace-pre-wrap rounded-xl bg-zinc-950 p-5 font-mono text-xs sm:text-sm font-medium leading-relaxed text-blue-300 dark:bg-[#111317] dark:border dark:border-zinc-800">
                  {formula}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
