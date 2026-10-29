import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export function ToolAccuracyNote({ extra }: { extra?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed sm:text-sm">
            <strong className="font-semibold">Results can be wrong.</strong> This calculator is unofficial.
            Figures can be incomplete, rounded, or not updated. Use them at your own risk and check a tape,
            datasheet, ball band, or official chart before cutting, mixing, buying, or publishing.{' '}
            {extra ? <span>{extra} </span> : null}
            Limits of liability are in the{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-50">
              terms of service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
