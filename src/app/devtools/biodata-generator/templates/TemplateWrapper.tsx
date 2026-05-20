import React from 'react';

interface TemplateWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TemplateWrapper = ({ children, className = '', style }: TemplateWrapperProps) => (
  <div
    id="biodata-document"
    className={`w-[794px] min-h-[1123px] bg-white text-gray-800 relative overflow-hidden ${className}`}
    style={style}
  >
    {children}
  </div>
);
