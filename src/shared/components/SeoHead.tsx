import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { getSiteConfig } from "@/content/repositories/contentRepository";

type SeoHeadProps = {
  title: string;
  description?: string;
  image?: string | null;
  canonicalPath?: string;
  noindex?: boolean;
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

export function SeoHead({
  title,
  description,
  image,
  canonicalPath,
  noindex = false
}: SeoHeadProps) {
  const location = useLocation();
  const site = getSiteConfig();
  const path = canonicalPath ?? location.pathname;
  const canonicalUrl = buildCanonicalUrl(site.baseUrl, path);
  const metaDescription = description ?? site.description;
  const imageUrl = toAbsoluteUrl(image, site.baseUrl);

  return (
    <Helmet>
      <html lang={site.languageCode} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
