import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
        destructive:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
        outline:
          "border border-zinc-200 text-zinc-800 bg-white dark:border-zinc-800 dark:text-zinc-200 dark:bg-zinc-900",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
        info:
          "border border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
        mono:
          "font-mono text-[11px] border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.25 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

function Badge({
  className,
  variant,
  size,
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            variant === "success" && "bg-emerald-500",
            variant === "warning" && "bg-amber-500",
            variant === "destructive" && "bg-red-500",
            variant === "info" && "bg-blue-500",
            variant === "default" && "bg-white dark:bg-zinc-900",
            variant === "secondary" && "bg-zinc-600",
            variant === "outline" && "bg-emerald-500",
            variant === "mono" && "bg-blue-600",
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
