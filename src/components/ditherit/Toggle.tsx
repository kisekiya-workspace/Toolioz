"use client";
import React from "react";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-3 py-2 text-left cursor-pointer select-none"
    >
      <span className="text-xs text-zinc-700 dark:text-zinc-300">
        {label}
      </span>

      <div
        className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${
          value ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-700"
        }`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${
            value ? "left-4 bg-white dark:bg-zinc-950" : "left-0.5 bg-zinc-400 dark:bg-zinc-400"
          }`}
        />
      </div>
    </button>
  );
}

