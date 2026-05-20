'use client';

import React from 'react';
import type { ResumeData } from './resume-types';

/* ═══════════════════════════════════════════════════════════════════════════
   Visual Resume Templates — colorful, form-driven, rendered as HTML
   These are printed to PDF via window.print() with @media print styles.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface VisualTemplate {
  id: string;
  name: string;
  description: string;
  accent: string;
  component: React.FC<{ data: ResumeData }>;
}

/* ── Shared helper ── */
const SectionTitle: React.FC<{
  children: React.ReactNode;
  color?: string;
  borderColor?: string;
}> = ({ children, color = '#0f172a', borderColor = '#e2e8f0' }) => (
  <h2
    style={{
      fontSize: '13px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color,
      borderBottom: `2px solid ${borderColor}`,
      paddingBottom: '4px',
      marginBottom: '10px',
      marginTop: '18px',
    }}
  >
    {children}
  </h2>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li style={{ fontSize: '11.5px', lineHeight: 1.55, marginBottom: '2px', color: '#334155' }}>
    {children}
  </li>
);

/* ═══════════════════════════════════════════════════════════════════════════
   1. Gradient Sidebar — Deep teal sidebar with white content area
   ═══════════════════════════════════════════════════════════════════════════ */
const GradientSidebar: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { contact, summary, skills, experience, education, projects } = data;
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '100%',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: '#fff',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '220px',
          flexShrink: 0,
          background: 'linear-gradient(180deg, #0f766e 0%, #064e3b 100%)',
          color: '#fff',
          padding: '32px 20px',
        }}
      >
        <p style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.05em' }}>
          {contact.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </p>

        <h3
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '10px',
            opacity: 0.7,
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            paddingBottom: '4px',
          }}
        >
          Contact
        </h3>
        {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github]
          .filter(Boolean)
          .map((item, i) => (
            <p key={i} style={{ fontSize: '10.5px', marginBottom: '5px', lineHeight: 1.4, opacity: 0.9 }}>
              {item}
            </p>
          ))}

        {skills && (
          <>
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '22px',
                marginBottom: '10px',
                opacity: 0.7,
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '4px',
              }}
            >
              Skills
            </h3>
            <p style={{ fontSize: '9.5px', lineHeight: 1.6, opacity: 0.9, margin: 0 }}>
              {skills.split(',').map((s) => s.trim()).filter(Boolean).join(' · ')}
            </p>
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
          {contact.fullName}
        </h1>
        <p style={{ fontSize: '14px', color: '#0f766e', fontWeight: 600, marginBottom: '10px' }}>
          {contact.headline}
        </p>
        {summary && (
          <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.6, marginBottom: '4px' }}>
            {summary}
          </p>
        )}

        {experience.length > 0 && (
          <>
            <SectionTitle color="#0f766e" borderColor="#d1fae5">
              Experience
            </SectionTitle>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{exp.title}</strong>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#0f766e', fontWeight: 500, marginBottom: '4px' }}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ''}
                </p>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <Bullet key={i}>{b}</Bullet>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <SectionTitle color="#0f766e" borderColor="#d1fae5">
              Education
            </SectionTitle>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{edu.degree}</strong>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#475569' }}>
                  {edu.school}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </>
        )}

        {projects.length > 0 && (
          <>
            <SectionTitle color="#0f766e" borderColor="#d1fae5">
              Projects
            </SectionTitle>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{proj.name}</strong>
                {proj.tech && (
                  <span style={{ fontSize: '10.5px', color: '#0f766e', marginLeft: '6px' }}>
                    ({proj.tech})
                  </span>
                )}
                <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{proj.description}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   2. Royal Navy — Bold navy header, gold accents
   ═══════════════════════════════════════════════════════════════════════════ */
const RoyalNavy: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { contact, summary, skills, experience, education, projects } = data;
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          padding: '28px 32px',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>{contact.fullName}</h1>
        <p style={{ fontSize: '14px', color: '#fbbf24', fontWeight: 600, marginBottom: '8px' }}>
          {contact.headline}
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i}>{item}</span>
            ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 32px' }}>
        {summary && (
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.65, marginBottom: '6px' }}>
            {summary}
          </p>
        )}

        {experience.length > 0 && (
          <>
            <SectionTitle color="#1e293b" borderColor="#fbbf24">
              Experience
            </SectionTitle>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{exp.title}</strong>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 500 }}>
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#1e293b', fontWeight: 500, marginBottom: '4px' }}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <Bullet key={i}>{b}</Bullet>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <SectionTitle color="#1e293b" borderColor="#fbbf24">
              Education
            </SectionTitle>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{edu.degree}</strong>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#475569' }}>
                  {edu.school}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </>
        )}

        {skills && (
          <>
            <SectionTitle color="#1e293b" borderColor="#fbbf24">
              Skills
            </SectionTitle>
            <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.65 }}>{skills}</p>
          </>
        )}

        {projects.length > 0 && (
          <>
            <SectionTitle color="#1e293b" borderColor="#fbbf24">
              Projects
            </SectionTitle>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{proj.name}</strong>
                {proj.tech && (
                  <span style={{ fontSize: '10.5px', color: '#64748b', marginLeft: '6px' }}>
                    ({proj.tech})
                  </span>
                )}
                <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{proj.description}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   3. Coral Modern — Warm coral accents, clean white layout
   ═══════════════════════════════════════════════════════════════════════════ */
const CoralModern: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { contact, summary, skills, experience, education, projects } = data;
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: '#fff',
        padding: '32px 32px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          {contact.fullName}
        </h1>
        <p style={{ fontSize: '14px', color: '#e11d48', fontWeight: 600, marginBottom: '10px' }}>
          {contact.headline}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '6px 16px',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i}>{item}</span>
            ))}
        </div>
        <div
          style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #e11d48, #f43f5e)',
            borderRadius: '2px',
            margin: '14px auto 0',
          }}
        />
      </div>

      {summary && (
        <p
          style={{
            fontSize: '12px',
            color: '#475569',
            lineHeight: 1.65,
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto 6px',
          }}
        >
          {summary}
        </p>
      )}

      {experience.length > 0 && (
        <>
          <SectionTitle color="#e11d48" borderColor="#fecdd3">
            Experience
          </SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>{exp.title}</strong>
                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                  {exp.startDate} — {exp.endDate}
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#e11d48', fontWeight: 500, marginBottom: '4px' }}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ''}
              </p>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <Bullet key={i}>{b}</Bullet>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionTitle color="#e11d48" borderColor="#fecdd3">
            Education
          </SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{edu.degree}</strong>
                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#475569' }}>
                {edu.school}
                {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
              </p>
            </div>
          ))}
        </>
      )}

      {skills && (
        <>
          <SectionTitle color="#e11d48" borderColor="#fecdd3">
            Skills
          </SectionTitle>
          <p style={{ fontSize: '10.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
            {skills.split(',').map((s) => s.trim()).filter(Boolean).join(' · ')}
          </p>
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionTitle color="#e11d48" borderColor="#fecdd3">
            Projects
          </SectionTitle>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '12px', color: '#0f172a' }}>{proj.name}</strong>
              {proj.tech && (
                <span style={{ fontSize: '10.5px', color: '#e11d48', marginLeft: '6px' }}>
                  ({proj.tech})
                </span>
              )}
              <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{proj.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   4. Classic Mono — Pure black-and-white, maximum ATS compatibility
   ═══════════════════════════════════════════════════════════════════════════ */
const ClassicMono: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { contact, summary, skills, experience, education, projects } = data;
  const dark = '#111827'; const mid = '#374151'; const light = '#6b7280';
  return (
    <div style={{ width: '100%', minHeight: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#fff', padding: '36px 36px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: dark, marginBottom: '2px', textAlign: 'center' }}>{contact.fullName}</h1>
      <p style={{ fontSize: '13px', color: mid, fontWeight: 600, textAlign: 'center', marginBottom: '8px' }}>{contact.headline}</p>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 14px', fontSize: '10.5px', color: light, marginBottom: '4px' }}>
        {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github].filter(Boolean).map((item, i) => <span key={i}>{item}</span>)}
      </div>
      <div style={{ height: '1.5px', background: dark, margin: '10px 0 6px' }} />

      {summary && <p style={{ fontSize: '11.5px', color: mid, lineHeight: 1.6, marginBottom: '4px' }}>{summary}</p>}

      {experience.length > 0 && <>
        <SectionTitle color={dark} borderColor={dark}>Experience</SectionTitle>
        {experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '12.5px', color: dark }}>{exp.title}</strong>
              <span style={{ fontSize: '10.5px', color: light }}>{exp.startDate} — {exp.endDate}</span>
            </div>
            <p style={{ fontSize: '11px', color: mid, fontWeight: 500, marginBottom: '3px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
            <ul style={{ paddingLeft: '16px', margin: 0 }}>{exp.bullets.filter(Boolean).map((b, i) => <Bullet key={i}>{b}</Bullet>)}</ul>
          </div>
        ))}
      </>}

      {education.length > 0 && <>
        <SectionTitle color={dark} borderColor={dark}>Education</SectionTitle>
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '12px', color: dark }}>{edu.degree}</strong>
              <span style={{ fontSize: '10.5px', color: light }}>{edu.startDate} — {edu.endDate}</span>
            </div>
            <p style={{ fontSize: '11px', color: mid }}>{edu.school}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
          </div>
        ))}
      </>}

      {skills && <>
        <SectionTitle color={dark} borderColor={dark}>Skills</SectionTitle>
        <p style={{ fontSize: '11.5px', color: mid, lineHeight: 1.6 }}>{skills}</p>
      </>}

      {projects.length > 0 && <>
        <SectionTitle color={dark} borderColor={dark}>Projects</SectionTitle>
        {projects.map(proj => (
          <div key={proj.id} style={{ marginBottom: '6px' }}>
            <strong style={{ fontSize: '11.5px', color: dark }}>{proj.name}</strong>
            {proj.tech && <span style={{ fontSize: '10px', color: light, marginLeft: '6px' }}>({proj.tech})</span>}
            <p style={{ fontSize: '11px', color: mid, marginTop: '1px' }}>{proj.description}</p>
          </div>
        ))}
      </>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   5. Blue Professional — Subtle blue accents, left-aligned header
   ═══════════════════════════════════════════════════════════════════════════ */
const BlueProfessional: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { contact, summary, skills, experience, education, projects } = data;
  const blue = '#1d4ed8'; const dark = '#0f172a'; const mid = '#475569'; const light = '#94a3b8'; const borderBlue = '#bfdbfe';
  return (
    <div style={{ width: '100%', minHeight: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#fff', padding: '36px 36px' }}>
      {/* Blue top bar */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${blue}, #3b82f6)`, marginBottom: '24px', borderRadius: '2px' }} />
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: dark, marginBottom: '2px' }}>{contact.fullName}</h1>
      <p style={{ fontSize: '13px', color: blue, fontWeight: 600, marginBottom: '8px' }}>{contact.headline}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '10.5px', color: light, marginBottom: '6px' }}>
        {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github].filter(Boolean).map((item, i) => <span key={i}>{item}</span>)}
      </div>

      {summary && <><SectionTitle color={blue} borderColor={borderBlue}>Summary</SectionTitle><p style={{ fontSize: '11.5px', color: mid, lineHeight: 1.6, marginBottom: '4px' }}>{summary}</p></>}

      {experience.length > 0 && <>
        <SectionTitle color={blue} borderColor={borderBlue}>Experience</SectionTitle>
        {experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '12.5px', color: dark }}>{exp.title}</strong>
              <span style={{ fontSize: '10.5px', color: light }}>{exp.startDate} — {exp.endDate}</span>
            </div>
            <p style={{ fontSize: '11px', color: blue, fontWeight: 500, marginBottom: '3px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
            <ul style={{ paddingLeft: '16px', margin: 0 }}>{exp.bullets.filter(Boolean).map((b, i) => <Bullet key={i}>{b}</Bullet>)}</ul>
          </div>
        ))}
      </>}

      {education.length > 0 && <>
        <SectionTitle color={blue} borderColor={borderBlue}>Education</SectionTitle>
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '12px', color: dark }}>{edu.degree}</strong>
              <span style={{ fontSize: '10.5px', color: light }}>{edu.startDate} — {edu.endDate}</span>
            </div>
            <p style={{ fontSize: '11px', color: mid }}>{edu.school}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
          </div>
        ))}
      </>}

      {skills && <>
        <SectionTitle color={blue} borderColor={borderBlue}>Skills</SectionTitle>
        <p style={{ fontSize: '11.5px', color: mid, lineHeight: 1.6 }}>{skills}</p>
      </>}

      {projects.length > 0 && <>
        <SectionTitle color={blue} borderColor={borderBlue}>Projects</SectionTitle>
        {projects.map(proj => (
          <div key={proj.id} style={{ marginBottom: '6px' }}>
            <strong style={{ fontSize: '11.5px', color: dark }}>{proj.name}</strong>
            {proj.tech && <span style={{ fontSize: '10px', color: blue, marginLeft: '6px' }}>({proj.tech})</span>}
            <p style={{ fontSize: '11px', color: mid, marginTop: '1px' }}>{proj.description}</p>
          </div>
        ))}
      </>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   6. Emerald Executive — Green accent bar, two-tone header
   ═══════════════════════════════════════════════════════════════════════════ */
const EmeraldExecutive: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { contact, summary, skills, experience, education, projects } = data;
  const green = '#059669'; const dark = '#0f172a'; const mid = '#475569'; const light = '#94a3b8'; const borderGreen = '#a7f3d0';
  return (
    <div style={{ width: '100%', minHeight: '100%', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#fff' }}>
      {/* Header with subtle green bg */}
      <div style={{ padding: '28px 36px 20px', borderBottom: `3px solid ${green}` }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: dark, marginBottom: '2px' }}>{contact.fullName}</h1>
        <p style={{ fontSize: '13px', color: green, fontWeight: 600, marginBottom: '8px' }}>{contact.headline}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '10.5px', color: mid }}>
          {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github].filter(Boolean).map((item, i) => <span key={i}>{item}</span>)}
        </div>
      </div>

      <div style={{ padding: '20px 36px 36px' }}>
        {summary && <p style={{ fontSize: '11.5px', color: mid, lineHeight: 1.6, marginBottom: '4px' }}>{summary}</p>}

        {experience.length > 0 && <>
          <SectionTitle color={green} borderColor={borderGreen}>Experience</SectionTitle>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12.5px', color: dark }}>{exp.title}</strong>
                <span style={{ fontSize: '10.5px', color: light }}>{exp.startDate} — {exp.endDate}</span>
              </div>
              <p style={{ fontSize: '11px', color: green, fontWeight: 500, marginBottom: '3px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>{exp.bullets.filter(Boolean).map((b, i) => <Bullet key={i}>{b}</Bullet>)}</ul>
            </div>
          ))}
        </>}

        {education.length > 0 && <>
          <SectionTitle color={green} borderColor={borderGreen}>Education</SectionTitle>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12px', color: dark }}>{edu.degree}</strong>
                <span style={{ fontSize: '10.5px', color: light }}>{edu.startDate} — {edu.endDate}</span>
              </div>
              <p style={{ fontSize: '11px', color: mid }}>{edu.school}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
            </div>
          ))}
        </>}

        {skills && <>
          <SectionTitle color={green} borderColor={borderGreen}>Skills</SectionTitle>
          <p style={{ fontSize: '11.5px', color: mid, lineHeight: 1.6 }}>{skills}</p>
        </>}

        {projects.length > 0 && <>
          <SectionTitle color={green} borderColor={borderGreen}>Projects</SectionTitle>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '6px' }}>
              <strong style={{ fontSize: '11.5px', color: dark }}>{proj.name}</strong>
              {proj.tech && <span style={{ fontSize: '10px', color: green, marginLeft: '6px' }}>({proj.tech})</span>}
              <p style={{ fontSize: '11px', color: mid, marginTop: '1px' }}>{proj.description}</p>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Export all visual templates
   ═══════════════════════════════════════════════════════════════════════════ */
export const VISUAL_TEMPLATES: VisualTemplate[] = [
  {
    id: 'classic-mono',
    name: 'Classic Mono',
    description: 'Pure black & white — maximum ATS score, no distractions',
    accent: 'bg-gray-100 text-gray-700',
    component: ClassicMono,
  },
  {
    id: 'blue-professional',
    name: 'Blue Professional',
    description: 'Subtle blue accents — corporate & engineering roles',
    accent: 'bg-blue-100 text-blue-700',
    component: BlueProfessional,
  },
  {
    id: 'emerald-executive',
    name: 'Emerald Executive',
    description: 'Green accent header — management & consulting',
    accent: 'bg-emerald-100 text-emerald-700',
    component: EmeraldExecutive,
  },
  {
    id: 'gradient-sidebar',
    name: 'Gradient Sidebar',
    description: 'Teal sidebar with skills — creative & tech roles',
    accent: 'bg-teal-100 text-teal-700',
    component: GradientSidebar,
  },
  {
    id: 'royal-navy',
    name: 'Royal Navy',
    description: 'Bold navy header, gold accents — executive & leadership',
    accent: 'bg-amber-100 text-amber-700',
    component: RoyalNavy,
  },
  {
    id: 'coral-modern',
    name: 'Coral Modern',
    description: 'Warm coral, centered header — design & product roles',
    accent: 'bg-rose-100 text-rose-700',
    component: CoralModern,
  },
];

