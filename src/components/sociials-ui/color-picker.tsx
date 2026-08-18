"use client";

import { useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/sociials-ui/popover";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { cn } from "@/lib/sociials-utils";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    label?: string; // Optional label for accessibility/tooltip
}

export function ColorPicker({ value, onChange, className, label, squareClassName }: ColorPickerProps & { squareClassName?: string }) {
    // Ensure value is a valid hex string for display, fallback to black if empty
    const safeValue = useMemo(() => {
        if (!value) return "#000000";
        return value.startsWith("#") ? value : `#${value}`;
    }, [value]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className={cn("flex items-center gap-2 cursor-pointer group", className)}>
                    <div
                        className={cn("w-10 h-10 rounded-md border-2 border-border shadow-sm transition-transform group-hover:scale-105", squareClassName)}
                        style={{ backgroundColor: safeValue }}
                    />
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="uppercase font-mono w-28 cursor-pointer focus:cursor-text"
                        maxLength={7}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                    {/* Custom styles to override react-colorful defaults if needed, 
                         but usually it looks good out of the box. 
                         We can add a title or label here if requested. */}
                    {label && <p className="text-xs font-semibold text-muted-foreground">{label}</p>}

                    <HexColorPicker color={safeValue} onChange={onChange} />

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Hex Code</p>
                        <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="uppercase font-mono h-8"
                            maxLength={7}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// A smaller, icon-only version for tight spaces (like the mesh points list)
export function MiniColorPicker({ value, onChange, className }: ColorPickerProps) {
    const safeValue = useMemo(() => {
        if (!value) return "#000000";
        return value.startsWith("#") ? value : `#${value}`;
    }, [value]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-8 h-8 p-0 rounded-full border-2 overflow-hidden shrink-0", className)}
                    style={{ backgroundColor: safeValue }}
                >
                    <span className="sr-only">Pick color</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
                <HexColorPicker color={safeValue} onChange={onChange} />
            </PopoverContent>
        </Popover>
    );
}
