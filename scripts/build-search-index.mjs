import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, "src", "content", "generated");
const staticDir = path.join(rootDir, "static");

function stripHtml(input) {
  return String(input ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const [pagesRaw, postsRaw] = await Promise.all([
    fs.readFile(path.join(generatedDir, "pages.json"), "utf8"),
    fs.readFile(path.join(generatedDir, "posts.json"), "utf8")
  ]);

  const pages = JSON.parse(pagesRaw.replace(/^\uFEFF/, ""));
  const posts = JSON.parse(postsRaw.replace(/^\uFEFF/, ""));

  const docs = [
    ...pages.map((page) => ({
      title: page.title,
      description: page.description,
      content: stripHtml(page.bodyHtml),
      image: null,
      permalink: page.route
    })),
    ...posts.map((post) => ({
      title: post.title,
      description: post.description,
      content: stripHtml(post.bodyHtml),
      image: post.image,
      permalink: post.route
    }))
  ];

  await fs.mkdir(staticDir, { recursive: true });
  await fs.writeFile(
    path.join(staticDir, "search-index.json"),
    `${JSON.stringify(docs, null, 2)}\n`,
    "utf8"
  );

  console.log(`Generated search index with ${docs.length} records.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
