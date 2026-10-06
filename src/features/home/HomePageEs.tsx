import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { getRecentPosts } from "@/content/repositories/contentRepository";
import { formatDate } from "@/core/utils/formatDate";
import { homeContentEs } from "@/content/data/homeContentEs";
import { trackContactConversion } from "@/shared/utils/analytics";
import styles from "./HomePage.module.css";

const aboutCarouselImages = [
  {
    src: homeContentEs.images.congregation,
    alt: "Congregación de ICE Jardins"
  },
  {
    src: "/images/sobre/foto3.webp",
    alt: "Miembros de ICE Jardins en comunión"
  }
] as const;

export default function HomePageEs() {
  const recentPosts = getRecentPosts(3);
  const [activeAboutImage, setActiveAboutImage] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveAboutImage((previous) => (previous + 1) % aboutCarouselImages.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <SeoHead
        title="Iglesia Cristiana Evangélica en Brasília (Jardim Botânico) | ICE Jardins"
        description="Iglesia cristiana evangélica en Jardim Botânico, Brasília - DF. Culto de adoración los domingos a las 9:30. Comunidad bíblica que da la bienvenida a familias, visitantes y residentes hispanohablantes."
        canonicalPath="/es/"
        preloadImage="/images/sobre/identidade-400.webp"
      />

      <section className={styles.hero}>
        <div className={styles.heroBgWrap} aria-hidden="true">
          <img
            src="/images/sobre/identidade.webp"
            srcSet="/images/sobre/identidade-400.webp 400w, /images/sobre/identidade.webp 800w"
            sizes="100vw"
            alt=""
            width={800}
            height={266}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className={styles.heroBgImg}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container text-center ${styles.heroContent}`}>
          <h1>{homeContentEs.hero.title}</h1>
          <p>{homeContentEs.hero.subtitle}</p>
          <a href={homeContentEs.hero.ctaTarget} className={styles.heroButton}>
            {homeContentEs.hero.ctaLabel}
          </a>
        </div>
      </section>

      <section id="about" className={styles.sectionSpace}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className={styles.aboutCarousel} role="region" aria-label="Galería de fotos sobre nosotros">
                {aboutCarouselImages.map((image, index) => (
                  <img
                    key={image.src}
                    src={image.src}
                    srcSet={`${image.src.replace(".webp", "-400.webp")} 400w, ${image.src} 600w`}
                    sizes="(max-width: 768px) 100vw, 600px"
                    alt={image.alt}
                    width={600}
                    height={402}
                    decoding="async"
                    className={`${styles.imageCover} ${styles.carouselImage} ${
                      index === activeAboutImage ? styles.carouselImageActive : ""
                    }`}
                    loading="lazy"
                  />
                ))}
                <div className={styles.carouselIndicators} aria-hidden="true">
                  {aboutCarouselImages.map((image, index) => (
                    <span
                      key={`${image.src}-indicator`}
                      className={`${styles.carouselIndicator} ${
                        index === activeAboutImage ? styles.carouselIndicatorActive : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2>{homeContentEs.about.title}</h2>
              <p className={styles.lead}>{homeContentEs.about.lead}</p>
              <p>{homeContentEs.about.body}</p>
              <div className={styles.highlight}>{homeContentEs.about.highlight}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionSpace} ${styles.softBackground}`}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>Nuestra Identidad</h2>
            <p>Los pilares bíblicos que sustentan nuestra comunidad</p>
          </div>
          <div className="row g-4">
            {homeContentEs.identity.map((item) => (
              <div key={item.title} className="col-lg-4 col-md-6">
                <article className={styles.identityCard}>
                  <div className={styles.iconWrap}>
                    <Icon name={item.iconClass} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <img
          src={homeContentEs.images.community}
          srcSet={`${homeContentEs.images.community.replace(".webp", "-400.webp")} 400w, ${homeContentEs.images.community} 600w`}
          sizes="(max-width: 768px) 100vw, 600px"
          alt="Comunidad ICE Jardins"
          width={600}
          height={402}
          decoding="async"
          className={styles.bannerImage}
          loading="lazy"
        />
      </section>

      {recentPosts.length > 0 ? (
        <section className={`${styles.sectionSpace} ${styles.sermonsSection}`}>
          <div className="container">
            <div className={styles.sermonsHeader}>
              <h2>Sermones Recientes</h2>
              <p>
                Mensajes bíblicos expositivos de nuestros cultos dominicales para fortalecer su fe y su familia.
              </p>
            </div>

            <div className="row g-4">
              {recentPosts.map((post) => (
                <div key={post.slug} className="col-lg-4 col-md-6">
                  <article className={styles.sermonCard}>
                    {post.image ? (
                      <Link to={post.route} className={styles.sermonImageWrap}>
                        <img
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={225}
                          className={styles.sermonImage}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                    ) : null}

                    <div className={styles.sermonBody}>
                      <div className={styles.sermonMeta}>
                        <span className={styles.sermonBadge}>Sermón</span>
                        <span>{formatDate(post.date, "es")}</span>
                      </div>

                      <h3 className={styles.sermonTitle}>
                        <Link to={`${post.route}?lang=es`}>{post.title}</Link>
                      </h3>

                      {post.summary ? (
                        <p className={styles.sermonSummary}>{post.summary}</p>
                      ) : null}
                    </div>

                    <div className={styles.sermonFooter}>
                      <Link to={`${post.route}?lang=es`} className={styles.sermonAction}>
                        Leer sermón →
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className={styles.allSermonsWrap}>
              <Link to="/es/sermones/" className={styles.allSermonsButton}>
                Ver todos los sermones →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className={`${styles.sectionSpace} ${styles.worshipSection}`}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <h2>{homeContentEs.worship.title}</h2>
              <p>{homeContentEs.worship.description}</p>
              <div className="d-grid gap-3">
                {homeContentEs.worship.items.map((item) => (
                  <article key={item.title} className={styles.worshipCard}>
                    <Icon name={item.iconClass} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.time}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-lg-6 offset-lg-1">
              <h2>{homeContentEs.location.title}</h2>
              <address className={styles.locationCard}>
                <h3>{homeContentEs.location.place}</h3>
                <p>
                  {homeContentEs.location.details.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                {homeContentEs.location.regionNote ? (
                  <p className={styles.regionNote}>
                    <small>{homeContentEs.location.regionNote}</small>
                  </p>
                ) : null}
                {homeContentEs.location.mapUrl ? (
                  <p className="mt-3 mb-0">
                    <a
                      href={homeContentEs.location.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mapButton}
                    >
                      <Icon name="bi bi-geo-alt" />
                      {homeContentEs.location.mapLabel}
                    </a>
                  </p>
                ) : null}
              </address>
              <address className={styles.locationCard}>
                <h3>Correo Electrónico</h3>
                <p>
                  <a
                    href={`mailto:${homeContentEs.location.email}`}
                    onClick={() => trackContactConversion("home_es_email")}
                  >
                    {homeContentEs.location.email}
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className={styles.closing}>
            <h3>{homeContentEs.closing.quote}</h3>
            <p className={styles.closingInvitation}>{homeContentEs.closing.invitation}</p>
          </div>
        </div>
      </section>

      {/* Spotlight Subpage: Land & Temple Building Project */}
      <section className={styles.buildingSpotlightSection}>
        <div className="container">
          <article className={styles.buildingSpotlightCard}>
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className={styles.spotlightBadge}>
                  <Icon name="building" /> {homeContentEs.buildingSpotlight.badge}
                </span>
                <h2 className={styles.spotlightTitle}>{homeContentEs.buildingSpotlight.title}</h2>
                <p className={styles.spotlightSubtitle}>{homeContentEs.buildingSpotlight.subtitle}</p>
                <p className={styles.spotlightStatusText}>
                  {homeContentEs.buildingSpotlight.statusText}
                </p>

                <div className={styles.spotlightBulletsGrid}>
                  {homeContentEs.buildingSpotlight.bullets.map((b, idx) => (
                    <div key={idx} className={styles.spotlightBullet}>
                      <span className={styles.spotlightBulletLabel}>{b.label}</span>
                      <strong className={styles.spotlightBulletValue}>{b.value}</strong>
                    </div>
                  ))}
                </div>

                <div className={styles.spotlightActions}>
                  <Link
                    to={homeContentEs.buildingSpotlight.detailsLink}
                    className={styles.btnSpotlightPrimary}
                  >
                    <Icon name="arrow-right-circle" /> {homeContentEs.buildingSpotlight.detailsLabel}
                  </Link>
                  <a
                    href={homeContentEs.buildingSpotlight.earthUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnSpotlightOutline}
                  >
                    <Icon name="globe-americas" /> {homeContentEs.buildingSpotlight.earthLabel}
                  </a>
                </div>
              </div>

              <div className="col-lg-5">
                <div className={styles.spotlightVisualWrapper}>
                  <Link
                    to={homeContentEs.buildingSpotlight.detailsLink}
                    title="Conocer el proyecto del templo"
                  >
                    <img
                      src={homeContentEs.buildingSpotlight.image}
                      srcSet={`${homeContentEs.buildingSpotlight.image640} 640w, ${homeContentEs.buildingSpotlight.image1040} 1040w, ${homeContentEs.buildingSpotlight.image} 1376w`}
                      sizes="(max-width: 991px) 100vw, 480px"
                      alt="Diseño arquitectónico conceptual del futuro templo de ICE Jardins"
                      className={styles.spotlightImage}
                      width={640}
                      height={360}
                      loading="lazy"
                    />
                    <div className={styles.spotlightImageOverlay}>
                      <span>Explorar Subpágina y Mapa 3D →</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
