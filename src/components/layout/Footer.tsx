'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, Instagram, Twitter, Mail } from 'lucide-react';

const socialLinks = [
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Mail, label: 'Email' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto overflow-x-hidden border-t border-[var(--border)] bg-[var(--bg-secondary)] py-12 pb-10 sm:py-16 sm:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 grid gap-10 sm:mb-16 sm:gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1.2fr_1fr_1.5fr]">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-[1.75rem] font-black tracking-[-0.02em]"
            >
              <Image
                src="/tooliozLogo.svg"
                alt="Toolioz logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span>Toolioz</span>
            </Link>
            <p className="max-w-[320px] text-base leading-7 text-[var(--text-secondary)]">
              Empowering your digital life with precision-engineered tools. Always free, always
              private, always browser-local.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--text-secondary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="mb-2 text-sm font-extrabold uppercase tracking-[0.1em] text-[var(--text-primary)]">
              Tools Hub
            </h4>
            <Link
              href="/finance"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Finance Calculators
            </Link>
            <Link
              href="/devtools"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Developer Tools
            </Link>
            <Link
              href="/pdftools"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              PDF Utilities
            </Link>
            <Link
              href="/finance/sip-calculator"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              SIP Calculator
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="mb-2 text-sm font-extrabold uppercase tracking-[0.1em] text-[var(--text-primary)]">
              Top Lists
            </h4>
            <Link
              href="/top5"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              All Comparisons
            </Link>
            <Link
              href="/top5/best-finance-calculators-india"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Finance Calculators
            </Link>
            <Link
              href="/top5/essential-web-developer-tools"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Developer Utilities
            </Link>
            <Link
              href="/top5/best-pdf-document-creators"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              PDF & Document Tools
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="mb-2 text-sm font-extrabold uppercase tracking-[0.1em] text-[var(--text-primary)]">
              Company
            </h4>
            <Link
              href="/about"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              About Us
            </Link>
            <Link
              href="/privacy-policy"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-[0.9375rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              Contact Support
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6">
              <ShieldCheck className="mb-4 text-emerald-500" />
              <h5 className="mb-2 text-base font-bold text-[var(--text-primary)]">Privacy First</h5>
              <p className="text-[0.8125rem] leading-6 text-[var(--text-secondary)]">
                We use zero-server processing. Your data never leaves your machine.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6">
              <Zap className="mb-4 text-emerald-500" />
              <h5 className="mb-2 text-base font-bold text-[var(--text-primary)]">Fast & Free</h5>
              <p className="text-[0.8125rem] leading-6 text-[var(--text-secondary)]">
                Professional grade tools with no ads and no credit cards required.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-center sm:flex-row sm:gap-6 sm:pt-12 sm:text-left">
          <p className="text-sm text-[var(--text-tertiary)]">
            © {currentYear} Toolioz. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[0.8125rem] font-semibold text-[var(--text-tertiary)] sm:gap-5">
            <span>Version 2.0.4</span>
            <div className="hidden h-1 w-1 rounded-full bg-[var(--border)] sm:block" />
            <span className="hidden sm:inline">Serverless Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
