import { Link } from "react-router-dom";
import type { Taxonomy } from "@/core/types/content";
import styles from "./TaxonomyList.module.css";

type TaxonomyListProps = {
  title: string;
  items: Taxonomy[];
  basePath: "/tags" | "/categorias";
};

export function TaxonomyList({ title, items, basePath }: TaxonomyListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className={styles.block}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            <Link to={`${basePath}/${item.slug}/`}>{item.name}</Link>
            <span>{item.count}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
