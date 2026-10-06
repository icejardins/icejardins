import { Link, useParams, useSearchParams } from "react-router";
import {
  getCategoryName,
  getPostsByCategorySlug,
  getPostsByTagSlug,
  getSiteConfig,
  getTagName
} from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { PostCard } from "@/features/blog/components/PostCard";
import {
  getLocalizedCategoryName,
  getLocalizedTagName
} from "@/features/blog/utils/taxonomyTranslations";
import { useTranslatedCards } from "@/features/blog/utils/cardTranslationService";

type TaxonomyPageProps = {
  taxonomyType: "tag" | "category";
};

export default function TaxonomyPage({ taxonomyType }: TaxonomyPageProps) {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const site = getSiteConfig();

  const langParam = searchParams.get("lang");
  const lang: "pt" | "en" | "es" = langParam === "es" ? "es" : langParam === "en" ? "en" : "pt";

  const isTag = taxonomyType === "tag";
  const rawPosts = isTag ? getPostsByTagSlug(slug) : getPostsByCategorySlug(slug);
  const rawTitle = isTag ? getTagName(slug) : getCategoryName(slug);

  const title = isTag
    ? getLocalizedTagName(slug, rawTitle, lang)
    : getLocalizedCategoryName(slug, rawTitle, lang);

  const { translatedPosts } = useTranslatedCards(rawPosts, lang);

  const allSermonsRoute =
    lang === "es" ? "/es/sermones/" : lang === "en" ? "/en/sermons/" : "/posts/";
  const backLabel =
    lang === "es"
      ? "← Volver a todos los sermones"
      : lang === "en"
      ? "← Back to all sermons"
      : "← Voltar para todos os sermões";

  const countLabel =
    lang === "es"
      ? `${rawPosts.length} sermón(es) en ${isTag ? "etiqueta" : "categoría"}`
      : lang === "en"
      ? `${rawPosts.length} sermon(s) in ${isTag ? "tag" : "category"}`
      : `${rawPosts.length} publicação(ões) em ${isTag ? "tag" : "categoria"}`;

  return (
    <section className="container py-5">
      <SeoHead
        title={`${title} - Sermões Bíblicos | ${site.title}`}
        description={`Sermões e mensagens bíblicas sobre "${title}" pregadas na Igreja Cristã Evangélica Jardins em Brasília - DF.`}
        canonicalPath={`/${isTag ? "tags" : "categorias"}/${slug}/`}
        noindex={isTag}
      />

      <header className="mb-4">
        <h1>{title}</h1>
        <p>{countLabel}</p>
        <Link to={allSermonsRoute}>{backLabel}</Link>
      </header>

      <div className="row g-4">
        {translatedPosts.map((post) => (
          <div key={post.slug} className="col-lg-4 col-md-6">
            <PostCard post={post} lang={lang} />
          </div>
        ))}
      </div>
    </section>
  );
}
