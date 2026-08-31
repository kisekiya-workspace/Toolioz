'use client';

import React from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';

export default function AboutClient() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="mx-auto max-w-6xl px-6">
          <h1 className={styles.title}>About <span style={{ color: 'var(--primary)' }}>Toolioz</span></h1>
          <p className={styles.subtitle}>Practical browser tools with documented formulas, limitations, and sources.</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <p>
              <strong>Toolioz</strong> is an independent utility website maintained by the Toolioz team. We build calculators,
              developer utilities, and document tools for people who want a quick answer without creating an account. The site is
              supported and corrected through feedback sent to <a href="mailto:support@toolioz.com">support@toolioz.com</a>.
            </p>
            
            <h2>Why We Exist</h2>
            <p>
              A useful calculator should show more than a result. Where the subject requires it, our published pages explain the
              formula, assumptions, example calculation, and important limitations. Developer and document tools are designed around
              a specific task rather than a collection of keyword variations that do the same thing.
            </p>
            
            <h2>Our Principles</h2>
            <ul>
              <li><strong>Explain the result:</strong> Show the formula, assumptions, and edge cases users need to interpret an output.</li>
              <li><strong>Use primary sources:</strong> Prefer official regulations, standards, specifications, and documentation.</li>
              <li><strong>State limitations:</strong> A planning calculator is not financial, tax, legal, or medical advice.</li>
              <li><strong>Minimize sensitive-data exposure:</strong> Tool inputs and files stay in the browser when a page is labelled local processing.</li>
              <li><strong>Correct mistakes:</strong> Readers can report a formula, source, privacy, or accessibility issue by email.</li>
            </ul>

            <h2>How We Publish</h2>
            <p>
              New tools are tested for their main task before they are added to the public directory. Pages that are experimental,
              duplicate an existing tool, or do not yet explain their use are withheld from the search index. Financial and tax pages
              are dated and should be checked again whenever rules change. Read our <a href="/editorial-policy">Editorial &amp; Review Policy</a>
              for the full process and our <a href="/privacy-policy">Privacy Policy</a> for the network services the website uses.
            </p>
            
            <p className={styles.lastUpdated}>
              Last reviewed: 31 August 2026
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
