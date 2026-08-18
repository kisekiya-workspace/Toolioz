export function ToolStructuredData({ name, description }: { name: string, description: string }) {
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "WebApplication",
        "name": name,
        "description": description,
        "applicationCategory": "Utility",
        "operatingSystem": "Any browser-capable device",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
