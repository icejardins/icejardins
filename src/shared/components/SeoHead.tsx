import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";

type SeoHeadProps = {
  title: string;
  description?: string;
  image?: string | null;
  canonicalPath?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string | null;
  author?: string;
  section?: string;
  tags?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
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

const BILINGUAL_PAIRS: Record<string, { pt: string; en: string }> = {
  "/": { pt: "/", en: "/en/" },
  "/en/": { pt: "/", en: "/en/" },
  "/contribuir/": { pt: "/contribuir/", en: "/en/give/" },
  "/en/give/": { pt: "/contribuir/", en: "/en/give/" },
  "/fe/": { pt: "/fe/", en: "/en/faith/" },
  "/en/faith/": { pt: "/fe/", en: "/en/faith/" }
};

function buildChurchSchema(baseUrl: string, isEnglish = false) {
  return {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${baseUrl}/#organization`,
    name: isEnglish
      ? "ICE Jardins Evangelical Christian Church"
      : "Igreja Cristã Evangélica Jardins",
    alternateName: [
      "ICE Jardins",
      "Igreja Evangélica Jardins",
      "Igreja Cristã Evangélica Jardim Botânico",
      "Igreja no Jardim Botânico",
      "ICE Jardins Church"
    ],
    url: `${baseUrl}/`,
    logo: `${baseUrl}/images/logo-ice-jardins-01.webp`,
    image: `${baseUrl}/images/sobre/identidade.webp`,
    description: isEnglish
      ? "ICE Jardins Evangelical Christian Church in Jardim Botânico, Brasília - DF, Brazil. A biblical community dedicated to the teaching of the Scriptures, fellowship, and worship."
      : "Igreja Cristã Evangélica Jardins no Jardim Botânico em Brasília - DF. Comunidade dedicada ao ensino da Bíblia, à comunhão e adoração.",
    email: "secretaria@icejardins.org.br",
    telephone: "+55-61-98262-4952",
    priceRange: "Gratuito",
    publicAccess: true,
    isAccessibleForFree: true,
    sameAs: [
      "https://www.facebook.com/icejardins/",
      "https://www.instagram.com/icejardins/",
      "https://wa.me/5561982624952",
      "https://maps.app.goo.gl/ddMo7kUUDr6fHYyX9"
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
      longitude: "-47.8128996"
    },
    hasMap: "https://maps.app.goo.gl/ddMo7kUUDr6fHYyX9",
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Jardim Botânico, Brasília - DF"
      },
      {
        "@type": "AdministrativeArea",
        name: "Jardins Mangueiral, Brasília - DF"
      },
      {
        "@type": "AdministrativeArea",
        name: "Tororó, Brasília - DF"
      },
      {
        "@type": "AdministrativeArea",
        name: "Altiplano Leste, Brasília - DF"
      },
      {
        "@type": "AdministrativeArea",
        name: "São Bartolomeu, Brasília - DF"
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

function buildWebSiteSchema(baseUrl: string, isEnglish = false) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: isEnglish ? "ICE Jardins Church" : "ICE Jardins",
    description: isEnglish
      ? "ICE Jardins Evangelical Christian Church in Jardim Botânico, Brasília, Brazil"
      : "Igreja Cristã Evangélica Jardins em Brasília",
    inLanguage: isEnglish ? "en-US" : "pt-BR",
    publisher: {
      "@id": `${baseUrl}/#organization`
    }
  };
}

function buildBreadcrumbSchema(baseUrl: string, rawPath: string, title: string, isEnglish = false) {
  if (!rawPath || rawPath === "/" || rawPath === "/en" || rawPath === "/en/") {
    return null;
  }

  const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const segments = cleanPath.split("/").filter(Boolean);

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: isEnglish ? "Home" : "Início",
      item: isEnglish ? `${baseUrl}/en/` : `${baseUrl}/`
    }
  ];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    if (isEnglish && index === 0 && segment === "en") {
      return;
    }
    const isLast = index === segments.length - 1;
    const name = isLast
      ? title.split("|")[0].trim()
      : segment.charAt(0).toUpperCase() + segment.slice(1);

    items.push({
      "@type": "ListItem",
      position: items.length + 1,
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
  type = "website",
  publishedTime,
  author,
  section,
  tags,
  jsonLd,
  preloadImage
}: SeoHeadProps) {
  const location = useLocation();
  const site = getSiteConfig();
  const path = canonicalPath ?? location.pathname;
  const canonicalUrl = buildCanonicalUrl(site.baseUrl, path);
  const DEFAULT_OG_IMAGE = "/images/sobre/identidade.webp";
  const resolvedImage = image || DEFAULT_OG_IMAGE;
  const imageUrl = toAbsoluteUrl(resolvedImage, site.baseUrl);
  const metaDescription = description ?? site.description;

  const isEnglish = path.startsWith("/en/") || path === "/en";
  const htmlLang = isEnglish ? "en" : "pt-br";
  const ogLocale = isEnglish ? "en_US" : "pt_BR";

  const normalizedPath = path.startsWith("/")
    ? path.endsWith("/")
      ? path
      : `${path}/`
    : `/${path}/`;
  const bilingualPair = BILINGUAL_PAIRS[normalizedPath];

  const defaultSchemas: Record<string, unknown>[] = [
    buildChurchSchema(site.baseUrl, isEnglish),
    buildWebSiteSchema(site.baseUrl, isEnglish)
  ];

  const breadcrumb = buildBreadcrumbSchema(site.baseUrl, path, title, isEnglish);
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
      <html lang={htmlLang} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <meta name="geo.region" content="BR-DF" />
      <meta name="geo.placename" content="Jardim Botânico, Brasília - DF" />
      <meta name="geo.position" content="-15.8797754;-47.8128996" />
      <meta name="ICBM" content="-15.8797754, -47.8128996" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={isEnglish ? "ICE Jardins Church" : site.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      {imageUrl ? <meta property="og:image:secure_url" content={imageUrl} /> : null}
      {imageUrl ? <meta property="og:image:alt" content={title} /> : null}
      {imageUrl ? <meta property="og:image:width" content="1200" /> : null}
      {imageUrl ? <meta property="og:image:height" content="630" /> : null}
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && author ? (
        <meta property="article:author" content={author} />
      ) : null}
      {type === "article" && section ? (
        <meta property="article:section" content={section} />
      ) : null}
      {type === "article" && tags
        ? tags.map((t) => <meta key={t} property="article:tag" content={t} />)
        : null}
      <link rel="canonical" href={canonicalUrl} />
      {bilingualPair
        ? [
            <link key="alt-pt" rel="alternate" hrefLang="pt-BR" href={`${site.baseUrl}${bilingualPair.pt}`} />,
            <link key="alt-en" rel="alternate" hrefLang="en" href={`${site.baseUrl}${bilingualPair.en}`} />,
            <link key="alt-def" rel="alternate" hrefLang="x-default" href={`${site.baseUrl}${bilingualPair.pt}`} />
          ]
        : [
            <link key="alt-lang" rel="alternate" hrefLang={isEnglish ? "en" : "pt-BR"} href={canonicalUrl} />,
            <link key="alt-def" rel="alternate" hrefLang="x-default" href={canonicalUrl} />
          ]}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`Feed RSS - ${site.title}`}
        href={`${site.baseUrl}/rss.xml`}
      />
      {preloadImage ? (
        <link rel="preload" as="image" href={preloadImage} fetchPriority="high" />
      ) : null}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
