'use client';

import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';

export default function PrivacyClient() {
  return (
    <div className={styles.wrapper}>

      <header className={styles.header}>
        <div className="mx-auto max-w-6xl px-6">
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>What Toolioz processes locally, what third parties receive, and the choices available to you.</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <h2>1. Scope</h2>
            <p>
              This policy describes information processing on <strong>toolioz.com</strong>. It covers the website, calculators,
              developer utilities, document tools, analytics, advertising technology, and messages sent to our support address.
            </p>

            <h2>2. Tool Inputs and Uploaded Files</h2>
            <p>
              When a tool page says that processing is local or browser-only, the values or files entered into that tool are processed
              in your browser and are not intentionally uploaded to Toolioz. Closing or refreshing the page normally clears in-memory
              inputs. Some tools download libraries, fonts, or processing components from third-party content delivery networks; those
              providers receive ordinary request data such as an IP address and browser headers, but not the document or value being
              processed unless the page explicitly says an online service is required.
            </p>

            <h2>3. Analytics</h2>
            <p>
              Toolioz uses Google Analytics to understand page visits, device and browser categories, approximate geography, traffic
              sources, and interactions with the site. Google may use cookies or similar storage and receives network information such
              as your IP address and user agent. We use aggregated reports to find broken pages and decide which tools to improve. You
              can limit this processing with browser privacy controls, content blockers, or Google&apos;s Analytics opt-out tools.
            </p>

            <h2>4. Advertising</h2>
            <p>
              Toolioz may use Google AdSense after the site is approved. Google and its advertising partners may use cookies, local
              storage, device identifiers, and information about visits to provide, measure, and protect advertising. Where consent is
              required, advertising should not be activated until the applicable consent choice is collected. Ad settings and opt-out
              choices are available through Google&apos;s advertising controls.
            </p>

            <h2>5. Messages and Support</h2>
            <p>
              If you email us, your email provider and ours process the address, message, headers, and attachments you send. We use that
              information to respond, investigate reported issues, and maintain a record of important corrections. Do not email
              passwords, full tax records, identity documents, or other information you do not want included in an email system.
            </p>

            <h2>6. Retention, Security, and Third Parties</h2>
            <p>
              Toolioz does not retain inputs handled only in browser memory. Analytics, advertising, CDN, email, and linked external
              services apply their own retention and privacy terms. No website or local device can be guaranteed completely secure, so
              keep your browser updated and avoid using sensitive documents on a device you do not trust.
            </p>

            <h2>7. Questions and Updates</h2>
            <p>
              Privacy questions can be sent to <a href="mailto:support@toolioz.com">support@toolioz.com</a>. We update this policy when
              the site&apos;s data flows or service providers materially change. The date below identifies the latest review.
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
