'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileImage,
  HeartHandshake,
  Image as ImageIcon,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import type { BiodataForm, TemplateId } from './types';
import { BIODATA_TEMPLATES, DEFAULT_BIODATA_TEMPLATE, normalizeTemplateId } from './biodata-templates';

const EMPTY_FORM: BiodataForm = {
  photo: null,
  fullName: '',
  dateOfBirth: '',
  birthTime: '',
  birthPlace: '',
  height: '',
  religion: '',
  caste: '',
  manglik: '',
  education: '',
  occupation: '',
  annualIncome: '',
  about: '',
  hobbies: '',
  languages: '',
  partnerPreferences: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  phone: '',
  email: '',
  address: '',
  gender: '',
  maritalStatus: '',
  motherTongue: '',
  gotra: '',
  rashi: '',
  nakshatra: '',
  diet: '',
  bloodGroup: '',
  weight: '',
  college: '',
  company: '',
  workLocation: '',
  nativePlace: '',
  familyType: '',
  familyStatus: '',
  kuldevi: '',
  mosal: '',
  mamaName: '',
  sampraday: '',
  customFields: [],
};

const SAMPLE_FORM: BiodataForm = {
  ...EMPTY_FORM,
  fullName: 'Aarav Mehta',
  dateOfBirth: '15 August 1997',
  birthTime: '6:30 PM',
  birthPlace: 'Rajkot, Gujarat',
  height: '5 ft 9 in',
  religion: 'Hindu',
  caste: 'Brahmin',
  gotra: 'Bharadwaj',
  manglik: 'Non-Manglik',
  motherTongue: 'Gujarati',
  diet: 'Vegetarian',
  education: 'M.Tech, Computer Science',
  college: 'Delhi Technological University',
  occupation: 'Senior Product Designer',
  company: 'Technology company',
  workLocation: 'Bengaluru, Karnataka',
  annualIncome: '₹24 LPA',
  about: 'Thoughtful, curious and family-oriented. I value honest communication, meaningful work and a balanced life.',
  hobbies: 'Photography, long walks, cooking and Indian classical music',
  languages: 'Gujarati, Hindi, English',
  partnerPreferences: 'Seeking a kind, independent partner who values mutual respect, family and personal growth.',
  fatherName: 'Rajesh Mehta',
  fatherOccupation: 'Retired bank manager',
  motherName: 'Suman Mehta',
  motherOccupation: 'Teacher',
  siblings: 'One younger sister, software engineer',
  nativePlace: 'Rajkot, Gujarat',
  kuldevi: 'Khodiyar Maa',
  mosal: 'Junagadh',
  mamaName: 'Harshadbhai Patel',
  sampraday: 'Vaishnav',
  familyType: 'Joint family',
  familyStatus: 'Upper-middle-class',
  phone: '+91 98765 43210',
  email: 'aarav@example.com',
  address: 'Ahmedabad, Gujarat, India',
};

const STEPS = [
  { id: 'profile', label: 'You', icon: UserRound },
  { id: 'background', label: 'Life', icon: HeartHandshake },
  { id: 'family', label: 'Family', icon: UsersRound },
] as const;

const ESSENTIALS: Array<{ field: keyof BiodataForm; label: string; step: number }> = [
  { field: 'fullName', label: 'Name', step: 0 },
  { field: 'dateOfBirth', label: 'Date of birth', step: 0 },
  { field: 'height', label: 'Height', step: 0 },
  { field: 'phone', label: 'Phone', step: 0 },
  { field: 'education', label: 'Education', step: 1 },
  { field: 'occupation', label: 'Work', step: 1 },
  { field: 'fatherName', label: 'Father', step: 2 },
  { field: 'motherName', label: 'Mother', step: 2 },
];

const HEIGHT_PRESETS = ['5 ft 2 in', '5 ft 4 in', '5 ft 6 in', '5 ft 8 in', '5 ft 10 in', '6 ft'];

type StudioFieldProps = {
  label: string;
  field: keyof BiodataForm;
  form: BiodataForm;
  update: (field: keyof BiodataForm, value: string) => void;
  placeholder?: string;
  help?: string;
  multiline?: boolean;
  options?: string[];
  required?: boolean;
};

function filled(form: BiodataForm, field: keyof BiodataForm) {
  return String(form[field] ?? '').trim().length > 0;
}

const fieldControl =
  'w-full rounded-md border-0 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10';

function StudioField({ label, field, form, update, placeholder, help, multiline, options, required }: StudioFieldProps) {
  const value = typeof form[field] === 'string' ? String(form[field] ?? '') : '';
  return (
    <label className="block" htmlFor={String(field)}>
      <span className="mb-1.5 block text-sm text-zinc-500">
        {label}
        {required ? <span className="text-zinc-400"> · required</span> : null}
      </span>
      {options ? (
        <select id={String(field)} name={String(field)} className={fieldControl} value={value} onChange={(event) => update(field, event.target.value)}>
          <option value="">Not specified</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          id={String(field)}
          name={String(field)}
          className={`${fieldControl} min-h-24 resize-y leading-6`}
          value={value}
          placeholder={placeholder}
          onChange={(event) => update(field, event.target.value)}
        />
      ) : (
        <input
          id={String(field)}
          name={String(field)}
          className={fieldControl}
          value={value}
          placeholder={placeholder}
          onChange={(event) => update(field, event.target.value)}
        />
      )}
      {help ? <span className="mt-1.5 block text-xs leading-5 text-zinc-400">{help}</span> : null}
    </label>
  );
}

function FieldGroup({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
        {hint ? <p className="mt-1 text-xs text-zinc-400">{hint}</p> : null}
      </div>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function BiodataStudioClient() {
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_BIODATA_TEMPLATE);
  const [form, setForm] = useState<BiodataForm>(EMPTY_FORM);
  const [zoom, setZoom] = useState(0.62);
  const [autoFit, setAutoFit] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [showHoroscope, setShowHoroscope] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('biodata_form');
    if (saved) {
      try {
        const parsed = { ...EMPTY_FORM, ...JSON.parse(saved) } as BiodataForm;
        setForm(parsed);
        const hasKundli = Boolean(parsed.birthTime || parsed.gotra || parsed.rashi || parsed.nakshatra || parsed.manglik);
        setShowHoroscope(hasKundli);
      } catch {
        localStorage.removeItem('biodata_form');
      }
    }
    setTemplateId(normalizeTemplateId(localStorage.getItem('biodata_template')));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('biodata_form', JSON.stringify(form));
    localStorage.setItem('biodata_template', templateId);
  }, [form, loaded, templateId]);

  useEffect(() => {
    const node = previewRef.current;
    if (!node || !autoFit) return;
    const fit = () => setZoom(Math.min(0.88, Math.max(0.28, (node.clientWidth - 56) / 794)));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoFit, previewOpen, step]);

  const update = (field: keyof BiodataForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const completed = ESSENTIALS.filter((item) => filled(form, item.field)).length;
  const progress = Math.round((completed / ESSENTIALS.length) * 100);
  const currentTemplate = BIODATA_TEMPLATES.find((template) => template.id === templateId) ?? BIODATA_TEMPLATES[0];

  const applyPhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please choose a JPG, PNG, or WebP photo.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Please choose an image smaller than 8 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) applyPhotoFile(file);
    event.target.value = '';
  };

  const waitForPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  const getDocument = async () => {
    if (window.innerWidth < 1024 && !previewOpen) {
      setPreviewOpen(true);
      await waitForPaint();
    }
    return document.getElementById('biodata-document');
  };

  const saveBlob = (blob: Blob, extension: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const name = `${form.fullName.trim().replace(/\s+/g, '_') || 'Marriage_Biodata'}.${extension}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1500);
    showToast(`Saved ${name}`);
  };

  const exportPng = async () => {
    setExporting('png');
    try {
      const element = await getDocument();
      if (!element) throw new Error('Preview unavailable');
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(element, { cacheBust: true, pixelRatio: 3, backgroundColor: '#ffffff' });
      if (!blob) throw new Error('Image render failed');
      saveBlob(blob, 'png');
    } catch (error) {
      console.error(error);
      showToast('PNG export failed. Open Preview and try again.');
    } finally {
      setExporting(null);
    }
  };

  const exportPdf = async () => {
    setExporting('pdf');
    try {
      const element = await getDocument();
      if (!element) throw new Error('Preview unavailable');
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 3, backgroundColor: '#ffffff' });
      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      pdf.setTitle(`${form.fullName.trim() || 'Marriage Biodata'} — Marriage Biodata`);
      pdf.setProducer('Biodata Maker');
      const page = pdf.addPage([595.28, 841.89]);
      const bytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (character) => character.charCodeAt(0));
      const image = await pdf.embedPng(bytes);
      page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 });
      saveBlob(new Blob([await pdf.save() as BlobPart], { type: 'application/pdf' }), 'pdf');
    } catch (error) {
      console.error(error);
      showToast('PDF export failed. Open Preview and try again.');
    } finally {
      setExporting(null);
    }
  };

  const exportPdfRef = useRef(exportPdf);
  exportPdfRef.current = exportPdf;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'Enter') return;
      if (event.target instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      void exportPdfRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const addCustomField = () =>
    setForm((current) => ({
      ...current,
      customFields: [...(current.customFields ?? []), { id: crypto.randomUUID(), label: '', value: '' }],
    }));
  const updateCustomField = (id: string, key: 'label' | 'value', value: string) =>
    setForm((current) => ({
      ...current,
      customFields: (current.customFields ?? []).map((field) => (field.id === id ? { ...field, [key]: value } : field)),
    }));
  const removeCustomField = (id: string) =>
    setForm((current) => ({
      ...current,
      customFields: (current.customFields ?? []).filter((field) => field.id !== id),
    }));

  const goStep = (index: number) => {
    setPreviewOpen(false);
    setStep(index);
  };

  const Template = currentTemplate.component;
  const isPreview = previewOpen;

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-900">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-900">
            Toolioz
          </Link>
          <span className="h-3.5 w-px bg-zinc-200" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium">Biodata</p>
            <p className="hidden truncate text-xs text-zinc-400 sm:block">{form.fullName.trim() || 'Untitled profile'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1.5 text-xs text-zinc-400 md:inline-flex">
            <ShieldCheck size={13} />
            Private
          </span>
          <button type="button" onClick={() => setForm(SAMPLE_FORM)} className="rounded-md px-2.5 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
            Sample
          </button>
          <button type="button" onClick={() => setConfirmClear(true)} className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900" aria-label="Clear form">
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen((open) => !open)}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 lg:hidden"
          >
            {isPreview ? <Pencil size={14} /> : <Eye size={14} />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={exportPng}
            disabled={exporting !== null}
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 sm:inline-flex"
          >
            <FileImage size={14} />
            {exporting === 'png' ? '…' : 'PNG'}
          </button>
          <button
            type="button"
            onClick={exportPdf}
            disabled={exporting !== null}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            <Download size={14} />
            {exporting === 'pdf' ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(340px,28rem)_minmax(0,1fr)]">
        <aside className={`${isPreview ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-r border-zinc-200 bg-white`}>
          <div className="border-b border-zinc-100 px-5 py-4">
            <label className="block">
              <span className="mb-1.5 block text-sm text-zinc-500">Design</span>
              <select
                value={templateId}
                onChange={(event) => setTemplateId(event.target.value as TemplateId)}
                className={fieldControl}
              >
                {BIODATA_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
              <span>{progress}% ready</span>
              <span>
                {completed}/{ESSENTIALS.length}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-zinc-900 transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
            <nav className="mt-4 hidden grid-cols-3 gap-1 lg:grid" aria-label="Editor sections">
              {STEPS.map((item, index) => {
                const Icon = item.icon;
                const active = !isPreview && step === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goStep(index)}
                    className={`rounded-md px-1 py-2 text-center text-xs ${active ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700'}`}
                  >
                    <Icon className="mx-auto" size={15} />
                    <span className="mt-1 block">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-medium tracking-tight">You</h2>
                  <p className="mt-1 text-sm text-zinc-400">Empty fields stay off the page.</p>
                </div>
                <div className="relative w-24">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhoto} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="block overflow-hidden rounded-lg bg-zinc-100"
                    aria-label={form.photo ? 'Change photo' : 'Add photo'}
                  >
                    {form.photo ? (
                      <img src={form.photo} alt="" className="h-28 w-24 object-cover" />
                    ) : (
                      <span className="grid h-28 w-24 place-items-center text-stone-400">
                        <ImageIcon size={22} />
                      </span>
                    )}
                  </button>
                  {form.photo ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setForm((current) => ({ ...current, photo: null }));
                      }}
                      className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-zinc-900 text-white"
                      aria-label="Remove photo"
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  ) : null}
                </div>
                <FieldGroup title="Identity">
                  <StudioField label="Full name" field="fullName" form={form} update={update} placeholder="Name as it should appear" required />
                  <StudioField label="Gender" field="gender" form={form} update={update} options={['Woman', 'Man', 'Non-binary', 'Prefer not to say']} />
                  <StudioField label="Date of birth" field="dateOfBirth" form={form} update={update} placeholder="15 August 1997" required />
                  <StudioField label="Marital status" field="maritalStatus" form={form} update={update} options={['Never married', 'Divorced', 'Widowed', 'Annulled']} />
                  <div>
                    <StudioField label="Height" field="height" form={form} update={update} placeholder="5 ft 9 in" required />
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {HEIGHT_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => update('height', preset)}
                          className={`text-xs ${form.height === preset ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'}`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <StudioField label="Mother tongue" field="motherTongue" form={form} update={update} placeholder="Hindi" />
                </FieldGroup>
                <FieldGroup title="Contact">
                  <StudioField label="Phone" field="phone" form={form} update={update} placeholder="+91" required />
                  <StudioField label="Email" field="email" form={form} update={update} placeholder="name@example.com" />
                  <div className="sm:col-span-2">
                    <StudioField label="Current address" field="address" form={form} update={update} placeholder="City, State, Country" multiline />
                  </div>
                </FieldGroup>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-medium tracking-tight">Life & work</h2>
                  <p className="mt-1 text-sm text-zinc-400">Horoscope stays hidden until you open it.</p>
                </div>
                <FieldGroup title="Education & work">
                  <StudioField label="Highest education" field="education" form={form} update={update} placeholder="M.Tech, Computer Science" required />
                  <StudioField label="College / university" field="college" form={form} update={update} />
                  <StudioField label="Occupation" field="occupation" form={form} update={update} required />
                  <StudioField label="Company" field="company" form={form} update={update} />
                  <StudioField label="Annual income" field="annualIncome" form={form} update={update} placeholder="₹24 LPA" />
                  <StudioField label="Work location" field="workLocation" form={form} update={update} />
                </FieldGroup>
                <FieldGroup title="Personal & lifestyle">
                  <StudioField label="Religion" field="religion" form={form} update={update} />
                  <StudioField label="Caste / community" field="caste" form={form} update={update} />
                  <StudioField label="Diet" field="diet" form={form} update={update} options={['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan', 'Jain']} />
                  <StudioField label="Languages" field="languages" form={form} update={update} />
                  <StudioField label="Weight" field="weight" form={form} update={update} placeholder="Optional" />
                  <StudioField label="Blood group" field="bloodGroup" form={form} update={update} placeholder="Optional" />
                </FieldGroup>
                <div>
                  <button type="button" onClick={() => setShowHoroscope((value) => !value)} className="flex w-full items-center justify-between text-left">
                    <span>
                      <span className="block text-sm font-medium text-zinc-900">Horoscope</span>
                      <span className="text-xs text-zinc-400">Optional — skip if it should not print.</span>
                    </span>
                    <span className="text-xs text-zinc-500">{showHoroscope ? 'Hide' : 'Add'}</span>
                  </button>
                  {showHoroscope ? (
                    <div className="mt-4 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                      <StudioField label="Birth time" field="birthTime" form={form} update={update} />
                      <StudioField label="Birth place" field="birthPlace" form={form} update={update} />
                      <StudioField label="Gotra" field="gotra" form={form} update={update} />
                      <StudioField label="Manglik" field="manglik" form={form} update={update} options={['Manglik', 'Non-Manglik', 'Anshik Manglik', 'Not known']} />
                      <StudioField label="Rashi" field="rashi" form={form} update={update} />
                      <StudioField label="Nakshatra" field="nakshatra" form={form} update={update} />
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-medium tracking-tight">Family & story</h2>
                  <p className="mt-1 text-sm text-zinc-400">A short, specific introduction reads better than a generic paragraph.</p>
                </div>
                <FieldGroup title="Family">
                  <StudioField label="Father's name" field="fatherName" form={form} update={update} required />
                  <StudioField label="Father's occupation" field="fatherOccupation" form={form} update={update} />
                  <StudioField label="Mother's name" field="motherName" form={form} update={update} required />
                  <StudioField label="Mother's occupation" field="motherOccupation" form={form} update={update} />
                  <StudioField label="Native place / gam" field="nativePlace" form={form} update={update} placeholder="Rajkot, Gujarat" />
                  <StudioField label="Kuldevi" field="kuldevi" form={form} update={update} placeholder="Khodiyar Maa" />
                  <StudioField label="Mosal" field="mosal" form={form} update={update} placeholder="Maternal hometown" />
                  <StudioField label="Mama's name" field="mamaName" form={form} update={update} />
                  <StudioField label="Sampraday" field="sampraday" form={form} update={update} options={['Vaishnav', 'Swaminarayan', 'Jain', 'Shaiv', 'Other']} />
                  <StudioField label="Family type" field="familyType" form={form} update={update} options={['Nuclear family', 'Joint family']} />
                  <StudioField label="Family status" field="familyStatus" form={form} update={update} />
                  <div className="sm:col-span-2">
                    <StudioField label="Siblings" field="siblings" form={form} update={update} multiline placeholder="One younger sister, architect" />
                  </div>
                </FieldGroup>
                <FieldGroup title="In your own words" hint="Two or three specific sentences work better than generic claims.">
                  <div className="sm:col-span-2">
                    <StudioField label="About me" field="about" form={form} update={update} multiline />
                  </div>
                  <div className="sm:col-span-2">
                    <StudioField label="Hobbies & interests" field="hobbies" form={form} update={update} multiline />
                  </div>
                  <div className="sm:col-span-2">
                    <StudioField label="Partner preferences" field="partnerPreferences" form={form} update={update} multiline />
                  </div>
                </FieldGroup>
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-900">Additional details</h3>
                    <button type="button" onClick={addCustomField} className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900">
                      <Plus size={14} />
                      Add field
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(form.customFields ?? []).map((field) => (
                      <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                        <input className={fieldControl} value={field.label} placeholder="Label" onChange={(event) => updateCustomField(field.id, 'label', event.target.value)} />
                        <input className={fieldControl} value={field.value} placeholder="Value" onChange={(event) => updateCustomField(field.id, 'value', event.target.value)} />
                        <button type="button" onClick={() => removeCustomField(field.id)} className="rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900" aria-label="Remove field">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 bg-white px-5 py-3">
            <button type="button" disabled={step === 0} onClick={() => goStep(Math.max(0, step - 1))} className="inline-flex items-center gap-1 px-2 py-2 text-sm text-zinc-500 disabled:opacity-30">
              <ChevronLeft size={17} />
              Back
            </button>
            {step < 2 ? (
              <button type="button" onClick={() => goStep(Math.min(2, step + 1))} className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
                Continue
                <ChevronRight size={17} />
              </button>
            ) : (
              <button type="button" onClick={exportPdf} disabled={exporting !== null} className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                <Download size={16} />
                {exporting === 'pdf' ? 'Preparing…' : 'Download PDF'}
              </button>
            )}
          </div>
        </aside>

        <main className={`${isPreview ? 'flex' : 'hidden lg:flex'} min-h-0 min-w-0 w-full flex-col bg-zinc-200`}>
          <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-zinc-300/70 px-4 text-zinc-600">
            <div className="min-w-0">
              <p className="truncate text-xs">{currentTemplate.name}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => { setAutoFit(false); setZoom((value) => Math.max(0.25, value - 0.05)); }} className="grid h-7 w-7 place-items-center rounded-md text-sm text-zinc-500 hover:bg-white">
                −
              </button>
              <span className="w-10 text-center text-xs text-zinc-500">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => { setAutoFit(false); setZoom((value) => Math.min(1.1, value + 0.05)); }} className="grid h-7 w-7 place-items-center rounded-md text-sm text-zinc-500 hover:bg-white">
                +
              </button>
              <button type="button" onClick={() => setAutoFit(true)} className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-white">
                Fit
              </button>
            </div>
          </div>
          <div ref={previewRef} className="relative min-h-0 flex-1 overflow-auto p-6 sm:p-10">
            <div className="relative mx-auto" style={{ width: `${794 * zoom}px`, height: `${1123 * zoom}px` }}>
              <div className="origin-top-left bg-white shadow-[0_16px_48px_-24px_rgba(0,0,0,0.35)]" style={{ width: 794, height: 1123, transform: `scale(${zoom})` }}>
                <Template data={form} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <nav className="grid shrink-0 grid-cols-3 border-t border-zinc-200 bg-white lg:hidden" aria-label="Biodata sections">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" onClick={() => goStep(index)} className={`flex flex-col items-center gap-0.5 py-2 text-xs ${!isPreview && step === index ? 'text-zinc-900' : 'text-zinc-400'}`}>
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {toast ? (
        <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#2a1618] px-4 py-2 text-xs font-semibold text-white shadow-lg lg:bottom-6">
          {toast}
        </div>
      ) : null}

      {confirmClear ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#2a1618]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="clear-title">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <h2 id="clear-title" className="text-lg font-medium">
              Clear this biodata?
            </h2>
            <p className="mt-2 text-sm text-zinc-500">Every field and the photo will be removed from this device.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmClear(false)} className="rounded-md px-4 py-2 text-sm text-zinc-500">
                Keep editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setConfirmClear(false);
                  showToast('Form cleared');
                }}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
