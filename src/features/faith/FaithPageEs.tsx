import { getPageBySlug } from "@/content/repositories/pageContentRepository";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { faithIntroEs } from "@/content/data/faithContent";
import { SeoHead } from "@/shared/components/SeoHead";
import styles from "./FaithPage.module.css";

export default function FaithPageEs() {
  const site = getSiteConfig();
  const page = getPageBySlug("faith-es");

  return (
    <>
      <SeoHead
        title={`Lo que creemos | ${site.title}`}
        description={page?.description ?? faithIntroEs.heroSubtitle}
        canonicalPath="/es/fe/"
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{faithIntroEs.heroTitle}</h1>
          <p>{faithIntroEs.heroSubtitle}</p>
          <em>{faithIntroEs.heroHighlight}</em>
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className="container">
          <article className={styles.introBox}>
            <p>{faithIntroEs.intro[0]}</p>
            <p>{faithIntroEs.intro[1]}</p>
            <p className={styles.tip}>{faithIntroEs.intro[2]}</p>
          </article>

          {page ? (
            <article
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
            />
          ) : (
            <article className={styles.content}>
              <p>El contenido de la confesión de fe no está disponible actualmente.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
