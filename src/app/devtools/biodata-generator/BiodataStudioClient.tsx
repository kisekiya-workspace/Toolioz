'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileImage,
  HeartHandshake,
  Image as ImageIcon,
  LayoutTemplate,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
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
  customFields: [],
};

const SAMPLE_FORM: BiodataForm = {
  ...EMPTY_FORM,
  fullName: 'Aarav Mehta',
  dateOfBirth: '15 August 1997',
  birthTime: '6:30 PM',
  birthPlace: 'Jaipur, Rajasthan',
  height: '5 ft 9 in',
  religion: 'Hindu',
  caste: 'Brahmin',
  gotra: 'Bharadwaj',
  manglik: 'Non-Manglik',
  motherTongue: 'Hindi',
  diet: 'Vegetarian',
  education: 'M.Tech, Computer Science',
  college: 'Delhi Technological University',
  occupation: 'Senior Product Designer',
  company: 'Technology company',
  workLocation: 'Bengaluru, Karnataka',
  annualIncome: '₹24 LPA',
  about: 'Thoughtful, curious and family-oriented. I value honest communication, meaningful work and a balanced life.',
  hobbies: 'Photography, long walks, cooking and Indian classical music',
  languages: 'English, Hindi',
  partnerPreferences: 'Seeking a kind, independent partner who values mutual respect, family and personal growth.',
  fatherName: 'Rajesh Mehta',
  fatherOccupation: 'Retired bank manager',
  motherName: 'Suman Mehta',
  motherOccupation: 'Teacher',
  siblings: 'One younger sister, software engineer',
  nativePlace: 'Jaipur, Rajasthan',
  familyType: 'Nuclear family',
  familyStatus: 'Upper-middle-class',
  phone: '+91 98765 43210',
  email: 'aarav@example.com',
  address: 'Bengaluru, Karnataka, India',
};

const STEPS = [
  { id: 'design', label: 'Design', short: '1', icon: LayoutTemplate },
  { id: 'profile', label: 'Profile', short: '2', icon: UserRound },
  { id: 'background', label: 'Background', short: '3', icon: HeartHandshake },
  { id: 'family', label: 'Family & story', short: '4', icon: UsersRound },
  { id: 'preview', label: 'Preview', short: '5', icon: Eye },
] as const;

type StudioFieldProps = {
  label: string;
  field: keyof BiodataForm;
  form: BiodataForm;
  update: (field: keyof BiodataForm, value: string) => void;
  placeholder?: string;
  help?: string;
  multiline?: boolean;
  options?: string[];
};

function StudioField({ label, field, form, update, placeholder, help, multiline, options }: StudioFieldProps) {
  const value = typeof form[field] === 'string' ? String(form[field] ?? '') : '';
  const base = 'w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-950 outline-none focus:border-[#8b2635] focus:ring-2 focus:ring-[#8b2635]/10';
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.68rem] font-black uppercase tracking-[0.13em] text-stone-500">{label}</span>
      {options ? (
        <select className={base} value={value} onChange={(event) => update(field, event.target.value)}>
          <option value="">Not specified</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : multiline ? (
        <textarea className={`${base} min-h-24 resize-y leading-6`} value={value} placeholder={placeholder} onChange={(event) => update(field, event.target.value)} />
      ) : (
        <input className={base} value={value} placeholder={placeholder} onChange={(event) => update(field, event.target.value)} />
      )}
      {help && <span className="mt-1.5 block text-xs leading-5 text-stone-500">{help}</span>}
    </label>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mb-7">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#a14b39]">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-stone-950">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">{text}</p>
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 sm:p-6">
      <h3 className="mb-5 text-sm font-black tracking-tight text-stone-900">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function BiodataStudioClient() {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>(DEFAULT_BIODATA_TEMPLATE);
  const [form, setForm] = useState<BiodataForm>(EMPTY_FORM);
  const [filter, setFilter] = useState('All');
  const [zoom, setZoom] = useState(0.62);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('biodata_form');
    if (saved) {
      try {
        setForm({ ...EMPTY_FORM, ...JSON.parse(saved) });
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
    if (!node) return;
    const fit = () => setZoom(Math.min(0.82, Math.max(0.3, (node.clientWidth - 48) / 794)));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [step]);

  const update = (field: keyof BiodataForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const requiredFields: Array<keyof BiodataForm> = ['fullName', 'dateOfBirth', 'height', 'education', 'occupation', 'fatherName', 'motherName', 'phone'];
  const completed = requiredFields.filter((field) => String(form[field] ?? '').trim()).length;
  const progress = Math.round((completed / requiredFields.length) * 100);

  const filteredTemplates = useMemo(
    () => BIODATA_TEMPLATES.filter((template) => filter === 'All' || template.community === filter || template.style === filter),
    [filter]
  );
  const currentTemplate = BIODATA_TEMPLATES.find((template) => template.id === templateId) ?? BIODATA_TEMPLATES[0];

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      window.alert('Please choose an image smaller than 8 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const waitForPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  const getDocument = async () => {
    if (window.innerWidth < 1024 && step !== 4) {
      setStep(4);
      await waitForPaint();
    }
    return document.getElementById('biodata-document');
  };
  const saveBlob = (blob: Blob, extension: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.fullName.trim().replace(/\s+/g, '_') || 'Marriage_Biodata'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1500);
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
      window.alert('PNG export failed. Please open Preview and try again.');
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
      pdf.setTitle(`${form.fullName.trim() || 'Marriage Biodata'} - Marriage Biodata`);
      pdf.setProducer('Toolioz Biodata Studio');
      const page = pdf.addPage([595.28, 841.89]);
      const bytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (character) => character.charCodeAt(0));
      const image = await pdf.embedPng(bytes);
      page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 });
      saveBlob(new Blob([await pdf.save() as BlobPart], { type: 'application/pdf' }), 'pdf');
    } catch (error) {
      console.error(error);
      window.alert('PDF export failed. Please open Preview and try again.');
    } finally {
      setExporting(null);
    }
  };

  const addCustomField = () => setForm((current) => ({
    ...current,
    customFields: [...(current.customFields ?? []), { id: crypto.randomUUID(), label: '', value: '' }],
  }));
  const updateCustomField = (id: string, key: 'label' | 'value', value: string) => setForm((current) => ({
    ...current,
    customFields: (current.customFields ?? []).map((field) => field.id === id ? { ...field, [key]: value } : field),
  }));
  const removeCustomField = (id: string) => setForm((current) => ({
    ...current,
    customFields: (current.customFields ?? []).filter((field) => field.id !== id),
  }));

  if (!loaded) return <div className="h-[640px] bg-[#f5f0e8]" />;
  const Template = currentTemplate.component;
  const isPreview = step === 4;

  return (
    <div className="flex h-[calc(100dvh-120px)] min-h-[560px] flex-col overflow-hidden border-y border-stone-200 bg-[#f5f0e8] text-stone-950">
      <header className="flex min-h-20 shrink-0 items-center justify-between gap-4 border-b border-stone-200 bg-[#fffdf9] px-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#7a2433] font-serif text-xl font-bold text-white">B</span>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-bold sm:text-xl">Biodata Atelier</p>
              <p className="hidden text-xs text-stone-500 sm:block">A considered introduction, ready to share</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 md:flex"><ShieldCheck size={15} />Saved only on this device</div>
          <button type="button" onClick={() => setForm(SAMPLE_FORM)} className="rounded-full px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100">Use sample</button>
          <button type="button" onClick={() => window.confirm('Clear every biodata field?') && setForm(EMPTY_FORM)} className="rounded-full p-2 text-stone-500 hover:bg-stone-100" aria-label="Clear form"><RotateCcw size={17} /></button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[440px_minmax(0,1fr)] xl:grid-cols-[480px_minmax(0,1fr)]">
        <aside className={`${isPreview ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-r border-stone-200 bg-[#fffdf9]`}>
          <div className="border-b border-stone-200 px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-stone-600"><span>{progress}% profile complete</span><span>{completed}/{requiredFields.length} essentials</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-200"><div className="h-full bg-[#a14b39]" style={{ width: `${progress}%` }} /></div>
            <nav className="mt-4 grid grid-cols-5 gap-1" aria-label="Biodata creation steps">
              {STEPS.map((item, index) => {
                const Icon = item.icon;
                return <button key={item.id} type="button" onClick={() => setStep(index)} className={`rounded-lg px-1 py-2 text-center ${step === index ? 'bg-[#7a2433] text-white' : index < step ? 'bg-[#efe3d6] text-[#7a2433]' : 'text-stone-500 hover:bg-stone-100'}`}><Icon className="mx-auto" size={16} /><span className="mt-1 hidden text-[0.65rem] font-bold sm:block">{item.label}</span></button>;
              })}
            </nav>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {step === 0 && <>
              <SectionIntro eyebrow="Step one" title="Choose a template" text="Pick the visual direction that fits the family and occasion. Each option below describes the real A4 design you will edit and export." />
              <div className="mb-5 flex flex-wrap gap-2">{['All', 'Traditional', 'Royal', 'Modern', 'Minimal', 'Hindu', 'Muslim', 'Sikh'].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${filter === item ? 'border-[#7a2433] bg-[#7a2433] text-white' : 'border-stone-300 bg-white text-stone-600 hover:border-stone-500'}`}>{item}</button>)}</div>
              <div className="divide-y divide-stone-200 border-y border-stone-200">{filteredTemplates.map((template) => {
                const selected = template.id === templateId;
                return <button key={template.id} type="button" onClick={() => setTemplateId(template.id)} aria-pressed={selected} className={`group flex w-full items-center gap-3 py-4 text-left transition-colors ${selected ? 'bg-[#f7eee8]' : 'hover:bg-[#fbf7f1]'}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-serif text-sm font-bold ${selected ? 'border-[#7a2433] bg-[#7a2433] text-white' : 'border-stone-300 bg-white text-stone-500'}`}>{template.style.slice(0, 1)}</span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm text-stone-900">{template.name}</strong><span className="mt-0.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#a14b39]">{template.community} · {template.style}</span><span className="mt-1 block max-w-[34rem] text-xs leading-5 text-stone-500">{template.description}</span></span>
                  <span className={`shrink-0 text-[0.65rem] font-black uppercase tracking-[0.1em] ${selected ? 'text-[#7a2433]' : 'text-transparent group-hover:text-stone-400'}`}>{selected ? 'Selected' : 'Choose'}</span>
                </button>;
              })}</div>
            </>}

            {step === 1 && <div className="space-y-6">
              <SectionIntro eyebrow="Step two" title="The essentials" text="Lead with the details families scan first. Only completed fields appear in the final document." />
              <section className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-black text-stone-900">Portrait</h3>
                <div className="flex items-center gap-4">
                  {form.photo ? <img src={form.photo} alt="Uploaded profile" className="h-24 w-20 rounded-xl border border-stone-200 object-cover" /> : <div className="grid h-24 w-20 place-items-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-stone-400"><ImageIcon size={25} /></div>}
                  <div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhoto} /><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-[#7a2433] px-4 py-2.5 text-sm font-bold text-white"><Upload size={16} />{form.photo ? 'Replace photo' : 'Upload photo'}</button>{form.photo && <button type="button" onClick={() => setForm((current) => ({ ...current, photo: null }))} className="ml-2 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-500 hover:bg-stone-100">Remove</button>}<p className="mt-2 text-xs leading-5 text-stone-500">Use a recent, well-lit portrait. JPG, PNG or WebP up to 8 MB.</p></div>
                </div>
              </section>
              <FieldGroup title="Identity"><StudioField label="Full name" field="fullName" form={form} update={update} placeholder="Name as it should appear" /><StudioField label="Gender" field="gender" form={form} update={update} options={['Woman', 'Man', 'Non-binary', 'Prefer not to say']} /><StudioField label="Date of birth" field="dateOfBirth" form={form} update={update} placeholder="15 August 1997" /><StudioField label="Marital status" field="maritalStatus" form={form} update={update} options={['Never married', 'Divorced', 'Widowed', 'Annulled']} /><StudioField label="Height" field="height" form={form} update={update} placeholder="5 ft 9 in" /><StudioField label="Mother tongue" field="motherTongue" form={form} update={update} placeholder="Hindi" /></FieldGroup>
              <FieldGroup title="Contact"><StudioField label="Phone" field="phone" form={form} update={update} placeholder="+91" /><StudioField label="Email" field="email" form={form} update={update} placeholder="name@example.com" /><div className="sm:col-span-2"><StudioField label="Current address" field="address" form={form} update={update} placeholder="City, State, Country" multiline /></div></FieldGroup>
            </div>}

            {step === 2 && <div className="space-y-6">
              <SectionIntro eyebrow="Step three" title="Life & background" text="Add education, work and community details. Horoscope fields are optional and can remain blank." />
              <FieldGroup title="Education & work"><StudioField label="Highest education" field="education" form={form} update={update} placeholder="M.Tech, Computer Science" /><StudioField label="College / university" field="college" form={form} update={update} /><StudioField label="Occupation" field="occupation" form={form} update={update} /><StudioField label="Company" field="company" form={form} update={update} /><StudioField label="Annual income" field="annualIncome" form={form} update={update} placeholder="₹24 LPA" /><StudioField label="Work location" field="workLocation" form={form} update={update} /></FieldGroup>
              <FieldGroup title="Personal & lifestyle"><StudioField label="Religion" field="religion" form={form} update={update} /><StudioField label="Caste / community" field="caste" form={form} update={update} /><StudioField label="Diet" field="diet" form={form} update={update} options={['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan', 'Jain']} /><StudioField label="Languages" field="languages" form={form} update={update} /><StudioField label="Weight" field="weight" form={form} update={update} placeholder="Optional" /><StudioField label="Blood group" field="bloodGroup" form={form} update={update} placeholder="Optional" /></FieldGroup>
              <FieldGroup title="Horoscope — optional"><StudioField label="Birth time" field="birthTime" form={form} update={update} /><StudioField label="Birth place" field="birthPlace" form={form} update={update} /><StudioField label="Gotra" field="gotra" form={form} update={update} /><StudioField label="Manglik" field="manglik" form={form} update={update} options={['Manglik', 'Non-Manglik', 'Anshik Manglik', 'Not known']} /><StudioField label="Rashi" field="rashi" form={form} update={update} /><StudioField label="Nakshatra" field="nakshatra" form={form} update={update} /></FieldGroup>
            </div>}

            {step === 3 && <div className="space-y-6">
              <SectionIntro eyebrow="Step four" title="Family & your story" text="Give useful family context, then write a short introduction in your own voice rather than using generic phrases." />
              <FieldGroup title="Family"><StudioField label="Father's name" field="fatherName" form={form} update={update} /><StudioField label="Father's occupation" field="fatherOccupation" form={form} update={update} /><StudioField label="Mother's name" field="motherName" form={form} update={update} /><StudioField label="Mother's occupation" field="motherOccupation" form={form} update={update} /><StudioField label="Native place" field="nativePlace" form={form} update={update} /><StudioField label="Family type" field="familyType" form={form} update={update} options={['Nuclear family', 'Joint family']} /><StudioField label="Family status" field="familyStatus" form={form} update={update} /><div className="sm:col-span-2"><StudioField label="Siblings" field="siblings" form={form} update={update} multiline placeholder="One younger sister, architect" /></div></FieldGroup>
              <FieldGroup title="In your own words"><div className="sm:col-span-2"><StudioField label="About me" field="about" form={form} update={update} multiline help="Two or three specific sentences work better than generic claims." /></div><div className="sm:col-span-2"><StudioField label="Hobbies & interests" field="hobbies" form={form} update={update} multiline /></div><div className="sm:col-span-2"><StudioField label="Partner preferences" field="partnerPreferences" form={form} update={update} multiline help="Keep expectations respectful, practical and concise." /></div></FieldGroup>
              <section className="rounded-2xl border border-stone-200 bg-[#fffdf9] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-stone-900">Additional details</h3><p className="mt-1 text-xs text-stone-500">Add a field only when it matters to the family.</p></div><button type="button" onClick={addCustomField} className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700"><Plus size={14} />Add field</button></div><div className="mt-5 space-y-3">{(form.customFields ?? []).map((field) => <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2"><input className="min-w-0 rounded-lg border border-stone-300 px-3 py-2 text-sm" value={field.label} placeholder="Label" onChange={(event) => updateCustomField(field.id, 'label', event.target.value)} /><input className="min-w-0 rounded-lg border border-stone-300 px-3 py-2 text-sm" value={field.value} placeholder="Value" onChange={(event) => updateCustomField(field.id, 'value', event.target.value)} /><button type="button" onClick={() => removeCustomField(field.id)} className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove field"><Trash2 size={16} /></button></div>)}</div></section>
            </div>}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-stone-200 bg-[#fffdf9] px-4 py-3 sm:px-6">
            <button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold text-stone-600 disabled:opacity-30"><ChevronLeft size={17} />Back</button>
            <button type="button" onClick={() => setStep((value) => Math.min(4, value + 1))} className="inline-flex items-center gap-2 rounded-xl bg-[#7a2433] px-5 py-2.5 text-sm font-bold text-white">{step === 3 ? 'Review biodata' : step === 4 ? 'Preview' : 'Continue'}<ChevronRight size={17} /></button>
          </div>
        </aside>

        <main className={`${isPreview ? 'flex' : 'hidden lg:flex'} min-h-0 min-w-0 w-full flex-col bg-[#e9e2d8]`}>
          <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-stone-300 bg-[#f8f4ed] px-4 sm:px-6">
            <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[0.13em] text-stone-500">A4 live preview</p><p className="hidden truncate text-xs text-stone-500 md:block">{currentTemplate.name}</p></div>
            <div className="flex shrink-0 items-center gap-2"><button type="button" aria-label="Download PNG" onClick={exportPng} disabled={exporting !== null} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 disabled:opacity-50"><FileImage size={15} /><span className="hidden md:inline">{exporting === 'png' ? 'Preparing…' : 'PNG'}</span></button><button type="button" aria-label="Download PDF" onClick={exportPdf} disabled={exporting !== null} className="inline-flex items-center gap-2 rounded-xl bg-[#7a2433] px-3 py-2 text-xs font-bold text-white disabled:opacity-50 md:px-4"><Download size={15} /><span className="hidden md:inline">{exporting === 'pdf' ? 'Preparing…' : 'Download PDF'}</span></button></div>
          </div>
          <div ref={previewRef} className="min-h-0 flex-1 overflow-auto p-6 sm:p-10">
            <div className="mx-auto" style={{ width: `${794 * zoom}px`, height: `${1123 * zoom}px` }}>
              <div className="origin-top-left bg-white shadow-[0_25px_80px_-30px_rgba(55,35,20,0.45)]" style={{ width: 794, height: 1123, transform: `scale(${zoom})` }}><Template data={form} /></div>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between border-t border-stone-300 bg-[#f8f4ed] px-4 py-3"><p className="hidden items-center gap-2 text-xs font-bold text-stone-600 sm:flex"><ShieldCheck size={15} className="text-emerald-700" />No upload. No watermark.</p><div className="ml-auto flex items-center gap-2"><button type="button" onClick={() => setZoom((value) => Math.max(0.25, value - 0.05))} className="grid h-8 w-8 place-items-center rounded-full border border-stone-300 bg-white text-sm font-bold">−</button><span className="w-12 text-center text-xs font-bold text-stone-600">{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(1, value + 0.05))} className="grid h-8 w-8 place-items-center rounded-full border border-stone-300 bg-white text-sm font-bold">+</button></div></div>
        </main>
      </div>

      <nav className="grid shrink-0 grid-cols-5 border-t border-stone-200 bg-[#fffdf9] lg:hidden" aria-label="Biodata steps">{STEPS.map((item, index) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setStep(index)} className={`flex flex-col items-center gap-1 py-2 text-[0.65rem] font-bold ${step === index ? 'text-[#7a2433]' : 'text-stone-500'}`}><Icon size={17} />{item.label}</button>; })}</nav>
    </div>
  );
}
