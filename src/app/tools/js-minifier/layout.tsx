import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "JS Minifier | Toolioz Tools",
    description: "Minify JavaScript code to optimize performance.",
    keywords: ["js minifier","javascript compressor","uglify js"],
    alternates: {
        canonical: "/tools/js-minifier",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JS Minifier",
        "description": "Minify JavaScript code to optimize performance.",
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
