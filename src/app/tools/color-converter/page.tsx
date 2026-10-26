import Link from 'next/link';

export default function ColorConverterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Color converter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the color converter. It converts among hex, RGB, and HSL. A hex value is read as six digits.
      </p>
      <p className="mt-6">
        <Link href="/devtools/color-converter" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the color converter
        </Link>
      </p>
    </main>
  );
}
