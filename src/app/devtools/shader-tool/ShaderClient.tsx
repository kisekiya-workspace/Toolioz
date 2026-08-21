'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { Footer } from '@/components/layout/Footer';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Check,
  Code,
  FileCode,
  Layers,
  Sliders,
  Maximize2,
  Maximize,
  HelpCircle,
  ShieldCheck,
  Flame,
  Zap,
  Upload,
  RefreshCw,
  Share2,
  BookmarkPlus,
  Trash2,
  AlertTriangle,
  Monitor,
  Palette,
  Filter
} from 'lucide-react';

interface ShaderClientProps {
  title: string;
  color: string;
}

// Preset definitions
interface Preset {
  id: string;
  name: string;
  category: '3D SDF' | 'Plasma & FX' | 'Fractal' | 'Retro & CRT' | 'Procedural' | 'Hero Backgrounds' | 'Gradients & Blobs' | 'Geometric Patterns' | 'Ambient & Texture' | 'Dark Mode FX' | 'Glass & Chrome' | 'Artistic & Textures';
  desc: string;
  code: string;
}

const PRESETS: Preset[] = [
  // ═══════════════════════════════════════════════
  // MODERN WEBGPU / DESIGNER PRESETS (Shaders.com style)
  // ═══════════════════════════════════════════════
  {
    id: 'fluid-chrome',
    name: 'Fluid Liquid Chrome',
    category: 'Glass & Chrome',
    desc: 'Iridescent metallic fluid surface distortion with dynamic normal lighting and specular reflection.',
    code: `// Fluid Liquid Chrome — Glass & Chrome
// Uses uColor1, uColor2, uColor3 color pickers
float fcHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float fcNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(fcHash(i + vec2(0.0, 0.0)), fcHash(i + vec2(1.0, 0.0)), u.x),
               mix(fcHash(i + vec2(0.0, 1.0)), fcHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fcFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
        v += a * fcNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.4 * uSpeed;

    vec2 p = uv * 2.5 * uZoom;
    if (iMouse.z > 0.0) {
        vec2 m = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
        p += (uv - m) * 0.4 / (length(uv - m) + 0.1);
    }

    float n1 = fcFbm(p + vec2(t * 0.3, t * 0.2));
    float n2 = fcFbm(p + vec2(n1 * 3.0, t * 0.4));
    float n3 = fcFbm(p + vec2(n2 * 2.5, n1 * 2.0 - t * 0.3));

    // Calculate normal vector for metallic lighting
    vec2 eps = vec2(0.01, 0.0);
    float h = n3;
    float hx = fcFbm(p + eps.xy + vec2(n2 * 2.5, n1 * 2.0 - t * 0.3));
    float hy = fcFbm(p + eps.yx + vec2(n2 * 2.5, n1 * 2.0 - t * 0.3));
    vec3 norm = normalize(vec3((hx - h) / eps.x, (hy - h) / eps.x, 0.8));

    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    float diff = max(dot(norm, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, norm), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);

    // Iridescent chrome gradient
    vec3 chromeGrad = mix(uColor1, uColor2, sin(n3 * 6.28 + t) * 0.5 + 0.5);
    chromeGrad = mix(chromeGrad, uColor3, cos(norm.x * 3.0 + norm.y * 3.0) * 0.5 + 0.5);

    vec3 col = chromeGrad * (diff * 0.6 + 0.4) + vec3(1.0) * spec * 0.8;
    col *= uIntensity;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'studio-glass',
    name: 'Studio Glass Refraction',
    category: 'Glass & Chrome',
    desc: 'Frosted glassmorphism tile refraction with RGB chromatic dispersion & specular edge glow.',
    code: `// Studio Glass Refraction — Glass & Chrome
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.3 * uSpeed;

    // Background gradient blobs
    vec2 c1 = vec2(0.3 + 0.2 * sin(t * 0.5), 0.4 + 0.2 * cos(t * 0.7));
    vec2 c2 = vec2(0.7 + 0.2 * cos(t * 0.6), 0.6 + 0.3 * sin(t * 0.4));
    float b1 = exp(-dot(uv - c1, uv - c1) * 4.0 * uZoom);
    float b2 = exp(-dot(uv - c2, uv - c2) * 5.0 * uZoom);
    vec3 bgCol = mix(uColor1, uColor2, uv.x) + uColor3 * (b1 + b2);

    // Glass panel grid coordinates
    vec2 glassUV = uv * vec2(4.0, 3.0);
    vec2 glassLocal = fract(glassUV) - 0.5;

    // Rounded box dist for glass tiles
    vec2 d = abs(glassLocal) - vec2(0.42);
    float glassBox = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.04;

    // Refraction lens warp
    vec2 refractUV = uv + glassLocal * smoothstep(0.0, -0.2, glassBox) * 0.08;

    // Chromatic dispersion split
    float r = mix(uColor1, uColor2, refractUV.x + 0.01).r;
    float g = mix(uColor1, uColor2, refractUV.x).g;
    float b = mix(uColor1, uColor2, refractUV.x - 0.01).b;
    vec3 glassColor = vec3(r, g, b) + bgCol * 0.5;

    // Specular highlight on tile edges
    float edge = smoothstep(0.02, 0.0, abs(glassBox));
    float innerGlow = smoothstep(-0.4, 0.0, glassBox) * 0.2;

    vec3 col = mix(bgCol, glassColor + innerGlow, step(glassBox, 0.0));
    col += vec3(1.0) * edge * 0.6;
    col *= uIntensity;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'scanner-noise',
    name: 'Laser Scanner Grid',
    category: 'Geometric Patterns',
    desc: 'High-tech laser scanner beam passing over procedural noise grid with glowing particles.',
    code: `// Laser Scanner Grid — Geometric Patterns
// Uses uColor1, uColor2, uColor3 color pickers
float snHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * uSpeed;

    // Grid coordinates
    vec2 gridUV = uv * vec2(iResolution.x / iResolution.y, 1.0) * 25.0 * uZoom;
    vec2 gridId = floor(gridUV);
    vec2 gridLocal = abs(fract(gridUV) - 0.5);
    float gridLines = smoothstep(0.46, 0.49, max(gridLocal.x, gridLocal.y));

    // Scanner beam moving vertically
    float scanPos = fract(t * 0.2);
    float scanDist = abs(uv.y - scanPos);
    float scanBeam = exp(-scanDist * scanDist * 300.0);
    float scanTrail = smoothstep(0.25, 0.0, uv.y - scanPos) * step(uv.y, scanPos);

    // Random active grid cells triggered by scanline
    float noiseCell = snHash(gridId + floor(t * 2.0));
    float cellActive = step(0.85, noiseCell) * (scanBeam + scanTrail * 0.5);

    vec3 bg = vec3(0.02, 0.01, 0.04);
    vec3 col = bg;

    // Base grid color
    col += uColor1 * gridLines * 0.15;
    // Scanner beam glow
    col += uColor2 * scanBeam * 1.5;
    // Trail glow
    col += uColor1 * scanTrail * 0.25;
    // Active digital noise blocks
    col += uColor3 * cellActive * 2.0;

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'point-waves',
    name: '3D Point Wave Field',
    category: 'Geometric Patterns',
    desc: 'Perspective field of glowing dots undulating in 3D sine waves with mouse interaction.',
    code: `// 3D Point Wave Field — Geometric Patterns
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * uSpeed;

    vec3 col = vec3(0.02, 0.01, 0.04);

    // Camera tilt perspective
    float horizon = uv.y + 0.25;
    if (horizon > 0.01) {
        float z = 0.5 / horizon;
        vec2 grid = vec2(uv.x * z, z + t * 0.5) * 4.0 * uZoom;

        vec2 cellId = floor(grid);
        vec2 cellF = fract(grid) - 0.5;

        // Wave height animation
        float wave = sin(cellId.x * 0.4 + cellId.y * 0.3 + t * 2.0) * 0.5 + 0.5;
        
        // Mouse ripple height
        if (iMouse.z > 0.0) {
            vec2 mUV = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
            float mDist = length(uv - mUV);
            wave += exp(-mDist * 10.0) * 1.5;
        }

        // Point rendering
        float dotDist = length(cellF);
        float dotSize = 0.15 + wave * 0.1;
        float dotGlow = smoothstep(dotSize, 0.0, dotDist);

        // Distance fog attenuation
        float fog = exp(-z * 0.15);

        vec3 dotColor = mix(uColor1, uColor2, wave);
        dotColor = mix(dotColor, uColor3, sin(cellId.x * 0.2) * 0.5 + 0.5);

        col += dotColor * dotGlow * fog * uIntensity * 1.2;
    }

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'spectral-bloom',
    name: 'Spectral Prism Bloom',
    category: 'Ambient & Texture',
    desc: 'Prismatic light leak refraction with soft glowing bokeh flares and fluid caustics.',
    code: `// Spectral Prism Bloom — Ambient & Texture
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.4 * uSpeed;

    vec2 p = (uv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);

    // Rotating spectral flare rays
    float ang = atan(p.y, p.x);
    float dist = length(p);

    float rays = sin(ang * 8.0 + t) * sin(ang * 5.0 - t * 0.7) * 0.5 + 0.5;
    float bloom1 = exp(-dist * dist * 4.0 * uZoom) * (1.0 + rays * 0.4);

    // Prismatic lens flare orbs
    vec2 orb1 = vec2(0.2 * sin(t * 0.8), 0.15 * cos(t * 0.6));
    vec2 orb2 = vec2(-0.25 * cos(t * 0.5), -0.2 * sin(t * 0.7));
    float g1 = exp(-length(p - orb1) * 8.0 * uZoom);
    float g2 = exp(-length(p - orb2) * 10.0 * uZoom);

    // Spectral rainbow blend
    vec3 col = uColor1 * bloom1;
    col += uColor2 * g1 * 1.5;
    col += uColor3 * g2 * 1.8;

    // Rainbow rim refraction
    vec3 rainbow = 0.5 + 0.5 * cos(ang * 3.0 + t + vec3(0.0, 2.0, 4.0));
    col += rainbow * smoothstep(0.4, 0.1, dist) * 0.25;

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'liquid-displacement',
    name: 'Interactive Fluid Displacement',
    category: 'Gradients & Blobs',
    desc: 'Interactive fluid ripple distortion over textures or dynamic background patterns.',
    code: `// Interactive Fluid Displacement — Gradients & Blobs
// Uses uColor1, uColor2, uColor3 color pickers + iChannel0 texture
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.6 * uSpeed;

    // Mouse interaction displacement center
    vec2 m = iMouse.xy / iResolution.xy;
    if (iMouse.z <= 0.0) {
        m = vec2(0.5 + 0.2 * sin(t), 0.5 + 0.2 * cos(t * 0.8));
    }

    // Ripple wave offset calculation
    float d = length((uv - m) * vec2(iResolution.x / iResolution.y, 1.0));
    float wave = sin(d * 30.0 * uZoom - t * 4.0) * exp(-d * 4.0);
    vec2 displace = normalize(uv - m + 0.001) * wave * 0.04;

    vec2 displacedUV = clamp(uv + displace, 0.0, 1.0);

    // Sample texture or procedural color fallback
    vec4 tex = texture2D(iChannel0, displacedUV);
    vec3 procCol = mix(uColor1, uColor2, displacedUV.x + wave);
    procCol = mix(procCol, uColor3, displacedUV.y - wave);

    vec3 finalCol = mix(procCol, tex.rgb, step(0.01, length(tex.rgb))) + vec3(wave * 0.5);
    finalCol *= uIntensity;

    fragColor = vec4(finalCol, 1.0);
}`
  },
  {
    id: 'smokescreen',
    name: 'Volumetric Smokescreen',
    category: 'Dark Mode FX',
    desc: 'Drifting organic fluid smoke clouds with deep luminescence for dark interfaces.',
    code: `// Volumetric Smokescreen — Dark Mode FX
// Uses uColor1, uColor2, uColor3 color pickers
float smHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(smHash(i + vec2(0.0, 0.0)), smHash(i + vec2(1.0, 0.0)), u.x),
               mix(smHash(i + vec2(0.0, 1.0)), smHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float smFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * smNoise(p);
        p = rot * p * 2.1;
        a *= 0.5;
    }
    return v;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.25 * uSpeed;

    vec2 p = uv * 3.0 * uZoom;
    vec2 q = vec2(smFbm(p + vec2(t * 0.2, t * 0.1)), smFbm(p + vec2(t * 0.1, -t * 0.2)));
    vec2 r = vec2(smFbm(p + q * 2.0 + vec2(1.7, 9.2)), smFbm(p + q * 2.0 + vec2(8.3, 2.8)));

    float smoke = smFbm(p + r * 2.5);

    vec3 bg = vec3(0.02, 0.01, 0.04);
    vec3 col = mix(bg, uColor1, smoke * smoke);
    col = mix(col, uColor2, length(q));
    col = mix(col, uColor3, r.x * smoke);

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'aurora-gradient',
    name: 'Aurora Gradient Mesh',
    category: 'Hero Backgrounds',
    desc: 'Smooth animated multi-color gradient blobs — perfect for SaaS / landing hero sections.',
    code: `// Aurora Gradient Mesh — Hero Background
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.25 * uSpeed;

    // Four animated blob centers
    vec2 c1 = vec2(0.3 + 0.2 * sin(t * 0.7), 0.4 + 0.3 * cos(t * 0.5));
    vec2 c2 = vec2(0.7 + 0.2 * cos(t * 0.6), 0.6 + 0.2 * sin(t * 0.8));
    vec2 c3 = vec2(0.5 + 0.3 * sin(t * 0.4), 0.3 + 0.3 * cos(t * 0.9));
    vec2 c4 = vec2(0.2 + 0.25 * cos(t * 0.5), 0.7 + 0.2 * sin(t * 0.6));

    // Gaussian falloff blobs
    float b1 = exp(-dot(uv - c1, uv - c1) * 3.0 * uZoom);
    float b2 = exp(-dot(uv - c2, uv - c2) * 4.0 * uZoom);
    float b3 = exp(-dot(uv - c3, uv - c3) * 3.5 * uZoom);
    float b4 = exp(-dot(uv - c4, uv - c4) * 5.0 * uZoom);

    vec3 col = uColor1 * b1 + uColor2 * b2 + uColor3 * b3 + mix(uColor1, uColor3, 0.5) * b4;
    col *= uIntensity;
    col += vec3(0.02, 0.01, 0.04);

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'particle-constellation',
    name: 'Particle Constellation',
    category: 'Hero Backgrounds',
    desc: 'Floating connected dots with parallax mouse interaction — tech/startup hero.',
    code: `// Particle Constellation — Hero Background
// Uses uColor1, uColor2, uColor3 color pickers
float pcHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 particlePos(float id, float t) {
    float hx = pcHash(vec2(id, 1.0));
    float hy = pcHash(vec2(1.0, id));
    return vec2(fract(hx + t * (0.02 + hx * 0.03)), fract(hy + t * (0.015 + hy * 0.02)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.5 * uSpeed;
    vec3 col = vec3(0.03, 0.02, 0.06);

    const int N = 15;
    for (int i = 0; i < N; i++) {
        vec2 pi = particlePos(float(i), t);
        float d = length(uv - pi);
        float glow = 0.003 / (d + 0.003);
        col += mix(uColor1, uColor2, float(i) / float(N)) * glow * 0.3 * uIntensity;

        for (int j = i + 1; j < N; j++) {
            vec2 pj = particlePos(float(j), t);
            float dist = length(pi - pj);
            if (dist < 0.18 * uZoom) {
                vec2 pa = uv - pi;
                vec2 ba = pj - pi;
                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                float lineDist = length(pa - ba * h);
                float lineAlpha = smoothstep(0.002, 0.0, lineDist) * (1.0 - dist / (0.18 * uZoom));
                col += uColor3 * lineAlpha * 0.35 * uIntensity;
            }
        }
    }

    if (iMouse.z > 0.0) {
        vec2 mUV = iMouse.xy / iResolution.xy;
        float mDist = length(uv - mUV);
        col += uColor2 * 0.06 / (mDist + 0.06) * uIntensity;
    }

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'wave-layers',
    name: 'Wave Layers',
    category: 'Hero Backgrounds',
    desc: 'Stacked animated sine wave bands with depth gradient — modern landing pages.',
    code: `// Wave Layers — Hero Background
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * uSpeed;
    vec3 col = vec3(0.02, 0.01, 0.05);

    // Layer 1 (back, most transparent)
    float w1 = 0.55 + 0.12 * sin(uv.x * 6.0 * uZoom + t * 0.8) + 0.08 * sin(uv.x * 12.0 * uZoom - t * 1.2);
    col = mix(col, uColor1 * 0.3, smoothstep(0.01, -0.01, uv.y - w1) * 0.6 * uIntensity);

    // Layer 2
    float w2 = 0.47 + 0.1 * sin(uv.x * 8.0 * uZoom + t * 1.0 + 1.0) + 0.06 * sin(uv.x * 15.0 * uZoom - t * 0.9);
    col = mix(col, uColor2 * 0.4, smoothstep(0.01, -0.01, uv.y - w2) * 0.7 * uIntensity);

    // Layer 3
    float w3 = 0.38 + 0.08 * sin(uv.x * 10.0 * uZoom + t * 1.3 + 2.0) + 0.05 * sin(uv.x * 18.0 * uZoom - t * 1.5);
    col = mix(col, uColor3 * 0.5, smoothstep(0.01, -0.01, uv.y - w3) * 0.8 * uIntensity);

    // Layer 4 (front, most opaque)
    float w4 = 0.3 + 0.06 * sin(uv.x * 12.0 * uZoom + t * 1.6 + 3.5) + 0.04 * sin(uv.x * 20.0 * uZoom - t * 1.8);
    col = mix(col, mix(uColor1, uColor2, 0.5) * 0.6, smoothstep(0.01, -0.01, uv.y - w4) * 0.9 * uIntensity);

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'liquid-blobs',
    name: 'Liquid Morphing Blobs',
    category: 'Gradients & Blobs',
    desc: 'Organic animated metaball shapes with soft color transitions.',
    code: `// Liquid Morphing Blobs — Gradients & Blobs
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.6 * uSpeed;

    vec2 b1 = 0.4 * vec2(sin(t * 0.7), cos(t * 0.9));
    vec2 b2 = 0.35 * vec2(cos(t * 0.6), sin(t * 0.8 + 1.0));
    vec2 b3 = 0.3 * vec2(sin(t * 0.5 + 2.0), cos(t * 0.7 + 0.5));
    vec2 b4 = 0.25 * vec2(cos(t * 0.8 + 1.5), sin(t * 0.6 + 3.0));

    float f = 0.0;
    f += 0.08 / (length(uv - b1) + 0.01);
    f += 0.06 / (length(uv - b2) + 0.01);
    f += 0.07 / (length(uv - b3) + 0.01);
    f += 0.05 / (length(uv - b4) + 0.01);
    f = smoothstep(1.0, 2.5, f * uZoom);

    vec3 col = mix(uColor1, uColor2, uv.x + 0.5);
    col = mix(col, uColor3, uv.y + 0.5);
    col *= f * uIntensity;
    col += vec3(0.02, 0.01, 0.03) * (1.0 - f);

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'mesh-gradient',
    name: 'Mesh Gradient Animator',
    category: 'Gradients & Blobs',
    desc: 'Multi-point animated mesh gradient similar to Apple/Stripe style hero sections.',
    code: `// Mesh Gradient Animator — Gradients & Blobs
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.2 * uSpeed;

    vec2 p1 = vec2(0.2 + 0.15 * sin(t * 0.5), 0.3 + 0.2 * cos(t * 0.4));
    vec2 p2 = vec2(0.8 + 0.1 * cos(t * 0.6), 0.2 + 0.15 * sin(t * 0.7));
    vec2 p3 = vec2(0.5 + 0.2 * sin(t * 0.3), 0.8 + 0.1 * cos(t * 0.5));
    vec2 p4 = vec2(0.15 + 0.1 * cos(t * 0.7), 0.75 + 0.15 * sin(t * 0.3));
    vec2 p5 = vec2(0.85 + 0.1 * sin(t * 0.4), 0.7 + 0.1 * cos(t * 0.6));
    vec2 p6 = vec2(0.5 + 0.15 * cos(t * 0.5), 0.5 + 0.2 * sin(t * 0.4));

    float w1 = 1.0 / (dot(uv - p1, uv - p1) * 8.0 * uZoom + 0.05);
    float w2 = 1.0 / (dot(uv - p2, uv - p2) * 8.0 * uZoom + 0.05);
    float w3 = 1.0 / (dot(uv - p3, uv - p3) * 8.0 * uZoom + 0.05);
    float w4 = 1.0 / (dot(uv - p4, uv - p4) * 8.0 * uZoom + 0.05);
    float w5 = 1.0 / (dot(uv - p5, uv - p5) * 8.0 * uZoom + 0.05);
    float w6 = 1.0 / (dot(uv - p6, uv - p6) * 8.0 * uZoom + 0.05);
    float totalW = w1 + w2 + w3 + w4 + w5 + w6;

    vec3 c1 = uColor1; vec3 c2 = uColor2; vec3 c3 = uColor3;
    vec3 c4 = mix(uColor1, uColor2, 0.5);
    vec3 c5 = mix(uColor2, uColor3, 0.5);
    vec3 c6 = mix(uColor3, uColor1, 0.5);

    vec3 col = (c1*w1 + c2*w2 + c3*w3 + c4*w4 + c5*w5 + c6*w6) / totalW;
    col *= uIntensity;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'grid-pulse',
    name: 'Animated Grid Pulse',
    category: 'Geometric Patterns',
    desc: 'Subtle grid lines with pulsing intersection glow — dashboard/SaaS backgrounds.',
    code: `// Animated Grid Pulse — Geometric Patterns
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * uSpeed;
    float aspect = iResolution.x / iResolution.y;

    vec2 gridUV = uv * vec2(aspect, 1.0) * 20.0 * uZoom;
    vec2 gridId = floor(gridUV);
    vec2 gridF = fract(gridUV) - 0.5;

    float lineX = smoothstep(0.48, 0.47, abs(gridF.x));
    float lineY = smoothstep(0.48, 0.47, abs(gridF.y));
    float grid = max(lineX, lineY);
    float intersection = lineX * lineY;
    float pulse = sin(gridId.x * 0.5 + gridId.y * 0.7 + t * 2.0) * 0.5 + 0.5;

    vec3 bg = vec3(0.04, 0.03, 0.06);
    vec3 lineColor = mix(uColor1, uColor2, uv.x) * 0.15;
    vec3 pulseColor = uColor3 * pulse;

    vec3 col = bg;
    col += lineColor * grid * uIntensity;
    col += pulseColor * intersection * 2.0 * uIntensity;

    float vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.5;
    col *= vignette;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'hex-tessellation',
    name: 'Hexagonal Tessellation',
    category: 'Geometric Patterns',
    desc: 'Animated hexagonal grid with reactive lighting — tech/crypto dashboards.',
    code: `// Hexagonal Tessellation — Geometric Patterns
// Uses uColor1, uColor2, uColor3 color pickers
vec4 hexCoord(vec2 uv) {
    vec2 r = vec2(1.0, 1.732);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    vec2 id = uv - gv;
    return vec4(gv, id);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.8 * uSpeed;
    uv *= 6.0 * uZoom;

    vec4 hc = hexCoord(uv);
    vec2 gv = hc.xy;
    vec2 id = hc.zw;

    float d = max(abs(gv.x), abs(gv.y * 0.577 + gv.x * 0.5));
    float hex = smoothstep(0.5, 0.47, d);

    float n = sin(id.x * 1.3 + id.y * 0.7 + t) * 0.5 + 0.5;
    vec3 col = mix(uColor1, uColor2, n);
    col = mix(col, uColor3, sin(id.x * 0.5 - id.y * 1.1 + t * 0.7) * 0.5 + 0.5);

    float edge = smoothstep(0.45, 0.5, d) * smoothstep(0.52, 0.5, d);
    vec3 edgeCol = mix(uColor2, uColor3, 0.5);

    vec3 bg = vec3(0.03, 0.02, 0.05);
    vec3 finalCol = bg + col * hex * 0.3 * uIntensity + edgeCol * edge * uIntensity;

    fragColor = vec4(finalCol, 1.0);
}`
  },
  {
    id: 'film-grain-pro',
    name: 'Cinematic Film Grain',
    category: 'Ambient & Texture',
    desc: 'High-frequency film grain, micro dust jitter, animated scratches & vintage vignette.',
    code: `// Cinematic Film Grain & Scratches — Ambient & Texture
// Uses uColor1, uColor2, uColor3 color pickers
float fgHash(vec2 p, float t) {
    return fract(sin(dot(p + mod(t * 17.0, 100.0), vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * uSpeed;

    // Base atmospheric gradient
    vec3 baseCol = mix(uColor1, uColor2, uv.y + sin(uv.x * 3.0 + t * 0.5) * 0.2);
    baseCol = mix(baseCol, uColor3, (1.0 - uv.x) * 0.4);

    // Multi-layered animated film grain
    float grain1 = fgHash(fragCoord * 0.8, t);
    float grain2 = fgHash(fragCoord * 1.5, t * 1.3);
    float grain = (grain1 + grain2) * 0.5 - 0.5;

    // Film scratch effect
    float scratchX = fgHash(vec2(floor(uv.x * 200.0), 1.0), floor(t * 12.0));
    float scratch = step(0.995, scratchX) * (1.0 - abs(fract(uv.x * 200.0) - 0.5) * 2.0);

    // Vignette falloff
    vec2 vigUV = uv * (1.0 - uv);
    float vig = pow(vigUV.x * vigUV.y * 15.0, 0.3);

    vec3 col = baseCol + vec3(grain) * 0.18 * uZoom;
    col += vec3(scratch) * 0.4;
    col *= vig;
    col *= uIntensity;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'halftone-matrix',
    name: 'Vintage Halftone Print',
    category: 'Artistic & Textures',
    desc: 'CMYK angled newspaper print dot matrix with procedural brightness dot scaling.',
    code: `// Vintage Halftone Print — Artistic & Textures
// Uses uColor1, uColor2, uColor3 color pickers
float htDot(vec2 uv, vec2 center, float radius) {
    return smoothstep(radius, radius - 0.05, length(uv - center));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.5 * uSpeed;

    // Animated intensity wave
    float lum = 0.5 + 0.5 * sin(uv.x * 5.0 * uZoom + uv.y * 3.0 + t);

    // Rotated grid for halftone angle (45 deg)
    float angle = 0.785398; // 45 degrees
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 gridUV = rot * (fragCoord / 12.0);

    vec2 gridId = floor(gridUV);
    vec2 gridLocal = fract(gridUV) - 0.5;

    // Dot radius proportional to luminosity
    float radius = clamp(lum * 0.6, 0.05, 0.48);
    float dotPattern = htDot(gridLocal, vec2(0.0), radius);

    vec3 bgCol = uColor1 * 0.2;
    vec3 dotCol = mix(uColor2, uColor3, lum);

    vec3 col = mix(bgCol, dotCol, dotPattern);
    col *= uIntensity;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'ascii-terminal',
    name: 'ASCII Digital Stream',
    category: 'Artistic & Textures',
    desc: 'Retro terminal ASCII character matrix rendering falling code streams.',
    code: `// ASCII Digital Stream — Artistic & Textures
// Uses uColor1, uColor2, uColor3 color pickers
float asciiHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Procedural glyph generator for pseudo ASCII characters
float asciiChar(vec2 p, float id) {
    p = clamp(p, 0.0, 1.0);
    float val = asciiHash(vec2(id, floor(p.y * 5.0)));
    float line = step(0.3, fract(p.x * 3.0 + val));
    return line * step(0.2, val);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * uSpeed;

    // Cell grid coordinates (8x12 pixels per glyph)
    vec2 cellSize = vec2(8.0, 12.0) / uZoom;
    vec2 cellId = floor(fragCoord / cellSize);
    vec2 cellUV = fract(fragCoord / cellSize);

    // Falling matrix rain column speeds
    float colSpeed = 2.0 + asciiHash(vec2(cellId.x, 1.0)) * 4.0;
    float rainPos = fract(t * colSpeed * 0.1 + asciiHash(vec2(cellId.x, 2.0)));
    float rainDist = fract(1.0 - uv.y - rainPos);

    // Glyph ID changes as stream falls
    float glyphId = floor(asciiHash(cellId + floor(t * 8.0)) * 16.0);
    float charGlyph = asciiChar(cellUV, glyphId);

    // Head bright lead, body fading trail
    float leadHead = smoothstep(0.05, 0.0, rainDist);
    float trail = smoothstep(0.4, 0.0, rainDist);

    vec3 bg = vec3(0.02, 0.03, 0.05);
    vec3 col = bg;

    vec3 charColor = mix(uColor1, uColor2, trail);
    col += charColor * charGlyph * trail * 0.8;
    col += uColor3 * charGlyph * leadHead * 2.5;

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'watercolor-paper',
    name: 'Organic Watercolor & Paper',
    category: 'Artistic & Textures',
    desc: 'Soft watercolor pigment bleeding with paper fiber grain & wet edge accumulation.',
    code: `// Organic Watercolor & Paper Grain — Artistic & Textures
// Uses uColor1, uColor2, uColor3 color pickers
float wcHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float wcNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(wcHash(i + vec2(0.0, 0.0)), wcHash(i + vec2(1.0, 0.0)), u.x),
               mix(wcHash(i + vec2(0.0, 1.0)), wcHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float wcFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
        v += a * wcNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.2 * uSpeed;

    // Distorted fluid flow coordinates for pigment bleeding
    vec2 p = uv * 3.0 * uZoom;
    float n1 = wcFbm(p + vec2(t * 0.2, t * 0.1));
    float n2 = wcFbm(p + vec2(n1 * 2.0, t * 0.15));

    // Edge pigment pooling intensity
    float edgePool = pow(abs(n2 - 0.5) * 2.0, 2.0);

    // Paper texture bump map
    float paperGrain = wcHash(fragCoord * 1.2) * 0.08;

    vec3 col = mix(uColor1, uColor2, n1);
    col = mix(col, uColor3, n2);
    // Darker pigment accumulation on wet edges
    col *= (1.0 - edgePool * 0.3);
    // Blend with cold paper texture
    col += vec3(paperGrain);

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'fluid-swirl',
    name: 'Interactive Fluid Swirl',
    category: 'Gradients & Blobs',
    desc: 'Dynamic fluid vortex spiraling with interactive mouse swirl torque & turbulence.',
    code: `// Interactive Fluid Vortex Swirl — Gradients & Blobs
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.5 * uSpeed;

    vec2 center = vec2(0.0);
    if (iMouse.z > 0.0) {
        center = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
    }

    vec2 p = uv - center;
    float dist = length(p);
    float angle = atan(p.y, p.x);

    // Spiral swirl distortion angle
    float swirl = exp(-dist * 3.0 * uZoom) * 6.0;
    float twistedAngle = angle + swirl + t;

    vec2 swirlUV = vec2(cos(twistedAngle), sin(twistedAngle)) * dist;

    float r1 = sin(swirlUV.x * 8.0 + t) * 0.5 + 0.5;
    float r2 = cos(swirlUV.y * 10.0 - t * 0.8) * 0.5 + 0.5;

    vec3 col = mix(uColor1, uColor2, r1);
    col = mix(col, uColor3, r2);
    col += uColor1 * exp(-dist * 4.0) * 0.5;

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'crystal-prism',
    name: 'Crystal Prism Facets',
    category: 'Glass & Chrome',
    desc: 'Faceted crystal geometry refraction with light dispersion & caustic reflections.',
    code: `// Faceted Crystal Prism Refraction — Glass & Chrome
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.4 * uSpeed;

    // Hexagonal crystal facet geometry
    vec2 p = uv * 4.0 * uZoom;
    vec2 gridF = fract(p) - 0.5;

    // Facet normal angles
    float facetAngle = atan(gridF.y, gridF.x);
    float facetDist = length(gridF);

    // Facet index rotation
    float facetId = floor(mod(facetAngle / 1.047 + t * 0.5, 6.0));

    // Dynamic light reflection per facet
    float light = sin(facetId * 1.047 + t * 2.0) * 0.5 + 0.5;
    float edgeGlow = smoothstep(0.48, 0.45, max(abs(gridF.x), abs(gridF.y)));

    vec3 facetCol = mix(uColor1, uColor2, light);
    facetCol = mix(facetCol, uColor3, sin(facetDist * 10.0 - t) * 0.5 + 0.5);

    vec3 col = facetCol * edgeGlow + vec3(1.0) * pow(light, 8.0) * 0.8;
    col *= uIntensity;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'spotlight-glow',
    name: 'Spotlight Glow',
    category: 'Ambient & Texture',
    desc: 'Soft radial spotlight that follows mouse — elegant product showcases.',
    code: `// Spotlight Glow — Ambient & Texture
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * uSpeed;

    vec2 center = vec2(0.5 + 0.1 * sin(t * 0.3), 0.5 + 0.1 * cos(t * 0.4));
    if (iMouse.z > 0.0) {
        center = iMouse.xy / iResolution.xy;
    }

    float dist = length((uv - center) * vec2(iResolution.x / iResolution.y, 1.0));

    float glow1 = exp(-dist * dist * 6.0 * uZoom);
    float glow2 = exp(-dist * dist * 12.0 * uZoom);
    float glow3 = exp(-dist * dist * 25.0 * uZoom);

    vec3 col = vec3(0.02, 0.01, 0.04);
    col += uColor1 * glow1 * 0.5;
    col += uColor2 * glow2 * 0.7;
    col += uColor3 * glow3 * 1.0;
    col *= uIntensity;
    col += mix(uColor1, uColor2, uv.x) * 0.03;

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'gradient-orbs',
    name: 'Gradient Orbs',
    category: 'Dark Mode FX',
    desc: 'Multiple soft floating orbs on dark backgrounds — modern dark mode hero.',
    code: `// Gradient Orbs — Dark Mode FX
// Uses uColor1, uColor2, uColor3 color pickers
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.3 * uSpeed;
    float aspect = iResolution.x / iResolution.y;
    vec3 col = vec3(0.02, 0.01, 0.03);

    vec2 o1 = vec2(0.3 + 0.15 * sin(t * 0.5), 0.4 + 0.2 * cos(t * 0.4));
    float d1 = length((uv - o1) * vec2(aspect, 1.0));
    col += uColor1 * exp(-d1 * d1 * 3.0 / uZoom) * 0.8;

    vec2 o2 = vec2(0.7 + 0.1 * cos(t * 0.7), 0.6 + 0.15 * sin(t * 0.6));
    float d2 = length((uv - o2) * vec2(aspect, 1.0));
    col += uColor2 * exp(-d2 * d2 * 5.0 / uZoom) * 0.7;

    vec2 o3 = vec2(0.5 + 0.2 * sin(t * 0.6), 0.3 + 0.25 * cos(t * 0.5));
    float d3 = length((uv - o3) * vec2(aspect, 1.0));
    col += uColor3 * exp(-d3 * d3 * 7.0 / uZoom) * 0.6;

    vec2 o4 = vec2(0.2 + 0.2 * cos(t * 0.4), 0.7 + 0.15 * sin(t * 0.3));
    float d4 = length((uv - o4) * vec2(aspect, 1.0));
    col += mix(uColor1, uColor3, 0.5) * exp(-d4 * d4 * 4.0 / uZoom) * 0.5;

    vec2 o5 = vec2(0.85 + 0.1 * sin(t * 0.3), 0.15 + 0.1 * cos(t * 0.5));
    float d5 = length((uv - o5) * vec2(aspect, 1.0));
    col += mix(uColor2, uColor3, 0.5) * exp(-d5 * d5 * 6.0 / uZoom) * 0.4;

    col *= uIntensity;
    fragColor = vec4(col, 1.0);
}`
  },

  // ═══════════════════════════════════════════════
  // DEVELOPER / TECHNICAL PRESETS (Original)
  // ═══════════════════════════════════════════════
  {
    id: 'cyber-grid',
    name: 'Cyberpunk Neon Grid',
    category: 'Plasma & FX',
    desc: 'Perspective neon grid horizon with animated plasma wave pulse.',
    code: `// Cyberpunk Neon Grid
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Camera perspective tilt
    vec3 col = vec3(0.02, 0.01, 0.06);
    float gridZ = 0.4 / (abs(uv.y + 0.35) + 0.05);
    vec2 gridUV = vec2(uv.x * gridZ, gridZ + iTime * uSpeed * 2.0);

    // Grid lines calculation
    vec2 gridLines = abs(fract(gridUV - 0.5) - 0.5) / fwidth(gridUV);
    float line = min(gridLines.x, gridLines.y);
    float c = 1.0 - min(line, 1.0);

    // Neon purple & cyan color gradient
    vec3 neonCyan = vec3(0.0, 0.9, 1.0);
    vec3 neonPink = vec3(1.0, 0.1, 0.6);
    vec3 gridCol = mix(neonPink, neonCyan, sin(gridUV.y * 0.2 + iTime) * 0.5 + 0.5);

    // Horizon glow
    float horizon = smoothstep(0.0, 0.4, abs(uv.y + 0.35));
    col += gridCol * c * (1.0 - horizon) * 1.5;

    // Sun on horizon
    vec2 sunPos = uv - vec2(0.0, -0.2);
    float sunDist = length(sunPos);
    if (sunDist < 0.25) {
        float sunGlow = smoothstep(0.25, 0.0, sunDist);
        float stripe = step(0.02, mod(sunPos.y + iTime * 0.05, 0.05));
        vec3 sunCol = mix(vec3(1.0, 0.8, 0.1), vec3(1.0, 0.0, 0.4), (sunPos.y + 0.25) / 0.5);
        col += sunCol * sunGlow * stripe;
    }

    // Mouse glow interaction
    if (iMouse.z > 0.0) {
        vec2 mUV = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
        float mDist = length(uv - mUV);
        col += vec3(0.2, 0.8, 1.0) * (0.05 / (mDist + 0.05));
    }

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'raymarch-sphere',
    name: 'Raymarched 3D Metallic Sphere',
    category: '3D SDF',
    desc: 'Full 3D signed distance field raymarching with smooth morphing & spec lighting.',
    code: `// Raymarched 3D Metallic Sphere (SDF)
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float map(vec3 p) {
    vec3 p1 = p;
    p1.x += sin(iTime * uSpeed) * 0.8;
    float s1 = sdSphere(p1, 0.7);

    vec3 p2 = p;
    p2.y += cos(iTime * uSpeed * 1.2) * 0.6;
    float s2 = sdSphere(p2, 0.6);

    float b = sdBox(p, vec3(0.5 * uZoom));
    return smin(smin(s1, s2, 0.4), b, 0.3);
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Ray origin and direction
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv, 1.2));

    // Mouse orbit
    if (iMouse.z > 0.0) {
        float angX = (iMouse.x / iResolution.x - 0.5) * 4.0;
        ro.x = sin(angX) * 3.0;
        ro.z = -cos(angX) * 3.0;
        rd = normalize(vec3(uv.x * cos(angX) + rd.z * sin(angX), uv.y, -uv.x * sin(angX) + rd.z * cos(angX)));
    }

    float t = 0.0;
    for(int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        t += d;
        if(d < 0.001 || t > 10.0) break;
    }

    vec3 col = vec3(0.05, 0.05, 0.1);
    if(t < 10.0) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 lightDir = normalize(vec3(1.0, 2.0, -2.0));

        float diff = max(dot(n, lightDir), 0.0);
        float spec = pow(max(dot(reflect(-lightDir, n), -rd), 0.0), 32.0);
        float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

        vec3 baseColor = 0.5 + 0.5 * cos(iTime + p.xyx + vec3(0, 2, 4));
        col = baseColor * (diff * 0.8 + 0.2) + spec * vec3(1.0) + rim * vec3(0.2, 0.6, 1.0);
    }

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'mandelbrot-fractal',
    name: 'Morphing Julia / Mandelbrot',
    category: 'Fractal',
    desc: 'Complex plane iterative fractal with dynamic morphing constants.',
    code: `// Dynamic Julia Set Fractal
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Zoom and Pan
    uv *= 2.5 / uZoom;

    // Julia morphing constant
    vec2 c = vec2(
        -0.7 + sin(iTime * 0.3 * uSpeed) * 0.1,
        0.27015 + cos(iTime * 0.2 * uSpeed) * 0.05
    );

    if (iMouse.z > 0.0) {
        c = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y * 1.5;
    }

    vec2 z = uv;
    float iter = 0.0;
    const float maxIter = 100.0;

    for (float i = 0.0; i < maxIter; i++) {
        // z = z^2 + c
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) {
            iter = i;
            break;
        }
    }

    vec3 col = vec3(0.0);
    if (iter < maxIter) {
        float normIter = iter / maxIter;
        col = 0.5 + 0.5 * cos(3.0 + normIter * 12.0 + vec3(0.0, 0.6, 1.0));
    }

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'simplex-liquid',
    name: 'Simplex Noise Liquid Aura',
    category: 'Procedural',
    desc: 'Smooth multi-octave fractional Brownian motion noise liquid waves.',
    code: `// Simplex Noise Liquid Aura
vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
                       dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
}

float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    vec3 p = vec3(uv * 3.0 * uZoom, iTime * 0.4 * uSpeed);
    float n = fbm(p);
    float n2 = fbm(p + vec3(n * 2.0, iTime * 0.2, 1.0));

    vec3 col1 = vec3(0.1, 0.2, 0.8); // Deep ocean blue
    vec3 col2 = vec3(0.9, 0.1, 0.5); // Magenta
    vec3 col3 = vec3(1.0, 0.8, 0.2); // Gold highlight

    vec3 finalCol = mix(col1, col2, n);
    finalCol = mix(finalCol, col3, n2 * n2);

    fragColor = vec4(finalCol, 1.0);
}`
  },
  {
    id: 'crt-glitch',
    name: 'Retro CRT TV & Scanlines',
    category: 'Retro & CRT',
    desc: 'Curved CRT glass monitor distortion with scanlines and chromatic RGB shift.',
    code: `// Retro CRT Monitor & Scanlines
vec2 crtCurve(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
    uv = uv + uv * offset * offset;
    return uv * 0.5 + 0.5;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 crtUV = crtCurve(uv);

    // Black out of screen bounds
    if (crtUV.x < 0.0 || crtUV.x > 1.0 || crtUV.y < 0.0 || crtUV.y > 1.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Generate inner test pattern
    vec2 p = crtUV - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x);

    // Chromatic aberration split
    float shift = 0.005 * sin(iTime * 5.0 * uSpeed);
    float colR = 0.5 + 0.5 * sin(a * 5.0 + iTime * 2.0 + shift);
    float colG = 0.5 + 0.5 * sin(a * 5.0 + iTime * 2.0);
    float colB = 0.5 + 0.5 * sin(a * 5.0 + iTime * 2.0 - shift);
    vec3 baseCol = vec3(colR, colG, colB);

    // Scanlines effect
    float scanline = sin(crtUV.y * iResolution.y * 1.5) * 0.15;
    baseCol -= scanline;

    // Vignette glow
    float vignette = crtUV.x * crtUV.y * (1.0 - crtUV.x) * (1.0 - crtUV.y);
    vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
    baseCol *= vignette;

    fragColor = vec4(baseCol, 1.0);
}`
  },
  {
    id: 'voronoi-caustics',
    name: 'Voronoi Water Caustics',
    category: 'Procedural',
    desc: 'Cellular Voronoi distance calculation simulating swimming pool water caustics.',
    code: `// Voronoi Water Caustics
vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float md = 8.0;

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash2(n + g);
            o = 0.5 + 0.5 * sin(iTime * uSpeed + 6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            md = min(md, d);
        }
    }
    return sqrt(md);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float v1 = voronoi(uv * 6.0 * uZoom);
    float v2 = voronoi(uv * 12.0 * uZoom + vec2(iTime * 0.2));

    float c = pow(v1 * v2, 0.5);
    vec3 waterColor = vec3(0.0, 0.5, 0.8) + vec3(0.8, 0.9, 1.0) * pow(c, 3.0) * 2.5;

    fragColor = vec4(waterColor, 1.0);
}`
  },
  {
    id: 'dither-pixel',
    name: '1-Bit Dithered Pixel Art Shader',
    category: 'Retro & CRT',
    desc: 'Retro 4x4 Bayer ordered dithering threshold applied to animated smooth gradients.',
    code: `// 1-Bit Dithered Pixel Art Shader
const mat4 bayer4x4 = mat4(
     0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
    12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
     3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
    15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
);

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Pixelate UV coordinates
    float pixelSize = 4.0;
    vec2 pCoord = floor(fragCoord / pixelSize) * pixelSize;
    vec2 uv = (pCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Smooth animated background gradient
    float l = length(uv);
    float a = atan(uv.y, uv.x);
    float lum = 0.5 + 0.5 * sin(l * 8.0 - iTime * 2.0 * uSpeed + sin(a * 4.0));

    // Lookup Bayer matrix threshold
    ivec2 bPos = ivec2(mod(pCoord / pixelSize, 4.0));
    float threshold = 0.0;
    if (bPos.x == 0 && bPos.y == 0) threshold = bayer4x4[0][0];
    else if (bPos.x == 1 && bPos.y == 0) threshold = bayer4x4[0][1];
    else if (bPos.x == 2 && bPos.y == 0) threshold = bayer4x4[0][2];
    else if (bPos.x == 3 && bPos.y == 0) threshold = bayer4x4[0][3];
    else if (bPos.x == 0 && bPos.y == 1) threshold = bayer4x4[1][0];
    else if (bPos.x == 1 && bPos.y == 1) threshold = bayer4x4[1][1];
    else if (bPos.x == 2 && bPos.y == 1) threshold = bayer4x4[1][2];
    else if (bPos.x == 3 && bPos.y == 1) threshold = bayer4x4[1][3];
    else if (bPos.x == 0 && bPos.y == 2) threshold = bayer4x4[2][0];
    else if (bPos.x == 1 && bPos.y == 2) threshold = bayer4x4[2][1];
    else if (bPos.x == 2 && bPos.y == 2) threshold = bayer4x4[2][2];
    else if (bPos.x == 3 && bPos.y == 2) threshold = bayer4x4[2][3];
    else if (bPos.x == 0 && bPos.y == 3) threshold = bayer4x4[3][0];
    else if (bPos.x == 1 && bPos.y == 3) threshold = bayer4x4[3][1];
    else if (bPos.x == 2 && bPos.y == 3) threshold = bayer4x4[3][2];
    else if (bPos.x == 3 && bPos.y == 3) threshold = bayer4x4[3][3];

    // 1-Bit output
    float bit = lum > threshold ? 1.0 : 0.0;
    vec3 col = mix(vec3(0.05, 0.08, 0.1), vec3(0.2, 0.9, 0.4), bit);

    fragColor = vec4(col, 1.0);
}`
  },
  {
    id: 'solar-flare',
    name: 'Volumetric Solar Flare Fire',
    category: 'Plasma & FX',
    desc: 'Layered noise volumetric flame animation simulating sun coronal flares.',
    code: `// Volumetric Solar Flare Fire
float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Polar coordinates
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Flame noise layers
    vec2 nUV = vec2(a * 3.0, r * 4.0 - iTime * 2.0 * uSpeed);
    float n1 = noise(nUV * uZoom);
    float n2 = noise(nUV * 2.0 * uZoom + vec2(iTime));

    float fire = (n1 + n2 * 0.5) * (1.0 - smoothstep(0.1, 0.45, r));

    // Fire color gradient: Dark Red -> Orange -> Yellow -> White core
    vec3 col = mix(vec3(0.2, 0.0, 0.0), vec3(1.0, 0.3, 0.0), fire * 2.0);
    col = mix(col, vec3(1.0, 0.9, 0.2), pow(fire, 2.0));
    col = mix(col, vec3(1.0, 1.0, 1.0), pow(fire, 4.0));

    fragColor = vec4(col, 1.0);
}`
  }
];

// GLSL Snippets for quick code insert
const SNIPPETS = [
  {
    name: '2D Rotation',
    code: `mat2 rotate2D(float angle) {\n    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n}`
  },
  {
    name: 'Cosine Palette',
    code: `vec3 palette(float t) {\n    vec3 a = vec3(0.5, 0.5, 0.5);\n    vec3 b = vec3(0.5, 0.5, 0.5);\n    vec3 c = vec3(1.0, 1.0, 1.0);\n    vec3 d = vec3(0.263, 0.416, 0.557);\n    return a + b * cos(6.28318 * (c * t + d));\n}`
  },
  {
    name: '3D Raymarching Loop',
    code: `float map(vec3 p) {\n    return length(p) - 1.0; // Sphere SDF\n}\n\nvec3 raymarch(vec3 ro, vec3 rd) {\n    float t = 0.0;\n    for(int i=0; i<64; i++) {\n        vec3 p = ro + rd * t;\n        float d = map(p);\n        t += d;\n        if(d < 0.001 || t > 20.0) break;\n    }\n    return ro + rd * t;\n}`
  },
  {
    name: '2D Hash Noise',
    code: `float hash21(vec2 p) {\n    p = fract(p * vec2(234.34, 435.34));\n    p += dot(p, p + 34.23);\n    return fract(p.x * p.y);\n}`
  },
  {
    name: 'Smooth Gradient',
    code: `// Use with uColor1, uColor2, uColor3 uniforms\nvec3 smoothGradient(vec2 uv) {\n    vec3 col = mix(uColor1, uColor2, uv.x);\n    col = mix(col, uColor3, uv.y * 0.5);\n    return col;\n}`
  },
  {
    name: 'Mouse Glow',
    code: `// Mouse-reactive radial glow\nvec3 mouseGlow(vec2 uv, vec2 res) {\n    vec2 m = iMouse.xy / res;\n    float d = length(uv - m);\n    return uColor1 * 0.1 / (d + 0.05) * uIntensity;\n}`
  },
  {
    name: 'Film Grain',
    code: `// Film grain noise function\nfloat filmGrain(vec2 p, float t) {\n    return fract(sin(dot(p + mod(t, 100.0), vec2(12.9898, 78.233))) * 43758.5453);\n}`
  }
];

// Helper: convert hex color to RGB floats
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

// All unique categories for filter chips
const ALL_CATEGORIES = Array.from(new Set(PRESETS.map(p => p.category)));

export default function ShaderClient({ title, color }: ShaderClientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  // Persistent timing refs (survive effect re-runs)
  const elapsedRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());

  // Shader state
  const [selectedPreset, setSelectedPreset] = useState<string>('fluid-chrome');
  const [code, setCode] = useState<string>(PRESETS[0].code);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  
  // Animation & play control
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [resolutionScale, setResolutionScale] = useState<number>(1.0); // 0.5x, 1x, 2x
  const [fps, setFps] = useState<number>(60);
  const [time, setTime] = useState<number>(0);
  
  // Custom Uniform Sliders
  const [speed, setSpeed] = useState<number>(1.0);
  const [zoom, setZoom] = useState<number>(1.0);

  // Designer Color Picker Uniforms
  const [color1, setColor1] = useState<string>('#6366f1');
  const [color2, setColor2] = useState<string>('#ec4899');
  const [color3, setColor3] = useState<string>('#06b6d4');
  const [intensity, setIntensity] = useState<number>(1.0);

  // Category filter
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Texture slots
  const [textureType, setTextureType] = useState<'noise' | 'checker' | 'custom'>('noise');
  const [customTextureUrl, setCustomTextureUrl] = useState<string | null>(null);
  const textureObjRef = useRef<WebGLTexture | null>(null);

  // Mouse uniform state (x, y, clickX, clickY)
  const mouseRef = useRef<{ x: number; y: number; clickX: number; clickY: number; isDown: boolean }>({
    x: 0,
    y: 0,
    clickX: 0,
    clickY: 0,
    isDown: false
  });

  // Export & Modals
  const [activeExportTab, setActiveExportTab] = useState<'html' | 'react' | 'three' | 'glsl' | 'css' | 'webcomponent'>('html');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedShaders, setSavedShaders] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [customShaderName, setCustomShaderName] = useState<string>('');

  // Filtered presets by category
  const filteredPresets = useMemo(() => {
    if (activeCategory === 'all') return PRESETS;
    return PRESETS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Load saved shaders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolioz_saved_shaders');
      if (stored) {
        setSavedShaders(JSON.parse(stored));
      }
    } catch {
      // ignore localstorage errors
    }
  }, []);

  // Update code when preset changes
  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setCode(p.code);
    } else {
      const customP = savedShaders.find((item) => item.id === presetId);
      if (customP) {
        setCode(customP.code);
      }
    }
  };

  // Create procedural textures (Noise & Checkerboard)
  const createProceduralTexture = useCallback((gl: WebGLRenderingContext, type: 'noise' | 'checker') => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    const size = 256;
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        if (type === 'noise') {
          const val = Math.floor(Math.random() * 256);
          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = 255;
        } else {
          const check = ((x >> 4) ^ (y >> 4)) & 1;
          const val = check ? 240 : 15;
          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = 255;
        }
      }
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return tex;
  }, []);

  // Initialize WebGL context & compile shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL2 then WebGL1
    let gl = canvas.getContext('webgl2') as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) {
      gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    }

    if (!gl) {
      setErrorLog('WebGL is not supported in your browser.');
      return;
    }
    glRef.current = gl;

    // Create quad vertex shader
    const vsSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    // Build Preamble — includes designer color uniforms
    const preamble = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float iTimeDelta;
      uniform int iFrame;
      uniform vec4 iMouse;
      uniform vec3 iDate;
      uniform sampler2D iChannel0;
      uniform sampler2D iChannel1;
      
      uniform float uSpeed;
      uniform float uZoom;

      // Designer color picker uniforms
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform float uIntensity;
    `;

    // Append main() wrapper if mainImage is present
    let fullFragmentSource = preamble + '\n' + code;
    if (code.includes('mainImage') && !code.includes('void main()')) {
      fullFragmentSource += `\nvoid main() {\n    mainImage(gl_FragColor, gl_FragCoord.xy);\n}`;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    gl.shaderSource(fragmentShader, fullFragmentSource);
    gl.compileShader(fragmentShader);

    // Check compilation error
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const infoLog = gl.getShaderInfoLog(fragmentShader) || 'Unknown GLSL compilation error';
      setErrorLog(infoLog);
      
      // Parse line number from log (e.g. ERROR: 0:42: ...)
      const lineMatch = infoLog.match(/ERROR:\s*\d+:(\d+)/i) || infoLog.match(/:\s*(\d+):/);
      if (lineMatch && lineMatch[1]) {
        const preambleLines = preamble.split('\n').length;
        const lineNum = Math.max(1, parseInt(lineMatch[1], 10) - preambleLines + 1);
        setErrorLine(lineNum);
      } else {
        setErrorLine(null);
      }
      return;
    }

    setErrorLog(null);
    setErrorLine(null);

    // Link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setErrorLog(gl.getProgramInfoLog(program) || 'Shader link error');
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Quad Vertices VBO
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Bind texture for iChannel0
    if (textureType !== 'custom' || !textureObjRef.current) {
      const tex = createProceduralTexture(gl, textureType === 'custom' ? 'noise' : textureType);
      textureObjRef.current = tex;
    }
    if (textureObjRef.current) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureObjRef.current);
      const loc = gl.getUniformLocation(program, 'iChannel0');
      if (loc) gl.uniform1i(loc, 0);
    }
  }, [code, textureType, createProceduralTexture]);

  // Main Render Loop
  useEffect(() => {
    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    lastFrameTimeRef.current = performance.now();

    const render = (now: number) => {
      const gl = glRef.current;
      const program = programRef.current;
      const canvas = canvasRef.current;

      if (gl && program && canvas) {
        // Calculate Canvas Resolution based on resolutionScale
        const displayWidth = Math.floor(canvas.clientWidth * resolutionScale);
        const displayHeight = Math.floor(canvas.clientHeight * resolutionScale);

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
          gl.viewport(0, 0, displayWidth, displayHeight);
        }

        gl.useProgram(program);

        // Accumulate elapsed time using delta to avoid reset on effect re-run
        const dt = (now - lastFrameTimeRef.current) / 1000;
        lastFrameTimeRef.current = now;

        if (isPlaying) {
          elapsedRef.current += dt;
        }

        const elapsedTime = elapsedRef.current;

        // Update display timer (throttled to ~10fps to reduce re-renders)
        if (frameCount % 6 === 0) {
          setTime(elapsedTime);
        }

        // Set Uniforms
        const uRes = gl.getUniformLocation(program, 'iResolution');
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);

        const uTime = gl.getUniformLocation(program, 'iTime');
        if (uTime) gl.uniform1f(uTime, elapsedTime);

        const uTimeDelta = gl.getUniformLocation(program, 'iTimeDelta');
        if (uTimeDelta) gl.uniform1f(uTimeDelta, dt);

        const uFrame = gl.getUniformLocation(program, 'iFrame');
        if (uFrame) gl.uniform1i(uFrame, frameCount);

        const m = mouseRef.current;
        const uMouse = gl.getUniformLocation(program, 'iMouse');
        if (uMouse) gl.uniform4f(uMouse, m.x * resolutionScale, (canvas.clientHeight - m.y) * resolutionScale, m.clickX * resolutionScale, (canvas.clientHeight - m.clickY) * resolutionScale);

        const d = new Date();
        const uDate = gl.getUniformLocation(program, 'iDate');
        if (uDate) gl.uniform3f(uDate, d.getFullYear(), d.getMonth() + 1, d.getDate());

        // Custom tweak sliders
        const uSpd = gl.getUniformLocation(program, 'uSpeed');
        if (uSpd) gl.uniform1f(uSpd, speed);

        const uZm = gl.getUniformLocation(program, 'uZoom');
        if (uZm) gl.uniform1f(uZm, zoom);

        // Designer color uniforms
        const [r1, g1, b1] = hexToRgb(color1);
        const uC1 = gl.getUniformLocation(program, 'uColor1');
        if (uC1) gl.uniform3f(uC1, r1, g1, b1);

        const [r2, g2, b2] = hexToRgb(color2);
        const uC2 = gl.getUniformLocation(program, 'uColor2');
        if (uC2) gl.uniform3f(uC2, r2, g2, b2);

        const [r3, g3, b3] = hexToRgb(color3);
        const uC3 = gl.getUniformLocation(program, 'uColor3');
        if (uC3) gl.uniform3f(uC3, r3, g3, b3);

        const uInt = gl.getUniformLocation(program, 'uIntensity');
        if (uInt) gl.uniform1f(uInt, intensity);

        // Texture unit binding for iChannel0
        if (textureObjRef.current) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textureObjRef.current);
          const uChan0 = gl.getUniformLocation(program, 'iChannel0');
          if (uChan0) gl.uniform1i(uChan0, 0);
        }

        // Draw quad
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Calculate FPS
        frameCount++;
        if (now - lastFpsUpdate >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
          frameCount = 0;
          lastFpsUpdate = now;
        }
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, resolutionScale, speed, zoom, color1, color2, color3, intensity]);

  // Mouse interaction on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.x = x;
    mouseRef.current.y = y;

    if (e.buttons === 1) {
      mouseRef.current.clickX = x;
      mouseRef.current.clickY = y;
      mouseRef.current.isDown = true;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.clickX = x;
    mouseRef.current.clickY = y;
    mouseRef.current.isDown = true;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  // Helper to check power-of-2 dimensions for WebGL textures
  const isPowerOf2 = (val: number) => (val & (val - 1)) === 0;

  // Image Upload handler for iChannel0 texture
  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !glRef.current || !programRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const gl = glRef.current;
        if (!gl || !programRef.current) return;

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        // NPOT (Non-Power-Of-Two) texture compatibility handling
        if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        textureObjRef.current = tex;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        const loc = gl.getUniformLocation(programRef.current, 'iChannel0');
        if (loc) gl.uniform1i(loc, 0);

        setCustomTextureUrl(dataUrl);
        setTextureType('custom');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Quick insert snippet into editor
  const insertSnippet = (snippetCode: string) => {
    setCode((prev) => prev + '\n\n' + snippetCode);
  };

  // Save custom shader preset
  const handleSaveShader = () => {
    if (!customShaderName.trim()) return;
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: customShaderName.trim(),
      code: code
    };
    const updated = [...savedShaders, newPreset];
    setSavedShaders(updated);
    localStorage.setItem('toolioz_saved_shaders', JSON.stringify(updated));
    setSelectedPreset(newPreset.id);
    setCustomShaderName('');
  };

  // Delete custom shader preset
  const handleDeleteCustomShader = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedShaders.filter((item) => item.id !== id);
    setSavedShaders(updated);
    localStorage.setItem('toolioz_saved_shaders', JSON.stringify(updated));
    if (selectedPreset === id) {
      setSelectedPreset('fluid-chrome');
      setCode(PRESETS[0].code);
    }
  };

  // Snapshot PNG download
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `shader-snapshot-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Share URL Generator
  const handleCopyShareLink = () => {
    const encoded = encodeURIComponent(code);
    const url = `${window.location.origin}${window.location.pathname}#shader=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export code generator logic
  const generatedExportCode = useMemo(() => {
    if (activeExportTab === 'html') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WebGL Shader Output</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; }
        canvas { width: 100vw; height: 100vh; display: block; }
    </style>
</head>
<body>
    <canvas id="glcanvas"></canvas>
    <script>
        const canvas = document.getElementById('glcanvas');
        const gl = canvas.getContext('webgl');
        
        const vs = \`attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }\`;
        const fs = \`
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float uSpeed;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uIntensity;

${code}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}\`;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(program);
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

        const loc = gl.getAttribLocation(program, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        // Set color uniforms
        gl.uniform1f(gl.getUniformLocation(program, 'uSpeed'), ${speed.toFixed(1)});
        gl.uniform1f(gl.getUniformLocation(program, 'uZoom'), ${zoom.toFixed(1)});
        gl.uniform3f(gl.getUniformLocation(program, 'uColor1'), ${hexToRgb(color1).map(v => v.toFixed(3)).join(', ')});
        gl.uniform3f(gl.getUniformLocation(program, 'uColor2'), ${hexToRgb(color2).map(v => v.toFixed(3)).join(', ')});
        gl.uniform3f(gl.getUniformLocation(program, 'uColor3'), ${hexToRgb(color3).map(v => v.toFixed(3)).join(', ')});
        gl.uniform1f(gl.getUniformLocation(program, 'uIntensity'), ${intensity.toFixed(1)});

        function render(now) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.uniform2f(gl.getUniformLocation(program, 'iResolution'), canvas.width, canvas.height);
            gl.uniform1f(gl.getUniformLocation(program, 'iTime'), now * 0.001);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    </script>
</body>
</html>`;
    } else if (activeExportTab === 'react') {
      return `import React, { useEffect, useRef } from 'react';

export default function ShaderCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vs = \`attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }\`;
    const fs = \`
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uIntensity;
${code}
void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }\`;

    const vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vs); gl.compileShader(vert);

    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, fs); gl.compileShader(frag);

    const prog = gl.createProgram();
    gl.attachShader(prog, vert); gl.attachShader(prog, frag);
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    // Set designer color uniforms
    gl.uniform1f(gl.getUniformLocation(prog, 'uSpeed'), ${speed.toFixed(1)});
    gl.uniform1f(gl.getUniformLocation(prog, 'uZoom'), ${zoom.toFixed(1)});
    gl.uniform3f(gl.getUniformLocation(prog, 'uColor1'), ${hexToRgb(color1).map(v => v.toFixed(3)).join(', ')});
    gl.uniform3f(gl.getUniformLocation(prog, 'uColor2'), ${hexToRgb(color2).map(v => v.toFixed(3)).join(', ')});
    gl.uniform3f(gl.getUniformLocation(prog, 'uColor3'), ${hexToRgb(color3).map(v => v.toFixed(3)).join(', ')});
    gl.uniform1f(gl.getUniformLocation(prog, 'uIntensity'), ${intensity.toFixed(1)});

    let animId;
    const render = (t) => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(gl.getUniformLocation(prog, 'iResolution'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(prog, 'iTime'), t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}`;
    } else if (activeExportTab === 'three') {
      return `import * as THREE from 'three';

const fragmentShader = \`
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uIntensity;

${code}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
\`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uSpeed: { value: ${speed.toFixed(1)} },
    uZoom: { value: ${zoom.toFixed(1)} },
    uColor1: { value: new THREE.Vector3(${hexToRgb(color1).map(v => v.toFixed(3)).join(', ')}) },
    uColor2: { value: new THREE.Vector3(${hexToRgb(color2).map(v => v.toFixed(3)).join(', ')}) },
    uColor3: { value: new THREE.Vector3(${hexToRgb(color3).map(v => v.toFixed(3)).join(', ')}) },
    uIntensity: { value: ${intensity.toFixed(1)} }
  },
  fragmentShader: fragmentShader,
  vertexShader: \`
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  \`
});

// Inside your animation render loop:
// material.uniforms.iTime.value = clock.getElapsedTime();`;
    } else if (activeExportTab === 'css') {
      // Generate CSS-only static fallback based on current colors
      return `/* CSS-Only Static Fallback Background
   Approximates your shader's color palette as a CSS gradient.
   Use as a fallback for non-WebGL browsers or static pages. */

.shader-background {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${color1} 0%,
    ${color2} 50%,
    ${color3} 100%
  );
  overflow: hidden;
}

/* Animated version using CSS animations */
.shader-background--animated {
  background: linear-gradient(
    -45deg,
    ${color1},
    ${color2},
    ${color3},
    ${color1}
  );
  background-size: 400% 400%;
  animation: shaderGradientShift 8s ease infinite;
}

@keyframes shaderGradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Radial glow variation */
.shader-background--radial {
  background:
    radial-gradient(ellipse at 30% 40%, ${color1}88 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, ${color2}88 0%, transparent 50%),
    radial-gradient(ellipse at 50% 30%, ${color3}88 0%, transparent 50%),
    #0a0a0f;
}`;
    } else if (activeExportTab === 'webcomponent') {
      return `<!-- Self-Contained Web Component: <shader-bg> -->
<!-- Drop this into any HTML page for an animated shader background -->

<shader-bg style="position:fixed;inset:0;z-index:-1;"></shader-bg>

<script>
class ShaderBg extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    shadow.appendChild(canvas);

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vs = \`attribute vec2 p; void main() { gl_Position = vec4(p,0.,1.); }\`;
    const fs = \`
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float uSpeed;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uIntensity;

${code}

void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }\`;

    const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh); return sh; };
    const pg = gl.createProgram();
    gl.attachShader(pg, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(pg, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pg); gl.useProgram(pg);

    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const l = gl.getAttribLocation(pg, 'p');
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(gl.getUniformLocation(pg, 'uSpeed'), ${speed.toFixed(1)});
    gl.uniform1f(gl.getUniformLocation(pg, 'uZoom'), ${zoom.toFixed(1)});
    gl.uniform3f(gl.getUniformLocation(pg, 'uColor1'), ${hexToRgb(color1).map(v => v.toFixed(3)).join(', ')});
    gl.uniform3f(gl.getUniformLocation(pg, 'uColor2'), ${hexToRgb(color2).map(v => v.toFixed(3)).join(', ')});
    gl.uniform3f(gl.getUniformLocation(pg, 'uColor3'), ${hexToRgb(color3).map(v => v.toFixed(3)).join(', ')});
    gl.uniform1f(gl.getUniformLocation(pg, 'uIntensity'), ${intensity.toFixed(1)});

    const render = (now) => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(gl.getUniformLocation(pg,'iResolution'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(pg,'iTime'), now*0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}
customElements.define('shader-bg', ShaderBg);
</script>`;
    } else {
      return code;
    }
  }, [code, activeExportTab, color1, color2, color3, speed, zoom, intensity]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedExportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line count for code editor
  const lineCount = useMemo(() => code.split('\n').length, [code]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-700">
            <Sparkles className="h-4 w-4" />
            <span>WebGL Shader Studio for Designers &amp; Developers</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            WebGL GLSL <span className="text-purple-600">Shader Studio</span> &amp; Playground
          </h1>
          <p className="mt-3 max-w-3xl text-base text-[var(--text-secondary)] sm:text-lg">
            Create stunning animated backgrounds, hero sections, and visual effects for your website. Designer-friendly color pickers, 18 ready-to-use presets, and one-click export to HTML, React, Three.js, CSS, and Web Components.
          </p>

          {/* Privacy Guarantee Badge */}
          <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-left">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-xs text-emerald-900">
              <strong>100% Client-Side Memory Execution:</strong> Shaders compile directly on your graphics card (GPU) locally in your browser. Zero code or canvas frames are uploaded anywhere.
            </p>
          </div>
        </div>

        {/* Category Filter Chips + Preset Selector */}
        <Card className="mb-8 border border-slate-200 bg-white p-5">
          {/* Category Filter Chips */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter:</span>
            </div>
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              All Presets ({PRESETS.length})
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Flame className="h-5 w-5 text-purple-600" />
              <span>Preset Shader Gallery</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Save custom name..."
                value={customShaderName}
                onChange={(e) => setCustomShaderName(e.target.value)}
                className="!h-9 !w-44 !text-xs"
              />
              <Button onClick={handleSaveShader} size="sm" className="!h-9 border border-purple-300 bg-purple-600 text-white hover:bg-purple-700">
                <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" /> Save Preset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                title={preset.desc}
                className={`group flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                  selectedPreset === preset.id
                    ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                    : 'border-slate-200 bg-slate-50/50 hover:border-purple-300 hover:bg-white'
                }`}
              >
                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-purple-600">
                  {preset.category}
                </span>
                <span className="line-clamp-2 text-xs font-bold text-slate-900 group-hover:text-purple-700">
                  {preset.name}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[0.65rem] text-slate-500 leading-tight">
                  {preset.desc}
                </span>
              </button>
            ))}

            {/* Custom Saved Presets */}
            {savedShaders.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`group relative flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                  selectedPreset === preset.id
                    ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                    : 'border-slate-200 bg-amber-50/30 hover:border-purple-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-amber-600">
                    Saved
                  </span>
                  <Trash2
                    onClick={(e) => handleDeleteCustomShader(preset.id, e)}
                    className="h-3 w-3 text-slate-400 hover:text-red-600"
                  />
                </div>
                <span className="line-clamp-1 text-xs font-bold text-slate-900 group-hover:text-purple-700">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Main Interactive Studio Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: WebGL Live Canvas Preview */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            <Card className="relative overflow-hidden border border-slate-200 bg-slate-950 p-0">
              {/* Canvas Container */}
              <div className="relative aspect-square w-full sm:aspect-[4/3] bg-black">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  className="h-full w-full cursor-crosshair touch-none"
                />

                {/* Status Bar Overlay */}
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-bold text-emerald-400">{fps} FPS</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-mono text-slate-300">{(time).toFixed(1)}s</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-mono text-purple-300">{resolutionScale}x Res</span>
                </div>

                {/* Error Banner Overlay */}
                {errorLog && (
                  <div className="absolute inset-x-0 bottom-0 max-h-48 overflow-y-auto border-t border-red-500 bg-red-950/90 p-3 text-xs text-red-200 backdrop-blur-md">
                    <div className="mb-1 flex items-center gap-2 font-bold text-red-400">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>GLSL Compilation Error {errorLine && `(Line ${errorLine})`}</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[0.75rem] leading-relaxed text-red-300">
                      {errorLog}
                    </pre>
                  </div>
                )}
              </div>

              {/* Canvas Toolbar Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 p-3 text-white">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    size="sm"
                    className={`!h-8 !px-3 font-bold text-xs ${
                      isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isPlaying ? <Pause className="mr-1 h-3.5 w-3.5" /> : <Play className="mr-1 h-3.5 w-3.5" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>

                  <Button
                    onClick={() => { elapsedRef.current = 0; lastFrameTimeRef.current = performance.now(); setTime(0); }}
                    size="sm"
                    className="!h-8 !px-3 border border-slate-700 bg-slate-800 text-xs hover:bg-slate-700"
                  >
                    <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
                  </Button>
                </div>

                {/* Resolution Multiplier */}
                <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
                  <span className="px-2 text-slate-400 font-bold">Scale:</span>
                  {[0.5, 1.0, 2.0].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setResolutionScale(scale)}
                      className={`rounded px-2 py-0.5 font-mono text-xs ${
                        resolutionScale === scale ? 'bg-purple-600 font-bold text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>

                {/* Action Downloads */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleDownloadSnapshot}
                    size="sm"
                    className="!h-8 border border-purple-500/40 bg-purple-900/50 text-xs text-purple-200 hover:bg-purple-800"
                  >
                    <Download className="mr-1 h-3.5 w-3.5" /> PNG
                  </Button>

                  <Button
                    onClick={handleCopyShareLink}
                    size="sm"
                    className="!h-8 border border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    <Share2 className="mr-1 h-3.5 w-3.5" /> Share
                  </Button>
                </div>
              </div>
            </Card>

            {/* Designer Controls: Colors + Uniforms + Textures */}
            <Card className="border border-slate-200 bg-white p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Palette className="h-4 w-4 text-purple-600" />
                <span>Designer Controls &amp; Color Palette</span>
              </h2>

              {/* Color Picker Row */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Color 1 (uColor1)</span>
                    <span className="font-mono text-purple-600 text-[0.65rem]">{color1}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    />
                    <input
                      type="text"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 font-mono text-xs text-slate-700 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Color 2 (uColor2)</span>
                    <span className="font-mono text-purple-600 text-[0.65rem]">{color2}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    />
                    <input
                      type="text"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 font-mono text-xs text-slate-700 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Color 3 (uColor3)</span>
                    <span className="font-mono text-purple-600 text-[0.65rem]">{color3}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    />
                    <input
                      type="text"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 font-mono text-xs text-slate-700 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-4 border-t border-slate-100" />

              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                <Sliders className="h-3.5 w-3.5 text-purple-600" />
                <span>Uniform Parameters</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Speed Slider */}
                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold text-slate-700">
                    <span>Speed (uSpeed)</span>
                    <span className="font-mono text-purple-600">{speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                {/* Zoom / Scale Slider */}
                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold text-slate-700">
                    <span>Zoom (uZoom)</span>
                    <span className="font-mono text-purple-600">{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                {/* Intensity Slider */}
                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold text-slate-700">
                    <span>Intensity (uIntensity)</span>
                    <span className="font-mono text-purple-600">{intensity.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              {/* Texture Sampler Slot: iChannel0 */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Texture Sampler Input (iChannel0)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setTextureType('noise')}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                      textureType === 'noise' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Procedural Noise
                  </button>
                  <button
                    onClick={() => setTextureType('checker')}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                      textureType === 'checker' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Checkerboard
                  </button>

                  {textureType === 'custom' && customTextureUrl && (
                    <button
                      onClick={() => setTextureType('custom')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-600 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700"
                    >
                      <img src={customTextureUrl} alt="Uploaded texture" className="h-5 w-5 rounded object-cover border border-purple-300" />
                      <span>Custom Image</span>
                    </button>
                  )}

                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
                    <Upload className="h-3.5 w-3.5 text-purple-600" />
                    <span>{customTextureUrl ? 'Change Image' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleTextureUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Code Editor & Quick Snippets */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            <Card className="flex flex-1 flex-col overflow-hidden border border-slate-800 bg-slate-950 p-0">
              {/* Editor Header Toolbar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-purple-400" />
                  <span className="font-bold text-slate-100">Fragment Shader (GLSL)</span>
                </div>

                <div className="flex items-center gap-2">
                  {errorLog ? (
                    <span className="rounded bg-red-900/60 px-2 py-0.5 font-bold text-red-300 text-[0.7rem]">
                      Compile Error
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-900/60 px-2 py-0.5 font-bold text-emerald-300 text-[0.7rem]">
                      Valid GLSL
                    </span>
                  )}
                </div>
              </div>

              {/* Code Snippets Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/80 bg-slate-900/50 p-2 text-xs">
                <span className="shrink-0 font-bold text-slate-400 text-[0.7rem] uppercase px-1">
                  Insert Snippet:
                </span>
                {SNIPPETS.map((snip) => (
                  <button
                    key={snip.name}
                    onClick={() => insertSnippet(snip.code)}
                    className="shrink-0 rounded border border-slate-800 bg-slate-800/80 px-2 py-1 text-[0.7rem] font-semibold text-purple-300 hover:border-purple-500 hover:bg-purple-950 hover:text-white"
                  >
                    + {snip.name}
                  </button>
                ))}
              </div>

              {/* Textarea Code Editor with Line Numbers */}
              <div className="relative flex flex-1 overflow-hidden font-mono text-xs leading-relaxed">
                {/* Line numbers column */}
                <div className="select-none border-r border-slate-800 bg-slate-900/80 px-3 py-3 text-right text-slate-600">
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div
                      key={i}
                      className={errorLine === i + 1 ? 'font-bold text-red-400 bg-red-950/50' : ''}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Editor Textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="w-full flex-1 resize-none bg-slate-950 p-3 text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs leading-relaxed"
                />
              </div>
            </Card>

            {/* Export Code Box */}
            <Card className="border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <FileCode className="h-4 w-4 text-purple-600" />
                  <span>Export Code Snippet</span>
                </div>

                <Button
                  onClick={handleCopyCode}
                  size="sm"
                  className="!h-8 border border-purple-300 bg-purple-50 text-xs font-bold text-purple-700 hover:bg-purple-100"
                >
                  {copied ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>

              {/* Export Tabs */}
              <div className="mb-3 flex flex-wrap border-b border-slate-200 text-xs font-bold">
                {[
                  { id: 'html', label: 'Vanilla HTML' },
                  { id: 'react', label: 'React TSX' },
                  { id: 'three', label: 'Three.js' },
                  { id: 'css', label: 'CSS Fallback' },
                  { id: 'webcomponent', label: 'Web Component' },
                  { id: 'glsl', label: 'Raw GLSL' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveExportTab(tab.id as any)}
                    className={`border-b-2 px-3 py-2 transition-colors ${
                      activeExportTab === tab.id
                        ? 'border-purple-600 text-purple-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Code Snippet Box */}
              <div className="max-h-48 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[0.75rem] text-slate-200">
                <pre>{generatedExportCode}</pre>
              </div>
            </Card>
          </div>
        </div>

        {/* Educational & SEO Documentation Guide */}
        <section className="mt-16 border-t border-slate-200 pt-12">
          <SEOSection
            title="WebGL Shader Studio — Animated Backgrounds for Web Designers"
            description="Create, customize, and export stunning animated WebGL backgrounds for your website. Designer-friendly color pickers, 18 production-ready presets (aurora gradients, particle constellations, wave layers, mesh gradients, geometric patterns, dark mode orbs), and instant export to HTML, React, Three.js, CSS fallbacks, and Web Components."
            howToUse={[
              "Browse the preset gallery — filter by category (Hero Backgrounds, Gradients & Blobs, Geometric Patterns, Ambient & Texture, Dark Mode FX) or view all 18 presets.",
              "Customize colors instantly using the 3 color pickers (uColor1, uColor2, uColor3) — every designer preset responds to your palette.",
              "Fine-tune the animation with Speed, Zoom, and Intensity sliders for the perfect look.",
              "Edit GLSL code directly in the live editor with instant compilation and inline error reporting.",
              "Export your shader to Standalone HTML, React TSX, Three.js ShaderMaterial, CSS-only fallback gradient, self-contained Web Component, or download a PNG snapshot."
            ]}
            benefits={[
              "Designer-Friendly: 3 color pickers + intensity slider let you match your brand palette without touching code.",
              "18 Production-Ready Presets: Aurora gradients, particle constellations, wave layers, liquid blobs, mesh gradients, grid pulses, hex tessellations, noise grain, spotlight glow, gradient orbs, and classic developer shaders.",
              "6 Export Formats: Vanilla HTML, React TSX, Three.js ShaderMaterial, CSS-only fallback, Web Component (<shader-bg>), and raw GLSL.",
              "Hardware Accelerated: Compiles directly on your GPU for smooth 60+ FPS rendering.",
              "100% Client-Side Privacy: All shader execution stays local in browser memory with zero network uploads."
            ]}
          />

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-black text-[var(--text-primary)]">
              Frequently Asked Questions (FAQ)
            </h2>
            <FAQSchema
              faqs={[
                {
                  question: "How do I use these shaders as website backgrounds?",
                  answer: "Select a preset, customize the colors using the 3 color pickers, adjust speed and intensity, then click the Export tab. Choose 'Vanilla HTML' for a standalone page, 'React TSX' for React apps, 'Web Component' for a drop-in <shader-bg> element, or 'CSS Fallback' for a static gradient approximation."
                },
                {
                  question: "Can I match the shader colors to my brand palette?",
                  answer: "Yes! The Designer Controls panel includes 3 color pickers (uColor1, uColor2, uColor3) that all designer presets respond to. Enter your brand hex colors directly, and the shader updates in real-time. The export code will include your chosen colors."
                },
                {
                  question: "Is this WebGL GLSL Shader tool compatible with Shadertoy code?",
                  answer: "Yes! The tool natively supports standard Shadertoy syntax including void mainImage(out vec4 fragColor, in vec2 fragCoord) and built-in uniforms like iTime, iResolution, iMouse, iTimeDelta, iFrame, and iChannel0."
                },
                {
                  question: "Can I export shaders to my React or Three.js application?",
                  answer: "Absolutely. Click the Export Code tab to get copy-paste snippets for vanilla WebGL HTML files, React TSX components, Three.js ShaderMaterial definitions, CSS-only fallback gradients, self-contained Web Components, or raw GLSL code."
                },
                {
                  question: "What is the CSS Fallback export?",
                  answer: "The CSS Fallback generates a pure CSS background gradient that approximates your shader's color palette. Use it as a fallback for browsers that don't support WebGL, or for static pages where you want a matching gradient without JavaScript."
                },
                {
                  question: "Are my custom shaders saved locally?",
                  answer: "Yes, you can save custom shader presets directly to your browser's LocalStorage or copy a shareable link containing your encoded shader code."
                },
                {
                  question: "Does rendering shaders locally compromise privacy?",
                  answer: "Not at all. Everything executes 100% client-side inside your browser's WebGL graphics memory. No graphics data or code is ever uploaded to any external server."
                }
              ]}
            />
          </div>

          {/* Related Tools */}
          <div className="mt-12">
            <RelatedTools currentToolId="shader-tool" categoryId="design" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
