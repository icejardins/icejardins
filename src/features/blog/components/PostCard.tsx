import { Link } from "react-router-dom";
import type { Post } from "@/core/types/content";
import { formatDate } from "@/core/utils/formatDate";
import styles from "./PostCard.module.css";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className={styles.card}>
      {post.image ? (
        <Link to={post.route} className={styles.imageLink}>
          <img src={post.image} alt={post.title} loading="lazy" />
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
