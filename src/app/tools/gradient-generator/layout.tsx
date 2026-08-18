import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "CSS Gradient Generator | Toolioz Tools",
    description: "Create stunning CSS gradients with a visual editor.",
    keywords: ["css gradient","gradient generator","background generator"],
    alternates: {
        canonical: "/tools/gradient-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CSS Gradient Generator",
        "description": "Create stunning CSS gradients with a visual editor.",
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
