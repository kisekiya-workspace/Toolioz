import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Image Converter | Toolioz Tools",
    description: "Convert images between JPG, PNG, WebP, and other formats.",
    keywords: ["image converter","png to jpg","webp converter"],
    alternates: {
        canonical: "/tools/image-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image Converter",
        "description": "Convert images between JPG, PNG, WebP, and other formats.",
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
