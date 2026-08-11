import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseToml } from "toml";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const generatedDir = path.join(rootDir, "src", "content", "generated");
const staticDir = path.join(rootDir, "static");
const configuredBaseUrl = process.env.SITE_URL ?? process.env.VITE_SITE_URL;

const YOUTUBE_SHORTCODE_REGEX = /\{\{<\s*youtube\s+([^\s>]+)\s*>\}\}/g;

function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeRoute(route) {
  if (!route || route === "/") {
    return "/";
  }

  const normalized = route.startsWith("/") ? route : `/${route}`;
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

async function getMarkdownFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMarkdownFiles(absolutePath)));
      continue;
    }

    if (entry.isFile() && absolutePath.endsWith(".md")) {
      files.push(absolutePath);
    }
  }

  return files;
}

function preprocessMarkdown(markdown) {
  return markdown.replace(
    YOUTUBE_SHORTCODE_REGEX,
    (_, videoId) =>
      `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${videoId}" title="Video do YouTube" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
  );
}

function parseFrontmatter(rawContent) {
  const withoutBom = rawContent.replace(/^\uFEFF/, "");
  const trimmedStart = withoutBom.trimStart();

  if (trimmedStart.startsWith("+++")) {
    const tomlFrontmatterMatch = withoutBom.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?/);
    if (!tomlFrontmatterMatch) {
      return {
        data: {},
        content: withoutBom
      };
    }

    const frontmatterContent = tomlFrontmatterMatch[1];
    const parsedToml = parseToml(
      frontmatterContent.endsWith("\n") ? frontmatterContent : `${frontmatterContent}\n`
    );

    return {
      data: parsedToml,
      content: withoutBom.slice(tomlFrontmatterMatch[0].length)
    };
  }

  return matter(withoutBom);
}

function nodeToText(node) {
  if (!node) {
    return "";
  }

  if (node.type === "text" || node.type === "inlineCode") {
    return node.value ?? "";
  }

  if (Array.isArray(node.children)) {
    return node.children.map((child) => nodeToText(child)).join("");
  }

  return "";
}

async function markdownToHtmlAndToc(markdown) {
  const preparedMarkdown = preprocessMarkdown(markdown);
  const processor = remark().use(remarkGfm);
  const tree = await processor.run(processor.parse(preparedMarkdown));

  const toc = [];
  visit(tree, "heading", (node) => {
    const headingText = nodeToText(node).trim();
    if (!headingText) {
      return;
    }

    toc.push({
      depth: node.depth,
      text: headingText,
      id: slugify(headingText)
    });
  });

  const html = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(preparedMarkdown);

  return { html: String(html), toc };
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadingTime(content) {
  const words = content.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 220;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function toIsoDate(rawValue) {
  if (!rawValue) {
    return null;
  }

  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function buildSummary(plainText) {
  if (plainText.length <= 220) {
    return plainText;
  }

  return `${plainText.slice(0, 217).trimEnd()}...`;
}

function stripHtmlToText(value) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildScriptureSummary(html, fallbackPlainText) {
  const matches = html.match(/<blockquote>[\s\S]*?<\/blockquote>/gi) ?? [];
  const passages = matches
    .map((blockquoteHtml) => stripHtmlToText(blockquoteHtml))
    .filter(Boolean);

  if (passages.length === 0) {
    return buildSummary(fallbackPlainText);
  }

  const joined = passages.join(" • ");
  return buildSummary(joined);
}

function buildPageRoute(slug) {
  if (!slug || slug === "index") {
    return "/";
  }

  return `/${slug}/`;
}

function ensureArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  return [String(value)];
}

function registerTaxonomy(map, name) {
  const normalizedName = String(name).trim();
  if (!normalizedName) {
    return;
  }

  const slug = slugify(normalizedName);
  if (!slug) {
    return;
  }

  const existing = map.get(slug);
  if (existing) {
    existing.count += 1;
    return;
  }

  map.set(slug, {
    slug,
    name: normalizedName,
    count: 1
  });
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

async function main() {
  await fs.mkdir(generatedDir, { recursive: true });
  await fs.mkdir(staticDir, { recursive: true });

  const siteConfigRaw = await fs.readFile(
    path.join(rootDir, "src", "content", "site.json"),
    "utf8"
  );
  const siteConfigData = JSON.parse(siteConfigRaw.replace(/^\uFEFF/, ""));

  const pageFiles = (await getMarkdownFiles(contentDir)).filter((filePath) => {
    const relativePath = toPosixPath(path.relative(contentDir, filePath));
    return !relativePath.startsWith("posts/");
  });

  const postFiles = (await getMarkdownFiles(path.join(contentDir, "posts"))).filter(
    (filePath) => path.basename(filePath) !== "_index.md"
  );

  const pages = [];
  for (const filePath of pageFiles) {
    const relativePath = toPosixPath(path.relative(contentDir, filePath));
    const slug = relativePath.replace(/\.md$/, "");
    const fileContent = await fs.readFile(filePath, "utf8");
    const parsed = parseFrontmatter(fileContent);
    const { html, toc } = await markdownToHtmlAndToc(parsed.content);
    const plainText = stripHtml(html);

    pages.push({
      slug,
      route: normalizeRoute(buildPageRoute(slug)),
      title: String(parsed.data.title ?? slug),
      description: String(parsed.data.description ?? buildSummary(plainText)),
      layout: parsed.data.layout ? String(parsed.data.layout) : null,
      bodyHtml: html,
      toc,
      plainText,
      sourcePath: relativePath
    });
  }

  const posts = [];
  const tagMap = new Map();
  const categoryMap = new Map();

  for (const filePath of postFiles) {
    const relativePath = toPosixPath(path.relative(path.join(contentDir, "posts"), filePath));
    const slug = relativePath.replace(/\.md$/, "");
    const fileContent = await fs.readFile(filePath, "utf8");
    const parsed = parseFrontmatter(fileContent);
    const { html, toc } = await markdownToHtmlAndToc(parsed.content);
    const plainText = stripHtml(html);

    const tags = ensureArray(parsed.data.tags);
    const categories = ensureArray(parsed.data.categorias ?? parsed.data.categories);

    for (const tag of tags) {
      registerTaxonomy(tagMap, tag);
    }

    for (const category of categories) {
      registerTaxonomy(categoryMap, category);
    }

    const readingTime = estimateReadingTime(plainText);
    const scriptureSummary = buildScriptureSummary(html, plainText);
    const description = String(parsed.data.description ?? parsed.data.subtitle ?? scriptureSummary);

    posts.push({
      slug,
      route: normalizeRoute(`/posts/${slug}/`),
      title: String(parsed.data.title ?? slug),
      subtitle: parsed.data.subtitle ? String(parsed.data.subtitle) : null,
      description,
      date: toIsoDate(parsed.data.date),
      image: parsed.data.image ? String(parsed.data.image) : null,
      tags,
      categories,
      readingTime,
      summary: scriptureSummary,
      bodyHtml: html,
      toc,
      plainText,
      sourcePath: `posts/${relativePath}`
    });
  }

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

  const postsIndexPath = path.join(contentDir, "posts", "_index.md");
  const postsIndexRaw = await fs.readFile(postsIndexPath, "utf8");
  const postsIndex = parseFrontmatter(postsIndexRaw);

  const siteConfig = {
    ...siteConfigData,
    baseUrl: String(configuredBaseUrl ?? siteConfigData.baseUrl ?? "https://icejardins.org.br").replace(/\/+$/, ""),
    blog: {
      title: String(postsIndex.data.title ?? siteConfigData.blog?.title ?? "Sermões"),
      description: String(postsIndex.data.description ?? siteConfigData.blog?.description ?? "Sermões e publicações recentes")
    }
  };

  const taxonomies = {
    tags: [...tagMap.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    categories: [...categoryMap.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    )
  };

  const routes = new Set(["/", "/posts/"]);

  for (const page of pages) {
    routes.add(normalizeRoute(page.route));
  }

  for (const post of posts) {
    routes.add(normalizeRoute(post.route));
  }

  for (const tag of taxonomies.tags) {
    routes.add(normalizeRoute(`/tags/${tag.slug}/`));
  }

  for (const category of taxonomies.categories) {
    routes.add(normalizeRoute(`/categorias/${category.slug}/`));
  }

  const sortedRoutes = [...routes].sort((left, right) => {
    if (left === "/") {
      return -1;
    }
    if (right === "/") {
      return 1;
    }
    return left.localeCompare(right);
  });

  const todayIso = new Date().toISOString().split("T")[0];
  const postDates = posts.map((p) => p.date).filter(Boolean);
  const latestPostDate = postDates.length > 0 ? new Date(postDates[0]).toISOString().split("T")[0] : todayIso;

  const postRouteMap = new Map();
  for (const post of posts) {
    const route = normalizeRoute(post.route);
    const dateStr = post.date ? new Date(post.date).toISOString().split("T")[0] : latestPostDate;
    postRouteMap.set(route, dateStr);
  }

  const sitemapEntries = sortedRoutes
    .map((route) => {
      const cleanedRoute = route === "/" ? "/" : route.replace(/\/+$/, "/");
      const loc = `${siteConfig.baseUrl}${cleanedRoute}`;
      let lastmod = latestPostDate;
      let changefreq = "weekly";
      let priority = "0.8";

      if (cleanedRoute === "/") {
        lastmod = latestPostDate;
        changefreq = "daily";
        priority = "1.0";
      } else if (cleanedRoute === "/visita/" || cleanedRoute === "/fe/") {
        lastmod = todayIso;
        changefreq = "weekly";
        priority = "0.9";
      } else if (postRouteMap.has(cleanedRoute)) {
        lastmod = postRouteMap.get(cleanedRoute);
        changefreq = "monthly";
        priority = "0.8";
      } else if (cleanedRoute.startsWith("/tags/") || cleanedRoute.startsWith("/categorias/")) {
        lastmod = latestPostDate;
        changefreq = "weekly";
        priority = "0.6";
      }

      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.baseUrl}/sitemap.xml\n`;

  const rssItems = posts
    .slice(0, 20)
    .map((post) => {
      const postUrl = `${siteConfig.baseUrl}${normalizeRoute(post.route)}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
      const description = post.description ? post.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
      const title = post.title ? post.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
      return `    <item>\n      <title>${title}</title>\n      <link>${postUrl}</link>\n      <guid isPermaLink="true">${postUrl}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${description}</description>\n    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${siteConfig.title}</title>\n    <link>${siteConfig.baseUrl}/</link>\n    <description>${siteConfig.description}</description>\n    <language>pt-br</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${rssItems}\n  </channel>\n</rss>\n`;

  await fs.writeFile(path.join(staticDir, "sitemap.xml"), sitemapXml, "utf8");
  await fs.writeFile(path.join(staticDir, "rss.xml"), rssXml, "utf8");
  await fs.writeFile(path.join(staticDir, "robots.txt"), robotsTxt, "utf8");

  await fs.writeFile(
    path.join(generatedDir, "site-config.json"),
    `${JSON.stringify(siteConfig, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(generatedDir, "pages.json"),
    `${JSON.stringify(pages, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(generatedDir, "posts.json"),
    `${JSON.stringify(posts, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(generatedDir, "taxonomies.json"),
    `${JSON.stringify(taxonomies, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(generatedDir, "routes.json"),
    `${JSON.stringify(sortedRoutes, null, 2)}\n`,
    "utf8"
  );

  console.log(`Generated ${pages.length} pages, ${posts.length} posts, ${sortedRoutes.length} routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
