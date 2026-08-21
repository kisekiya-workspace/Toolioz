"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon, Pin } from "lucide-react";
import { Badge } from "@/components/sociials-ui/badge";
import { Button } from "@/components/sociials-ui/button";
import { cn } from "@/lib/sociials-utils";
import { useFavorites } from "@/hooks/use-sociials-favorites";

interface ToolListItemProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    category: string;
    isNew?: boolean;
}

export function ToolListItem({ title, description, href, icon: Icon, category, isNew }: ToolListItemProps) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
    const isPinned = isLoaded ? isFavorite(href) : false;

    return (
        <div className="relative mb-3 last:mb-0 group">
            <Link href={href} className="flex items-center gap-4 p-4 bg-card rounded-2xl border active:scale-[0.98] transition-all hover:bg-card/50">
                {/* Icon Box */}
                <div className="shrink-0 relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    {isNew && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-base text-foreground truncate">{title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
                </div>

                <div className="w-8"></div> {/* Spacer for the absolute button */}
            </Link>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(href);
                }}
            >
                <Pin className={cn("h-4 w-4 transition-all", isPinned && "fill-primary text-primary rotate-45")} />
            </Button>
        </div>
    );
}
