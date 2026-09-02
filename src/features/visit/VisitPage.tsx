import { SeoHead } from "@/shared/components/SeoHead";
import { visitContent } from "@/content/data/visitContent";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./VisitPage.module.css";

export default function VisitPage() {
  const site = getSiteConfig();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quais são os horários dos cultos de domingo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Culto Inspirativo acontece aos domingos às 9h30 da manhã, seguido pela Escola Bíblica Dominical (EBD) e Ministério Infantil às 11h00."
        }
      },
      {
        "@type": "Question",
        name: "Onde a ICE Jardins está localizada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nos reunimos no auditório do Colégio In-Nova (antigo COC), situado no Condomínio Estância Jardim Botânico II, SH Jardim Botânico, Brasília - DF, CEP 71686-301."
        }
      },
      {
        "@type": "Question",
        name: "Há programação especial para crianças?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! Durante as manhãs de domingo temos Ministério Infantil e classes temáticas da Escola Bíblica Dominical especialmente organizadas para cada faixa etária."
        }
      },
      {
        "@type": "Question",
        name: "Qual é o código de vestimenta para os cultos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não há exigência de trajes formais. Nossa comunidade é acolhedora e você pode vir com roupas casuais e confortáveis como preferir."
        }
      },
      {
        "@type": "Question",
        name: "Preciso agendar minha visita com antecedência?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não é necessário agendamento prévio. Nossas portas estão sempre abertas para receber você e sua família aos domingos."
        }
      }
    ]
  };

  const worshipEventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Culto Inspirativo de Domingo",
    description: "Culto comunitário de adoração, comunhão e pregação bíblica expositiva na ICE Jardins.",
    eventSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1W",
      byDay: "https://schema.org/Sunday",
      startTime: "09:30",
      endTime: "11:00"
    },
    location: {
      "@type": "Place",
      name: "Auditório do Colégio In-Nova (ICE Jardins)",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Condomínio Estância Jardim Botânico II, SH Jardim Botânico",
        addressLocality: "Jardim Botânico",
        addressRegion: "DF",
        postalCode: "71686-301",
        addressCountry: "BR"
      }
    },
    isAccessibleForFree: true,
    organizer: {
      "@type": "Church",
      name: "Igreja Cristã Evangélica Jardins",
      url: site.baseUrl
    }
  };

  return (
    <>
      <SeoHead
        title="Planeje sua Visita | Igreja Evangélica no Jardim Botânico - Brasília DF"
        description="Venha visitar a Igreja Cristã Evangélica Jardins no Jardim Botânico, Brasília - DF. Culto de domingo às 9h30 e Escola Dominical às 11h. Um lugar acolhedor para você e sua família."
        canonicalPath="/visita/"
        jsonLd={[faqSchema, worshipEventSchema]}
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
                <a
                  className={`btn btn-lg ${styles.ctaButton}`}
                  href={visitContent.location.buttonLink}
                  onClick={() => trackAdsConversion()}
                >
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
