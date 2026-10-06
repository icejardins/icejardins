export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  // Only consider root ("/"), contribution, and faith routes
  const isRoot = pathname === "/";
  const isContribute =
    pathname === "/contribuir" ||
    pathname === "/contribua" ||
    pathname === "/doacoes" ||
    pathname === "/doe";
  const isFaith = pathname === "/fe";

  if (!isRoot && !isContribute && !isFaith) {
    return;
  }

  const userAgent = request.headers.get("user-agent") || "";
  // Never redirect search engine crawlers or audit tools
  if (/googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|petalbot|semrushbot|ahrefsbot|lighthouse/i.test(userAgent)) {
    return;
  }

  const destEn = isRoot ? "/en/" : isFaith ? "/en/faith/" : "/en/give/";
  const destEs = isRoot ? "/es/" : isFaith ? "/es/fe/" : "/es/donar/";

  // 1. Check user explicit cookie preference
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)ice_lang=([^;]+)/);
  const pref = match ? match[1].toLowerCase() : null;

  if (pref === "pt") {
    return; // User explicitly prefers Portuguese
  }
  if (pref === "en") {
    return Response.redirect(new URL(destEn, request.url), 307);
  }
  if (pref === "es") {
    return Response.redirect(new URL(destEs, request.url), 307);
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferredLang = detectPreferredLanguage(acceptLanguage);
  if (preferredLang === "en") {
    return Response.redirect(new URL(destEn, request.url), 307);
  }
  if (preferredLang === "es") {
    return Response.redirect(new URL(destEs, request.url), 307);
  }

  return;
}

function detectPreferredLanguage(acceptLanguage: string): "pt" | "en" | "es" {
  if (!acceptLanguage) return "pt";

  const parts = acceptLanguage.split(",").map((item) => {
    const [lang, qVal] = item.trim().split(";");
    const q = qVal && qVal.startsWith("q=") ? parseFloat(qVal.slice(2)) : 1.0;
    return { lang: lang.toLowerCase(), q: isNaN(q) ? 1.0 : q };
  });

  let enScore = 0;
  let esScore = 0;
  let ptScore = 0;

  for (const part of parts) {
    if (part.lang.startsWith("en") && part.q > enScore) {
      enScore = part.q;
    }
    if (part.lang.startsWith("es") && part.q > esScore) {
      esScore = part.q;
    }
    if (part.lang.startsWith("pt") && part.q > ptScore) {
      ptScore = part.q;
    }
  }

  if (esScore > 0 && esScore >= ptScore && esScore >= enScore) {
    return "es";
  }
  if (enScore > 0 && enScore >= ptScore && enScore > esScore) {
    return "en";
  }

  return "pt";
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/",
    "/contribuir",
    "/contribuir/",
    "/contribua",
    "/contribua/",
    "/doacoes",
    "/doacoes/",
    "/doe",
    "/doe/",
    "/fe",
    "/fe/"
  ]
};
