import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseToml } from "toml";
import { execFile, execSync } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

try {
  process.loadEnvFile();
} catch {}

const rootDir = process.cwd();
const contentPostsDir = path.join(rootDir, "content", "posts");
const contentReflexoesDir = path.join(rootDir, "content", "reflexoes");
const questionsPath = path.join(
  rootDir,
  "src",
  "content",
  "data",
  "sermonQuestions.json"
);
const progressPath = path.join(contentReflexoesDir, ".progress.json");

function parseFrontmatter(rawContent) {
  const withoutBom = rawContent.replace(/^\uFEFF/, "").trimStart();
  if (withoutBom.startsWith("+++")) {
    const match = withoutBom.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?/);
    if (!match) return { data: {}, content: withoutBom };
    return {
      data: parseToml(match[1].endsWith("\n") ? match[1] : `${match[1]}\n`),
      content: withoutBom.slice(match[0].length)
    };
  }
  return matter(withoutBom);
}

function stripShortcodes(text) {
  return text.replace(/\{\{<[^>]+>\}\}/g, "").trim();
}

function cleanMarkdownFences(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```markdown")) {
    cleaned = cleaned.slice("```markdown".length).trim();
  } else if (cleaned.startsWith("```toml")) {
    cleaned = cleaned.slice("```toml".length).trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3).trim();
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3).trim();
  }
  return cleaned;
}

function extractPassage(sermonData) {
  if (sermonData.passage) return sermonData.passage;
  const title = sermonData.title || "";
  const parts = title.split(" - ");
  if (parts.length > 1 && /\d/.test(parts[0])) {
    return parts[0].trim();
  }
  return "";
}

function countWords(markdownText) {
  const body = markdownText.replace(/^\+\+\+[\s\S]*?\+\+\+\r?\n?/, "").trim();
  return body.split(/\s+/).filter(Boolean).length;
}

function toSlug(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isExistingValid(filename) {
  const filePath = path.join(contentReflexoesDir, filename);
  try {
    const content = fsSync.readFileSync(filePath, "utf8");
    const words = countWords(content);
    return words >= 800 && words <= 1000;
  } catch {
    return false;
  }
}

async function runAgy(prompt, timeoutMs = 120000) {
  const agyPath = "/opt/homebrew/bin/agy";
  const { stdout, stderr } = await execFileAsync(
    agyPath,
    ["--model", "gemini-3.8-flash-low", "-p", prompt],
    { maxBuffer: 10 * 1024 * 1024, timeout: timeoutMs }
  );
  if (!stdout && stderr) {
    throw new Error(`agy error: ${stderr}`);
  }
  return stdout.trim();
}

async function callLLM(apiKey, prompt, maxRetries = 4) {
  const useApi = apiKey && apiKey !== "agy" && apiKey !== "none";

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (useApi) {
        const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.65, maxOutputTokens: 16384 }
          })
        });

        if (res.status === 200) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) throw new Error("Resposta sem texto da API Gemini");
          return cleanMarkdownFences(text);
        }

        if (res.status === 429 || res.status >= 500) {
          const waitMs = 3000 * Math.pow(1.8, attempt);
          console.warn(`  [retry API] HTTP ${res.status}. Aguardando ${(waitMs / 1000).toFixed(1)}s...`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }

        const errorText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      } else {
        // Fallback to agy CLI
        const out = await runAgy(prompt);
        if (!out) throw new Error("Saída vazia de agy CLI");
        return cleanMarkdownFences(out);
      }
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      const waitMs = 2500 * (attempt + 1);
      console.warn(`  [retry] Erro: ${err.message}. Retentando em ${(waitMs / 1000).toFixed(1)}s...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }

  throw new Error("Todas as tentativas de geração falharam.");
}

async function ensureStrictWordCount(rawMarkdown, lang, key) {
  let cleaned = cleanMarkdownFences(rawMarkdown);
  const match = cleaned.match(/^\+\+\+[\s\S]*?\+\+\+\r?\n?/);
  const frontmatter = match ? match[0] : "";
  let body = match ? cleaned.slice(match[0].length).trim() : cleaned.trim();
  let words = countWords(body);

  if (words >= 800 && words <= 1000) {
    return frontmatter + body;
  }

  // If too long, tighten
  if (words > 1000) {
    console.log(`    [Ajuste] ${lang.toUpperCase()} tem ${words} palavras (>1000). Enxugando para ~900 palavras...`);
    const prompt = `Tighten and trim the following ${lang.toUpperCase()} reflection article so its body is strictly between 850 and 930 words (currently it has ${words} words).
Preserve the exact same opening 2-3 direct answer sentences, clear subheadings, simple vocabulary (elementary school level), biblical narrative, and practical next step.
Return ONLY the trimmed markdown body text (do not include frontmatter).

Text:
${body}`;

    try {
      const trimmedBody = await callLLM(key, prompt);
      const newWords = countWords(trimmedBody);
      if (newWords >= 800 && newWords <= 1000) {
        return frontmatter + trimmedBody;
      }
      body = trimmedBody;
    } catch (e) {
      console.warn("    Falha ao enxugar texto:", e.message);
    }
  }

  // If too short, expand
  if (words < 800) {
    console.log(`    [Ajuste] ${lang.toUpperCase()} tem ${words} palavras (<800). Expandindo para ~900 palavras...`);
    const prompt = `Expand the following ${lang.toUpperCase()} reflection article so its body is strictly between 850 and 930 words (currently it has ${words} words).
Add richer everyday life examples and compassionate pastoral depth while keeping the friendly tone, simple vocabulary, short paragraphs, opening 2-3 direct answer sentences, and practical next step.
Return ONLY the expanded markdown body text (do not include frontmatter).

Text:
${body}`;

    try {
      const expandedBody = await callLLM(key, prompt);
      const newWords = countWords(expandedBody);
      if (newWords >= 800 && newWords <= 1000) {
        return frontmatter + expandedBody;
      }
      body = expandedBody;
    } catch (e) {
      console.warn("    Falha ao expandir texto:", e.message);
    }
  }

  return frontmatter + body;
}

export async function processSermon(item, key) {
  const sermonFilePath = path.join(contentPostsDir, `${item.slug}.md`);
  let sermonRaw;
  try {
    sermonRaw = await fs.readFile(sermonFilePath, "utf8");
  } catch {
    console.warn(`[aviso] Arquivo ${item.slug}.md não encontrado.`);
    return false;
  }

  const sermon = parseFrontmatter(sermonRaw);
  const sermonBody = stripShortcodes(sermon.content);
  const passage = extractPassage(sermon.data);

  const ptSlug = toSlug(item.questions.pt);
  const enSlug = toSlug(item.questions.en);
  const esSlug = toSlug(item.questions.es);

  const ptFilename = `${ptSlug}.md`;
  const enFilename = `${enSlug}.md`;
  const esFilename = `${esSlug}.md`;

  const ptDone = isExistingValid(ptFilename);
  const enDone = isExistingValid(enFilename);
  const esDone = isExistingValid(esFilename);

  if (ptDone && enDone && esDone) {
    return false;
  }

  console.log(`\n[processando] #${item.index}/91: ${item.originalTitle}`);

  // 1. Gerar Português se não existir
  let ptContent;
  if (!ptDone) {
    const promptPT = `Você é um pastor acolhedor, empático e excelente escritor com habilidade para falar com pessoas simples que nunca frequentaram uma igreja ou leram a Bíblia.
Sua missão é transformar um sermão bíblico expositivo em um artigo de reflexão prático, publicado sob o título da série "Para o Dia a Dia".

Diretrizes obrigatórias e rigorosas:
1. O artigo responde à pergunta de busca no Google: "${item.questions.pt}".
2. O corpo do texto DEVE conter rigorosamente entre 850 e 930 palavras (contando o corpo em Markdown após o frontmatter).
3. Inicie o texto com uma resposta DIRETA à pergunta, composta por 2 ou 3 frases claras, gentis e acolhedoras.
4. Utilize linguagem simples e acessível a alguém com escolaridade de ensino fundamental (sem jargões teológicos complicados, sem termos em grego/hebraico; termos bíblicos como graça ou redenção devem ser explicados de forma prática no cotidiano).
5. Use subtítulos claros (### Subtítulo) e parágrafos curtos (3 a 5 linhas).
6. Tom pessoal e caloroso, como uma conversa franca olho no olho com alguém tomando um café.
7. Mantenha os pontos bíblicos principais e as passagens das Escrituras abordadas no sermão original (${passage}), explicando-as como narrativas práticas da vida real.
8. Elimine todos os comentários locais de púlpito (anúncios, saudações da igreja, avisos, eventos).
9. Conclua com um "Próximo passo prático" claro, realista e imediato para o leitor aplicar hoje na rotina dele.
10. Forneça no frontmatter um subtítulo (subtitle) de 1 frase resumindo a resposta e trazendo acolhimento.

Retorne APENAS o conteúdo em formato Markdown, com o frontmatter TOML delimitado por +++:
+++
title = "${item.questions.pt.replace(/"/g, '\\"')}"
subtitle = "Frase acolhedora de uma linha resumindo a resposta."
date = "${item.date || "2026-10-18"}"
draft = false
lang = "pt"
tags = ["reflexao", "vida-diaria", "fe", "paz"]
categorias = ["Reflexões", "Para o Dia a Dia"]
sermonSlug = "${item.slug}"
passage = "${passage}"
image = "${sermon.data.image || `/images/posts/${item.slug}.webp`}"
+++

(corpo do artigo aqui)

Sermão original para base:
Título: ${sermon.data.title}
Data: ${sermon.data.date}
Texto Bíblico e Conteúdo:
${sermonBody.slice(0, 14000)}
`;

    const raw = await callLLM(key, promptPT);
    ptContent = await ensureStrictWordCount(raw, "pt", key);
    await fs.writeFile(path.join(contentReflexoesDir, ptFilename), ptContent, "utf8");
    const words = countWords(ptContent);
    console.log(`  ✓ PT salvo: ${ptFilename} (${words} palavras)`);
    await new Promise((r) => setTimeout(r, 600));
  } else {
    ptContent = await fs.readFile(path.join(contentReflexoesDir, ptFilename), "utf8");
  }

  // 2. Gerar Inglês se não existir
  if (!enDone) {
    const promptEN = `Translate and adapt the following Portuguese reflection article into natural, conversational, warm, fluent English for everyday readers (elementary reading level).
Google Search Title: "${item.questions.en}"

Strict Requirements:
1. The markdown body text MUST be strictly between 850 and 930 words (strictly within 800 and 1,000 words).
2. Keep the 2-3 sentence direct answer opening, simple vocabulary, short paragraphs (3-5 lines), clear subheadings (### Subheading), and practical next step.
3. Retain the frontmatter in TOML format:
+++
title = "${item.questions.en.replace(/"/g, '\\"')}"
subtitle = "Warm one-sentence summary subtitle."
date = "${item.date || "2026-10-18"}"
draft = false
lang = "en"
tags = ["reflection", "daily-life", "faith", "peace"]
categorias = ["Reflections", "Daily Life"]
sermonSlug = "${item.slug}"
passage = "${passage}"
image = "${sermon.data.image || `/images/posts/${item.slug}.webp`}"
+++

Return ONLY the complete markdown file (frontmatter + body).

Original Portuguese reflection article:
${ptContent}
`;

    const raw = await callLLM(key, promptEN);
    const enContent = await ensureStrictWordCount(raw, "en", key);
    await fs.writeFile(path.join(contentReflexoesDir, enFilename), enContent, "utf8");
    const words = countWords(enContent);
    console.log(`  ✓ EN salvo: ${enFilename} (${words} palavras)`);
    await new Promise((r) => setTimeout(r, 600));
  }

  // 3. Gerar Espanhol se não existir
  if (!esDone) {
    const promptES = `Traduzca y adapte el siguiente artículo de reflexión en portugués a un español natural, conversacional, cálido y fluido para lectores cotidianos (nivel de lectura escolar básico).
Título de búsqueda de Google: "${item.questions.es}"

Requisitos estrictos de longitud y formato:
1. En español los conectivos y frases tienden a alargarse, por lo tanto sea MUY CONCISO, directo y evite redundancias.
2. El cuerpo del texto DEBE tener exactamente entre 850 y 920 palabras (bajo ninguna circunstancia supere las 950 palabras).
3. Mantenga la respuesta directa inicial de 2-3 oraciones, vocabulario sencillo, párrafos cortos (3-5 líneas), subtítulos claros (### Subtítulo) y el paso práctico final.
4. Conserve el frontmatter en formato TOML:
+++
title = "${item.questions.es.replace(/"/g, '\\"')}"
subtitle = "Frase de una línea cálida resumiendo la respuesta práctica."
date = "${item.date || "2026-10-18"}"
draft = false
lang = "es"
tags = ["reflexion", "vida-diaria", "fe", "paz"]
categorias = ["Reflexiones", "Para el Día a Día"]
sermonSlug = "${item.slug}"
passage = "${passage}"
image = "${sermon.data.image || `/images/posts/${item.slug}.webp`}"
+++

Devuelva ÚNICAMENTE el archivo markdown completo (frontmatter + cuerpo).

Artículo original de reflexión en portugués:
${ptContent}
`;

    const raw = await callLLM(key, promptES);
    const esContent = await ensureStrictWordCount(raw, "es", key);
    await fs.writeFile(path.join(contentReflexoesDir, esFilename), esContent, "utf8");
    const words = countWords(esContent);
    console.log(`  ✓ ES salvo: ${esFilename} (${words} palavras)`);
    await new Promise((r) => setTimeout(r, 600));
  }

  return true;
}

export async function generateAllReflections({ apiKey, concurrency, maxCount = 999 } = {}) {
  const key = apiKey || process.env.GEMINI_API_KEY || "agy";
  const defaultConc = (key && key !== "agy") ? 3 : 1;
  const conc = concurrency || defaultConc;

  await fs.mkdir(contentReflexoesDir, { recursive: true });

  let questions = [];
  try {
    const raw = await fs.readFile(questionsPath, "utf8");
    questions = JSON.parse(raw);
  } catch (err) {
    console.error("Erro ao ler sermonQuestions.json:", err.message);
    return;
  }

  const pending = questions.filter((item) => {
    const ptSlug = toSlug(item.questions.pt);
    const enSlug = toSlug(item.questions.en);
    const esSlug = toSlug(item.questions.es);

    return (
      !isExistingValid(`${ptSlug}.md`) ||
      !isExistingValid(`${enSlug}.md`) ||
      !isExistingValid(`${esSlug}.md`)
    );
  });

  console.log(`\n==================================================`);
  console.log(`🚀 PIPELINE DE GERAÇÃO DE REFLEXÕES "PARA O DIA A DIA"`);
  console.log(`Motor: ${key === "agy" ? "Google Antigravity CLI (agy local)" : "Gemini API direta"}`);
  console.log(`Total de sermões no catálogo: ${questions.length}`);
  console.log(`Sermões já concluídos (3 idiomas): ${questions.length - pending.length}`);
  console.log(`Sermões pendentes: ${pending.length}`);
  console.log(`Concorrência: ${conc} | Limite deste lote: ${maxCount}`);
  console.log(`==================================================\n`);

  const toProcess = pending.slice(0, maxCount);
  let currentIndex = 0;
  let completedCount = 0;

  async function worker(workerId) {
    while (currentIndex < toProcess.length) {
      const idx = currentIndex++;
      const item = toProcess[idx];
      try {
        const generated = await processSermon(item, key);
        if (generated) {
          completedCount++;
          console.log(`  [Progresso] ${completedCount}/${toProcess.length} sermões concluídos neste lote.`);
        }
      } catch (err) {
        console.error(`[erro worker ${workerId}] Falha no sermão #${item.index} (${item.slug}):`, err.message);
      }
    }
  }

  const workers = Array.from({ length: conc }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  console.log(`\n========================================`);
  console.log(`Lote finalizado! ${completedCount} novos sermões processados com sucesso.`);
  console.log(`Atualizando build de conteúdo e índice de busca...`);
  try {
    execSync("npm run build:content", { stdio: "inherit" });
    execSync("npm run build:search-index", { stdio: "inherit" });
    console.log(`Build e índice de busca atualizados com sucesso!`);
  } catch (e) {
    console.warn(`Aviso no pós-build:`, e.message);
  }
  console.log(`========================================\n`);
}

if (process.argv[1]?.endsWith("generate-reflections.mjs")) {
  const apiKey = process.argv[2] || process.env.GEMINI_API_KEY || "agy";
  const max = process.argv[3] ? parseInt(process.argv[3], 10) : 999;
  const conc = process.argv[4] ? parseInt(process.argv[4], 10) : (apiKey === "agy" ? 1 : 2);
  generateAllReflections({ apiKey, maxCount: max, concurrency: conc }).catch(console.error);
}
