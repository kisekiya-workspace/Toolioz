import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface DirectAnswerBlockProps {
  title: string;
  answer: string;
  keyTakeaways?: string[];
  categoryName?: string;
}

export const DirectAnswerBlock: React.FC<DirectAnswerBlockProps> = ({
  title,
  answer,
  keyTakeaways,
  categoryName,
}) => {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Quick Summary & Direct Answer</span>
        </div>
        {categoryName && (
          <span className="rounded-md bg-zinc-200/70 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {categoryName}
          </span>
        )}
      </div>

      <h3 className="mb-2 text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
        {title}
      </h3>

      <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {answer}
      </p>

      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="mt-4 border-t border-zinc-200/80 dark:border-zinc-800 pt-3">
          <h4 className="mb-2 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Key Takeaways
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="leading-normal">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
