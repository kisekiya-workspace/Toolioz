import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Lorem Ipsum Generator | Toolioz Tools",
    description: "Generate placeholder text for designs and mockups.",
    keywords: ["lorem ipsum","dummy text","placeholder text"],
    alternates: {
        canonical: "/tools/lorem-ipsum",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Lorem Ipsum Generator",
        "description": "Generate placeholder text for designs and mockups.",
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
