export function formatDate(
  value: string | null,
  lang: "pt" | "en" | "es" = "pt"
): string {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const localeMap: Record<"pt" | "en" | "es", string> = {
    pt: "pt-BR",
    en: "en-US",
    es: "es-ES"
  };

  return new Intl.DateTimeFormat(localeMap[lang] || "pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(parsed);
}

