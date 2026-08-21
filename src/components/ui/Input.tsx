import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  mono?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      prefix,
      suffix,
      icon,
      mono = false,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || (label ? generatedId : undefined);
    const leftAddon = prefix || icon;

    const inputElement = (
      <div className="relative flex items-center w-full">
        {leftAddon && (
          <div className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none [&_svg]:size-4">
            {leftAddon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
            leftAddon && "pl-9",
            suffix && "pr-9",
            mono && "font-mono text-xs",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center justify-center text-muted-foreground pointer-events-none [&_svg]:size-4">
            {suffix}
          </div>
        )}
      </div>
    );

    if (label || helperText) {
      return (
        <div className="space-y-1.5 w-full text-left">
          {label && (
            <Label htmlFor={inputId} className="text-xs font-semibold text-foreground">
              {label}
            </Label>
          )}
          {inputElement}
          {helperText && (
            <p className="text-[11px] text-muted-foreground leading-normal">
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return inputElement;
  }
);
Input.displayName = "Input";

export { Input };
