import { Link, useParams, useSearchParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPostBySlug } from "@/content/repositories/postBodyRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { formatDate } from "@/core/utils/formatDate";
import { slugify } from "@/core/utils/slugify";
import { Icon } from "@/shared/components/Icon";
import { trackContactConversion, trackEngagementConversion } from "@/shared/utils/analytics";
import { getBrowserLanguage, getLanguagePreference } from "@/shared/utils/language";
import { SermonTranslator } from "./components/SermonTranslator";
import {
  getGoogleTranslateFallbackUrl,
  translateSermon,
  type TranslatedPostData
} from "./utils/sermonTranslationService";
import styles from "./BlogPostPage.module.css";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const site = getSiteConfig();
  const post = getPostBySlug(slug);

  const langParam = searchParams.get("lang");
  const initialLang: "pt" | "en" | "es" =
    langParam === "es" ? "es" : langParam === "en" ? "en" : "pt";

  const [activeLang, setActiveLang] = useState<"pt" | "en" | "es">(initialLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [loadingTargetLang, setLoadingTargetLang] = useState<"en" | "es" | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translatedData, setTranslatedData] = useState<TranslatedPostData | null>(null);
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loadedBodyHtml, setLoadedBodyHtml] = useState<string | null>(post?.bodyHtml || null);
  const trackedEngagementRef = useRef(false);

  useEffect(() => {
    trackedEngagementRef.current = false;
    const timer = setTimeout(() => {
      if (!trackedEngagementRef.current) {
        trackedEngagementRef.current = true;
        trackEngagementConversion("sermon_read_60s");
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (post?.bodyHtml) {
      setLoadedBodyHtml(post.bodyHtml);
      return;
    }
    if (contentRef.current && contentRef.current.innerHTML.trim().length > 0) {
      return;
    }
    if (slug) {
      fetch(`/data/posts/${slug}.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.bodyHtml) {
            setLoadedBodyHtml(data.bodyHtml);
          }
        })
        .catch(() => {});
    }
  }, [slug, post?.bodyHtml]);

  useEffect(() => {
    function updateProgress() {
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const current = document.documentElement.scrollTop;
      const progress = total <= 0 ? 0 : Math.min(100, (current / total) * 100);
      setScrollProgress(progress);
      if (progress >= 70 && !trackedEngagementRef.current) {
        trackedEngagementRef.current = true;
        trackEngagementConversion("sermon_scroll_70");
      }
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const canonicalPath = post?.route ?? "/posts/";
  const shareUrl = `${site.baseUrl}${canonicalPath}`;

  const executeTranslation = useCallback(
    async (targetLang: "en" | "es") => {
      if (!post) return;
      setIsTranslating(true);
      setLoadingTargetLang(targetLang);
      setTranslationError(null);

      try {
        let body = loadedBodyHtml || post.bodyHtml || "";
        if (!body) {
          try {
            const res = await fetch(`/data/posts/${slug}.json`);
            if (res.ok) {
              const data = await res.json();
              if (data?.bodyHtml) {
                body = data.bodyHtml;
                setLoadedBodyHtml(data.bodyHtml);
              }
            }
          } catch {
            // ignore network read errors; proceed
          }
        }

        const result = await translateSermon(slug, post.title, body, post.toc, targetLang);
        setTranslatedData(result);
        setActiveLang(targetLang);
      } catch {
        setTranslationError(
          targetLang === "es"
            ? "No se pudo cargar la traducción al español en este momento."
            : "Could not load the English translation at this time."
        );
      } finally {
        setIsTranslating(false);
        setLoadingTargetLang(null);
      }
    },
    [post, loadedBodyHtml, slug]
  );

  // Sync translation when URL ?lang= parameter changes or on first mount
  useEffect(() => {
    const urlLang = searchParams.get("lang");
    if (urlLang === "es" || urlLang === "en") {
      if (activeLang !== urlLang || !translatedData) {
        executeTranslation(urlLang);
      }
    } else if (!urlLang && activeLang !== "pt") {
      setActiveLang("pt");
    }
  }, [searchParams, slug, activeLang, translatedData, executeTranslation]);

  // Reset state when post slug changes
  useEffect(() => {
    setTranslatedData(null);
    setTranslationError(null);
    setDismissedSuggestion(false);
    const urlLang = searchParams.get("lang");
    if (urlLang === "es" || urlLang === "en") {
      executeTranslation(urlLang);
    } else {
      setActiveLang("pt");
    }
  }, [slug]);

  const handleSelectLanguage = (targetLang: "pt" | "en" | "es") => {
    if (targetLang === "pt") {
      setActiveLang("pt");
      setTranslationError(null);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("lang");
          return next;
        },
        { replace: true }
      );
      return;
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("lang", targetLang);
        return next;
      },
      { replace: true }
    );

    executeTranslation(targetLang);
  };

  const handleRetry = () => {
    if (loadingTargetLang) {
      executeTranslation(loadingTargetLang);
    } else if (activeLang === "en" || activeLang === "es") {
      executeTranslation(activeLang);
    } else {
      const urlLang = searchParams.get("lang");
      if (urlLang === "en" || urlLang === "es") {
        executeTranslation(urlLang);
      }
    }
  };

  const suggestedLang = useMemo(() => {
    if (activeLang !== "pt" || dismissedSuggestion) {
      return null;
    }
    if (typeof window === "undefined") {
      return null;
    }
    const pref = getLanguagePreference() || getBrowserLanguage();
    if (pref === "es") return "es";
    if (pref === "en") return "en";
    return null;
  }, [activeLang, dismissedSuggestion]);

  // Update browser tab title dynamically when translation is active
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (activeLang !== "pt" && translatedData?.title) {
        document.title = `${translatedData.title} | ${site.title}`;
      } else if (activeLang === "pt" && post) {
        document.title = post.seoTitle || `${post.title} | ${site.title}`;
      }
    }
  }, [activeLang, translatedData?.title, post, site.title]);

  const displayTitle =
    activeLang !== "pt" && translatedData?.title ? translatedData.title : post?.title || "";

  const displayBodyHtml =
    activeLang !== "pt" && translatedData?.bodyHtml ? translatedData.bodyHtml : loadedBodyHtml;

  const relevantToc = useMemo(() => {
    if (!post) {
      return [];
    }

    const sourceToc =
      activeLang !== "pt" && translatedData?.toc ? translatedData.toc : post.toc || [];

    return sourceToc.filter((item) => item.depth <= 3);
  }, [post, activeLang, translatedData]);

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

  const videoId =
    post.youtubeId ||
    (loadedBodyHtml || post.bodyHtml || "")?.match(/data-video-id="([a-zA-Z0-9_-]+)"/)?.[1] ||
    (loadedBodyHtml || post.bodyHtml || "")?.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1] ||
    null;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image
      ? [`${site.baseUrl}${post.image.startsWith("/") ? post.image : `/${post.image}`}`]
      : undefined,
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
  const faqSchema =
    Array.isArray(faqList) && faqList.length > 0
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

  const readingTimeText =
    activeLang === "es"
      ? `${post.readingTime} min de lectura`
      : activeLang === "en"
      ? `${post.readingTime} min read`
      : `${post.readingTime} min de leitura`;

  const fallbackUrl =
    activeLang !== "pt" ? getGoogleTranslateFallbackUrl(shareUrl, activeLang) : undefined;

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
          <article className="col-lg-9" lang={activeLang === "es" ? "es" : activeLang === "en" ? "en" : "pt-BR"}>
            <header className={styles.header}>
              <h1>{displayTitle}</h1>
              <p>
                {formatDate(post.date, activeLang)} • {readingTimeText}
              </p>

              <SermonTranslator
                currentLang={activeLang}
                isLoading={isTranslating}
                loadingTargetLang={loadingTargetLang}
                error={translationError}
                onSelectLanguage={handleSelectLanguage}
                onRetry={handleRetry}
                fallbackUrl={fallbackUrl}
                suggestedLang={suggestedLang}
                onDismissSuggestion={() => setDismissedSuggestion(true)}
              />
            </header>

            {post.image ? (
              <img
                src={post.image}
                alt={displayTitle}
                width={800}
                height={450}
                className={styles.featuredImage}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : null}

            <div
              ref={contentRef}
              className={styles.content}
              dangerouslySetInnerHTML={displayBodyHtml ? { __html: displayBodyHtml } : undefined}
              suppressHydrationWarning
            />

            <section
              className={styles.welcomeBanner}
              aria-label={
                activeLang === "es"
                  ? "Participe de nuestros cultos"
                  : activeLang === "en"
                  ? "Join our services"
                  : "Participe dos nossos cultos"
              }
            >
              <div className={styles.welcomeBannerHeader}>
                <div className={styles.welcomeIconWrap} aria-hidden="true">
                  <Icon name="chat-heart-fill" />
                </div>
                <div>
                  <h3 className={styles.welcomeBannerTitle}>
                    {activeLang === "es"
                      ? "Venga a Estudiar la Biblia con Nosotros"
                      : activeLang === "en"
                      ? "Come Study the Bible With Us"
                      : "Venha Estudar a Bíblia Conosco"}
                  </h3>
                  <p className={styles.welcomeBannerText}>
                    {activeLang === "es"
                      ? "¿Le gustó este estudio? Participe de nuestros cultos dominicales a las 9:30 en Jardim Botânico - DF o converse con nuestro equipo pastoral por WhatsApp."
                      : activeLang === "en"
                      ? "Did you enjoy this study? Join our Sunday services in person at 9:30 AM in Jardim Botânico - DF or reach out to our pastoral team via WhatsApp."
                      : "Gostou deste estudo? Participe dos nossos cultos presenciais aos domingos às 9h30 no Jardim Botânico - DF ou converse com nossa equipe pastoral pelo WhatsApp."}
                  </p>
                </div>
              </div>
              <div className={styles.welcomeBannerActions}>
                <Link to="/visita/" className={styles.btnVisit}>
                  <Icon name="clock-fill" />{" "}
                  {activeLang === "es"
                    ? "Planificar Visita el Domingo"
                    : activeLang === "en"
                    ? "Plan a Sunday Visit"
                    : "Planejar Visita aos Domingos"}
                </Link>
                <a
                  href={`https://wa.me/5561982624952?text=${encodeURIComponent(
                    activeLang === "es"
                      ? `¡Hola! Leí el estudio "${displayTitle}" en el sitio de ICE Jardins y me gustaría conversar con el equipo pastoral.`
                      : activeLang === "en"
                      ? `Hello! I read the study "${displayTitle}" on the ICE Jardins website and would like to talk with the pastoral team.`
                      : `Olá! Li o estudo "${post.title}" no site da ICE Jardins e gostaria de conversar com a equipe pastoral.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnWhatsapp}
                  onClick={() => trackContactConversion("sermon_welcome_banner")}
                >
                  <Icon name="whatsapp" />{" "}
                  {activeLang === "es"
                    ? "Hablar con el Equipo Pastoral"
                    : activeLang === "en"
                    ? "Talk to Pastoral Team"
                    : "Falar com a Equipe Pastoral"}
                </a>
              </div>
            </section>
          </article>

          <aside className="col-lg-3">
            <div className={styles.sidebar}>
              {relevantToc.length > 0 ? (
                <section className={styles.sidebarBlock}>
                  <h3>
                    {activeLang === "es"
                      ? "Contenido"
                      : activeLang === "en"
                      ? "Table of Contents"
                      : "Conteúdo"}
                  </h3>
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
                  <h3>{activeLang === "es" ? "Etiquetas" : "Tags"}</h3>
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
                <h3>
                  {activeLang === "es"
                    ? "Compartir"
                    : activeLang === "en"
                    ? "Share"
                    : "Compartilhar"}
                </h3>
                <div className={styles.shareLinks}>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${displayTitle}: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(displayTitle)}&body=${encodeURIComponent(shareUrl)}`}
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
        aria-label={
          activeLang === "es"
            ? "Volver arriba"
            : activeLang === "en"
            ? "Back to top"
            : "Voltar ao topo"
        }
      >
        {activeLang === "es" ? "Arriba" : activeLang === "en" ? "Top" : "Topo"}
      </button>
    </>
  );
}
