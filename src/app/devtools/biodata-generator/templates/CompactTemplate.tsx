import React from 'react';
import { Camera, MapPin, Phone, Mail, User, Heart, Sparkles, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const CompactTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="bg-[#f0f0f0] text-black font-sans p-0 flex flex-col">
    {/* Sidebar Accent */}
    <div className="absolute top-0 left-0 w-3 h-full bg-[#ff4d00]"></div>
    
    <div className="flex-1 ml-3 bg-white flex flex-col p-12">
      <header className="flex justify-between items-end border-b-[8px] border-black pb-8 mb-12">
        <div className="max-w-[70%]">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">Matrimonial Record</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
            {data.fullName.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          <p className="text-xl font-bold bg-[#ff4d00] text-white inline-block px-4 py-1 uppercase">{data.occupation}</p>
        </div>
        {data.photo ? (
          <div className="relative shrink-0">
            <img src={data.photo} className="w-48 h-60 object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" alt="Profile" crossOrigin="anonymous" />
          </div>
        ) : (
          <div className="w-48 h-60 bg-gray-100 border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Camera size={48} className="text-black/20" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-12 flex-1">
        <div className="col-span-4 space-y-12">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5 mb-6 inline-block">Identity</h3>
            <div className="space-y-4">
              {[
                { label: 'DOB', value: data.dateOfBirth },
                { label: 'Time', value: data.birthTime },
                { label: 'Height', value: data.height },
                { label: 'Caste', value: data.caste },
                { label: 'Religion', value: data.religion }
              ].map((item, i) => (
                <div key={i} className="flex flex-col border-b-2 border-black/10 pb-2">
                  <span className="text-[9px] font-black uppercase text-gray-600 mb-1">{item.label}</span>
                  <span className="font-bold text-sm uppercase">{item.value || 'N/A'}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5 mb-6 inline-block">Contact</h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-gray-600">Primary Mobile</span>
                <p className="font-bold text-sm">{data.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-gray-600">Electronic Mail</span>
                <p className="font-bold text-xs break-all uppercase">{data.email}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-8 flex flex-col">
          <section className="mb-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5 mb-8 inline-block">Professional</h3>
            <div className="border-4 border-black p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff4d00] -mr-8 -mt-8 rotate-45"></div>
              <p className="text-2xl font-black uppercase leading-[0.9] mb-6">{data.education}</p>
              <div className="flex items-center gap-2 font-black text-xs uppercase bg-black text-white inline-flex px-3 py-1">
                Income: {data.annualIncome} <ChevronRight size={14} className="text-[#ff4d00]" />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5 mb-8 inline-block">Genealogy</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-gray-600">Patriarch</p>
                <p className="font-black text-xl uppercase leading-tight">{data.fatherName}</p>
                <p className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest">{data.fatherOccupation}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-gray-600">Matriarch</p>
                <p className="font-black text-xl uppercase leading-tight">{data.motherName}</p>
                <p className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest">{data.motherOccupation}</p>
              </div>
              {data.siblings && (
                <div className="col-span-2 pt-6 border-t-2 border-black">
                  <p className="text-[9px] font-black uppercase text-gray-600 mb-2">Kinship Details</p>
                  <p className="font-bold text-xs uppercase leading-relaxed text-gray-700">{data.siblings}</p>
                </div>
              )}
            </div>
          </section>

          <section className="mt-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1.5 mb-6 inline-block">Statement</h3>
            <p className="text-sm font-bold text-gray-700 uppercase leading-relaxed tracking-wider border-l-[8px] border-[#ff4d00] pl-6 italic">
              &quot;{data.about}&quot;
            </p>
          </section>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t-4 border-black flex justify-between items-center">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
          <MapPin size={14} className="text-[#ff4d00]" /> {data.address}
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em]">Compact Series // Toolioz</div>
      </footer>
    </div>
  </TemplateWrapper>
);
