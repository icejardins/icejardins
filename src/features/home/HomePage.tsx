import { useEffect, useState } from "react";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { homeContent } from "@/content/data/homeContent";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./HomePage.module.css";

const aboutCarouselImages = [
  {
    src: homeContent.images.congregation,
    alt: "Congregação da ICE Jardins"
  },
  {
    src: "/images/sobre/foto3.webp",
    alt: "Membros da ICE Jardins em comunhão"
  }
] as const;

export default function HomePage() {
  const site = getSiteConfig();
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
        title="Igreja Cristã Evangélica Jardins | Jardim Botânico - Brasília DF"
        description={site.description}
        canonicalPath="/"
        preloadImage="/images/sobre/identidade.webp"
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{homeContent.hero.title}</h1>
          <p>{homeContent.hero.subtitle}</p>
          <a href={homeContent.hero.ctaTarget} className="btn btn-outline-light btn-lg">
            {homeContent.hero.ctaLabel}
          </a>
        </div>
      </section>

      <section id="quem-somos" className={styles.sectionSpace}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className={styles.aboutCarousel} role="region" aria-label="Galeria de imagens da seção Quem Somos">
                {aboutCarouselImages.map((image, index) => (
                  <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={402}
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
              <h2>{homeContent.about.title}</h2>
              <p className={styles.lead}>{homeContent.about.lead}</p>
              <p>{homeContent.about.body}</p>
              <div className={styles.highlight}>{homeContent.about.highlight}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.sectionSpace} ${styles.softBackground}`}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>Nossa Identidade</h2>
            <p>Os pilares que sustentam nossa comunidade</p>
          </div>
          <div className="row g-4">
            {homeContent.identity.map((item) => (
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
          src={homeContent.images.community}
          alt="Comunidade ICE Jardins"
          width={600}
          height={402}
          className={styles.bannerImage}
          loading="lazy"
        />
      </section>

      <section className={`${styles.sectionSpace} ${styles.worshipSection}`}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <h2>{homeContent.worship.title}</h2>
              <p>{homeContent.worship.description}</p>
              <div className="d-grid gap-3">
                {homeContent.worship.items.map((item) => (
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
              <h2>{homeContent.location.title}</h2>
              <address className={styles.locationCard}>
                <h3>{homeContent.location.place}</h3>
                <p>
                  {homeContent.location.details.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                {homeContent.location.regionNote ? (
                  <p className={styles.regionNote}>
                    <small>{homeContent.location.regionNote}</small>
                  </p>
                ) : null}
                {homeContent.location.mapUrl ? (
                  <p className="mt-3 mb-0">
                    <a
                      href={homeContent.location.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-2"
                    >
                      <Icon name="bi bi-geo-alt" />
                      {homeContent.location.mapLabel}
                    </a>
                  </p>
                ) : null}
              </address>
              <address className={styles.locationCard}>
                <h3>E-mail</h3>
                <p>
                  <a
                    href={`mailto:${homeContent.location.email}`}
                    onClick={() => trackAdsConversion()}
                  >
                    {homeContent.location.email}
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className={styles.closing}>
            <h3>{homeContent.closing.quote}</h3>
            <p className={styles.closingInvitation}>{homeContent.closing.invitation}</p>
          </div>
        </div>
      </section>
    </>
  );
}


