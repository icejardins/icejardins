import fs from "node:fs";
import path from "node:path";

const TOPIC_TRANSLATIONS = {
  "Ansiedade e Paz": { en: "Anxiety & Peace", es: "Ansiedad y Paz" },
  "Esperança e Futuro": { en: "Hope & Future", es: "Esperanza y Futuro" },
  "Fé e Confiança": { en: "Faith & Trust", es: "Fe y Confianza" },
  "Relacionamentos e Família": { en: "Relationships & Family", es: "Relaciones y Familia" },
  "Culpa e Perdão": { en: "Guilt & Forgiveness", es: "Culpa y Perdón" },
  "Cansaço e Descanso": { en: "Rest & Burnout", es: "Descanso y Cansancio" },
  "Sabedoria e Decisões": { en: "Wisdom & Decisions", es: "Sabiduría y Decisiones" },
  "Tristeza e Crises": { en: "Grief & Hard Times", es: "Tristeza y Crisis" },
  "Trabalho e Propósito": { en: "Work & Purpose", es: "Trabajo y Propósito" },
  "Autocontrole e Caráter": { en: "Self-Control & Character", es: "Autocontrol y Carácter" },
  "Amor e Generosidade": { en: "Love & Generosity", es: "Amor y Generosidad" },
  "Solidão e Pertencimento": { en: "Loneliness & Belonging", es: "Soledad y Pertenencia" },
  "Superação e Coragem": { en: "Courage & Overcoming", es: "Coraje y Superación" },
  "Oração e Vida com Deus": { en: "Prayer & Spiritual Life", es: "Oración y Vida con Dios" }
};

const BOOK_TRANSLATIONS = {
  "Gênesis": { en: "Genesis", es: "Génesis" },
  "3 João": { en: "3 John", es: "3 Juan" },
  "2 João": { en: "2 John", es: "2 Juan" },
  "Efésios": { en: "Ephesians", es: "Efesios" },
  "1 João": { en: "1 John", es: "1 Juan" },
  "Joel": { en: "Joel", es: "Joel" },
  "Atos": { en: "Acts", es: "Hechos" },
  "Lamentações": { en: "Lamentations", es: "Lamentaciones" },
  "Jeremias": { en: "Jeremiah", es: "Jeremías" },
  "Tito": { en: "Titus", es: "Tito" },
  "Hebreus": { en: "Hebrews", es: "Hebreos" },
  "Apocalipse": { en: "Revelation", es: "Apocalipsis" },
  "Lucas": { en: "Luke", es: "Lucas" },
  "Judas": { en: "Jude", es: "Judas" },
  "Tiago": { en: "James", es: "Santiago" },
  "Ageu": { en: "Haggai", es: "Hageo" },
  "Gálatas": { en: "Galatians", es: "Gálatas" },
  "Juízes": { en: "Judges", es: "Jueces" }
};

// Map each of the 91 sermons to primary topics and book
const SERMON_TOPICS = [
  /* 1 */  { book: "Gênesis", topics: ["Relacionamentos e Família", "Autocontrole e Caráter"] },
  /* 2 */  { book: "Gênesis", topics: ["Culpa e Perdão", "Esperança e Futuro"] },
  /* 3 */  { book: "Gênesis", topics: ["Trabalho e Propósito", "Relacionamentos e Família"] },
  /* 4 */  { book: "Gênesis", topics: ["Cansaço e Descanso", "Ansiedade e Paz"] },
  /* 5 */  { book: "Gênesis", topics: ["Esperança e Futuro", "Ansiedade e Paz"] },
  /* 6 */  { book: "3 João", topics: ["Relacionamentos e Família", "Autocontrole e Caráter"] },
  /* 7 */  { book: "3 João", topics: ["Amor e Generosidade", "Trabalho e Propósito"] },
  /* 8 */  { book: "2 João", topics: ["Sabedoria e Decisões", "Fé e Confiança"] },
  /* 9 */  { book: "Efésios", topics: ["Solidão e Pertencimento", "Amor e Generosidade"] },
  /* 10 */ { book: "Efésios", topics: ["Trabalho e Propósito", "Solidão e Pertencimento"] },
  /* 11 */ { book: "1 João", topics: ["Fé e Confiança", "Amor e Generosidade"] },
  /* 12 */ { book: "1 João", topics: ["Sabedoria e Decisões", "Fé e Confiança"] },
  /* 13 */ { book: "1 João", topics: ["Culpa e Perdão", "Ansiedade e Paz"] },
  /* 14 */ { book: "1 João", topics: ["Amor e Generosidade", "Relacionamentos e Família"] },
  /* 15 */ { book: "1 João", topics: ["Fé e Confiança", "Esperança e Futuro"] },
  /* 16 */ { book: "1 João", topics: ["Esperança e Futuro", "Ansiedade e Paz"] },
  /* 17 */ { book: "1 João", topics: ["Trabalho e Propósito", "Ansiedade e Paz"] },
  /* 18 */ { book: "1 João", topics: ["Fé e Confiança", "Autocontrole e Caráter"] },
  /* 19 */ { book: "Joel", topics: ["Tristeza e Crises", "Superação e Coragem"] },
  /* 20 */ { book: "Joel", topics: ["Tristeza e Crises", "Culpa e Perdão"] },
  /* 21 */ { book: "Joel", topics: ["Culpa e Perdão", "Autocontrole e Caráter"] },
  /* 22 */ { book: "Joel", topics: ["Esperança e Futuro", "Culpa e Perdão"] },
  /* 23 */ { book: "Joel", topics: ["Esperança e Futuro", "Sabedoria e Decisões"] },
  /* 24 */ { book: "Joel", topics: ["Ansiedade e Paz", "Esperança e Futuro"] },
  /* 25 */ { book: "1 João", topics: ["Solidão e Pertencimento", "Fé e Confiança"] },
  /* 26 */ { book: "Atos", topics: ["Culpa e Perdão", "Esperança e Futuro"] },
  /* 27 */ { book: "Lamentações", topics: ["Tristeza e Crises", "Esperança e Futuro"] },
  /* 28 */ { book: "Jeremias", topics: ["Fé e Confiança", "Ansiedade e Paz"] },
  /* 29 */ { book: "Jeremias", topics: ["Sabedoria e Decisões", "Tristeza e Crises"] },
  /* 30 */ { book: "Jeremias", topics: ["Autocontrole e Caráter", "Sabedoria e Decisões"] },
  /* 31 */ { book: "Jeremias", topics: ["Esperança e Futuro", "Culpa e Perdão"] },
  /* 32 */ { book: "Jeremias", topics: ["Ansiedade e Paz", "Esperança e Futuro"] },
  /* 33 */ { book: "Jeremias", topics: ["Sabedoria e Decisões", "Fé e Confiança"] },
  /* 34 */ { book: "Jeremias", topics: ["Sabedoria e Decisões", "Fé e Confiança"] },
  /* 35 */ { book: "Jeremias", topics: ["Fé e Confiança", "Esperança e Futuro"] },
  /* 36 */ { book: "Jeremias", topics: ["Oração e Vida com Deus", "Tristeza e Crises"] },
  /* 37 */ { book: "Jeremias", topics: ["Solidão e Pertencimento", "Cansaço e Descanso"] },
  /* 38 */ { book: "Jeremias", topics: ["Oração e Vida com Deus", "Tristeza e Crises"] },
  /* 39 */ { book: "Jeremias", topics: ["Relacionamentos e Família", "Fé e Confiança"] },
  /* 40 */ { book: "Jeremias", topics: ["Sabedoria e Decisões", "Autocontrole e Caráter"] },
  /* 41 */ { book: "Jeremias", topics: ["Sabedoria e Decisões", "Tristeza e Crises"] },
  /* 42 */ { book: "Jeremias", topics: ["Esperança e Futuro", "Fé e Confiança"] },
  /* 43 */ { book: "Jeremias", topics: ["Trabalho e Propósito", "Superação e Coragem"] },
  /* 44 */ { book: "Jeremias", topics: ["Relacionamentos e Família", "Culpa e Perdão"] },
  /* 45 */ { book: "Tito", topics: ["Esperança e Futuro", "Autocontrole e Caráter"] },
  /* 46 */ { book: "Tito", topics: ["Trabalho e Propósito", "Autocontrole e Caráter"] },
  /* 47 */ { book: "Tito", topics: ["Sabedoria e Decisões", "Autocontrole e Caráter"] },
  /* 48 */ { book: "Hebreus", topics: ["Oração e Vida com Deus", "Esperança e Futuro"] },
  /* 49 */ { book: "Hebreus", topics: ["Relacionamentos e Família", "Fé e Confiança"] },
  /* 50 */ { book: "Hebreus", topics: ["Fé e Confiança", "Esperança e Futuro"] },
  /* 51 */ { book: "Apocalipse", topics: ["Esperança e Futuro", "Ansiedade e Paz"] },
  /* 52 */ { book: "Hebreus", topics: ["Superação e Coragem", "Fé e Confiança"] },
  /* 53 */ { book: "Hebreus", topics: ["Fé e Confiança", "Superação e Coragem"] },
  /* 54 */ { book: "Hebreus", topics: ["Esperança e Futuro", "Fé e Confiança"] },
  /* 55 */ { book: "Hebreus", topics: ["Fé e Confiança", "Esperança e Futuro"] },
  /* 56 */ { book: "Hebreus", topics: ["Fé e Confiança", "Solidão e Pertencimento"] },
  /* 57 */ { book: "Hebreus", topics: ["Culpa e Perdão", "Esperança e Futuro"] },
  /* 58 */ { book: "Hebreus", topics: ["Ansiedade e Paz", "Fé e Confiança"] },
  /* 59 */ { book: "Hebreus", topics: ["Oração e Vida com Deus", "Fé e Confiança"] },
  /* 60 */ { book: "Hebreus", topics: ["Esperança e Futuro", "Fé e Confiança"] },
  /* 61 */ { book: "Hebreus", topics: ["Ansiedade e Paz", "Esperança e Futuro"] },
  /* 62 */ { book: "Hebreus", topics: ["Autocontrole e Caráter", "Relacionamentos e Família"] },
  /* 63 */ { book: "Hebreus", topics: ["Cansaço e Descanso", "Ansiedade e Paz"] },
  /* 64 */ { book: "Lucas", topics: ["Trabalho e Propósito", "Autocontrole e Caráter"] },
  /* 65 */ { book: "Hebreus", topics: ["Fé e Confiança", "Sabedoria e Decisões"] },
  /* 66 */ { book: "Hebreus", topics: ["Oração e Vida com Deus", "Fé e Confiança"] },
  /* 67 */ { book: "Judas", topics: ["Superação e Coragem", "Fé e Confiança"] },
  /* 68 */ { book: "3 João", topics: ["Relacionamentos e Família", "Amor e Generosidade"] },
  /* 69 */ { book: "Tiago", topics: ["Oração e Vida com Deus", "Tristeza e Crises"] },
  /* 70 */ { book: "Tiago", topics: ["Trabalho e Propósito", "Sabedoria e Decisões"] },
  /* 71 */ { book: "Tiago", topics: ["Autocontrole e Caráter", "Relacionamentos e Família"] },
  /* 72 */ { book: "Tiago", topics: ["Relacionamentos e Família", "Amor e Generosidade"] },
  /* 73 */ { book: "Tiago", topics: ["Autocontrole e Caráter", "Sabedoria e Decisões"] },
  /* 74 */ { book: "Tiago", topics: ["Superação e Coragem", "Tristeza e Crises"] },
  /* 75 */ { book: "Ageu", topics: ["Esperança e Futuro", "Ansiedade e Paz"] },
  /* 76 */ { book: "Ageu", topics: ["Trabalho e Propósito", "Superação e Coragem"] },
  /* 77 */ { book: "Ageu", topics: ["Trabalho e Propósito", "Ansiedade e Paz"] },
  /* 78 */ { book: "Gálatas", topics: ["Autocontrole e Caráter", "Fé e Confiança"] },
  /* 79 */ { book: "Gálatas", topics: ["Relacionamentos e Família", "Autocontrole e Caráter"] },
  /* 80 */ { book: "Gálatas", topics: ["Amor e Generosidade", "Relacionamentos e Família"] },
  /* 81 */ { book: "Gálatas", topics: ["Esperança e Futuro", "Tristeza e Crises"] },
  /* 82 */ { book: "Gálatas", topics: ["Autocontrole e Caráter", "Ansiedade e Paz"] },
  /* 83 */ { book: "Gálatas", topics: ["Autocontrole e Caráter", "Esperança e Futuro"] },
  /* 84 */ { book: "Gálatas", topics: ["Solidão e Pertencimento", "Amor e Generosidade"] },
  /* 85 */ { book: "Gálatas", topics: ["Culpa e Perdão", "Ansiedade e Paz"] },
  /* 86 */ { book: "Gálatas", topics: ["Sabedoria e Decisões", "Fé e Confiança"] },
  /* 87 */ { book: "Gálatas", topics: ["Culpa e Perdão", "Esperança e Futuro"] },
  /* 88 */ { book: "Efésios", topics: ["Ansiedade e Paz", "Superação e Coragem"] },
  /* 89 */ { book: "Efésios", topics: ["Esperança e Futuro", "Fé e Confiança"] },
  /* 90 */ { book: "Juízes", topics: ["Superação e Coragem", "Fé e Confiança"] },
  /* 91 */ { book: "Juízes", topics: ["Autocontrole e Caráter", "Sabedoria e Decisões"] }
];

function getTagsForSermon(index, lang) {
  const item = SERMON_TOPICS[index - 1];
  if (!item) return [];

  const bookName =
    lang === "en"
      ? BOOK_TRANSLATIONS[item.book]?.en || item.book
      : lang === "es"
      ? BOOK_TRANSLATIONS[item.book]?.es || item.book
      : item.book;

  const topicNames = item.topics.map((t) => {
    if (lang === "en") return TOPIC_TRANSLATIONS[t]?.en || t;
    if (lang === "es") return TOPIC_TRANSLATIONS[t]?.es || t;
    return t;
  });

  return [...topicNames, bookName];
}

async function run() {
  const reflexoesDir = path.resolve("content/reflexoes");
  const sermonQuestions = JSON.parse(
    fs.readFileSync("src/content/data/sermonQuestions.json", "utf-8")
  );

  // Build a lookup by sermonSlug
  const sermonByIndex = new Map(sermonQuestions.map((s) => [s.index, s]));
  const sermonBySlug = new Map(sermonQuestions.map((s) => [s.slug, s]));

  const files = fs.readdirSync(reflexoesDir).filter((f) => f.endsWith(".md"));
  console.log(`Encontrados ${files.length} arquivos de reflexão.`);

  let updatedCount = 0;

  for (const file of files) {
    const fullPath = path.join(reflexoesDir, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    // Extract lang and sermonSlug
    const langMatch = content.match(/lang\s*=\s*["']([^"']+)["']/);
    const sermonSlugMatch = content.match(/sermonSlug\s*=\s*["']([^"']+)["']/);

    const lang = langMatch ? langMatch[1] : "pt";
    let sermonSlug = sermonSlugMatch ? sermonSlugMatch[1] : null;

    let sermonItem = null;
    if (sermonSlug && sermonBySlug.has(sermonSlug)) {
      sermonItem = sermonBySlug.get(sermonSlug);
    } else {
      // Find matching sermon
      for (const s of sermonQuestions) {
        if (s.slug === sermonSlug || file.includes(s.slug.slice(0, 20))) {
          sermonItem = s;
          break;
        }
      }
    }

    if (!sermonItem) {
      console.warn(`Aviso: não encontrou sermão para ${file}`);
      continue;
    }

    const richTags = getTagsForSermon(sermonItem.index, lang);
    const tagsJson = JSON.stringify(richTags);

    let newContent;
    if (/tags\s*=\s*\[[^\]]*\]/.test(content)) {
      newContent = content.replace(/tags\s*=\s*\[[^\]]*\]/, `tags = ${tagsJson}`);
    } else {
      // insert tags before categorias or sermonSlug
      newContent = content.replace(
        /(categorias\s*=|sermonSlug\s*=)/,
        `tags = ${tagsJson}\n$1`
      );
    }

    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, "utf-8");
      updatedCount++;
    }
  }

  console.log(`✓ Atualizados ${updatedCount} arquivos com tags temáticas ricas!`);
}

run().catch(console.error);
