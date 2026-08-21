'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { Footer } from '@/components/layout/Footer';
import {
  Download,
  Palette,
  LayoutGrid,
  Crop,
  Layers,
  Type,
  Image as ImageIcon,
  Sliders,
  Plus,
  X,
  Sparkles,
  Move,
  ChevronDown,
  Shuffle,
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface BackgroundGeneratorClientProps {
  title: string;
  color: string;
}

// Aspect Ratios matching liinks.co / Paper Shaders
interface AspectRatioOption {
  id: string;
  label: string;
  width: number;
  height: number;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '9-16', label: 'Vertical 9:16', width: 1080, height: 1920 },
  { id: '3-4', label: 'Tall 3:4', width: 1080, height: 1440 },
  { id: '4-5', label: 'Portrait 4:5', width: 1080, height: 1350 },
  { id: '1-1', label: 'Square 1:1', width: 1080, height: 1080 },
  { id: '4-3', label: 'Classic 4:3', width: 1440, height: 1080 },
  { id: '16-9', label: 'Wide 16:9', width: 1920, height: 1080 },
  { id: '3-1', label: 'Banner 3:1', width: 1500, height: 500 }
];

// Presets matching screenshot
interface ColorPreset {
  name: string;
  colors: string[];
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Sunset', colors: ['#FF6A3D', '#FFB347', '#C13584', '#2A0845'] },
  { name: 'Mint', colors: ['#064e3b', '#10b981', '#6ee7b7', '#022c22'] },
  { name: 'Nebula', colors: ['#1e1b4b', '#6366f1', '#a855f7', '#ec4899'] },
  { name: 'Ember', colors: ['#450a0a', '#dc2626', '#f97316', '#fde047'] },
  { name: 'Lagoon', colors: ['#083344', '#06b6d4', '#3b82f6', '#1e1b4b'] },
  { name: 'Dune', colors: ['#78350f', '#d97706', '#f59e0b', '#fef3c7'] }
];

// Shaders matching screenshot
interface ShaderOption {
  id: string;
  name: string;
  desc: string;
}

const SHADERS: ShaderOption[] = [
  { id: 'mesh-gradient', name: 'Mesh Gradient', desc: 'Flowing organic color blobs, the classic animated gradient.' },
  { id: 'warp', name: 'Warp', desc: 'Distorted fluid domain warping with smooth liquid motion.' },
  { id: 'neuro-noise', name: 'Neuro Noise', desc: 'Synaptic neural network pathways with glowing electrical tendrils.' },
  { id: 'swirl', name: 'Swirl', desc: 'Interactive spiral vortex with multi-color turbulence.' },
  { id: 'voronoi', name: 'Voronoi', desc: 'Cellular Voronoi distance mosaic simulating fluid caustics.' },
  { id: 'metaballs', name: 'Metaballs', desc: 'Merging liquid metaball blobs with smooth surface tension.' }
];

// Free Google Fonts
const GOOGLE_FONTS = [
  { id: 'Inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'Roboto', name: 'Roboto', family: "'Roboto', sans-serif" },
  { id: 'Playfair Display', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'Outfit', name: 'Outfit', family: "'Outfit', sans-serif" },
  { id: 'Montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'Oswald', name: 'Oswald', family: "'Oswald', sans-serif" },
  { id: 'Lora', name: 'Lora', family: "'Lora', serif" },
  { id: 'Pacifico', name: 'Pacifico', family: "'Pacifico', cursive" },
  { id: 'Fira Code', name: 'Fira Code', family: "'Fira Code', monospace" },
  { id: 'Poppins', name: 'Poppins', family: "'Poppins', sans-serif" },
  { id: 'Merriweather', name: 'Merriweather', family: "'Merriweather', serif" },
  { id: 'Space Grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
  { id: 'Dancing Script', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'Cinzel', name: 'Cinzel', family: "'Cinzel', serif" },
  { id: 'Bebas Neue', name: 'Bebas Neue', family: "'Bebas Neue', sans-serif" },
  { id: 'Anton', name: 'Anton', family: "'Anton', sans-serif" },
  { id: 'Josefin Sans', name: 'Josefin Sans', family: "'Josefin Sans', sans-serif" },
  { id: 'Quicksand', name: 'Quicksand', family: "'Quicksand', sans-serif" },
  { id: 'Nunito', name: 'Nunito', family: "'Nunito', sans-serif" },
  { id: 'Teko', name: 'Teko', family: "'Teko', sans-serif" }
];

const FONT_STYLES = [
  { id: 'bold', name: 'Bold', weight: 'bold', style: 'normal' },
  { id: 'normal', name: 'Regular', weight: 'normal', style: 'normal' },
  { id: 'italic', name: 'Italic', weight: 'normal', style: 'italic' },
  { id: 'bold-italic', name: 'Bold Italic', weight: 'bold', style: 'italic' }
];

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return [0.5, 0.5, 0.5];
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
}

export default function BackgroundGeneratorClient({ title, color }: BackgroundGeneratorClientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  // Active Pointer Dragging State for Canvas Overlay Movement
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragTarget, setDragTarget] = useState<'text' | 'image' | null>(null);

  // State matching Paper Shaders & screenshot
  const [selectedShaderId, setSelectedShaderId] = useState<string>('mesh-gradient');
  const [selectedRatioId, setSelectedRatioId] = useState<string>('9-16');
  const [selectedPresetName, setSelectedPresetName] = useState<string>('Sunset');

  // Variation Slider State (0% to 100%, default 45%)
  const [variation, setVariation] = useState<number>(45);

  // Color Swatch List State
  const [colors, setColors] = useState<string[]>(['#FF6A3D', '#FFB347', '#C13584', '#2A0845']);

  // Controls State
  const [distortion, setDistortion] = useState<number>(0.75);
  const [swirl, setSwirl] = useState<number>(0.40);
  const [scale, setScale] = useState<number>(1.0);
  const [noise, setNoise] = useState<number>(0.015);

  // Streamlined Text Overlay State
  const [enableText, setEnableText] = useState<boolean>(false);
  const [headingText, setHeadingText] = useState<string>('Create Something Great');
  const [selectedFont, setSelectedFont] = useState<string>('Inter');
  const [selectedFontStyle, setSelectedFontStyle] = useState<string>('bold');
  const [textSize, setTextSize] = useState<number>(60);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [textRotation, setTextRotation] = useState<number>(0);
  const [textShadowBlur, setTextShadowBlur] = useState<number>(15);
  const [textShadowColor, setTextShadowColor] = useState<string>('#000000');
  const [textStrokeWidth, setTextStrokeWidth] = useState<number>(0);
  const [textStrokeColor, setTextStrokeColor] = useState<string>('#000000');

  const [enableImage, setEnableImage] = useState<boolean>(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedImageObj, setUploadedImageObj] = useState<HTMLImageElement | null>(null);
  const [imageScaleState, setImageScale] = useState<number>(0.3);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [imageOpacity, setImageOpacity] = useState<number>(1.0);
  const [imageBorderRadius, setImageBorderRadius] = useState<number>(16);

  // Positions via Refs for buttery smooth dragging (No React re-renders!)
  const textPosRef = useRef({ x: 50, y: 50 });
  const imagePosRef = useRef({ x: 50, y: 50 });

  // Dynamically load Google Fonts stylesheet
  useEffect(() => {
    const linkId = 'google-fonts-background-generator';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Cinzel:wght@400;700&family=Dancing+Script:wght@400;700&family=Fira+Code:wght@400;700&family=Inter:wght@400;700&family=Josefin+Sans:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;700;900&family=Nunito:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;700&family=Outfit:wght@400;700;900&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@400;700;900&family=Quicksand:wght@400;700&family=Roboto:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;700&family=Teko:wght@400;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Currently active objects
  const activeShader = useMemo(() => {
    return SHADERS.find((s) => s.id === selectedShaderId) || SHADERS[0];
  }, [selectedShaderId]);

  const activeRatio = useMemo(() => {
    return ASPECT_RATIOS.find((r) => r.id === selectedRatioId) || ASPECT_RATIOS[0];
  }, [selectedRatioId]);

  const activeFontObj = useMemo(() => {
    return GOOGLE_FONTS.find((f) => f.id === selectedFont) || GOOGLE_FONTS[0];
  }, [selectedFont]);

  const activeStyleObj = useMemo(() => {
    return FONT_STYLES.find((s) => s.id === selectedFontStyle) || FONT_STYLES[0];
  }, [selectedFontStyle]);

  // Color List Handlers
  const handleColorChange = (index: number, newHex: string) => {
    const next = [...colors];
    next[index] = newHex;
    setColors(next);
  };

  const handleAddColor = () => {
    if (colors.length >= 5) return;
    const defaultNewColors = ['#ff758c', '#ff7eb3', '#7f00ff', '#e0c3fc'];
    const newColor = defaultNewColors[colors.length % defaultNewColors.length];
    setColors([...colors, newColor]);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const applyPreset = (preset: ColorPreset) => {
    setSelectedPresetName(preset.name);
    setColors([...preset.colors]);
  };

  const handleRandomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const count = 3 + Math.floor(Math.random() * 2); // 3 or 4 colors
    const newColors = Array.from({ length: count }, randomHex);
    setColors(newColors);
    setSelectedPresetName('');
    setVariation(Math.floor(Math.random() * 100));
    setDistortion(+(Math.random() * 0.8 + 0.1).toFixed(2));
    setSwirl(+(Math.random() * 0.8 + 0.1).toFixed(2));
  };

  const handleResetControls = () => {
    setDistortion(0.75);
    setSwirl(0.40);
    setScale(1.0);
    setNoise(0.015);
    setVariation(45);
  };

  // Upload custom logo / image overlay
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        setUploadedImageObj(img);
        setUploadedImageSrc(dataUrl);
        setEnableImage(true);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Smooth Pointer Dragging Handler directly on Canvas (Works on Desktop Mouse & Mobile Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (enableImage && enableText) {
      const distImg = Math.hypot(clickX - imagePosRef.current.x, clickY - imagePosRef.current.y);
      const distTxt = Math.hypot(clickX - textPosRef.current.x, clickY - textPosRef.current.y);
      setIsDragging(true);
      if (distImg < distTxt) {
        setDragTarget('image');
        imagePosRef.current.x = clickX;
        imagePosRef.current.y = clickY;
      } else {
        setDragTarget('text');
        textPosRef.current.x = clickX;
        textPosRef.current.y = clickY;
      }
    } else if (enableImage) {
      setIsDragging(true);
      setDragTarget('image');
      imagePosRef.current.x = clickX;
      imagePosRef.current.y = clickY;
    } else if (enableText) {
      setIsDragging(true);
      setDragTarget('text');
      textPosRef.current.x = clickX;
      textPosRef.current.y = clickY;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragTarget) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const currentY = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

    if (dragTarget === 'text') {
      textPosRef.current.x = currentX;
      textPosRef.current.y = currentY;
    } else if (dragTarget === 'image') {
      imagePosRef.current.x = currentX;
      imagePosRef.current.y = currentY;
    }

    // Manually trigger composite to avoid React re-render overhead!
    renderCompositeCanvasRef.current?.();
  };

  // We need a ref to the latest composite function so pointer events can call it directly
  const renderCompositeCanvasRef = useRef<(() => void) | null>(null);

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { }
    }
    setIsDragging(false);
    setDragTarget(null);
  };

  // Render WebGL Background (Isolated from Text Dragging)
  const renderWebGLBackground = useCallback(() => {
    const webglCanvas = webglCanvasRef.current;
    const gl = glRef.current;
    const program = programRef.current;

    if (!webglCanvas || !gl || !program) return;

    const w = activeRatio.width;
    const h = activeRatio.height;

    if (webglCanvas.width !== w || webglCanvas.height !== h) {
      webglCanvas.width = w;
      webglCanvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.useProgram(program);
    gl.uniform2f(gl.getUniformLocation(program, 'iResolution'), w, h);
    gl.uniform1f(gl.getUniformLocation(program, 'uVariation'), variation / 100.0);
    gl.uniform1f(gl.getUniformLocation(program, 'uDistortion'), distortion);
    gl.uniform1f(gl.getUniformLocation(program, 'uSwirl'), swirl);
    gl.uniform1f(gl.getUniformLocation(program, 'uScale'), scale);
    gl.uniform1f(gl.getUniformLocation(program, 'uNoise'), noise);

    const colorCount = Math.min(colors.length, 5);
    gl.uniform1i(gl.getUniformLocation(program, 'uColorCount'), colorCount);
    for (let i = 0; i < colorCount; i++) {
      const [r, g, b] = hexToRgb(colors[i]);
      const loc = gl.getUniformLocation(program, `uColors[${i}]`);
      if (loc) gl.uniform3f(loc, r, g, b);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [
    activeRatio,
    variation,
    distortion,
    swirl,
    scale,
    noise,
    colors
  ]);

  // Render combined Canvas (WebGL + Overlays)
  const renderCompositeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const webglCanvas = webglCanvasRef.current;

    if (!canvas || !webglCanvas) return;

    const w = activeRatio.width;
    const h = activeRatio.height;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(webglCanvas, 0, 0);

    // Render Image / Logo Overlay
    if (enableImage && uploadedImageObj) {
      ctx.save();
      const posX = (imagePosRef.current.x / 100) * w;
      const posY = (imagePosRef.current.y / 100) * h;
      const imgW = w * imageScaleState;
      const imgH = (uploadedImageObj.height / uploadedImageObj.width) * imgW;

      ctx.translate(posX, posY);
      if (imageRotation !== 0) {
        ctx.rotate((imageRotation * Math.PI) / 180);
      }
      ctx.globalAlpha = imageOpacity;

      if (imageBorderRadius > 0) {
        ctx.beginPath();
        const r = Math.min(imageBorderRadius * (w / 1000), imgW / 2, imgH / 2);
        ctx.roundRect(-imgW / 2, -imgH / 2, imgW, imgH, r);
        ctx.clip();
      }

      ctx.drawImage(uploadedImageObj, -imgW / 2, -imgH / 2, imgW, imgH);
      ctx.restore();
    }

    // Render Single Text Overlay
    if (enableText && headingText) {
      ctx.save();
      const posX = (textPosRef.current.x / 100) * w;
      const posY = (textPosRef.current.y / 100) * h;
      const fontScale = w / 1000;
      const scaledSize = Math.round(textSize * fontScale);

      ctx.translate(posX, posY);
      if (textRotation !== 0) {
        ctx.rotate((textRotation * Math.PI) / 180);
      }

      const fontStyleStr = activeStyleObj.style === 'italic' ? 'italic ' : '';
      const fontWeightStr = activeStyleObj.weight === 'bold' ? 'bold ' : '';
      ctx.font = `${fontStyleStr}${fontWeightStr}${scaledSize}px ${activeFontObj.family}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (textShadowBlur > 0) {
        ctx.shadowColor = textShadowColor;
        ctx.shadowBlur = textShadowBlur * fontScale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4 * fontScale;
      }

      if (textStrokeWidth > 0) {
        ctx.strokeStyle = textStrokeColor;
        ctx.lineWidth = textStrokeWidth * fontScale;
        ctx.strokeText(headingText, 0, 0);
      }

      ctx.fillStyle = textColor;
      ctx.fillText(headingText, 0, 0);
      ctx.restore();
    }
  }, [
    activeRatio,
    enableImage,
    uploadedImageObj,
    imageScaleState,
    imageRotation,
    imageOpacity,
    imageBorderRadius,
    enableText,
    headingText,
    textSize,
    activeFontObj,
    activeStyleObj,
    textColor,
    textRotation,
    textShadowBlur,
    textShadowColor,
    textStrokeWidth,
    textStrokeColor
  ]);

  // Compile WebGL Fragment Shader Engine — Restored Inward Circle Blending + Anti-Banding Dithering
  useEffect(() => {
    let canvas = webglCanvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      webglCanvasRef.current = canvas;
    }

    let gl = canvas.getContext('webgl2') as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) {
      gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    }
    if (!gl) return;
    glRef.current = gl;

    const vsSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    let shaderBody = '';

    if (activeShader.id === 'mesh-gradient') {
      shaderBody = `
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * uScale;

          float r = length(p);
          float a = atan(p.y, p.x) + uSwirl * exp(-r * 2.5) * 6.28318;
          vec2 warpedUV = vec2(0.5) + vec2(cos(a), sin(a)) * r;
          warpedUV += vec2(sin(uv.y * 6.0 + uVariation * 6.28318), cos(uv.x * 6.0 + uVariation * 6.28318)) * uDistortion * 0.12;

          float angle = uVariation * 6.2831853;
          vec2 c0 = vec2(0.5 + 0.28 * cos(angle), 0.5 + 0.28 * sin(angle));
          vec2 c1 = vec2(0.5 + 0.32 * cos(angle + 2.09439), 0.5 + 0.32 * sin(angle + 2.09439));
          vec2 c2 = vec2(0.5 + 0.25 * cos(angle + 4.18879), 0.5 + 0.25 * sin(angle + 4.18879));
          vec2 c3 = vec2(0.5 + 0.30 * cos(angle + 1.04719), 0.5 + 0.30 * sin(angle + 1.04719));

          float w0 = 1.0 / (dot(warpedUV - c0, warpedUV - c0) * 8.0 * uScale + 0.04);
          float w1 = 1.0 / (dot(warpedUV - c1, warpedUV - c1) * 8.0 * uScale + 0.04);
          float w2 = 1.0 / (dot(warpedUV - c2, warpedUV - c2) * 8.0 * uScale + 0.04);
          float w3 = 1.0 / (dot(warpedUV - c3, warpedUV - c3) * 8.0 * uScale + 0.04);

          vec3 baseCol = uColors[0];
          if (uColorCount == 2) {
              baseCol = (uColors[0]*w0 + uColors[1]*w1) / (w0 + w1);
          } else if (uColorCount == 3) {
              baseCol = (uColors[0]*w0 + uColors[1]*w1 + uColors[2]*w2) / (w0 + w1 + w2);
          } else {
              baseCol = (uColors[0]*w0 + uColors[1]*w1 + uColors[2]*w2 + uColors[3]*w3) / (w0 + w1 + w2 + w3);
          }
          col = baseCol;
      `;
    } else if (activeShader.id === 'warp') {
      shaderBody = `
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * uScale * 5.0;
          float t = uVariation * 6.28318;
          
          vec2 q = vec2(
            sin(p.x + t) + cos(p.y * uDistortion),
            cos(p.y + t) + sin(p.x * uDistortion)
          );
          
          vec2 r = vec2(
            sin(q.x + t * 1.5 + uSwirl * 3.0) + cos(q.y),
            cos(q.y + t * 1.2 + uSwirl * 3.0) + sin(q.x)
          );
          
          float f = length(p + r * 1.5);
          
          vec3 baseCol = uColors[0];
          if (uColorCount > 1) baseCol = mix(uColors[0], uColors[1], smoothstep(0.0, 1.0, sin(r.x * 2.0) * 0.5 + 0.5));
          if (uColorCount > 2) baseCol = mix(baseCol, uColors[2], smoothstep(0.0, 1.0, sin(r.y * 2.0) * 0.5 + 0.5));
          if (uColorCount > 3) baseCol = mix(baseCol, uColors[3], smoothstep(0.0, 1.0, sin(f * 2.0) * 0.5 + 0.5));
          col = baseCol;
      `;
    } else if (activeShader.id === 'swirl') {
      shaderBody = `
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * uScale * 3.0;
          
          float r = length(p);
          float angle = atan(p.y, p.x);
          
          // Swirl effect
          angle += r * (uSwirl * 10.0) - uVariation * 6.28318;
          
          // Distortion adds waves to the spiral rings
          r += sin(angle * 5.0) * (uDistortion * 0.2);
          
          float spiral = sin(angle * 3.0 + r * 10.0);
          
          vec3 baseCol = uColors[0];
          if (uColorCount > 1) baseCol = mix(uColors[0], uColors[1], smoothstep(-1.0, 1.0, spiral));
          if (uColorCount > 2) baseCol = mix(baseCol, uColors[2], smoothstep(-1.0, 1.0, sin(r * 15.0 - uVariation * 6.28)));
          if (uColorCount > 3) baseCol = mix(baseCol, uColors[3], smoothstep(-1.0, 1.0, cos(angle * 2.0)));
          col = baseCol;
      `;
    } else if (activeShader.id === 'metaballs') {
      shaderBody = `
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * uScale;
          float t = uVariation * 6.28318;
          
          // Generating moving metaballs
          float sum = 0.0;
          vec3 baseCol = vec3(0.0);
          float totalW = 0.0;
          
          for(int i=0; i<4; i++) {
              if (i >= uColorCount) break;
              float fi = float(i);
              vec2 pos = vec2(
                  sin(t + fi * 1.5) * 0.4 * uSwirl,
                  cos(t * 1.2 + fi * 2.1) * 0.4 * uSwirl
              );
              
              // Distortion makes balls wobble
              pos.x += sin(uv.y * 10.0 + t) * (uDistortion * 0.1);
              pos.y += cos(uv.x * 10.0 + t) * (uDistortion * 0.1);
              
              float d = length(p - pos);
              float w = 0.05 / (d * d + 0.01);
              
              sum += w;
              baseCol += uColors[i] * w;
              totalW += w;
          }
          
          if (totalW > 0.0) {
              baseCol /= totalW;
          }
          
          // Thresholding for metaball surface tension
          if (sum > 2.0) {
              col = baseCol;
          } else {
              col = uColors[0]; 
              // Soft blend edge
              col = mix(uColors[0], baseCol, smoothstep(1.5, 2.0, sum));
          }
      `;
    } else if (activeShader.id === 'voronoi') {
      shaderBody = `
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * uScale * 10.0;
          float t = uVariation * 6.28318;
          
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          
          float minDist = 1.0;
          vec2 closestPoint;
          
          for (int y = -1; y <= 1; y++) {
              for (int x = -1; x <= 1; x++) {
                  vec2 neighbor = vec2(float(x), float(y));
                  vec2 point = vec2(
                      hash(ip + neighbor + vec2(0.0)),
                      hash(ip + neighbor + vec2(1.0))
                  );
                  
                  // Animate the points
                  point = 0.5 + 0.5 * sin(t + 6.2831 * point + uSwirl * 5.0);
                  
                  vec2 diff = neighbor + point - fp;
                  // Distortion adds noise to the distance calculation
                  diff += sin(uv.yx * 20.0) * (uDistortion * 0.1);
                  
                  float dist = length(diff);
                  
                  if (dist < minDist) {
                      minDist = dist;
                      closestPoint = point;
                  }
              }
          }
          
          vec3 baseCol = uColors[0];
          if (uColorCount > 1) baseCol = mix(uColors[0], uColors[1], closestPoint.x);
          if (uColorCount > 2) baseCol = mix(baseCol, uColors[2], closestPoint.y);
          if (uColorCount > 3) baseCol = mix(baseCol, uColors[3], minDist);
          
          col = baseCol;
      `;
    } else if (activeShader.id === 'neuro-noise') {
      shaderBody = `
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 p = (uv - 0.5) * uScale * 5.0;
          float t = uVariation * 6.28318;
          
          float f = 0.0;
          vec2 q = p;
          
          // Fractal Brownian Motion (FBM)
          float amp = 0.5;
          for (int i = 0; i < 4; i++) {
              q = vec2(
                  cos(t*0.5 + q.y * (1.0 + uDistortion)) + sin(q.x),
                  sin(t*0.5 + q.x * (1.0 + uDistortion)) + cos(q.y)
              );
              f += amp * abs(sin(q.x * q.y * uSwirl * 2.0));
              amp *= 0.5;
              q *= 2.0;
          }
          
          // Electrical glowing tendrils
          float glow = 0.05 / (abs(f - 0.5) + 0.01);
          
          vec3 baseCol = uColors[0];
          if (uColorCount > 1) baseCol = mix(uColors[0], uColors[1], smoothstep(0.0, 1.0, glow * 0.5));
          if (uColorCount > 2) baseCol = mix(baseCol, uColors[2], smoothstep(0.5, 1.5, glow));
          
          col = baseCol * glow;
      `;
    }

    const fsSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float uVariation;
      uniform float uDistortion;
      uniform float uSwirl;
      uniform float uScale;
      uniform float uNoise;
      uniform vec3 uColors[5];
      uniform int uColorCount;

      float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
          vec3 col = vec3(0.0);
          ${shaderBody}

          float dither = (hash(gl_FragCoord.xy + uVariation * 100.0) - 0.5) / 255.0;
          col += vec3(dither);

          if (uNoise > 0.001) {
              float g = (hash(gl_FragCoord.xy + uVariation) - 0.5) * uNoise;
              col += vec3(g);
          }

          gl_FragColor = vec4(col, 1.0);
      }
    `;

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    programRef.current = program;
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Trigger instant WebGL and composite canvas render immediately after shader compilation
    renderWebGLBackground();
    renderCompositeCanvas();
  }, [activeShader, renderWebGLBackground, renderCompositeCanvas]);

  // Keep a fresh reference for the pointer move event
  useEffect(() => {
    renderCompositeCanvasRef.current = renderCompositeCanvas;
  }, [renderCompositeCanvas]);

  useEffect(() => {
    renderWebGLBackground();
    renderCompositeCanvas();
  }, [renderWebGLBackground, renderCompositeCanvas]);

  // Download High-Res PNG
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `wallpaper-${selectedShaderId}-${activeRatio.id}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Design Studio', url: '/design' },
          { name: 'Shader Background Generator', url: '/devtools/background-generator' },
        ]}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 py-1 px-3 text-[10px] font-bold uppercase tracking-wider text-purple-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Paper Shader Wallpaper Creator</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Background <span className="text-purple-600">Generator</span>
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Design high-res shader wallpapers, lockscreens &amp; backdrops. Add text, logos, and download 4K PNGs.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-purple-300 transition-all shadow-sm"
            >
              <Shuffle className="h-3.5 w-3.5 text-purple-600" />
              Randomize
            </button>
            <Button
              onClick={handleDownloadPNG}
              size="sm"
              className="!px-5 !py-2.5 border border-blue-600 bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md rounded-xl"
            >
              <Download className="mr-1.5 h-4 w-4" /> Download PNG
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 sm:px-6 lg:px-8 py-8">

        {/* 2-Column Split-Screen Dashboard Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">

          {/* LEFT COLUMN: STICKY PREVIEW CONTAINER + ALL OVERLAY CONTROLS DIRECTLY BELOW PREVIEW! */}
          <div className="lg:col-span-6 sticky top-6 flex flex-col gap-3 z-10">

            {/* Canvas Preview Container */}
            <div className="relative flex items-center justify-center rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-6 min-h-[400px] sm:min-h-[460px] shadow-sm overflow-hidden select-none">
              <div
                className={`relative overflow-hidden rounded-xl shadow-xl transition-all duration-300 border border-slate-200/80 bg-black ${enableText || enableImage ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
                  }`}
                style={{
                  aspectRatio: `${activeRatio.width} / ${activeRatio.height}`,
                  maxHeight: '400px',
                  maxWidth: '100%',
                  width: 'auto'
                }}
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="h-full w-full object-contain touch-none"
                />
              </div>

              {/* Resolution Badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200/80 flex items-center gap-1 shadow-sm">
                <Maximize2 className="h-3 w-3 text-purple-600" />
                <span>{activeRatio.width}×{activeRatio.height}</span>
              </div>

              {(enableText || enableImage) && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                  <Move className="h-3 w-3 text-purple-400" />
                  <span>Drag to move overlays</span>
                </div>
              )}
            </div>

            {/* VARIATION SLIDER — Compact inline */}
            <Card className="border border-slate-200/90 bg-white px-4 py-3 shadow-sm rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-xs shrink-0">Variation</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={variation}
                  onChange={(e) => setVariation(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 h-1.5 cursor-pointer"
                />
                <span className="font-mono font-bold text-[11px] text-purple-600 w-10 text-right">
                  {variation}%
                </span>
              </div>
            </Card>

            {/* OVERLAY TOOLBAR CARD — ALL GOOGLE FONTS & OVERLAY CONTROLS PLACED DIRECTLY BELOW PREVIEW! */}
            <Card className="border border-slate-200/90 bg-white p-4 shadow-sm rounded-2xl space-y-3.5">

              {/* Quick Action Toggle Buttons */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <button
                  onClick={() => setEnableText(!enableText)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${enableText ? 'bg-purple-600 text-white shadow-sm' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Type className="h-3.5 w-3.5" />
                  <span>{enableText ? 'Text Enabled' : '+ Add Text'}</span>
                </button>

                <label className="flex-1 cursor-pointer">
                  <div className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${enableImage ? 'bg-purple-600 text-white shadow-sm' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}>
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>{uploadedImageSrc ? 'Change Logo' : '+ Add Logo'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Text Input & Formatting Controls */}
              {enableText && (
                <div className="space-y-3 pt-1">
                  <div>
                    <input
                      type="text"
                      placeholder="Type your text here..."
                      value={headingText}
                      onChange={(e) => setHeadingText(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block mb-1 font-bold text-slate-700">Google Font</span>
                      <div className="relative">
                        <select
                          value={selectedFont}
                          onChange={(e) => setSelectedFont(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-2 font-semibold text-slate-800 focus:outline-none focus:border-purple-400"
                          style={{ fontFamily: activeFontObj.family }}
                        >
                          {GOOGLE_FONTS.map(f => <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>{f.name}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="block mb-1 font-bold text-slate-700">Font Style</span>
                      <div className="relative">
                        <select
                          value={selectedFontStyle}
                          onChange={(e) => setSelectedFontStyle(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-2 font-semibold text-slate-800 focus:outline-none focus:border-purple-400"
                        >
                          {FONT_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs items-center">
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-700">
                        <span>Font Size</span>
                        <span className="font-mono text-purple-600">{textSize}px</span>
                      </div>
                      <input type="range" min="20" max="200" step="2" value={textSize} onChange={(e) => setTextSize(parseInt(e.target.value, 10))} className="w-full accent-purple-600 h-2" />
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-700">
                        <span>Rotation</span>
                        <span className="font-mono text-purple-600">{textRotation}°</span>
                      </div>
                      <input type="range" min="-180" max="180" step="1" value={textRotation} onChange={(e) => setTextRotation(parseInt(e.target.value, 10))} className="w-full accent-purple-600 h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-700">
                        <span>Shadow Blur</span>
                        <span className="font-mono text-purple-600">{textShadowBlur}</span>
                      </div>
                      <input type="range" min="0" max="50" step="1" value={textShadowBlur} onChange={(e) => setTextShadowBlur(parseInt(e.target.value, 10))} className="w-full accent-purple-600 h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-700">
                        <span>Outline (Stroke)</span>
                        <span className="font-mono text-purple-600">{textStrokeWidth}</span>
                      </div>
                      <input type="range" min="0" max="30" step="1" value={textStrokeWidth} onChange={(e) => setTextStrokeWidth(parseInt(e.target.value, 10))} className="w-full accent-purple-600 h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="block mb-1 font-bold text-slate-700">Text Color</span>
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-full cursor-pointer rounded-xl border border-slate-200 bg-transparent p-0.5" />
                    </div>
                    <div>
                      <span className="block mb-1 font-bold text-slate-700">Shadow Color</span>
                      <input type="color" value={textShadowColor} onChange={(e) => setTextShadowColor(e.target.value)} className="h-8 w-full cursor-pointer rounded-xl border border-slate-200 bg-transparent p-0.5" />
                    </div>
                    <div>
                      <span className="block mb-1 font-bold text-slate-700">Outline Color</span>
                      <input type="color" value={textStrokeColor} onChange={(e) => setTextStrokeColor(e.target.value)} className="h-8 w-full cursor-pointer rounded-xl border border-slate-200 bg-transparent p-0.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Logo / Image Controls if Image enabled */}
              {enableImage && uploadedImageSrc && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-600">
                    <span>Uploaded Logo Controls</span>
                    <button onClick={() => { setUploadedImageObj(null); setUploadedImageSrc(null); setEnableImage(false); }} className="text-red-500 hover:underline text-[0.7rem]">
                      Remove Logo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-600">
                        <span>Logo Size</span>
                        <span className="font-mono text-purple-600">{Math.round(imageScaleState * 100)}%</span>
                      </div>
                      <input type="range" min="0.05" max="1.5" step="0.05" value={imageScaleState} onChange={(e) => setImageScale(parseFloat(e.target.value))} className="w-full accent-purple-600 h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-600">
                        <span>Opacity</span>
                        <span className="font-mono text-purple-600">{Math.round(imageOpacity * 100)}%</span>
                      </div>
                      <input type="range" min="0.1" max="1.0" step="0.05" value={imageOpacity} onChange={(e) => setImageOpacity(parseFloat(e.target.value))} className="w-full accent-purple-600 h-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-600">
                        <span>Corner Radius</span>
                        <span className="font-mono text-purple-600">{imageBorderRadius}px</span>
                      </div>
                      <input type="range" min="0" max="150" step="1" value={imageBorderRadius} onChange={(e) => setImageBorderRadius(parseInt(e.target.value, 10))} className="w-full accent-purple-600 h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between font-bold text-slate-600">
                        <span>Rotation</span>
                        <span className="font-mono text-purple-600">{imageRotation}°</span>
                      </div>
                      <input type="range" min="-180" max="180" step="1" value={imageRotation} onChange={(e) => setImageRotation(parseInt(e.target.value, 10))} className="w-full accent-purple-600 h-2" />
                    </div>
                  </div>
                </div>
              )}
            </Card>

          </div>

          {/* RIGHT COLUMN: Bento Control Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-fit">

            {/* Bento 1: Shaders */}
            <Card className="col-span-2 border border-slate-200/90 bg-white p-4 shadow-sm rounded-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <LayoutGrid className="h-4 w-4 text-purple-600" />
                  <span>Shader Engine</span>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                  By Toolioz
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SHADERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShaderId(s.id)}
                    className={`rounded-xl py-2 px-1 text-[11px] font-bold text-center transition-all ${selectedShaderId === s.id
                        ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:scale-[1.02]'
                      }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </Card>

            {/* Bento 2: Aspect Ratio */}
            <Card className="col-span-1 border border-slate-200/90 bg-white p-4 shadow-sm rounded-2xl">
              <div className="mb-2 flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Crop className="h-4 w-4 text-purple-600" />
                <span>Aspect Ratio</span>
              </div>
              <select
                value={selectedRatioId}
                onChange={(e) => setSelectedRatioId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {ASPECT_RATIOS.map((r) => (
                  <option key={r.id} value={r.id}>{r.label} ({r.width}x{r.height})</option>
                ))}
              </select>
            </Card>

            {/* Bento 3: Presets */}
            <Card className="col-span-1 border border-slate-200/90 bg-white p-4 shadow-sm rounded-2xl">
              <div className="mb-2 flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Layers className="h-4 w-4 text-purple-600" />
                <span>Theme</span>
              </div>
              <div className="space-y-1.5">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-all ${
                      selectedPresetName === p.name
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex -space-x-1">
                      {p.colors.slice(0, 4).map((c, i) => (
                        <div key={i} className="h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Bento 4: Colors */}
            <Card className="col-span-2 border border-slate-200/90 bg-white p-4 shadow-sm rounded-2xl">
              <div className="mb-3 flex items-center justify-between font-bold text-slate-900 text-sm">
                <div className="flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-purple-600" />
                  <span>Color Palette</span>
                </div>
                {colors.length < 5 && (
                  <button onClick={handleAddColor} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors">
                    <Plus className="h-3 w-3" /> Add Color
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c, index) => (
                  <div key={index} className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 p-1.5 pr-2.5 relative group">
                    <input
                      type="color"
                      value={c}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="h-6 w-6 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-[10px] font-bold text-slate-700 uppercase">{c}</span>
                    {colors.length > 2 && (
                      <button
                        onClick={() => handleRemoveColor(index)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Bento 5: Engine Controls */}
            <Card className="col-span-2 border border-slate-200/90 bg-white p-4 shadow-sm rounded-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                  <Sliders className="h-4 w-4 text-purple-600" />
                  <span>Engine Controls</span>
                </div>
                <button
                  onClick={handleResetControls}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-purple-600 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Distortion</span>
                    <span className="font-mono text-purple-600">{distortion.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.0" max="1.0" step="0.01" value={distortion} onChange={(e) => setDistortion(parseFloat(e.target.value))} className="w-full accent-purple-600 h-1.5" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Swirl</span>
                    <span className="font-mono text-purple-600">{swirl.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.0" max="1.0" step="0.01" value={swirl} onChange={(e) => setSwirl(parseFloat(e.target.value))} className="w-full accent-purple-600 h-1.5" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Scale</span>
                    <span className="font-mono text-purple-600">{scale.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.5" max="2.5" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-purple-600 h-1.5" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Film Grain</span>
                    <span className="font-mono text-purple-600">{Math.round(noise * 100 / 0.15)}%</span>
                  </div>
                  <input type="range" min="0.0" max="0.15" step="0.005" value={noise} onChange={(e) => setNoise(parseFloat(e.target.value))} className="w-full accent-purple-600 h-1.5" />
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* SEO Guide & FAQ Section */}
        <section className="mt-16 border-t border-slate-200 pt-12">
          <DirectAnswerBlock
            title="How to generate high-resolution shader wallpaper backgrounds online?"
            answer="Free Shader Background Generator creates high-resolution animated and static shader wallpapers, mobile lockscreens, and website hero backgrounds using WebGL fragment shaders. You can select shader engines (Mesh Gradient, Warp, Neuro Noise, Swirl, Voronoi, Metaballs), adjust color palettes, add customizable Google Fonts text & transparent logos, and download 4K PNGs with zero watermarks."
            keyTakeaways={[
              "6 WebGL Shader Engines — Flowing mesh gradients, domain warping, neural noise, liquid swirl & metaballs.",
              "Google Fonts Overlay — Add heading text with 12 free Google Fonts, shadows, outlines, and rotation.",
              "Logo Upload Support — Overlay your brand logo or image with rounded corners, scaling, and opacity.",
              "4K PNG Download — Export crisp, anti-aliased background wallpapers for any screen ratio."
            ]}
            categoryName="Wallpaper Generator"
          />

          <SEOSection
            title="Free Paper Shader Background & Wallpaper Generator"
            description="Design high-resolution static wallpapers, mobile lockscreens, social banners, and website backdrops. Drag the variation slider to morph patterns in a circular arc, customize colors, add text with Google Fonts & logos, and download crisp 4K PNGs."
            howToUse={[
              "Select a shader type (Mesh Gradient, Warp, Neuro Noise, Swirl, Voronoi, Metaballs).",
              "Drag the Variation slider (0% to 100%) to smoothly morph color blobs in a circular orbit while keeping your colors intact.",
              "Choose your target aspect ratio (Vertical 9:16, Tall 3:4, Portrait 4:5, Square 1:1, Classic 4:3, Wide 16:9, Banner 3:1).",
              "Click '+ Add Text' or '+ Add Logo' right below the preview box to edit and position text directly on the canvas.",
              "Choose from 12 free Google Fonts (Inter, Roboto, Playfair Display, Outfit, Montserrat, Oswald, Lora, Pacifico, Fira Code, Poppins, Merriweather, Space Grotesk).",
              "Click Download PNG to save high-res wallpapers instantly."
            ]}
            benefits={[
              "100% Free & Unlimited HD PNG Downloads.",
              "Anti-Banding Shader Dithering: Smooth, silky gradients without visible stripes.",
              "Google Fonts Integration: Pick from 12 free Google Fonts for text overlays.",
              "Pointer Dragging: Smoothly drag text or logos anywhere on the canvas.",
              "100% Client-Side Privacy: All rendering happens locally in your browser."
            ]}
          />

          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-black text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
            <FAQSchema
              faqs={[
                {
                  question: "How do I move text or logos on the canvas?",
                  answer: "Simply drag anywhere on the canvas preview with your mouse or finger to move text or logos smoothly."
                },
                {
                  question: "Which Google Fonts are included?",
                  answer: "We include 12 free Google Fonts: Inter, Roboto, Playfair Display, Outfit, Montserrat, Oswald, Lora, Pacifico, Fira Code, Poppins, Merriweather, and Space Grotesk."
                },
                {
                  question: "Why are all overlay controls placed below the preview box?",
                  answer: "Placing '+ Add Text', '+ Add Logo', Google Fonts dropdown, and Font Size right below the preview box ensures you never need to scroll up and down while customizing your background."
                }
              ]}
            />
          </div>

          <div className="mt-12">
            <RelatedTools currentToolId="background-generator" categoryId="design" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
