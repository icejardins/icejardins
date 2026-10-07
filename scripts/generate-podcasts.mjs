import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseToml } from "toml";
import { google } from "googleapis";

const rootDir = process.cwd();
const contentPostsDir = path.join(rootDir, "content", "posts");
const outputDir = path.join(rootDir, "static", "audio", "podcasts");

const GENESIS_SLUGS = [
  "genesis-1-1-antes-de-tudo-deus",
  "genesis-2-1-3-o-descanso-que-ainda-nos-espera",
  "genesis-2-4-25-a-vida-como-deus-a-planejou",
  "genesis-3-1-8-a-promessa-que-termina-em-fuga-e-vergonha"
];

const VOICE_MAP = {
  pt: {
    languageCode: "pt-BR",
    name: "pt-BR-Neural2-B",
    ssmlGender: "MALE",
    rate: 0.96,
    pitch: -1.0
  },
  en: {
    languageCode: "en-US",
    name: "en-US-Journey-D",
    ssmlGender: "MALE",
    rate: 0.95,
    pitch: -0.5
  },
  es: {
    languageCode: "es-US",
    name: "es-US-Journey-F",
    ssmlGender: "MALE",
    rate: 0.95,
    pitch: -0.5
  }
};

function getServiceAccountCredentials() {
  const jsonEnv =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT ||
    process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ||
    process.env.GCP_SERVICE_ACCOUNT;

  if (jsonEnv) {
    try {
      const trimmed = jsonEnv.trim();
      const parsed = JSON.parse(
        trimmed.startsWith("{") ? trimmed : Buffer.from(trimmed, "base64").toString("utf8")
      );
      return {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key ? parsed.private_key.replace(/\\n/g, "\n") : undefined
      };
    } catch {}
  }

  const clientEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey =
    process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  return { clientEmail, privateKey };
}

function cleanMarkdownToPlainText(content) {
  return content
    .replace(/^#+\s+(.+)$/gm, "$1.")
    .replace(/^>\s*(?:\*\*\d+\*\*)?\s*(.+)$/gm, "$1.")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\{\{<[^>]+>\}\}/g, "")
    .replace(/[-*]\s+/g, "")
    .replace(/---+/g, "")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

function parseFrontmatter(rawContent) {
  const withoutBom = rawContent.replace(/^\uFEFF/, "").trimStart();
  if (withoutBom.startsWith("+++")) {
    const match = withoutBom.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?/);
    if (match) {
      return {
        data: parseToml(match[1]),
        content: withoutBom.slice(match[0].length)
      };
    }
  }
  return matter(withoutBom);
}

function splitTextIntoChunks(text, maxBytes = 4200) {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (Buffer.byteLength(current + "\n\n" + trimmed, "utf8") <= maxBytes) {
      current = current ? `${current}\n\n${trimmed}` : trimmed;
    } else {
      if (current) {
        chunks.push(current);
        current = "";
      }
      if (Buffer.byteLength(trimmed, "utf8") <= maxBytes) {
        current = trimmed;
      } else {
        const sentences = trimmed.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [trimmed];
        for (const sentence of sentences) {
          if (Buffer.byteLength(current + " " + sentence, "utf8") <= maxBytes) {
            current = current ? `${current} ${sentence}` : sentence;
          } else {
            if (current) chunks.push(current);
            current = sentence;
          }
        }
      }
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function synthesizeText(text, lang, accessToken) {
  const voice = VOICE_MAP[lang] || VOICE_MAP.pt;
  const chunks = splitTextIntoChunks(text);
  const audioBuffers = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const res = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        input: { text: chunk },
        voice: {
          languageCode: voice.languageCode,
          name: voice.name,
          ssmlGender: voice.ssmlGender
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: voice.rate,
          pitch: voice.pitch,
          sampleRateHertz: 24000
        }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`TTS error (${res.status}): ${err}`);
    }

    const data = await res.json();
    audioBuffers.push(Buffer.from(data.audioContent, "base64"));
  }

  return Buffer.concat(audioBuffers);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const credentials = getServiceAccountCredentials();
  if (!credentials.clientEmail || !credentials.privateKey) {
    console.error("Credenciais Google Service Account não encontradas nas variáveis de ambiente.");
    console.error("Configure GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_SERVICE_ACCOUNT para gerar os áudios localmente.");
    console.error("Alternativamente, o endpoint /api/tts em produção pode ser utilizado.");
    process.exit(1);
  }

  console.log("Autenticando no Google Cloud com a Service Account...");
  const jwt = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"]
  });

  const tokenRes = await jwt.getAccessToken();
  const accessToken = tokenRes.token;

  for (const slug of GENESIS_SLUGS) {
    const postFile = path.join(contentPostsDir, `${slug}.md`);
    let raw;
    try {
      raw = await fs.readFile(postFile, "utf8");
    } catch {
      console.warn(`Arquivo não encontrado para slug: ${slug}`);
      continue;
    }

    const parsed = parseFrontmatter(raw);
    const plainText = cleanMarkdownToPlainText(parsed.content);
    const title = parsed.data.title || slug;
    const subtitle = parsed.data.subtitle || "";

    const introText = `Igreja Cristã Evangélica Jardins apresenta: ${title}. ${subtitle}. Mensagem bíblica ministrada pelo Pastor Davi Ribeiro.`;
    const outroText = `Você ouviu a mensagem ${title}, da Igreja Cristã Evangélica Jardins em Brasília. Conheça mais em icejardins.org.br.`;

    const fullScriptPt = `${introText}\n\n${plainText}\n\n${outroText}`;

    console.log(`Gerando podcast em português para: ${slug}...`);
    try {
      const audioBufferPt = await synthesizeText(fullScriptPt, "pt", accessToken);
      const targetFilePt = path.join(outputDir, `${slug}-pt.mp3`);
      await fs.writeFile(targetFilePt, audioBufferPt);
      console.log(`✓ Gravado: ${targetFilePt} (${(audioBufferPt.length / 1024 / 1024).toFixed(2)} MB)`);
    } catch (e) {
      console.error(`Erro ao gerar ${slug} (pt):`, e.message);
    }
  }

  console.log("Concluído!");
}

main().catch(console.error);
