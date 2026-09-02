import { Link } from "react-router";
import type { Post, PostMeta } from "@/core/types/content";
import { formatDate } from "@/core/utils/formatDate";
import styles from "./PostCard.module.css";

type PostCardProps = {
  post: Post | PostMeta;
  priority?: boolean;
};

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className={styles.card}>
      {post.image ? (
        <Link to={post.route} className={styles.imageLink}>
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
        <h3>
          <Link to={post.route}>{post.title}</Link>
        </h3>
        <p>{post.summary}</p>
      </div>
      <footer className={styles.footer}>
        <span>{formatDate(post.date)}</span>
        <Link to={post.route}>Ler</Link>
      </footer>
    </article>
  );
}
