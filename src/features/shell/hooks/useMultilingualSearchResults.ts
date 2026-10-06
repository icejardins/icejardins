import { useEffect, useState } from "react";
import {
  getCachedCardTranslation,
  setCachedCardTranslation,
  translateCardsBatch
} from "@/features/blog/utils/cardTranslationService";
import {
  extractPostSlug,
  getLocalizedPermalink,
  type SearchDocument
} from "@/features/shell/utils/searchTranslationService";

export interface DisplaySearchResult {
  title: string;
  description: string;
  permalink: string;
  isTranslated?: boolean;
}

export function useMultilingualSearchResults(
  rawResults: SearchDocument[],
  lang: "pt" | "en" | "es"
): {
  results: DisplaySearchResult[];
  isTranslating: boolean;
} {
  const [results, setResults] = useState<DisplaySearchResult[]>(() =>
    rawResults.map((doc) => ({
      title: doc.title,
      description: doc.description,
      permalink: getLocalizedPermalink(doc.permalink, lang)
    }))
  );
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const resultsKey = rawResults.map((r) => r.permalink).join("|");

  useEffect(() => {
    if (lang === "pt" || rawResults.length === 0) {
      setResults(
        rawResults.map((doc) => ({
          title: doc.title,
          description: doc.description,
          permalink: doc.permalink
        }))
      );
      setIsTranslating(false);
      return;
    }

    let isMounted = true;

    // Check what is already cached
    let allCached = true;
    const initialMapped: DisplaySearchResult[] = [];
    const missingToFetch: Array<{ slug: string; title: string; summary: string }> = [];

    for (const doc of rawResults) {
      const permalink = getLocalizedPermalink(doc.permalink, lang);
      const isAlreadyLocalized =
        (lang === "en" && doc.permalink.startsWith("/en/")) ||
        (lang === "es" && doc.permalink.startsWith("/es/"));

      if (isAlreadyLocalized) {
        initialMapped.push({
          title: doc.title,
          description: doc.description,
          permalink,
          isTranslated: true
        });
        continue;
      }

      const slug = extractPostSlug(doc.permalink) || doc.permalink.replace(/\//g, "-").replace(/^-|-$/g, "");
      const cached = getCachedCardTranslation(slug, lang);

      if (cached) {
        initialMapped.push({
          title: cached.title,
          description: cached.summary,
          permalink,
          isTranslated: true
        });
      } else {
        allCached = false;
        initialMapped.push({
          title: doc.title,
          description: doc.description,
          permalink,
          isTranslated: false
        });
        missingToFetch.push({
          slug,
          title: doc.title,
          summary: doc.description
        });
      }
    }

    setResults(initialMapped);

    if (allCached || missingToFetch.length === 0) {
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);

    translateCardsBatch(missingToFetch, lang)
      .then((resultMap) => {
        if (!isMounted) return;

        const updated = rawResults.map((doc) => {
          const permalink = getLocalizedPermalink(doc.permalink, lang);
          const isAlreadyLocalized =
            (lang === "en" && doc.permalink.startsWith("/en/")) ||
            (lang === "es" && doc.permalink.startsWith("/es/"));

          if (isAlreadyLocalized) {
            return {
              title: doc.title,
              description: doc.description,
              permalink,
              isTranslated: true
            };
          }

          const slug = extractPostSlug(doc.permalink) || doc.permalink.replace(/\//g, "-").replace(/^-|-$/g, "");
          const trans = resultMap.get(slug) || getCachedCardTranslation(slug, lang);

          if (trans) {
            return {
              title: trans.title,
              description: trans.summary,
              permalink,
              isTranslated: true
            };
          }

          return {
            title: doc.title,
            description: doc.description,
            permalink,
            isTranslated: false
          };
        });

        setResults(updated);
        setIsTranslating(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Search results translation failed:", err);
        setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resultsKey, lang]);

  return {
    results,
    isTranslating
  };
}
