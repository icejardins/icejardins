import { google } from "googleapis";

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
        privateKey: parsed.private_key ? parsed.private_key.replace(/\\n/g, "\n") : undefined,
        projectId: parsed.project_id
      };
    } catch (e: any) {
      console.warn("[api/tts] Failed to parse service account JSON:", e.message);
    }
  }

  const clientEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_CLIENT_EMAIL ||
    process.env.GMAIL_CLIENT_EMAIL;

  let privateKey =
    process.env.GOOGLE_PRIVATE_KEY ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GMAIL_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  return {
    clientEmail,
    privateKey,
    projectId: process.env.GOOGLE_PROJECT_ID
  };
}

// Configurações das melhores vozes neurais masculinas para narração pastoral/podcast
const VOICE_MAP: Record<
  string,
  { languageCode: string; name: string; ssmlGender: string; pitch: number; rate: number }
> = {
  pt: {
    languageCode: "pt-BR",
    name: "pt-BR-Neural2-B", // Voz masculina profunda e cadenciada, excelente para sermões
    ssmlGender: "MALE",
    pitch: -1.0,
    rate: 0.96
  },
  en: {
    languageCode: "en-US",
    name: "en-US-Journey-D", // Voz natural Journey, tom solene de narração
    ssmlGender: "MALE",
    pitch: -0.5,
    rate: 0.95
  },
  es: {
    languageCode: "es-US",
    name: "es-US-Journey-F", // Voz Journey masculina em espanhol
    ssmlGender: "MALE",
    pitch: -0.5,
    rate: 0.95
  }
};

function splitTextIntoChunks(text: string, maxBytes: number = 4200): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (Buffer.byteLength(currentChunk + "\n\n" + trimmed, "utf8") <= maxBytes) {
      currentChunk = currentChunk ? `${currentChunk}\n\n${trimmed}` : trimmed;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      if (Buffer.byteLength(trimmed, "utf8") <= maxBytes) {
        currentChunk = trimmed;
      } else {
        // Se um único parágrafo for muito longo, quebra por frases
        const sentences = trimmed.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [trimmed];
        for (const sentence of sentences) {
          if (Buffer.byteLength(currentChunk + " " + sentence, "utf8") <= maxBytes) {
            currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          }
        }
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
  }

  try {
    const text = req.method === "POST" ? req.body?.text : req.query?.text;
    const lang = (req.method === "POST" ? req.body?.lang : req.query?.lang) || "pt";
    const download = (req.method === "POST" ? req.body?.download : req.query?.download) === "true";
    const filename =
      (req.method === "POST" ? req.body?.filename : req.query?.filename) || `podcast-${lang}.mp3`;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Texto para narração é obrigatório." });
    }

    const credentials = getServiceAccountCredentials();
    if (!credentials.clientEmail || !credentials.privateKey) {
      return res.status(500).json({
        error: "Credenciais Google Cloud Service Account não configuradas no ambiente do servidor."
      });
    }

    const voiceConfig = VOICE_MAP[lang] || VOICE_MAP.pt;

    const jwtClient = new google.auth.JWT({
      email: credentials.clientEmail,
      key: credentials.privateKey,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"]
    });

    const tokenResponse = await jwtClient.getAccessToken();
    const accessToken = tokenResponse.token;
    if (!accessToken) {
      throw new Error("Falha ao obter token OAuth2 do Google Cloud.");
    }

    const chunks = splitTextIntoChunks(text);
    const audioBuffers: Buffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const ttsResponse = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          input: { text: chunk },
          voice: {
            languageCode: voiceConfig.languageCode,
            name: voiceConfig.name,
            ssmlGender: voiceConfig.ssmlGender
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: voiceConfig.rate,
            pitch: voiceConfig.pitch,
            sampleRateHertz: 24000
          }
        })
      });

      if (!ttsResponse.ok) {
        const errBody = await ttsResponse.text();
        console.error(`[api/tts] Chunk ${i + 1}/${chunks.length} failed:`, errBody);

        // Fallback para voz padrão caso Neural2/Journey específica falhe
        if (voiceConfig.name.includes("Journey") || voiceConfig.name.includes("Neural2")) {
          const fallbackVoice =
            lang === "pt"
              ? "pt-BR-Wavenet-B"
              : lang === "es"
              ? "es-US-Wavenet-B"
              : "en-US-Wavenet-D";
          const retryRes = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
              input: { text: chunk },
              voice: {
                languageCode: voiceConfig.languageCode,
                name: fallbackVoice,
                ssmlGender: voiceConfig.ssmlGender
              },
              audioConfig: {
                audioEncoding: "MP3",
                speakingRate: voiceConfig.rate,
                pitch: voiceConfig.pitch,
                sampleRateHertz: 24000
              }
            })
          });

          if (retryRes.ok) {
            const retryData = (await retryRes.json()) as { audioContent: string };
            audioBuffers.push(Buffer.from(retryData.audioContent, "base64"));
            continue;
          }
        }

        throw new Error(
          `Google Cloud TTS retornou status ${ttsResponse.status}: ${errBody.slice(0, 200)}`
        );
      }

      const ttsData = (await ttsResponse.json()) as { audioContent: string };
      audioBuffers.push(Buffer.from(ttsData.audioContent, "base64"));
    }

    const fullAudioBuffer = Buffer.concat(audioBuffers);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", fullAudioBuffer.length);
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");

    if (download) {
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    }

    return res.status(200).send(fullAudioBuffer);
  } catch (err: any) {
    console.error("[api/tts] Fatal error in TTS handler:", err);
    return res.status(500).json({
      error: "Falha na geração do áudio do podcast.",
      details: err?.message || String(err)
    });
  }
}
