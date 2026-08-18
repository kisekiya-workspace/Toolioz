import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Image to PDF | Toolioz Tools",
    description: "Convert multiple images into a single PDF document.",
    keywords: ["image to pdf","jpg to pdf","photos to pdf"],
    alternates: {
        canonical: "/tools/image-to-pdf",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image to PDF",
        "description": "Convert multiple images into a single PDF document.",
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
