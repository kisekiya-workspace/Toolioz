"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

interface AdContainerProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle";
    responsive?: "true" | "false";
    className?: string;
}

export function AdContainer({ slot, format = "auto", responsive = "true", className = "" }: AdContainerProps) {
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    const pathname = usePathname();
    const isLegacyToolPage = pathname.startsWith("/tools/");

    useEffect(() => {
        if (!publisherId || isLegacyToolPage) return;
        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        } catch (err) {
            console.error("AdSense push error:", err);
        }
    }, [isLegacyToolPage, publisherId, slot]);

    // If AdSense publisher ID is not configured, do not render placeholder to prevent AdSense "Site Under Construction" rejections
    if (!publisherId || isLegacyToolPage) {
        return null;
    }

    return (
        <div className={`my-8 overflow-hidden min-h-[100px] flex items-center justify-center rounded-xl transition-all ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block", textAlign: "center" }}
                data-ad-client={publisherId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
}
