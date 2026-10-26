import { metadataForImportedTool } from '@/lib/sociials-tool-metadata';
import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = metadataForImportedTool('image-converter');

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image Converter",
        "description": "Draws an image on a canvas and saves PNG, JPEG, or WebP. The file is not uploaded.",
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
