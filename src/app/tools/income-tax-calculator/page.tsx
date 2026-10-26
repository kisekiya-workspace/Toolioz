import Link from 'next/link';

export default function IncomeTaxAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Income tax calculator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the income-tax calculator. New-regime tax is set to zero at or below ₹7,00,000 of taxable income for 2024 and 2025, and at or below ₹12,00,000 for 2026. The India deduction field starts at ₹75,000 and does not switch when the regime changes.
      </p>
      <p className="mt-6">
        <Link href="/finance/income-tax" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the income-tax calculator
        </Link>
      </p>
    </main>
  );
}
