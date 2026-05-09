import React from 'react';

interface TemplateWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const TemplateWrapper = ({ children, className = '' }: TemplateWrapperProps) => (
  <div 
    id="biodata-document"
    className={`w-[794px] min-h-[1123px] bg-white text-gray-800 shadow-sm relative overflow-hidden ${className}`}
  >
    {children}
  </div>
);
