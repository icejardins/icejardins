import { useState, useMemo } from "react";
import { Link } from "react-router";
import { getAllResources, getSiteConfig } from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { ResourceCard } from "./components/ResourceCard";
import styles from "./ResourceListPage.module.css";

export default function ResourceListPage() {
  const site = getSiteConfig();
  const allResources = getAllResources();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const res of allResources) {
      if (res.category) {
        cats.add(res.category);
      }
    }
    return Array.from(cats);
  }, [allResources]);

  const filteredResources = useMemo(() => {
    if (selectedCategory === "all") {
      return allResources;
    }
    return allResources.filter((res) => res.category === selectedCategory);
  }, [allResources, selectedCategory]);

  const pageTitle = site.resources?.title ?? "Recursos";
  const pageDescription =
    site.resources?.description ??
    "Guias, e-books e materiais gratuitos produzidos pela ICE Jardins para enriquecer sua jornada bíblica e espiritual.";

  return (
    <>
      <SeoHead
        title={`${pageTitle} | ${site.title}`}
        description={pageDescription}
        canonicalPath="/recursos/"
      />

      <header className={styles.header}>
        <div className="container">
          <div className={styles.pill}>
            <i className="bi bi-collection-fill" aria-hidden="true" />
            Materiais Gratuitos
          </div>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.lead}>{pageDescription}</p>
        </div>
      </header>

      <div className="container pb-5">
        {categories.length > 1 ? (
          <div className={styles.filterBar} role="tablist" aria-label="Filtro por categoria de recurso">
            <button
              type="button"
              className={`${styles.filterBtn} ${selectedCategory === "all" ? styles.filterBtnActive : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              Todos os Recursos ({allResources.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : null}

        {filteredResources.length > 0 ? (
          <div className="row g-4 justify-content-center">
            {filteredResources.map((resource) => (
              <div key={resource.slug} className="col-lg-6 col-md-6 col-sm-12">
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className={`bi bi-inbox ${styles.emptyStateIcon}`} aria-hidden="true" />
            <h3>Nenhum recurso encontrado nesta categoria</h3>
            <p>Selecione outra categoria ou volte para ver todos os materiais.</p>
            <button
              type="button"
              className={styles.filterBtn}
              onClick={() => setSelectedCategory("all")}
            >
              Ver todos os recursos
            </button>
          </div>
        )}

        <div className={styles.helpBox}>
          <i className="bi bi-chat-heart-fill fs-2 mb-3 d-inline-block text-warning" aria-hidden="true" />
          <h3>Dúvidas ou sugestões de temas?</h3>
          <p>
            Nossa equipe pastoral e liderança estão sempre à disposição para conversar, orar com
            você e indicar os melhores estudos e materiais bíblicos para sua vida.
          </p>
          <a
            href={site.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.helpBtn}
          >
            <i className="bi bi-whatsapp" aria-hidden="true" />
            Fale com a gente no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
