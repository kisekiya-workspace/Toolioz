import React from 'react';
import { Camera, Sparkles, Phone, Mail, MapPin, User, Briefcase, Calendar, Heart, Users } from 'lucide-react';
import { BiodataForm } from '../types';
import { TemplateWrapper } from './TemplateWrapper';

export const ModernSplitTemplate = ({ data }: { data: BiodataForm }) => (
  <TemplateWrapper className="flex">
    {/* Left Sidebar */}
    <div className="w-[280px] bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 text-white p-8 flex flex-col shrink-0 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute bottom-48 -right-12 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl"></div>
      </div>

      <div className="flex flex-col items-center text-center mt-6 relative">
        {data.photo ? (
          <div className="relative">
            <img src={data.photo} className="w-44 h-44 rounded-2xl object-cover border-4 border-white/20 shadow-2xl" alt="Profile" crossOrigin="anonymous" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/50"></div>
          </div>
        ) : (
          <div className="w-44 h-44 rounded-2xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
            <Camera size={48} className="text-white/30" />
          </div>
        )}
        <h1 className="text-2xl font-black mt-8 tracking-wider uppercase leading-tight">{data.fullName}</h1>
        <div className="h-1 w-12 bg-purple-400 mt-4 rounded-full"></div>
      </div>
      
      <div className="mt-16 space-y-10 relative">
        <section>
          <h2 className="text-xs font-bold tracking-[0.2em] text-purple-300 uppercase mb-6 flex items-center gap-2">
            <Phone size={14} /> Contact Information
          </h2>
          <div className="space-y-5 text-sm text-purple-100">
            {data.phone && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Phone size={14} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Phone</span>
                  <span>{data.phone}</span>
                </div>
              </div>
            )}
            {data.email && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Mail size={14} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Email</span>
                  <span className="break-all">{data.email}</span>
                </div>
              </div>
            )}
            {data.address && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><MapPin size={14} /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Location</span>
                  <span>{data.address}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold tracking-[0.2em] text-purple-300 uppercase mb-6 flex items-center gap-2">
            <Sparkles size={14} /> Basic Details
          </h2>
          <div className="space-y-4 text-sm text-purple-100">
             {data.height && <div className="flex justify-between border-b border-white/10 pb-2"><span>Height</span><span>{data.height}</span></div>}
             {data.religion && <div className="flex justify-between border-b border-white/10 pb-2"><span>Religion</span><span>{data.religion}</span></div>}
             {data.caste && <div className="flex justify-between border-b border-white/10 pb-2"><span>Caste</span><span>{data.caste}</span></div>}
          </div>
        </section>
      </div>

      <div className="mt-auto pt-8 text-center text-[10px] text-purple-400 uppercase tracking-widest font-bold">
        Premium Marriage Biodata
      </div>
    </div>
    
    {/* Right Content */}
    <div className="flex-1 p-14 bg-white space-y-12 text-gray-700 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
      
      <section className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center"><User size={20} /></div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">About My Personality</h2>
        </div>
        <p className="text-base leading-relaxed text-gray-600 font-medium pl-1">{data.about}</p>
      </section>
      
      <section className="relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center"><Calendar size={20} /></div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Birth & Identity</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-base ml-1">
          {data.dateOfBirth && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date of Birth</span><div className="font-semibold">{data.dateOfBirth}</div></div>}
          {data.birthTime && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Time of Birth</span><div className="font-semibold">{data.birthTime}</div></div>}
          {data.birthPlace && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Place of Birth</span><div className="font-semibold">{data.birthPlace}</div></div>}
          {data.manglik && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Manglik Status</span><div className="font-semibold">{data.manglik}</div></div>}
          {data.languages && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Languages Known</span><div className="font-semibold">{data.languages}</div></div>}
        </div>
      </section>

      <section className="relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center"><Briefcase size={20} /></div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Career & Education</h2>
        </div>
        <div className="space-y-6 ml-1">
          {data.education && (
            <div className="flex gap-4">
              <div className="w-1.5 bg-purple-100 rounded-full"></div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Educational Background</p>
                <p className="text-lg font-bold text-gray-800">{data.education}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-8">
            {data.occupation && (
              <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Profession</span><div className="font-semibold text-gray-800">{data.occupation}</div></div>
            )}
            {data.annualIncome && (
              <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Annual Income</span><div className="font-semibold text-gray-800">{data.annualIncome}</div></div>
            )}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center"><Users size={20} /></div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Family Heritage</h2>
        </div>
        <div className="grid grid-cols-2 gap-12 ml-1">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Father's Details</p>
            <p className="font-bold text-gray-800 text-lg">{data.fatherName}</p>
            <p className="text-sm text-gray-600">{data.fatherOccupation}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mother's Details</p>
            <p className="font-bold text-gray-800 text-lg">{data.motherName}</p>
            <p className="text-sm text-gray-600">{data.motherOccupation}</p>
          </div>
          {data.siblings && (
            <div className="col-span-2 space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Siblings</p>
              <p className="font-medium text-gray-700 whitespace-pre-line">{data.siblings}</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center"><Heart size={20} /></div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Partner Preferences</h2>
        </div>
        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 ml-1">
          <p className="text-base leading-relaxed text-gray-700 font-medium italic">&quot;{data.partnerPreferences}&quot;</p>
        </div>
      </section>
    </div>
  </TemplateWrapper>
);
