import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "URL Encoder/Decoder | Toolioz Tools",
    description: "Encode or decode URLs for safe usage.",
    keywords: ["url encoder","url decoder","url tools"],
    alternates: {
        canonical: "/tools/url-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "URL Encoder/Decoder",
        "description": "Encode or decode URLs for safe usage.",
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
