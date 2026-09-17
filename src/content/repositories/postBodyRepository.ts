import type { Post } from "@/core/types/content";
import postsMetaJson from "@/content/generated/posts-meta.json";

let postBySlug: Map<string, Post>;

if (import.meta.env.SSR) {
  const postsJson = await import("@/content/generated/posts.json");
  const posts = (postsJson.default || postsJson) as unknown as Post[];
  postBySlug = new Map(posts.map((post) => [post.slug, post]));
} else {
  const posts = postsMetaJson as unknown as Post[];
  postBySlug = new Map(posts.map((post) => [post.slug, post]));
}

export function getPostBySlug(slug: string): Post | undefined {
  return postBySlug.get(slug);
}
