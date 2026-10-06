import { useEffect, useState } from "react";
import sermonCardsTranslationsRaw from "@/content/data/sermonCardsTranslations.json";

export interface TranslatedCardData {
  title: string;
  summary: string;
}

const staticTranslations: Record<
  string,
  { en?: TranslatedCardData; es?: TranslatedCardData }
> = sermonCardsTranslationsRaw as any;

const memoryCache = new Map<string, TranslatedCardData>();

function getStorageKey(slug: string, lang: string): string {
  return `ice_card_${slug}_${lang}`;
}

export function getCachedCardTranslation(
  slug: string,
  lang: "en" | "es"
): TranslatedCardData | null {
  const cacheKey = `${slug}__${lang}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 1. Static build-time pre-translated data (always available, 0 network requests)
  const staticItem = staticTranslations[slug]?.[lang];
  if (staticItem && staticItem.title) {
    memoryCache.set(cacheKey, staticItem);
    return staticItem;
  }

  // 2. SessionStorage cache
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(getStorageKey(slug, lang));
      if (stored) {
        const parsed = JSON.parse(stored) as TranslatedCardData;
        if (parsed.title) {
          memoryCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore sessionStorage read errors
    }
  }

  return null;
}

export function setCachedCardTranslation(
  slug: string,
  lang: "en" | "es",
  data: TranslatedCardData
): void {
  const cacheKey = `${slug}__${lang}`;
  memoryCache.set(cacheKey, data);

  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(getStorageKey(slug, lang), JSON.stringify(data));
    } catch {
      // Ignore sessionStorage write errors
    }
  }
}

export async function translateCardsBatch<
  T extends { slug: string; title: string; summary: string }
>(cards: T[], targetLang: "en" | "es"): Promise<Map<string, TranslatedCardData>> {
  const resultMap = new Map<string, TranslatedCardData>();
  const missingIndices: number[] = [];

  // 1. Gather all already cached items
  cards.forEach((card, index) => {
    const cached = getCachedCardTranslation(card.slug, targetLang);
    if (cached) {
      resultMap.set(card.slug, cached);
    } else {
      missingIndices.push(index);
    }
  });

  // If all cards are cached, return immediately
  if (missingIndices.length === 0) {
    return resultMap;
  }

  // 2. Build tagged request query for missing items
  const queryBlocks = missingIndices.map((origIdx, localIdx) => {
    const card = cards[origIdx];
    const safeSummary = (card.summary || "").replace(/\r?\n/g, " ");
    return `[[T_${localIdx}]] ${card.title}\n[[S_${localIdx}]] ${safeSummary}`;
  });

  const queryText = queryBlocks.join("\n");
  let fullTranslatedText = "";

  // 1. Primary: Serverless API proxy backed by Google Cloud Translation API
  try {
    const apiRes = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: queryText,
        targetLang
      })
    });

    if (apiRes.ok) {
      const apiData = await apiRes.json();
      fullTranslatedText = apiData.translatedText || "";
    }
  } catch {
    // /api/translate not available (e.g. static local dev)
  }

  // 2. Secondary fallback
  if (!fullTranslatedText) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: `q=${encodeURIComponent(queryText)}`
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          fullTranslatedText = data[0]
            .map((item: any) => (Array.isArray(item) ? item[0] : ""))
            .join("");
        }
      }
    } catch {
      // Non-blocking fallback
    }
  }

  if (!fullTranslatedText) {
    return resultMap;
  }

  // 3. Parse tags from translated text
  const tagRegex = /\[\[([TS])_(\d+)\]\]\s*([\s\S]*?)(?=\s*\[\[[TS]_\d+\]\]|$)/g;
  const parsedTitles = new Map<number, string>();
  const parsedSummaries = new Map<number, string>();

  let match: RegExpExecArray | null;
  while ((match = tagRegex.exec(fullTranslatedText)) !== null) {
    const type = match[1];
    const localIdx = Number(match[2]);
    const content = match[3].trim();
    if (type === "T") {
      parsedTitles.set(localIdx, content);
    } else if (type === "S") {
      parsedSummaries.set(localIdx, content);
    }
  }

  // 4. Match back to original cards and update cache
  missingIndices.forEach((origIdx, localIdx) => {
    const card = cards[origIdx];
    const translatedTitle = parsedTitles.get(localIdx) || card.title;
    const translatedSummary = parsedSummaries.get(localIdx) || card.summary;

    const data: TranslatedCardData = {
      title: translatedTitle,
      summary: translatedSummary
    };

    setCachedCardTranslation(card.slug, targetLang, data);
    resultMap.set(card.slug, data);
  });

  return resultMap;
}

function resolveInitialPosts<T extends { slug: string; title: string; summary: string }>(
  posts: T[],
  lang: "pt" | "en" | "es"
): T[] {
  if (lang === "pt") return posts;
  return posts.map((post) => {
    const cached = getCachedCardTranslation(post.slug, lang);
    if (cached) {
      return {
        ...post,
        title: cached.title,
        summary: cached.summary
      };
    }
    return post;
  });
}

export function useTranslatedCards<T extends { slug: string; title: string; summary: string }>(
  posts: T[],
  lang: "pt" | "en" | "es"
): {
  translatedPosts: T[];
  isTranslating: boolean;
  error: string | null;
} {
  const [translatedPosts, setTranslatedPosts] = useState<T[]>(() =>
    resolveInitialPosts(posts, lang)
  );
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postsKey = posts.map((p) => p.slug).join(",");

  useEffect(() => {
    if (lang === "pt" || posts.length === 0) {
      setTranslatedPosts(posts);
      setIsTranslating(false);
      setError(null);
      return;
    }

    let isMounted = true;

    // Check synchronous cache first
    let allCached = true;
    const cachedPosts = posts.map((post) => {
      const cached = getCachedCardTranslation(post.slug, lang);
      if (cached) {
        return {
          ...post,
          title: cached.title,
          summary: cached.summary
        };
      }
      allCached = false;
      return post;
    });

    if (allCached) {
      setTranslatedPosts(cachedPosts);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    setError(null);

    translateCardsBatch(posts, lang)
      .then((resultMap) => {
        if (!isMounted) return;
        const updated = posts.map((post) => {
          const trans = resultMap.get(post.slug);
          if (trans) {
            return {
              ...post,
              title: trans.title,
              summary: trans.summary
            };
          }
          return post;
        });
        setTranslatedPosts(updated);
        setIsTranslating(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [postsKey, lang]);

  return {
    translatedPosts: lang === "pt" ? posts : translatedPosts,
    isTranslating,
    error
  };
}
