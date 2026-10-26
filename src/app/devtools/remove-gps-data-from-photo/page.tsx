import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Remove GPS from a photo',
  description: 'Alias of the EXIF tool. The cleaned download strips JPEG EXIF, XMP, IPTC, and comment blocks, or PNG metadata, without re-encoding pixels.',
  path: '/devtools/remove-gps-data-from-photo',
});

export default function RemoveGpsAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Remove GPS from a photo</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the EXIF viewer and remover. The cleaned download removes JPEG EXIF, XMP, IPTC, and comment blocks, or PNG EXIF, text, and time chunks, without re-encoding the pixels. GPS is one of the fields that reader can show.
      </p>
      <p className="mt-6">
        <Link href="/devtools/exif-viewer-remover" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the EXIF tool
        </Link>
      </p>
    </main>
  );
}
