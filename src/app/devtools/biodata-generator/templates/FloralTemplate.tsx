import React from 'react';
import { Camera, Phone, Mail, MapPin, User, Heart, Sparkles } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const FloralTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#fff9f9] text-[#7d4f50] p-16 font-serif">
    {/* Floral Background Decorations */}
    <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none rotate-90">
      <div className="absolute top-0 right-0 w-40 h-40 bg-pink-300 rounded-full blur-[80px]"></div>
    </div>
    <div className="absolute bottom-0 left-0 w-80 h-80 opacity-20 pointer-events-none">
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300 rounded-full blur-[80px]"></div>
    </div>
    
    {/* Delicate Border */}
    <div className="absolute inset-8 border-[1px] border-[#7d4f50]/20 rounded-[40px] pointer-events-none"></div>
    <div className="absolute inset-10 border-[1px] border-[#7d4f50]/10 rounded-[30px] pointer-events-none"></div>

    <div className="flex flex-col h-full relative z-10">
      <header className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#7d4f50]/30"></div>
          <Sparkles size={20} className="text-pink-400" />
          <div className="h-px w-12 bg-[#7d4f50]/30"></div>
        </div>
        <h1 className="text-5xl font-black text-[#5d3a3b] tracking-tight mb-2">Marriage Biodata</h1>
        <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-40">A Beautiful New Beginning</p>
      </header>

      <div className="flex gap-12 mb-16 items-start">
        {data.photo ? (
          <div className="shrink-0 relative p-1.5 bg-white rounded-[3rem] shadow-xl border border-pink-100 transform -rotate-1">
            <img src={data.photo} className="w-44 h-44 rounded-[2.5rem] object-cover" alt="Profile" crossOrigin="anonymous" />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-full shadow-lg text-pink-400">
               <Heart size={24} fill="currentColor" />
            </div>
          </div>
        ) : (
          <div className="w-44 h-44 rounded-[3rem] bg-pink-50 border-2 border-dashed border-pink-200 flex items-center justify-center">
            <User size={48} className="text-pink-200" />
          </div>
        )}
        <div className="flex-1 pt-6">
          <h2 className="text-4xl font-black text-[#5d3a3b] mb-4 leading-none">{data.fullName}</h2>
          <div className="flex items-center gap-4 text-base font-bold italic opacity-70">
            <span>{data.religion}</span>
            <div className="w-1.5 h-1.5 bg-pink-200 rounded-full"></div>
            <span>{data.caste}</span>
          </div>
          <p className="mt-6 text-base leading-relaxed font-medium opacity-80 italic">&quot;{data.about}&quot;</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 flex-1">
        <section className="bg-white/50 backdrop-blur-sm p-8 rounded-[40px] border border-pink-100 shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-pink-400 mb-8 border-b border-pink-50 pb-2">Vital Records</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase opacity-40">Birth Date</span><span className="font-bold text-[#5d3a3b]">{data.dateOfBirth}</span></div>
              <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase opacity-40">Birth Time</span><span className="font-bold text-[#5d3a3b]">{data.birthTime}</span></div>
              <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase opacity-40">Birth Place</span><span className="font-bold text-[#5d3a3b] text-sm">{data.birthPlace}</span></div>
              <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase opacity-40">Physical Stature</span><span className="font-bold text-[#5d3a3b]">{data.height}</span></div>
           </div>
        </section>

        <section className="bg-white/50 backdrop-blur-sm p-8 rounded-[40px] border border-pink-100 shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-pink-400 mb-8 border-b border-pink-50 pb-2">Academics & Life</h3>
           <div className="space-y-6">
              <div>
                 <p className="text-xs font-bold uppercase opacity-40 mb-2">Education</p>
                 <p className="font-bold text-[#5d3a3b] leading-tight text-lg">{data.education}</p>
              </div>
              <div>
                 <p className="text-xs font-bold uppercase opacity-40 mb-2">Profession</p>
                 <p className="font-bold text-[#5d3a3b] text-lg">{data.occupation}</p>
                 <p className="text-xs font-black text-pink-400 mt-1 uppercase italic">{data.annualIncome && `Income: ${data.annualIncome}`}</p>
              </div>
           </div>
        </section>

        <section className="col-span-2 bg-white/50 backdrop-blur-sm p-10 rounded-[50px] border border-pink-100 shadow-sm">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-pink-400 mb-8 text-center border-b border-pink-50 pb-4">Ancestry & Family</h3>
           <div className="grid grid-cols-2 gap-12">
              <div className="text-center">
                 <p className="text-xs font-bold uppercase opacity-40 mb-2">The Patriarch</p>
                 <p className="font-bold text-[#5d3a3b] text-xl mb-1">{data.fatherName}</p>
                 <p className="text-sm italic opacity-60">{data.fatherOccupation}</p>
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold uppercase opacity-40 mb-2">The Matriarch</p>
                 <p className="font-bold text-[#5d3a3b] text-xl mb-1">{data.motherName}</p>
                 <p className="text-sm italic opacity-60">{data.motherOccupation}</p>
              </div>
              {data.siblings && (
                <div className="col-span-2 pt-8 border-t border-pink-50">
                   <p className="text-xs font-bold uppercase opacity-40 mb-4 text-center">Beloved Siblings</p>
                   <p className="text-center font-bold italic text-gray-500 whitespace-pre-line leading-relaxed">{data.siblings}</p>
                </div>
              )}
           </div>
        </section>
      </div>

      <footer className="mt-12 pt-12 border-t border-pink-100 flex flex-col items-center">
        <div className="flex gap-12 text-sm font-bold text-[#5d3a3b] mb-6">
           <div className="flex items-center gap-2"><Phone size={16} className="text-pink-300" /> {data.phone}</div>
           <div className="flex items-center gap-2"><Mail size={16} className="text-pink-300" /> {data.email}</div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold opacity-40 uppercase tracking-widest">
           <MapPin size={14} /> {data.address}
        </div>
      </footer>
    </div>
  </TemplateWrapper>
);
