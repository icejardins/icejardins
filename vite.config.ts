import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

function htmlTagInjector(): Plugin {
  return {
    name: "html-tag-injector",
    transformIndexHtml(html: string) {
      try {
        const siteJsonPath = path.resolve(import.meta.dirname, "src/content/site.json");
        const siteConfig = JSON.parse(fs.readFileSync(siteJsonPath, "utf-8"));

        const gaId = process.env.VITE_GA_ID || siteConfig.googleAnalyticsId;
        const gadsId = process.env.VITE_GADS_ID || siteConfig.googleAdsId;

        const primaryId = gaId || gadsId;
        if (!primaryId) {
          return html.replace("<!--google-tag-->", "");
        }

        let script = `\n    <!-- Google tag (gtag.js) -->\n`;
        script += `    <script async src="https://www.googletagmanager.com/gtag/js?id=${primaryId}"></script>\n`;
        script += `    <script>\n`;
        script += `      window.dataLayer = window.dataLayer || [];\n`;
        script += `      function gtag(){dataLayer.push(arguments);}\n`;
        script += `      gtag('js', new Date());\n`;

        if (gaId) {
          script += `      gtag('config', '${gaId}', { send_page_view: false });\n`;
        }
        if (gadsId) {
          script += `      gtag('config', '${gadsId}');\n`;
        }
        script += `    </script>`;

        return html.replace("<!--google-tag-->", script);
      } catch {
        return html.replace("<!--google-tag-->", "");
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), htmlTagInjector()],
  publicDir: "static",
  ssr: {
    noExternal: ["react-helmet-async"]
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src")
    }
  },
  build: {
    sourcemap: "hidden",
    modulePreload: false,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173
  }
});
