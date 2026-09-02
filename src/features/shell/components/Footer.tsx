import { Link, useLocation } from "react-router";
import {
  getRecentPosts,
  getRecentResources,
  getSiteConfig
} from "@/content/repositories/contentRepository";
import { formatDate } from "@/core/utils/formatDate";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./Footer.module.css";

export function Footer() {
  const site = getSiteConfig();
  const location = useLocation();

  const isResourcesRoute = location.pathname.startsWith("/recursos");
  const recentPosts = getRecentPosts(3);
  const recentResources = getRecentResources(3);

  const showResources = isResourcesRoute && recentResources.length > 0;
  const recentItems = showResources
    ? recentResources.map((res) => ({
        slug: res.slug,
        title: res.title,
        route: res.route,
        image: res.image,
        summary: res.summary || res.description,
        date: res.date,
        actionLabel: res.actionType === "lead-form" || res.pdfUrl ? "Baixar" : "Acessar",
        isResource: true
      }))
    : recentPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        route: post.route,
        image: post.image,
        summary: post.summary,
        date: post.date,
        actionLabel: "Ler",
        isResource: false
      }));

  const sectionTitle = showResources ? "Recursos recentes" : "Publicações recentes";

  return (
    <footer className={styles.footer}>
      {recentItems.length > 0 ? (
        <section className="container py-5" aria-label={sectionTitle}>
          <h2 className={styles.recentTitle}>{sectionTitle}</h2>
          <div className="row g-4">
            {recentItems.map((item) => (
              <div key={item.slug} className="col-lg-4 col-md-6">
                <article className={styles.postCard}>
                  {item.image ? (
                    item.isResource ? (
                      <div className={styles.resourceImageWrap}>
                        <img
                          src={item.image}
                          alt={item.title}
                          width={370}
                          height={480}
                          className={styles.resourceImage}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={225}
                        loading="lazy"
                        decoding="async"
                      />
                    )
                  ) : null}
                  <div className={styles.postBody}>
                    <h3>
                      <Link to={item.route}>{item.title}</Link>
                    </h3>
                    <p>{item.summary}</p>
                  </div>
                  <div className={styles.postMeta}>
                    <span>{formatDate(item.date)}</span>
                    <Link to={item.route}>{item.actionLabel}</Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.bottom}>
        <div className="container py-4 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/images/logo-ice-jardins-01.webp" alt="ICE Jardins" width={36} height={15} />
            <span>
              © {new Date().getFullYear()} {site.title}
            </span>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/contribuir/">Contribua</Link>
            <Link to="/privacy/">Política de Privacidade</Link>
            <Link to="/terms/">Termos de Serviço</Link>
            {site.social.facebook ? (
              <a href={site.social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            ) : null}
            {site.social.instagram ? (
              <a href={site.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            ) : null}
            {site.social.whatsapp ? (
              <a
                href={site.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion()}
              >
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </footer>
  );
}
