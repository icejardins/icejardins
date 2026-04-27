import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSiteConfig } from "@/content/repositories/contentRepository";

type SeoHeadProps = {
  title: string;
  description?: string;
  image?: string | null;
  canonicalPath?: string;
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

export function SeoHead({
  title,
  description,
  image,
  canonicalPath
}: SeoHeadProps) {
  const location = useLocation();
  const site = getSiteConfig();
  const path = canonicalPath ?? location.pathname;
  const canonicalUrl = `${site.baseUrl}${path === "/" ? "/" : path.replace(/\/+$/, "/")}`;
  const metaDescription = description ?? site.description;
  const imageUrl = toAbsoluteUrl(image, site.baseUrl);

  return (
    <Helmet>
      <html lang={site.languageCode} />
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
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
