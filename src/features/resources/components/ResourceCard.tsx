import { Link } from "react-router";
import type { Resource } from "@/core/types/content";
import styles from "./ResourceCard.module.css";

interface ResourceCardProps {
  resource: Resource;
  priority?: boolean;
}

export function ResourceCard({ resource, priority = false }: ResourceCardProps) {
  const ctaLabel =
    resource.actionType === "lead-form" || resource.pdfUrl
      ? "Baixar Gratuitamente"
      : "Acessar Recurso";

  return (
    <article className={styles.card}>
      {resource.image ? (
        <div className={styles.imageWrap}>
          <img
            src={resource.image}
            alt={resource.title}
            width={420}
            height={315}
            className={styles.image}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
          />
          {resource.badge ? (
            <span className={styles.badgeOverlay}>
              <i className="bi bi-gift-fill" aria-hidden="true" />
              {resource.badge}
            </span>
          ) : null}
          {resource.format ? (
            <span className={styles.formatBadge}>
              <i className="bi bi-file-earmark-pdf-fill text-danger" aria-hidden="true" />
              {resource.format}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={styles.body}>
        {resource.category ? (
          <div className={styles.categoryRow}>
            <span className={styles.categoryTag}>{resource.category}</span>
          </div>
        ) : null}

        <h2 className={styles.title}>
          <Link to={resource.route}>{resource.title}</Link>
        </h2>

        {resource.subtitle ? (
          <p className={styles.subtitle}>{resource.subtitle}</p>
        ) : null}

        <p className={styles.description}>{resource.description}</p>

        {resource.tags && resource.tags.length > 0 ? (
          <div className={styles.tagsRow} aria-label="Tags do recurso">
            {resource.tags.map((tag) => (
              <span key={tag} className={styles.tagPill}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className={styles.footer}>
          <Link to={resource.route} className={styles.ctaButton}>
            <span>{ctaLabel}</span>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
