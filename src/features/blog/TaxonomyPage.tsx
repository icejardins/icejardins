import { Link, useParams } from "react-router";
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
        title={`${title} - Sermões Bíblicos | ${site.title}`}
        description={`Sermões e mensagens bíblicas sobre "${title}" pregadas na Igreja Cristã Evangélica Jardins em Brasília - DF.`}
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
