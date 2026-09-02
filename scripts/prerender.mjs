import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const routesPath = path.join(rootDir, "src", "content", "generated", "routes.json");
const serverBundlePath = path.join(rootDir, "dist-ssr", "entry-server.js");

function normalizeRoute(route) {
  if (!route || route === "/") {
    return "/";
  }

  const withLeadingSlash = route.startsWith("/") ? route : `/${route}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

async function main() {
  const templatePath = path.join(distDir, "index.html");
  const [templateRaw, routesRaw] = await Promise.all([
    fs.readFile(templatePath, "utf8"),
    fs.readFile(routesPath, "utf8")
  ]);

  const routes = JSON.parse(routesRaw).map((route) => normalizeRoute(route));
  const uniqueRoutes = [...new Set(routes)];

  const { render } = await import(pathToFileURL(serverBundlePath).href);

  // Inlining ALL CSS files to eliminate render-blocking stylesheet requests
  const cssMatches = [...templateRaw.matchAll(/<link rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/g)];
  let combinedCss = "";

  for (const match of cssMatches) {
    const cssRelativePath = match[1].replace(/^\//, "");
    const cssFilePath = path.join(distDir, cssRelativePath);
    try {
      const cssContent = await fs.readFile(cssFilePath, "utf8");
      combinedCss += cssContent + "\n";
    } catch {
      // ignore missing css
    }
  }

  let template = templateRaw;
  if (combinedCss && cssMatches.length > 0) {
    const firstLinkTag = cssMatches[0][0];
    template = template.replace(firstLinkTag, `<style>${combinedCss}</style>`);
    for (let i = 1; i < cssMatches.length; i++) {
      template = template.replace(cssMatches[i][0], "");
    }
  }


  for (const route of uniqueRoutes) {
    const rendered = await render(route);

    let headTags = rendered.headTags ?? "";
    let appHtml = rendered.appHtml ?? "";
    let html = template;

    // React 19 SSR renders metadata and script tags directly into the rendered tree.
    // Copy them into <head> for crawlers while preserving appHtml for perfect client hydration.
    const extractedHeadTags = [];

    // Extract <title>
    const titleMatches = [...appHtml.matchAll(/<title[^>]*>(.*?)<\/title>/gi)];
    for (const match of titleMatches) {
      headTags += `\n    ${match[0]}`;
    }

    // Extract <meta>
    const metaMatches = [...appHtml.matchAll(/<meta\s+[^>]*\/?>/gi)];
    for (const match of metaMatches) {
      extractedHeadTags.push(match[0]);
    }

    // Extract <link>
    const linkMatches = [...appHtml.matchAll(/<link\s+[^>]*\/?>/gi)];
    for (const match of linkMatches) {
      extractedHeadTags.push(match[0]);
    }

    // Extract <script> (JSON-LD, gtag event snippets)
    const scriptMatches = [...appHtml.matchAll(/<script(?:\s+[^>]*)?>[\s\S]*?<\/script>/gi)];
    for (const match of scriptMatches) {
      extractedHeadTags.push(match[0]);
    }

    if (extractedHeadTags.length > 0) {
      headTags += `\n    ${extractedHeadTags.join("\n    ")}`;
    }

    // Guarantee a unique, valid <title> tag in <head>
    const titleMatch = headTags.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      const pageTitle = titleMatch[1];
      html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
      headTags = headTags.replace(/<title[^>]*>.*?<\/title>/gi, "");
    }

    // Guarantee a unique, valid <meta name="description"> in <head>
    const descMatch = headTags.match(/<meta\s+name="description"\s+content="([^"]*)"[^>]*\/?>/i);
    if (descMatch) {
      const descContent = descMatch[1];
      html = html.replace(/<meta\s+name="description"\s+content="[^"]*"[^>]*\/?>/i, `<meta name="description" content="${descContent}" />`);
      headTags = headTags.replace(/<meta\s+name="description"\s+content="[^"]*"[^>]*\/?>/gi, "");
    }

    // Guarantee a unique, valid <link rel="canonical"> tag in <head>
    const canonicalMatch = headTags.match(/<link\s+rel="canonical"[^>]*href="([^"]+)"[^>]*\/?>/i);
    if (canonicalMatch) {
      const canonicalUrl = canonicalMatch[1];
      if (html.includes('rel="canonical"')) {
        html = html.replace(/<link\s+rel="canonical"[^>]*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
      } else {
        html = html.replace("</head>", `    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`);
      }
      headTags = headTags.replace(/<link\s+rel="canonical"[^>]*\/?>/gi, "");
    }

    if (html.includes("<!--app-head-->")) {
      html = html.replace("<!--app-head-->", headTags);
    } else {
      html = html.replace("</head>", `${headTags}\n  </head>`);
    }

    // Strip metadata and scripts out of appHtml so #root contains only valid body markup
    const cleanAppHtml = appHtml
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
      .replace(/<meta\s+[^>]*\/?>/gi, "")
      .replace(/<link\s+[^>]*\/?>/gi, "")
      .replace(/<script(?:\s+[^>]*)?>[\s\S]*?<\/script>/gi, "");

    if (html.includes("<!--app-html-->")) {
      html = html.replace("<!--app-html-->", cleanAppHtml);
    } else {
      html = html.replace('<div id="root"></div>', `<div id="root">${cleanAppHtml}</div>`);
    }

    const outputPath =
      route === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, "utf8");
  }

  console.log(`Prerendered ${uniqueRoutes.length} routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
