import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "QR Code Generator | Toolioz Tools",
    description: "Create QR codes for URLs, text, Wi-Fi, and more.",
    keywords: ["qr generator","qrcode maker","barcode"],
    alternates: {
        canonical: "/tools/qr-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QR Code Generator",
        "description": "Create QR codes for URLs, text, Wi-Fi, and more.",
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
