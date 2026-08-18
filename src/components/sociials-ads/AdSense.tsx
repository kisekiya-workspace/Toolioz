import Script from "next/script";

export function AdSense({ publisherId }: { publisherId: string }) {
    if (!publisherId) return null;

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
