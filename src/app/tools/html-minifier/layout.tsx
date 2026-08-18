import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "HTML Minifier | Toolioz Tools",
    description: "Minify your HTML code to reduce file size and bandwidth.",
    keywords: ["html minifier","html compressor","code tools"],
    alternates: {
        canonical: "/tools/html-minifier",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "HTML Minifier",
        "description": "Minify your HTML code to reduce file size and bandwidth.",
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
