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

  // Inlining CSS to remove render-blocking stylesheet requests
  const cssMatch = templateRaw.match(/<link rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/);
  let cssContent = "";
  let cssLinkTag = "";

  if (cssMatch) {
    cssLinkTag = cssMatch[0];
    const cssRelativePath = cssMatch[1].replace(/^\//, "");
    const cssFilePath = path.join(distDir, cssRelativePath);
    try {
      cssContent = await fs.readFile(cssFilePath, "utf8");
    } catch {
      cssContent = "";
    }
  }

  for (const route of uniqueRoutes) {
    const rendered = await render(route);
    let html = templateRaw
      .replace("<!--app-head-->", rendered.headTags ?? "")
      .replace("<!--app-html-->", rendered.appHtml ?? "");

    if (cssContent && cssLinkTag) {
      html = html.replace(cssLinkTag, `<style>${cssContent}</style>`);
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
