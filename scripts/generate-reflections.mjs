import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseToml } from "toml";

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

async function callGemini(apiKey, systemInstruction, userPrompt) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 3500
      }
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No text returned by Gemini");
  }
  return text.trim();
}

export async function generateAllReflections({ apiKey, maxCount = 999 } = {}) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY não fornecida. Passe como argumento ou variável de ambiente.");
  }

  await fs.mkdir(contentReflexoesDir, { recursive: true });

  // Load sermon questions mapping
  let questions = [];
  try {
    const raw = await fs.readFile(questionsPath, "utf8");
    questions = JSON.parse(raw);
  } catch {
    console.error("Arquivo sermonQuestions.json não encontrado.");
    return;
  }

  const existingFiles = new Set(await fs.readdir(contentReflexoesDir));

  let processedCount = 0;

  for (const item of questions) {
    if (processedCount >= maxCount) break;

    const sermonFilePath = path.join(contentPostsDir, `${item.slug}.md`);
    let sermonRaw;
    try {
      sermonRaw = await fs.readFile(sermonFilePath, "utf8");
    } catch {
      continue;
    }

    const sermon = parseFrontmatter(sermonRaw);
    const sermonBody = stripShortcodes(sermon.content);

    const ptSlug = item.questions.pt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const enSlug = item.questions.en
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const esSlug = item.questions.es
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const ptFilename = `${ptSlug}.md`;
    const enFilename = `${enSlug}.md`;
    const esFilename = `${esSlug}.md`;

    // Skip if all three exist
    if (
      existingFiles.has(ptFilename) &&
      existingFiles.has(enFilename) &&
      existingFiles.has(esFilename)
    ) {
      console.log(`[skip] ${item.slug} já possui artigos gerados nos 3 idiomas.`);
      continue;
    }

    console.log(`\n[gerando] ${item.index}/91: ${item.originalTitle}`);

    const systemPromptPT = `Você é um pastor acolhedor, empático e excelente escritor com habilidade para falar com pessoas simples que nunca frequentaram uma igreja ou leram a Bíblia.
Sua missão é transformar um sermão bíblico expositivo em um artigo de reflexão prático, publicado sob o título da série "Para o Dia a Dia".

Diretrizes obrigatórias:
1. O artigo responde à pergunta de busca no Google: "${item.questions.pt}".
2. O texto DEVE ter entre 800 e 1.000 palavras.
3. Inicie o texto com uma resposta DIRETA à pergunta, composta por 2 ou 3 frases claras e acolhedoras.
4. Utilize linguagem simples e acessível a alguém com escolaridade de ensino fundamental.
5. Use subtítulos claros (## Subtítulo) e parágrafos curtos (3 a 5 linhas).
6. Tom pessoal e caloroso, como uma conversa franca olho no olho com alguém tomando um café.
7. Mantenha os pontos bíblicos principais e as passagens das Escrituras abordadas no sermão original, explicando-os de forma simples.
8. Elimine todos os comentários locais de púlpito (anúncios, saudações da igreja, eventos).
9. Conclua com um "Próximo passo prático" claro, realista e imediato para o leitor aplicar hoje.
10. Forneça também um subtítulo curto (subtitle) de 1 frase resumindo a resposta.

Retorne APENAS o conteúdo em formato Markdown, com o frontmatter TOML no topo:
+++
title = "${item.questions.pt}"
subtitle = "Frase curta de resposta e acolhimento."
date = "${item.date || "2026-10-18"}"
draft = false
lang = "pt"
tags = ["reflexao", "vida-diaria", "fe"]
categorias = ["Reflexões", "Para o Dia a Dia"]
sermonSlug = "${item.slug}"
image = "${sermon.data.image || ""}"
+++

(corpo do artigo aqui)
`;

    const userPromptPT = `Sermão original para base:
Título: ${sermon.data.title}
Data: ${sermon.data.date}
Texto Bíblico e Conteúdo:
${sermonBody.slice(0, 14000)}
`;

    try {
      // 1. Gerar Português se não existir
      let ptContent;
      if (!existingFiles.has(ptFilename)) {
        ptContent = await callGemini(key, systemPromptPT, userPromptPT);
        await fs.writeFile(path.join(contentReflexoesDir, ptFilename), ptContent, "utf8");
        existingFiles.add(ptFilename);
        console.log(`  ✓ PT gerado: ${ptFilename}`);
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        ptContent = await fs.readFile(path.join(contentReflexoesDir, ptFilename), "utf8");
      }

      // 2. Gerar Inglês
      if (!existingFiles.has(enFilename)) {
        const systemPromptEN = `Translate and adapt the following Portuguese reflection article into natural, conversational, fluent English for everyday readers.
Title: "${item.questions.en}"
Ensure the article is strictly between 800 and 1,000 words.
Keep the 2-3 sentence direct answer opening, simple vocabulary, short paragraphs, clear subheadings, and practical next step.
Retain frontmatter with lang = "en", categories = ["Reflections", "Daily Life"].
Return ONLY the markdown file.`;

        const enContent = await callGemini(key, systemPromptEN, ptContent);
        await fs.writeFile(path.join(contentReflexoesDir, enFilename), enContent, "utf8");
        existingFiles.add(enFilename);
        console.log(`  ✓ EN gerado: ${enFilename}`);
        await new Promise((r) => setTimeout(r, 1000));
      }

      // 3. Gerar Espanhol
      if (!existingFiles.has(esFilename)) {
        const systemPromptES = `Traduzca y adapte el siguiente artículo de reflexión en portugués a un español natural, conversacional, cálido y fluido para lectores comunes.
Título: "${item.questions.es}"
Asegúrese de que el artículo tenga estrictamente entre 800 y 1.000 palabras.
Mantenga la respuesta directa inicial de 2-3 oraciones, vocabulario sencillo, párrafos cortos, subtítulos claros y el paso práctico final.
Mantenga el frontmatter con lang = "es", categorias = ["Reflexiones", "Para el Día a Día"].
Devuelva ÚNICAMENTE el archivo markdown.`;

        const esContent = await callGemini(key, systemPromptES, ptContent);
        await fs.writeFile(path.join(contentReflexoesDir, esFilename), esContent, "utf8");
        existingFiles.add(esFilename);
        console.log(`  ✓ ES gerado: ${esFilename}`);
        await new Promise((r) => setTimeout(r, 1000));
      }

      processedCount++;
    } catch (err) {
      console.error(`Erro ao processar ${item.slug}:`, err.message);
    }
  }

  console.log(`\nConcluído! ${processedCount} sermões processados nos 3 idiomas.`);
}

if (process.argv[1]?.endsWith("generate-reflections.mjs")) {
  const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;
  const max = process.argv[3] ? parseInt(process.argv[3], 10) : 999;
  generateAllReflections({ apiKey, maxCount: max }).catch(console.error);
}
