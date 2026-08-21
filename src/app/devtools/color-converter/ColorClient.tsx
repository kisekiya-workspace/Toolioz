'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Copy, Check, RefreshCw, Plus, X } from 'lucide-react';
import styles from './page.module.css';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
// --- Color Core Functions --- //
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hslToHex(h: number, s: number, l: number) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// --- Accessibility Methods --- //
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(rgb1: {r:number, g:number, b:number}, rgb2: {r:number, g:number, b:number}) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Ensure l is safely within 0-100
function safeL(l: number) {
  return Math.min(100, Math.max(0, l));
}

// --- Generator Logic --- //
function shiftHue(h: number, amount: number) {
  return (h + amount + 360) % 360;
}

type MeshNode = { id: string; hex: string; x: number; y: number; spread: number };

export default function ColorClient({ title, color }: { title?: string, color?: string }) {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 90, l: 60 });
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [hexError, setHexError] = useState(false);

  // Visibility Tester State
  const [textMode, setTextMode] = useState<'auto' | 'white' | 'black' | 'custom'>('auto');
  const [customTextHex, setCustomTextHex] = useState("#FFFFFF");

  // Mesh Gradient State
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  
  const generateRandomMesh = useCallback(() => {
    const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setNodes([
      { id: '1', hex: randomHex(), x: 0, y: 0, spread: 50 },
      { id: '2', hex: randomHex(), x: 100, y: 0, spread: 70 },
      { id: '3', hex: randomHex(), x: 100, y: 100, spread: 50 },
      { id: '4', hex: randomHex(), x: 0, y: 100, spread: 60 }
    ]);
  }, []);

  useEffect(() => {
    const savedHex = localStorage.getItem('toolioz_color_hex');
    const savedNodes = localStorage.getItem('toolioz_mesh_nodes');
    
    if (savedHex) {
      setHex(savedHex);
      updateFromHex(savedHex);
    }
    
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (e) {
        generateRandomMesh();
      }
    } else {
      generateRandomMesh();
    }
  }, [generateRandomMesh]);

  useEffect(() => {
    localStorage.setItem('toolioz_color_hex', hex);
  }, [hex]);

  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem('toolioz_mesh_nodes', JSON.stringify(nodes));
    }
  }, [nodes]);

  const handleHexChange = (val: string) => {
    setHex(val);
    const validHex = /^#?([0-9A-F]{3}){1,2}$/i.test(val);
    setHexError(!validHex);
    if (validHex) updateFromHex(val);
  };

  const updateFromHex = (val: string) => {
    let cleanHex = val.replace("#", "");
    if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
    const newRgb = hexToRgb(cleanHex);
    if (newRgb) {
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
      setHex("#" + cleanHex.toUpperCase());
    }
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
    setHexError(false);
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const newRgb = hslToRgb(h, s, l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHexError(false);
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Mesh Logic
  const updateNode = (id: string, field: keyof MeshNode, value: number | string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };
  
  const addNode = () => {
    setNodes(prev => [...prev, { 
      id: Date.now().toString(), 
      hex: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), 
      x: 50, y: 50, spread: 50 
    }]);
  };
  
  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  // --- Accessibility Calcs ---
  // Background luminance determines whether white or black is naturally better
  const bgLuminance = getLuminance(rgb.r, rgb.g, rgb.b);
  const autoTextColorHex = bgLuminance > 0.179 ? '#000000' : '#FFFFFF';

  let currentTextHex = '#FFFFFF';
  if (textMode === 'auto') currentTextHex = autoTextColorHex;
  else if (textMode === 'white') currentTextHex = '#FFFFFF';
  else if (textMode === 'black') currentTextHex = '#000000';
  else if (textMode === 'custom') currentTextHex = /^#?([0-9A-F]{3}){1,2}$/i.test(customTextHex) ? customTextHex : '#FFFFFF';

  const textRgbObj = hexToRgb(currentTextHex) || { r: 255, g: 255, b: 255 };
  const currentContrast = getContrast(rgb, textRgbObj).toFixed(2);
  const passNormal = Number(currentContrast) >= 4.5;
  const passLarge = Number(currentContrast) >= 3.0;

  // --- UI Theme Tokens Engine ---
  const themeTokens = useMemo(() => {
    return [
      { name: 'Primary', hex: hex },
      { name: 'Secondary', hex: hslToHex(shiftHue(hsl.h, 30), hsl.s * 0.8, safeL(hsl.l - 10)) },
      { name: 'Accent', hex: hslToHex(shiftHue(hsl.h, 150), Math.min(hsl.s + 20, 100), hsl.l) }, // Triadic Pop
      { name: 'Surface', hex: hslToHex(hsl.h, hsl.s * 0.3, 95) }, // Off-white tint
      { name: 'Background (Dark)', hex: hslToHex(hsl.h, hsl.s * 0.4, 10) }, // Deep dark map
    ];
  }, [hex, hsl]);

  const TokenSwatch = ({ name, hx }: { name: string, hx: string }) => (
    <div className="flex flex-col gap-2.5">
      <span className="text-[0.9rem] font-bold uppercase tracking-[0.05em] text-[var(--text-secondary)]">{name}</span>
      <div 
        className="relative flex h-[80px] cursor-pointer items-end justify-between overflow-hidden rounded-[var(--radius-md)] border border-[rgba(255,255,255,0.1)] p-2.5 transition-all duration-200 hover:-translate-y-[2px]"
        style={{ backgroundColor: hx }}
        onClick={() => { updateFromHex(hx); copyToClipboard(hx, hx); }}
      >
        <span className="rounded-[var(--radius-sm)] bg-[rgba(0,0,0,0.5)] px-2 py-1 font-mono text-[0.8rem] text-white backdrop-blur-[4px]">{copiedFormat === hx ? 'Copied' : hx}</span>
      </div>
    </div>
  );

  const bgImageCss = nodes.map(n => `radial-gradient(at ${n.x}% ${n.y}%, ${n.hex} 0px, transparent ${n.spread}%)`).join(',\n');
  const fallbackColor = nodes[0]?.hex || hex;
  const currentMeshStyle = { backgroundImage: bgImageCss, backgroundColor: fallbackColor + '55' };
  const getMeshCSS = () => `background-image: ${bgImageCss.replace(/\n/g, ' ')};\nbackground-color: ${fallbackColor}55;`;

  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="mx-auto w-full max-w-[900px] flex-1 px-5 py-10">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-[2.5rem] font-extrabold text-[var(--text-primary)]">{title || 'Color Format Suite'}</h1>
          <p className="text-[1.1rem] leading-[1.6] text-[var(--text-secondary)]">
            Generate dynamic Web UI Themes, test Typographical Contrast legibility, and orchestrate Mesh Gradients seamlessly based on RGB, HEX or HSL input.
          </p>
        </header>

        {/* --- Visibility/Legibility Tester --- */}
        <section className="mb-8 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-[12px]">
          <div 
            className="relative flex min-h-[250px] flex-col items-center justify-center px-10 py-[60px] text-center transition-colors duration-300 ease-in-out" 
            style={{ backgroundColor: !hexError ? hex : '#374151' }}
          >
            <h2 className="mb-4 text-[2.5rem] font-extrabold transition-colors duration-300 ease-in-out" style={{ color: currentTextHex }}>
              Accessibility Canvas
            </h2>
            <p className="max-w-[600px] text-[1rem] font-normal leading-[1.6] transition-colors duration-300 ease-in-out" style={{ color: currentTextHex, opacity: 0.9 }}>
              This module simulates your typography resting on the generated background. Use this interface to organically detect reading friction before developers push code live to production environments.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[var(--border)] bg-[var(--bg-primary)] px-8 py-5">
            <div className="flex items-center gap-4">
              <span className="text-[0.9rem] font-semibold uppercase text-[var(--text-secondary)]">Text Mode:</span>
              <label className="flex cursor-pointer items-center gap-1.5 text-[0.95rem] text-[var(--text-primary)]">
                <input type="radio" checked={textMode === 'auto'} onChange={() => setTextMode('auto')} /> Auto
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-[0.95rem] text-[var(--text-primary)]">
                <input type="radio" checked={textMode === 'white'} onChange={() => setTextMode('white')} /> White
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-[0.95rem] text-[var(--text-primary)]">
                <input type="radio" checked={textMode === 'black'} onChange={() => setTextMode('black')} /> Black
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-[0.95rem] text-[var(--text-primary)]">
                <input type="radio" checked={textMode === 'custom'} onChange={() => setTextMode('custom')} /> Custom
                {textMode === 'custom' && (
                  <input type="text" className="w-[80px] border-none border-b border-[var(--text-secondary)] bg-transparent p-1 font-mono text-[0.9rem] text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:outline-none" value={customTextHex} onChange={e => setCustomTextHex(e.target.value)} maxLength={7} />
                )}
              </label>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[0.85rem] font-bold text-[var(--text-primary)]" title="Contrast Ratio Metric">
                Ratio: {currentContrast}
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[0.85rem] font-bold text-[var(--text-primary)]">
                Large Text: <span className={passLarge ? 'text-[#10b981]' : 'text-[#ef4444]'}>{passLarge ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[0.85rem] font-bold text-[var(--text-primary)]">
                Normal Text: <span className={passNormal ? 'text-[#10b981]' : 'text-[#ef4444]'}>{passNormal ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Primary Converters --- */}
        <section className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {/* HEX Card */}
          <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass)] p-6 backdrop-blur-[12px]">
            <div className="flex items-center justify-between"><h2 className="text-[1.1rem] font-bold text-[var(--text-primary)]">HEX</h2></div>
            <div className="flex overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)]">
              <input type="text" className="w-full flex-1 border-none bg-transparent p-3 px-4 font-mono text-[1rem] text-[var(--text-primary)] outline-none focus:outline-none" value={hex} onChange={(e) => handleHexChange(e.target.value)} maxLength={7} />
              <button className="flex cursor-pointer items-center justify-center border-l border-none border-l-[var(--border)] bg-[var(--bg-secondary)] px-4 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--primary)] hover:text-white" onClick={() => copyToClipboard(hex.toUpperCase(), 'hex')}>
                {copiedFormat === 'hex' ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
              </button>
            </div>
            {hexError && <div className="-mt-[5px] text-[0.85rem] font-medium text-[#ef4444]">Invalid HEX format</div>}
          </div>

          {/* RGB Card */}
          <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass)] p-6 backdrop-blur-[12px]">
            <div className="flex items-center justify-between"><h2 className="text-[1.1rem] font-bold text-[var(--text-primary)]">RGB</h2></div>
            <div className="flex overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)]">
              <input type="text" className="w-full flex-1 border-none bg-transparent p-3 px-4 font-mono text-[1rem] text-[var(--text-primary)] outline-none focus:outline-none" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly />
              <button className="flex cursor-pointer items-center justify-center border-l border-none border-l-[var(--border)] bg-[var(--bg-secondary)] px-4 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--primary)] hover:text-white" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}>
                {copiedFormat === 'rgb' ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2"><span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">R</span><input type="range" min="0" max="255" value={rgb.r} className="flex-1 accent-[var(--primary)]" onChange={(e) => handleRgbChange(Number(e.target.value), rgb.g, rgb.b)} /></div>
              <div className="flex items-center gap-2"><span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">G</span><input type="range" min="0" max="255" value={rgb.g} className="flex-1 accent-[var(--primary)]" onChange={(e) => handleRgbChange(rgb.r, Number(e.target.value), rgb.b)} /></div>
              <div className="flex items-center gap-2"><span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">B</span><input type="range" min="0" max="255" value={rgb.b} className="flex-1 accent-[var(--primary)]" onChange={(e) => handleRgbChange(rgb.r, rgb.g, Number(e.target.value))} /></div>
            </div>
          </div>

          {/* HSL Card */}
          <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass)] p-6 backdrop-blur-[12px]">
            <div className="flex items-center justify-between"><h2 className="text-[1.1rem] font-bold text-[var(--text-primary)]">HSL</h2></div>
            <div className="flex overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)]">
              <input type="text" className="w-full flex-1 border-none bg-transparent p-3 px-4 font-mono text-[1rem] text-[var(--text-primary)] outline-none focus:outline-none" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly />
              <button className="flex cursor-pointer items-center justify-center border-l border-none border-l-[var(--border)] bg-[var(--bg-secondary)] px-4 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--primary)] hover:text-white" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}>
                {copiedFormat === 'hsl' ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2"><span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">H</span><input type="range" min="0" max="360" value={hsl.h} className="flex-1 accent-[var(--primary)]" onChange={(e) => handleHslChange(Number(e.target.value), hsl.s, hsl.l)} /></div>
              <div className="flex items-center gap-2"><span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">S</span><input type="range" min="0" max="100" value={hsl.s} className="flex-1 accent-[var(--primary)]" onChange={(e) => handleHslChange(hsl.h, Number(e.target.value), hsl.l)} /></div>
              <div className="flex items-center gap-2"><span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">L</span><input type="range" min="0" max="100" value={hsl.l} className="flex-1 accent-[var(--primary)]" onChange={(e) => handleHslChange(hsl.h, hsl.s, Number(e.target.value))} /></div>
            </div>
          </div>
        </section>

        {/* --- Web UI Theme System --- */}
        <section className="mb-8 rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[var(--glass)] p-8 backdrop-blur-[12px]">
          <h2 className="mb-6 border-b border-[var(--border)] pb-2.5 text-[1.5rem] font-bold text-[var(--text-primary)]">Web UI Theme Generator</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
            {themeTokens.map(token => (
              <TokenSwatch key={token.name} name={token.name} hx={token.hex} />
            ))}
          </div>
        </section>

        {/* --- Gradient Mesh Generator --- */}
        <section className="mb-8 rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[var(--glass)] p-8 backdrop-blur-[12px]">
          <h2 className="mb-6 border-b border-[var(--border)] pb-2.5 text-[1.5rem] font-bold text-[var(--text-primary)]">Interactive Mesh Generator</h2>
          
          <div className="flex flex-col gap-5">
            <div className="h-[300px] w-full rounded-[var(--radius-lg)] border border-[var(--border)] transition-colors duration-200" style={currentMeshStyle} />
            
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-primary)] p-5">
              {nodes.map((node, i) => (
                <div key={node.id} className="flex flex-col gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.85rem] font-semibold uppercase text-[var(--text-secondary)]">Node {i + 1}</span>
                    <input type="color" value={node.hex} onChange={(e) => updateNode(node.id, 'hex', e.target.value)} className="h-[30px] w-[30px] cursor-pointer border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[4px] [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-[var(--border)]" />
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">X%</span>
                      <input type="range" min="0" max="100" value={node.x} onChange={(e)=>updateNode(node.id, 'x', Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">Y%</span>
                      <input type="range" min="0" max="100" value={node.y} onChange={(e)=>updateNode(node.id, 'y', Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-[20px] text-[0.8rem] font-semibold text-[var(--text-secondary)]">Blur</span>
                      <input type="range" min="10" max="100" value={node.spread} onChange={(e)=>updateNode(node.id, 'spread', Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
                    </div>
                  </div>
                  {nodes.length > 2 && (
                    <button className="mt-[10px] flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-2.5 font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white" onClick={() => removeNode(node.id)}>
                      <X size={14} /> Remove Node
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-5">
              <div className="flex flex-wrap gap-2.5">
                <button className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-2.5 font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white" onClick={addNode}>
                  <Plus size={16} /> Add Node
                </button>
                <button className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-2.5 font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white" onClick={generateRandomMesh}>
                  <RefreshCw size={16} /> Randomize Seeds
                </button>
              </div>

              <button className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border-none bg-[var(--primary)] px-5 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-[var(--primary-hover)]" onClick={() => copyToClipboard(getMeshCSS(), 'mesh')}>
                {copiedFormat === 'mesh' ? <Check size={16} /> : <Copy size={16} />}
                {copiedFormat === 'mesh' ? 'CSS Config Copied!' : 'Export Object CSS'}
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
