'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Download,
  Copy,
  AlertCircle,
  LoaderCircle,
  CheckCircle2,
  FileText,
  ChevronDown,
  Code2,
  Palette,
  Pencil,
  Eye,
} from 'lucide-react';
import { generateVisualPdf } from './visual-pdf';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RESUME_TEMPLATES } from './resume-templates';
import { VISUAL_TEMPLATES } from './visual-templates';
import { SAMPLE_RESUME, type ResumeData } from './resume-types';
import ResumeFormEditor from './ResumeFormEditor';

type EditorMode = 'latex' | 'visual';
type MobilePanel = 'edit' | 'preview';

const A4_WIDTH_PX = 794;

export default function ResumeGeneratorClient() {
  const [mode, setMode] = useState<EditorMode>('visual');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('edit');
  const [previewScale, setPreviewScale] = useState(0.5);

  const [latexSource, setLatexSource] = useState(RESUME_TEMPLATES[0].source);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [activeLatexTemplate, setActiveLatexTemplate] = useState(RESUME_TEMPLATES[0].id);
  const [showLatexTemplates, setShowLatexTemplates] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUME);
  const [activeVisualTemplate, setActiveVisualTemplate] = useState(VISUAL_TEMPLATES[0].id);
  const [showVisualTemplates, setShowVisualTemplates] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);

  const updatePreviewScale = useCallback(() => {
    if (typeof window === 'undefined') return;
    const padding = 24;
    const available = window.innerWidth - padding;
    setPreviewScale(Math.min(1, Math.max(0.32, available / A4_WIDTH_PX)));
  }, []);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('resume_editor_mode') as EditorMode | null;
      if (savedMode) setMode(savedMode);
      const savedLatex = localStorage.getItem('resume_editor_latex');
      if (savedLatex) setLatexSource(savedLatex);
      const savedLT = localStorage.getItem('resume_editor_latex_tpl');
      if (savedLT) setActiveLatexTemplate(savedLT);
      const savedData = localStorage.getItem('resume_editor_data');
      if (savedData) setResumeData(JSON.parse(savedData));
      const savedVT = localStorage.getItem('resume_editor_visual_tpl');
      if (savedVT) setActiveVisualTemplate(savedVT);
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
    updatePreviewScale();
  }, [updatePreviewScale]);

  useEffect(() => {
    window.addEventListener('resize', updatePreviewScale);
    return () => window.removeEventListener('resize', updatePreviewScale);
  }, [updatePreviewScale]);

  useEffect(() => {
    if (mobilePanel === 'preview') updatePreviewScale();
  }, [mobilePanel, updatePreviewScale]);

  useEffect(() => {
    if (isHydrated) localStorage.setItem('resume_editor_mode', mode);
  }, [mode, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem('resume_editor_latex', latexSource);
  }, [latexSource, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem('resume_editor_latex_tpl', activeLatexTemplate);
  }, [activeLatexTemplate, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem('resume_editor_data', JSON.stringify(resumeData));
  }, [resumeData, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem('resume_editor_visual_tpl', activeVisualTemplate);
  }, [activeVisualTemplate, isHydrated]);

  useEffect(() => {
    if (copiedLatex) {
      const t = setTimeout(() => setCopiedLatex(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copiedLatex]);

  const compilePdf = async () => {
    try {
      setIsCompiling(true);
      setCompileError(null);
      const apiUrl = process.env.NEXT_PUBLIC_LATEX_API;
      if (!apiUrl) {
        setCompileError('NEXT_PUBLIC_LATEX_API not set.');
        return;
      }
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex: latexSource }),
      });
      if (!res.ok) {
        let msg = 'Compilation failed.';
        try {
          const d = await res.json();
          msg = d.details || d.error || msg;
          if (d.hint) msg += '\n' + d.hint;
        } catch {
          /* ignore */
        }
        setCompileError(msg);
        return;
      }
      const blob = await res.blob();
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(blob));
      setMobilePanel('preview');
    } catch {
      setCompileError('Network error.');
    } finally {
      setIsCompiling(false);
    }
  };

  const copyLatex = async () => {
    await navigator.clipboard.writeText(latexSource);
    setCopiedLatex(true);
  };
  const downloadTex = () => {
    const b = new Blob([latexSource], { type: 'text/x-tex' });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = u;
    a.download = 'resume.tex';
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1500);
  };
  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'resume.pdf';
    a.click();
  };

  const loadLatexTemplate = (tpl: (typeof RESUME_TEMPLATES)[0]) => {
    setLatexSource(tpl.source);
    setActiveLatexTemplate(tpl.id);
    setShowLatexTemplates(false);
    setPdfUrl(null);
    setCompileError(null);
  };

  const downloadVisualPdf = async () => {
    try {
      setIsGenerating(true);
      const pdfBytes = await generateVisualPdf(resumeData, activeVisualTemplate);
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.contact.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const VisualComponent = VISUAL_TEMPLATES.find((t) => t.id === activeVisualTemplate)?.component;
  const currentLatexTpl = RESUME_TEMPLATES.find((t) => t.id === activeLatexTemplate);
  const currentVisualTpl = VISUAL_TEMPLATES.find((t) => t.id === activeVisualTemplate);

  if (!isHydrated) return null;

  const showEditPanel = mobilePanel === 'edit';
  const showPreviewPanel = mobilePanel === 'preview';

  const LatexTemplatePicker = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowLatexTemplates(!showLatexTemplates)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
      >
        <FileText size={13} />
        {currentLatexTpl?.name || 'Templates'}
        <ChevronDown size={12} className={showLatexTemplates ? 'rotate-180' : ''} />
      </button>
      {showLatexTemplates && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowLatexTemplates(false)} aria-hidden />
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl sm:left-auto sm:right-0 sm:w-72">
            {RESUME_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => loadLatexTemplate(tpl)}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${activeLatexTemplate === tpl.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${tpl.accent}`}
                >
                  {tpl.id === 'jakes' ? 'FAANG' : tpl.id === 'harvard' ? 'MBA' : tpl.id === 'modern-clean' ? 'ATS' : 'TECH'}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{tpl.name}</div>
                  <div className="text-[11px] text-slate-500">{tpl.description}</div>
                </div>
                {activeLatexTemplate === tpl.id && (
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const VisualTemplatePicker = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowVisualTemplates(!showVisualTemplates)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <Palette size={13} />
        {currentVisualTpl?.name || 'Template'}
        <ChevronDown size={12} className={showVisualTemplates ? 'rotate-180' : ''} />
      </button>
      {showVisualTemplates && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowVisualTemplates(false)} aria-hidden />
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[50vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {VISUAL_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setActiveVisualTemplate(tpl.id);
                  setShowVisualTemplates(false);
                }}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${activeVisualTemplate === tpl.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              >
                <span className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${tpl.accent}`}>
                  COLOR
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{tpl.name}</div>
                  <div className="text-[11px] text-slate-500">{tpl.description}</div>
                </div>
                {activeVisualTemplate === tpl.id && (
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-slate-50 text-slate-950">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 xl:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-base font-black tracking-[-0.03em] text-slate-900 sm:text-lg">
              Resume Editor
            </h1>
            <div className="flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => {
                  setMode('visual');
                  setMobilePanel('edit');
                }}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs ${mode === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                <Palette size={12} /> Visual
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('latex');
                  setMobilePanel('edit');
                }}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs ${mode === 'latex' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                <Code2 size={12} /> LaTeX
              </button>
            </div>
          </div>

          {/* Desktop-only header actions */}
          <div className="hidden flex-wrap items-center gap-2 xl:flex">
            {mode === 'latex' ? (
              <>
                <LatexTemplatePicker />
                <div className="h-5 w-px bg-slate-200" />
                <Button variant="outline" size="sm" onClick={copyLatex}>
                  {copiedLatex ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiedLatex ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadTex}>
                  <Download size={14} />
                  .tex
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={compilePdf}
                  disabled={isCompiling}
                  className="border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isCompiling ? <LoaderCircle size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                  {isCompiling ? 'Compiling…' : 'Compile PDF'}
                </Button>
                {pdfUrl && (
                  <Button variant="outline" size="sm" onClick={downloadPdf}>
                    <Download size={14} /> PDF
                  </Button>
                )}
              </>
            ) : (
              <>
                <VisualTemplatePicker />
                <div className="h-5 w-px bg-slate-200" />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={downloadVisualPdf}
                  disabled={isGenerating}
                  className="border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isGenerating ? <LoaderCircle size={14} className="animate-spin" /> : <Download size={14} />}
                  {isGenerating ? 'Generating…' : 'Download PDF'}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col xl:flex-row">
        {mode === 'latex' ? (
          <>
            <section
              className={`flex min-h-0 min-w-0 flex-1 flex-col border-slate-200 bg-[#0d1117] xl:border-r ${showEditPanel ? 'flex' : 'hidden xl:flex'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 bg-[#161b22] px-3 py-2 sm:px-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Source</span>
                <div className="flex flex-wrap items-center gap-2 xl:hidden">
                  <LatexTemplatePicker />
                  <Button variant="outline" size="sm" onClick={copyLatex} className="h-8 border-slate-600 text-slate-300">
                    <Copy size={13} />
                  </Button>
                </div>
                <span className="hidden text-[10px] font-mono text-slate-600 sm:inline">
                  {latexSource.split('\n').length} lines
                </span>
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <textarea
                  className="absolute inset-0 h-full w-full resize-none bg-transparent p-3 font-mono text-[13px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600 sm:p-4"
                  value={latexSource}
                  onChange={(e) => setLatexSource(e.target.value)}
                  spellCheck={false}
                  placeholder="% Write your LaTeX code here..."
                />
              </div>
            </section>

            <section
              className={`relative flex min-h-0 min-w-0 flex-1 flex-col bg-slate-100 ${showPreviewPanel ? 'flex' : 'hidden xl:flex'}`}
            >
              <div className="z-10 flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">PDF Preview</span>
                {pdfUrl && (
                  <Button variant="ghost" size="sm" onClick={downloadPdf} className="hidden h-7 text-xs xl:flex">
                    <Download size={12} className="mr-1" />
                    Download
                  </Button>
                )}
              </div>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 sm:p-4 xl:pb-4 xl:p-8">
                {compileError ? (
                  <Card className="max-w-lg border-red-200 bg-red-50 p-4 text-red-900 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={20} />
                      <div>
                        <h3 className="font-bold text-red-800">Compilation Error</h3>
                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-red-100/50 p-3 font-mono text-[11px] leading-relaxed text-red-800">
                          {compileError}
                        </pre>
                      </div>
                    </div>
                  </Card>
                ) : pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="h-full w-full max-h-full rounded-md border border-slate-200 bg-white shadow-lg"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 text-center text-slate-400">
                    <div className="mb-4 rounded-full bg-slate-200 p-4">
                      <Play size={28} className="ml-1 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-500">Compile to see preview</p>
                    <p className="mt-1 text-sm">Use the button below on mobile</p>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-slate-200 bg-white p-3 xl:hidden">
                <div className="mx-auto flex max-w-lg flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={compilePdf}
                    disabled={isCompiling}
                    className="h-11 w-full border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {isCompiling ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                    {isCompiling ? 'Compiling…' : pdfUrl ? 'Recompile PDF' : 'Compile PDF'}
                  </Button>
                  {pdfUrl && (
                    <Button variant="outline" size="sm" onClick={downloadPdf} className="h-11 w-full">
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section
              className={`flex min-h-0 w-full min-w-0 flex-col border-slate-200 bg-white xl:w-[min(420px,38vw)] xl:shrink-0 xl:border-r ${showEditPanel ? 'flex' : 'hidden xl:flex'}`}
            >
              <div className="border-b border-slate-100 px-3 py-2 sm:px-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Edit resume</span>
                <div className="mt-2 xl:hidden">
                  <VisualTemplatePicker />
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden pb-20 xl:pb-0">
                <ResumeFormEditor data={resumeData} onChange={setResumeData} />
              </div>
            </section>

            <section
              className={`relative flex min-h-0 min-w-0 flex-1 flex-col bg-slate-200/50 ${showPreviewPanel ? 'flex' : 'hidden xl:flex'}`}
            >
              <div className="z-10 flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live preview</span>
                <span className="text-[10px] text-slate-400">Matches exported PDF</span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-2 py-4 sm:px-4 xl:pb-6">
                <div className="mx-auto flex justify-center">
                  <div
                    className="origin-top shrink-0 rounded-sm border border-slate-200 bg-white shadow-xl"
                    style={{
                      width: `${A4_WIDTH_PX * previewScale}px`,
                      height: `${1123 * previewScale}px`,
                    }}
                  >
                    <div
                      ref={previewRef}
                      className="origin-top-left bg-white"
                      style={{
                        width: '210mm',
                        minHeight: '297mm',
                        transform: `scale(${previewScale})`,
                      }}
                    >
                      {VisualComponent && <VisualComponent data={resumeData} />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-slate-200 bg-white p-3 xl:hidden">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={downloadVisualPdf}
                  disabled={isGenerating}
                  className="h-12 w-full border-transparent bg-emerald-600 text-base font-bold text-white hover:bg-emerald-700"
                >
                  {isGenerating ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} className="mr-2" />
                  )}
                  {isGenerating ? 'Generating PDF…' : 'Download PDF'}
                </Button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Mobile bottom tabs */}
      <nav
        className="flex shrink-0 border-t border-slate-200 bg-white xl:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Editor panels"
      >
        <button
          type="button"
          onClick={() => setMobilePanel('edit')}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${mobilePanel === 'edit' ? 'text-emerald-700' : 'text-slate-500'}`}
        >
          <Pencil size={18} strokeWidth={mobilePanel === 'edit' ? 2.5 : 2} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('preview')}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${mobilePanel === 'preview' ? 'text-emerald-700' : 'text-slate-500'}`}
        >
          <Eye size={18} strokeWidth={mobilePanel === 'preview' ? 2.5 : 2} />
          Preview
        </button>
      </nav>
    </div>
  );
}
