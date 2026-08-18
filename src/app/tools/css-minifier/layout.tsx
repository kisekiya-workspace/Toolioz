import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "CSS Minifier | Toolioz Tools",
    description: "Minify and compress your CSS code to improve website load speed.",
    keywords: ["css minifier","css compressor","code optimization"],
    alternates: {
        canonical: "/tools/css-minifier",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CSS Minifier",
        "description": "Minify and compress your CSS code to improve website load speed.",
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
