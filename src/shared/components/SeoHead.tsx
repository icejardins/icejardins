import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSiteConfig } from "@/content/repositories/contentRepository";

type SeoHeadProps = {
  title: string;
  description?: string;
  image?: string | null;
  canonicalPath?: string;
};

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
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
