
export interface SearchDocument {
  title: string;
  description: string;
  content: string;
  image?: string | null;
  permalink: string;
}

export function normalizeSearchText(text: string): string {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export const SEARCH_KEYWORD_MAP: Record<string, string[]> = {
  // English -> Portuguese keywords
  church: ["igreja"],
  worship: ["adoracao", "culto"],
  service: ["culto", "servico"],
  prayer: ["oracao"],
  pray: ["orar", "oracao"],
  grace: ["graca"],
  faith: ["fe"],
  hope: ["esperanca"],
  love: ["amor"],
  cross: ["cruz"],
  god: ["deus"],
  jesus: ["jesus", "cristo"],
  christ: ["cristo"],
  holy: ["santo", "santidade"],
  spirit: ["espirito"],
  "holy spirit": ["espirito santo"],
  bible: ["biblia", "escrituras"],
  scripture: ["escrituras", "biblia"],
  sermon: ["sermao", "pregacao", "mensagem"],
  sermons: ["sermoes", "pregacoes", "mensagens"],
  message: ["mensagem"],
  messages: ["mensagens"],
  preaching: ["pregacao"],
  give: ["contribuir", "doacao", "oferta", "dizimo"],
  giving: ["contribuir", "doacao", "oferta"],
  donation: ["doacao", "contribuir"],
  donations: ["doacoes", "contribuir"],
  offering: ["oferta"],
  offerings: ["ofertas"],
  tithe: ["dizimo"],
  tithes: ["dizimos"],
  temple: ["templo", "projeto"],
  project: ["projeto"],
  visit: ["visitar", "visita"],
  believe: ["cremos", "fe"],
  belief: ["crenca", "doutrina"],
  doctrine: ["doutrina"],
  salvation: ["salvacao"],
  repentance: ["arrependimento"],
  forgiveness: ["perdao"],
  peace: ["paz"],
  joy: ["alegria"],
  covenant: ["alianca"],
  sovereignty: ["soberania"],
  suffering: ["sofrimento"],
  wisdom: ["sabedoria"],
  justice: ["justica"],
  righteousness: ["justica"],
  redemption: ["redencao"],
  truth: ["verdade"],
  eternal: ["eterno", "eternidade"],
  eternity: ["eternidade"],
  life: ["vida"],
  gospel: ["evangelho"],
  fellowship: ["comunhao"],
  resurrection: ["ressurreicao"],
  heaven: ["ceu"],
  hebrews: ["hebreus"],
  galatians: ["galatas"],
  ephesians: ["efesios"],
  acts: ["atos"],
  revelation: ["apocalipse"],
  genesis: ["genesis"],
  james: ["tiago"],
  titus: ["tito"],
  judges: ["juizes"],
  lamentations: ["lamentacoes"],
  luke: ["lucas"],
  john: ["joao"],
  jeremiah: ["jeremias"],
  haggai: ["ageu"],
  joel: ["joel"],
  jude: ["judas"],
  "new testament": ["novo testamento"],
  "old testament": ["antigo testamento"],

  // Spanish -> Portuguese keywords
  iglesia: ["igreja"],
  adoracion: ["adoracao", "culto"],
  culto: ["culto"],
  oracion: ["oracao"],
  orar: ["orar", "oracao"],
  gracia: ["graca"],
  fe: ["fe"],
  esperanza: ["esperanca"],
  amor: ["amor"],
  cruz: ["cruz"],
  dios: ["deus"],
  cristo: ["cristo"],
  santo: ["santo", "santidade"],
  santidad: ["santidade"],
  espiritu: ["espirito"],
  "espiritu santo": ["espirito santo"],
  biblia: ["biblia", "escrituras"],
  escrituras: ["escrituras", "biblia"],
  sermones: ["sermoes", "pregacoes", "mensagens"],
  mensaje: ["mensagem"],
  mensajes: ["mensagens"],
  predicacion: ["pregacao"],
  donar: ["contribuir", "doacao", "oferta", "dizimo"],
  donaciones: ["doacoes", "contribuir"],
  ofrenda: ["oferta"],
  ofrendas: ["ofertas"],
  diezmo: ["dizimo"],
  diezmos: ["dizimos"],
  templo: ["templo", "projeto"],
  proyecto: ["projeto"],
  visita: ["visita", "visitar"],
  visitar: ["visitar"],
  creemos: ["cremos", "fe"],
  doctrina: ["doutrina"],
  salvacion: ["salvacao"],
  arrepentimiento: ["arrependimento"],
  perdon: ["perdao"],
  paz: ["paz"],
  alegria: ["alegria"],
  alianza: ["alianca"],
  soberania: ["soberania"],
  sufrimiento: ["sofrimento"],
  sabiduria: ["sabedoria"],
  justicia: ["justica"],
  redencion: ["redencao"],
  verdad: ["verdade"],
  eterno: ["eterno", "eternidade"],
  eternidad: ["eternidade"],
  vida: ["vida"],
  evangelio: ["evangelho"],
  comunion: ["comunhao"],
  resurreccion: ["ressurreicao"],
  cielo: ["ceu"],
  hebreos: ["hebreus"],
  santiago: ["tiago"],
  hechos: ["atos"],
  apocalipsis: ["apocalipse"],
  jueces: ["juizes"],
  lamentaciones: ["lamentacoes"],
  hageo: ["ageu"],
  "nuevo testamento": ["novo testamento"],
  "antiguo testamento": ["antigo testamento"]
};

export function expandSearchTerms(rawQuery: string): string[] {
  const normalized = normalizeSearchText(rawQuery);
  if (!normalized) {
    return [];
  }

  const terms = new Set<string>();
  terms.add(normalized);

  // Exact phrase match in synonyms
  if (SEARCH_KEYWORD_MAP[normalized]) {
    SEARCH_KEYWORD_MAP[normalized].forEach((t) => terms.add(t));
  }

  // Individual word tokens
  const words = normalized.split(/\s+/).filter((w) => w.length >= 2);
  words.forEach((word) => {
    terms.add(word);
    if (SEARCH_KEYWORD_MAP[word]) {
      SEARCH_KEYWORD_MAP[word].forEach((t) => terms.add(t));
    }
  });

  return Array.from(terms);
}

export function filterAndRankDocs(
  docs: SearchDocument[],
  query: string,
  lang: "pt" | "en" | "es"
): SearchDocument[] {
  const terms = expandSearchTerms(query);
  if (terms.length === 0) {
    return [];
  }

  const scored: Array<{ doc: SearchDocument; score: number }> = [];

  for (const doc of docs) {
    const normTitle = normalizeSearchText(doc.title);
    const normDesc = normalizeSearchText(doc.description);
    const normContent = normalizeSearchText(doc.content);

    let score = 0;

    for (const term of terms) {
      if (normTitle.includes(term)) {
        score += 100;
        // Exact title start bonus
        if (normTitle.startsWith(term)) {
          score += 50;
        }
      }
      if (normDesc.includes(term)) {
        score += 25;
      }
      if (normContent.includes(term)) {
        score += 5;
      }
    }

    // Boost documents that natively match the active language route
    if (lang === "en" && doc.permalink.startsWith("/en/")) {
      score += 40;
    } else if (lang === "es" && doc.permalink.startsWith("/es/")) {
      score += 40;
    } else if (lang === "pt" && !doc.permalink.startsWith("/en/") && !doc.permalink.startsWith("/es/")) {
      score += 15;
    }

    if (score > 0) {
      scored.push({ doc, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map((s) => s.doc);
}

export function getLocalizedPermalink(permalink: string, lang: "pt" | "en" | "es"): string {
  if (lang === "pt") {
    return permalink;
  }

  // Sermons
  if (permalink.startsWith("/posts/") && permalink !== "/posts/") {
    return `${permalink}?lang=${lang}`;
  }

  // Root / Home
  if (permalink === "/") {
    return lang === "es" ? "/es/" : "/en/";
  }

  // Sermons index
  if (permalink === "/posts/") {
    return lang === "es" ? "/es/sermones/" : "/en/sermons/";
  }

  // Give / Contribuir
  if (permalink === "/contribuir/") {
    return lang === "es" ? "/es/donar/" : "/en/give/";
  }

  // Temple project
  if (
    permalink === "/contribuir/projeto-templo/" ||
    permalink === "/contribuir/projeto-edificacao/"
  ) {
    return lang === "es" ? "/es/donar/proyecto-templo/" : "/en/give/temple-project/";
  }

  // Faith / Fe
  if (permalink === "/fe/") {
    return lang === "es" ? "/es/fe/" : "/en/faith/";
  }

  // Visit
  if (permalink === "/visita/" || permalink === "/visitar/") {
    return lang === "es" ? "/es/visita/" : "/en/visit/";
  }

  // Taxonomies
  if (permalink.startsWith("/categorias/") || permalink.startsWith("/tags/")) {
    return `${permalink}?lang=${lang}`;
  }

  return permalink;
}

export function extractPostSlug(permalink: string): string | null {
  const match = permalink.match(/^\/posts\/([^/?#]+)/);
  return match ? match[1] : null;
}
