import type { Reflection, ReflectionMeta } from "@/core/types/content";
import { slugify } from "@/core/utils/slugify";
import reflectionsMetaJson from "@/content/generated/reflections-meta.json";

let reflectionBySlug: Map<string, Reflection>;
let allReflections: Reflection[];

if (import.meta.env.SSR) {
  const reflectionsJson = await import("@/content/generated/reflections.json");
  const list = (reflectionsJson.default || reflectionsJson) as unknown as Reflection[];
  allReflections = list;
  reflectionBySlug = new Map(list.map((r) => [r.slug, r]));
} else {
  const list = reflectionsMetaJson as unknown as Reflection[];
  allReflections = list;
  reflectionBySlug = new Map(list.map((r) => [r.slug, r]));
}

export function getAllReflections(): ReflectionMeta[] {
  return allReflections;
}

export function getReflectionsByLang(lang: "pt" | "en" | "es"): ReflectionMeta[] {
  return allReflections.filter((r) => r.lang === lang);
}

export function getReflectionBySlug(slug: string): Reflection | undefined {
  return reflectionBySlug.get(slug);
}

export interface ReflectionTag {
  name: string;
  slug: string;
  count: number;
}

export function getReflectionTags(lang: "pt" | "en" | "es"): ReflectionTag[] {
  const reflections = getReflectionsByLang(lang);
  const tagCounts = new Map<string, { name: string; count: number }>();

  for (const r of reflections) {
    for (const tag of r.tags || []) {
      const slug = slugify(tag);
      const existing = tagCounts.get(slug);
      if (existing) {
        existing.count++;
      } else {
        tagCounts.set(slug, { name: tag, count: 1 });
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([slug, data]) => ({ slug, name: data.name, count: data.count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getReflectionsByTag(tagSlug: string, lang: "pt" | "en" | "es"): ReflectionMeta[] {
  const normalizedTag = tagSlug.toLowerCase();
  return getReflectionsByLang(lang).filter((r) =>
    (r.tags || []).some((t) => slugify(t) === normalizedTag)
  );
}

export interface PaginatedReflections {
  items: ReflectionMeta[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function paginateReflections(
  items: ReflectionMeta[],
  page = 1,
  pageSize = 12
): PaginatedReflections {
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

