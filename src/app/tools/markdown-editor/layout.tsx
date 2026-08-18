import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Markdown Editor | Toolioz Tools",
    description: "Write and preview Markdown with a split-screen editor.",
    keywords: ["markdown editor","online markdown","md preview"],
    alternates: {
        canonical: "/tools/markdown-editor",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Markdown Editor",
        "description": "Write and preview Markdown with a split-screen editor.",
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
