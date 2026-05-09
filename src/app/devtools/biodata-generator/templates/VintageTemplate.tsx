import React from 'react';
import { Camera, MapPin, Phone, Mail, User, Heart, Sparkles } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const VintageTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#f4ead5] text-[#4a3728] font-serif p-16">
    {/* Parchment Texture Overlay */}
    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }}></div>
    
    {/* Rough Hand-drawn Border */}
    <div className="absolute inset-8 border-[3px] border-[#8b7355] opacity-40 rounded-[2px]" style={{ clipPath: 'polygon(0% 0%, 100% 1%, 99% 100%, 1% 98%)' }}></div>
    <div className="absolute inset-10 border-[1px] border-[#8b7355] opacity-20 rounded-[1px]" style={{ clipPath: 'polygon(1% 2%, 98% 0%, 100% 99%, 0% 100%)' }}></div>

    <div className="relative z-10 flex flex-col h-full">
      <div className="text-center mb-12">
        <div className="text-[#8b7355] text-4xl mb-4 font-normal italic">~ Matrimonial ~</div>
        <h1 className="text-5xl font-bold tracking-tight uppercase mb-2 border-b-2 border-[#8b7355]/30 inline-block px-8 pb-2">Biodata</h1>
        <div className="text-[#8b7355] mt-4 uppercase tracking-[0.3em] text-xs font-bold">Est. {new Date().getFullYear()}</div>
      </div>

      <div className="flex gap-12 mb-12 items-start">
        {data.photo ? (
          <div className="shrink-0 relative transform -rotate-2 border-[12px] border-white shadow-xl">
            <img src={data.photo} className="w-48 h-56 object-cover grayscale-[30%] sepia-[20%]" alt="Profile" crossOrigin="anonymous" />
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
          </div>
        ) : (
          <div className="w-48 h-56 shrink-0 bg-white/50 border-2 border-dashed border-[#8b7355]/40 flex items-center justify-center transform -rotate-2">
            <Camera size={48} className="text-[#8b7355]/20" />
          </div>
        )}
        <div className="flex-1 pt-4">
          <h2 className="text-4xl font-bold mb-6 text-[#2d1e12] leading-tight">{data.fullName}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm italic opacity-80"><Heart size={16} /> Seeking a meaningful companionship</div>
            <div className="flex items-center gap-3 text-sm italic opacity-80"><Sparkles size={16} /> {data.religion} {data.caste ? `(${data.caste})` : ''}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-16 gap-y-12">
        <section>
          <h3 className="text-[#8b7355] uppercase tracking-widest font-bold text-xs mb-6 border-b border-[#8b7355]/20 pb-2">Personal Records</h3>
          <div className="space-y-4 text-base italic">
            <div className="flex justify-between"><span>Born on</span><span className="font-bold not-italic">{data.dateOfBirth}</span></div>
            <div className="flex justify-between"><span>Time</span><span className="font-bold not-italic">{data.birthTime}</span></div>
            <div className="flex justify-between"><span>Place</span><span className="font-bold not-italic">{data.birthPlace}</span></div>
            <div className="flex justify-between"><span>Height</span><span className="font-bold not-italic">{data.height}</span></div>
          </div>
        </section>

        <section>
          <h3 className="text-[#8b7355] uppercase tracking-widest font-bold text-xs mb-6 border-b border-[#8b7355]/20 pb-2">Vocation & Learning</h3>
          <div className="space-y-4 text-base italic">
            <p className="font-bold not-italic text-lg mb-1 leading-tight">{data.education}</p>
            <p className="text-[#4a3728]/80">{data.occupation}</p>
            {data.annualIncome && <p className="text-xs uppercase font-bold text-[#8b7355]">Earnings: {data.annualIncome}</p>}
          </div>
        </section>

        <section className="col-span-2">
          <h3 className="text-[#8b7355] uppercase tracking-widest font-bold text-xs mb-6 border-b border-[#8b7355]/20 pb-2 text-center">Family Lineage</h3>
          <div className="grid grid-cols-2 gap-12 italic">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#8b7355] mb-2">Paternal</p>
              <p className="font-bold not-italic text-xl">{data.fatherName}</p>
              <p className="text-sm opacity-80">{data.fatherOccupation}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#8b7355] mb-2">Maternal</p>
              <p className="font-bold not-italic text-xl">{data.motherName}</p>
              <p className="text-sm opacity-80">{data.motherOccupation}</p>
            </div>
            {data.siblings && (
              <div className="col-span-2 pt-4 border-t border-[#8b7355]/10">
                <p className="text-[10px] uppercase font-bold text-[#8b7355] mb-2">Kith & Kin</p>
                <p className="text-sm leading-relaxed whitespace-pre-line">{data.siblings}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="mt-auto pt-16 flex flex-col items-center border-t border-[#8b7355]/20">
        <div className="flex gap-12 text-sm font-bold uppercase tracking-widest mb-4">
          <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>
          <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>
        </div>
        <div className="flex items-center gap-2 text-xs italic opacity-60 text-center max-w-sm">
          <MapPin size={12} className="shrink-0" /> {data.address}
        </div>
      </footer>
    </div>
  </TemplateWrapper>
);
