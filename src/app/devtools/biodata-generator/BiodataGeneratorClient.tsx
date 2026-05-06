'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Camera, Download, LayoutTemplate, Edit3, ZoomIn, ZoomOut, Maximize, ChevronDown, ChevronUp, Image as ImageIcon, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

// --- TYPES & CONSTANTS ---
type TemplateId = 'modern' | 'classic' | 'minimalist' | 'hindu' | 'islamic' | 'sikh';

type BiodataForm = {
  photo: string | null;
  fullName: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  religion: string;
  caste: string;
  manglik: string;
  education: string;
  occupation: string;
  annualIncome: string;
  about: string;
  hobbies: string;
  languages: string;
  partnerPreferences: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  phone: string;
  email: string;
  address: string;
};

const initialForm: BiodataForm = {
  photo: null,
  fullName: 'Gaurav Mehta',
  dateOfBirth: '15-08-1997',
  birthTime: '06:30 PM',
  birthPlace: 'Jaipur',
  height: '5\'9"',
  religion: 'Hindu',
  caste: 'Brahmin',
  manglik: 'Yes',
  education: 'Master of Arts in Literature, Delhi University',
  occupation: 'Content Editor at a leading Publishing House',
  annualIncome: '18+ LPA',
  about: 'I am a passionate, adventurous, and creatively inclined individual with a keen interest in exploration. I appreciate the beauty of diverse experiences and hold my friends and personal interests in high regard.',
  hobbies: 'Writing, Painting',
  languages: 'English, Marathi',
  partnerPreferences: 'I seek a partner who values honesty, mutual respect, and a zest for life. A shared sense of adventure and an appreciation for life\'s small joys are important to me.',
  fatherName: 'Mr. Rajesh Mehta',
  fatherOccupation: 'Retired Bank Manager',
  motherName: 'Mrs. Suman Mehta',
  motherOccupation: 'Homemaker',
  siblings: 'Rohan Mehta, Civil Engineer at L&T\nPriya Mehta, Assistant Professor',
  phone: '+91 9876543210',
  email: 'gaurav.mehta@example.com',
  address: 'Bangalore, Karnataka, India',
};

// --- TEMPLATES ---
const ModernSplitTemplate = ({ data }: { data: BiodataForm }) => (
  <div className="w-[794px] min-h-[1123px] bg-white text-gray-800 flex shadow-sm relative overflow-hidden" id="biodata-document">
    {/* Left Sidebar */}
    <div className="w-[280px] bg-purple-900 text-white p-8 flex flex-col shrink-0">
      <div className="flex flex-col items-center text-center mt-4">
        {data.photo ? (
          <img src={data.photo} className="w-40 h-40 rounded-full object-cover border-4 border-white/20 shadow-xl" alt="Profile" crossOrigin="anonymous" />
        ) : (
          <div className="w-40 h-40 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center">
            <Camera size={40} className="text-white/50" />
          </div>
        )}
        <h1 className="text-2xl font-bold mt-6 tracking-wide uppercase">{data.fullName}</h1>
        <p className="text-purple-200 mt-2">{data.dateOfBirth}</p>
      </div>
      
      <div className="mt-12 space-y-6">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-purple-300 uppercase border-b border-purple-700 pb-2 mb-4">Contact</h2>
          <div className="space-y-3 text-sm text-purple-100">
            {data.phone && <p>📞 {data.phone}</p>}
            {data.email && <p>✉️ {data.email}</p>}
            {data.address && <p>📍 {data.address}</p>}
          </div>
        </div>
      </div>
    </div>
    
    {/* Right Content */}
    <div className="flex-1 p-10 bg-white space-y-8 text-gray-700">
      <section>
        <h2 className="text-xl font-bold text-purple-900 border-b-2 border-purple-100 pb-2 mb-4 uppercase">About Me</h2>
        <p className="text-sm leading-relaxed">{data.about}</p>
      </section>
      
      <section>
        <h2 className="text-xl font-bold text-purple-900 border-b-2 border-purple-100 pb-2 mb-4 uppercase">Personal Details</h2>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {data.dateOfBirth && <><div className="font-semibold text-gray-500">DOB</div><div>{data.dateOfBirth}</div></>}
          {data.birthTime && <><div className="font-semibold text-gray-500">Time</div><div>{data.birthTime}</div></>}
          {data.birthPlace && <><div className="font-semibold text-gray-500">Birth Place</div><div>{data.birthPlace}</div></>}
          {data.height && <><div className="font-semibold text-gray-500">Height</div><div>{data.height}</div></>}
          {data.religion && <><div className="font-semibold text-gray-500">Religion</div><div>{data.religion}</div></>}
          {data.caste && <><div className="font-semibold text-gray-500">Caste</div><div>{data.caste}</div></>}
          {data.manglik && <><div className="font-semibold text-gray-500">Manglik</div><div>{data.manglik}</div></>}
          {data.languages && <><div className="font-semibold text-gray-500">Languages</div><div>{data.languages}</div></>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-purple-900 border-b-2 border-purple-100 pb-2 mb-4 uppercase">Education & Profession</h2>
        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
          {data.education && <><div className="font-semibold text-gray-500">Education</div><div>{data.education}</div></>}
          {data.occupation && <><div className="font-semibold text-gray-500">Profession</div><div>{data.occupation}</div></>}
          {data.annualIncome && <><div className="font-semibold text-gray-500">Income</div><div>{data.annualIncome}</div></>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-purple-900 border-b-2 border-purple-100 pb-2 mb-4 uppercase">Family Details</h2>
        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
          <div className="font-semibold text-gray-500">Father</div>
          <div>{data.fatherName}{data.fatherOccupation ? ` - ${data.fatherOccupation}` : ''}</div>
          
          <div className="font-semibold text-gray-500">Mother</div>
          <div>{data.motherName}{data.motherOccupation ? ` - ${data.motherOccupation}` : ''}</div>
          
          {data.siblings && (
            <>
              <div className="font-semibold text-gray-500">Siblings</div>
              <div className="whitespace-pre-line">{data.siblings}</div>
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-purple-900 border-b-2 border-purple-100 pb-2 mb-4 uppercase">Partner Expectations</h2>
        <p className="text-sm leading-relaxed">{data.partnerPreferences}</p>
      </section>
    </div>
  </div>
);

const ClassicCenteredTemplate = ({ data }: { data: BiodataForm }) => (
  <div className="w-[794px] min-h-[1123px] bg-[#fbf9f6] text-[#3e3a35] p-12 relative overflow-hidden" id="biodata-document">
    <div className="absolute inset-4 border-2 border-[#8b2332] opacity-20 pointer-events-none"></div>
    <div className="absolute inset-5 border border-[#8b2332] opacity-10 pointer-events-none"></div>
    
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl font-serif font-bold text-[#8b2332] tracking-widest uppercase mb-6">Biodata</h1>
      {data.photo ? (
        <div className="mb-6 rounded-full p-1 border-2 border-[#8b2332]">
          <img src={data.photo} className="w-36 h-36 rounded-full object-cover" alt="Profile" crossOrigin="anonymous" />
        </div>
      ) : (
        <div className="mb-6 rounded-full p-1 border-2 border-[#8b2332]">
          <div className="w-36 h-36 rounded-full bg-black/5 flex items-center justify-center">
            <Camera size={36} className="text-[#8b2332]/50" />
          </div>
        </div>
      )}
      <h2 className="text-2xl font-serif font-bold text-[#2d2a26] mb-1">{data.fullName}</h2>
    </div>

    <div className="mt-8 space-y-6 max-w-[600px] mx-auto">
      <div className="bg-white/50 p-6 rounded-lg border border-[#8b2332]/10">
        <h3 className="text-[#8b2332] font-serif font-bold text-lg mb-4 text-center border-b border-[#8b2332]/20 pb-2">Personal Details</h3>
        <table className="w-full text-sm">
          <tbody>
            {data.dateOfBirth && <tr><td className="py-1.5 font-semibold w-[160px]">Date of Birth</td><td>: {data.dateOfBirth}</td></tr>}
            {data.birthTime && <tr><td className="py-1.5 font-semibold">Time of Birth</td><td>: {data.birthTime}</td></tr>}
            {data.birthPlace && <tr><td className="py-1.5 font-semibold">Place of Birth</td><td>: {data.birthPlace}</td></tr>}
            {data.height && <tr><td className="py-1.5 font-semibold">Height</td><td>: {data.height}</td></tr>}
            {data.religion && <tr><td className="py-1.5 font-semibold">Religion / Caste</td><td>: {data.religion}{data.caste ? ` / ${data.caste}` : ''}</td></tr>}
            {data.manglik && <tr><td className="py-1.5 font-semibold">Manglik</td><td>: {data.manglik}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white/50 p-6 rounded-lg border border-[#8b2332]/10">
        <h3 className="text-[#8b2332] font-serif font-bold text-lg mb-4 text-center border-b border-[#8b2332]/20 pb-2">Education & Profession</h3>
        <table className="w-full text-sm">
          <tbody>
            {data.education && <tr><td className="py-1.5 font-semibold w-[160px]">Education</td><td>: {data.education}</td></tr>}
            {data.occupation && <tr><td className="py-1.5 font-semibold">Profession</td><td>: {data.occupation}</td></tr>}
            {data.annualIncome && <tr><td className="py-1.5 font-semibold">Income</td><td>: {data.annualIncome}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white/50 p-6 rounded-lg border border-[#8b2332]/10">
        <h3 className="text-[#8b2332] font-serif font-bold text-lg mb-4 text-center border-b border-[#8b2332]/20 pb-2">Family Details</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr><td className="py-1.5 font-semibold w-[160px]">Father&apos;s Name</td><td>: {data.fatherName} {data.fatherOccupation && `(${data.fatherOccupation})`}</td></tr>
            <tr><td className="py-1.5 font-semibold">Mother&apos;s Name</td><td>: {data.motherName} {data.motherOccupation && `(${data.motherOccupation})`}</td></tr>
            {data.siblings && <tr><td className="py-1.5 font-semibold align-top">Siblings</td><td className="whitespace-pre-line">: {data.siblings}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white/50 p-6 rounded-lg border border-[#8b2332]/10 text-center">
        <h3 className="text-[#8b2332] font-serif font-bold text-lg mb-4 border-b border-[#8b2332]/20 pb-2">Contact Info</h3>
        <p className="text-sm">
          {data.phone && <span className="mx-2">📞 {data.phone}</span>}
          {data.email && <span className="mx-2">✉️ {data.email}</span>}
        </p>
        {data.address && <p className="text-sm mt-2">📍 {data.address}</p>}
      </div>
    </div>
  </div>
);

const MinimalistTemplate = ({ data }: { data: BiodataForm }) => (
  <div className="w-[794px] min-h-[1123px] bg-white text-gray-800 p-16 relative" id="biodata-document">
    <div className="flex gap-8 items-start border-b border-gray-200 pb-8 mb-8">
      {data.photo ? (
        <img src={data.photo} className="w-32 h-32 rounded-lg object-cover bg-gray-100 shrink-0" alt="Profile" crossOrigin="anonymous" />
      ) : (
        <div className="w-32 h-32 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
          <Camera className="text-gray-400" />
        </div>
      )}
      <div className="flex-1 mt-2">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">{data.fullName}</h1>
        <p className="text-lg text-gray-500 mb-4">{data.occupation}</p>
        <div className="flex gap-4 text-sm text-gray-400">
            {data.phone && <span>{data.phone}</span>}
            {data.email && <span>{data.email}</span>}
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-12">
      <div className="space-y-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">About</h2>
          <p className="text-sm leading-relaxed text-gray-600">{data.about}</p>
        </section>
        
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Personal Details</h2>
          <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b border-gray-50 pb-1"><span>DOB</span> <span className="font-medium text-gray-900">{data.dateOfBirth}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span>Time</span> <span className="font-medium text-gray-900">{data.birthTime}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span>Height</span> <span className="font-medium text-gray-900">{data.height}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span>Religion</span> <span className="font-medium text-gray-900">{data.religion}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-1"><span>Caste</span> <span className="font-medium text-gray-900">{data.caste}</span></div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contact & Location</h2>
          <p className="text-sm text-gray-600">{data.address}</p>
        </section>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h2>
          <p className="text-sm text-gray-600">{data.education}</p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Family Background</h2>
          <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Father: {data.fatherName}</p>
                <p className="text-gray-500">{data.fatherOccupation}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Mother: {data.motherName}</p>
                <p className="text-gray-500">{data.motherOccupation}</p>
              </div>
              {data.siblings && (
                <div>
                  <p className="font-medium text-gray-900">Siblings:</p>
                  <p className="whitespace-pre-line text-gray-500 mt-1">{data.siblings}</p>
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  </div>
);

const HinduTemplate = ({ data }: { data: BiodataForm }) => (
  <div className="w-[794px] min-h-[1123px] bg-[#fffaf0] text-[#5c0000] p-12 relative overflow-hidden font-serif" id="biodata-document">
    <div className="absolute inset-3 border-[6px] border-double border-[#d4af37] pointer-events-none opacity-60"></div>
    <div className="absolute inset-5 border border-[#d4af37] pointer-events-none opacity-40"></div>
    <div className="absolute left-8 top-8 text-3xl text-[#f97316]/30">ॐ</div>
    <div className="absolute right-8 top-8 text-3xl text-[#f97316]/30">ॐ</div>
    <div className="absolute bottom-8 left-8 text-3xl text-[#f97316]/30">ॐ</div>
    <div className="absolute bottom-8 right-8 text-3xl text-[#f97316]/30">ॐ</div>
    <div className="absolute left-12 right-12 top-24 h-1 bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent"></div>
    
    <div className="flex flex-col items-center text-center">
      <div className="text-5xl text-[#e63946] mb-2 leading-none">ॐ</div>
      <div className="text-lg text-[#800000] font-bold tracking-widest uppercase mb-6">|| Shree Ganeshay Namah ||</div>
      
      {data.photo && (
        <div className="mb-6 rounded-tl-3xl rounded-br-3xl p-1 border-2 border-[#d4af37]">
          <img src={data.photo} className="w-36 h-36 rounded-tl-2xl rounded-br-2xl object-cover" alt="Profile" crossOrigin="anonymous" />
        </div>
      )}
      <h2 className="text-3xl font-bold text-[#800000] mb-1">{data.fullName}</h2>
    </div>

    <div className="mt-8 space-y-6 max-w-[650px] mx-auto">
      <div className="p-4 border-t-2 border-b-2 border-[#d4af37]/30">
        <h3 className="text-[#e63946] font-bold text-xl mb-4 text-center">Personal Details</h3>
        <table className="w-full text-base">
          <tbody>
            {data.dateOfBirth && <tr><td className="py-1.5 font-semibold w-[180px]">Date of Birth</td><td>: {data.dateOfBirth}</td></tr>}
            {data.birthTime && <tr><td className="py-1.5 font-semibold">Time of Birth</td><td>: {data.birthTime}</td></tr>}
            {data.birthPlace && <tr><td className="py-1.5 font-semibold">Place of Birth</td><td>: {data.birthPlace}</td></tr>}
            {data.height && <tr><td className="py-1.5 font-semibold">Height</td><td>: {data.height}</td></tr>}
            {data.religion && <tr><td className="py-1.5 font-semibold">Religion / Caste</td><td>: {data.religion}{data.caste ? ` / ${data.caste}` : ''}</td></tr>}
            {data.manglik && <tr><td className="py-1.5 font-semibold">Manglik</td><td>: {data.manglik}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t-2 border-b-2 border-[#d4af37]/30">
        <h3 className="text-[#e63946] font-bold text-xl mb-4 text-center">Education & Profession</h3>
        <table className="w-full text-base">
          <tbody>
            {data.education && <tr><td className="py-1.5 font-semibold w-[180px]">Education</td><td>: {data.education}</td></tr>}
            {data.occupation && <tr><td className="py-1.5 font-semibold">Profession</td><td>: {data.occupation}</td></tr>}
            {data.annualIncome && <tr><td className="py-1.5 font-semibold">Income</td><td>: {data.annualIncome}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t-2 border-b-2 border-[#d4af37]/30">
        <h3 className="text-[#e63946] font-bold text-xl mb-4 text-center">Family Details</h3>
        <table className="w-full text-base">
          <tbody>
            <tr><td className="py-1.5 font-semibold w-[180px] align-top">Father&apos;s Name</td><td>: {data.fatherName} <br/><span className="text-sm opacity-80">{data.fatherOccupation}</span></td></tr>
            <tr><td className="py-1.5 font-semibold align-top mt-2 block">Mother&apos;s Name</td><td>: {data.motherName} <br/><span className="text-sm opacity-80">{data.motherOccupation}</span></td></tr>
            {data.siblings && <tr><td className="py-1.5 font-semibold align-top mt-2 block">Siblings</td><td className="whitespace-pre-line">: {data.siblings}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="p-4 text-center">
        <h3 className="text-[#e63946] font-bold text-xl mb-4">Contact Info</h3>
        <p className="text-base font-medium">
          {data.phone && <span className="mx-3">📞 {data.phone}</span>}
          {data.email && <span className="mx-3">✉️ {data.email}</span>}
        </p>
        {data.address && <p className="text-base mt-2">📍 {data.address}</p>}
      </div>
    </div>
  </div>
);

const IslamicTemplate = ({ data }: { data: BiodataForm }) => (
  <div className="w-[794px] min-h-[1123px] bg-[#f0fdf4] text-[#064e3b] p-12 relative overflow-hidden font-serif" id="biodata-document">
    <div className="absolute inset-4 border-[3px] border-[#10b981] opacity-30 rounded-t-[200px] pointer-events-none"></div>
    <div className="absolute inset-[22px] border border-[#10b981] opacity-20 rounded-t-[190px] pointer-events-none"></div>
    <div className="absolute left-10 top-10 h-12 w-12 rounded-full border-2 border-[#10b981]/30"></div>
    <div className="absolute left-14 top-10 h-12 w-12 rounded-full bg-[#f0fdf4]"></div>
    <div className="absolute right-10 top-10 h-12 w-12 rounded-full border-2 border-[#10b981]/30"></div>
    <div className="absolute right-14 top-10 h-12 w-12 rounded-full bg-[#f0fdf4]"></div>
    
    <div className="flex flex-col items-center text-center mt-8">
      <div className="text-5xl text-[#047857] mb-3 font-sans">﷽</div>
      
      {data.photo && (
        <div className="mb-6 rounded-full p-1 border-2 border-[#10b981]/50 bg-white shadow-sm mt-4">
          <img src={data.photo} className="w-36 h-36 rounded-full object-cover" alt="Profile" crossOrigin="anonymous" />
        </div>
      )}
      <h2 className="text-3xl font-bold text-[#064e3b] mt-2 mb-1">{data.fullName}</h2>
      <div className="w-32 h-0.5 bg-[#10b981]/40 my-3"></div>
    </div>

    <div className="mt-6 space-y-6 max-w-[650px] mx-auto">
      <div className="bg-white/60 p-5 rounded-lg shadow-sm border border-[#10b981]/10">
        <h3 className="text-[#047857] font-bold text-lg mb-3 border-b border-[#10b981]/20 pb-2">Personal Details</h3>
        <table className="w-full text-base">
          <tbody>
            {data.dateOfBirth && <tr><td className="py-1 font-semibold w-[180px]">Date of Birth</td><td>: {data.dateOfBirth}</td></tr>}
            {data.height && <tr><td className="py-1 font-semibold">Height</td><td>: {data.height}</td></tr>}
            {data.religion && <tr><td className="py-1 font-semibold">Religion/Sect</td><td>: {data.religion}{data.caste ? ` / ${data.caste}` : ''}</td></tr>}
            {data.education && <tr><td className="py-1 font-semibold">Education</td><td>: {data.education}</td></tr>}
            {data.occupation && <tr><td className="py-1 font-semibold">Occupation</td><td>: {data.occupation}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-white/60 p-5 rounded-lg shadow-sm border border-[#10b981]/10">
        <h3 className="text-[#047857] font-bold text-lg mb-3 border-b border-[#10b981]/20 pb-2">Family Details</h3>
        <table className="w-full text-base">
          <tbody>
            <tr><td className="py-1 font-semibold w-[180px] align-top">Father</td><td>: {data.fatherName} {data.fatherOccupation && `(${data.fatherOccupation})`}</td></tr>
            <tr><td className="py-1 font-semibold align-top mt-1 block">Mother</td><td>: {data.motherName} {data.motherOccupation && `(${data.motherOccupation})`}</td></tr>
            {data.siblings && <tr><td className="py-1 font-semibold align-top mt-1 block">Siblings</td><td className="whitespace-pre-line">: {data.siblings}</td></tr>}
          </tbody>
        </table>
      </div>
      
      {data.about && (
        <div className="bg-white/60 p-5 rounded-lg shadow-sm border border-[#10b981]/10">
          <h3 className="text-[#047857] font-bold text-lg mb-3 border-b border-[#10b981]/20 pb-2">About Me</h3>
          <p className="text-sm leading-relaxed">{data.about}</p>
        </div>
      )}

      <div className="bg-white/60 p-5 rounded-lg shadow-sm border border-[#10b981]/10 text-center">
        <h3 className="text-[#047857] font-bold text-lg mb-3">Contact</h3>
        <p className="text-base">
          {data.phone && <span className="mx-3">📞 {data.phone}</span>}
          {data.email && <span className="mx-3">✉️ {data.email}</span>}
        </p>
        {data.address && <p className="text-sm mt-2">📍 {data.address}</p>}
      </div>
    </div>
  </div>
);

const SikhTemplate = ({ data }: { data: BiodataForm }) => (
  <div className="w-[794px] min-h-[1123px] bg-[#f8fafc] text-[#0f172a] p-12 relative overflow-hidden font-sans" id="biodata-document">
    <div className="absolute top-0 left-0 right-0 h-4 bg-[#1e3a8a]"></div>
    <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#f97316]"></div>
    <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#1e3a8a]"></div>
    <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#f97316]"></div>
    <div className="absolute left-10 top-10 text-4xl text-[#f97316]/20">ੴ</div>
    <div className="absolute right-10 top-10 text-4xl text-[#1e3a8a]/20">ੴ</div>
    
    <div className="flex flex-col items-center text-center mt-6">
      <div className="text-5xl text-[#f97316] mb-4 drop-shadow-sm font-bold">ੴ</div>
      <h1 className="text-xl font-bold text-[#1e3a8a] tracking-widest uppercase mb-8">Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh</h1>
      
      {data.photo && (
        <div className="mb-6 rounded bg-white p-2 shadow-md border border-gray-200">
          <img src={data.photo} className="w-36 h-36 rounded object-cover" alt="Profile" crossOrigin="anonymous" />
        </div>
      )}
      <h2 className="text-4xl font-bold text-[#1e3a8a] mb-2">{data.fullName}</h2>
    </div>

    <div className="mt-10 space-y-8 max-w-[650px] mx-auto">
      <div className="relative border-l-4 border-[#f97316] pl-6 py-2">
        <h3 className="text-[#1e3a8a] font-bold text-xl mb-4 uppercase tracking-wider">Personal & Professional</h3>
        <table className="w-full text-base">
          <tbody>
            {data.dateOfBirth && <tr><td className="py-1 font-semibold w-[180px] text-gray-500">Date of Birth</td><td className="font-medium">{data.dateOfBirth}</td></tr>}
            {data.height && <tr><td className="py-1 font-semibold text-gray-500">Height</td><td className="font-medium">{data.height}</td></tr>}
            {data.religion && <tr><td className="py-1 font-semibold text-gray-500">Religion/Caste</td><td className="font-medium">{data.religion}{data.caste ? ` / ${data.caste}` : ''}</td></tr>}
            {data.education && <tr><td className="py-1 font-semibold text-gray-500">Education</td><td className="font-medium">{data.education}</td></tr>}
            {data.occupation && <tr><td className="py-1 font-semibold text-gray-500">Occupation</td><td className="font-medium">{data.occupation}</td></tr>}
            {data.annualIncome && <tr><td className="py-1 font-semibold text-gray-500">Income</td><td className="font-medium">{data.annualIncome}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="relative border-l-4 border-[#1e3a8a] pl-6 py-2">
        <h3 className="text-[#f97316] font-bold text-xl mb-4 uppercase tracking-wider">Family Background</h3>
        <table className="w-full text-base">
          <tbody>
            <tr><td className="py-1 font-semibold w-[180px] text-gray-500 align-top">Father</td><td className="font-medium">{data.fatherName} <br/><span className="text-sm font-normal text-gray-500">{data.fatherOccupation}</span></td></tr>
            <tr><td className="py-1 font-semibold text-gray-500 align-top mt-2 block">Mother</td><td className="font-medium">{data.motherName} <br/><span className="text-sm font-normal text-gray-500">{data.motherOccupation}</span></td></tr>
            {data.siblings && <tr><td className="py-1 font-semibold text-gray-500 align-top mt-2 block">Siblings</td><td className="whitespace-pre-line font-medium">{data.siblings}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-100 p-6 rounded text-center shadow-inner mt-8">
        <h3 className="text-gray-800 font-bold text-lg mb-3">Contact Details</h3>
        <p className="text-base font-semibold text-[#1e3a8a]">
          {data.phone && <span className="mx-3">📞 {data.phone}</span>}
          {data.email && <span className="mx-3">✉️ {data.email}</span>}
        </p>
        {data.address && <p className="text-sm mt-2 text-gray-600">📍 {data.address}</p>}
      </div>
    </div>
  </div>
);

export default function BiodataGeneratorClient() {
  const [activeTab, setActiveTab] = useState<'templates' | 'edit' | 'preview'>('edit');
  const [templateId, setTemplateId] = useState<TemplateId>('modern');
  const [form, setForm] = useState<BiodataForm>(initialForm);
  const [openAccordion, setOpenAccordion] = useState<string>('personal');
  const [zoom, setZoom] = useState(0.7);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const waitForPreviewPaint = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

  useEffect(() => {
    const saved = localStorage.getItem('biodata_form');
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        localStorage.removeItem('biodata_form');
      }
    }
    const savedTemplate = localStorage.getItem('biodata_template');
    if (savedTemplate) {
      setTemplateId(savedTemplate as TemplateId);
    }
    
    // Auto-adjust zoom for mobile on load
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setZoom(0.4);
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('biodata_form', JSON.stringify(form));
      localStorage.setItem('biodata_template', templateId);
    }
  }, [form, templateId, isLoaded]);

  const updateField = (field: keyof BiodataForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm({ ...form, photo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getExportElement = async () => {
    let element = document.getElementById('biodata-document');
    if (element) return element;

    setActiveTab('preview');
    await waitForPreviewPaint();

    element = document.getElementById('biodata-document');
    return element;
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const exportPdf = async () => {
    const element = await getExportElement();
    if (!element) return;
    try {
      setIsExportingPdf(true);
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const imgData = await htmlToImage.toJpeg(element, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: isMobile ? 1.75 : 2,
        backgroundColor: '#ffffff',
      });
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `${form.fullName.replace(/\s+/g, '_') || 'Biodata'}.pdf`;
      const blob = pdf.output('blob');
      downloadBlob(blob, fileName);
      
    } catch (e) {
      console.error('Failed to export PDF', e);
      window.alert('PDF export failed. Please open Preview and try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const exportPng = async () => {
    const element = await getExportElement();
    if (!element) return;
    try {
      setIsExportingPng(true);
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const blob = await htmlToImage.toBlob(element, {
        cacheBust: true,
        pixelRatio: isMobile ? 1.75 : 2,
        backgroundColor: '#ffffff',
      });
      if (!blob) throw new Error('Unable to render biodata image.');
      downloadBlob(blob, `${form.fullName.replace(/\s+/g, '_') || 'Biodata'}.png`);
    } catch (e) {
      console.error('Failed to export PNG', e);
      window.alert('PNG export failed. Please open Preview and try again.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern': return <ModernSplitTemplate data={form} />;
      case 'classic': return <ClassicCenteredTemplate data={form} />;
      case 'minimalist': return <MinimalistTemplate data={form} />;
      case 'hindu': return <HinduTemplate data={form} />;
      case 'islamic': return <IslamicTemplate data={form} />;
      case 'sikh': return <SikhTemplate data={form} />;
    }
  };

  const AccordionItem = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => {
    const isOpen = openAccordion === id;
    return (
      <div className="border-b border-gray-200">
        <button
          className="w-full flex items-center justify-between py-4 text-left font-semibold text-gray-800 hover:text-purple-600 transition-colors focus:outline-none"
          onClick={() => setOpenAccordion(isOpen ? '' : id)}
        >
          {title}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {isOpen && <div className="pb-5 space-y-4 animate-in slide-in-from-top-2">{children}</div>}
      </div>
    );
  };

  const Input = ({ label, field, placeholder, type = 'text' }: { label: string, field: keyof BiodataForm, placeholder?: string, type?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none transition"
          rows={3}
          value={form[field] || ''}
          placeholder={placeholder}
          onChange={(e) => updateField(field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none transition"
          value={form[field] || ''}
          placeholder={placeholder}
          onChange={(e) => updateField(field, e.target.value)}
        />
      )}
    </div>
  );

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm">
        <div className="min-w-0 flex items-center gap-2 text-lg sm:text-xl font-black text-gray-900 tracking-tight">
          <Sparkles className="text-purple-600" size={20} />
          <span className="hidden sm:inline">Biodata<span className="text-purple-600">Generator</span></span>
          <span className="sm:hidden">Biodata</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to load sample data? This will overwrite your current details.')) {
                setForm(initialForm);
              }
            }}
            className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 px-2 sm:px-3 py-2"
          >
            Sample
          </button>
          <button onClick={exportPng} disabled={isExportingPng} className="hidden lg:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold transition disabled:opacity-50">
            {isExportingPng ? 'Exporting...' : 'Export PNG'}
          </button>
          <button onClick={exportPdf} disabled={isExportingPdf} className="flex items-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-purple-200 transition disabled:opacity-50">
            <Download size={14} className="sm:w-4 sm:h-4" />
            {isExportingPdf ? 'Wait...' : 'Export PDF'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar / Mobile Full Area */}
        <aside className={`w-full lg:w-[400px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${activeTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Tabs */}
          <div className="flex p-2 gap-1 bg-gray-100/50 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'templates' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <LayoutTemplate size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Templates</span><span className="xs:hidden">Tmplts</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'edit' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Edit3 size={14} className="sm:w-4 sm:h-4" /> Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`lg:hidden flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'preview' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <ZoomIn size={14} className="sm:w-4 sm:h-4" /> Preview
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="mb-5 rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-950">
              <div className="font-bold">Selected template: {templateId.charAt(0).toUpperCase() + templateId.slice(1)}</div>
              <div className="mt-1 text-xs leading-5 text-purple-800">Use Preview before export to inspect spacing, photo crop, and long family details.</div>
            </div>
            {activeTab === 'templates' ? (
              <div className="space-y-4 pb-20 lg:pb-0">
                <div 
                  onClick={() => setTemplateId('modern')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'modern' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-gray-900 mb-1">Modern Split</div>
                    <p className="text-xs text-gray-500 mb-3">Professional dual-column layout with a distinct color sidebar.</p>
                    <div className="h-32 w-full rounded border border-gray-200 bg-[linear-gradient(90deg,#581c87_35%,#ffffff_35%)]"></div>
                  </div>
                </div>

                <div 
                  onClick={() => setTemplateId('classic')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'classic' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-gray-900 mb-1">Classic Centered</div>
                    <p className="text-xs text-gray-500 mb-3">Traditional centered layout with elegant typography and borders.</p>
                    <div className="h-32 w-full rounded border border-gray-200 bg-[#fbf9f6] flex flex-col items-center justify-center p-2">
                       <div className="w-8 h-8 rounded-full border border-red-800/30 bg-red-800/10 mb-2"></div>
                       <div className="w-24 h-2 bg-gray-300 rounded-full mb-2"></div>
                       <div className="w-full h-10 border border-red-800/20 rounded"></div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setTemplateId('minimalist')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'minimalist' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-gray-900 mb-1">Minimalist</div>
                    <p className="text-xs text-gray-500 mb-3">Clean and spacious design focusing purely on content readability.</p>
                    <div className="h-32 w-full rounded border border-gray-200 bg-white p-3">
                       <div className="flex gap-2 mb-3 border-b pb-2">
                         <div className="w-8 h-8 rounded bg-gray-200"></div>
                         <div className="space-y-1">
                           <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
                           <div className="w-10 h-1.5 bg-gray-200 rounded-full"></div>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                         <div className="space-y-1"><div className="w-full h-1.5 bg-gray-100 rounded-full"></div><div className="w-4/5 h-1.5 bg-gray-100 rounded-full"></div></div>
                         <div className="space-y-1"><div className="w-full h-1.5 bg-gray-100 rounded-full"></div><div className="w-4/5 h-1.5 bg-gray-100 rounded-full"></div></div>
                       </div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setTemplateId('hindu')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'hindu' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#800000] mb-1">Hindu Traditional</div>
                    <p className="text-xs text-gray-500 mb-3">Ornate borders and saffron colors with a classic traditional layout.</p>
                    <div className="h-32 w-full rounded border border-[#d4af37] bg-[#fffaf0] p-2 text-center flex flex-col items-center">
                       <div className="text-xl text-[#e63946] leading-none mb-1">ॐ</div>
                       <div className="w-16 h-1 bg-[#800000] mb-2"></div>
                       <div className="w-full h-6 border border-[#d4af37]/50 mb-1"></div>
                       <div className="w-full h-6 border border-[#d4af37]/50"></div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setTemplateId('islamic')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'islamic' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#064e3b] mb-1">Islamic Elegant</div>
                    <p className="text-xs text-gray-500 mb-3">Emerald green styling with arched headers and clean sections.</p>
                    <div className="h-32 w-full rounded border border-[#10b981]/50 bg-[#f0fdf4] p-2 flex flex-col items-center">
                       <div className="w-full h-8 border-2 border-[#10b981]/40 rounded-t-full mb-2 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#10b981]/50"></div>
                       </div>
                       <div className="w-full flex-1 bg-white border border-[#10b981]/20 rounded"></div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setTemplateId('sikh')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'sikh' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#1e3a8a] mb-1">Sikh Heritage</div>
                    <p className="text-xs text-gray-500 mb-3">Navy blue and orange layout inspired by Punjabi traditions.</p>
                    <div className="h-32 w-full rounded border border-gray-200 bg-[#f8fafc] relative overflow-hidden flex flex-col p-2">
                       <div className="absolute top-0 left-0 right-0 h-1 bg-[#1e3a8a]"></div>
                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f97316]"></div>
                       <div className="text-[#f97316] text-lg font-bold text-center mt-1 mb-1">ੴ</div>
                       <div className="w-16 h-0.5 bg-[#1e3a8a] mx-auto mb-2"></div>
                       <div className="flex-1 flex gap-2">
                          <div className="w-1 bg-[#f97316] h-full"></div>
                          <div className="flex-1 bg-gray-100 h-full rounded"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1 pb-20 lg:pb-0">
                <AccordionItem id="personal" title="Personal Info">
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {form.photo ? (
                        <img src={form.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <ImageIcon className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition">
                          Upload Image
                        </button>
                        {form.photo && <button onClick={() => setForm({...form, photo: null})} className="text-sm text-gray-500 ml-3 hover:text-red-500">Remove</button>}
                      </div>
                    </div>
                  </div>
                  <Input label="Full Name" field="fullName" placeholder="E.g., Gaurav Mehta" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Date of Birth" field="dateOfBirth" placeholder="DD-MM-YYYY" />
                    <Input label="Time of Birth" field="birthTime" placeholder="HH:MM AM/PM" />
                  </div>
                  <Input label="Place of Birth" field="birthPlace" placeholder="City, State" />
                </AccordionItem>

                <AccordionItem id="profile" title="Profile Details">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Height" field="height" placeholder="E.g., 5'9&quot;" />
                    <Input label="Religion" field="religion" placeholder="E.g., Hindu" />
                    <Input label="Caste" field="caste" placeholder="E.g., Brahmin" />
                    <Input label="Manglik" field="manglik" placeholder="Yes / No / Don't Know" />
                  </div>
                  <Input label="Languages Known" field="languages" placeholder="E.g., English, Hindi" />
                </AccordionItem>

                <AccordionItem id="education" title="Education & Profession">
                  <Input label="Education" field="education" placeholder="E.g., B.Tech in Computer Science" />
                  <Input label="Profession / Occupation" field="occupation" placeholder="E.g., Software Engineer at Google" />
                  <Input label="Annual Income" field="annualIncome" placeholder="E.g., 18 LPA" />
                </AccordionItem>

                <AccordionItem id="family" title="Family Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Father's Name" field="fatherName" />
                    <Input label="Father's Occupation" field="fatherOccupation" />
                    <Input label="Mother's Name" field="motherName" />
                    <Input label="Mother's Occupation" field="motherOccupation" />
                  </div>
                  <Input label="Siblings (Names & Details)" field="siblings" type="textarea" placeholder="List brothers and sisters..." />
                </AccordionItem>

                <AccordionItem id="about" title="About & Expectations">
                  <Input label="About Me" field="about" type="textarea" placeholder="Write a short paragraph about yourself..." />
                  <Input label="Hobbies & Interests" field="hobbies" type="textarea" />
                  <Input label="Partner Expectations" field="partnerPreferences" type="textarea" placeholder="What are you looking for in a partner?" />
                </AccordionItem>

                <AccordionItem id="contact" title="Contact Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Mobile Number" field="phone" />
                    <Input label="Email Address" field="email" />
                  </div>
                  <Input label="Current / Permanent Address" field="address" type="textarea" />
                </AccordionItem>
              </div>
            )}
          </div>
        </aside>

        {/* Right Preview Canvas / Mobile Preview Tab */}
        <main className={`flex-1 bg-[#f8f9fa] relative overflow-hidden flex-col ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`} style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          {/* Mobile Back to Edit Button */}
          <div className="lg:hidden absolute top-4 left-4 z-20">
             <button onClick={() => setActiveTab('edit')} className="bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50">
               ← Back to Edit
             </button>
          </div>
          <div className="absolute right-4 top-4 z-20 hidden rounded-full border border-gray-200 bg-white/95 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm lg:block">
            A4 preview
          </div>

          <div className="flex-1 overflow-auto p-4 pt-20 sm:p-8 lg:pt-8 custom-scrollbar relative">
            <div className="mx-auto flex min-h-full items-start justify-center">
              <div
                className="relative shrink-0 transition-[width,height] duration-200 ease-out"
                style={{ width: `${794 * zoom}px`, height: `${1123 * zoom}px` }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left transition-transform duration-200 ease-out shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-gray-900/5 bg-white"
                  style={{ transform: `scale(${zoom})`, width: '794px', height: '1123px' }}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Zoom Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur border border-gray-200 shadow-lg rounded-full p-1.5 z-10">
            <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
              <ZoomOut size={18} />
            </button>
            <div className="px-3 text-sm font-semibold text-gray-700 min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button onClick={() => setZoom(typeof window !== 'undefined' && window.innerWidth < 768 ? 0.38 : 0.7)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition" title="Fit to Screen">
              <Maximize size={16} />
            </button>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
      `}} />
    </div>
  );
}
