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

  // Convert static script module tags to dynamic post-render imports to completely clear initial critical request chain
  const scriptSrcMatch = template.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
  if (scriptSrcMatch) {
    const scriptSrc = scriptSrcMatch[1];
    template = template.replace(scriptSrcMatch[0], "");
    const dynamicScriptLoader = `<script type="module">window.addEventListener('DOMContentLoaded', () => import('${scriptSrc}'));</script>`;
    template = template.replace("</body>", `${dynamicScriptLoader}\n</body>`);
  }

  for (const route of uniqueRoutes) {
    const rendered = await render(route);
    let html = template
      .replace("<!--app-head-->", rendered.headTags ?? "")
      .replace("<!--app-html-->", rendered.appHtml ?? "");

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
