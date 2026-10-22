import { Link, useLocation, useSearchParams } from "react-router";
import { useEffect } from "react";
import {
  getReflectionsByLang,
  getReflectionTags,
  getReflectionsByTag,
  paginateReflections
} from "@/content/repositories/reflectionRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { formatDate } from "@/core/utils/formatDate";
import { Icon } from "@/shared/components/Icon";
import { slugify } from "@/core/utils/slugify";
import styles from "./ReflectionsListPage.module.css";

const PAGE_SIZE = 12;

export default function ReflectionsListPage() {
  const site = getSiteConfig();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isEnglish = location.pathname.startsWith("/en");
  const isSpanish = location.pathname.startsWith("/es");
  const lang: "pt" | "en" | "es" = isSpanish ? "es" : isEnglish ? "en" : "pt";

  const basePath = isSpanish
    ? "/es/reflexiones/"
    : isEnglish
    ? "/en/reflections/"
    : "/reflexoes/";

  const activeTagSlug = searchParams.get("tag")?.toLowerCase() || null;
  const pageParam = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // Scroll to top on page or tag change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTagSlug, currentPage]);

  const allReflectionsInLang = getReflectionsByLang(lang);
  const availableTags = getReflectionTags(lang);

  const activeTagItem = activeTagSlug
    ? availableTags.find((t) => t.slug === activeTagSlug)
    : null;
  const activeTagName = activeTagItem?.name || activeTagSlug;

  const filteredReflections = activeTagSlug
    ? getReflectionsByTag(activeTagSlug, lang)
    : allReflectionsInLang;

  const pagination = paginateReflections(filteredReflections, currentPage, PAGE_SIZE);

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

  let seoTitle = isSpanish
    ? "Para el Día a Día | Reflexiones Bíblicas - Iglesia ICE Jardins"
    : isEnglish
    ? "For Daily Life | Practical Biblical Reflections - ICE Jardins Church"
    : "Para o Dia a Dia | Reflexões Bíblicas Práticas - ICE Jardins";

  if (activeTagName) {
    seoTitle = isSpanish
      ? `${activeTagName} - Reflexiones | Para el Día a Día - ICE Jardins`
      : isEnglish
      ? `${activeTagName} - Reflections | For Daily Life - ICE Jardins`
      : `${activeTagName} - Reflexões | Para o Dia a Dia - ICE Jardins`;
  }

  if (pagination.page > 1) {
    seoTitle += isSpanish
      ? ` (Página ${pagination.page})`
      : isEnglish
      ? ` (Page ${pagination.page})`
      : ` (Página ${pagination.page})`;
  }

  const buildUrl = (targetPage: number, targetTag?: string | null) => {
    const params = new URLSearchParams();
    const tagToUse = targetTag !== undefined ? targetTag : activeTagSlug;
    if (tagToUse) {
      params.set("tag", tagToUse);
    }
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const readLabel = isSpanish ? "Leer artículo" : isEnglish ? "Read article" : "Ler reflexão";

  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={headerDescription}
        canonicalPath={basePath}
        preloadImage={pagination.items[0]?.image || undefined}
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

        {/* Tags / Topics Filter Bar */}
        <nav
          className={styles.tagsSection}
          aria-label={
            isSpanish
              ? "Filtrar reflexiones por temas"
              : isEnglish
              ? "Filter reflections by topics"
              : "Filtrar reflexões por temas"
          }
        >
          <div className={styles.tagsHeader}>
            <Icon name="tag" />
            <span>
              {isSpanish
                ? "Temas e Inquietudes:"
                : isEnglish
                ? "Topics & Real Questions:"
                : "Temas e Inquietações:"}
            </span>
          </div>

          <div className={styles.tagsList}>
            <Link
              to={buildUrl(1, null)}
              className={!activeTagSlug ? styles.activeTagPill : styles.tagPill}
              aria-current={!activeTagSlug ? "true" : undefined}
            >
              <span>{isSpanish ? "Todos los temas" : isEnglish ? "All topics" : "Todos os temas"}</span>
              <span className={styles.tagCount}>{allReflectionsInLang.length}</span>
            </Link>

            {availableTags.map((tag) => {
              const isActive = activeTagSlug === tag.slug;
              return (
                <Link
                  key={tag.slug}
                  to={buildUrl(1, isActive ? null : tag.slug)}
                  className={isActive ? styles.activeTagPill : styles.tagPill}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span>{tag.name}</span>
                  <span className={styles.tagCount}>{tag.count}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Active Filter Bar Indicator */}
        {activeTagSlug && (
          <div className={styles.activeFilterBar}>
            <div>
              <span>
                {isSpanish
                  ? "Mostrando reflexiones sobre "
                  : isEnglish
                  ? "Showing reflections on "
                  : "Mostrando reflexões sobre "}
              </span>
              <strong>"{activeTagName}"</strong>
              <span> ({pagination.totalItems})</span>
            </div>
            <Link to={buildUrl(1, null)} className={styles.clearFilterBtn}>
              ✕ {isSpanish ? "Limpiar filtro" : isEnglish ? "Clear filter" : "Limpar filtro"}
            </Link>
          </div>
        )}

        {/* Grid of Cards */}
        {pagination.items.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>
              {isSpanish
                ? "No se encontraron reflexiones"
                : isEnglish
                ? "No reflections found"
                : "Nenhuma reflexão encontrada"}
            </h2>
            <p>
              {isSpanish
                ? "No hay reflexiones disponibles para este tema en este momento."
                : isEnglish
                ? "No reflections are available for this topic at the moment."
                : "Não há reflexões disponíveis para este tema no momento."}
            </p>
            <Link to={buildUrl(1, null)} className={styles.clearFilterBtn}>
              {isSpanish
                ? "Ver todas las reflexiones"
                : isEnglish
                ? "View all reflections"
                : "Ver todas as reflexões"}
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {pagination.items.map((reflection, idx) => (
              <article key={reflection.slug} className={styles.card}>
                {reflection.image && (
                  <div className={styles.cardMedia}>
                    <Link to={reflection.route} tabIndex={-1} aria-hidden="true">
                      <img
                        src={reflection.image}
                        alt={reflection.title}
                        className={styles.cardImage}
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : undefined}
                        decoding="async"
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

                  {/* Card Tags */}
                  {reflection.tags && reflection.tags.length > 0 && (
                    <div className={styles.cardTags}>
                      {reflection.tags.map((tag) => {
                        const tagSlug = slugify(tag);
                        return (
                          <Link
                            key={tag}
                            to={buildUrl(1, tagSlug)}
                            className={styles.cardTagBadge}
                            title={`${isSpanish ? "Filtrar por" : isEnglish ? "Filter by" : "Filtrar por"} ${tag}`}
                          >
                            #{tag}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span>{formatDate(reflection.date, lang)}</span>
                    <Link to={reflection.route} className={styles.readLink}>
                      {readLabel} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        {pagination.totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <div className={styles.paginationSummary}>
              {isSpanish
                ? `Mostrando ${startItem}–${endItem} de ${pagination.totalItems} reflexiones`
                : isEnglish
                ? `Showing ${startItem}–${endItem} of ${pagination.totalItems} reflections`
                : `Mostrando ${startItem}–${endItem} de ${pagination.totalItems} reflexões`}
            </div>

            <nav
              className={styles.pagination}
              aria-label={
                isSpanish
                  ? "Paginación de reflexiones"
                  : isEnglish
                  ? "Reflections pagination"
                  : "Paginação de reflexões"
              }
            >
              {pagination.page > 1 && (
                <Link
                  to={buildUrl(pagination.page - 1)}
                  className={styles.prevNextBtn}
                  aria-label={isSpanish ? "Página anterior" : isEnglish ? "Previous page" : "Página anterior"}
                >
                  ← {isSpanish ? "Anterior" : isEnglish ? "Previous" : "Anterior"}
                </Link>
              )}

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  to={buildUrl(pageNumber)}
                  aria-current={pageNumber === pagination.page ? "page" : undefined}
                  className={pageNumber === pagination.page ? styles.currentPage : styles.pageNumber}
                >
                  {pageNumber}
                </Link>
              ))}

              {pagination.page < pagination.totalPages && (
                <Link
                  to={buildUrl(pagination.page + 1)}
                  className={styles.prevNextBtn}
                  aria-label={isSpanish ? "Página siguiente" : isEnglish ? "Next page" : "Próxima página"}
                >
                  {isSpanish ? "Siguiente" : isEnglish ? "Next" : "Próxima"} →
                </Link>
              )}
            </nav>
          </div>
        )}
      </section>
    </>
  );
}
