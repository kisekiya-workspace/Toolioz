'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, type ChangeEvent, useEffect } from 'react';
import {
  Download,
  LayoutTemplate,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
  Eye,
} from 'lucide-react';
// PDF generation handled by pdf-lib in visual-pdf.ts
import { BiodataForm, TemplateId } from './types';
import { BIODATA_TEMPLATES, DEFAULT_BIODATA_TEMPLATE, normalizeTemplateId } from './biodata-templates';

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

type AccordionItemProps = {
  id: string;
  title: string;
  openAccordion: string;
  setOpenAccordion: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
};

const AccordionItem = ({ id, title, openAccordion, setOpenAccordion, children }: AccordionItemProps) => {
  const isOpen = openAccordion === id;
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
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

type BiodataInputProps = {
  label: string;
  field: Exclude<keyof BiodataForm, 'customFields'>;
  form: BiodataForm;
  onUpdate: (field: Exclude<keyof BiodataForm, 'customFields'>, value: string) => void;
  placeholder?: string;
  type?: string;
};

const stopFieldEvent = (event: React.SyntheticEvent<HTMLElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

const stopFieldBubble = (event: React.SyntheticEvent<HTMLElement>) => {
  event.stopPropagation();
};

const Input = ({ label, field, form, onUpdate, placeholder, type = 'text' }: BiodataInputProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none transition"
        rows={3}
        value={form[field] || ''}
        placeholder={placeholder}
        onChange={(e) => {
          stopFieldEvent(e);
          onUpdate(field, e.target.value);
        }}
        onInput={stopFieldBubble}
        onKeyDown={stopFieldBubble}
        onClick={stopFieldEvent}
        onMouseDown={stopFieldBubble}
      />
    ) : (
      <input
        type={type}
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:bg-white focus:ring-1 focus:ring-purple-500 outline-none transition"
        value={form[field] || ''}
        placeholder={placeholder}
        onChange={(e) => {
          stopFieldEvent(e);
          onUpdate(field, e.target.value);
        }}
        onInput={stopFieldBubble}
        onKeyDown={stopFieldBubble}
        onClick={stopFieldEvent}
        onMouseDown={stopFieldBubble}
      />
    )}
  </div>
);


export default function BiodataGeneratorClient() {
  const [activeTab, setActiveTab] = useState<'templates' | 'edit' | 'preview'>('edit');
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_BIODATA_TEMPLATE);
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

  const retainEditorFocus = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, option')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    const saved = localStorage.getItem('biodata_form');
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        localStorage.removeItem('biodata_form');
      }
    }
    setTemplateId(normalizeTemplateId(localStorage.getItem('biodata_template')));

    setIsLoaded(true);
  }, []);

  const fitPreviewZoom = () => {
    if (typeof window === 'undefined') return;
    const padding = 32;
    const available = window.innerWidth - padding;
    setZoom(Math.min(1, Math.max(0.28, available / 794)));
  };

  useEffect(() => {
    if (activeTab === 'preview') fitPreviewZoom();
  }, [activeTab]);

  useEffect(() => {
    const onResize = () => {
      if (activeTab === 'preview') fitPreviewZoom();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeTab]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('biodata_form', JSON.stringify(form));
      localStorage.setItem('biodata_template', templateId);
    }
  }, [form, templateId, isLoaded]);

  const updateField = (field: Exclude<keyof BiodataForm, 'customFields'>, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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
    try {
      setIsExportingPdf(true);
      const element = await getExportElement();
      if (!element) throw new Error('Preview element not found.');

      // Render high-resolution (3x) PNG of the exact DOM preview
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(element, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      // Embed high-res image into a standard A4 PDF document
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      doc.setTitle(`${form.fullName.trim() || 'Biodata'} - Marriage Biodata`);
      doc.setAuthor(form.fullName.trim() || 'Toolioz');
      doc.setSubject('Marriage Biodata');
      doc.setProducer('Toolioz Biodata Generator');

      const page = doc.addPage([595.28, 841.89]);
      const base64Data = dataUrl.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      const embeddedImage = await doc.embedPng(imageBytes);

      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89,
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `${form.fullName.replace(/\s+/g, '_') || 'Biodata'}.pdf`);
    } catch (e) {
      console.warn('High-res DOM PDF export encountered issue, using vector fallback...', e);
      try {
        const { generateBiodataPdf } = await import('./visual-pdf');
        const pdfBytes = await generateBiodataPdf(form, templateId);
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        downloadBlob(blob, `${form.fullName.replace(/\s+/g, '_') || 'Biodata'}.pdf`);
      } catch (fallbackErr) {
        console.error('Failed to export PDF', fallbackErr);
        window.alert('PDF export failed. Please try again.');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  const exportPng = async () => {
    const element = await getExportElement();
    if (!element) return;
    try {
      setIsExportingPng(true);
      const htmlToImage = await import('html-to-image');
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
    const tpl = BIODATA_TEMPLATES.find((t) => t.id === templateId) ?? BIODATA_TEMPLATES[0];
    const Component = tpl.component;
    return <Component data={form} />;
  };

  const currentTemplate = BIODATA_TEMPLATES.find((t) => t.id === templateId) ?? BIODATA_TEMPLATES[0];

  if (!isLoaded) return null;

  const isPreviewTab = activeTab === 'preview';

  return (
    <div
      className="flex h-[100dvh] flex-col overflow-hidden bg-gray-50 font-sans text-gray-900"
      onMouseDownCapture={retainEditorFocus}
    >
      {/* Header */}
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
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
          <button
            type="button"
            onClick={exportPng}
            disabled={isExportingPng}
            className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-200 disabled:opacity-50 lg:flex"
          >
            {isExportingPng ? 'Exporting…' : 'Export PNG'}
          </button>
          <button
            type="button"
            onClick={exportPdf}
            disabled={isExportingPdf}
            className="hidden items-center gap-2 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-purple-200 transition hover:bg-purple-700 disabled:opacity-50 lg:flex"
          >
            <Download size={16} />
            {isExportingPdf ? 'Wait…' : 'Export PDF'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Sidebar / Mobile Full Area */}
        <aside className={`z-10 flex w-full shrink-0 flex-col border-r border-gray-200 bg-white lg:w-[min(400px,100%)] ${isPreviewTab ? 'hidden lg:flex' : 'flex'} pb-16 lg:pb-0`}>
          {/* Tabs */}
          <div className="flex p-2 gap-1 bg-gray-100/50 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'templates' ? 'bg-white text-purple-700' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <LayoutTemplate size={14} className="sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Templates</span><span className="xs:hidden">Tmplts</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'edit' ? 'bg-white text-purple-700' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Edit3 size={14} className="sm:w-4 sm:h-4" /> Edit
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {/* Quick Template Selector Dropdown */}
            <div className="mb-5 rounded-2xl border border-purple-200 bg-purple-50/60 p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1.5">
                Template Layout
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value as TemplateId)}
                className="w-full rounded-xl border border-purple-300 bg-white px-3 py-2 text-sm font-bold text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
              >
                {BIODATA_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-5 text-purple-800">
                100% pixel-perfect match: preview and exported PDF render identically.
              </p>
            </div>

            {activeTab === 'templates' ? (
              <div className="space-y-3 pb-20 lg:pb-0">
                {BIODATA_TEMPLATES.map((tpl) => {
                  const isSelected = templateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setTemplateId(tpl.id)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/40 ring-1 ring-purple-600'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{tpl.name}</span>
                        {isSelected && (
                          <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{tpl.description}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1 pb-20 lg:pb-0">
                <AccordionItem openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} id="personal" title="Personal Info">
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
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} onClick={(e) => e.stopPropagation()} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition">
                          Upload Image
                        </button>
                        {form.photo && <button type="button" onClick={() => setForm({ ...form, photo: null })} className="text-sm text-gray-500 ml-3 hover:text-red-500">Remove</button>}
                      </div>
                    </div>
                  </div>
                  <Input form={form} onUpdate={updateField} label="Full Name" field="fullName" placeholder="E.g., Gaurav Mehta" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input form={form} onUpdate={updateField} label="Date of Birth" field="dateOfBirth" placeholder="DD-MM-YYYY" />
                    <Input form={form} onUpdate={updateField} label="Time of Birth" field="birthTime" placeholder="HH:MM AM/PM" />
                  </div>
                  <Input form={form} onUpdate={updateField} label="Place of Birth" field="birthPlace" placeholder="City, State" />
                </AccordionItem>

                <AccordionItem openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} id="profile" title="Profile Details">
                  <div className="grid grid-cols-2 gap-3">
                    <Input form={form} onUpdate={updateField} label="Height" field="height" placeholder="E.g., 5'9&quot;" />
                    <Input form={form} onUpdate={updateField} label="Religion" field="religion" placeholder="E.g., Hindu" />
                    <Input form={form} onUpdate={updateField} label="Caste" field="caste" placeholder="E.g., Brahmin" />
                    <Input form={form} onUpdate={updateField} label="Manglik" field="manglik" placeholder="Yes / No / Don't Know" />
                  </div>
                  <Input form={form} onUpdate={updateField} label="Languages Known" field="languages" placeholder="E.g., English, Hindi" />
                </AccordionItem>

                <AccordionItem openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} id="education" title="Education & Profession">
                  <Input form={form} onUpdate={updateField} label="Education" field="education" placeholder="E.g., B.Tech in Computer Science" />
                  <Input form={form} onUpdate={updateField} label="Profession / Occupation" field="occupation" placeholder="E.g., Software Engineer at Google" />
                  <Input form={form} onUpdate={updateField} label="Annual Income" field="annualIncome" placeholder="E.g., 18 LPA" />
                </AccordionItem>

                <AccordionItem openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} id="family" title="Family Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input form={form} onUpdate={updateField} label="Father's Name" field="fatherName" />
                    <Input form={form} onUpdate={updateField} label="Father's Occupation" field="fatherOccupation" />
                    <Input form={form} onUpdate={updateField} label="Mother's Name" field="motherName" />
                    <Input form={form} onUpdate={updateField} label="Mother's Occupation" field="motherOccupation" />
                  </div>
                  <Input form={form} onUpdate={updateField} label="Siblings (Names & Details)" field="siblings" type="textarea" placeholder="List brothers and sisters..." />
                </AccordionItem>

                <AccordionItem openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} id="about" title="About & Expectations">
                  <Input form={form} onUpdate={updateField} label="About Me" field="about" type="textarea" placeholder="Write a short paragraph about yourself..." />
                  <Input form={form} onUpdate={updateField} label="Hobbies & Interests" field="hobbies" type="textarea" />
                  <Input form={form} onUpdate={updateField} label="Partner Expectations" field="partnerPreferences" type="textarea" placeholder="What are you looking for in a partner?" />
                </AccordionItem>

                <AccordionItem openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} id="contact" title="Contact Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input form={form} onUpdate={updateField} label="Mobile Number" field="phone" />
                    <Input form={form} onUpdate={updateField} label="Email Address" field="email" />
                  </div>
                  <Input form={form} onUpdate={updateField} label="Current / Permanent Address" field="address" type="textarea" />
                </AccordionItem>
              </div>
            )}
          </div>
        </aside>

        {/* Right Preview Canvas / Mobile Preview Tab */}
        <main
          className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f8f9fa] ${isPreviewTab ? 'flex' : 'hidden lg:flex'}`}
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
          <div className="hidden border-b border-gray-200 bg-white/95 px-4 py-2 text-sm font-semibold text-gray-600 lg:block">
            A4 preview — matches PDF export
          </div>

          <div className="relative min-h-0 flex-1 overflow-auto p-3 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="mx-auto flex min-h-full items-start justify-center">
              <div
                className="relative shrink-0 transition-[width,height] duration-200 ease-out"
                style={{ width: `${794 * zoom}px`, height: `${1123 * zoom}px` }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left transition-transform duration-200 ease-out ring-1 ring-gray-900/5 bg-white"
                  style={{ transform: `scale(${zoom})`, width: '794px', height: '1123px' }}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-gray-200 bg-white px-3 py-2 lg:hidden">
            <div className="flex items-center justify-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1">
              <button type="button" onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))} className="rounded-full p-2 text-gray-500" aria-label="Zoom out"><ZoomOut size={18} /></button>
              <span className="min-w-[3rem] text-center text-sm font-semibold text-gray-700">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))} className="rounded-full p-2 text-gray-500" aria-label="Zoom in"><ZoomIn size={18} /></button>
              <div className="mx-1 h-4 w-px bg-gray-300" />
              <button type="button" onClick={fitPreviewZoom} className="rounded-full p-2 text-gray-500" title="Fit"><Maximize size={16} /></button>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={exportPng} disabled={isExportingPng} className="flex h-11 flex-1 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold disabled:opacity-50">{isExportingPng ? '…' : 'PNG'}</button>
              <button type="button" onClick={exportPdf} disabled={isExportingPdf} className="flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-purple-600 text-sm font-bold text-white disabled:opacity-50"><Download size={18} />{isExportingPdf ? 'Exporting…' : 'Download PDF'}</button>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white/90 p-1.5 backdrop-blur lg:flex">
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
            <button type="button" onClick={fitPreviewZoom} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" title="Fit"><Maximize size={16} /></button>
          </div>
        </main>
      </div>

      <nav className="flex shrink-0 border-t border-gray-200 bg-white lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Biodata editor">
        <button type="button" onClick={() => setActiveTab('templates')} className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${activeTab === 'templates' ? 'text-purple-700' : 'text-gray-500'}`}><LayoutTemplate size={18} />Templates</button>
        <button type="button" onClick={() => setActiveTab('edit')} className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${activeTab === 'edit' ? 'text-purple-700' : 'text-gray-500'}`}><Edit3 size={18} />Edit</button>
        <button type="button" onClick={() => { setActiveTab('preview'); fitPreviewZoom(); }} className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${isPreviewTab ? 'text-purple-700' : 'text-gray-500'}`}><Eye size={18} />Preview</button>
      </nav>

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
