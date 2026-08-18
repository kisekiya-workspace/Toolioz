import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "PDF to Image | Toolioz Tools",
    description: "Convert PDF pages to JPG or PNG images.",
    keywords: ["pdf to image","pdf to jpg","pdf converter"],
    alternates: {
        canonical: "/tools/pdf-to-image",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PDF to Image",
        "description": "Convert PDF pages to JPG or PNG images.",
        "applicationCategory": "MultimediaApplication",
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
