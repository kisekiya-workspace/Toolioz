export type ResumeTemplateId = 'balanced' | 'editorial' | 'compact';

export type ResumeExperience = {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  bullets: string;
};

export type ResumeEducation = {
  id: string;
  degree: string;
  school: string;
  location: string;
  dates: string;
  details: string;
};

export type ResumeProject = {
  id: string;
  name: string;
  link: string;
  dates: string;
  bullets: string;
};

export type ResumeForm = {
  fullName: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: string;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: string;
  languages: string;
};

export type ResumeWorkspaceView = 'edit' | 'preview' | 'latex';
export type LatexEditMode = 'auto' | 'manual';

export type ResumeWorkspaceState = {
  form: ResumeForm;
  templateId: ResumeTemplateId;
  latexSource: string;
  latexMode: LatexEditMode;
  activeView: ResumeWorkspaceView;
};

export type ResumeMetrics = {
  completion: number;
  atsReadiness: number;
  estimatedPages: number;
  wordCount: number;
  bulletCount: number;
  skillCount: number;
  sectionCount: number;
};

export type TemplateTheme = {
  id: ResumeTemplateId;
  label: string;
  description: string;
  accent: string;
  accentSoft: string;
  border: string;
  paper: string;
  canvas: string;
  nameSize: number;
  margin: number;
  lineHeight: number;
  compact: boolean;
};

const RESUME_TEMPLATE_THEMES: Record<ResumeTemplateId, TemplateTheme> = {
  balanced: {
    id: 'balanced',
    label: 'Balanced ATS',
    description: 'Single-column, recruiter-friendly, and calm enough for quick screening.',
    accent: '#0f766e',
    accentSoft: 'rgba(15, 118, 110, 0.10)',
    border: '#d8e3df',
    paper: '#ffffff',
    canvas: '#f7f4ed',
    nameSize: 28,
    margin: 48,
    lineHeight: 1.28,
    compact: false,
  },
  editorial: {
    id: 'editorial',
    label: 'Editorial',
    description: 'Warmer and more expressive with slightly looser spacing.',
    accent: '#b45309',
    accentSoft: 'rgba(180, 83, 9, 0.11)',
    border: '#e7d8c0',
    paper: '#fffdf8',
    canvas: '#faf3e8',
    nameSize: 31,
    margin: 50,
    lineHeight: 1.3,
    compact: false,
  },
  compact: {
    id: 'compact',
    label: 'Compact',
    description: 'Dense, highly structured, and tuned for experienced candidates.',
    accent: '#111827',
    accentSoft: 'rgba(17, 24, 39, 0.08)',
    border: '#cfd5dc',
    paper: '#ffffff',
    canvas: '#eef1f4',
    nameSize: 26,
    margin: 42,
    lineHeight: 1.22,
    compact: true,
  },
};

const LEGACY_STORAGE_KEY = 'ats_resume_form';
const WORKSPACE_STORAGE_KEY = 'resume_builder_workspace_v2';

function createId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `resume-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getTemplateTheme(templateId: ResumeTemplateId): TemplateTheme {
  return RESUME_TEMPLATE_THEMES[templateId];
}

export function listTemplateThemes(): TemplateTheme[] {
  return Object.values(RESUME_TEMPLATE_THEMES);
}

export function createExperience(overrides: Partial<ResumeExperience> = {}): ResumeExperience {
  return {
    id: createId(),
    role: '',
    company: '',
    location: '',
    dates: '',
    bullets: '',
    ...overrides,
  };
}

export function createEducation(overrides: Partial<ResumeEducation> = {}): ResumeEducation {
  return {
    id: createId(),
    degree: '',
    school: '',
    location: '',
    dates: '',
    details: '',
    ...overrides,
  };
}

export function createProject(overrides: Partial<ResumeProject> = {}): ResumeProject {
  return {
    id: createId(),
    name: '',
    link: '',
    dates: '',
    bullets: '',
    ...overrides,
  };
}

export function createBlankResume(): ResumeForm {
  return {
    fullName: '',
    headline: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    summary: '',
    skills: '',
    experiences: [createExperience()],
    education: [createEducation()],
    projects: [createProject()],
    certifications: '',
    languages: '',
  };
}

export const SAMPLE_RESUME_FORM: ResumeForm = {
  fullName: 'Anaya Sharma',
  headline: 'Senior Frontend Engineer | React, TypeScript, Accessibility',
  location: 'Bengaluru, India',
  email: 'anaya.sharma@example.com',
  phone: '+91 98765 43210',
  linkedin: 'linkedin.com/in/anaya-sharma',
  website: 'anaya.dev',
  summary:
    'Frontend engineer with 6+ years of experience building accessible, high-performance web applications. Known for design systems, product quality, and clear, low-friction user experiences that ship quickly and scale well.',
  skills:
    'React, TypeScript, Next.js, JavaScript, CSS, Accessibility, Testing, Design Systems, REST APIs, Git',
  experiences: [
    createExperience({
      role: 'Senior Frontend Engineer',
      company: 'Northstar Labs',
      location: 'Bengaluru, India',
      dates: '2022 - Present',
      bullets:
        'Led migration of the product dashboard to React and TypeScript, reducing UI bugs and improving maintainability.\nPartnered with product and design teams to deliver accessible UI components with consistent spacing, states, and keyboard support.\nImproved page performance by optimizing bundle size, deferred loading patterns, and image delivery.',
    }),
    createExperience({
      role: 'Frontend Engineer',
      company: 'Morning Stack',
      location: 'Remote',
      dates: '2019 - 2022',
      bullets:
        'Built a reusable component library that accelerated feature delivery across multiple product teams.\nReworked onboarding flows with stronger information hierarchy, clearer feedback, and better conversion rates.\nIntroduced testing and review checklists that made releases easier to validate and less risky to ship.',
    }),
  ],
  education: [
    createEducation({
      degree: 'B.Tech in Computer Science',
      school: 'National Institute of Technology, Surat',
      location: 'Surat, India',
      dates: '2015 - 2019',
      details: 'Relevant focus: data structures, web systems, and user interface engineering.',
    }),
  ],
  projects: [
    createProject({
      name: 'Design System Migration',
      link: 'github.com/anaya/design-system',
      dates: '2023',
      bullets:
        'Standardized 40+ reusable components and documented usage patterns for engineering teams.\nCreated validation and QA checklists so product releases were easier to review.\nReduced duplicate UI work across squads by aligning tokens, spacing, and interaction states.',
    }),
    createProject({
      name: 'Portfolio Runtime Refresh',
      link: 'anaya.dev',
      dates: '2024',
      bullets:
        'Rebuilt the portfolio as a fast static experience with stronger SEO and mobile performance.\nAdded a sharper visual hierarchy so case studies were easier to scan.\nImproved Lighthouse scores across performance and accessibility budgets.',
    }),
  ],
  certifications:
    'Google UX Design Certificate\nMeta Front-End Developer Professional Certificate',
  languages: 'English, Hindi',
};

type LegacyResumeForm = {
  fullName?: string;
  headline?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  skills?: string;
  experienceRole?: string;
  experienceCompany?: string;
  experienceLocation?: string;
  experienceDates?: string;
  experienceBullets?: string;
  educationDegree?: string;
  educationSchool?: string;
  educationLocation?: string;
  educationDates?: string;
  projectName?: string;
  projectBullets?: string;
  certifications?: string;
};

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function splitLines(value: string): string[] {
  return value
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitSkills(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function latexEscape(value: string): string {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function sanitizeFileName(value: string, extension = 'pdf'): string {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const fallback = cleaned || 'resume';
  const fileName = fallback.toLowerCase().endsWith(`.${extension}`) ? fallback : `${fallback}.${extension}`;
  return fileName;
}

export function normalizeResumeForm(input?: Partial<ResumeForm> | LegacyResumeForm | null): ResumeForm {
  const base = createBlankResume();

  if (!input || typeof input !== 'object') {
    return base;
  }

  const legacy = input as LegacyResumeForm;
  const partial = input as Partial<ResumeForm>;

  const experiences =
    Array.isArray(partial.experiences) && partial.experiences.length > 0
      ? partial.experiences.map((entry) =>
          createExperience({
            id: entry?.id || createId(),
            role: normalizeText(entry?.role),
            company: normalizeText(entry?.company),
            location: normalizeText(entry?.location),
            dates: normalizeText(entry?.dates),
            bullets: normalizeText(entry?.bullets),
          }),
        )
      : legacy.experienceRole || legacy.experienceCompany
        ? [
            createExperience({
              role: normalizeText(legacy.experienceRole),
              company: normalizeText(legacy.experienceCompany),
              location: normalizeText(legacy.experienceLocation),
              dates: normalizeText(legacy.experienceDates),
              bullets: normalizeText(legacy.experienceBullets),
            }),
          ]
        : base.experiences;

  const education =
    Array.isArray(partial.education) && partial.education.length > 0
      ? partial.education.map((entry) =>
          createEducation({
            id: entry?.id || createId(),
            degree: normalizeText(entry?.degree),
            school: normalizeText(entry?.school),
            location: normalizeText(entry?.location),
            dates: normalizeText(entry?.dates),
            details: normalizeText(entry?.details),
          }),
        )
      : legacy.educationDegree || legacy.educationSchool
        ? [
            createEducation({
              degree: normalizeText(legacy.educationDegree),
              school: normalizeText(legacy.educationSchool),
              location: normalizeText(legacy.educationLocation),
              dates: normalizeText(legacy.educationDates),
            }),
          ]
        : base.education;

  const projects =
    Array.isArray(partial.projects) && partial.projects.length > 0
      ? partial.projects.map((entry) =>
          createProject({
            id: entry?.id || createId(),
            name: normalizeText(entry?.name),
            link: normalizeText(entry?.link),
            dates: normalizeText(entry?.dates),
            bullets: normalizeText(entry?.bullets),
          }),
        )
      : legacy.projectName
        ? [
            createProject({
              name: normalizeText(legacy.projectName),
              bullets: normalizeText(legacy.projectBullets),
            }),
          ]
        : base.projects;

  return {
    fullName: normalizeText(partial.fullName ?? legacy.fullName),
    headline: normalizeText(partial.headline ?? legacy.headline),
    location: normalizeText(partial.location ?? legacy.location),
    email: normalizeText(partial.email ?? legacy.email),
    phone: normalizeText(partial.phone ?? legacy.phone),
    linkedin: normalizeText(partial.linkedin ?? legacy.linkedin),
    website: normalizeText(partial.website ?? legacy.website),
    summary: normalizeText(partial.summary ?? legacy.summary),
    skills: normalizeText(partial.skills ?? legacy.skills),
    experiences,
    education,
    projects,
    certifications: normalizeText(partial.certifications ?? legacy.certifications),
    languages: normalizeText(partial.languages),
  };
}

export function getWorkspaceStorageKey(): string {
  return WORKSPACE_STORAGE_KEY;
}

export function getLegacyStorageKey(): string {
  return LEGACY_STORAGE_KEY;
}

export function estimateResumeMetrics(form: ResumeForm): ResumeMetrics {
  const skillCount = splitSkills(form.skills).length;
  const bulletCount =
    splitLines(form.summary).length +
    splitLines(form.certifications).length +
    splitLines(form.languages).length +
    form.experiences.reduce((sum, entry) => sum + splitLines(entry.bullets).length, 0) +
    form.education.reduce((sum, entry) => sum + (entry.details ? splitLines(entry.details).length : 0), 0) +
    form.projects.reduce((sum, entry) => sum + splitLines(entry.bullets).length, 0);

  const wordCount = [
    form.fullName,
    form.headline,
    form.location,
    form.email,
    form.phone,
    form.linkedin,
    form.website,
    form.summary,
    form.skills,
    form.certifications,
    form.languages,
    ...form.experiences.flatMap((entry) => [entry.role, entry.company, entry.location, entry.dates, entry.bullets]),
    ...form.education.flatMap((entry) => [entry.degree, entry.school, entry.location, entry.dates, entry.details]),
    ...form.projects.flatMap((entry) => [entry.name, entry.link, entry.dates, entry.bullets]),
  ]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const sectionCount = [
    form.summary,
    form.skills,
    form.experiences.some((entry) => entry.role || entry.company || entry.bullets),
    form.education.some((entry) => entry.degree || entry.school),
    form.projects.some((entry) => entry.name || entry.bullets),
    form.certifications,
    form.languages,
  ].filter(Boolean).length;

  const completenessChecks = [
    form.fullName,
    form.headline,
    form.location,
    form.email,
    form.phone,
    form.summary,
    skillCount >= 4,
    form.experiences.some((entry) => entry.role && entry.company && entry.bullets),
    form.education.some((entry) => entry.degree && entry.school),
  ];
  const completion = Math.min(100, Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100));

  const atsReadiness = Math.max(
    40,
    Math.min(
      98,
      Math.round(
        44 +
          skillCount * 3 +
          Math.min(24, form.experiences.filter((entry) => entry.bullets.trim()).length * 8) +
          Math.min(10, form.projects.filter((entry) => entry.bullets.trim()).length * 4) +
          (form.summary.trim() ? 8 : 0) +
          (form.certifications.trim() ? 4 : 0) +
          (form.fullName.trim() && form.email.trim() && form.phone.trim() ? 4 : 0),
      ),
    ),
  );

  const estimatedPages = Math.max(1, Math.min(3, Math.ceil(wordCount / 340) + (bulletCount > 14 ? 1 : 0)));

  return {
    completion,
    atsReadiness,
    estimatedPages,
    wordCount,
    bulletCount,
    skillCount,
    sectionCount,
  };
}

export function buildLatexSource(form: ResumeForm, templateId: ResumeTemplateId): string {
  const theme = getTemplateTheme(templateId);
  const contactParts = [
    form.location,
    form.phone,
    form.email,
    form.linkedin,
    form.website,
  ]
    .map((part) => latexEscape(part.trim()))
    .filter(Boolean);

  const skills = splitSkills(form.skills).map((skill) => latexEscape(skill)).join(', ');
  const languages = splitSkills(form.languages).map((item) => latexEscape(item)).join(', ');
  const certifications = splitLines(form.certifications);

  const experienceBlocks = form.experiences
    .filter((entry) => entry.role.trim() || entry.company.trim() || entry.bullets.trim())
    .map((entry) => {
      const bullets = splitLines(entry.bullets)
        .map((bullet) => `    \\item ${latexEscape(bullet)}`)
        .join('\n');

      return [
        `\\textbf{${latexEscape(entry.role || 'Role')}} \\hfill ${latexEscape(entry.dates || '')} \\\\`,
        `${latexEscape(entry.company || 'Company')}${entry.location ? `, ${latexEscape(entry.location)}` : ''}`,
        '\\begin{itemize}',
        bullets || '    \\item Add quantified achievements here.',
        '\\end{itemize}',
      ].join('\n');
    });

  const educationBlocks = form.education
    .filter((entry) => entry.degree.trim() || entry.school.trim())
    .map((entry) =>
      [
        `\\textbf{${latexEscape(entry.degree || 'Degree')}} \\hfill ${latexEscape(entry.dates || '')} \\\\`,
        `${latexEscape(entry.school || 'School')}${entry.location ? `, ${latexEscape(entry.location)}` : ''}`,
        entry.details.trim() ? latexEscape(entry.details.trim()) : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );

  const projectBlocks = form.projects
    .filter((entry) => entry.name.trim() || entry.bullets.trim())
    .map((entry) => {
      const bullets = splitLines(entry.bullets)
        .map((bullet) => `    \\item ${latexEscape(bullet)}`)
        .join('\n');

      const projectHeading = [latexEscape(entry.name || 'Project')];
      if (entry.dates.trim()) {
        projectHeading.push(`\\hfill ${latexEscape(entry.dates.trim())}`);
      }

      const linkLine = entry.link.trim()
        ? `\\textit{\\href{${latexEscape(normalizeHref(entry.link))}}{${latexEscape(entry.link)}}}`
        : '';

      return [
        `${projectHeading.join(' ')} \\\\`,
        linkLine,
        '\\begin{itemize}',
        bullets || '    \\item Add measurable impact and technologies used.',
        '\\end{itemize}',
      ]
        .filter(Boolean)
        .join('\n');
    });

  const certificationBlock = certifications.length
    ? `\\begin{itemize}\n${certifications.map((item) => `    \\item ${latexEscape(item)}`).join('\n')}\n\\end{itemize}`
    : '\\textit{Add certifications, licenses, or relevant coursework here.}';

  return String.raw`% Auto-generated resume source from Toolioz
\documentclass[10pt,a4paper]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[margin=${theme.compact ? '0.55in' : templateId === 'editorial' ? '0.72in' : '0.65in'}]{geometry}
\usepackage{array}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{parskip}
\usepackage{tabularx}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{microtype}

\definecolor{resumeAccent}{HTML}{${theme.accent.replace('#', '')}}
\titleformat{\section}{\large\bfseries\color{resumeAccent}}{}{0pt}{}
\setlist[itemize]{leftmargin=*, itemsep=2pt, topsep=2pt}
\pagenumbering{gobble}
\setlength{\parindent}{0pt}
\renewcommand{\familydefault}{\sfdefault}

\begin{document}

\begin{center}
  {\LARGE\bfseries ${latexEscape(form.fullName || 'Your Name')}}

  \vspace{4pt}
  {\large ${latexEscape(form.headline || 'Target role and specialty')}}

  \vspace{4pt}
  {\small ${contactParts.join(' \\textbullet{} ')}}
\end{center}

\section*{Summary}
${latexEscape(form.summary || 'Write a short profile summary here.')}

\section*{Skills}
${skills || 'Add technical and functional skills separated by commas.'}

\section*{Experience}
${experienceBlocks.join('\n\n') || '\\textit{Add one or more experience entries.}'}

\section*{Education}
${educationBlocks.join('\n\n') || '\\textit{Add education details.}'}

\section*{Projects}
${projectBlocks.join('\n\n') || '\\textit{Add portfolio projects or achievements.}'}

\section*{Certifications}
${certificationBlock}

\section*{Languages}
${languages || '\\textit{Add the languages you work or communicate in.}'}

\end{document}`;
}

function normalizeHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (/^[a-z]+:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('mailto:')) {
    return trimmed;
  }

  return trimmed.startsWith('www.') ? `https://${trimmed}` : `https://${trimmed}`;
}

export function buildResumeDownloadName(form: ResumeForm, extension = 'pdf'): string {
  return sanitizeFileName(form.fullName || 'resume', extension);
}

