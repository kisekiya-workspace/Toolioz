import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Image Compressor | Toolioz Tools",
    description: "Compress images (PNG, JPG, WebP) without losing quality.",
    keywords: ["image compressor","reduce image size","compress photos"],
    alternates: {
        canonical: "/tools/image-compressor",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image Compressor",
        "description": "Compress images (PNG, JPG, WebP) without losing quality.",
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
