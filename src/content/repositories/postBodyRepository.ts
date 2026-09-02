import type { Post } from "@/core/types/content";
import postsJson from "@/content/generated/posts.json";

const posts = postsJson as Post[];
const postBySlug = new Map(posts.map((post) => [post.slug, post]));

export function getPostBySlug(slug: string): Post | undefined {
  return postBySlug.get(slug);
}
