import Link from 'next/link';

export default function SipCalculatorAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">SIP calculator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the SIP calculator. A monthly amount is compounded with each installment at the start of the month. ₹5,000 a month for 10 years at 12% invests ₹6,00,000 and finishes near ₹11.6 lakh. Unit prices are not simulated.
      </p>
      <p className="mt-6">
        <Link href="/finance/sip-calculator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the SIP calculator
        </Link>
      </p>
    </main>
  );
}
