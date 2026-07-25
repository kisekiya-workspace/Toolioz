'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Binary, Copy, Trash2, SwitchCamera, Check, FileUp, Download } from 'lucide-react';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
const BASE64_FAQS = [
  {
    question: "What is Base64 encoding?",
    answer: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format using 64 printable characters (A-Z, a-z, 0-9, +, /)."
  },
  {
    question: "Is Base64 encoding secure encryption?",
    answer: "No, Base64 is NOT encryption. It is an encoding method for safe data transport. Anyone can decode a Base64 string back to its original plain text instantly."
  }
];

export default function Base64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input.trim()));
      }
    } catch (e) {
      setError(mode === 'encode' ? 'Unable to encode. String contains non-Latin1 characters.' : 'Invalid Base64 string.');
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setInput(result);
      if (mode === 'encode') {
        // For files, we usually want the data URI base64
        setOutput(result.split(',')[1] || result);
      }
    };
    
    if (mode === 'encode') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)]">
      <header className="bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.05)_0%,transparent_50%)] pb-16 pt-32 text-center">
        <div className="container">
          <div className="mb-8 inline-block rounded-full bg-[var(--primary-light)] px-4 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-[var(--primary)]">Security & Data</div>
          <h1 className="mb-6 text-[3.5rem] font-black tracking-[-0.02em]">Base64 <span className="text-[var(--primary)]">Converter</span></h1>
          <p className="mx-auto max-w-[650px] text-[1.25rem] text-[var(--text-secondary)]">Encode text or files to Base64, or decode them back to their original form. 100% private.</p>
        </div>
      </header>

      <main className="container section flex-1">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_150px_1fr]">
          <div>
            <Card className="!flex h-[450px] flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[1rem] font-bold text-[var(--text-primary)]">{mode === 'encode' ? 'Binary / Text Input' : 'Base64 Input'}</h3>
                <div className="flex gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] px-[0.8rem] py-[0.4rem] text-[0.8125rem] font-semibold transition-all duration-200 hover:border-[var(--primary)] hover:bg-white">
                    <FileUp size={16} /> Upload File
                    <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                  <Button variant="ghost" size="sm" onClick={() => setInput('')}><Trash2 size={16} /></Button>
                </div>
              </div>
              <textarea
                className="w-full flex-1 resize-none rounded-[var(--radius-md)] border-none bg-[var(--bg-secondary)] p-4 font-mono text-[0.9375rem] text-[var(--text-primary)] outline-none focus:bg-[rgba(37,99,235,0.02)]"
                placeholder={mode === 'encode' ? 'Type or paste text here...' : 'Paste Base64 string here...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          <div className="flex flex-row justify-center gap-6 lg:flex-col lg:items-center">
            <Button size="lg" onClick={handleProcess} className="!h-[60px] !w-[200px] !rounded-full !text-[1.125rem] lg:!w-full">
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleMode} className="!rounded-full">
              <SwitchCamera size={16} /> Switch Mode
            </Button>
          </div>

          <div>
            <Card className="!flex h-[450px] flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[1rem] font-bold text-[var(--text-primary)]">Result</h3>
                {output && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                )}
              </div>
              <div className="relative flex-1 overflow-auto rounded-[var(--radius-md)] bg-[#1e293b] p-6">
                {error ? (
                  <div className="text-[0.875rem] font-semibold text-[#fb7185]">{error}</div>
                ) : (
                  <pre className="m-0 whitespace-pre-wrap break-all font-mono text-[0.875rem] leading-[1.6] text-[#e2e8f0]">{output || 'Result will appear here...'}</pre>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <FAQSchema faqs={BASE64_FAQS} />
      <Footer />
    </div>
  );
}
