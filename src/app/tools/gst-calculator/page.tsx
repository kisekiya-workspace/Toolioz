import Link from 'next/link';

export default function GstCalculatorAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">GST calculator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the GST calculator. Exclusive tax is amount × rate ÷ 100. Inclusive tax removes the tax already inside the total. ₹1,000 at 18% exclusive is ₹180 of tax and a ₹1,180 total. Intra-state supply splits the tax in half. Reverse charge is not calculated.
      </p>
      <p className="mt-6">
        <Link href="/finance/gst-calculator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the GST calculator
        </Link>
      </p>
    </main>
  );
}
