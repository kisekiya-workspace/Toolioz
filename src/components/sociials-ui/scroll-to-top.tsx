"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/sociials-ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/sociials-utils";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const toggleVisibility = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 300) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn(
                "fixed bottom-24 md:bottom-8 right-6 z-40 rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}
            onClick={scrollToTop}
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
