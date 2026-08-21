'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, SwitchCamera, Check, FileUp } from 'lucide-react';
import { FAQSchema } from '@/components/ui/FAQSchema';

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
    } catch {
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
    <div className="flex min-h-screen flex-col justify-between bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div>
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                Security & Data
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              Base64 Converter
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Encode text or files to Base64, or decode them back to their original form. 100% private.
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_140px_1fr]">
            <div>
              <Card className="flex h-[440px] flex-col p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {mode === 'encode' ? 'Binary / Text Input' : 'Base64 Input'}
                  </h3>
                  <div className="flex gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition">
                      <FileUp size={14} /> Upload
                      <input type="file" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <textarea
                  className="w-full flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 p-3 font-mono text-xs leading-relaxed text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-blue-600"
                  placeholder={mode === 'encode' ? 'Type or paste text here...' : 'Paste Base64 string here...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Card>
            </div>

            <div className="flex flex-row justify-center gap-3 lg:flex-col lg:items-center">
              <Button size="lg" onClick={handleProcess} className="w-full">
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleMode} className="w-full">
                <SwitchCamera size={14} className="mr-1.5" /> Swap
              </Button>
            </div>

            <div>
              <Card className="flex h-[440px] flex-col p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Result
                  </h3>
                  {output && (
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {copied ? <Check size={14} className="text-emerald-500 mr-1" /> : <Copy size={14} className="mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </div>
                <div className="relative flex-1 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900 dark:bg-zinc-950 p-4 font-mono text-xs">
                  {error ? (
                    <div className="text-rose-400 font-semibold">{error}</div>
                  ) : (
                    <pre className="m-0 whitespace-pre-wrap break-all text-zinc-200 leading-relaxed">
                      {output || 'Result will appear here...'}
                    </pre>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <FAQSchema faqs={BASE64_FAQS} />
      <Footer />
    </div>
  );
}
