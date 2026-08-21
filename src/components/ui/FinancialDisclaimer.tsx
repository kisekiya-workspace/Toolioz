import React from 'react';
import { AlertTriangle, ShieldAlert, UserCheck } from 'lucide-react';

interface FinancialDisclaimerProps {
  variant?: 'default' | 'compact' | 'card';
  title?: string;
  className?: string;
}

export const FinancialDisclaimer: React.FC<FinancialDisclaimerProps> = ({
  variant = 'default',
  title = 'Financial & Tax Advice Disclaimer',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={`rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 shadow-2xs dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200/90">
            <strong className="font-bold text-amber-950 dark:text-amber-100">Important Disclaimer:</strong> Calculations are estimates for educational and illustrative purposes only. They do not guarantee actual returns, interest rates, or tax savings and do not constitute formal financial advice. We are not liable for any financial decisions made. Please consult a SEBI-registered financial advisor or Chartered Accountant (CA) for personalized advice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-amber-200/80 bg-amber-50/60 p-6 text-amber-950 shadow-2xs dark:border-amber-900/40 dark:bg-[#1c1a17] dark:text-amber-100 sm:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-2.5">
          <h3 className="text-base font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/80">
            This tool is provided strictly for educational, planning, and illustrative purposes. All figures, estimates, compounding formulas, and tax calculations are based on user input parameters and current mathematical models.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/80">
            <strong className="text-amber-950 dark:text-amber-100">No Performance Guarantee & Liability:</strong> Output calculations do not guarantee future returns, exact bank interest payouts, market gains, or legal tax liability. Toolioz and its maintainers accept no legal or financial liability for investment losses, loan commitments, or tax penalties resulting from the use of this calculator.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <UserCheck className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Always consult a certified financial planner, registered investment advisor, or Chartered Accountant (CA) before taking financial action.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
