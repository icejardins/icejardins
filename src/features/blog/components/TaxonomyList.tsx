import { Link } from "react-router";
import type { Taxonomy } from "@/core/types/content";
import {
  getLocalizedCategoryName,
  getLocalizedTagName,
  type SupportedLang
} from "@/features/blog/utils/taxonomyTranslations";
import styles from "./TaxonomyList.module.css";

type TaxonomyListProps = {
  title: string;
  items: Taxonomy[];
  basePath: "/tags" | "/categorias";
  lang?: SupportedLang;
};

export function TaxonomyList({ title, items, basePath, lang = "pt" }: TaxonomyListProps) {
  if (items.length === 0) {
    return null;
  }

  const isCategory = basePath === "/categorias";

  return (
    <aside className={styles.block}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => {
          const displayName = isCategory
            ? getLocalizedCategoryName(item.slug, item.name, lang)
            : getLocalizedTagName(item.slug, item.name, lang);

          const targetUrl =
            lang !== "pt"
              ? `${basePath}/${item.slug}/?lang=${lang}`
              : `${basePath}/${item.slug}/`;

          return (
            <li key={item.slug}>
              <Link to={targetUrl}>{displayName}</Link>
              <span>{item.count}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
