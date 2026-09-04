import type {
  PaginationResult,
  PostMeta,
  Resource,
  Taxonomies
} from "@/core/types/content";
import { slugify } from "@/core/utils/slugify";
import postsMetaJson from "@/content/generated/posts-meta.json";
import resourcesJson from "@/content/generated/resources.json";
import taxonomiesJson from "@/content/generated/taxonomies.json";
export { getSiteConfig } from "./siteConfigRepository";

const posts = (postsMetaJson as unknown as PostMeta[]).slice();
const resources = (resourcesJson as Resource[]).slice();
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

resources.sort((left, right) => {
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

const resourceBySlug = new Map(resources.map((resource) => [resource.slug, resource]));

const tagsBySlug = new Map(taxonomies.tags.map((tag) => [tag.slug, tag]));
const categoriesBySlug = new Map(taxonomies.categories.map((category) => [category.slug, category]));

export function getAllPosts(): PostMeta[] {
  return posts;
}

export function getRecentPosts(limit = 3): PostMeta[] {
  return posts.slice(0, limit);
}

export function getAllResources(): Resource[] {
  return resources;
}

export function getRecentResources(limit = 3): Resource[] {
  return resources.slice(0, limit);
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return resourceBySlug.get(slug);
}

export function getResourcesByCategory(category: string): Resource[] {
  const normalizedCategory = slugify(category);
  return resources.filter((resource) =>
    resource.category ? slugify(resource.category) === normalizedCategory : false
  );
}

export function getResourcesByTag(tag: string): Resource[] {
  const normalizedTag = slugify(tag);
  return resources.filter((resource) =>
    resource.tags.some((item) => slugify(item) === normalizedTag)
  );
}

export function getTags() {
  return taxonomies.tags;
}

export function getCategories() {
  return taxonomies.categories;
}

export function getPostsByTagSlug(tagSlug: string): PostMeta[] {
  const tag = tagsBySlug.get(tagSlug);
  if (!tag) {
    return [];
  }

  return posts.filter((post) => post.tags.some((item) => slugify(item) === tag.slug));
}

export function getPostsByCategorySlug(categorySlug: string): PostMeta[] {
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
