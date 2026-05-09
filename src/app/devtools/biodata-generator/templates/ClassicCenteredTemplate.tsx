import React from 'react';
import { Camera, Sparkles, Phone, Mail, MapPin, User, Briefcase, Info, GraduationCap, Users } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const ClassicCenteredTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#fdfaf5] text-[#2c1810] p-16">
    {/* Elegant Borders */}
    <div className="absolute inset-4 border-[1px] border-[#8b2332]/40 pointer-events-none"></div>
    <div className="absolute inset-6 border-[3px] border-double border-[#8b2332]/60 pointer-events-none"></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#8b2332] opacity-5 rounded-b-full"></div>
    
    {/* Corner Decorations */}
    <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-[#8b2332]/30 pointer-events-none"></div>
    <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-[#8b2332]/30 pointer-events-none"></div>
    <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-[#8b2332]/30 pointer-events-none"></div>
    <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-[#8b2332]/30 pointer-events-none"></div>

    <div className="flex flex-col items-center text-center relative z-10">
      <div className="mb-4">
        <Sparkles size={32} className="text-[#8b2332]/20 mx-auto" />
      </div>
      <h1 className="text-4xl font-serif font-black text-[#8b2332] tracking-[0.3em] uppercase mb-10 border-b-2 border-[#8b2332]/20 pb-4 inline-block px-12">Marriage Biodata</h1>
      
      <div className="flex flex-col items-center mb-10">
        {data.photo ? (
          <div className="relative p-2 rounded-full border-2 border-[#8b2332]/30 bg-white shadow-lg">
            <img src={data.photo} className="w-40 h-40 rounded-full object-cover grayscale-[20%] border-4 border-white" alt="Profile" crossOrigin="anonymous" />
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-100">
              <Camera size={20} className="text-[#8b2332]" />
            </div>
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-[#8b2332]/5 border-2 border-dashed border-[#8b2332]/20 flex items-center justify-center">
            <User size={48} className="text-[#8b2332]/20" />
          </div>
        )}
        <h2 className="text-3xl font-serif font-black text-[#1a1a1a] mt-8 mb-2 tracking-tight">{data.fullName}</h2>
        <p className="text-[#8b2332] font-bold text-sm tracking-widest uppercase italic">{data.occupation || 'Candidate Profile'}</p>
      </div>
    </div>

    <div className="mt-4 space-y-8 max-w-[640px] mx-auto relative z-10">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#8b2332]/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><User size={64} /></div>
        <h3 className="text-[#8b2332] font-serif font-black text-xl mb-6 flex items-center gap-3">
          <Info size={20} /> Personal Profile
        </h3>
        <table className="w-full text-base border-separate border-spacing-y-3">
          <tbody>
            {data.dateOfBirth && <tr><td className="font-bold text-[#666] w-[200px] uppercase text-xs tracking-wider">Date of Birth</td><td className="font-semibold">: {data.dateOfBirth}</td></tr>}
            {data.birthTime && <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Time of Birth</td><td className="font-semibold">: {data.birthTime}</td></tr>}
            {data.birthPlace && <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Place of Birth</td><td className="font-semibold text-sm">: {data.birthPlace}</td></tr>}
            {data.height && <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Height</td><td className="font-semibold">: {data.height}</td></tr>}
            {data.religion && <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Religion / Caste</td><td className="font-semibold text-sm">: {data.religion}{data.caste ? ` (${data.caste})` : ''}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#8b2332]/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><GraduationCap size={64} /></div>
        <h3 className="text-[#8b2332] font-serif font-black text-xl mb-6 flex items-center gap-3">
          <Briefcase size={20} /> Professional Details
        </h3>
        <table className="w-full text-base border-separate border-spacing-y-3">
          <tbody>
            {data.education && <tr><td className="font-bold text-[#666] w-[200px] uppercase text-xs tracking-wider">Education</td><td className="font-semibold text-sm leading-snug">: {data.education}</td></tr>}
            {data.occupation && <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Occupation</td><td className="font-semibold">: {data.occupation}</td></tr>}
            {data.annualIncome && <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Annual Income</td><td className="font-semibold">: {data.annualIncome}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#8b2332]/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={64} /></div>
        <h3 className="text-[#8b2332] font-serif font-black text-xl mb-6 flex items-center gap-3">
          <Users size={20} /> Family Heritage
        </h3>
        <table className="w-full text-base border-separate border-spacing-y-3">
          <tbody>
            <tr><td className="font-bold text-[#666] w-[200px] uppercase text-xs tracking-wider">Father's Name</td><td className="font-semibold">: {data.fatherName} <span className="font-medium text-xs opacity-60">({data.fatherOccupation})</span></td></tr>
            <tr><td className="font-bold text-[#666] uppercase text-xs tracking-wider">Mother's Name</td><td className="font-semibold">: {data.motherName} <span className="font-medium text-xs opacity-60">({data.motherOccupation})</span></td></tr>
            {data.siblings && <tr><td className="font-bold text-[#666] align-top uppercase text-xs tracking-wider pt-1">Siblings</td><td className="font-semibold text-sm whitespace-pre-line">: {data.siblings}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="p-8 text-center bg-[#8b2332]/5 rounded-3xl border border-[#8b2332]/10 mt-12">
        <h3 className="text-[#8b2332] font-serif font-black text-xl mb-6">Contact & Connectivity</h3>
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          {data.phone && <div className="flex items-center gap-2 font-bold text-sm"><Phone size={16} className="text-[#8b2332]" /> {data.phone}</div>}
          {data.email && <div className="flex items-center gap-2 font-bold text-sm"><Mail size={16} className="text-[#8b2332]" /> {data.email}</div>}
        </div>
        {data.address && <div className="flex items-center justify-center gap-2 font-medium text-sm text-gray-500 max-w-md mx-auto"><MapPin size={16} className="shrink-0 text-[#8b2332]/50" /> {data.address}</div>}
      </div>
    </div>
  </TemplateWrapper>
);
