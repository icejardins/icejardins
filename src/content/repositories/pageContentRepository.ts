import type { PageContent } from "@/core/types/content";
import pagesJson from "@/content/generated/pages.json";

const pages = pagesJson as PageContent[];
const pageBySlug = new Map(pages.map((page) => [page.slug, page]));

export function getAllPages(): PageContent[] {
  return pages;
}

export function getPageBySlug(slug: string): PageContent | undefined {
  return pageBySlug.get(slug);
}
