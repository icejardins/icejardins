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
        privateKey: parsed.private_key,
        projectId: parsed.project_id
      };
    } catch (e: any) {
      console.warn("[api/translate] Failed to parse service account JSON:", e.message);
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

async function translateWithGoogleCloud(
  texts: string[],
  targetLang: string,
  sourceLang: string = "pt",
  format: "html" | "text" = "html"
): Promise<string[]> {
  const credentials = getServiceAccountCredentials();

  if (!credentials.clientEmail || !credentials.privateKey) {
    throw new Error(
      `Credenciais da conta de serviço não encontradas. (email: ${!!credentials.clientEmail}, key: ${!!credentials.privateKey})`
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.clientEmail,
      private_key: credentials.privateKey
    },
    projectId: credentials.projectId,
    scopes: [
      "https://www.googleapis.com/auth/cloud-translation",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  });

  const translate = google.translate({ version: "v2", auth });

  const response = await translate.translations.translate({
    requestBody: {
      q: texts,
      target: targetLang,
      source: sourceLang,
      format
    }
  });

  const translations = response.data?.translations;
  if (!translations || !Array.isArray(translations)) {
    throw new Error("Resposta inválida da Google Cloud Translation API");
  }

  return translations.map((t) => t.translatedText || "");
}

async function translateWithPublicFallback(
  text: string,
  targetLang: string,
  sourceLang: string = "pt"
): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    sourceLang
  )}&tl=${encodeURIComponent(targetLang)}&dt=t`;

  const upstreamRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: `q=${encodeURIComponent(text)}`
  });

  if (!upstreamRes.ok) {
    throw new Error(`Fallback público retornou HTTP ${upstreamRes.status}`);
  }

  const data = await upstreamRes.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Resposta inválida do serviço público de tradução");
  }

  return data[0].map((item: any) => (Array.isArray(item) ? item[0] : "")).join("");
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const {
      text,
      texts,
      targetLang = "es",
      sourceLang = "pt",
      format = "html"
    } = body || {};

    if (targetLang !== "en" && targetLang !== "es") {
      return res.status(400).json({ error: "targetLang deve ser 'en' ou 'es'" });
    }

    const inputList: string[] = Array.isArray(texts)
      ? texts
      : typeof text === "string"
      ? [text]
      : [];

    if (inputList.length === 0) {
      return res.status(400).json({ error: "Forneça 'text' (string) ou 'texts' (array de strings)" });
    }

    let translatedList: string[];
    let lastError: Error | null = null;

    // 1. Primário: Google Cloud Translation API oficial via Conta de Serviço
    try {
      translatedList = await translateWithGoogleCloud(inputList, targetLang, sourceLang, format);
    } catch (gcloudErr: any) {
      console.warn(`[api/translate] Cloud Translation API falhou: ${gcloudErr.message}`);
      lastError = gcloudErr;

      // 2. Fallback secundário
      try {
        translatedList = await Promise.all(
          inputList.map((item) => translateWithPublicFallback(item, targetLang, sourceLang))
        );
      } catch (fallbackErr: any) {
        console.warn(`[api/translate] Fallback público também falhou: ${fallbackErr.message}`);
        return res.status(500).json({
          error: "Falha na tradução",
          gcloudError: lastError?.message || String(lastError),
          fallbackError: fallbackErr?.message || String(fallbackErr)
        });
      }
    }

    // Cache no Edge CDN por 24h
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");

    if (typeof text === "string" && !Array.isArray(texts)) {
      return res.status(200).json({ translatedText: translatedList[0] || "" });
    }

    return res.status(200).json({ translations: translatedList });
  } catch (err: any) {
    console.error("[api/translate] Erro fatal:", err);
    return res.status(500).json({
      error: "Erro interno no serviço de tradução",
      details: err?.message || String(err)
    });
  }
}
