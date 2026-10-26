import Link from 'next/link';

export default function CompoundInterestAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Compound interest calculator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the compound-interest calculator. Future value is A = P(1 + r/n)^(nt). The page starts on monthly compounding. ₹10,000 at 5% for 10 years finishes near ₹16,470 monthly and near ₹16,487 daily. Recurring deposits are not included.
      </p>
      <p className="mt-6">
        <Link href="/finance/compound-interest" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the compound-interest calculator
        </Link>
      </p>
    </main>
  );
}
