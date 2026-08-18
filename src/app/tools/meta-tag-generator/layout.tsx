import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Meta Tag Generator | Toolioz Tools",
    description: "Generate SEO meta tags for your website.",
    keywords: ["meta tag generator","seo tools","meta tags"],
    alternates: {
        canonical: "/tools/meta-tag-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Meta Tag Generator",
        "description": "Generate SEO meta tags for your website.",
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
