import { Link, useLocation, useSearchParams } from "react-router";
import {
  getAllPosts,
  getCategories,
  getSiteConfig,
  getTags,
  paginate
} from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { PostCard } from "@/features/blog/components/PostCard";
import { TaxonomyList } from "@/features/blog/components/TaxonomyList";
import { useTranslatedCards } from "@/features/blog/utils/cardTranslationService";
import styles from "./BlogListPage.module.css";

const PAGE_SIZE = 6;

export default function BlogListPage() {
  const site = getSiteConfig();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const langParam = searchParams.get("lang");
  const isEnglish = location.pathname.startsWith("/en") || langParam === "en";
  const isSpanish = location.pathname.startsWith("/es") || langParam === "es";
  const lang: "pt" | "en" | "es" = isSpanish ? "es" : isEnglish ? "en" : "pt";

  const allPosts = getAllPosts();
  const pagination = paginate(allPosts, Number.isFinite(page) ? page : 1, PAGE_SIZE);
  const { translatedPosts, isTranslating } = useTranslatedCards(pagination.items, lang);

  const basePath = isSpanish ? "/es/sermones/" : isEnglish ? "/en/sermons/" : "/posts/";

  const headerTitle = isSpanish
    ? "Sermones"
    : isEnglish
    ? "Sermons"
    : site.blog.title;

  const headerDescription = isSpanish
    ? "Estudios bíblicos, series expositivas y mensajes predicados en ICE Jardins."
    : isEnglish
    ? "Biblical expositions, sermon series, and gospel messages from ICE Jardins."
    : site.blog.description;

  const seoTitle = isSpanish
    ? "Sermones y Mensajes Bíblicos | Iglesia ICE Jardins"
    : isEnglish
    ? "Sermons & Biblical Messages | ICE Jardins Church"
    : "Sermões e Mensagens Bíblicas | Igreja Cristã Evangélica Jardins - Brasília DF";

  const seoDescription = isSpanish
    ? "Escuche y lea los sermones expositivos de ICE Jardins en Brasília, Brasil. Mensajes bíblicos centrados en el Evangelio de Jesucristo para fortalecer su fe."
    : isEnglish
    ? "Listen to and read expository sermons from ICE Jardins Church in Brasília, Brazil. Gospel-centered biblical teachings to strengthen your faith."
    : "Ouça e leia os sermões expositivos da ICE Jardins no Jardim Botânico, Brasília - DF. Mensagens bíblicas centradas no Evangelho de Jesus Cristo para fortalecer sua fé.";

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={basePath}
        preloadImage={pagination.items[0]?.image || undefined}
      />

      <section className="container py-5">
        <header className="text-center mb-4">
          <h1>{headerTitle}</h1>
          <p>{headerDescription}</p>
          {lang !== "pt" && (
            <div>
              <span className={styles.translationBadge}>
                {isTranslating ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span>
                      {isSpanish
                        ? "Traduciendo sermones al español..."
                        : "Translating sermon cards to English..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Icon name="translate" />
                    <span>
                      {isSpanish
                        ? "Tarjetas de sermones traducidas al español"
                        : "Sermon cards translated into English"}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}
        </header>

        <div className="row g-4">
          <div className="col-lg-9">
            <div className="row g-4">
              {translatedPosts.map((post, index) => (
                <div key={post.slug} className="col-lg-6 col-md-6">
                  <PostCard post={post} priority={index === 0} lang={lang} />
                </div>
              ))}
            </div>

            <nav
              className={styles.pagination}
              aria-label={
                isSpanish
                  ? "Paginación de sermones"
                  : isEnglish
                  ? "Sermon pagination"
                  : "Paginação de sermões"
              }
            >
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Link
                    key={pageNumber}
                    to={pageNumber === 1 ? basePath : `${basePath}?page=${pageNumber}`}
                    aria-current={pageNumber === pagination.page ? "page" : undefined}
                    className={pageNumber === pagination.page ? styles.currentPage : undefined}
                  >
                    {pageNumber}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="col-lg-3">
            <div className={styles.stickySidebar}>
              <TaxonomyList
                title={isSpanish ? "Categorías" : isEnglish ? "Categories" : "Categorias"}
                items={getCategories()}
                basePath="/categorias"
                lang={lang}
              />
              <TaxonomyList
                title={isSpanish ? "Etiquetas" : isEnglish ? "Tags" : "Tags"}
                items={getTags()}
                basePath="/tags"
                lang={lang}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
