import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Unit Converter | Toolioz Tools",
    description: "Convert length, weight, temperature, and more.",
    keywords: ["unit converter","measurement converter","metric convert"],
    alternates: {
        canonical: "/tools/unit-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Unit Converter",
        "description": "Convert length, weight, temperature, and more.",
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
