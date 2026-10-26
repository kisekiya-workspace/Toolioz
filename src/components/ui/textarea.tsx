import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  mono?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, mono = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[6px] bg-transparent px-3 py-2 text-sm shadow-[var(--ds-shadow-border)] placeholder:text-[#8F8F8F] focus-visible:outline-[#005FCC] focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50",
          mono && "font-mono text-xs",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
