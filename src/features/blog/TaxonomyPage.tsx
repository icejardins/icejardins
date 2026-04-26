import { Link, useParams } from "react-router-dom";
import {
  getCategoryName,
  getPostsByCategorySlug,
  getPostsByTagSlug,
  getSiteConfig,
  getTagName
} from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { PostCard } from "@/features/blog/components/PostCard";

type TaxonomyPageProps = {
  taxonomyType: "tag" | "category";
};

export default function TaxonomyPage({ taxonomyType }: TaxonomyPageProps) {
  const { slug = "" } = useParams();
  const site = getSiteConfig();

  const isTag = taxonomyType === "tag";
  const posts = isTag ? getPostsByTagSlug(slug) : getPostsByCategorySlug(slug);
  const title = isTag ? getTagName(slug) : getCategoryName(slug);

  return (
    <section className="container py-5">
      <SeoHead
        title={`${title} | ${site.blog.title}`}
        description={`Publicações filtradas por ${isTag ? "tag" : "categoria"}: ${title}`}
        canonicalPath={`/${isTag ? "tags" : "categorias"}/${slug}/`}
      />

      <header className="mb-4">
        <h1>{title}</h1>
        <p>
          {posts.length} publicação(ões) em {isTag ? "tag" : "categoria"}
        </p>
        <Link to="/posts/">Voltar para todos os sermões</Link>
      </header>

      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.slug} className="col-lg-4 col-md-6">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
