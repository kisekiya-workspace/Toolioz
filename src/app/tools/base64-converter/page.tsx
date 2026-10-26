import Link from 'next/link';

export default function Base64AliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Base64 converter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the Base64 converter. Text is encoded with btoa and decoded with atob. A file is read as a data URL and the Base64 part is kept. Text outside Latin-1 cannot be encoded with btoa. Base64 is not encryption.
      </p>
      <p className="mt-6">
        <Link href="/devtools/base64-converter" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the Base64 converter
        </Link>
      </p>
    </main>
  );
}
