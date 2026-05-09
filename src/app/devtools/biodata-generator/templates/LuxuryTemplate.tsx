import React from 'react';
import { Camera, MapPin, Phone, Mail, User, Heart, Sparkles, Briefcase, GraduationCap } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const LuxuryTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-white text-[#1a1a1a] font-serif p-24">
    {/* Elegant Gold Borders */}
    <div className="absolute inset-8 border-[1px] border-[#c5a059]/40 pointer-events-none"></div>
    <div className="absolute inset-10 border-[1px] border-[#c5a059]/20 pointer-events-none"></div>
    
    {/* Royal Corner Accents */}
    <div className="absolute top-8 left-8 w-16 h-16 border-t-[1px] border-l-[1px] border-[#c5a059] pointer-events-none"></div>
    <div className="absolute top-8 right-8 w-16 h-16 border-t-[1px] border-r-[1px] border-[#c5a059] pointer-events-none"></div>
    <div className="absolute bottom-8 left-8 w-16 h-16 border-b-[1px] border-l-[1px] border-[#c5a059] pointer-events-none"></div>
    <div className="absolute bottom-8 right-8 w-16 h-16 border-b-[1px] border-r-[1px] border-[#c5a059] pointer-events-none"></div>

    <div className="relative z-10 flex flex-col h-full items-center">
      <div className="text-center mb-20">
        <div className="text-[#c5a059] text-xs font-black tracking-[0.8em] uppercase mb-6">Established Traditions</div>
        <h1 className="text-6xl font-normal tracking-[0.2em] uppercase mb-4 text-gray-900 leading-none">Biodata</h1>
        <div className="w-16 h-px bg-[#c5a059] mx-auto"></div>
      </div>

      <div className="w-full grid grid-cols-12 gap-20 items-center mb-20">
        <div className="col-span-7 space-y-12">
          <section>
            <h2 className="text-5xl font-black tracking-tighter text-gray-900 mb-6 uppercase">{data.fullName}</h2>
            <div className="flex items-center gap-4 text-[#c5a059] text-sm font-bold uppercase tracking-[0.3em]">
              <Briefcase size={16} /> {data.occupation || 'Candidate Profile'}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10 border-t border-gray-100 pt-12">
            <div className="space-y-1">
              <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest">Date of Birth</span>
              <p className="text-lg font-medium">{data.dateOfBirth}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest">Height</span>
              <p className="text-lg font-medium">{data.height}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest">Community</span>
              <p className="text-lg font-medium leading-tight">{data.religion} {data.caste ? `/ ${data.caste}` : ''}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest">Annual Status</span>
              <p className="text-lg font-medium">{data.annualIncome || 'Confidential'}</p>
            </div>
          </div>
        </div>

        <div className="col-span-5 flex flex-col items-center">
          {data.photo ? (
            <div className="relative group">
              <div className="absolute -inset-4 border border-[#c5a059]/20 rounded-full animate-spin-slow"></div>
              <img src={data.photo} className="w-56 h-56 rounded-full object-cover border-[8px] border-white shadow-2xl relative z-10" alt="Profile" crossOrigin="anonymous" />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#c5a059]/30 z-20"></div>
            </div>
          ) : (
            <div className="w-56 h-56 rounded-full bg-gray-50 border border-dashed border-[#c5a059]/30 flex items-center justify-center">
              <Camera size={48} className="text-[#c5a059]/20" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-16">
        <section className="relative">
          <div className="absolute -left-12 top-0 text-[#c5a059]/10 text-9xl font-black pointer-events-none select-none">01</div>
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-[#c5a059] mb-8 border-l-4 border-[#c5a059] pl-6">Academic Excellence</h3>
          <p className="text-2xl font-bold text-gray-900 leading-tight max-w-2xl">{data.education}</p>
        </section>

        <section className="relative">
          <div className="absolute -left-12 top-0 text-[#c5a059]/10 text-9xl font-black pointer-events-none select-none">02</div>
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-[#c5a059] mb-8 border-l-4 border-[#c5a059] pl-6">Heritage & Lineage</h3>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest block mb-4">The Patriarch</span>
              <p className="text-2xl font-bold text-gray-900 mb-2">{data.fatherName}</p>
              <p className="text-sm font-medium text-gray-600 italic">{data.fatherOccupation}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest block mb-4">The Matriarch</span>
              <p className="text-2xl font-bold text-gray-900 mb-2">{data.motherName}</p>
              <p className="text-sm font-medium text-gray-600 italic">{data.motherOccupation}</p>
            </div>
            {data.siblings && (
              <div className="col-span-2 pt-8 border-t border-gray-100">
                <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-widest block mb-4">Siblings</span>
                <p className="text-lg font-medium text-gray-700 italic whitespace-pre-line leading-relaxed">{data.siblings}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="mt-auto pt-20 w-full flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-600">
            <Phone size={14} className="text-[#c5a059]" /> {data.phone}
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-600">
            <Mail size={14} className="text-[#c5a059]" /> {data.email}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
            <MapPin size={14} className="text-[#c5a059]" /> {data.address}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[1em] text-[#c5a059]/70">Luxury Edition</div>
        </div>
      </footer>
    </div>
  </TemplateWrapper>
);
