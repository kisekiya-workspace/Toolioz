import React from 'react';
import { Camera, Info, Briefcase, Users, Phone, Mail, MapPin, User } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const SikhTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-white text-[#1a1a1a] p-20">
    {/* Sikh heritage themed background elements */}
    <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[#1e3a8a]/10 to-transparent pointer-events-none"></div>
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-r-[100px] border-t-[#f97316] border-r-transparent opacity-10"></div>
    
    <div className="flex flex-col items-center text-center relative z-10 mb-16">
      <div className="text-7xl text-[#f97316] mb-6 drop-shadow-lg transform hover:scale-110 transition-transform cursor-default">ੴ</div>
      <h2 className="text-[#1e3a8a] font-black tracking-[0.25em] uppercase text-xs mb-10 max-w-lg leading-relaxed">
        Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh
      </h2>
      
      <div className="flex flex-col items-center">
        {data.photo ? (
          <div className="relative p-2 bg-white rounded-xl shadow-2xl border border-gray-100 rotate-1">
            <img src={data.photo} className="w-44 h-44 rounded-lg object-cover" alt="Profile" crossOrigin="anonymous" />
            <div className="absolute inset-0 rounded-xl ring-4 ring-[#1e3a8a]/5"></div>
          </div>
        ) : (
          <div className="w-44 h-44 bg-[#1e3a8a]/5 rounded-xl border-2 border-dashed border-[#1e3a8a]/20 flex items-center justify-center">
            <User size={48} className="text-[#1e3a8a]/20" />
          </div>
        )}
        <h1 className="text-5xl font-black text-[#1e3a8a] mt-12 mb-2 tracking-tight uppercase">{data.fullName}</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-1 bg-[#f97316]"></div>
          <span className="text-[#f97316] font-black uppercase text-xs tracking-widest">Matrimonial Profile</span>
          <div className="w-12 h-1 bg-[#f97316]"></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-12 max-w-[640px] mx-auto relative z-10">
      <section className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-[#f97316] rounded-full"></div>
        <h3 className="text-[#1e3a8a] font-black text-xl mb-8 flex items-center gap-3 uppercase tracking-wider">
          <Info size={22} className="text-[#f97316]" /> Personal Attributes
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-base ml-4">
           <div className="flex flex-col gap-1 border-b border-gray-100 pb-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</span><span className="font-bold">{data.dateOfBirth}</span></div>
           <div className="flex flex-col gap-1 border-b border-gray-100 pb-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Height</span><span className="font-bold">{data.height}</span></div>
           <div className="flex flex-col gap-1 border-b border-gray-100 pb-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Faith / Caste</span><span className="font-bold">{data.religion}{data.caste ? ` / ${data.caste}` : ''}</span></div>
           <div className="flex flex-col gap-1 border-b border-gray-100 pb-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Birth Location</span><span className="font-bold">{data.birthPlace || 'Not Mentioned'}</span></div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-[#1e3a8a] rounded-full"></div>
        <h3 className="text-[#f97316] font-black text-xl mb-8 flex items-center gap-3 uppercase tracking-wider">
          <Briefcase size={22} className="text-[#1e3a8a]" /> Career & Education
        </h3>
        <div className="ml-4 space-y-6">
           <div className="flex flex-col gap-2">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Educational Qualification</span>
             <p className="text-xl font-black text-[#1e3a8a] leading-tight">{data.education}</p>
           </div>
           <div className="grid grid-cols-2 gap-8 pt-4">
             <div className="flex flex-col gap-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation</span><span className="font-black text-gray-800">{data.occupation}</span></div>
             <div className="flex flex-col gap-1"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Annual Earnings</span><span className="font-black text-gray-800">{data.annualIncome || 'Confidential'}</span></div>
           </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-[#f97316] rounded-full"></div>
        <h3 className="text-[#1e3a8a] font-black text-xl mb-8 flex items-center gap-3 uppercase tracking-wider">
          <Users size={22} className="text-[#f97316]" /> Family Heritage
        </h3>
        <div className="ml-4 grid grid-cols-2 gap-12">
           <div className="space-y-2">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Father's Name</span>
             <p className="font-black text-gray-800 text-lg leading-tight">{data.fatherName}</p>
             <p className="text-sm font-bold text-gray-400 italic">{data.fatherOccupation}</p>
           </div>
           <div className="space-y-2">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mother's Name</span>
             <p className="font-black text-gray-800 text-lg leading-tight">{data.motherName}</p>
             <p className="text-sm font-bold text-gray-400 italic">{data.motherOccupation}</p>
           </div>
           {data.siblings && (
             <div className="col-span-2 mt-4 p-6 bg-gray-50 rounded-2xl border-l-4 border-[#1e3a8a]">
               <span className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest">Siblings</span>
               <p className="text-sm font-black text-gray-700 whitespace-pre-line leading-relaxed italic">{data.siblings}</p>
             </div>
           )}
        </div>
      </section>

      <div className="mt-12 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#f97316] rounded-full -mr-24 -mt-24 blur-3xl opacity-20"></div>
        <h3 className="text-white/60 font-black text-[10px] uppercase tracking-[0.5em] mb-10 text-center">Contact Connectivity</h3>
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
           {data.phone && <div className="flex items-center gap-4 font-black text-xl"><div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Phone size={20} className="text-[#f97316]" /></div> {data.phone}</div>}
           {data.email && <div className="flex items-center gap-4 font-black text-xl"><div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Mail size={20} className="text-[#f97316]" /></div> {data.email}</div>}
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-center gap-3 text-sm font-bold text-white/70">
           <MapPin size={18} className="text-[#f97316]" /> {data.address}
        </div>
      </div>
    </div>
  </TemplateWrapper>
);
