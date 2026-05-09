'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Download, LayoutTemplate, Edit3, ZoomIn, ZoomOut, Maximize, ChevronDown, ChevronUp, Image as ImageIcon, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { BiodataForm, TemplateId } from './types';
import { 
  ModernSplitTemplate, 
  ClassicCenteredTemplate, 
  MinimalistTemplate, 
  HinduTemplate, 
  IslamicTemplate, 
  SikhTemplate, 
  FloralTemplate, 
  RoyalGoldTemplate, 
  ProfessionalTemplate,
  VintageTemplate,
  LuxuryTemplate,
  CompactTemplate,
  ArtDecoTemplate
} from './templates';

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

const AccordionItem = ({ 
  id, 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  id: string, 
  title: string, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode 
}) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-gray-800 hover:text-purple-600 transition-colors focus:outline-none"
        onClick={onToggle}
      >
        {title}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && <div className="pb-5 space-y-4 animate-in slide-in-from-top-2">{children}</div>}
    </div>
  );
};

const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text' 
}: { 
  label: string, 
  value: string, 
  onChange: (val: string) => void, 
  placeholder?: string, 
  type?: string 
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none transition"
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        type={type}
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none transition"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
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
      const imgData = await htmlToImage.toPng(element, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

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
      const blob = await htmlToImage.toBlob(element, {
        cacheBust: true,
        pixelRatio: 3,
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
      case 'floral': return <FloralTemplate data={form} />;
      case 'royal': return <RoyalGoldTemplate data={form} />;
      case 'professional': return <ProfessionalTemplate data={form} />;
      case 'vintage': return <VintageTemplate data={form} />;
      case 'luxury': return <LuxuryTemplate data={form} />;
      case 'compact': return <CompactTemplate data={form} />;
      case 'artdeco': return <ArtDecoTemplate data={form} />;
    }
  };

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
          <button onClick={exportPng} disabled={isExportingPng} className={`${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'} items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold transition disabled:opacity-50`}>
            {isExportingPng ? 'Exporting...' : 'Export PNG'}
          </button>
          <button onClick={exportPdf} disabled={isExportingPdf} className={`${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'} items-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-purple-200 transition disabled:opacity-50`}>
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

                <div
                  onClick={() => setTemplateId('floral')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'floral' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#8c6d5e] mb-1">Floral Harmony</div>
                    <p className="text-xs text-gray-500 mb-3">Soft pastel colors with delicate floral accents and serif fonts.</p>
                    <div className="h-32 w-full rounded border border-[#e5d5c5] bg-[#fffcf9] flex items-center justify-center p-3">
                      <div className="w-full h-full border border-[#e5d5c5]/50 rounded flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-pink-200 bg-white mb-2"></div>
                        <div className="w-16 h-1 bg-pink-100 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTemplateId('royal')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'royal' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#d4af37] mb-1">Royal Gold</div>
                    <p className="text-xs text-gray-500 mb-3">Premium dark theme with gold accents for a majestic look.</p>
                    <div className="h-32 w-full rounded border border-[#d4af37]/30 bg-[#0f172a] flex flex-col items-center justify-center p-2">
                      <div className="text-[#d4af37] text-lg mb-1">⚜️</div>
                      <div className="w-20 h-0.5 bg-[#d4af37] mb-2"></div>
                      <div className="w-10 h-10 rounded bg-gray-800 border border-[#d4af37]/20"></div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTemplateId('professional')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'professional' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-slate-900 mb-1">Modern Professional</div>
                    <p className="text-xs text-gray-500 mb-3">Clean, executive-style layout suitable for modern expectations.</p>
                    <div className="h-32 w-full rounded border border-slate-200 bg-white p-2">
                      <div className="flex justify-between mb-4">
                        <div className="w-1/2 h-4 bg-slate-900"></div>
                        <div className="w-8 h-10 bg-slate-100"></div>
                      </div>
                      <div className="w-full h-px bg-slate-100 mb-3"></div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-1 bg-slate-200 rounded"></div>
                        <div className="col-span-2 h-1 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTemplateId('vintage')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'vintage' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#8b7355] mb-1">Vintage Parchment</div>
                    <p className="text-xs text-gray-500 mb-3">Retro historical aesthetic with parchment texture and classic serif.</p>
                    <div className="h-32 w-full rounded border border-[#8b7355]/30 bg-[#f4ead5] flex items-center justify-center p-2 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
                      <div className="w-24 h-24 border border-[#8b7355]/40 p-2 flex flex-col items-center">
                         <div className="w-8 h-1 bg-[#8b7355]/20 mb-2"></div>
                         <div className="w-12 h-12 bg-white/50 border border-[#8b7355]/10"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTemplateId('luxury')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'luxury' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#c5a059] mb-1">Minimalist Luxury</div>
                    <p className="text-xs text-gray-500 mb-3">High-end editorial style with extreme whitespace and gold accents.</p>
                    <div className="h-32 w-full rounded border border-gray-100 bg-white flex flex-col items-center justify-center p-4">
                      <div className="w-full h-full border border-[#c5a059]/20 flex flex-col items-center justify-center gap-2">
                         <div className="w-12 h-12 rounded-full border border-[#c5a059]/30"></div>
                         <div className="w-16 h-0.5 bg-[#c5a059]/40"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTemplateId('compact')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'compact' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#ff4d00] mb-1">Modern Compact</div>
                    <p className="text-xs text-gray-500 mb-3">Bold Swiss design with high information density and technical feel.</p>
                    <div className="h-32 w-full rounded border border-black bg-white flex p-2 gap-2">
                      <div className="w-1.5 h-full bg-[#ff4d00]"></div>
                      <div className="flex-1 space-y-2">
                         <div className="w-12 h-4 bg-black"></div>
                         <div className="w-full h-12 border border-black/10 bg-gray-50"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setTemplateId('artdeco')}
                  className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${templateId === 'artdeco' ? 'border-purple-600 shadow-md' : 'border-transparent hover:border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-4">
                    <div className="font-bold text-[#d4af37] mb-1">Art Deco Noir</div>
                    <p className="text-xs text-gray-500 mb-3">1920s Great Gatsby inspired sophisticated geometric design.</p>
                    <div className="h-32 w-full rounded border border-[#d4af37]/20 bg-[#121212] flex flex-col items-center justify-center p-4">
                       <div className="text-[#d4af37] text-2xl mb-1">✦</div>
                       <div className="w-20 h-px bg-[#d4af37]/30 mb-2"></div>
                       <div className="w-12 h-16 border border-[#d4af37]/40 bg-white/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1 pb-20 lg:pb-0">
                <AccordionItem 
                  id="personal" 
                  title="Personal Info"
                  isOpen={openAccordion === 'personal'}
                  onToggle={() => setOpenAccordion(openAccordion === 'personal' ? '' : 'personal')}
                >
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
                        {form.photo && <button onClick={() => setForm({ ...form, photo: null })} className="text-sm text-gray-500 ml-3 hover:text-red-500">Remove</button>}
                      </div>
                    </div>
                  </div>
                  <Input label="Full Name" value={form.fullName} onChange={(v) => updateField('fullName', v)} placeholder="E.g., Gaurav Mehta" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Date of Birth" value={form.dateOfBirth} onChange={(v) => updateField('dateOfBirth', v)} placeholder="DD-MM-YYYY" />
                    <Input label="Time of Birth" value={form.birthTime} onChange={(v) => updateField('birthTime', v)} placeholder="HH:MM AM/PM" />
                  </div>
                  <Input label="Place of Birth" value={form.birthPlace} onChange={(v) => updateField('birthPlace', v)} placeholder="City, State" />
                </AccordionItem>

                <AccordionItem 
                  id="profile" 
                  title="Profile Details"
                  isOpen={openAccordion === 'profile'}
                  onToggle={() => setOpenAccordion(openAccordion === 'profile' ? '' : 'profile')}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Height" value={form.height} onChange={(v) => updateField('height', v)} placeholder="E.g., 5'9&quot;" />
                    <Input label="Religion" value={form.religion} onChange={(v) => updateField('religion', v)} placeholder="E.g., Hindu" />
                    <Input label="Caste" value={form.caste} onChange={(v) => updateField('caste', v)} placeholder="E.g., Brahmin" />
                    <Input label="Manglik" value={form.manglik} onChange={(v) => updateField('manglik', v)} placeholder="Yes / No / Don't Know" />
                  </div>
                  <Input label="Languages Known" value={form.languages} onChange={(v) => updateField('languages', v)} placeholder="E.g., English, Hindi" />
                </AccordionItem>

                <AccordionItem 
                  id="education" 
                  title="Education & Profession"
                  isOpen={openAccordion === 'education'}
                  onToggle={() => setOpenAccordion(openAccordion === 'education' ? '' : 'education')}
                >
                  <Input label="Education" value={form.education} onChange={(v) => updateField('education', v)} placeholder="E.g., B.Tech in Computer Science" />
                  <Input label="Profession / Occupation" value={form.occupation} onChange={(v) => updateField('occupation', v)} placeholder="E.g., Software Engineer at Google" />
                  <Input label="Annual Income" value={form.annualIncome} onChange={(v) => updateField('annualIncome', v)} placeholder="E.g., 18 LPA" />
                </AccordionItem>

                <AccordionItem 
                  id="family" 
                  title="Family Details"
                  isOpen={openAccordion === 'family'}
                  onToggle={() => setOpenAccordion(openAccordion === 'family' ? '' : 'family')}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Father's Name" value={form.fatherName} onChange={(v) => updateField('fatherName', v)} />
                    <Input label="Father's Occupation" value={form.fatherOccupation} onChange={(v) => updateField('fatherOccupation', v)} />
                    <Input label="Mother's Name" value={form.motherName} onChange={(v) => updateField('motherName', v)} />
                    <Input label="Mother's Occupation" value={form.motherOccupation} onChange={(v) => updateField('motherOccupation', v)} />
                  </div>
                  <Input label="Siblings (Names & Details)" value={form.siblings} onChange={(v) => updateField('siblings', v)} type="textarea" placeholder="List brothers and sisters..." />
                </AccordionItem>

                <AccordionItem 
                  id="about" 
                  title="About & Expectations"
                  isOpen={openAccordion === 'about'}
                  onToggle={() => setOpenAccordion(openAccordion === 'about' ? '' : 'about')}
                >
                  <Input label="About Me" value={form.about} onChange={(v) => updateField('about', v)} type="textarea" placeholder="Write a short paragraph about yourself..." />
                  <Input label="Hobbies & Interests" value={form.hobbies} onChange={(v) => updateField('hobbies', v)} type="textarea" />
                  <Input label="Partner Expectations" value={form.partnerPreferences} onChange={(v) => updateField('partnerPreferences', v)} type="textarea" placeholder="What are you looking for in a partner?" />
                </AccordionItem>

                <AccordionItem 
                  id="contact" 
                  title="Contact Info"
                  isOpen={openAccordion === 'contact'}
                  onToggle={() => setOpenAccordion(openAccordion === 'contact' ? '' : 'contact')}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Mobile Number" value={form.phone} onChange={(v) => updateField('phone', v)} />
                    <Input label="Email Address" value={form.email} onChange={(v) => updateField('email', v)} />
                  </div>
                  <Input label="Current / Permanent Address" value={form.address} onChange={(v) => updateField('address', v)} type="textarea" />
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

      <style dangerouslySetInnerHTML={{
        __html: `
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
