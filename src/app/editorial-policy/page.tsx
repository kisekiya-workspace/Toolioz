import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moved to Terms of Service',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://toolioz.com/terms',
  },
};

/** Retired page. Production 301 is in public/_redirects; this file covers local/dev and static export. */
export default function EditorialPolicyRetired() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
      <p>
        This page has been removed.{' '}
        <a href="/terms" className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">
          Continue to the terms of service
        </a>
        .
      </p>
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace('/terms');` }} />
    </div>
  );
}
