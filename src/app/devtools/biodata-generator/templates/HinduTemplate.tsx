import React from 'react';
import { Camera, Calendar, Info, GraduationCap, Briefcase, Users, Phone, Mail, MapPin, User } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const HinduTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#fffbf2] text-[#630000] p-16 font-serif border-[20px] border-[#ffebd4]">
    {/* Spiritual Decorations */}
    <div className="absolute -top-10 -left-10 w-40 h-40 border-[40px] border-[#ff9933]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[40px] border-[#ff9933]/10 rounded-full blur-3xl pointer-events-none"></div>
    
    <div className="absolute top-6 left-6 text-[#ff9933] opacity-60 pointer-events-none font-sans text-3xl">ॐ</div>
    <div className="absolute top-6 right-6 text-[#ff9933] opacity-60 pointer-events-none font-sans text-3xl">ॐ</div>
    <div className="absolute bottom-6 left-6 text-[#ff9933] opacity-60 pointer-events-none font-sans text-3xl">ॐ</div>
    <div className="absolute bottom-6 right-6 text-[#ff9933] opacity-60 pointer-events-none font-sans text-3xl">ॐ</div>

    {/* Elegant Ornate Borders */}
    <div className="absolute inset-4 border-[2px] border-[#d4af37]/40 pointer-events-none"></div>
    <div className="absolute inset-6 border-[1px] border-[#d4af37]/20 pointer-events-none"></div>

    <div className="flex flex-col items-center text-center relative z-10 mb-12">
      <div className="text-5xl text-[#e63946] mb-4 drop-shadow-md">ॐ</div>
      <h3 className="text-[#800000] font-black tracking-[0.4em] uppercase text-sm mb-10 border-b border-[#d4af37]/40 pb-2">|| Shree Ganeshay Namah ||</h3>
      
      <div className="flex flex-col items-center">
        {data.photo ? (
          <div className="relative p-1.5 bg-[#d4af37] rounded-3xl shadow-xl transform rotate-1">
            <img src={data.photo} className="w-40 h-40 rounded-2xl object-cover border-4 border-white" alt="Profile" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-40 h-40 bg-[#fff5e6] rounded-3xl border-2 border-dashed border-[#d4af37]/40 flex items-center justify-center">
            <User size={48} className="text-[#d4af37]/30" />
          </div>
        )}
        <h1 className="text-4xl font-black text-[#800000] mt-10 mb-2 tracking-tight">{data.fullName}</h1>
        <div className="flex items-center gap-2 text-[#d4af37] font-bold uppercase tracking-widest text-xs">
          <div className="w-8 h-px bg-[#d4af37]"></div>
          <span>Biodata for Marriage</span>
          <div className="w-8 h-px bg-[#d4af37]"></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-10 max-w-[660px] mx-auto relative z-10">
      <section className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#d4af37]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none"><Calendar size={80} /></div>
        <h3 className="text-[#e63946] font-black text-xl mb-6 flex items-center gap-3 border-b border-[#d4af37]/20 pb-3">
          <Info size={22} className="text-[#d4af37]" /> Personal Details
        </h3>
        <table className="w-full text-base border-separate border-spacing-y-2">
          <tbody>
            {data.dateOfBirth && <tr><td className="font-bold text-[#800000]/90 w-[200px] uppercase text-[11px] tracking-wider">Date of Birth</td><td className="font-black text-gray-800">: {data.dateOfBirth}</td></tr>}
            {data.birthTime && <tr><td className="font-bold text-[#800000]/90 uppercase text-[11px] tracking-wider">Time of Birth</td><td className="font-black text-gray-800">: {data.birthTime}</td></tr>}
            {data.birthPlace && <tr><td className="font-bold text-[#800000]/90 uppercase text-[11px] tracking-wider">Place of Birth</td><td className="font-black text-gray-800 text-sm">: {data.birthPlace}</td></tr>}
            {data.height && <tr><td className="font-bold text-[#800000]/90 uppercase text-[11px] tracking-wider">Height</td><td className="font-black text-gray-800">: {data.height}</td></tr>}
            {data.religion && <tr><td className="font-bold text-[#800000]/90 uppercase text-[11px] tracking-wider">Religion / Caste</td><td className="font-black text-gray-800 text-sm">: {data.religion}{data.caste ? ` / ${data.caste}` : ''}</td></tr>}
            {data.manglik && <tr><td className="font-bold text-[#e63946] uppercase text-[11px] tracking-wider">Manglik Status</td><td className="font-black text-[#e63946]">: {data.manglik}</td></tr>}
          </tbody>
        </table>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section className="bg-white/40 p-6 rounded-3xl border-2 border-[#d4af37]/10 shadow-sm">
          <h3 className="text-[#e63946] font-black text-lg mb-4 flex items-center gap-2 border-b border-[#d4af37]/10 pb-2">
            <GraduationCap size={18} className="text-[#d4af37]" /> Education
          </h3>
          <p className="text-sm font-black text-gray-700 leading-relaxed">{data.education}</p>
        </section>

        <section className="bg-white/40 p-6 rounded-3xl border-2 border-[#d4af37]/10 shadow-sm">
          <h3 className="text-[#e63946] font-black text-lg mb-4 flex items-center gap-2 border-b border-[#d4af37]/10 pb-2">
            <Briefcase size={18} className="text-[#d4af37]" /> Profession
          </h3>
          <p className="text-sm font-black text-gray-700 leading-relaxed">{data.occupation}</p>
          <p className="text-xs font-bold text-[#d4af37] mt-2 uppercase">{data.annualIncome && `Income: ${data.annualIncome}`}</p>
        </section>
      </div>

      <section className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#d4af37]/10 shadow-sm">
        <h3 className="text-[#e63946] font-black text-xl mb-6 flex items-center gap-3 border-b border-[#d4af37]/20 pb-3">
          <Users size={22} className="text-[#d4af37]" /> Family Details
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#800000]/80 uppercase tracking-widest">Father's Name</span>
              <p className="font-black text-gray-800">{data.fatherName}</p>
              <p className="text-xs font-bold text-gray-600 italic">{data.fatherOccupation}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#800000]/80 uppercase tracking-widest">Mother's Name</span>
              <p className="font-black text-gray-800">{data.motherName}</p>
              <p className="text-xs font-bold text-gray-600 italic">{data.motherOccupation}</p>
            </div>
          </div>
          {data.siblings && (
            <div className="pt-4 border-t border-[#d4af37]/10">
              <span className="text-[10px] font-black text-[#800000]/80 uppercase tracking-widest block mb-2">Siblings Details</span>
              <p className="text-sm font-black text-gray-700 whitespace-pre-line leading-relaxed">{data.siblings}</p>
            </div>
          )}
        </div>
      </section>

      <footer className="text-center p-8 bg-[#800000]/5 rounded-3xl border border-[#d4af37]/20 mt-4">
        <h3 className="text-[#e63946] font-black text-xl mb-6 uppercase tracking-widest">Contact Information</h3>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 font-black text-[#800000]">
          {data.phone && <div className="flex items-center gap-2"><Phone size={18} className="text-[#d4af37]" /> {data.phone}</div>}
          {data.email && <div className="flex items-center gap-2"><Mail size={18} className="text-[#d4af37]" /> {data.email}</div>}
        </div>
        <p className="mt-6 text-sm font-bold text-gray-600 flex items-center justify-center gap-2">
          <MapPin size={16} className="text-[#d4af37]" /> {data.address}
        </p>
      </footer>
    </div>
  </TemplateWrapper>
);
