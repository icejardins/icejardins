import { SeoHead } from "@/shared/components/SeoHead";
import { visitContentEs } from "@/content/data/visitContentEs";
import { trackContactConversion } from "@/shared/utils/analytics";
import styles from "./VisitPage.module.css";

export default function VisitPageEs() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuáles son los horarios de los cultos los domingos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El Culto de Adoración se realiza los domingos a las 9:30 AM, seguido por un café de comunión a las 10:50 AM y la Escuela Bíblica Dominical y Ministerio Infantil a las 11:00 AM."
        }
      },
      {
        "@type": "Question",
        name: "¿Dónde está ubicada la iglesia ICE Jardins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nos reunimos en el auditorio del Colégio In-Nova (antiguo COC), ubicado en Condomínio Estância Jardim Botânico II, SH Jardim Botânico, Brasília - DF, CEP 71686-301, Brasil."
        }
      },
      {
        "@type": "Question",
        name: "¿Hay clases especiales para los niños?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "¡Sí! Durante las mañanas de domingo contamos con Ministerio Infantil y clases dinámicas de Escuela Dominical organizadas para cada grupo de edad infantil."
        }
      },
      {
        "@type": "Question",
        name: "¿Cuál es el código de vestimenta para asistir al culto?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No hay exigencia de vestimenta formal. Nuestra comunidad es cercana y acogedora; puede asistir con ropa casual y cómoda como prefiera."
        }
      },
      {
        "@type": "Question",
        name: "¿Es necesario agendar la visita con anticipación?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No es necesario agendamiento previo. Nuestras puertas están siempre abiertas para recibirle a usted y a su familia los domingos."
        }
      }
    ]
  };

  return (
    <>
      <SeoHead
        title="Planifique su Visita | Iglesia Evangélica en Jardim Botânico - Brasília DF"
        description="Visite la Iglesia Cristiana Evangélica Jardins en Jardim Botânico, Brasília - DF. Culto dominical a las 9:30 AM y Escuela Dominical a las 11:00 AM. Una comunidad acogedora para toda la familia."
        canonicalPath="/es/visita/"
        jsonLd={faqSchema}
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{visitContentEs.hero.title}</h1>
          <p>{visitContentEs.hero.description}</p>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          <div className="text-center mb-4">
            <h2>{visitContentEs.scheduleTitle}</h2>
            <p>{visitContentEs.scheduleSubtitle}</p>
          </div>

          <div className="row g-4">
            {visitContentEs.schedule.map((item) => (
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
                <h3>{visitContentEs.details.worshipTitle}</h3>
                <p>{visitContentEs.details.worshipText}</p>
                <div className={styles.inlineInfo}>{visitContentEs.details.worshipDuration}</div>
              </article>
              <article className="col-lg-6">
                <h3>{visitContentEs.details.schoolTitle}</h3>
                <p>{visitContentEs.details.schoolText}</p>
                <div className={styles.schoolHighlight}>{visitContentEs.details.schoolHighlight}</div>
              </article>
            </div>
          </section>

          <section className={styles.mapSection}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <h2>{visitContentEs.location.title}</h2>
                <p>{visitContentEs.location.description}</p>
                <a
                  className={`btn btn-lg ${styles.ctaButton}`}
                  href={visitContentEs.location.buttonLink}
                  onClick={() => trackContactConversion("visit_es_reception")}
                >
                  {visitContentEs.location.buttonLabel}
                </a>
                <article className={styles.addressCard}>
                  <h3>{visitContentEs.location.addressTitle}</h3>
                  <p>
                    {visitContentEs.location.address.map((line) => (
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
                    title="Mapa de la Iglesia ICE Jardins"
                    src={visitContentEs.location.mapEmbed}
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
