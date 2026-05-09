import React from 'react';
import { Camera, Mail, Phone, MapPin, User, Briefcase, GraduationCap, Users, Info, Calendar, Sparkles } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const ProfessionalTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#f8fafc] text-slate-800 p-0 font-sans flex flex-col">
    {/* Header Section */}
    <header className="bg-slate-900 text-white p-16 pb-32 relative overflow-hidden shrink-0">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 -skew-x-12 translate-x-24 pointer-events-none"></div>
      <div className="absolute top-12 right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="max-w-[65%]">
           <div className="flex items-center gap-3 text-indigo-400 text-xs font-black uppercase tracking-[0.4em] mb-8">
              <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
              Professional Record
           </div>
           <h1 className="text-6xl font-black tracking-tighter leading-none mb-6 uppercase">{data.fullName}</h1>
           <p className="text-2xl font-bold text-slate-400 max-w-xl">{data.occupation}</p>
        </div>
        
        {data.photo ? (
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-500/20 rounded-3xl blur-2xl group-hover:bg-indigo-500/30 transition-colors"></div>
            <img src={data.photo} className="w-48 h-56 rounded-2xl object-cover border-2 border-white/10 relative z-10 shadow-2xl" alt="Profile" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-48 h-56 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center relative z-10">
            <User size={64} className="text-slate-700" />
          </div>
        )}
      </div>
    </header>

    <div className="flex-1 px-16 -mt-16 pb-16 relative z-20">
      <div className="grid grid-cols-12 gap-8">
        {/* Contact Strip */}
        <div className="col-span-12 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex justify-between items-center mb-4">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={18} /></div><div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase">Mobile</span><span className="font-bold text-slate-800">{data.phone}</span></div></div>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={18} /></div><div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase">Email</span><span className="font-bold text-slate-800 break-all">{data.email}</span></div></div>
           </div>
           <div className="flex items-center gap-3 text-slate-400 font-bold text-sm"><MapPin size={18} /> {data.address}</div>
        </div>

        {/* Left Column */}
        <div className="col-span-4 space-y-8">
           <section className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-8 flex items-center gap-2">
                 <Info size={16} /> Personal Facts
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'Date of Birth', value: data.dateOfBirth, icon: <Calendar size={14} /> },
                   { label: 'Height', value: data.height, icon: <User size={14} /> },
                   { label: 'Faith', value: data.religion, icon: <div className="w-3.5 h-3.5 border-2 border-current rounded-full" /> },
                   { label: 'Caste', value: data.caste, icon: <Users size={14} /> }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col gap-1 border-b border-slate-50 pb-4 last:border-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">{item.icon} {item.label}</span>
                      <span className="font-bold text-slate-800">{item.value || 'N/A'}</span>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-8">
           <section className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-8 flex items-center gap-2">
                 <GraduationCap size={20} /> Professional Summary
              </h3>
              <div className="space-y-8">
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase mb-3">Education</p>
                    <p className="text-2xl font-black text-slate-800 leading-tight">{data.education}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Current Role</span>
                       <span className="font-black text-slate-800 text-lg">{data.occupation}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Annual Compensation</span>
                       <span className="font-black text-slate-800 text-lg">{data.annualIncome || 'Not Disclosed'}</span>
                    </div>
                 </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-8 flex items-center gap-2">
                 <Users size={20} /> Family Structure
              </h3>
              <div className="grid grid-cols-2 gap-12">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Father</span>
                    <p className="font-black text-slate-800 text-xl">{data.fatherName}</p>
                    <p className="text-sm font-bold text-slate-400">{data.fatherOccupation}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Mother</span>
                    <p className="font-black text-slate-800 text-xl">{data.motherName}</p>
                    <p className="text-sm font-bold text-slate-400">{data.motherOccupation}</p>
                 </div>
                 {data.siblings && (
                   <div className="col-span-2 pt-8 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 uppercase block mb-3">Siblings</span>
                      <p className="text-base font-bold text-slate-600 leading-relaxed italic">{data.siblings}</p>
                   </div>
                 )}
              </div>
           </section>
        </div>
      </div>
    </div>

    <footer className="mt-auto p-12 border-t border-slate-100 bg-white flex justify-between items-center rounded-b-[4rem]">
       <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Candidate ID: 2024-PRO-001</div>
       <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
          <Sparkles size={14} className="text-indigo-400" /> Premium Professional Layout
       </div>
    </footer>
  </TemplateWrapper>
);
