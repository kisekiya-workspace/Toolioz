'use client';

import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';
import Link from 'next/link';

export default function TermsClient() {
  return (
    <div className={styles.wrapper}>

      <header className={styles.header}>
        <div className="mx-auto max-w-6xl px-6">
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>Legal guidelines for using the Toolioz suite.</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Toolioz, you agree to be bound by these terms and all applicable laws and regulations.
              The tools are provided for convenience only. Use of the site includes loading ordinary page assets and, where present, advertising and analytics, as described in the{' '}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>

            <h2>2. Use at Your Own Risk</h2>
            <p>
              Every calculator, converter, generator, and other utility on Toolioz is unofficial and experimental.
              <strong> You use the site and all results entirely at your own risk.</strong> Toolioz, its operators, and
              its affiliates accept no duty to keep any tool accurate, complete, current, or fit for any purpose.
              If a result matters — money, tax, a game build, a file, a password, or anything else — independently
              verify it against an official source before acting.
            </p>

            <h2>3. No Accuracy, Reliability, or Update Obligation</h2>
            <p>
              Tools can be wrong. They can contain bugs, rounding errors, outdated formulas, unofficial interpretations,
              or incomplete edge cases. Game math, tax slabs, interest rules, file formats, and third-party specifications
              change. Toolioz does not promise to monitor those changes, to patch tools after they change, or to notify
              anyone when a page is stale.
            </p>
            <p>
              <strong>We do not warrant the accuracy, reliability, completeness, currency, or usefulness of any output,
              explanation, or example.</strong> Nothing on this site is a substitute for official documentation, a
              licensed professional, a bank, a tax authority, a game publisher, or your own checks.
            </p>

            <h2>4. No Professional Advice</h2>
            <p>
              Toolioz does not provide financial, legal, tax, medical, accounting, or other professional advice.
              Results must never be treated as advice, a filing, an official computation, or a guarantee. Consult a
              qualified professional before making financial, legal, tax, or business decisions.
            </p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>
              The site and all tools are provided strictly on an <strong>&quot;AS IS&quot; and &quot;AS AVAILABLE&quot;</strong> basis,
              without warranties of any kind, express or implied, including merchantability, fitness for a particular
              purpose, title, non-infringement, or uninterrupted or error-free operation. Toolioz may add, change,
              pause, or remove any page at any time without notice.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Toolioz, its operators, and its affiliates are not liable for any
              direct, indirect, incidental, special, consequential, exemplary, or punitive damages, including financial
              loss, tax penalties, lost data, lost profits, game progress, or wasted time, arising from use of, inability
              to use, or reliance on this site or any result it produces — even if a defect was known or should have
              been known. You assume total responsibility for your use of the site.
            </p>

            <h2>7. Changes to These Terms</h2>
            <p>
              These terms may be revised at any time without notice. Continued use of the site after a change constitutes
              acceptance of the then-current version.
            </p>

            <p className={styles.lastUpdated}>
              Last Updated: October 2026
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
