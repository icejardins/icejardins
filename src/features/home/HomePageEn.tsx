import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { getRecentPosts } from "@/content/repositories/contentRepository";
import { formatDate } from "@/core/utils/formatDate";
import { homeContentEn } from "@/content/data/homeContentEn";
import { trackContactConversion } from "@/shared/utils/analytics";
import { useTranslatedCards } from "@/features/blog/utils/cardTranslationService";
import styles from "./HomePage.module.css";

const aboutCarouselImages = [
  {
    src: homeContentEn.images.congregation,
    alt: "ICE Jardins Congregation"
  },
  {
    src: "/images/sobre/foto3.webp",
    alt: "ICE Jardins members in fellowship"
  }
] as const;

export default function HomePageEn() {
  const recentPosts = getRecentPosts(3);
  const { translatedPosts: translatedRecentPosts } = useTranslatedCards(recentPosts, "en");
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
        title="Christian Church in Brasília (Jardim Botânico) | ICE Jardins"
        description="English-friendly evangelical Christian church in Jardim Botânico, Brasília - DF. Sunday worship at 9:30 AM. Bible-centered community welcoming expats, diplomats, and visitors."
        canonicalPath="/en/"
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
          <h1>{homeContentEn.hero.title}</h1>
          <p>{homeContentEn.hero.subtitle}</p>
          <a href={homeContentEn.hero.ctaTarget} className={styles.heroButton}>
            {homeContentEn.hero.ctaLabel}
          </a>
        </div>
      </section>

      <section id="about" className={styles.sectionSpace}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className={styles.aboutCarousel} role="region" aria-label="About us photo gallery">
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
              <h2>{homeContentEn.about.title}</h2>
              <p className={styles.lead}>{homeContentEn.about.lead}</p>
              <p>{homeContentEn.about.body}</p>
              <div className={styles.highlight}>{homeContentEn.about.highlight}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionSpace} ${styles.softBackground}`}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>Our Identity</h2>
            <p>The biblical pillars supporting our community</p>
          </div>
          <div className="row g-4">
            {homeContentEn.identity.map((item) => (
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
          src={homeContentEn.images.community}
          srcSet={`${homeContentEn.images.community.replace(".webp", "-400.webp")} 400w, ${homeContentEn.images.community} 600w`}
          sizes="(max-width: 768px) 100vw, 600px"
          alt="ICE Jardins Community"
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
              <h2>Recent Sermons</h2>
              <p>
                Expository biblical messages from our Sunday services to strengthen your faith and family.
              </p>
            </div>

            <div className="row g-4">
              {translatedRecentPosts.map((post) => (
                <div key={post.slug} className="col-lg-4 col-md-6">
                  <article className={styles.sermonCard}>
                    {post.image ? (
                      <Link to={`${post.route}?lang=en`} className={styles.sermonImageWrap}>
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
                        <span className={styles.sermonBadge}>Sermon</span>
                        <span>{formatDate(post.date, "en")}</span>
                      </div>

                      <h3 className={styles.sermonTitle}>
                        <Link to={`${post.route}?lang=en`}>{post.title}</Link>
                      </h3>

                      {post.summary ? (
                        <p className={styles.sermonSummary}>{post.summary}</p>
                      ) : null}
                    </div>

                    <div className={styles.sermonFooter}>
                      <Link to={`${post.route}?lang=en`} className={styles.sermonAction}>
                        Read sermon →
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className={styles.allSermonsWrap}>
              <Link to="/en/sermons/" className={styles.allSermonsButton}>
                Browse all sermons →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className={`${styles.sectionSpace} ${styles.worshipSection}`}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <h2>{homeContentEn.worship.title}</h2>
              <p>{homeContentEn.worship.description}</p>
              <div className="d-grid gap-3">
                {homeContentEn.worship.items.map((item) => (
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
              <h2>{homeContentEn.location.title}</h2>
              <address className={styles.locationCard}>
                <h3>{homeContentEn.location.place}</h3>
                <p>
                  {homeContentEn.location.details.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                {homeContentEn.location.regionNote ? (
                  <p className={styles.regionNote}>
                    <small>{homeContentEn.location.regionNote}</small>
                  </p>
                ) : null}
                {homeContentEn.location.mapUrl ? (
                  <p className="mt-3 mb-0">
                    <a
                      href={homeContentEn.location.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.mapButton}
                    >
                      <Icon name="bi bi-geo-alt" />
                      {homeContentEn.location.mapLabel}
                    </a>
                  </p>
                ) : null}
              </address>
              <address className={styles.locationCard}>
                <h3>Email</h3>
                <p>
                  <a
                    href={`mailto:${homeContentEn.location.email}`}
                    onClick={() => trackContactConversion("home_en_email")}
                  >
                    {homeContentEn.location.email}
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className={styles.closing}>
            <h3>{homeContentEn.closing.quote}</h3>
            <p className={styles.closingInvitation}>{homeContentEn.closing.invitation}</p>
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
                  <Icon name="building" /> {homeContentEn.buildingSpotlight.badge}
                </span>
                <h2 className={styles.spotlightTitle}>{homeContentEn.buildingSpotlight.title}</h2>
                <p className={styles.spotlightSubtitle}>{homeContentEn.buildingSpotlight.subtitle}</p>
                <p className={styles.spotlightStatusText}>
                  {homeContentEn.buildingSpotlight.statusText}
                </p>

                <div className={styles.spotlightBulletsGrid}>
                  {homeContentEn.buildingSpotlight.bullets.map((b, idx) => (
                    <div key={idx} className={styles.spotlightBullet}>
                      <span className={styles.spotlightBulletLabel}>{b.label}</span>
                      <strong className={styles.spotlightBulletValue}>{b.value}</strong>
                    </div>
                  ))}
                </div>

                <div className={styles.spotlightActions}>
                  <Link
                    to={homeContentEn.buildingSpotlight.detailsLink}
                    className={styles.btnSpotlightPrimary}
                  >
                    <Icon name="arrow-right-circle" /> {homeContentEn.buildingSpotlight.detailsLabel}
                  </Link>
                  <a
                    href={homeContentEn.buildingSpotlight.earthUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnSpotlightOutline}
                  >
                    <Icon name="globe-americas" /> {homeContentEn.buildingSpotlight.earthLabel}
                  </a>
                </div>
              </div>

              <div className="col-lg-5">
                <div className={styles.spotlightVisualWrapper}>
                  <Link
                    to={homeContentEn.buildingSpotlight.detailsLink}
                    title="Explore temple project subpage"
                  >
                    <img
                      src={homeContentEn.buildingSpotlight.image}
                      srcSet={`${homeContentEn.buildingSpotlight.image640} 640w, ${homeContentEn.buildingSpotlight.image1040} 1040w, ${homeContentEn.buildingSpotlight.image} 1376w`}
                      sizes="(max-width: 991px) 100vw, 480px"
                      alt="Architectural concept rendering of the future temple of ICE Jardins"
                      className={styles.spotlightImage}
                      width={640}
                      height={360}
                      loading="lazy"
                    />
                    <div className={styles.spotlightImageOverlay}>
                      <span>Explore Subpage & 3D Map →</span>
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
