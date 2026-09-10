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
            About <span style={{ color: 'var(--primary)' }}>Toolioz</span>
          </h1>
          <p className={styles.subtitle}>
            An independent publisher of documented calculators and browser utilities, not a bank, CA firm, or ad network.
          </p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <p>
              <strong>Toolioz</strong> is run by the Toolioz editorial and engineering team. The public site exists so a
              person can finish one concrete job — project an SIP, estimate tax under a labelled year, format JSON, merge a
              PDF, or print a biodata — without creating an account. Correspondence goes to{' '}
              <a href="mailto:support@toolioz.com">support@toolioz.com</a>. There is no walk-in office and no phone support
              queue.
            </p>

            <h2>Who this site is for</h2>
            <p>
              The finance pages are written for people who already know they want a number and need the equation stated in
              the open: salaried planners in India comparing a SIP amount, a home-loan EMI, or a GST-inclusive invoice.
              The developer and PDF pages are written for people who already have a file or a payload and need to transform
              it in the browser. The site is not a newsroom, not a trading terminal, and not a replacement for a SEBI-registered
              adviser or a chartered accountant.
            </p>

            <h2>How a calculator is allowed onto the public directory</h2>
            <p>
              Google’s publisher rules require that ads sit next to original publisher content, not next to empty widgets,
              doorway pages, or unreviewed auto-generated text. Toolioz therefore lists only tools that (1) perform a distinct
              task, (2) show the formula or parser behaviour in prose, (3) include at least one numeric example that can be
              repeated by hand, and (4) state what the page does not do. Keyword variants of the same percentage arithmetic
              — sports win rate, body-fat estimates, school grades — are not part of the finance catalog.
            </p>
            <p>
              Before a page is indexed, the implemented function is checked against the on-page formula for ordinary values,
              zeros, and invalid input. Time-sensitive tax and rebate figures are dated. If a statute changes and we have not
              yet patched the code, the Income Tax Department or GST Council document is the authority, not this website.
            </p>

            <h2>Advertising and independence</h2>
            <p>
              If Google AdSense is enabled after a successful review, ads must not outrank the calculator and the article on
              the same URL. Ad code is not placed on withheld, duplicate, or unfinished tool URLs. Advertising does not change
              a formula output. Analytics still load on most pages; that is described in the{' '}
              <Link href="/privacy-policy">privacy policy</Link>. Pages labelled local processing keep tool inputs and uploads
              in the browser. That is not a claim that the site sends zero network bytes.
            </p>

            <h2>Corrections</h2>
            <p>
              Send the URL, the inputs, the number you got, the number you expected, and a primary source. Material errors are
              corrected in both the function and the prose. The{' '}
              <Link href="/editorial-policy">editorial policy</Link> is the process document; the{' '}
              <Link href="/contact">contact page</Link> is the inbox. Last reviewed: 10 September 2026.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
