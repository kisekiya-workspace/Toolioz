'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Hash, RefreshCw, Check } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';

import { FAQSchema } from '@/components/ui/FAQSchema';
export default function UUIDClient({ title, color }: { title?: string, color?: string }) {
  const [quantity, setQuantity] = useState<number>(10);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Persistence
  useEffect(() => {
    const savedQty = localStorage.getItem('toolioz_uuid_qty');
    const savedHyphens = localStorage.getItem('toolioz_uuid_hyphens');
    const savedUpper = localStorage.getItem('toolioz_uuid_upper');

    if (savedQty) setQuantity(parseInt(savedQty));
    if (savedHyphens) setHyphens(savedHyphens === 'true');
    if (savedUpper) setUppercase(savedUpper === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('toolioz_uuid_qty', quantity.toString());
  }, [quantity]);

  useEffect(() => {
    localStorage.setItem('toolioz_uuid_hyphens', hyphens.toString());
  }, [hyphens]);

  useEffect(() => {
    localStorage.setItem('toolioz_uuid_upper', uppercase.toString());
  }, [uppercase]);

  // Generate UUID v4
  const generateUUID = () => {
    // using crypto.randomUUID if available (modern browsers)
    // fallback if not available
    let uuid = '';
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uuid = crypto.randomUUID();
    } else {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    if (!hyphens) uuid = uuid.replace(/-/g, '');
    if (uppercase) uuid = uuid.toUpperCase();
    return uuid;
  };

  const handleGenerate = () => {
    const qty = Math.min(Math.max(1, quantity), 1000); // cap to 1000 to prevent crashing
    setQuantity(qty);
    
    const results = [];
    for (let i = 0; i < qty; i++) {
      results.push(generateUUID());
    }
    setOutput(results.join('\n'));
    setCopied(false);
  };

  // Generate initial batch on mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="mx-auto w-full max-w-[900px] flex-1 px-5 py-10">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-[1.8rem] font-extrabold text-[var(--text-primary)] sm:text-[2.5rem]">{title || 'Bulk UUID Generator'}</h1>
          <p className="text-[1.1rem] leading-relaxed text-[var(--text-secondary)]">
            A version 4 UUID is 122 random bits. This page uses crypto.randomUUID, or Math.random when that function is missing. Quantity is capped at 1000. Hyphens and letter case can change.
          </p>
        </header>

        <section className="mb-8 flex flex-col items-stretch justify-between gap-5 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass)] p-5 backdrop-blur-[12px] sm:flex-row sm:items-center sm:p-[30px]">
          <div className="flex flex-col gap-2">
            <label className="text-[0.85rem] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Quantity</label>
            <input 
              type="number" 
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-[15px] py-[10px] font-[var(--font-sans)] text-[1rem] text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] sm:w-[100px]" 
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min={1} 
              max={1000}
            />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row">
            <label className="flex cursor-pointer items-center gap-2.5 text-[0.95rem] text-[var(--text-primary)]">
              <input 
                type="checkbox" 
                checked={hyphens} 
                onChange={(e) => setHyphens(e.target.checked)} 
              />
              Include Hyphens
            </label>

            <label className="flex cursor-pointer items-center gap-2.5 text-[0.95rem] text-[var(--text-primary)]">
              <input 
                type="checkbox" 
                checked={uppercase} 
                onChange={(e) => setUppercase(e.target.checked)} 
              />
              Uppercase
            </label>
          </div>

          <button className="cursor-pointer rounded-[var(--radius-sm)] border-none bg-[var(--primary)] px-[30px] py-[12px] text-[1rem] font-semibold text-white transition-all hover:-translate-y-[2px] hover:bg-[var(--primary-hover)]" onClick={handleGenerate}>
            <RefreshCw size={16} className="mr-2 inline align-text-bottom" />
            Generate New Batch
          </button>
        </section>

        <section className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)] px-[20px] py-[15px]">
            <span className="text-[0.9rem] font-medium text-[var(--text-secondary)]">Generated {output ? output.split('\n').length : 0} UUIDs</span>
          </div>
          
          <div className="relative flex-1">
            <textarea 
              className="h-[400px] w-full resize-y border-none bg-transparent p-[20px] font-['Consolas',monospace] text-[0.95rem] leading-relaxed text-[var(--text-primary)] outline-none" 
              value={output} 
              readOnly 
              aria-label="Generated UUIDs"
            />
            
            <div className="absolute right-[15px] top-[15px]">
              <button 
                className={`flex cursor-pointer items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--border)] px-[16px] py-[8px] text-[0.85rem] font-medium transition-all ${copied ? '!border-[#10b981] !bg-[#10b981] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`} 
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy All'}
              </button>
            </div>
          </div>
        </section>


      </main>

      <div className="container pb-16">
        <RelatedTools currentToolId="uuid-generator" categoryId="devtools" />
      </div>

      <SEOSection 
        title="Bulk v4 UUID Generator"
        description="A version 4 UUID is 122 random bits. This page uses crypto.randomUUID, or Math.random when that function is missing. Quantity is capped at 1000."
        howToUse={[
          "Choose a quantity from 1 to 1000.",
          "Turn hyphens on for the standard form, or off for the compact form.",
          "Choose uppercase when a legacy GUID format is required.",
          "Generate a new batch, then copy the list.",
        ]}
        benefits={[
          "Uses crypto.randomUUID, or Math.random when that function is missing.",
          "Creates at most 1000 identifiers in one batch.",
          "The identifiers are not uploaded. The page still loads site assets.",
          "Hyphens can be removed and the letters can be uppercase.",
        ]}
      />

      <Footer />
    </div>
  );
}
