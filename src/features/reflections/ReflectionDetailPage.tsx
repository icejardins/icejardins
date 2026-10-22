import { Link, useParams, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { getReflectionBySlug } from "@/content/repositories/reflectionRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { formatDate } from "@/core/utils/formatDate";
import { Icon } from "@/shared/components/Icon";
import styles from "./ReflectionDetailPage.module.css";

export default function ReflectionDetailPage() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const site = getSiteConfig();
  const reflection = getReflectionBySlug(slug);

  const isEnglish = location.pathname.startsWith("/en") || reflection?.lang === "en";
  const isSpanish = location.pathname.startsWith("/es") || reflection?.lang === "es";
  const lang: "pt" | "en" | "es" = isSpanish ? "es" : isEnglish ? "en" : "pt";

  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedBodyHtml, setLoadedBodyHtml] = useState<string | null>(reflection?.bodyHtml || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reflection?.bodyHtml) {
      setLoadedBodyHtml(reflection.bodyHtml);
      return;
    }
    if (slug) {
      fetch(`/data/reflexoes/${slug}.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.bodyHtml) {
            setLoadedBodyHtml(data.bodyHtml);
          }
        })
        .catch(() => {});
    }
  }, [slug, reflection?.bodyHtml]);

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

  if (!reflection) {
    return (
      <div className="container py-5 text-center">
        <h2>{isSpanish ? "Reflexión no encontrada" : isEnglish ? "Reflection not found" : "Reflexão não encontrada"}</h2>
        <p className="mt-3">
          <Link to={isSpanish ? "/es/reflexiones/" : isEnglish ? "/en/reflections/" : "/reflexoes/"}>
            ← {isSpanish ? "Volver a Reflexiones" : isEnglish ? "Back to Reflections" : "Voltar para Reflexões"}
          </Link>
        </p>
      </div>
    );
  }

  const shareUrl = `${site.baseUrl}${reflection.route}`;
  const shareText = `${reflection.title} - ICE Jardins`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const breadcrumbSection = isSpanish ? "Para el Día a Día" : isEnglish ? "For Daily Life" : "Para o Dia a Dia";
  const sectionRoute = isSpanish ? "/es/reflexiones/" : isEnglish ? "/en/reflections/" : "/reflexoes/";

  return (
    <>
      <SeoHead
        title={`${reflection.title} | ${breadcrumbSection}`}
        description={reflection.description || reflection.subtitle || ""}
        canonicalPath={reflection.route}
        preloadImage={reflection.image || undefined}
      />

      <div
        className={styles.progressBar}
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <article className={styles.articleWrapper}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link to={isSpanish ? "/es/" : isEnglish ? "/en/" : "/"}>
            {isSpanish ? "Inicio" : isEnglish ? "Home" : "Início"}
          </Link>
          <span>/</span>
          <Link to={sectionRoute}>{breadcrumbSection}</Link>
          <span>/</span>
          <span aria-current="page">{reflection.title}</span>
        </nav>

        <header className={styles.header}>
          {reflection.passage && (
            <span className={styles.passageTag}>{reflection.passage}</span>
          )}
          <h1 className={styles.title}>{reflection.title}</h1>
          {reflection.subtitle && <p className={styles.subtitle}>{reflection.subtitle}</p>}

          <div className={styles.metaBar}>
            <div className={styles.metaInfo}>
              <span>{formatDate(reflection.date, lang)}</span>
              <span>&bull;</span>
              <span>{reflection.readingTime} min {isSpanish ? "de lectura" : isEnglish ? "read" : "de leitura"}</span>
            </div>
          </div>
        </header>

        {reflection.image && (
          <img
            src={reflection.image}
            alt={reflection.title}
            className={styles.heroImage}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={800}
            height={450}
          />
        )}

        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: loadedBodyHtml || "" }}
        />

        {reflection.sermonSlug && (
          <div className={styles.sermonBox}>
            <h3 className={styles.sermonBoxTitle}>
              {isSpanish ? "¿Desea profundizar en este pasaje?" : isEnglish ? "Want to study this passage deeper?" : "Deseja se aprofundar nesta passagem?"}
            </h3>
            <p>
              {isSpanish
                ? "Este artículo está basado en el mensaje expositivo predicado en la Iglesia ICE Jardins. Puede leer el estudio bíblico completo:"
                : isEnglish
                ? "This article is based on the expository sermon preached at ICE Jardins Church. You can read the full study here:"
                : "Este artigo é baseado na mensagem expositiva pregada na Igreja Cristã Evangélica Jardins. Você pode conferir o estudo bíblico completo aqui:"}
            </p>
            <Link to={`/posts/${reflection.sermonSlug}/`} className={styles.sermonBoxLink}>
              {reflection.passage
                ? `${isSpanish ? "Ver sermón de" : isEnglish ? "View sermon on" : "Ver sermão de"} ${reflection.passage} →`
                : `${isSpanish ? "Ver sermón completo" : isEnglish ? "View full sermon" : "Ver sermão completo"} →`}
            </Link>
          </div>
        )}

        <section className={styles.shareSection}>
          <span style={{ fontWeight: 600 }}>
            {isSpanish ? "Compartir esta reflexión:" : isEnglish ? "Share this reflection:" : "Compartilhe esta reflexão:"}
          </span>
          <div className={styles.shareButtons}>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${reflection.title}\n${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareButton}
              aria-label="Compartilhar no WhatsApp"
            >
              <Icon name="whatsapp" />
              <span>WhatsApp</span>
            </a>
            <button type="button" onClick={handleCopyLink} className={styles.shareButton}>
              <Icon name="link" />
              <span>{copied ? (isSpanish ? "¡Copiado!" : isEnglish ? "Copied!" : "Copiado!") : (isSpanish ? "Copiar enlace" : isEnglish ? "Copy link" : "Copiar link")}</span>
            </button>
          </div>
        </section>
      </article>
    </>
  );
}
