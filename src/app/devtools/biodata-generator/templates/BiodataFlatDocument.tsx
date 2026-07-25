'use client';

import React from 'react';
import type { BiodataForm } from '../types';
import type { BiodataThemeConfig } from '../biodata-theme';
import { MOTIF_SVG_PATHS, type BiodataMotifId } from '../biodata-motifs';
import { BIODATA_BACKGROUND_IMAGES } from '../biodata-backgrounds';
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

function CompactContact({ data, color, muted }: { data: BiodataForm; color: string; muted: string }) {
  return (
    <div style={{ fontSize: '10px', lineHeight: 1.65, color }}>
      {data.phone && <div><strong style={{ color: muted }}>Phone</strong> {data.phone}</div>}
      {data.email && <div><strong style={{ color: muted }}>Email</strong> {data.email}</div>}
      {data.address && <div><strong style={{ color: muted }}>Location</strong> {data.address}</div>}
    </div>
  );
}

function BotanicalAccent({ color }: { color: string }) {
  return (
    <svg width="138" height="230" viewBox="0 0 138 230" style={{ position: 'absolute', right: 18, top: 54, opacity: 0.42 }} aria-hidden>
      <path d="M92 214C74 172 74 128 92 82c8-22 14-42 9-66" fill="none" stroke={color} strokeWidth="2" />
      <path d="M92 84c-24-13-44-13-60 2 20 9 39 8 60-2ZM86 132c-26-7-46-3-60 14 23 5 42 0 60-14ZM91 184c-21-5-37 0-48 15 18 2 34-3 48-15Z" fill={color} />
      <circle cx="108" cy="30" r="7" fill={color} />
      <circle cx="101" cy="60" r="5" fill={color} />
      <circle cx="77" cy="112" r="4" fill={color} />
    </svg>
  );
}

function OrnateCorner({ position, color }: { position: 'tl' | 'tr' | 'bl' | 'br'; color: string }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 120,
    height: 120,
    opacity: 0.78,
    ...(position.includes('t') ? { top: 10 } : { bottom: 10 }),
    ...(position.includes('l') ? { left: 10 } : { right: 10 }),
    transform: `${position === 'tr' ? 'scaleX(-1)' : ''}${position === 'bl' ? 'scaleY(-1)' : ''}${position === 'br' ? 'scale(-1)' : ''}`,
  };
  return (
    <svg viewBox="0 0 120 120" style={style} aria-hidden>
      <path d="M8 98c34-4 58-20 73-47 7-13 13-27 29-37" fill="none" stroke={color} strokeWidth="2" />
      <path d="M25 96c9-25 28-39 57-42-7 22-26 37-57 42ZM40 75c-8-24-3-43 15-58 7 22 2 41-15 58ZM70 49c-3-19 4-33 22-43 1 18-6 32-22 43Z" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="96" r="4" fill={color} />
      <circle cx="55" cy="56" r="3" fill={color} />
      <circle cx="91" cy="16" r="3" fill={color} />
    </svg>
  );
}

export function BiodataFlatDocument({ data, theme }: { data: BiodataForm; theme: BiodataThemeConfig }) {
  const name = data.fullName?.trim() || 'Biodata';

  if (theme.layout === 'split') {
    return (
      <TemplateWrapper className="flex" style={{ background: theme.bg, fontFamily: font }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: theme.accent }} />
        <aside
          style={{
            width: '190px',
            flexShrink: 0,
            background: theme.sidebar,
            color: theme.onSidebar,
            padding: '34px 16px 28px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {data.photo && (
              <img
                src={data.photo}
                alt=""
                crossOrigin="anonymous"
                style={{
                  width: '104px',
                  height: '104px',
                  objectFit: 'cover',
                  margin: '0 auto 14px',
                  display: 'block',
                  border: `2px solid ${theme.accent}`,
                }}
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

        <main style={{ flex: 1, padding: '40px 30px 32px', color: theme.text }}>
          <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: theme.accent, margin: '0 0 12px' }}>
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

  if (theme.layout === 'floral') {
    const floralBg = BIODATA_BACKGROUND_IMAGES.floral;
    return (
      <TemplateWrapper style={{
        background: theme.bg,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: '48px 54px',
        ...(floralBg ? { backgroundImage: `url(${floralBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      }}>
        <BotanicalAccent color={theme.accent} />
        <header style={{ marginBottom: '26px' }}>
          <h1 style={{ fontSize: '44px', fontWeight: 400, color: theme.text, margin: 0, letterSpacing: '0.02em' }}>{name}</h1>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: '34px', position: 'relative', zIndex: 1 }}>
          <aside>
            {data.photo && (
              <img src={data.photo} alt="" crossOrigin="anonymous" style={{ width: '180px', height: '210px', objectFit: 'cover', display: 'block', marginBottom: '24px' }} />
            )}
            <TextBlock title="Lifestyle" text={data.hobbies || data.about} theme={theme} />
            <TextBlock title="Expectations" text={data.partnerPreferences} theme={theme} />
            <SectionTitle color={theme.text} accent={theme.accent}>Contacts</SectionTitle>
            <CompactContact data={data} color={theme.muted} muted={theme.text} />
          </aside>
          <main>
            <TextBlock title="About" text={data.about} theme={theme} />
            <SectionTitle color={theme.text} accent={theme.accent}>Personal Details</SectionTitle>
            <FieldRow label="DOB" value={data.dateOfBirth} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Time" value={data.birthTime} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Birth Place" value={data.birthPlace} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Height" value={data.height} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Religion / Caste" value={[data.religion, data.caste].filter(Boolean).join(' / ')} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Manglik" value={data.manglik} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Education" value={data.education} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Profession" value={data.occupation} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Languages" value={data.languages} textColor={theme.text} mutedColor={theme.muted} />
            <SectionTitle color={theme.text} accent={theme.accent}>Family</SectionTitle>
            <FieldRow label="Parents" value={[data.fatherName, data.fatherOccupation, data.motherName, data.motherOccupation].filter(Boolean).join(' | ')} textColor={theme.text} mutedColor={theme.muted} />
            <FieldRow label="Siblings" value={data.siblings} textColor={theme.text} mutedColor={theme.muted} />
          </main>
        </div>
      </TemplateWrapper>
    );
  }

  if (theme.layout === 'banner') {
    const slateBg = BIODATA_BACKGROUND_IMAGES.slate;
    return (
      <TemplateWrapper className="flex" style={{
        background: '#ffffff',
        fontFamily: font,
        ...(slateBg ? { backgroundImage: `url(${slateBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      }}>
        <aside style={{ width: '220px', background: theme.bg, padding: '220px 20px 32px', color: theme.text }}>
          <TextBlock title="About" text={data.about} theme={theme} />
          <TextBlock title="Lifestyle" text={data.hobbies} theme={theme} />
          <SectionTitle color={theme.text} accent={theme.primary}>Contact</SectionTitle>
          <CompactContact data={data} color={theme.muted} muted={theme.text} />
        </aside>
        <main style={{ flex: 1, padding: '180px 30px 34px', color: theme.text }}>
          <div style={{ position: 'absolute', left: 170, right: 0, top: 58, height: '120px', background: theme.primary }} />
          {data.photo && (
            <img src={data.photo} alt="" crossOrigin="anonymous" style={{ position: 'absolute', left: 44, top: 30, width: '140px', height: '140px', objectFit: 'cover', borderRadius: '999px', border: '7px solid #ffffff' }} />
          )}
          <h1 style={{ position: 'absolute', left: 250, top: 92, color: '#ffffff', fontSize: '30px', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>{name}</h1>
          <MainSections data={data} theme={theme} skipContact />
        </main>
      </TemplateWrapper>
    );
  }

  if (theme.layout === 'ornate') {
    const royalBg = BIODATA_BACKGROUND_IMAGES.royal;
    return (
      <TemplateWrapper style={{
        background: theme.bg,
        fontFamily: font,
        padding: '34px 70px',
        textAlign: 'center',
        ...(royalBg ? { backgroundImage: `url(${royalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      }}>
        <div style={{ position: 'absolute', inset: 20, border: `1.5px solid ${theme.accent}`, opacity: 0.75 }} />
        <OrnateCorner position="tl" color={theme.accent} />
        <OrnateCorner position="tr" color={theme.accent} />
        <OrnateCorner position="bl" color={theme.accent} />
        <OrnateCorner position="br" color={theme.accent} />
        <h1 style={{ color: theme.accent, fontSize: '30px', fontFamily: "'Georgia', serif", fontStyle: 'italic', margin: '0 0 16px' }}>{name}</h1>
        {data.photo && (
          <img src={data.photo} alt="" crossOrigin="anonymous" style={{ width: '118px', height: '118px', objectFit: 'cover', borderRadius: '999px', border: `4px solid ${theme.accent}`, margin: '0 auto 22px', display: 'block' }} />
        )}
        <div style={{ position: 'absolute', left: 247, top: 240, width: 300, height: 300, borderRadius: '50%', border: `2px solid ${theme.accent}`, opacity: 0.12 }} />
        <main style={{ position: 'relative', zIndex: 1, maxWidth: '520px', margin: '0 auto', textAlign: 'left' }}>
          <MainSections data={data} theme={theme} centered skipContact />
          <SectionTitle color={theme.accent} accent={theme.accent} centered>Contact</SectionTitle>
          <CompactContact data={data} color={theme.text} muted={theme.accent} />
        </main>
      </TemplateWrapper>
    );
  }

  return (
    <TemplateWrapper
      style={{
        background: theme.bg,
        fontFamily: font,
        padding: '36px 48px',
        boxSizing: 'border-box',
      }}
    >
      {theme.id === 'classic' && (
        <>
          <div style={{ position: 'absolute', top: '22px', left: '28px', right: '28px', height: '2px', background: theme.accent }} />
          <div style={{ position: 'absolute', bottom: '22px', left: '28px', right: '28px', height: '2px', background: theme.accent }} />
          <div style={{ position: 'absolute', top: '28px', bottom: '28px', left: '22px', width: '2px', background: theme.primary, opacity: 0.18 }} />
          <div style={{ position: 'absolute', top: '28px', bottom: '28px', right: '22px', width: '2px', background: theme.primary, opacity: 0.18 }} />
        </>
      )}
      {theme.headerBar?.top && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: theme.headerBar.top }} />}
      {theme.headerBar?.bottom && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: theme.headerBar.bottom }} />
      )}

      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        {theme.motif && <ReligiousMotif motif={theme.motif} color={theme.accent} />}
        {theme.subtitle && (
          <p style={{ fontSize: '10px', fontWeight: 700, color: theme.accent, margin: '0 0 10px', letterSpacing: '0.06em' }}>{theme.subtitle}</p>
        )}
        <p style={{ fontSize: '10px', fontWeight: 700, color: theme.accent, letterSpacing: '0.1em', margin: '0 0 16px' }}>MARRIAGE BIODATA</p>
        {data.photo && (
          <img
            src={data.photo}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              margin: '0 auto 12px',
              display: 'block',
              border: theme.id === 'classic' ? `2px solid ${theme.accent}` : undefined,
            }}
          />
        )}
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: theme.primary, margin: '0 0 6px' }}>{name}</h1>
        {data.occupation && (
          <p style={{ fontSize: '10px', fontStyle: 'italic', color: theme.muted, margin: '0 0 10px' }}>{data.occupation}</p>
        )}
        <div style={{ width: '90px', height: '1.5px', background: theme.accent, margin: '0 auto' }} />
      </header>

      <MainSections data={data} theme={theme} centered={true} />
    </TemplateWrapper>
  );
}
