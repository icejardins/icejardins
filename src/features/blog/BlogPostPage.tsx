import { Link, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { getPostBySlug } from "@/content/repositories/postBodyRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { formatDate } from "@/core/utils/formatDate";
import { slugify } from "@/core/utils/slugify";
import { Icon } from "@/shared/components/Icon";
import { trackContactConversion } from "@/shared/utils/analytics";
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
        <SeoHead title={`Sermão não encontrado | ${site.title}`} noindex />
        <h1>Sermão não encontrado</h1>
        <p>O conteúdo que você procurou não está disponível.</p>
        <Link to="/posts/">Voltar para sermões</Link>
      </section>
    );
  }

  const videoId = (post as any).youtubeId || post.bodyHtml.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image ? [`${site.baseUrl}${post.image.startsWith("/") ? post.image : `/${post.image}`}`] : undefined,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl
    },
    author: {
      "@type": "Person",
      name: "Pr. Davi Ribeiro",
      affiliation: {
        "@type": "Church",
        name: "ICE Jardins",
        url: site.baseUrl
      }
    },
    publisher: {
      "@id": `${site.baseUrl}/#organization`
    }
  };

  const videoUploadDate = post.date
    ? post.date.includes("T")
      ? post.date
      : `${post.date}T09:30:00-03:00`
    : new Date().toISOString();

  const videoSchema = videoId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: post.title,
        description: post.description,
        thumbnailUrl: [
          `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        ],
        uploadDate: videoUploadDate,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        contentUrl: `https://www.youtube.com/watch?v=${videoId}`
      }
    : null;

  const faqList = (post as any).faq;
  const faqSchema = Array.isArray(faqList) && faqList.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqList.map((item: any) => ({
          "@type": "Question",
          name: item.question || item.name,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer || item.acceptedAnswer?.text || item.text
          }
        }))
      }
    : null;

  const pageSchemas = [
    blogPostingSchema,
    ...(videoSchema ? [videoSchema] : []),
    ...(faqSchema ? [faqSchema] : [])
  ];

  const pageTitle = post.seoTitle || `${post.title} | ${site.title}`;

  return (
    <>
      <SeoHead
        title={pageTitle}
        description={post.description}
        image={post.image}
        canonicalPath={canonicalPath}
        type="article"
        publishedTime={post.date}
        author="Pr. Davi Ribeiro"
        section={post.categories?.[0]}
        tags={post.tags}
        jsonLd={pageSchemas}
        preloadImage={post.image || undefined}
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
              <img
                src={post.image}
                alt={post.title}
                width={800}
                height={450}
                className={styles.featuredImage}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : null}

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />

            <section className={styles.welcomeBanner} aria-label="Participe dos nossos cultos">
              <div className={styles.welcomeBannerHeader}>
                <div className={styles.welcomeIconWrap} aria-hidden="true">
                  <Icon name="chat-heart-fill" />
                </div>
                <div>
                  <h3 className={styles.welcomeBannerTitle}>Venha Estudar a Bíblia Conosco</h3>
                  <p className={styles.welcomeBannerText}>
                    Gostou deste estudo? Participe dos nossos cultos presenciais aos domingos às 9h30 no Jardim Botânico - DF ou converse com nossa equipe pastoral pelo WhatsApp.
                  </p>
                </div>
              </div>
              <div className={styles.welcomeBannerActions}>
                <Link to="/visita/" className={styles.btnVisit}>
                  <Icon name="clock-fill" /> Planejar Visita aos Domingos
                </Link>
                <a
                  href={`https://wa.me/5561982624952?text=${encodeURIComponent(
                    `Olá! Li o estudo "${post.title}" no site da ICE Jardins e gostaria de conversar com a equipe pastoral.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnWhatsapp}
                  onClick={() => trackContactConversion("sermon_welcome_banner")}
                >
                  <Icon name="whatsapp" /> Falar com a Equipe Pastoral
                </a>
              </div>
            </section>
          </article>

          <aside className="col-lg-3">
            <div className={styles.sidebar}>
              {relevantToc.length > 0 ? (
                <section className={styles.sidebarBlock}>
                  <h3>Conteúdo</h3>
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
                  <h3>Tags</h3>
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
                <h3>Compartilhar</h3>
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
