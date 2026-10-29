'use client';

import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';
import Link from 'next/link';

export default function AboutClient() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="mx-auto max-w-6xl px-6">
          <h1 className={styles.title}>
            About <span className="text-primary">Toolioz</span>
          </h1>
          <p className={styles.subtitle}>
            Browser calculators and file utilities. Unofficial tools, used at the visitor&apos;s own risk.
          </p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <p>
              <strong>Toolioz</strong> publishes free browser tools: finance estimates, developer utilities, PDF helpers,
              gaming calculators, and similar one-job pages. There is no account. Correspondence goes to{' '}
              <a href="mailto:support@toolioz.com">support@toolioz.com</a>. There is no walk-in office and no phone
              support queue.
            </p>

            <h2>Who this site is for</h2>
            <p>
              The pages are for people who already know they want a number or a file transform and want to try a
              browser tool. The site is not a bank, a CA firm, a newsroom, a trading terminal, or an official source
              for tax, game, or product rules. It is not a replacement for a SEBI-registered adviser, a chartered
              accountant, or a publisher&apos;s documentation.
            </p>

            <h2>Accuracy and reliability</h2>
            <p>
              Tools can be wrong, incomplete, or not updated. Formulas, tax slabs, game constants, and file behaviour
              change, and Toolioz has no duty to keep every page current. Results are unofficial estimates. Use them
              at your own risk and verify anything that matters against an official source. The{' '}
              <Link href="/terms">terms of service</Link> state that the site is provided as-is, without warranties,
              and without liability for reliance on any output.
            </p>

            <h2>Advertising and privacy</h2>
            <p>
              If Google AdSense is enabled, advertising does not change a formula output. Analytics still load on most
              pages; that is described in the <Link href="/privacy-policy">privacy policy</Link>. Pages labelled local
              processing keep tool inputs and uploads in the browser. That is not a claim that the site sends zero
              network bytes.
            </p>

            <p>
              Questions go to the <Link href="/contact">contact page</Link>. Last updated: October 2026.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
