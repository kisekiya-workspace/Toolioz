import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const variantClasses = {
    primary:
      'bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)] hover:shadow-md',
    secondary:
      'border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]',
    ghost: 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
    outline:
      'border-2 border-[var(--primary)] bg-transparent text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClass = [
    'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium outline-none transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
