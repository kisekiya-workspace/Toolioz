import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Toolioz' },
  description: 'This address is not a published page on Toolioz.',
  robots: { index: false, follow: true },
  alternates: {},
};

const sections = [
  { href: '/', label: 'Home' },
  { href: '/finance', label: 'Finance calculators' },
  { href: '/devtools', label: 'Developer tools' },
  { href: '/pdftools', label: 'PDF tools' },
  { href: '/makers', label: 'Maker calculators' },
  { href: '/blog', label: 'Articles' },
  { href: '/how-to', label: 'How-to guides' },
];

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <p className="text-sm font-medium text-zinc-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is not a published page on Toolioz. The links below open the main sections.
      </p>
      <ul className="mt-8 space-y-2 text-sm">
        {sections.map((section) => (
          <li key={section.href}>
            <Link href={section.href} className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
