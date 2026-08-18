import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Color Palette Generator | Toolioz Tools",
    description: "Generate beautiful color palettes for your designs and projects.",
    keywords: ["color palette","color scheme","design tools"],
    alternates: {
        canonical: "/tools/color-palette",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Color Palette Generator",
        "description": "Generate beautiful color palettes for your designs and projects.",
        "applicationCategory": "DesignApplication",
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
