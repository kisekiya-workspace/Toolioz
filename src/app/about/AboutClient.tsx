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
          <p className={styles.subtitle}>Our mission is to democratize professional utilities through precision engineering.</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className="mx-auto max-w-6xl px-6">
          <Card className={styles.card}>
            <p>
              Welcome to <strong>Toolioz</strong>, your premier destination for highly accurate, modern, and minimal digital utilities.
              In an increasingly complex landscape, we believe that everyone deserves access to the same precision logic used by professionals.
            </p>
            
            <h2>Why We Exist</h2>
            <p>
              Most online utilities are outdated, cluttered with ads, or use simplified logic that doesn't account for real-world nuances. 
              ToolBox was built to change that. We combine beautiful, responsive design with a robust technical engine that accounts for 
              global standards—from the latest 2026 tax budget changes to binary data encoding.
            </p>
            
            <h2>Our Principles</h2>
            <ul>
              <li><strong>Accuracy Above All:</strong> Every calculation is double-checked against industry standards.</li>
              <li><strong>Privacy First:</strong> We follow a zero-server approach. Your data never leaves your machine.</li>
              <li><strong>Zero Clutter:</strong> No ads, no tracking, no account required. Just pure functionality.</li>
            </ul>

            <h2>Technical Infrastructure</h2>
            <p>
              Toolioz is a part of the Toolioz ecosystem, dedicated to building software that empowers users to make informed life decisions.
              Our platform uses modern browser-native technologies to process PDFs, format code, and calculate finances without ever needing an external server.
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
