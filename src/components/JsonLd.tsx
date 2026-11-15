import { services } from "@/data/services";
import { getMarketplaceLinks, site } from "@/data/site";

export default function JsonLd() {
  const sameAs = getMarketplaceLinks().map((link) => link.href);
  const phone = site.whatsapp.replace(/\D/g, "");

  const data = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    telephone: phone ? `+${phone}` : undefined,
    description: site.description,
    image: `${site.url}/opengraph-image`,
    areaServed: ["Bangladesh", "Worldwide"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.8103,
      longitude: 90.4125,
    },
    sameAs,
    knowsAbout: [
      "Flutter app development",
      "Next.js development",
      "LMS platforms",
      "SEO",
      "Meta Ads",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.seoDescription,
          url: `${site.url}/services/${service.slug}`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
