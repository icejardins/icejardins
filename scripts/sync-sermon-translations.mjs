import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const postsMetaPath = path.join(rootDir, "src", "content", "generated", "posts-meta.json");
const cacheFile = path.join(rootDir, "src", "content", "data", "sermonCardsTranslations.json");

async function translateBatch(items, lang) {
  const query = items
    .map((p, idx) => `[[T_${idx}]] ${p.title}\n[[S_${idx}]] ${(p.summary || "").replace(/\r?\n/g, " ")}`)
    .join("\n");

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${lang}&dt=t`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: `q=${encodeURIComponent(query)}`
  });

  if (!res.ok) {
    throw new Error(`Translation API returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data[0].map((item) => (Array.isArray(item) ? item[0] : "")).join("");

  const tagRegex = /\[\[([TS])_(\d+)\]\]\s*([\s\S]*?)(?=\s*\[\[[TS]_\d+\]\]|$)/g;
  const titles = new Map();
  const summaries = new Map();
  let m;
  while ((m = tagRegex.exec(text)) !== null) {
    if (m[1] === "T") titles.set(Number(m[2]), m[3].trim());
    else if (m[1] === "S") summaries.set(Number(m[2]), m[3].trim());
  }

  return items.map((p, idx) => ({
    slug: p.slug,
    title: titles.get(idx) || p.title,
    summary: summaries.get(idx) || p.summary || ""
  }));
}

export async function syncSermonTranslations() {
  let posts = [];
  try {
    const raw = await fs.readFile(postsMetaPath, "utf8");
    posts = JSON.parse(raw);
  } catch {
    return;
  }

  let existingCache = {};
  try {
    const rawCache = await fs.readFile(cacheFile, "utf8");
    existingCache = JSON.parse(rawCache);
  } catch {
    existingCache = {};
  }

  let updated = false;
  const BATCH_SIZE = 10;

  for (const lang of ["es", "en"]) {
    const missing = posts.filter((p) => !existingCache[p.slug]?.[lang]?.title);
    if (missing.length === 0) continue;

    console.log(`[sync-translations] Translating ${missing.length} missing posts for '${lang}'...`);

    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      try {
        const translated = await translateBatch(batch, lang);
        for (const item of translated) {
          if (!existingCache[item.slug]) existingCache[item.slug] = {};
          existingCache[item.slug][lang] = {
            title: item.title,
            summary: item.summary
          };
        }
        updated = true;
      } catch (err) {
        console.warn(`[sync-translations] Could not translate batch for ${lang}:`, err.message);
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  if (updated || Object.keys(existingCache).length === 0) {
    await fs.writeFile(cacheFile, `${JSON.stringify(existingCache, null, 2)}\n`, "utf8");
    console.log("[sync-translations] Updated sermonCardsTranslations.json");
  }
}

if (process.argv[1]?.endsWith("sync-sermon-translations.mjs")) {
  syncSermonTranslations().catch((err) => {
    console.error("[sync-translations] Error:", err);
  });
}
