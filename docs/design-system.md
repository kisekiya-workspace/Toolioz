# Toolioz Design System & Component Reference

This reference guide documents component conventions, margin/padding standards, button states, and layout patterns for developers building tools on Toolioz.

## Spacing & Layout Matrix

| Layout Element | Tailwind Classes | Purpose |
| :--- | :--- | :--- |
| **Main Page Container** | `mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12` | Centers content with responsive horizontal & vertical padding |
| **Header Hero Box** | `text-center max-w-3xl mx-auto mb-10` | Hero section wrapper with constrained text width |
| **Two-Column Workspace** | `grid grid-cols-1 lg:grid-cols-12 gap-8 items-start` | Left column controls (`lg:col-span-5`), Right column preview (`lg:col-span-7`) |
| **Card Container** | `bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm` | Primary surface container |
| **Sub-Group Box** | `p-4 bg-slate-50 border border-slate-200 rounded-xl` | Inner grouped form or options panel |

## Button Design Tokens

### Primary CTA
```tsx
<button className="px-5 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition">
  Action Label
</button>
```

### Secondary Button
```tsx
<button className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition">
  Secondary Action
</button>
```

### Subtle / Outline Button
```tsx
<button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition">
  Outline Action
</button>
```

## Form Input & Range Slider Pattern
```tsx
<div>
  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
    <span>Label Name</span>
    <span className="text-pink-600 font-mono">Value</span>
  </div>
  <input
    type="range"
    className="w-full accent-pink-600 bg-slate-200 rounded-lg cursor-pointer"
  />
</div>
```

## Standard Section Separator
```tsx
<hr className="border-slate-100 my-6" />
```
