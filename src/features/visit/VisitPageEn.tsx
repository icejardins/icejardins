import { SeoHead } from "@/shared/components/SeoHead";
import { visitContentEn } from "@/content/data/visitContentEn";
import { trackContactConversion } from "@/shared/utils/analytics";
import styles from "./VisitPage.module.css";

export default function VisitPageEn() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What time are the Sunday services at ICE Jardins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our Sunday Worship Service begins at 9:30 AM, followed by fellowship coffee at 10:50 AM and Sunday School (adult classes & children's ministry) at 11:00 AM."
        }
      },
      {
        "@type": "Question",
        name: "Where is ICE Jardins Church located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We meet in the auditorium of Colégio In-Nova (formerly COC), located at Condomínio Estância Jardim Botânico II, SH Jardim Botânico, Brasília - DF, ZIP 71686-301, Brazil."
        }
      },
      {
        "@type": "Question",
        name: "Are international visitors and expats welcome?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, absolutely! ICE Jardins warmly welcomes expats, diplomats, travelers, and international residents living in Brasília. Our church family is hospitable and eager to receive English-speaking guests."
        }
      },
      {
        "@type": "Question",
        name: "Is there a children's ministry or childcare during Sunday service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We have an engaging, secure, and nurturing children's ministry with dedicated classes tailored for each age group during Sunday School at 11:00 AM."
        }
      },
      {
        "@type": "Question",
        name: "What is the dress code for services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is no formal dress code. Our congregation is casual and welcoming — please feel free to come as you are in comfortable attire."
        }
      },
      {
        "@type": "Question",
        name: "Do I need to RSVP or register before visiting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No reservation or registration is required. Our doors are always open to welcome you and your family any Sunday morning."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead
        title="Plan Your Visit | Christian Church in Jardim Botânico, Brasília"
        description="Visit ICE Jardins Church in Jardim Botânico, Brasília - DF. Sunday worship service at 9:30 AM and Sunday School at 11:00 AM. Welcoming community for you and your family."
        canonicalPath="/en/visit/"
        jsonLd={faqSchema}
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{visitContentEn.hero.title}</h1>
          <p>{visitContentEn.hero.description}</p>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>{visitContentEn.scheduleTitle}</h2>
            <p>{visitContentEn.scheduleSubtitle}</p>
          </div>

          <div className="row g-4">
            {visitContentEn.schedule.map((item) => (
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
                <h3>{visitContentEn.details.worshipTitle}</h3>
                <p>{visitContentEn.details.worshipText}</p>
                <div className={styles.inlineInfo}>{visitContentEn.details.worshipDuration}</div>
              </article>
              <article className="col-lg-6">
                <h3>{visitContentEn.details.schoolTitle}</h3>
                <p>{visitContentEn.details.schoolText}</p>
                <div className={styles.schoolHighlight}>{visitContentEn.details.schoolHighlight}</div>
              </article>
            </div>
          </section>

          <section className={styles.mapSection}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <h2>{visitContentEn.location.title}</h2>
                <p>{visitContentEn.location.description}</p>
                <a
                  className={`btn btn-lg ${styles.ctaButton}`}
                  href={visitContentEn.location.buttonLink}
                  onClick={() => trackContactConversion("visit_en_reception")}
                >
                  {visitContentEn.location.buttonLabel}
                </a>
                <article className={styles.addressCard}>
                  <h3>{visitContentEn.location.addressTitle}</h3>
                  <p>
                    {visitContentEn.location.address.map((line) => (
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
                    title="Map of ICE Jardins Church"
                    src={visitContentEn.location.mapEmbed}
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
