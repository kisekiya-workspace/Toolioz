'use client';
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeData, ResumeExperienceItem, ResumeEducationItem, ResumeProjectItem } from './resume-types';
import { createExperience, createEducation, createProject } from './resume-types';

const F: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; area?: boolean }> = ({ label, value, onChange, placeholder, area }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
    {area ? (
      <textarea className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400 resize-none" rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

export default function ResumeFormEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const u = (path: string, val: string) => {
    const d = JSON.parse(JSON.stringify(data)) as ResumeData;
    const keys = path.split('.');
    let obj: any = d;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onChange(d);
  };

  const updateExp = (id: string, field: keyof ResumeExperienceItem, val: any) => {
    const d = { ...data, experience: data.experience.map(e => e.id === id ? { ...e, [field]: val } : e) };
    onChange(d);
  };
  const updateEdu = (id: string, field: keyof ResumeEducationItem, val: any) => {
    const d = { ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: val } : e) };
    onChange(d);
  };
  const updateProj = (id: string, field: keyof ResumeProjectItem, val: any) => {
    const d = { ...data, projects: data.projects.map(e => e.id === id ? { ...e, [field]: val } : e) };
    onChange(d);
  };

  return (
    <div className="h-full space-y-5 overflow-y-auto p-3 pb-6 text-slate-800 sm:p-4">
      {/* Contact */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Contact</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <F label="Full Name" value={data.contact.fullName} onChange={v => u('contact.fullName', v)} />
          <F label="Headline" value={data.contact.headline} onChange={v => u('contact.headline', v)} />
          <F label="Email" value={data.contact.email} onChange={v => u('contact.email', v)} />
          <F label="Phone" value={data.contact.phone} onChange={v => u('contact.phone', v)} />
          <F label="Location" value={data.contact.location} onChange={v => u('contact.location', v)} />
          <F label="LinkedIn" value={data.contact.linkedin} onChange={v => u('contact.linkedin', v)} />
          <F label="GitHub" value={data.contact.github} onChange={v => u('contact.github', v)} />
          <F label="Website" value={data.contact.website} onChange={v => u('contact.website', v)} />
        </div>
      </section>

      <F label="Summary" value={data.summary} onChange={v => u('summary', v)} area />
      <F label="Skills (comma separated)" value={data.skills} onChange={v => u('skills', v)} area />

      {/* Experience */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Experience</h3>
          <button onClick={() => onChange({ ...data, experience: [...data.experience, createExperience()] })} className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700"><Plus size={12} /> Add</button>
        </div>
        {data.experience.map((exp, idx) => (
          <div key={exp.id} className="mb-4 rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
              <button onClick={() => onChange({ ...data, experience: data.experience.filter(e => e.id !== exp.id) })} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <F label="Title" value={exp.title} onChange={v => updateExp(exp.id, 'title', v)} />
              <F label="Company" value={exp.company} onChange={v => updateExp(exp.id, 'company', v)} />
              <F label="Start" value={exp.startDate} onChange={v => updateExp(exp.id, 'startDate', v)} placeholder="Jan 2023" />
              <F label="End" value={exp.endDate} onChange={v => updateExp(exp.id, 'endDate', v)} placeholder="Present" />
              <div className="col-span-2"><F label="Location" value={exp.location} onChange={v => updateExp(exp.id, 'location', v)} /></div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bullets</label>
              {exp.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-1 mt-1">
                  <input className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-slate-400" value={b} onChange={e => { const nb = [...exp.bullets]; nb[bi] = e.target.value; updateExp(exp.id, 'bullets', nb); }} />
                  <button onClick={() => updateExp(exp.id, 'bullets', exp.bullets.filter((_, i) => i !== bi))} className="text-red-300 hover:text-red-500 px-1"><Trash2 size={11} /></button>
                </div>
              ))}
              <button onClick={() => updateExp(exp.id, 'bullets', [...exp.bullets, ''])} className="mt-1 text-[10px] text-emerald-600 font-semibold">+ Add bullet</button>
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Education</h3>
          <button onClick={() => onChange({ ...data, education: [...data.education, createEducation()] })} className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700"><Plus size={12} /> Add</button>
        </div>
        {data.education.map((edu, idx) => (
          <div key={edu.id} className="mb-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
              <button onClick={() => onChange({ ...data, education: data.education.filter(e => e.id !== edu.id) })} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <F label="Degree" value={edu.degree} onChange={v => updateEdu(edu.id, 'degree', v)} />
              <F label="School" value={edu.school} onChange={v => updateEdu(edu.id, 'school', v)} />
              <F label="Start" value={edu.startDate} onChange={v => updateEdu(edu.id, 'startDate', v)} />
              <F label="End" value={edu.endDate} onChange={v => updateEdu(edu.id, 'endDate', v)} />
              <F label="GPA" value={edu.gpa} onChange={v => updateEdu(edu.id, 'gpa', v)} />
              <F label="Location" value={edu.location} onChange={v => updateEdu(edu.id, 'location', v)} />
            </div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Projects</h3>
          <button onClick={() => onChange({ ...data, projects: [...data.projects, createProject()] })} className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700"><Plus size={12} /> Add</button>
        </div>
        {data.projects.map((proj, idx) => (
          <div key={proj.id} className="mb-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
              <button onClick={() => onChange({ ...data, projects: data.projects.filter(e => e.id !== proj.id) })} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <F label="Name" value={proj.name} onChange={v => updateProj(proj.id, 'name', v)} />
              <F label="Tech" value={proj.tech} onChange={v => updateProj(proj.id, 'tech', v)} />
            </div>
            <F label="Description" value={proj.description} onChange={v => updateProj(proj.id, 'description', v)} area />
          </div>
        ))}
      </section>
    </div>
  );
}
