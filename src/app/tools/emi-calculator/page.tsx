import Link from 'next/link';

export default function EmiCalculatorAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">EMI calculator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the mortgage calculator. The payment is principal and interest only. $300,000 at 6.8% for 30 years is about $1,956 a month. Tax, insurance, PMI, and a down payment are not included.
      </p>
      <p className="mt-6">
        <Link href="/finance/mortgage-calculator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the mortgage calculator
        </Link>
      </p>
    </main>
  );
}
