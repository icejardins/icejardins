import { Link, useParams } from "react-router";
import { getPageBySlug } from "@/content/repositories/pageContentRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import styles from "./ContentPage.module.css";

function getRenderedHeadingId(heading: string) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}_-]/gu, "");
}

export default function ContentPage() {
  const { slug = "" } = useParams();
  const page = getPageBySlug(slug);
  const site = getSiteConfig();

  if (!page) {
    return (
      <section className="container py-5">
        <SeoHead title={`Página não encontrada | ${site.title}`} noindex />
        <h1>Página não encontrada</h1>
        <p>Não encontramos a página solicitada.</p>
        <Link to="/">Ir para a página inicial</Link>
      </section>
    );
  }

  const tocHeadings = page.toc.filter((heading) => heading.depth === 2);

  return (
    <section className={`${styles.page} container`}>
      <SeoHead
        title={`${page.title} | ${site.title}`}
        description={page.description}
        canonicalPath={page.route}
      />
      <header className={styles.header}>
        <h1>{page.title}</h1>
        {page.description ? <p className={styles.description}>{page.description}</p> : null}
      </header>

      <div className={styles.contentLayout}>
        {tocHeadings.length > 0 ? (
          <nav className={styles.toc} aria-label="Sumário da página">
            <h2>Nesta página</h2>
            <ul>
              {tocHeadings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${getRenderedHeadingId(heading.text)}`}>{heading.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <article
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />
      </div>
    </section>
  );
}
