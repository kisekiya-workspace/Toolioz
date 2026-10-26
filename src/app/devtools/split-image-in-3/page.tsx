import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Split image in 3',
  description: 'Alias of the 16:9 splitter. It crops a photo into three equal vertical PNG slices.',
  path: '/devtools/split-image-in-3',
});

export default function SplitImageAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Split image in 3</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the image splitter. It crops a 16:9 photo into three equal vertical PNG slices. The image is not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/design/split-image-in-3" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the image splitter
        </Link>
      </p>
    </main>
  );
}
