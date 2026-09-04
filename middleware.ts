export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  // Only consider root ("/") and contribution routes
  const isRoot = pathname === "/";
  const isContribute =
    pathname === "/contribuir" ||
    pathname === "/contribua" ||
    pathname === "/doacoes" ||
    pathname === "/doe";

  if (!isRoot && !isContribute) {
    return;
  }

  // 1. Check user explicit cookie preference
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)ice_lang=([^;]+)/);
  const pref = match ? match[1].toLowerCase() : null;

  if (pref === "pt") {
    return; // User explicitly prefers Portuguese
  }
  if (pref === "en") {
    const dest = isRoot ? "/en/" : "/en/give/";
    return Response.redirect(new URL(dest, request.url), 307);
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";
  if (checkEnglishPreference(acceptLanguage)) {
    const dest = isRoot ? "/en/" : "/en/give/";
    return Response.redirect(new URL(dest, request.url), 307);
  }

  return;
}

function checkEnglishPreference(acceptLanguage: string): boolean {
  if (!acceptLanguage) return false;

  const parts = acceptLanguage.split(",").map((item) => {
    const [lang, qVal] = item.trim().split(";");
    const q = qVal && qVal.startsWith("q=") ? parseFloat(qVal.slice(2)) : 1.0;
    return { lang: lang.toLowerCase(), q: isNaN(q) ? 1.0 : q };
  });

  let enScore = 0;
  let ptScore = 0;

  for (const part of parts) {
    if (part.lang.startsWith("en") && part.q > enScore) {
      enScore = part.q;
    }
    if (part.lang.startsWith("pt") && part.q > ptScore) {
      ptScore = part.q;
    }
  }

  return enScore > 0 && enScore >= ptScore;
}

export const config = {
  matcher: [
    "/",
    "/contribuir",
    "/contribuir/",
    "/contribua",
    "/contribua/",
    "/doacoes",
    "/doacoes/",
    "/doe",
    "/doe/"
  ]
};
