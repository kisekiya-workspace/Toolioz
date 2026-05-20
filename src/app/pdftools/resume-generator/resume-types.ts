// Shared resume data types used by the form-based visual builder

export interface ResumeContact {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface ResumeExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ResumeEducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ResumeProjectItem {
  id: string;
  name: string;
  tech: string;
  description: string;
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  skills: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  projects: ResumeProjectItem[];
}

let _idCounter = 0;
const uid = () => `item_${Date.now()}_${++_idCounter}`;

export const createExperience = (): ResumeExperienceItem => ({
  id: uid(),
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  bullets: [''],
});

export const createEducation = (): ResumeEducationItem => ({
  id: uid(),
  degree: '',
  school: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
});

export const createProject = (): ResumeProjectItem => ({
  id: uid(),
  name: '',
  tech: '',
  description: '',
});

export const SAMPLE_RESUME: ResumeData = {
  contact: {
    fullName: 'Arjun Mehta',
    headline: 'Senior Full-Stack Engineer',
    email: 'arjun@example.com',
    phone: '+91 98765-43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/arjunmehta',
    github: 'github.com/arjunmehta',
    website: '',
  },
  summary:
    'Experienced full-stack engineer with 6+ years building scalable web applications, payment systems, and developer tools. Passionate about clean architecture and shipping products users love.',
  skills:
    'JavaScript, TypeScript, React, Next.js, Node.js, Python, Go, PostgreSQL, Redis, Docker, Kubernetes, AWS, GCP',
  experience: [
    {
      id: 'exp1',
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Bengaluru',
      startDate: 'Jan 2023',
      endDate: 'Present',
      bullets: [
        'Architected a multi-region deployment orchestrator for GKE, reducing rollout times by 60%.',
        'Designed and shipped a billing reconciliation service handling $500M+ in monthly cloud revenue.',
        'Led a cross-functional initiative to improve developer onboarding, cutting ramp-up time from 6 weeks to 2.',
      ],
    },
    {
      id: 'exp2',
      title: 'Software Engineer',
      company: 'Flipkart',
      location: 'Bengaluru',
      startDate: 'Jul 2020',
      endDate: 'Dec 2022',
      bullets: [
        'Built UPI payment gateway processing 3M+ transactions/day with 99.99% success rate.',
        'Implemented fraud detection rules engine blocking $2M+ in fraudulent transactions monthly.',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.Tech in Computer Science',
      school: 'NIT Karnataka',
      location: 'Surathkal',
      startDate: '2016',
      endDate: '2020',
      gpa: '9.1/10',
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'Open Source API Gateway',
      tech: 'Go, gRPC, Redis',
      description:
        'Lightweight, plugin-based API gateway with rate limiting, circuit breaking, and JWT auth. 1.2K GitHub stars.',
    },
  ],
};
