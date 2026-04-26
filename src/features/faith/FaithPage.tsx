import { getPageBySlug, getSiteConfig } from "@/content/repositories/contentRepository";
import { faithIntro } from "@/content/data/faithContent";
import { SeoHead } from "@/shared/components/SeoHead";
import styles from "./FaithPage.module.css";

export default function FaithPage() {
  const site = getSiteConfig();
  const page = getPageBySlug("fe");

  return (
    <>
      <SeoHead
        title={`${page?.title ?? faithIntro.heroTitle} | ${site.title}`}
        description={page?.description ?? faithIntro.heroSubtitle}
        canonicalPath="/fe/"
      />

      <section className={styles.hero}>
        <div className="container text-center">
          <h1>{faithIntro.heroTitle}</h1>
          <p>{faithIntro.heroSubtitle}</p>
          <em>{faithIntro.heroHighlight}</em>
        </div>
      </section>

      <section className={styles.wrapper}>
        <div className="container">
          <article className={styles.introBox}>
            <p>{faithIntro.intro[0]}</p>
            <p>{faithIntro.intro[1]}</p>
            <p className={styles.tip}>{faithIntro.intro[2]}</p>
          </article>

          {page ? (
            <article
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
            />
          ) : (
            <article className={styles.content}>
              <p>Conteúdo de fé indisponível no momento.</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
