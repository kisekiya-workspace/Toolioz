"use client";
import React from "react";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      className="flex items-center justify-between bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 rounded-xl h-9 px-3 mb-1.5 cursor-pointer select-none transition-colors shadow-inner"
    >
      <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </span>

      <div
        className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${
          value ? "bg-indigo-600" : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 ${
            value ? "left-4" : "left-0.5"
          }`}
        />
      </div>
    </div>
  );
}
