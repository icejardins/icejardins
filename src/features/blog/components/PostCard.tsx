import { Link } from "react-router";
import type { Post, PostMeta } from "@/core/types/content";
import { formatDate } from "@/core/utils/formatDate";
import styles from "./PostCard.module.css";

type PostCardProps = {
  post: Post | PostMeta;
  priority?: boolean;
  lang?: "pt" | "en" | "es";
};

export function PostCard({ post, priority = false, lang = "pt" }: PostCardProps) {
  const targetRoute =
    lang === "es"
      ? `${post.route}?lang=es`
      : lang === "en"
      ? `${post.route}?lang=en`
      : post.route;

  const readLabel = lang === "es" ? "Leer" : lang === "en" ? "Read" : "Ler";

  return (
    <article className={styles.card}>
      {post.image ? (
        <Link to={targetRoute} className={styles.imageLink}>
          <img
            src={post.image}
            alt={post.title}
            width={600}
            height={338}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
          />
        </Link>
      ) : null}
      <div className={styles.body}>
        <h2>
          <Link to={targetRoute}>{post.title}</Link>
        </h2>
        <p>{post.summary}</p>
      </div>
      <footer className={styles.footer}>
        <span>{formatDate(post.date, lang)}</span>
        <Link to={targetRoute}>{readLabel}</Link>
      </footer>
    </article>
  );
}
