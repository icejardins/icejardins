import { SeoHead } from "@/shared/components/SeoHead";
import { visitContent } from "@/content/data/visitContent";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import styles from "./VisitPage.module.css";

export default function VisitPage() {
  const site = getSiteConfig();

  return (
    <>
      <SeoHead
        title={`Planeje sua visita | ${site.title}`}
        description={visitContent.hero.description}
        canonicalPath="/visita/"
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{visitContent.hero.title}</h1>
          <p>{visitContent.hero.description}</p>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>{visitContent.scheduleTitle}</h2>
            <p>{visitContent.scheduleSubtitle}</p>
          </div>

          <div className="row g-4">
            {visitContent.schedule.map((item) => (
              <div key={item.time} className="col-lg-4 col-md-6">
                <article className={styles.scheduleCard} style={{ borderTopColor: item.accent }}>
                  <span className={styles.timeBadge} style={{ backgroundColor: item.accent }}>
                    {item.time}
                  </span>
                  <h3>{item.title}</h3>
                  <p className={styles.place}>{item.place}</p>
                  <p>{item.description}</p>
                </article>
              </div>
            ))}
          </div>

          <section className={styles.detailsBlock}>
            <div className="row g-4">
              <article className="col-lg-6">
                <h3>{visitContent.details.worshipTitle}</h3>
                <p>{visitContent.details.worshipText}</p>
                <div className={styles.inlineInfo}>{visitContent.details.worshipDuration}</div>
              </article>
              <article className="col-lg-6">
                <h3>{visitContent.details.schoolTitle}</h3>
                <p>{visitContent.details.schoolText}</p>
                <div className={styles.schoolHighlight}>{visitContent.details.schoolHighlight}</div>
              </article>
            </div>
          </section>

          <section className={styles.mapSection}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <h2>{visitContent.location.title}</h2>
                <p>{visitContent.location.description}</p>
                <a className={`btn btn-lg ${styles.ctaButton}`} href={visitContent.location.buttonLink}>
                  {visitContent.location.buttonLabel}
                </a>
                <article className={styles.addressCard}>
                  <h3>{visitContent.location.addressTitle}</h3>
                  <p>
                    {visitContent.location.address.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </article>
              </div>

              <div className="col-lg-7">
                <div className={styles.mapContainer}>
                  <iframe
                    title="Mapa da ICE Jardins"
                    src={visitContent.location.mapEmbed}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
