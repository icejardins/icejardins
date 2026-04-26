import type {
  PageContent,
  PaginationResult,
  Post,
  SiteConfig,
  Taxonomies
} from "@/core/types/content";
import { slugify } from "@/core/utils/slugify";
import siteConfigJson from "@/content/generated/site-config.json";
import pagesJson from "@/content/generated/pages.json";
import postsJson from "@/content/generated/posts.json";
import taxonomiesJson from "@/content/generated/taxonomies.json";

const siteConfig = siteConfigJson as SiteConfig;
const pages = pagesJson as PageContent[];
const posts = (postsJson as Post[]).slice();
const taxonomies = taxonomiesJson as Taxonomies;

posts.sort((left, right) => {
  if (!left.date && !right.date) {
    return left.slug.localeCompare(right.slug);
  }

  if (!left.date) {
    return 1;
  }

  if (!right.date) {
    return -1;
  }

  return right.date.localeCompare(left.date);
});

const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
const postBySlug = new Map(posts.map((post) => [post.slug, post]));

const tagsBySlug = new Map(taxonomies.tags.map((tag) => [tag.slug, tag]));
const categoriesBySlug = new Map(taxonomies.categories.map((category) => [category.slug, category]));

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

export function getAllPages(): PageContent[] {
  return pages;
}

export function getPageBySlug(slug: string): PageContent | undefined {
  return pageBySlug.get(slug);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getRecentPosts(limit = 3): Post[] {
  return posts.slice(0, limit);
}

export function getPostBySlug(slug: string): Post | undefined {
  return postBySlug.get(slug);
}

export function getTags() {
  return taxonomies.tags;
}

export function getCategories() {
  return taxonomies.categories;
}

export function getPostsByTagSlug(tagSlug: string): Post[] {
  const tag = tagsBySlug.get(tagSlug);
  if (!tag) {
    return [];
  }

  return posts.filter((post) => post.tags.some((item) => slugify(item) === tag.slug));
}

export function getPostsByCategorySlug(categorySlug: string): Post[] {
  const category = categoriesBySlug.get(categorySlug);
  if (!category) {
    return [];
  }

  return posts.filter((post) =>
    post.categories.some((item) => slugify(item) === category.slug)
  );
}

export function getTagName(tagSlug: string): string {
  return tagsBySlug.get(tagSlug)?.name ?? tagSlug;
}

export function getCategoryName(categorySlug: string): string {
  return categoriesBySlug.get(categorySlug)?.name ?? categorySlug;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 6
): PaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems,
    totalPages
  };
}
