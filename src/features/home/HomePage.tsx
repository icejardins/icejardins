import { useEffect, useState } from "react";
import { SeoHead } from "@/shared/components/SeoHead";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { homeContent } from "@/content/data/homeContent";
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
      <SeoHead title={site.title} description={site.description} canonicalPath="/" />

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
                    className={`${styles.imageCover} ${styles.carouselImage} ${
                      index === activeAboutImage ? styles.carouselImageActive : ""
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
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
                    <i className={item.iconClass} aria-hidden="true" />
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
                    <i className={item.iconClass} aria-hidden="true" />
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
              <article className={styles.locationCard}>
                <h3>{homeContent.location.place}</h3>
                <p>
                  {homeContent.location.details.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </article>
              <article className={styles.locationCard}>
                <h3>E-mail</h3>
                <p>
                  <a href={`mailto:${homeContent.location.email}`}>{homeContent.location.email}</a>
                </p>
              </article>
            </div>
          </div>

          <div className={styles.closing}>
            <h3>{homeContent.closing.quote}</h3>
            <h4>{homeContent.closing.invitation}</h4>
          </div>
        </div>
      </section>
    </>
  );
}


