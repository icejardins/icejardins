import type { Reflection, ReflectionMeta } from "@/core/types/content";
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
