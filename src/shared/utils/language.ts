export type Language = "pt" | "en";

export const LANG_COOKIE_NAME = "ice_lang";

export function getLanguagePreference(): Language | null {
  if (typeof window === "undefined") {
    return null;
  }

  // 1. Check Cookie
  const match = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE_NAME}=([^;]*)`));
  if (match) {
    const val = match[1].toLowerCase();
    if (val === "pt" || val === "en") {
      return val;
    }
  }

  // 2. Check localStorage
  try {
    const stored = localStorage.getItem(LANG_COOKIE_NAME);
    if (stored === "pt" || stored === "en") {
      return stored;
    }
  } catch {
    // ignore
  }

  return null;
}

export function setLanguagePreference(lang: Language): void {
  if (typeof window === "undefined") {
    return;
  }

  // Set 1-year persistent cookie
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LANG_COOKIE_NAME}=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;

  try {
    localStorage.setItem(LANG_COOKIE_NAME, lang);
  } catch {
    // ignore
  }
}

export function getBrowserLanguage(): Language {
  if (typeof window === "undefined" || !navigator) {
    return "pt";
  }

  const languages = navigator.languages ?? [navigator.language];
  for (const lang of languages) {
    if (!lang) continue;
    const lower = lang.toLowerCase();
    if (lower.startsWith("en")) {
      return "en";
    }
    if (lower.startsWith("pt")) {
      return "pt";
    }
  }

  return "pt";
}

export function shouldRedirectToEnglish(): boolean {
  const pref = getLanguagePreference();
  if (pref === "en") {
    return true;
  }
  if (pref === "pt") {
    return false;
  }

  // No explicit preference: check browser language
  return getBrowserLanguage() === "en";
}
