import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "node:fs/promises";

const BASE_URL = process.env.AUDIT_BASE_URL || "https://icejardins.org.br";

const ROUTES = [
  "/",
  "/en/",
  "/visita/",
  "/fe/",
  "/en/faith/",
  "/contribuir/",
  "/en/give/",
  "/posts/",
  "/posts/joel-1-a-chegada-do-dia-do-senhor/",
  "/categorias/sermoes/",
  "/tags/devocional/",
  "/recursos/",
  "/recursos/quando-a-cabeca-nao-para/",
  "/recursos/palavras-que-confortam/",
  "/privacy/",
  "/terms/"
];

async function main() {
  console.log(`Starting Lighthouse audit on ${BASE_URL} for ${ROUTES.length} routes...`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox"],
    chromePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });

  const results = [];

  try {
    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      console.log(`\nAuditing ${url}...`);

      // 1. Mobile Audit
      try {
        const mobileRes = await lighthouse(url, {
          port: chrome.port,
          output: "json",
          logLevel: "error"
        });
        const mCats = mobileRes.lhr.categories;
        const mScores = {
          perf: Math.round((mCats.performance?.score ?? 0) * 100),
          a11y: Math.round((mCats.accessibility?.score ?? 0) * 100),
          bp: Math.round((mCats["best-practices"]?.score ?? 0) * 100),
          seo: Math.round((mCats.seo?.score ?? 0) * 100)
        };

        const mFailures = [];
        for (const [id, a] of Object.entries(mobileRes.lhr.audits)) {
          if (a.score !== null && a.score < 1 && a.details) {
            mFailures.push({ id, title: a.title, score: a.score, displayValue: a.displayValue });
          }
        }

        console.log(`  [Mobile]  Perf: ${mScores.perf} | A11y: ${mScores.a11y} | BP: ${mScores.bp} | SEO: ${mScores.seo}`);

        // 2. Desktop Audit
        const desktopRes = await lighthouse(url, {
          port: chrome.port,
          output: "json",
          logLevel: "error"
        }, {
          extends: "lighthouse:default",
          settings: {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0
            }
          }
        });
        const dCats = desktopRes.lhr.categories;
        const dScores = {
          perf: Math.round((dCats.performance?.score ?? 0) * 100),
          a11y: Math.round((dCats.accessibility?.score ?? 0) * 100),
          bp: Math.round((dCats["best-practices"]?.score ?? 0) * 100),
          seo: Math.round((dCats.seo?.score ?? 0) * 100)
        };

        const dFailures = [];
        for (const [id, a] of Object.entries(desktopRes.lhr.audits)) {
          if (a.score !== null && a.score < 1 && a.details) {
            dFailures.push({ id, title: a.title, score: a.score, displayValue: a.displayValue });
          }
        }

        console.log(`  [Desktop] Perf: ${dScores.perf} | A11y: ${dScores.a11y} | BP: ${dScores.bp} | SEO: ${dScores.seo}`);

        results.push({
          route,
          mobile: { scores: mScores, failures: mFailures },
          desktop: { scores: dScores, failures: dFailures }
        });
      } catch (err) {
        console.error(`  Error auditing ${url}:`, err.message);
      }
    }

    const outPath = "./lighthouse-summary.json";
    await fs.writeFile(outPath, JSON.stringify(results, null, 2));
    console.log(`\nAudit complete! Saved results to ${outPath}`);
  } finally {
    await chrome.kill();
  }
}

main().catch(console.error);
