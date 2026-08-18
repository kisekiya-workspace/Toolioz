import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Base64 Converter | Toolioz Tools",
    description: "Encode and decode text or files to Base64 format instantly.",
    keywords: ["base64 encode","base64 decode","base64 converter"],
    alternates: {
        canonical: "/tools/base64-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Base64 Converter",
        "description": "Encode and decode text or files to Base64 format instantly.",
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
