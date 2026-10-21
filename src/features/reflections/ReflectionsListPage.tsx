import { Link, useLocation } from "react-router";
import { getAllReflections } from "@/content/repositories/reflectionRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { formatDate } from "@/core/utils/formatDate";
import { Icon } from "@/shared/components/Icon";
import styles from "./ReflectionsListPage.module.css";

export default function ReflectionsListPage() {
  const site = getSiteConfig();
  const location = useLocation();

  const isEnglish = location.pathname.startsWith("/en");
  const isSpanish = location.pathname.startsWith("/es");
  const lang: "pt" | "en" | "es" = isSpanish ? "es" : isEnglish ? "en" : "pt";

  const allReflections = getAllReflections();
  const reflections = allReflections.filter((r) => r.lang === lang);

  const headerTitle = isSpanish
    ? "Para el Día a Día"
    : isEnglish
    ? "For Daily Life"
    : site.reflections?.title || "Para o Dia a Dia";

  const headerDescription = isSpanish
    ? "Reflexiones bíblicas y respuestas directas para las dudas y dilemas de la vida real."
    : isEnglish
    ? "Biblical reflections and direct answers to honest, everyday questions and struggles."
    : site.reflections?.description ||
      "Reflexões bíblicas e respostas diretas para as dúvidas e dilemas reais do cotidiano.";

  const seoTitle = isSpanish
    ? "Para el Día a Día | Reflexiones Bíblicas - Iglesia ICE Jardins"
    : isEnglish
    ? "For Daily Life | Practical Biblical Reflections - ICE Jardins Church"
    : "Para o Dia a Dia | Reflexões Bíblicas Práticas - ICE Jardins";

  const canonicalPath = isSpanish
    ? "/es/reflexiones/"
    : isEnglish
    ? "/en/reflections/"
    : "/reflexoes/";

  const readLabel = isSpanish ? "Leer artículo" : isEnglish ? "Read article" : "Ler reflexão";

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={headerDescription}
        canonicalPath={canonicalPath}
        preloadImage={reflections[0]?.image || undefined}
      />

      <section className="container py-5">
        <header className={styles.header}>
          <div className={styles.badge}>
            <Icon name="chat" />
            <span>{isSpanish ? "Reflexiones" : isEnglish ? "Reflections" : "Reflexões"}</span>
          </div>
          <h1 className={styles.headerTitle}>{headerTitle}</h1>
          <p className={styles.headerDescription}>{headerDescription}</p>
        </header>

        <div className={styles.grid}>
          {reflections.map((reflection, idx) => (
            <article key={reflection.slug} className={styles.card}>
              {reflection.image && (
                <div className={styles.cardMedia}>
                  <Link to={reflection.route}>
                    <img
                      src={reflection.image}
                      alt={reflection.title}
                      className={styles.cardImage}
                      loading={idx === 0 ? "eager" : "lazy"}
                      width={600}
                      height={338}
                    />
                  </Link>
                </div>
              )}
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  {reflection.passage && (
                    <span className={styles.passageBadge}>{reflection.passage}</span>
                  )}
                  <span>{reflection.readingTime} min</span>
                </div>
                <h2 className={styles.cardTitle}>
                  <Link to={reflection.route}>{reflection.title}</Link>
                </h2>
                <p className={styles.cardSummary}>{reflection.subtitle || reflection.summary}</p>
                <div className={styles.cardFooter}>
                  <span>{formatDate(reflection.date, lang)}</span>
                  <Link to={reflection.route} className={styles.readLink}>
                    {readLabel} &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
