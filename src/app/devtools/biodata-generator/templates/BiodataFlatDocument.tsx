'use client';

import React from 'react';
import type { BiodataForm } from '../types';
import type { BiodataThemeConfig } from '../biodata-theme';
import { MOTIF_SVG_PATHS, type BiodataMotifId } from '../biodata-motifs';
import { TemplateWrapper } from './TemplateWrapper';

const font = "'Helvetica', 'Arial', sans-serif";

function SectionTitle({
  children,
  color,
  accent,
  centered,
}: {
  children: React.ReactNode;
  color: string;
  accent: string;
  centered?: boolean;
}) {
  return (
    <h2
      style={{
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color,
        borderBottom: `1.5px solid ${accent}`,
        paddingBottom: '4px',
        marginBottom: '10px',
        marginTop: '16px',
        textAlign: centered ? 'center' : 'left',
      }}
    >
      {children}
    </h2>
  );
}

function FieldRow({
  label,
  value,
  textColor,
  mutedColor,
}: {
  label: string;
  value?: string | null;
  textColor: string;
  mutedColor: string;
}) {
  if (!value?.trim()) return null;
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '10px', lineHeight: 1.45 }}>
      <span style={{ width: '118px', flexShrink: 0, fontWeight: 700, color: textColor }}>{label}</span>
      <span style={{ color: mutedColor }}>:</span>
      <span style={{ flex: 1, color: mutedColor }}>{value}</span>
    </div>
  );
}

function TextBlock({
  title,
  text,
  theme,
  centered,
}: {
  title: string;
  text?: string | null;
  theme: BiodataThemeConfig;
  centered?: boolean;
}) {
  if (!text?.trim()) return null;
  return (
    <section>
      <SectionTitle color={theme.primary} accent={theme.accent} centered={centered}>
        {title}
      </SectionTitle>
      <p style={{ fontSize: '10px', lineHeight: 1.5, color: theme.muted, fontStyle: 'italic', margin: 0, textAlign: centered ? 'center' : 'left' }}>
        {text}
      </p>
    </section>
  );
}

function MainSections({
  data,
  theme,
  centered,
  skipPersonalSidebarFields,
  skipContact,
}: {
  data: BiodataForm;
  theme: BiodataThemeConfig;
  centered?: boolean;
  skipPersonalSidebarFields?: boolean;
  skipContact?: boolean;
}) {
  return (
    <>
      <TextBlock title="About Me" text={data.about} theme={theme} centered={centered} />

      <SectionTitle color={theme.primary} accent={theme.accent} centered={centered}>
        Personal Details
      </SectionTitle>
      <FieldRow label="Date of Birth" value={data.dateOfBirth} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Time of Birth" value={data.birthTime} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Place of Birth" value={data.birthPlace} textColor={theme.text} mutedColor={theme.muted} />
      {!skipPersonalSidebarFields && (
        <>
          <FieldRow label="Height" value={data.height} textColor={theme.text} mutedColor={theme.muted} />
          <FieldRow label="Religion" value={data.religion} textColor={theme.text} mutedColor={theme.muted} />
          <FieldRow label="Caste" value={data.caste} textColor={theme.text} mutedColor={theme.muted} />
          <FieldRow label="Manglik" value={data.manglik} textColor={theme.text} mutedColor={theme.muted} />
          <FieldRow label="Languages" value={data.languages} textColor={theme.text} mutedColor={theme.muted} />
        </>
      )}

      <SectionTitle color={theme.primary} accent={theme.accent} centered={centered}>
        Education & Career
      </SectionTitle>
      <FieldRow label="Education" value={data.education} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Occupation" value={data.occupation} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Annual Income" value={data.annualIncome} textColor={theme.text} mutedColor={theme.muted} />

      <SectionTitle color={theme.primary} accent={theme.accent} centered={centered}>
        Family Heritage
      </SectionTitle>
      <FieldRow label="Father's Name" value={data.fatherName} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Father's Occupation" value={data.fatherOccupation} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Mother's Name" value={data.motherName} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Mother's Occupation" value={data.motherOccupation} textColor={theme.text} mutedColor={theme.muted} />
      <FieldRow label="Siblings" value={data.siblings} textColor={theme.text} mutedColor={theme.muted} />

      <TextBlock title="Hobbies & Interests" text={data.hobbies} theme={theme} centered={centered} />
      <TextBlock title="Partner Expectations" text={data.partnerPreferences} theme={theme} centered={centered} />

      {!skipContact && (
        <>
          <SectionTitle color={theme.primary} accent={theme.accent} centered={centered}>
            Contact Information
          </SectionTitle>
          <FieldRow label="Mobile" value={data.phone} textColor={theme.text} mutedColor={theme.muted} />
          <FieldRow label="Email" value={data.email} textColor={theme.text} mutedColor={theme.muted} />
          <FieldRow label="Address" value={data.address} textColor={theme.text} mutedColor={theme.muted} />
        </>
      )}
    </>
  );
}

function ReligiousMotif({ motif, color }: { motif: BiodataMotifId; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }} aria-hidden>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={36} height={36} style={{ fill: color }}>
        <path d={MOTIF_SVG_PATHS[motif]} />
      </svg>
    </div>
  );
}

function Photo({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      crossOrigin="anonymous"
      style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', marginBottom: '12px' }}
    />
  );
}

export function BiodataFlatDocument({ data, theme }: { data: BiodataForm; theme: BiodataThemeConfig }) {
  const name = data.fullName?.trim() || 'Biodata';

  if (theme.layout === 'split') {
    return (
      <TemplateWrapper className="flex" style={{ background: theme.bg, fontFamily: font }}>
        <aside
          style={{
            width: '190px',
            flexShrink: 0,
            background: theme.sidebar,
            color: theme.onSidebar,
            padding: '28px 16px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {data.photo && (
              <img
                src={data.photo}
                alt=""
                crossOrigin="anonymous"
                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto 12px', display: 'block' }}
              />
            )}
            <h1 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>{name}</h1>
            <div style={{ width: '36px', height: '2px', background: theme.accent, margin: '0 auto 16px' }} />
          </div>

          <SectionTitle color={theme.onSidebar!} accent={theme.accent}>
            Contact
          </SectionTitle>
          {data.phone && (
            <p style={{ fontSize: '9px', margin: '0 0 8px', opacity: 0.95 }}>
              <strong style={{ display: 'block', fontSize: '7px', opacity: 0.65, marginBottom: '2px' }}>PHONE</strong>
              {data.phone}
            </p>
          )}
          {data.email && (
            <p style={{ fontSize: '9px', margin: '0 0 8px', opacity: 0.95, wordBreak: 'break-word' }}>
              <strong style={{ display: 'block', fontSize: '7px', opacity: 0.65, marginBottom: '2px' }}>EMAIL</strong>
              {data.email}
            </p>
          )}
          {data.address && (
            <p style={{ fontSize: '9px', margin: '0 0 8px', opacity: 0.95 }}>
              <strong style={{ display: 'block', fontSize: '7px', opacity: 0.65, marginBottom: '2px' }}>ADDRESS</strong>
              {data.address}
            </p>
          )}

          <SectionTitle color={theme.onSidebar!} accent={theme.accent}>
            Basic Details
          </SectionTitle>
          {[
            ['Height', data.height],
            ['Religion', data.religion],
            ['Caste', data.caste],
            ['Manglik', data.manglik],
            ['Languages', data.languages],
          ].map(([lbl, val]) =>
            val ? (
              <p key={lbl as string} style={{ fontSize: '9px', margin: '0 0 6px', opacity: 0.9 }}>
                <span style={{ opacity: 0.75 }}>{lbl}: </span>
                <strong>{val}</strong>
              </p>
            ) : null
          )}
        </aside>

        <main style={{ flex: 1, padding: '32px 28px', color: theme.text }}>
          <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: theme.primary, margin: '0 0 12px' }}>
            MARRIAGE BIODATA
          </p>
          <MainSections data={data} theme={theme} skipPersonalSidebarFields skipContact />
        </main>
      </TemplateWrapper>
    );
  }

  if (theme.layout === 'minimal') {
    return (
      <TemplateWrapper style={{ background: theme.bg, fontFamily: font, padding: '36px 40px' }}>
        <div style={{ height: '3px', background: theme.primary, marginBottom: '20px' }} />
        <p style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '0.2em', color: theme.muted, margin: '0 0 6px' }}>BIODATA PROFILE</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: theme.text, margin: 0 }}>{name}</h1>
            {data.occupation && <p style={{ fontSize: '11px', color: theme.muted, margin: '6px 0 0' }}>{data.occupation}</p>}
          </div>
          <Photo src={data.photo} alt="" />
        </div>
        <MainSections data={data} theme={theme} />
      </TemplateWrapper>
    );
  }

  // centered
  const centered = true;
  return (
    <TemplateWrapper
      style={{
        background: theme.bg,
        fontFamily: font,
        padding: '36px 48px',
        boxSizing: 'border-box',
      }}
    >
      {theme.headerBar?.top && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: theme.headerBar.top }} />}
      {theme.headerBar?.bottom && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: theme.headerBar.bottom }} />
      )}

      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        {theme.motif && <ReligiousMotif motif={theme.motif} color={theme.accent} />}
        {theme.subtitle && (
          <p style={{ fontSize: '10px', fontWeight: 700, color: theme.accent, margin: '0 0 10px', letterSpacing: '0.06em' }}>{theme.subtitle}</p>
        )}
        <p style={{ fontSize: '10px', fontWeight: 700, color: theme.accent, letterSpacing: '0.1em', margin: '0 0 16px' }}>BIODATA</p>
        {data.photo && (
          <img
            src={data.photo}
            alt=""
            crossOrigin="anonymous"
            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto 12px', display: 'block' }}
          />
        )}
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: theme.primary, margin: '0 0 6px' }}>{name}</h1>
        {data.occupation && (
          <p style={{ fontSize: '10px', fontStyle: 'italic', color: theme.muted, margin: '0 0 10px' }}>{data.occupation}</p>
        )}
        <div style={{ width: '90px', height: '1.5px', background: theme.accent, margin: '0 auto' }} />
      </header>

      <MainSections data={data} theme={theme} centered />
    </TemplateWrapper>
  );
}
