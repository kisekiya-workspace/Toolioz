import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "PDF Splitter | Toolioz Tools",
    description: "Split a PDF file into individual pages or ranges.",
    keywords: ["pdf splitter","split pdf","extract pdf pages"],
    alternates: {
        canonical: "/tools/pdf-splitter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PDF Splitter",
        "description": "Split a PDF file into individual pages or ranges.",
        "applicationCategory": "Utility",
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
