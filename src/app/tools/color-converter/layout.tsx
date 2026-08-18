import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Color Converter | Toolioz Tools",
    description: "Convert colors between HEX, RGB, HSL, and CMYK formats.",
    keywords: ["color converter","hex to rgb","rgb to hex"],
    alternates: {
        canonical: "/tools/color-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Color Converter",
        "description": "Convert colors between HEX, RGB, HSL, and CMYK formats.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            {children}
        </>
    );
}
