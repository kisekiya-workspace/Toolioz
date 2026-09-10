"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLowValuePublisherPath } from "@/lib/tools";

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
    const hideAds = isLowValuePublisherPath(pathname);

    useEffect(() => {
        if (!publisherId || hideAds) return;
        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        } catch (err) {
            console.error("AdSense push error:", err);
        }
    }, [hideAds, publisherId, slot]);

    // Do not render ads on thin, duplicate, or withheld pages.
    if (!publisherId || hideAds) {
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
