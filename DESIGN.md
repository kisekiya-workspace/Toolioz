# Toolioz Design & Layout System Guidelines

This document outlines the core UI, spacing, layout, typography, and architectural rules for building tools and pages across the Toolioz platform.

---

## 1. Global Layout & Container Rules

### Root Layout Architecture
- **Navbar & Breadcrumbs**:
  - The root layout (`src/app/layout.tsx`) automatically mounts the global `<Navbar />` and `<Breadcrumbs />`.
  - **CRITICAL RULE**: Do **NOT** render `<Navbar />` inside individual client tool components (`Client.tsx` files). Doing so will create duplicate navigation bars.
- **Footer**:
  - Each client tool or page component mounts `<Footer />` at the bottom of the page wrapper.

### Standard Page Widths & Spacing
- **Tool Workspace Container**:
  - Wrapper: `<main className="mx-auto w-full max-w-[1100px] flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">`
  - Max Width: `1100px` (or `1200px` for complex multi-column dashboards).
  - Horizontal Padding: `px-4` on mobile, `sm:px-6`, `lg:px-8` on larger screens.
  - Vertical Padding: `py-8` on mobile, `sm:py-12` on desktop.

---

## 2. Color Palette & Surface Tokens

All components should use CSS design variables defined in `src/app/globals.css`:

| Token | Hex Value (Light) | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--primary` | `#2563eb` (Blue 600) | `#3b82f6` | Primary CTAs, active highlights, key links |
| `--primary-hover` | `#1d4ed8` (Blue 700) | `#60a5fa` | Hover state for primary buttons |
| `--bg-primary` | `#ffffff` (White) | `#020617` | Page background |
| `--bg-secondary` | `#f1f5f9` (Slate 100) | `#0f172a` | Card headers, secondary containers |
| `--text-primary` | `#0f172a` (Slate 900) | `#f8fafc` | Primary headings and main text |
| `--text-secondary` | `#334155` (Slate 700) | `#cbd5e1` | Descriptions, body text, form labels |
| `--border` | `#e2e8f0` (Slate 200) | `#1e293b` | Default card and container borders |

### Category Accent Accents
- **DevTools**: Pink / Cyan / Slate accents (`#ec4899`, `#06b6d4`, `#f59e0b`).
- **Finance**: Blue / Emerald accents (`#2563eb`, `#10b981`, `#0ea5e9`).
- **PDF Tools**: Red / Indigo accents (`#ef4444`, `#6366f1`).
- **Biodata Tools**: Pink / Rose accents (`#db2777`).

---

## 3. Component Geometry & Surface Styling

### Cards & Panels
- **Standard Card Style**:
  ```tsx
  className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm"
  ```
- **Control Group Box**:
  ```tsx
  className="bg-slate-50/60 border border-slate-200 rounded-xl p-4"
  ```
- **Border Radius Standards**:
  - Buttons / Inputs: `rounded-xl` (`12px`) or `rounded-lg` (`8px`)
  - Cards / Containers: `rounded-2xl` (`16px`)
  - Hero Pill Badges: `rounded-full`

---

## 4. Typography & SEO Heading Hierarchy

Strict SEO compliance requires proper heading tag hierarchy:

- **`<h1>` (Page Title)**:
  - Exactly **1 `<h1>` tag** per page inside `<header>` or top hero container.
  - Example: `<h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">...</h1>`
- **`<h2>` (Section Titles)**:
  - Major section headers (e.g. *Dither Algorithms*, *Download Actions*, *What is Dithering*, *FAQs*, *Explore Related Tools*).
  - Example: `<h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">...</h2>`
- **`<h3>` (Sub-cards & Items)**:
  - Group items, individual algorithm titles, tool cards in lists, FAQ question headings.
  - Example: `<h3 className="font-bold text-[var(--text-primary)] text-base mb-2">{faq.question}</h3>`
- **`<h4>` (Micro Details)**:
  - Card metadata attributes (e.g., *Why It Matters*, *Best For* inside comparison cards).

---

## 5. Privacy & Verification Badges

Every tool page must feature a **100% Client-Side Privacy Guarantee** badge:
```tsx
<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
  <p className="text-xs text-emerald-900 leading-relaxed">
    <strong>100% Client-Side Privacy Guarantee:</strong> All calculations run locally in your web browser memory. No data is sent to any external server.
  </p>
</div>
```
