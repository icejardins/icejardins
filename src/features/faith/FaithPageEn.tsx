import { getPageBySlug, getSiteConfig } from "@/content/repositories/contentRepository";
import { faithIntroEn } from "@/content/data/faithContent";
import { SeoHead } from "@/shared/components/SeoHead";
import styles from "./FaithPage.module.css";

export default function FaithPageEn() {
  const site = getSiteConfig();
  const page = getPageBySlug("faith");

  return (
    <>
      <SeoHead
        title={`What We Believe | ${site.title}`}
        description={page?.description ?? faithIntroEn.heroSubtitle}
        canonicalPath="/en/faith/"
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{faithIntroEn.heroTitle}</h1>
          <p>{faithIntroEn.heroSubtitle}</p>
          <em>{faithIntroEn.heroHighlight}</em>
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className="container">
          <article className={styles.introBox}>
            <p>{faithIntroEn.intro[0]}</p>
            <p>{faithIntroEn.intro[1]}</p>
            <p className={styles.tip}>{faithIntroEn.intro[2]}</p>
          </article>

          {page ? (
            <article
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
            />
          ) : (
            <article className={styles.content}>
              <p>Faith content is currently unavailable.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
