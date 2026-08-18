import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Barcode Generator | Toolioz Tools",
    description: "Generate custom barcodes (UPC, EAN, Code 128) for specific data or URLs.",
    keywords: ["barcode generator","qr code","upc generator"],
    alternates: {
        canonical: "/tools/barcode-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Barcode Generator",
        "description": "Generate custom barcodes (UPC, EAN, Code 128) for specific data or URLs.",
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
