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
  benefits
}) => {
  return (
    <section className="border-t border-slate-200 bg-slate-50/50 py-16 sm:py-20 my-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              About {title}
            </h2>
            <p className="mx-auto max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
            {/* How to Use Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ArrowRightCircle size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">How to Use</h3>
              </div>
              <ul className="space-y-4">
                {howToUse.map((step, i) => (
                  <li key={i} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Benefits Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Key Benefits</h3>
              </div>
              <ul className="space-y-4">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {formula && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm my-8">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Calculator className="text-indigo-600" size={20} />
                  <h3 className="font-bold text-slate-900">Mathematical Formula</h3>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <code className="block whitespace-pre-wrap rounded-xl bg-slate-900 px-6 py-5 font-mono text-sm sm:text-base font-medium leading-relaxed text-indigo-300 shadow-inner">
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
