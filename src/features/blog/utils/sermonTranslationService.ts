import sermonCardsTranslationsRaw from "@/content/data/sermonCardsTranslations.json";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export interface TranslatedPostData {
  title: string;
  bodyHtml: string;
  toc?: TocItem[];
}

const staticCardTranslations: Record<
  string,
  { en?: { title: string; summary: string }; es?: { title: string; summary: string } }
> = sermonCardsTranslationsRaw as any;

const memoryCache = new Map<string, TranslatedPostData>();

function getStorageKey(slug: string, lang: string): string {
  return `ice_sermon_cache_${slug}_${lang}`;
}

function readFromStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(key);
    if (val) return val;
  } catch {
    // Ignore localStorage errors (e.g. private mode)
  }
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    // Ignore sessionStorage errors
  }
  return null;
}

function writeToStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
    return;
  } catch {
    // Ignore localStorage errors (e.g. quota exceeded)
  }
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore sessionStorage errors
  }
}

function maskSlots(html: string): { masked: string; slots: string[] } {
  const slots: string[] = [];
  const masked = html.replace(/<div class="video-embed"[\s\S]*?<\/div>/g, (match) => {
    const idx = slots.length;
    slots.push(match);
    return `___EMBED_SLOT_${idx}___`;
  });
  return { masked, slots };
}

function unmaskSlots(html: string, slots: string[]): string {
  return html.replace(/_{2,}\s*EMBED_SLOT_(\d+)\s*_{2,}/g, (_, idxStr) => {
    const idx = Number(idxStr);
    return slots[idx] ?? "";
  });
}

function splitHtmlIntoChunks(html: string, maxChunkSize = 12000): string[] {
  if (html.length <= maxChunkSize) {
    return [html];
  }

  const chunks: string[] = [];
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

async function translateChunk(text: string, targetLang: "en" | "es"): Promise<string> {
  if (!text || !text.trim()) {
    return text;
  }

  // 1. Primary: Serverless API proxy backed by official Google Cloud Translation API (Service Account)
  try {
    const apiRes = await fetch("/api/translate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang: "pt",
        format: "html"
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.translatedText) {
        return data.translatedText;
      }
    }
  } catch {
    // Fallback if /api/translate is unreachable
  }

  // 2. Secondary fallback
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: `q=${encodeURIComponent(text)}`
  });

  if (!res.ok) {
    throw new Error(`Translation request failed with HTTP ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Invalid translation response structure");
  }

  return data[0].map((item: any) => (Array.isArray(item) ? item[0] : "")).join("");
}

export async function translateSermon(
  slug: string,
  title: string,
  bodyHtml: string,
  toc: TocItem[] | undefined,
  targetLang: "en" | "es"
): Promise<TranslatedPostData> {
  const cacheKey = `${slug}__${targetLang}`;

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 2. Check persistent localStorage cache
  const stored = readFromStorage(getStorageKey(slug, targetLang));
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as TranslatedPostData;
      if (parsed.title && parsed.bodyHtml) {
        memoryCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // Ignore parse errors; proceed to fetch
    }
  }

  // 3. Perform on-demand translation
  const { masked, slots } = maskSlots(bodyHtml);
  const chunks = splitHtmlIntoChunks(masked, 12000);
  const tocTexts = (toc || []).map((t) => t.text).join("\n");

  const preTranslatedTitle = staticCardTranslations[slug]?.[targetLang]?.title;

  const [translatedTitle, translatedTocRaw, ...translatedChunks] = await Promise.all([
    preTranslatedTitle ? Promise.resolve(preTranslatedTitle) : translateChunk(title, targetLang),
    tocTexts ? translateChunk(tocTexts, targetLang) : Promise.resolve(""),
    ...chunks.map((chunk) => translateChunk(chunk, targetLang))
  ]);

  const translatedBodyHtml = unmaskSlots(translatedChunks.join(""), slots);
  const translatedTocLines = translatedTocRaw ? translatedTocRaw.split("\n") : [];
  const translatedToc = (toc || []).map((item, index) => ({
    ...item,
    text: translatedTocLines[index]?.trim() || item.text
  }));

  const result: TranslatedPostData = {
    title: (translatedTitle || preTranslatedTitle || title).trim(),
    bodyHtml: translatedBodyHtml,
    toc: translatedToc
  };

  // 4. Update memory and persistent localStorage cache
  memoryCache.set(cacheKey, result);
  writeToStorage(getStorageKey(slug, targetLang), JSON.stringify(result));

  return result;
}

export function getGoogleTranslateFallbackUrl(pageUrl: string, targetLang: "en" | "es"): string {
  return `https://translate.google.com/translate?sl=pt&tl=${targetLang}&u=${encodeURIComponent(pageUrl)}`;
}
