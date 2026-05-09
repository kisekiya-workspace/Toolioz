import React from 'react';
import { Camera, Briefcase, GraduationCap, Users, Phone, Mail, MapPin, User, Sparkles } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const RoyalGoldTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#1a1a1a] text-[#d4af37] p-0 font-serif">
    {/* Royal Texture */}
    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/royal-lineage.png")' }}></div>
    
    {/* Grand Golden Border */}
    <div className="absolute inset-0 border-[30px] border-[#d4af37]/20 pointer-events-none"></div>
    <div className="absolute inset-4 border-[2px] border-[#d4af37]/40 pointer-events-none"></div>
    <div className="absolute inset-6 border-[1px] border-[#d4af37]/20 pointer-events-none"></div>

    {/* Corner Embellishments */}
    <div className="absolute top-0 left-0 w-40 h-40 border-t-[4px] border-l-[4px] border-[#d4af37] pointer-events-none rounded-tl-[60px]"></div>
    <div className="absolute top-0 right-0 w-40 h-40 border-t-[4px] border-r-[4px] border-[#d4af37] pointer-events-none rounded-tr-[60px]"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 border-b-[4px] border-l-[4px] border-[#d4af37] pointer-events-none rounded-bl-[60px]"></div>
    <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[4px] border-r-[4px] border-[#d4af37] pointer-events-none rounded-br-[60px]"></div>

    <div className="relative z-10 flex flex-col h-full p-20 items-center">
      <header className="text-center mb-16 relative">
        <Sparkles size={40} className="text-[#d4af37] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
        <h1 className="text-6xl font-black tracking-[0.3em] uppercase mb-4 text-[#d4af37] leading-none">Biodata</h1>
        <div className="flex items-center justify-center gap-6">
           <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.8em]">The Royal Collection</span>
           <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16 items-center mb-16 w-full">
         <div className="col-span-5 flex flex-col items-center">
            {data.photo ? (
              <div className="relative p-2 bg-gradient-to-br from-[#d4af37] via-[#f7e497] to-[#d4af37] rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.3)] transform hover:scale-105 transition-transform duration-700">
                <img src={data.photo} className="w-52 h-52 rounded-2xl object-cover border-4 border-[#1a1a1a]" alt="Profile" crossOrigin="anonymous" />
              </div>
            ) : (
              <div className="w-52 h-52 rounded-3xl bg-[#d4af37]/5 border-2 border-dashed border-[#d4af37]/30 flex items-center justify-center">
                <User size={64} className="text-[#d4af37]/20" />
              </div>
            )}
         </div>
         <div className="col-span-7 space-y-6">
            <h2 className="text-5xl font-black tracking-tight text-white uppercase leading-none">{data.fullName}</h2>
            <div className="flex items-center gap-4 text-lg font-bold italic text-[#d4af37]">
               <span>{data.religion}</span>
               <div className="w-2 h-2 bg-[#d4af37] rounded-full rotate-45"></div>
               <span>{data.caste}</span>
            </div>
            <p className="text-base font-medium text-white/90 leading-relaxed border-l-4 border-[#d4af37] pl-6 py-2">{data.about}</p>
         </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-12 flex-1">
         <section className="bg-[#d4af37]/5 backdrop-blur-md p-10 rounded-[40px] border-2 border-[#d4af37]/20 relative group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><User size={80} /></div>
            <h3 className="text-[#d4af37] font-black text-xl mb-10 border-b border-[#d4af37]/30 pb-4 uppercase tracking-[0.2em]">Personal Portfolio</h3>
            <div className="space-y-6 text-base">
               <div className="flex justify-between border-b border-[#d4af37]/10 pb-3"><span className="font-bold uppercase text-[10px] tracking-widest text-white/70">Birth Date</span><span className="font-black text-white">{data.dateOfBirth}</span></div>
               <div className="flex justify-between border-b border-[#d4af37]/10 pb-3"><span className="font-bold uppercase text-[10px] tracking-widest text-white/70">Birth Time</span><span className="font-black text-white">{data.birthTime}</span></div>
               <div className="flex justify-between border-b border-[#d4af37]/10 pb-3"><span className="font-bold uppercase text-[10px] tracking-widest text-white/70">Birth Place</span><span className="font-black text-white text-sm">{data.birthPlace}</span></div>
               <div className="flex justify-between border-b border-[#d4af37]/10 pb-3"><span className="font-bold uppercase text-[10px] tracking-widest text-white/70">Stature</span><span className="font-black text-white">{data.height}</span></div>
            </div>
         </section>

         <div className="space-y-12">
            <section className="bg-[#d4af37]/5 backdrop-blur-md p-8 rounded-[40px] border-2 border-[#d4af37]/20 relative">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><GraduationCap size={60} /></div>
               <h3 className="text-[#d4af37] font-black text-lg mb-6 border-b border-[#d4af37]/30 pb-3 uppercase tracking-[0.2em]">Academic Stand</h3>
               <p className="text-xl font-black text-white leading-tight mb-4">{data.education}</p>
               <div className="flex items-center gap-3 text-sm font-bold bg-[#d4af37] text-[#1a1a1a] px-4 py-2 rounded-xl inline-block uppercase">
                  <Briefcase size={14} /> {data.occupation}
               </div>
            </section>

            <section className="bg-[#d4af37]/5 backdrop-blur-md p-8 rounded-[40px] border-2 border-[#d4af37]/20 relative">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><Users size={60} /></div>
               <h3 className="text-[#d4af37] font-black text-lg mb-6 border-b border-[#d4af37]/30 pb-3 uppercase tracking-[0.2em]">Family Dynasty</h3>
               <div className="grid grid-cols-2 gap-8">
                  <div><p className="text-[10px] font-bold text-white/70 uppercase mb-2">Father</p><p className="font-black text-white text-base leading-none">{data.fatherName}</p></div>
                  <div><p className="text-[10px] font-bold text-white/70 uppercase mb-2">Mother</p><p className="font-black text-white text-base leading-none">{data.motherName}</p></div>
               </div>
            </section>
         </div>
      </div>

      <footer className="mt-auto w-full flex flex-col items-center pt-16">
         <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-12 opacity-40"></div>
         <div className="flex gap-16 text-sm font-black uppercase tracking-[0.3em] mb-8">
            <div className="flex items-center gap-3"><Phone size={18} /> {data.phone}</div>
            <div className="flex items-center gap-3"><Mail size={18} /> {data.email}</div>
         </div>
         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-white/70">
            <MapPin size={16} className="text-[#d4af37]" /> {data.address}
         </div>
      </footer>
    </div>
  </TemplateWrapper>
);
