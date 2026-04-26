import { Link, useParams } from "react-router-dom";
import { getPageBySlug, getSiteConfig } from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";

export default function ContentPage() {
  const { slug = "" } = useParams();
  const page = getPageBySlug(slug);
  const site = getSiteConfig();

  if (!page) {
    return (
      <section className="container py-5">
        <SeoHead title={`Página não encontrada | ${site.title}`} />
        <h1>Página não encontrada</h1>
        <p>Não encontramos a página solicitada.</p>
        <Link to="/">Ir para a página inicial</Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <SeoHead
        title={`${page.title} | ${site.title}`}
        description={page.description}
        canonicalPath={page.route}
      />
      <h1>{page.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
    </section>
  );
}
