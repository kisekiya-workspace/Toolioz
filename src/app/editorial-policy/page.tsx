import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Editorial & Review Policy | Toolioz',
  description:
    'How Toolioz selects, tests, sources, updates, and corrects calculators, technical guides, and browser utilities.',
  path: '/editorial-policy',
  keywords: ['Toolioz editorial policy', 'calculator methodology', 'Toolioz corrections'],
});

export default function EditorialPolicyPage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="mx-auto max-w-6xl px-6">
          <h1 className={styles.title}>Editorial &amp; Review Policy</h1>
          <p className={styles.subtitle}>
            The standards used to decide which Toolioz pages are published, indexed, updated, or corrected.
          </p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <h2>Who Is Responsible</h2>
            <p>
              Toolioz is maintained by the Toolioz editorial and engineering team. The team is responsible for the
              calculators, explanatory copy, source selection, testing, and corrections published on this domain.
              Questions and correction requests can be sent to{' '}
              <a href="mailto:support@toolioz.com">support@toolioz.com</a>.
            </p>

            <h2>What Qualifies for the Public Directory</h2>
            <p>
              A listed tool must perform a distinct user task, work in a supported modern browser, explain the inputs and
              output, and state material limitations. We do not treat a new keyword variation as a reason to publish a
              separate page. Experimental tools and pages that duplicate an established utility may remain available for
              testing, but they are withheld from the primary directory and search index until their value is independently clear.
            </p>

            <h2>Calculator Review</h2>
            <ul>
              <li>The implemented equation is compared with the formula shown on the page.</li>
              <li>Normal cases, zero values, invalid inputs, and relevant boundary conditions are tested.</li>
              <li>Assumptions such as compounding frequency, payment timing, rounding, currency, and tax year are stated.</li>
              <li>Financial, tax, health, and legal-adjacent results are labelled as estimates rather than professional advice.</li>
            </ul>

            <h2>Sources and Claims</h2>
            <p>
              We prefer primary sources: legislation and government portals for tax rules, regulator and public-agency
              material for consumer finance, standards bodies for file formats, and original technical specifications or
              official documentation for developer topics. A source supports only the claim it actually addresses. Marketing
              phrases such as “bank-grade,” “guaranteed,” or “official” are not used unless they can be substantiated.
            </p>

            <h2>Software-Assisted Work</h2>
            <p>
              Software tools may assist with code, analysis, outlining, or language editing. Assistance is not treated as a
              factual source. A page selected for the public index must still be checked against its working implementation,
              cited references, and the review criteria above. Large batches of lightly modified pages are not part of the
              publication standard.
            </p>

            <h2>Updates and Corrections</h2>
            <p>
              Time-sensitive pages identify a review or update date. We prioritize updates when an official rule, specification,
              or browser behavior changes. A material error is corrected in both the tool and its explanation; a page that
              cannot be made reliable is removed from the public directory or search index. Please include the page URL, the
              disputed statement or result, and a source or reproducible example when reporting an issue.
            </p>

            <h2>Privacy and Commercial Independence</h2>
            <p>
              Advertising does not determine calculator outputs, article conclusions, or which tools are listed. Advertising
              and analytics data flows are described separately in the <Link href="/privacy-policy">Privacy Policy</Link>.
              The <Link href="/terms">Terms of Service</Link> explain the limits of educational estimates.
            </p>

            <p className={styles.lastUpdated}>Last reviewed: 31 August 2026</p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
