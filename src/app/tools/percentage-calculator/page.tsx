import Link from 'next/link';

export default function PercentageCalculatorAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Percentage calculator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the percentage calculator. P% of N is (P ÷ 100) × N. What percent X is of Y is (X ÷ Y) × 100. 18% of 250 is 45. A whole of zero is rejected.
      </p>
      <p className="mt-6">
        <Link href="/finance/percentage-calculator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the percentage calculator
        </Link>
      </p>
    </main>
  );
}
