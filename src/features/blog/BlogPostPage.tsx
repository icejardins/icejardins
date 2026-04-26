import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getPostBySlug, getSiteConfig } from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { formatDate } from "@/core/utils/formatDate";
import { slugify } from "@/core/utils/slugify";
import styles from "./BlogPostPage.module.css";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const site = getSiteConfig();
  const post = getPostBySlug(slug);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const current = document.documentElement.scrollTop;
      const progress = total <= 0 ? 0 : Math.min(100, (current / total) * 100);
      setScrollProgress(progress);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const canonicalPath = post?.route ?? "/posts/";
  const shareUrl = `${site.baseUrl}${canonicalPath}`;

  const relevantToc = useMemo(() => {
    if (!post) {
      return [];
    }

    return post.toc.filter((item) => item.depth <= 3);
  }, [post]);

  if (!post) {
    return (
      <section className="container py-5">
        <SeoHead title={`Sermão não encontrado | ${site.title}`} canonicalPath="/posts/" />
        <h1>Sermão não encontrado</h1>
        <p>O conteúdo que você procurou não está disponível.</p>
        <Link to="/posts/">Voltar para sermões</Link>
      </section>
    );
  }

  return (
    <>
      <SeoHead
        title={`${post.title} | ${site.title}`}
        description={post.description}
        image={post.image}
        canonicalPath={canonicalPath}
      />

      <div className={styles.progress} aria-hidden="true">
        <div style={{ width: `${scrollProgress}%` }} />
      </div>

      <section className="container py-5">
        <div className="row g-4">
          <article className="col-lg-9">
            <header className={styles.header}>
              <h1>{post.title}</h1>
              <p>
                {formatDate(post.date)} • {post.readingTime} min de leitura
              </p>
            </header>

            {post.image ? (
              <img src={post.image} alt={post.title} className={styles.featuredImage} loading="eager" />
            ) : null}

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          </article>

          <aside className="col-lg-3">
            <div className={styles.sidebar}>
              {relevantToc.length > 0 ? (
                <section className={styles.sidebarBlock}>
                  <h2>Conteúdo</h2>
                  <ul>
                    {relevantToc.map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`}>{heading.text}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {post.tags.length > 0 ? (
                <section className={styles.sidebarBlock}>
                  <h2>Tags</h2>
                  <div className={styles.tags}>
                    {post.tags.map((tag) => (
                      <Link key={tag} to={`/tags/${slugify(tag)}/`}>
                        {tag}
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className={styles.sidebarBlock}>
                <h2>Compartilhar</h2>
                <div className={styles.shareLinks}>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title}: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}
                  >
                    E-mail
                  </a>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <button
        type="button"
        className={styles.toTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
      >
        Topo
      </button>
    </>
  );
}
