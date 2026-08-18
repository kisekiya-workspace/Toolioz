import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Box Shadow Generator | Toolioz Tools",
    description: "Create beautiful CSS box shadows with a visual editor and copy the code code.",
    keywords: ["css box shadow","shadow generator","css generator"],
    alternates: {
        canonical: "/tools/box-shadow-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Box Shadow Generator",
        "description": "Create beautiful CSS box shadows with a visual editor and copy the code code.",
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
