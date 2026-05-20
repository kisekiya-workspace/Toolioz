import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_ALT =
  'Toolioz — Free finance calculators, developer tools, PDF utilities, and marriage biodata maker';

const OUTFIT_SEMIBOLD =
  'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e6yC4E.ttf';
const OUTFIT_EXTRABOLD =
  'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4bCyC4E.ttf';

async function loadLogoDataUri() {
  const svg = await readFile(join(process.cwd(), 'public/tooliozLogo.svg'), 'utf8');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function loadFont(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load font: ${url}`);
  return res.arrayBuffer();
}

async function loadFonts() {
  const [semibold, extrabold] = await Promise.all([
    loadFont(OUTFIT_SEMIBOLD),
    loadFont(OUTFIT_EXTRABOLD),
  ]);
  return [
    { name: 'Outfit', data: extrabold, weight: 800 as const, style: 'normal' as const },
    { name: 'Outfit', data: semibold, weight: 600 as const, style: 'normal' as const },
  ];
}

/** Shared 1200×630 social preview card for Open Graph & Twitter. */
export async function renderOgImage() {
  const [logoSrc, fonts] = await Promise.all([loadLogoDataUri(), loadFonts()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0b1220 0%, #152347 42%, #1d4ed8 100%)',
          fontFamily: 'Outfit',
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex',
          }}
        />
        {/* Glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.45) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(43,147,72,0.35) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '52px 60px',
          }}
        >
          {/* Header: logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="" width={56} height={56} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: -1.5,
                  lineHeight: 1,
                }}
              >
                Toolioz
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#93c5fd',
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                toolioz.com
              </span>
            </div>
          </div>

          {/* Headline block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 20 }}>
              <div
                style={{
                  width: 6,
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #2B9348 0%, #4ade80 100%)',
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span
                  style={{
                    fontSize: 58,
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.08,
                    letterSpacing: -2,
                  }}
                >
                  Free tools that run
                  <span style={{ color: '#bfdbfe' }}> in your browser</span>
                </span>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: 'rgba(219,234,254,0.92)',
                    lineHeight: 1.4,
                    letterSpacing: -0.3,
                  }}
                >
                  SIP & tax · JSON & dev utilities · PDF merge · Biodata & ATS resume
                </span>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Finance', accent: '#3b82f6' },
              { label: 'DevTools', accent: '#f59e0b' },
              { label: 'PDF', accent: '#ef4444' },
              { label: 'Biodata', accent: '#db2777' },
            ].map(({ label, accent }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: -0.2,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: accent,
                  }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts,
    }
  );
}
