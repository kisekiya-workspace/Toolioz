import React from 'react';
import { Camera, Mail, Phone, MapPin, User, Briefcase, GraduationCap, Users } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const MinimalistTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-white text-slate-800 p-20 font-sans tracking-tight">
    {/* Grid Background Effect */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
    
    <header className="flex justify-between items-start mb-24 relative z-10">
      <div className="max-w-[65%]">
        <div className="bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] inline-block mb-6 rounded-sm">Biodata Profile</div>
        <h1 className="text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">{data.fullName}</h1>
        <p className="text-xl font-medium text-slate-400 mt-4 leading-tight">{data.occupation || 'Personal Profile'}</p>
      </div>
      {data.photo ? (
        <div className="relative">
          <img src={data.photo} className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl grayscale" alt="Profile" crossOrigin="anonymous" />
          <div className="absolute -bottom-4 -right-4 bg-slate-900 p-4 rounded-3xl shadow-xl">
             <Camera size={24} className="text-white" />
          </div>
        </div>
      ) : (
        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
          <User size={48} className="text-slate-200" />
        </div>
      )}
    </header>

    <div className="grid grid-cols-12 gap-16 relative z-10">
      <div className="col-span-4 space-y-16">
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-full"></span> Basic Info
          </h3>
          <div className="space-y-6">
             {[
               { label: 'Born', value: data.dateOfBirth },
               { label: 'Time', value: data.birthTime },
               { label: 'Height', value: data.height },
               { label: 'Faith', value: data.religion }
             ].map((item, idx) => (
               <div key={idx} className="group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">{item.label}</p>
                  <p className="font-bold text-slate-800 uppercase">{item.value || 'N/A'}</p>
               </div>
             ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-full"></span> Connect
          </h3>
          <div className="space-y-6">
             <div className="group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Contact</p>
                <div className="flex items-center gap-3 font-black text-slate-800"><Phone size={14} className="text-slate-400" /> {data.phone}</div>
             </div>
             <div className="group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</p>
                <div className="flex items-center gap-3 font-black text-slate-800 break-all"><Mail size={14} className="text-slate-400" /> {data.email}</div>
             </div>
          </div>
        </section>
      </div>

      <div className="col-span-8 space-y-20">
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-3">
             <GraduationCap size={18} /> Education & Career
          </h3>
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:bg-slate-100/50 transition-colors cursor-default">
             <p className="text-2xl font-black text-slate-900 leading-tight mb-4">{data.education}</p>
             <div className="h-px w-12 bg-slate-300 mb-6"></div>
             <p className="text-lg font-bold text-slate-500 uppercase tracking-tight">{data.occupation}</p>
             <p className="text-sm font-black text-slate-900 mt-4 uppercase bg-white px-4 py-2 inline-block rounded-xl shadow-sm">{data.annualIncome}</p>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-10 flex items-center gap-3">
             <Users size={18} /> Family Heritage
          </h3>
          <div className="grid grid-cols-2 gap-12">
             <div className="space-y-2 group">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 group-hover:text-slate-900 transition-colors">The Father</span>
                <p className="font-black text-slate-900 text-2xl uppercase leading-none">{data.fatherName}</p>
                <p className="text-sm font-bold text-slate-400 italic">{data.fatherOccupation}</p>
             </div>
             <div className="space-y-2 group">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 group-hover:text-slate-900 transition-colors">The Mother</span>
                <p className="font-black text-slate-900 text-2xl uppercase leading-none">{data.motherName}</p>
                <p className="text-sm font-bold text-slate-400 italic">{data.motherOccupation}</p>
             </div>
             {data.siblings && (
               <div className="col-span-2 pt-10 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase block mb-4 tracking-widest">Kith & Kin</span>
                  <p className="text-base font-bold text-slate-600 leading-relaxed italic">{data.siblings}</p>
               </div>
             )}
          </div>
        </section>
      </div>
    </div>

    <footer className="mt-auto pt-24 flex justify-between items-end border-t border-slate-100">
      <div className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-widest">
        <MapPin size={16} /> {data.address}
      </div>
      <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">Minimal Series v2.0</div>
    </footer>
  </TemplateWrapper>
);
