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
          <p className={styles.subtitle}>Our commitment to your data security and serverless processing.</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <h2>1. Zero-Server Architecture</h2>
            <p>
              Your privacy is our core engineering principle. <strong>Toolioz</strong> is built as a serverless utility suite. 
              This means that when you use our calculators, PDF tools, or developer utilities, your data never leaves your computer.
            </p>

            <h2>2. No Data Collection</h2>
            <p>
              We do not collect, store, or transmit any sensitive data. Whether you are pasting financial records or uploading PDFs for merging, 
              the processing happens entirely in your browser's memory using JavaScript.
            </p>

            <h2>3. Cookies and Analytics</h2>
            <p>
              We use minimal, privacy-focused analytics to understand how our tools are used and to improve the interface. 
              We do not use tracking cookies for advertising or secondary data harvesting.
            </p>

            <h2>4. Security & User Responsibility</h2>
            <p>
              Since your data is processed locally, its security depends entirely on your own device and network. 
              We do not promise or guarantee that your local environment is secure. You are solely responsible for ensuring 
              you have a secure operating system, updated browser, and protection against malware when handling sensitive data.
            </p>

            <h2>5. Absolute Disclaimer of Liability</h2>
            <p>
              The tools and calculators provided on this website are for informational purposes only. 
              <strong>We make absolutely no warranties, promises, or guarantees regarding the accuracy, reliability, or completeness of the results.</strong> 
              Under no circumstances shall we be held responsible or liable for any direct, indirect, incidental, 
              consequential, or financial damages, data loss, or any other issues arising from the use of our tools. 
              You use these tools entirely at your own risk.
            </p>

            <h2>6. Third-Party Links</h2>
            <p>
              Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content 
              and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>

            <p className={styles.lastUpdated}>
              Last Updated: April 2026
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
