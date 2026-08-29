import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { getSiteConfig } from "@/content/repositories/contentRepository";

type SeoHeadProps = {
  title: string;
  description?: string;
  image?: string | null;
  canonicalPath?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  adsConversionSendTo?: string;
  preloadImage?: string | null;
};

function toAbsoluteUrl(value: string | null | undefined, baseUrl: string) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${baseUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

function buildCanonicalUrl(baseUrl: string, rawPath: string): string {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  if (!rawPath || rawPath === "/") {
    return `${cleanBaseUrl}/`;
  }

  const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const pathWithTrailingSlash = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;

  return `${cleanBaseUrl}${pathWithTrailingSlash}`;
}

function buildChurchSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${baseUrl}/#organization`,
    name: "Igreja Cristã Evangélica Jardins",
    alternateName: ["ICE Jardins", "Igreja Evangélica Jardins"],
    url: `${baseUrl}/`,
    logo: `${baseUrl}/images/logo-ice-jardins-01.webp`,
    image: `${baseUrl}/images/sobre/identidade.webp`,
    description:
      "Igreja Cristã Evangélica Jardins no Jardim Botânico em Brasília - DF. Comunidade dedicada ao ensino da Bíblia, à comunhão e adoração.",
    email: "secretaria@icejardins.org.br",
    telephone: "+55-61-98262-4952",
    priceRange: "Gratuito",
    sameAs: [
      "https://www.facebook.com/icejardins/",
      "https://www.instagram.com/icejardins/",
      "https://wa.me/5561982624952"
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Condomínio Estância Jardim Botânico II, SH Jardim Botânico (Colégio In-Nova)",
      addressLocality: "Jardim Botânico",
      addressRegion: "DF",
      postalCode: "71686-301",
      addressCountry: "BR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-15.8797754",
      longitude: "-47.8154745"
    },
    hasMap: "https://maps.google.com/?q=-15.8797754,-47.8154745",
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Jardim Botânico, Brasília - DF"
      },
      {
        "@type": "AdministrativeArea",
        name: "Lago Sul, Brasília - DF"
      },
      {
        "@type": "AdministrativeArea",
        name: "Brasília, DF"
      }
    ],
    knowsAbout: [
      "Bíblia Sagrada",
      "Jesus Cristo",
      "Evangelho",
      "Discipulado Cristão",
      "Ensino Bíblico"
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:30",
        closes: "12:00"
      }
    ]
  };
}

function buildWebSiteSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: "ICE Jardins",
    description: "Igreja Cristã Evangélica Jardins em Brasília",
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${baseUrl}/#organization`
    }
  };
}

function buildBreadcrumbSchema(baseUrl: string, rawPath: string, title: string) {
  if (!rawPath || rawPath === "/") {
    return null;
  }

  const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const segments = cleanPath.split("/").filter(Boolean);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: `${baseUrl}/`
    }
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const name = isLast
      ? title.split("|")[0].trim()
      : segment.charAt(0).toUpperCase() + segment.slice(1);

    items.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: `${baseUrl}${currentPath}/`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

export function SeoHead({
  title,
  description,
  image,
  canonicalPath,
  noindex = false,
  jsonLd,
  adsConversionSendTo,
  preloadImage
}: SeoHeadProps) {
  const location = useLocation();
  const site = getSiteConfig();
  const path = canonicalPath ?? location.pathname;
  const canonicalUrl = buildCanonicalUrl(site.baseUrl, path);
  const metaDescription = description ?? site.description;
  const imageUrl = toAbsoluteUrl(image, site.baseUrl);

  const defaultSchemas: Record<string, unknown>[] = [
    buildChurchSchema(site.baseUrl),
    buildWebSiteSchema(site.baseUrl)
  ];

  const breadcrumb = buildBreadcrumbSchema(site.baseUrl, path, title);
  if (breadcrumb) {
    defaultSchemas.push(breadcrumb);
  }

  const customSchemas = Array.isArray(jsonLd)
    ? jsonLd
    : jsonLd
      ? [jsonLd]
      : [];
  const allSchemas = [...defaultSchemas, ...customSchemas];

  return (
    <Helmet>
      <html lang={site.languageCode} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <meta name="geo.region" content="BR-DF" />
      <meta name="geo.placename" content="Jardim Botânico, Brasília - DF" />
      <meta name="geo.position" content="-15.8797754;-47.8154745" />
      <meta name="ICBM" content="-15.8797754, -47.8154745" />
      <meta
        name="keywords"
        content="Igreja Cristã Evangélica, ICE Jardins, Igreja no Jardim Botânico, Igreja Evangélica Brasília, Culto de Domingo Jardim Botânico, Colégio In-Nova Jardim Botânico, Igreja Brasília DF, Jardim Botânico DF"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang={site.languageCode} href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`Feed RSS - ${site.title}`}
        href={`${site.baseUrl}/rss.xml`}
      />
      {preloadImage ? (
        <link rel="preload" as="image" href={preloadImage} />
      ) : null}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      {adsConversionSendTo ? (
        <script>
          {`gtag('event', 'conversion', {'send_to': '${adsConversionSendTo}'});`}
        </script>
      ) : null}
    </Helmet>
  );
}
