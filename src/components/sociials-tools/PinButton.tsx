"use client";

import { useFavorites } from "@/hooks/use-sociials-favorites";
import { Pin } from "lucide-react";
import { Button } from "@/components/sociials-ui/button";
import { cn } from "@/lib/sociials-utils";

interface PinButtonProps {
    href: string;
    className?: string; // Optional className prop for positioning
}

export function PinButton({ href, className }: PinButtonProps) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

    // Safety check for hydration mismatch, though isLoaded handles it mostly.
    if (!isLoaded) return null;

    const isPinned = isFavorite(href);

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary",
                className
            )}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(href);
            }}
        >
            <Pin className={cn("h-4 w-4 transition-all", isPinned ? "fill-primary text-primary rotate-45" : "text-muted-foreground")} />
        </Button>
    )
}
