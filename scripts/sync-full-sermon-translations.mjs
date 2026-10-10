import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const postsJsonPath = path.join(rootDir, "src", "content", "generated", "posts.json");
const cardsTranslationsPath = path.join(rootDir, "src", "content", "data", "sermonCardsTranslations.json");
const translationsDir = path.join(rootDir, "src", "content", "data", "sermons-translations");
const staticPostsDir = path.join(rootDir, "static", "data", "posts");

const CLIENTS = ["it", "at", "gtx"];
let clientIndex = 0;

function maskSlots(html) {
  const slots = [];
  const masked = html.replace(/<div class="video-embed"[\s\S]*?<\/div>/g, (match) => {
    const idx = slots.length;
    slots.push(match);
    return `___EMBED_SLOT_${idx}___`;
  });
  return { masked, slots };
}

function unmaskSlots(html, slots) {
  return html.replace(/_{2,}\s*EMBED_SLOT_(\d+)\s*_{2,}/g, (_, idxStr) => {
    const idx = Number(idxStr);
    return slots[idx] ?? "";
  });
}

function splitHtmlIntoChunks(html, maxChunkSize = 4000) {
  if (html.length <= maxChunkSize) {
    return [html];
  }

  const chunks = [];
  let remaining = html;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }

    let splitIdx = remaining.lastIndexOf("</p>", maxChunkSize);
    if (splitIdx === -1 || splitIdx < maxChunkSize * 0.4) {
      splitIdx = remaining.lastIndexOf("</div>", maxChunkSize);
    }
    if (splitIdx === -1 || splitIdx < maxChunkSize * 0.4) {
      splitIdx = remaining.lastIndexOf("</blockquote>", maxChunkSize);
    }
    if (splitIdx === -1 || splitIdx < maxChunkSize * 0.4) {
      splitIdx = remaining.lastIndexOf("</h2>", maxChunkSize);
    }
    if (splitIdx === -1 || splitIdx < maxChunkSize * 0.4) {
      splitIdx = remaining.lastIndexOf("</h3>", maxChunkSize);
    }
    if (splitIdx === -1 || splitIdx < maxChunkSize * 0.4) {
      splitIdx = remaining.lastIndexOf(">", maxChunkSize);
    }
    if (splitIdx === -1) {
      splitIdx = maxChunkSize;
    } else {
      splitIdx += 4;
    }

    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx);
  }

  return chunks;
}

async function translateChunkWithRetry(text, targetLang, maxRetries = 6) {
  if (!text || !text.trim()) {
    return text;
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const client = CLIENTS[(clientIndex + attempt) % CLIENTS.length];
    const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=pt&tl=${targetLang}&dt=t`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        },
        body: `q=${encodeURIComponent(text)}`
      });

      if (res.status === 200) {
        clientIndex = (clientIndex + 1) % CLIENTS.length;
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          return data[0].map((item) => (Array.isArray(item) ? item[0] : "")).join("");
        }
      }

      if (res.status === 429) {
        const waitMs = 2000 * Math.pow(1.5, attempt);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }

  throw new Error("All translation attempts failed");
}

async function translateSermonPost(post, targetLang, cardTranslations) {
  const preTranslatedTitle = cardTranslations[post.slug]?.[targetLang]?.title;
  let translatedTitle = preTranslatedTitle;

  if (!translatedTitle && post.title) {
    translatedTitle = await translateChunkWithRetry(post.title, targetLang);
    await new Promise((r) => setTimeout(r, 400));
  }

  // Translate TOC
  let translatedToc = post.toc || [];
  if (Array.isArray(post.toc) && post.toc.length > 0) {
    const tocTexts = post.toc.map((t) => t.text).join("\n");
    const rawTocTranslated = await translateChunkWithRetry(tocTexts, targetLang);
    const tocLines = rawTocTranslated ? rawTocTranslated.split("\n") : [];
    translatedToc = post.toc.map((item, index) => ({
      ...item,
      text: tocLines[index]?.trim() || item.text
    }));
    await new Promise((r) => setTimeout(r, 400));
  }

  // Translate body HTML sequentially to prevent rate limits
  const { masked, slots } = maskSlots(post.bodyHtml || "");
  const chunks = splitHtmlIntoChunks(masked, 4000);
  const translatedChunks = [];

  for (const chunk of chunks) {
    const translated = await translateChunkWithRetry(chunk, targetLang);
    translatedChunks.push(translated);
    await new Promise((r) => setTimeout(r, 600));
  }

  const translatedBodyHtml = unmaskSlots(translatedChunks.join(""), slots);

  return {
    slug: post.slug,
    title: (translatedTitle || post.title).trim(),
    bodyHtml: translatedBodyHtml,
    toc: translatedToc
  };
}

export async function syncFullSermonTranslations(options = {}) {
  const { limit = null, quiet = false } = options;

  await fs.mkdir(translationsDir, { recursive: true });
  await fs.mkdir(staticPostsDir, { recursive: true });

  let posts = [];
  try {
    const raw = await fs.readFile(postsJsonPath, "utf8");
    posts = JSON.parse(raw);
  } catch (err) {
    console.warn("[sync-full-translations] Could not read posts.json:", err.message);
    return;
  }

  let cardTranslations = {};
  try {
    const raw = await fs.readFile(cardsTranslationsPath, "utf8");
    cardTranslations = JSON.parse(raw);
  } catch {
    cardTranslations = {};
  }

  const languages = ["es", "en"];
  let totalProcessed = 0;
  let totalSkipped = 0;

  for (const lang of languages) {
    const missing = [];
    for (const post of posts) {
      const targetFile = path.join(translationsDir, `${post.slug}.${lang}.json`);
      try {
        const existingRaw = await fs.readFile(targetFile, "utf8");
        const existing = JSON.parse(existingRaw);
        if (existing.bodyHtml && existing.bodyHtml.length > 100) {
          totalSkipped++;
          // Ensure file is also in static/data/posts/
          const staticTarget = path.join(staticPostsDir, `${post.slug}.${lang}.json`);
          try {
            await fs.access(staticTarget);
          } catch {
            await fs.writeFile(staticTarget, existingRaw, "utf8");
          }
          continue;
        }
      } catch {
        // file doesn't exist or is invalid
      }
      missing.push(post);
    }

    if (missing.length === 0) {
      if (!quiet) console.log(`[sync-full-translations] All ${posts.length} posts already translated for '${lang}'.`);
      continue;
    }

    const toProcess = limit ? missing.slice(0, limit) : missing;
    console.log(`[sync-full-translations] Translating ${toProcess.length} posts for '${lang}' (already cached: ${posts.length - missing.length})...`);

    for (let i = 0; i < toProcess.length; i++) {
      const post = toProcess[i];
      const start = Date.now();
      try {
        process.stdout.write(`  [${i + 1}/${toProcess.length}] (${lang}) ${post.slug}... `);
        const translated = await translateSermonPost(post, lang, cardTranslations);
        const jsonContent = JSON.stringify(translated, null, 2);

        // Save to persistent src/content/data/sermons-translations
        const targetFile = path.join(translationsDir, `${post.slug}.${lang}.json`);
        await fs.writeFile(targetFile, jsonContent, "utf8");

        // Also copy directly to static/data/posts
        const staticTarget = path.join(staticPostsDir, `${post.slug}.${lang}.json`);
        await fs.writeFile(staticTarget, jsonContent, "utf8");

        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`done in ${elapsed}s`);
        totalProcessed++;
      } catch (err) {
        console.log(`FAILED: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  console.log(`[sync-full-translations] Finished. Processed: ${totalProcessed}, Already cached: ${totalSkipped}`);
}

if (process.argv[1]?.endsWith("sync-full-sermon-translations.mjs")) {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : null;
  syncFullSermonTranslations({ limit }).catch((err) => {
    console.error("[sync-full-translations] Error:", err);
  });
}
