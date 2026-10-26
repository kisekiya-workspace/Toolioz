"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-sm font-normal leading-none transition-[background-color,color] duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0072F5] !text-white hover:bg-[#005FCC]",
        primary:
          "bg-[#0072F5] !text-white hover:bg-[#005FCC]",
        brand:
          "bg-[#0072F5] !text-white hover:bg-[#005FCC]",
        destructive:
          "bg-[#E5484D] text-white hover:bg-[#c9373c]",
        outline:
          "bg-white text-[#171717] shadow-[var(--ds-shadow-border)] hover:bg-[#f2f2f2] dark:bg-[#111] dark:text-[#ededed] dark:hover:bg-[#262626]",
        secondary:
          "bg-[#f2f2f2] text-[#171717] hover:bg-[#ebebeb] dark:bg-[#171717] dark:text-[#ededed] dark:hover:bg-[#262626]",
        ghost: "bg-transparent text-[#4D4D4D] hover:bg-[#EBEBEB] hover:text-[#171717] dark:text-[#A1A1A1] dark:hover:bg-[#262626] dark:hover:text-[#EDEDED]",
        link: "text-[#0072F5] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 gap-1 rounded-[6px] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-[6px] px-3 text-sm",
        lg: "h-12 rounded-[6px] px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-[6px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[6px]",
        "icon-lg": "size-12 rounded-[6px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, className }),
            fullWidth && "w-full"
          )}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full",
          loading && "opacity-80 cursor-wait"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin size-4" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
