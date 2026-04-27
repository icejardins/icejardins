import { Link } from "react-router-dom";
import { getRecentPosts, getSiteConfig } from "@/content/repositories/contentRepository";
import { formatDate } from "@/core/utils/formatDate";
import styles from "./Footer.module.css";

export function Footer() {
  const site = getSiteConfig();
  const recentPosts = getRecentPosts(3);

  return (
    <footer className={styles.footer}>
      {recentPosts.length > 0 ? (
        <section className="container py-5" aria-label="Publicações recentes">
          <h2 className={styles.recentTitle}>Publicações recentes</h2>
          <div className="row g-4">
            {recentPosts.map((post) => (
              <div key={post.slug} className="col-lg-4 col-md-6">
                <article className={styles.postCard}>
                  {post.image ? <img src={post.image} alt={post.title} loading="lazy" /> : null}
                  <div className={styles.postBody}>
                    <h3>
                      <Link to={post.route}>{post.title}</Link>
                    </h3>
                    <p>{post.summary}</p>
                  </div>
                  <div className={styles.postMeta}>
                    <span>{formatDate(post.date)}</span>
                    <Link to={post.route}>Ler</Link>
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
            <img src="/images/logo-ice-jardins-01.png" alt="ICE Jardins" width={32} height={32} />
            <span>
              © {new Date().getFullYear()} {site.title}
            </span>
          </div>
          <div className={styles.socialLinks}>
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
              <a href={site.social.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </footer>
  );
}

