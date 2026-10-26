import Link from 'next/link';

export default function UnitConverterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Unit converter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the unit converter. Length, mass, temperature, and data each convert inside their own category. Temperature uses Celsius as the bridge. Length is not converted to mass.
      </p>
      <p className="mt-6">
        <Link href="/devtools/unit-converter" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the unit converter
        </Link>
      </p>
    </main>
  );
}
