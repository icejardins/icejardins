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

function apiDevServer(): Plugin {
  return {
    name: "api-dev-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith("/api/send-lead")) {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const apiModule = await server.ssrLoadModule("/api/send-lead.ts");
              const handler = apiModule.default || apiModule;
              const mockReq = Object.assign(req, { body });
              const mockRes = {
                setHeader: (k: string, v: string) => res.setHeader(k, v),
                status: (code: number) => {
                  res.statusCode = code;
                  return mockRes;
                },
                json: (data: any) => {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                },
                end: () => res.end()
              };
              await handler(mockReq, mockRes);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err.message || "Internal server error" }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), htmlTagInjector(), apiDevServer()],
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
