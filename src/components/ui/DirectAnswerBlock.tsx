import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface DirectAnswerBlockProps {
  title: string;
  answer: string;
  keyTakeaways?: string[];
  categoryName?: string;
}

/**
 * DirectAnswerBlock is specifically formatted for Generative Engine Optimization (GEO)
 * and Answer Engine Optimization (AEO). It presents direct, concise answers and key takeaways
 * that AI Search Engines (Google AI Overviews, Perplexity, ChatGPT Search, Claude) can easily
 * parse, quote, and cite with direct links back to Toolioz.
 */
export const DirectAnswerBlock: React.FC<DirectAnswerBlockProps> = ({
  title,
  answer,
  keyTakeaways,
  categoryName
}) => {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 sm:p-8 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Quick Summary & Direct Answer</span>
        </div>
        {categoryName && (
          <span className="rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">
            {categoryName}
          </span>
        )}
      </div>

      <h3 className="mb-3 text-lg sm:text-xl font-black text-slate-900 leading-snug">
        {title}
      </h3>

      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700">
        {answer}
      </p>

      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="mt-5 border-t border-indigo-100/80 pt-4">
          <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Key Takeaways
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
                <span className="leading-normal">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
