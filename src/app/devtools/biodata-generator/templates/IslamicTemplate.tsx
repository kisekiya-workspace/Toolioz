import React from 'react';
import { Camera, Briefcase, Users, Phone, Mail, MapPin, User } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const IslamicTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#fdfdfb] text-[#064e3b] p-16 font-serif overflow-hidden">
    {/* Minimal Decoration */}
    <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none"></div>
    <div className="absolute top-0 left-0 right-0 h-1 bg-[#064e3b]"></div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#064e3b]"></div>
    
    <div className="flex flex-col items-center text-center mt-8 relative z-10">
      <div className="text-6xl text-[#047857] mb-6 font-sans drop-shadow-sm">﷽</div>
      <h3 className="text-[#064e3b] font-bold tracking-[0.4em] uppercase text-[10px] mb-12 opacity-70">In the name of Allah, the Most Merciful</h3>
      
      <div className="flex flex-col items-center mb-12">
        {data.photo ? (
          <div className="relative p-1.5 rounded-full border-2 border-[#064e3b]/20 bg-white shadow-xl">
            <img src={data.photo} className="w-40 h-40 rounded-full object-cover" alt="Profile" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-[#064e3b]/5 border-2 border-dashed border-[#064e3b]/20 flex items-center justify-center">
            <User size={48} className="text-[#064e3b]/20" />
          </div>
        )}
        <h1 className="text-4xl font-bold text-[#064e3b] mt-8 mb-2 tracking-tight">{data.fullName}</h1>
        <div className="h-0.5 w-12 bg-[#047857] opacity-30"></div>
        <p className="text-[#047857] mt-3 font-bold text-sm tracking-wide opacity-80">{data.occupation}</p>
      </div>
    </div>

    <div className="mt-8 space-y-8 max-w-[640px] mx-auto relative z-10">
      <div className="grid grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[32px] border border-[#064e3b]/10 shadow-sm relative">
           <div className="absolute -top-4 left-8 px-4 py-1.5 bg-[#064e3b] text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
             <User size={12} /> Personal Profile
           </div>
           <div className="space-y-5 text-sm mt-2">
              <div className="flex flex-col"><span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Birth Date</span><span className="font-bold text-[#064e3b]">{data.dateOfBirth}</span></div>
              <div className="flex flex-col"><span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Height</span><span className="font-bold text-[#064e3b]">{data.height}</span></div>
              <div className="flex flex-col"><span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Sect / Community</span><span className="font-bold text-[#064e3b]">{data.religion}{data.caste ? ` / ${data.caste}` : ''}</span></div>
           </div>
        </section>

        <section className="bg-white p-8 rounded-[32px] border border-[#064e3b]/10 shadow-sm relative">
           <div className="absolute -top-4 left-8 px-4 py-1.5 bg-[#064e3b] text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
             <Briefcase size={12} /> Career Summary
           </div>
           <div className="space-y-5 text-sm mt-2">
              <div className="flex flex-col"><span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Qualification</span><span className="font-bold text-[#064e3b] leading-tight">{data.education}</span></div>
              <div className="flex flex-col"><span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Profession</span><span className="font-bold text-[#064e3b]">{data.occupation}</span></div>
              <div className="flex flex-col"><span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Annual Income</span><span className="font-bold text-[#064e3b]">{data.annualIncome || 'Not Disclosed'}</span></div>
           </div>
        </section>
      </div>

      <section className="bg-white p-10 rounded-[40px] border border-[#064e3b]/10 shadow-sm relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#064e3b] text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Users size={14} /> Family Background
        </div>
        <div className="grid grid-cols-2 gap-10 mt-4">
           <div className="space-y-1">
             <span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Father</span>
             <p className="font-bold text-[#064e3b] text-lg">{data.fatherName}</p>
             <p className="text-xs font-bold text-[#047857]/70 italic">{data.fatherOccupation}</p>
           </div>
           <div className="space-y-1">
             <span className="text-[10px] font-black text-[#047857]/50 uppercase tracking-wider">Mother</span>
             <p className="font-bold text-[#064e3b] text-lg">{data.motherName}</p>
             <p className="text-xs font-bold text-[#047857]/70 italic">{data.motherOccupation}</p>
           </div>
           {data.siblings && (
             <div className="col-span-2 pt-6 border-t border-[#064e3b]/5">
               <span className="text-[10px] font-black text-[#047857]/50 uppercase block mb-2 tracking-widest">Sibling Details</span>
               <p className="text-sm font-bold text-[#064e3b]/80 whitespace-pre-line leading-relaxed italic">{data.siblings}</p>
             </div>
           )}
        </div>
      </section>
      
      <div className="bg-[#064e3b] text-white p-10 rounded-[48px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <h3 className="text-white/50 font-black text-[10px] uppercase tracking-[0.4em] mb-8 text-center">Contact Information</h3>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
           {data.phone && <div className="flex items-center gap-3 font-bold text-lg"><Phone size={18} className="text-[#10b981]" /> {data.phone}</div>}
           {data.email && <div className="flex items-center gap-3 font-bold text-lg"><Mail size={18} className="text-[#10b981]" /> {data.email}</div>}
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-3 text-sm font-medium text-white/80">
           <MapPin size={16} className="text-[#10b981]" /> {data.address}
        </div>
      </div>
    </div>
  </TemplateWrapper>
);
