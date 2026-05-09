import React from 'react';
import { Camera, MapPin, Phone, Mail, User, Heart, Sparkles, Briefcase, GraduationCap } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const ArtDecoTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#121212] text-[#d4af37] font-serif p-0">
    {/* Art Deco Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/art-deco.png")' }}></div>
    
    {/* Geometric Frame */}
    <div className="absolute inset-8 border-2 border-[#d4af37]/30 pointer-events-none"></div>
    <div className="absolute inset-10 border border-[#d4af37]/10 pointer-events-none"></div>
    
    {/* Decorative Sunburst/Rays */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-b from-[#d4af37]/10 to-transparent pointer-events-none" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>

    <div className="relative z-10 flex flex-col h-full p-20">
      <header className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-4xl opacity-40">✦</div>
        <h1 className="text-7xl font-bold tracking-[0.3em] uppercase mb-4 text-[#d4af37] leading-none drop-shadow-2xl">
          Biodata
        </h1>
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.6em]">The Prestige Collection</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16 mb-16">
        <div className="col-span-5 flex flex-col items-center">
          {data.photo ? (
            <div className="relative p-2 bg-[#d4af37]/20 border-2 border-[#d4af37] rounded-sm transform hover:scale-105 transition-transform duration-700">
              <img src={data.photo} className="w-56 h-72 object-cover grayscale brightness-110 contrast-125 shadow-2xl" alt="Profile" crossOrigin="anonymous" />
              <div className="absolute -inset-4 border border-[#d4af37]/20 pointer-events-none"></div>
            </div>
          ) : (
            <div className="w-56 h-72 bg-white/5 border border-[#d4af37]/30 flex items-center justify-center">
              <Camera size={48} className="text-[#d4af37]/20" />
            </div>
          )}
          <div className="mt-12 text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-widest text-white uppercase leading-tight">{data.fullName}</h2>
            <div className="w-12 h-0.5 bg-[#d4af37] mx-auto"></div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37]/60 italic">{data.occupation}</p>
          </div>
        </div>

        <div className="col-span-7 space-y-12">
          <section className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-8">Personal Particulars</h3>
            <div className="grid grid-cols-2 gap-8 text-base">
              <div className="space-y-1 border-b border-[#d4af37]/10 pb-4">
                <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">Day of Birth</span>
                <p className="text-lg font-bold text-white">{data.dateOfBirth}</p>
              </div>
              <div className="space-y-1 border-b border-[#d4af37]/10 pb-4">
                <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">Stature</span>
                <p className="text-lg font-bold text-white">{data.height}</p>
              </div>
              <div className="space-y-1 border-b border-[#d4af37]/10 pb-4">
                <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">Faith</span>
                <p className="text-lg font-bold text-white">{data.religion}</p>
              </div>
              <div className="space-y-1 border-b border-[#d4af37]/10 pb-4">
                <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">Community</span>
                <p className="text-lg font-bold text-white">{data.caste || 'N/A'}</p>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-8">Scholarly Background</h3>
            <p className="text-2xl font-bold text-white leading-tight uppercase tracking-tight">{data.education}</p>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-16 flex-1">
        <section className="col-span-12 relative">
          <div className="absolute -left-8 top-1 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#d4af37] mb-10 text-center">Lineage & Family</h3>
          <div className="grid grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">The Father</span>
              <p className="text-xl font-bold text-white uppercase">{data.fatherName}</p>
              <p className="text-[10px] font-bold text-[#d4af37]/80 italic tracking-widest uppercase">{data.fatherOccupation}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">The Mother</span>
              <p className="text-xl font-bold text-white uppercase">{data.motherName}</p>
              <p className="text-[10px] font-bold text-[#d4af37]/80 italic tracking-widest uppercase">{data.motherOccupation}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-white/60 uppercase font-black tracking-widest">Kinship</span>
              <p className="text-sm font-bold text-white uppercase leading-relaxed italic">{data.siblings || 'None listed'}</p>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-auto flex flex-col items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mb-12"></div>
        <div className="flex gap-20 text-xs font-bold uppercase tracking-[0.3em] mb-8">
          <div className="flex items-center gap-3"><Phone size={14} /> {data.phone}</div>
          <div className="flex items-center gap-3"><Mail size={14} /> {data.email}</div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-white/60 uppercase tracking-[0.6em]">
          <MapPin size={14} className="text-[#d4af37]" /> {data.address}
        </div>
      </footer>
    </div>
  </TemplateWrapper>
);
