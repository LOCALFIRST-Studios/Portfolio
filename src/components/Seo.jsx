import { useEffect } from "react";
import { SITE } from "../data/site";

export default function Seo({ title, description, path = "/" }) {
  useEffect(() => {
    const fullTitle = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`;
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (attr.startsWith("og:") || attr.startsWith("twitter:")) {
          el.setAttribute(attr.startsWith("twitter:") ? "name" : "property", attr);
        } else {
          el.setAttribute("name", attr);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    const ogImage = `${SITE.url}/og-image.svg`;
    
    setMeta('meta[name="description"]', "description", description);
    setMeta('meta[property="og:title"]', "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "og:description", description);
    setMeta('meta[property="og:type"]', "og:type", "website");
    setMeta('meta[property="og:url"]', "og:url", `${SITE.url}${path}`);
    setMeta('meta[property="og:image"]', "og:image", ogImage);
    setMeta('meta[property="og:image:width"]', "og:image:width", "1200");
    setMeta('meta[property="og:image:height"]', "og:image:height", "630");
    setMeta('meta[name="twitter:card"]', "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:image"]', "twitter:image", ogImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE.url}${path}`);

    let jsonLd = document.getElementById("studio-jsonld");
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.id = "studio-jsonld";
      jsonLd.type = "application/ld+json";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: SITE.name,
      description: SITE.tagline,
      url: SITE.url,
      areaServed: "Local businesses",
    });
  }, [title, description, path]);

  return null;
}
